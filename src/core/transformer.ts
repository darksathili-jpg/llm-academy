import { add, layerNorm, matmul, shape, type Matrix } from './linear';
import { scaledAttention, type AttentionResult } from './attention';
import { softmax } from './math';
export const MINI_VOCABULARY = ['le', 'chat', 'observe', 'la', 'lune', 'fin'];
export interface TransformerOptions {
  width: number;
  heads: number;
  positions: boolean;
  causal: boolean;
  residual: boolean;
}
export interface Stage {
  name: string;
  matrix: Matrix;
  explanation: string;
}
export interface MiniForward {
  stages: Stage[];
  heads: AttentionResult[];
  probabilities: number[];
  parameters: Record<string, Matrix>;
}
/** Explicit deterministic construction. None of these weights are trained. */
export function demoWeights(rows: number, columns: number, seed: number): Matrix {
  if (
    !Number.isInteger(rows) ||
    !Number.isInteger(columns) ||
    rows < 1 ||
    columns < 1 ||
    rows > 64 ||
    columns > 64
  )
    throw new Error('Dimensions de poids invalides.');
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: columns }, (_, j) => ((((i + 1) * 7 + (j + 1) * 3 + seed) % 11) - 5) / 10),
  );
}
export function positionalEncoding(length: number, width: number): Matrix {
  if (
    !Number.isInteger(length) ||
    !Number.isInteger(width) ||
    length < 1 ||
    length > 64 ||
    width < 2 ||
    width > 64 ||
    width % 2
  )
    throw new Error('Dimensions positionnelles invalides.');
  return Array.from({ length }, (_, pos) =>
    Array.from({ length: width }, (_, j) => {
      const angle = pos / 10000 ** ((2 * Math.floor(j / 2)) / width);
      return j % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
    }),
  );
}
export function miniForward(ids: readonly number[], options: TransformerOptions): MiniForward {
  const { width: d, heads: h, positions, causal, residual } = options;
  if (![2, 4, 8].includes(d) || !Number.isInteger(h) || h < 1 || h > d || d % h)
    throw new Error('d_model doit être 2, 4 ou 8 et divisible par le nombre de têtes.');
  if (
    !ids.length ||
    ids.length > 6 ||
    ids.some((id) => !Number.isInteger(id) || id < 0 || id >= MINI_VOCABULARY.length)
  )
    throw new Error('Séquence miniature invalide.');
  const parameters: Record<string, Matrix> = {
    E: demoWeights(MINI_VOCABULARY.length, d, 1),
    Wq: demoWeights(d, d, 2),
    Wk: demoWeights(d, d, 5),
    Wv: demoWeights(d, d, 8),
    Wo: demoWeights(d, d, 10),
    W1: demoWeights(d, 2 * d, 3),
    W2: demoWeights(2 * d, d, 6),
    Wlogits: demoWeights(d, MINI_VOCABULARY.length, 4),
  };
  const embeddings = ids.map((id) => [...parameters.E![id]!]);
  const positional = positions
    ? positionalEncoding(ids.length, d)
    : ids.map(() => Array(d).fill(0) as number[]);
  const input = add(embeddings, positional),
    normalized = layerNorm(input);
  const q = matmul(normalized, parameters.Wq!),
    k = matmul(normalized, parameters.Wk!),
    v = matmul(normalized, parameters.Wv!);
  const dk = d / h;
  const heads = Array.from({ length: h }, (_, i) =>
    scaledAttention(
      q.map((row) => row.slice(i * dk, (i + 1) * dk)),
      k.map((row) => row.slice(i * dk, (i + 1) * dk)),
      v.map((row) => row.slice(i * dk, (i + 1) * dk)),
      causal,
    ),
  );
  const concat = ids.map((_id, i) => heads.flatMap((head) => head.output[i]!));
  const projected = matmul(concat, parameters.Wo!);
  const afterAttention = residual ? add(input, projected) : projected;
  const norm2 = layerNorm(afterAttention);
  const hidden = matmul(norm2, parameters.W1!).map((row) => row.map((x) => Math.max(0, x)));
  const feedForward = matmul(hidden, parameters.W2!);
  const afterFfn = residual ? add(afterAttention, feedForward) : feedForward;
  const final = layerNorm(afterFfn),
    logits = matmul(final, parameters.Wlogits!);
  const stages: Stage[] = [
    {
      name: 'Embeddings',
      matrix: embeddings,
      explanation: 'Sélection des lignes E correspondant aux ID.',
    },
    {
      name: 'Positions',
      matrix: positional,
      explanation: positions
        ? 'Codage sin/cos ajouté aux embeddings.'
        : 'Positions désactivées : matrice nulle.',
    },
    { name: 'Entrée X', matrix: input, explanation: 'X = embeddings + positions.' },
    {
      name: 'Normalisation 1',
      matrix: normalized,
      explanation: 'LayerNorm par position ; gamma = 1, beta = 0, epsilon = 10⁻⁵.',
    },
    {
      name: 'Queries Q',
      matrix: q,
      explanation: 'LN(X) Wq ; projections déterministes, non apprises.',
    },
    { name: 'Keys K', matrix: k, explanation: 'LN(X) Wk.' },
    { name: 'Values V', matrix: v, explanation: 'LN(X) Wv.' },
    {
      name: 'Concaténation des têtes',
      matrix: concat,
      explanation: 'Assemblage des sorties sur la dimension des caractéristiques.',
    },
    {
      name: 'Projection attention',
      matrix: projected,
      explanation: 'Concat(heads) Wo retrouve d_model.',
    },
    {
      name: 'Résidu attention',
      matrix: afterAttention,
      explanation: residual
        ? 'X + projection attention.'
        : 'Branche directe seule (résidu désactivé).',
    },
    {
      name: 'Normalisation 2',
      matrix: norm2,
      explanation: 'Normalisation avant le réseau positionnel.',
    },
    {
      name: 'Expansion + ReLU',
      matrix: hidden,
      explanation: 'ReLU(LN(résidu) W1) ; largeur interne 2 d_model, pas 4 dans cette miniature.',
    },
    {
      name: 'Sortie FFN',
      matrix: feedForward,
      explanation: 'Projection W2 vers d_model, sans mélange entre positions.',
    },
    {
      name: 'Résidu FFN',
      matrix: afterFfn,
      explanation: residual ? 'Ajout du chemin direct à la sortie FFN.' : 'Sortie FFN seule.',
    },
    {
      name: 'Normalisation finale',
      matrix: final,
      explanation: 'Dernière normalisation avant la projection du vocabulaire.',
    },
    {
      name: 'Logits',
      matrix: logits,
      explanation:
        'Projection sur les six tokens de démonstration ; aucune capacité linguistique apprise.',
    },
  ];
  stages.forEach((stage) => shape(stage.matrix));
  return { stages, heads, parameters, probabilities: softmax(logits.at(-1)!) };
}
