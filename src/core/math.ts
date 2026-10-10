/** Educational numeric engines: no neural model or learned weights. */
export function softmax(logits: readonly number[]): number[] {
  if (!logits.length || logits.some((x) => !Number.isFinite(x)))
    throw new Error('Logits finis requis.');
  const max = Math.max(...logits);
  const exp = logits.map((x) => Math.exp(x - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map((x) => x / sum);
}
export function crossEntropy(logits: readonly number[], target: number): number {
  if (!Number.isInteger(target) || target < 0 || target >= logits.length)
    throw new Error('Cible invalide.');
  softmax(logits);
  const max = Math.max(...logits);
  return max - logits[target]! + Math.log(logits.reduce((s, x) => s + Math.exp(x - max), 0));
}
export function sequenceProbability(probabilities: readonly number[]): number {
  if (probabilities.some((p) => !Number.isFinite(p) || p < 0 || p > 1))
    throw new Error('Probabilité hors de [0,1].');
  return probabilities.reduce((a, b) => a * b, 1);
}
