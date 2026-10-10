import { describe, expect, it } from 'vitest';
import { MINI_VOCABULARY, miniForward, positionalEncoding } from '../../src/core/transformer';
const options = { width: 4, heads: 2, positions: true, causal: true, residual: true };
describe('Transformer calculé', () => {
  it('positions sin/cos de référence', () => {
    const p = positionalEncoding(2, 4);
    expect(p[0]).toEqual([0, 1, 0, 1]);
    expect(p[1]![0]).toBeCloseTo(Math.sin(1), 14);
    expect(p[1]![1]).toBeCloseTo(Math.cos(1), 14);
    expect(p[1]![2]).toBeCloseTo(Math.sin(0.01), 14);
    expect(p[1]![3]).toBeCloseTo(Math.cos(0.01), 14);
  });
  it('formes réelles de tout le passage', () => {
    const forward = miniForward([0, 1, 2], options);
    expect(forward.stages).toHaveLength(16);
    expect(forward.heads).toHaveLength(2);
    expect(forward.heads[0]!.output[0]).toHaveLength(2);
    expect(forward.stages.find((s) => s.name === 'Expansion + ReLU')!.matrix[0]).toHaveLength(8);
    expect(forward.stages.at(-1)!.matrix[0]).toHaveLength(MINI_VOCABULARY.length);
    forward.stages.forEach((s) => expect(s.matrix).toHaveLength(3));
    expect(forward.probabilities.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 14);
  });
  it('ne laisse pas le futur contaminer les logits antérieurs', () => {
    const a = miniForward([0, 1, 2], options),
      b = miniForward([0, 1, 5], options);
    expect(a.stages.at(-1)!.matrix.slice(0, 2)).toEqual(b.stages.at(-1)!.matrix.slice(0, 2));
    expect(a.stages.at(-1)!.matrix[2]).not.toEqual(b.stages.at(-1)!.matrix[2]);
  });
  it('montre une fuite future sans masque', () => {
    const a = miniForward([0, 1, 2], { ...options, causal: false }),
      b = miniForward([0, 1, 5], { ...options, causal: false });
    expect(a.stages.at(-1)!.matrix[0]).not.toEqual(b.stages.at(-1)!.matrix[0]);
  });
  it('causalité préservée pour chaque configuration autorisée', () => {
    for (const width of [2, 4, 8])
      for (const heads of [1, 2, 4].filter((h) => h <= width))
        for (const positions of [true, false])
          for (const residual of [true, false]) {
            const opt = { width, heads, positions, residual, causal: true };
            const a = miniForward([1, 2, 3], opt),
              b = miniForward([1, 2, 5], opt);
            expect(a.stages.at(-1)!.matrix.slice(0, 2)).toEqual(
              b.stages.at(-1)!.matrix.slice(0, 2),
            );
            expect(a.probabilities.every((p) => Number.isFinite(p) && p >= 0 && p <= 1)).toBe(true);
          }
  });
  it('résidu = entrée + branche calculée', () => {
    const f = miniForward([0, 1, 2], options);
    const input = f.stages[2]!.matrix,
      projection = f.stages[8]!.matrix,
      residue = f.stages[9]!.matrix;
    input.forEach((row, i) =>
      row.forEach((x, j) => expect(residue[i]![j]).toBe(x + projection[i]![j]!)),
    );
  });
  it('ablation des positions : ajout d’une matrice nulle', () => {
    const f = miniForward([0, 1, 2], { ...options, positions: false });
    expect(f.stages[1]!.matrix.flat().every((x) => x === 0)).toBe(true);
    expect(f.stages[0]!.matrix).toEqual(f.stages[2]!.matrix);
  });
  it('ablation des résidus : branche seule et changement mesuré', () => {
    const f = miniForward([0, 1, 2], { ...options, residual: false });
    expect(f.stages[8]!.matrix).toEqual(f.stages[9]!.matrix);
    expect(f.probabilities).not.toEqual(miniForward([0, 1, 2], options).probabilities);
  });
  it('poids déterministes, paramètres vérifiables et aucune mutation', () => {
    const ids = [0, 1, 2];
    const a = miniForward(ids, options);
    expect(a.parameters.E![0]![0]).toBe(-0.5);
    expect(miniForward(ids, options)).toEqual(a);
    expect(ids).toEqual([0, 1, 2]);
  });
  it('refuse les formes/IDs invalides', () => {
    expect(() => miniForward([], options)).toThrow();
    expect(() => miniForward([6], options)).toThrow();
    expect(() => miniForward([1.5], options)).toThrow();
    expect(() => miniForward([0], { ...options, width: 3 })).toThrow();
    expect(() => miniForward([0], { ...options, heads: 3 })).toThrow();
    expect(() => positionalEncoding(2, 3)).toThrow();
  });
});
