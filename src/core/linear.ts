export type Matrix = number[][];
export function assertVector(v: readonly number[]): void {
  if (!v.length || v.length > 64 || v.some((x) => !Number.isFinite(x)))
    throw new Error('Vecteur fini de 1 à 64 composantes requis.');
}
export function shape(a: Matrix): [number, number] {
  if (!a.length || a.length > 64 || !a[0]?.length || a[0].length > 64)
    throw new Error('Matrice non vide, dimensions limitées à 64.');
  const columns = a[0].length;
  if (a.some((row) => row.length !== columns)) throw new Error('Matrice rectangulaire requise.');
  a.forEach(assertVector);
  return [a.length, columns];
}
export function dot(a: readonly number[], b: readonly number[]): number {
  assertVector(a);
  assertVector(b);
  if (a.length !== b.length) throw new Error('Dimensions vectorielles incompatibles.');
  const result = a.reduce((sum, x, i) => sum + x * b[i]!, 0);
  if (!Number.isFinite(result)) throw new Error('Débordement numérique.');
  return result;
}
/** Undefined at zero norm: deliberately distinct from PyTorch epsilon regularization. */
export function cosine(a: readonly number[], b: readonly number[]): number | null {
  assertVector(a);
  assertVector(b);
  if (a.length !== b.length) throw new Error('Dimensions vectorielles incompatibles.');
  const na = Math.hypot(...a),
    nb = Math.hypot(...b);
  if (!na || !nb) return null;
  if (!Number.isFinite(na) || !Number.isFinite(nb))
    throw new Error('Norme hors capacité numérique.');
  return Math.max(
    -1,
    Math.min(
      1,
      dot(
        a.map((x) => x / na),
        b.map((x) => x / nb),
      ),
    ),
  );
}
export function transpose(a: Matrix): Matrix {
  const [rows, columns] = shape(a);
  return Array.from({ length: columns }, (_, j) =>
    Array.from({ length: rows }, (_, i) => a[i]![j]!),
  );
}
export function matmul(a: Matrix, b: Matrix): Matrix {
  const [rows, inner] = shape(a),
    [other, columns] = shape(b);
  if (inner !== other) throw new Error('Produit impossible : les dimensions internes diffèrent.');
  const bt = transpose(b);
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: columns }, (_, j) => dot(a[i]!, bt[j]!)),
  );
}
export function add(a: Matrix, b: Matrix): Matrix {
  const sa = shape(a),
    sb = shape(b);
  if (sa[0] !== sb[0] || sa[1] !== sb[1]) throw new Error('Addition : formes identiques requises.');
  return a.map((row, i) =>
    row.map((x, j) => {
      const result = x + b[i]![j]!;
      if (!Number.isFinite(result)) throw new Error('Débordement numérique.');
      return result;
    }),
  );
}
export function layerNorm(a: Matrix, epsilon = 1e-5): Matrix {
  shape(a);
  if (!Number.isFinite(epsilon) || epsilon <= 0)
    throw new Error('Epsilon strictement positif requis.');
  return a.map((row) => {
    const mean = row.reduce((s, x) => s + x, 0) / row.length;
    const variance = row.reduce((s, x) => s + (x - mean) ** 2, 0) / row.length;
    if (!Number.isFinite(mean) || !Number.isFinite(variance))
      throw new Error('Débordement numérique.');
    return row.map((x) => (x - mean) / Math.sqrt(variance + epsilon));
  });
}
export interface GradientStep {
  step: number;
  weight: number;
  loss: number;
  gradient: number;
}
export function gradientDescent(
  initial: number,
  rate: number,
  steps: number,
  target = 2,
): GradientStep[] {
  if (
    ![initial, rate, target].every(Number.isFinite) ||
    rate < 0 ||
    !Number.isInteger(steps) ||
    steps < 0 ||
    steps > 100
  )
    throw new Error('Paramètres de descente invalides.');
  const history: GradientStep[] = [];
  let weight = initial;
  for (let step = 0; step <= steps; step++) {
    const loss = (weight - target) ** 2,
      gradient = 2 * (weight - target);
    if (![weight, loss, gradient].every(Number.isFinite))
      throw new Error('Descente hors capacité numérique.');
    history.push({ step, weight, loss, gradient });
    weight -= rate * gradient;
  }
  return history;
}
