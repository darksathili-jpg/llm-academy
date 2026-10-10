import { softmax } from './math';
import { matmul, shape, transpose, type Matrix } from './linear';
export interface AttentionResult {
  scores: Matrix;
  maskedScores: Matrix;
  weights: Matrix;
  output: Matrix;
}
export function scaledAttention(q: Matrix, k: Matrix, v: Matrix, causal = true): AttentionResult {
  const [nq, dk] = shape(q),
    [nk, other] = shape(k),
    [nv] = shape(v);
  if (dk !== other || nk !== nv)
    throw new Error('Q/K doivent partager d_k et K/V le nombre de positions.');
  if (causal && nq !== nk)
    throw new Error('Cette expérience causale requiert des séquences de même longueur.');
  const scores = matmul(q, transpose(k)).map((row) => row.map((x) => x / Math.sqrt(dk)));
  const maskedScores = scores.map((row, i) => row.map((x, j) => (causal && j > i ? -Infinity : x)));
  const weights = scores.map((row, i) => {
    const allowed = softmax(causal ? row.slice(0, i + 1) : row);
    return row.map((_x, j) => allowed[j] ?? 0);
  });
  return { scores, maskedScores, weights, output: matmul(weights, v) };
}
