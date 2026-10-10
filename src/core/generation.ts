import { softmax } from './math';
import { assertVector } from './linear';
export interface SamplingOptions {
  temperature: number;
  topK: number;
  topP: number;
}
export const DEFAULT_SAMPLING: SamplingOptions = { temperature: 1, topK: 0, topP: 1 };
export function filteredDistribution(logits: readonly number[], options: SamplingOptions) {
  assertVector(logits);
  const { temperature, topK, topP } = options;
  if (
    !Number.isFinite(temperature) ||
    temperature < 0.05 ||
    temperature > 10 ||
    !Number.isInteger(topK) ||
    topK < 0 ||
    topK > logits.length ||
    !Number.isFinite(topP) ||
    topP <= 0 ||
    topP > 1
  )
    throw new Error('Paramètres de sampling invalides.');
  const base = softmax(logits.map((x) => x / temperature));
  const order = base.map((p, id) => ({ id, p })).sort((a, b) => b.p - a.p || a.id - b.id);
  const candidates = order.slice(0, topK || order.length);
  const kMass = candidates.reduce((s, x) => s + x.p, 0);
  const afterK = base.map((_p, id) =>
    candidates.some((x) => x.id === id) ? base[id]! / kMass : 0,
  );
  const kept: number[] = [];
  let cumulative = 0;
  for (const x of candidates) {
    kept.push(x.id);
    cumulative += afterK[x.id]!;
    if (cumulative >= topP - 1e-12) break;
  }
  const mass = kept.reduce((s, id) => s + afterK[id]!, 0);
  const probabilities = afterK.map((p, id) => (kept.includes(id) ? p / mass : 0));
  return {
    base,
    afterK,
    probabilities,
    kept,
    entropy: -probabilities.reduce((s, p) => s + (p ? p * Math.log(p) : 0), 0),
  };
}
export function seededRandom(seed: number): () => number {
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295)
    throw new Error('Graine entière entre 0 et 2³²−1 requise.');
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
export function sample(probabilities: readonly number[], draw: number): number {
  assertVector(probabilities);
  const sum = probabilities.reduce((s, p) => s + p, 0);
  if (
    probabilities.some((p) => p < 0) ||
    Math.abs(sum - 1) > 1e-8 ||
    !Number.isFinite(draw) ||
    draw < 0 ||
    draw >= 1
  )
    throw new Error('Distribution ou tirage invalide.');
  let cumulative = 0,
    last = -1;
  for (let i = 0; i < probabilities.length; i++) {
    if (probabilities[i]! > 0) last = i;
    cumulative += probabilities[i]!;
    if (draw < cumulative && probabilities[i]! > 0) return i;
  }
  return last;
}
export interface GenerationStep {
  context: number[];
  logits: number[];
  probabilities: number[];
  draw: number;
  token: number;
}
export function generate(
  prompt: readonly number[],
  count: number,
  seed: number,
  options: SamplingOptions,
  forward: (context: number[]) => number[],
  eos?: number,
): GenerationStep[] {
  if (
    !prompt.length ||
    prompt.some((x) => !Number.isInteger(x) || x < 0) ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > 32
  )
    throw new Error('Séquence de génération invalide.');
  const random = seededRandom(seed),
    context = [...prompt],
    trace: GenerationStep[] = [];
  for (let i = 0; i < count; i++) {
    const logits = forward([...context]),
      { probabilities } = filteredDistribution(logits, options);
    if (context.some((id) => id >= logits.length))
      throw new Error('ID de contexte hors vocabulaire.');
    const draw = random(),
      token = sample(probabilities, draw);
    trace.push({ context: [...context], logits, probabilities, draw, token });
    context.push(token);
    if (token === eos) break;
  }
  return trace;
}
