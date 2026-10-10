import { sample } from './generation';
export const DEMO_KEY = 'llm-academy.experience01.v1';
export const WORDS = ['canapé', 'tapis', 'bureau'] as const;
export const PREFERENCES = [6, 3, 1] as const;
const total = PREFERENCES.reduce((a, b) => a + b, 0);
export const CHANCES = PREFERENCES.map((w) => w / total);
export const STEPS = [
  'Une question',
  'Une hypothèse',
  'Une manipulation',
  'Une observation',
  'Une explication',
] as const;
export interface Attempt {
  draw: number;
  token: number;
}
export interface DemoSession {
  version: 1;
  step: number;
  hypothesis: string;
  observation: string;
  oral: boolean;
  attempts: Attempt[];
}
export function freshDemo(): DemoSession {
  return { version: 1, step: 0, hypothesis: '', observation: '', oral: false, attempts: [] };
}
export function chooseWord(draw: number): Attempt {
  return { draw, token: sample(CHANCES, draw) };
}
export function randomDraw() {
  const n = new Uint32Array(1);
  crypto.getRandomValues(n);
  return n[0]! / 4294967296;
}
export function counts(attempts: readonly Attempt[]) {
  return WORDS.map((_, id) => attempts.filter((x) => x.token === id).length);
}
export function parseDemo(raw: string): DemoSession {
  if (raw.length > 40000) throw Error('Notes trop volumineuses.');
  const x: unknown = JSON.parse(raw);
  if (!x || typeof x !== 'object' || Array.isArray(x)) throw Error('Notes illisibles.');
  const v = x as Record<string, unknown>;
  if (
    v.version !== 1 ||
    !Number.isInteger(v.step) ||
    (v.step as number) < 0 ||
    (v.step as number) > 4 ||
    typeof v.hypothesis !== 'string' ||
    v.hypothesis.length > 2000 ||
    typeof v.observation !== 'string' ||
    v.observation.length > 2000 ||
    typeof v.oral !== 'boolean' ||
    !Array.isArray(v.attempts) ||
    v.attempts.length > 100
  )
    throw Error('Format de notes non reconnu.');
  const attempts: Attempt[] = v.attempts.map((a: unknown) => {
    if (!a || typeof a !== 'object' || Array.isArray(a)) throw Error('Essai invalide.');
    const row = a as Record<string, unknown>;
    if (typeof row.draw !== 'number' || !Number.isInteger(row.token))
      throw Error('Essai invalide.');
    const real = chooseWord(row.draw);
    if (real.token !== row.token) throw Error('Résultat incohérent avec le tirage.');
    return real;
  });
  return {
    version: 1,
    step: v.step as number,
    hypothesis: v.hypothesis,
    observation: v.observation,
    oral: v.oral,
    attempts,
  };
}
export const PYTHON_DEMO = `from random import Random

mots = ["canapé", "tapis", "bureau"]
preferences = [6, 3, 1]  # Choisies pour cet exemple, pas apprises par une IA.
chances = [p / sum(preferences) for p in preferences]
hasard = Random(7)  # Permet de refaire les mêmes essais en Python.

def choisir(nombre):
    limite = 0.0
    for mot, chance in zip(mots, chances):
        limite += chance
        if nombre < limite:
            return mot
    return mots[-1]

compteurs = dict.fromkeys(mots, 0)
for _ in range(20):
    mot = choisir(hasard.random())
    compteurs[mot] += 1

print("Chances :", chances)
print("Sur 20 essais :", compteurs)
assert abs(sum(chances) - 1) < 1e-9
assert sum(compteurs.values()) == 20
assert choisir(0.0) == "canapé"
assert choisir(0.7) == "tapis"
assert choisir(0.95) == "bureau"
`;
