import { describe, expect, it } from 'vitest';
import {
  add,
  cosine,
  dot,
  gradientDescent,
  layerNorm,
  matmul,
  shape,
  transpose,
} from '../../src/core/linear';
describe('Algèbre et géométrie de référence', () => {
  it('calcule un produit scalaire indépendamment des normes', () =>
    expect(dot([1, 2, 0], [2, 1, 0])).toBe(4));
  it('calcule une matrice de référence ligne par colonne', () =>
    expect(
      matmul(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [2, 0],
          [1, 2],
        ],
      ),
    ).toEqual([
      [4, 4],
      [10, 8],
    ]));
  it('calcule une projection rectangulaire', () =>
    expect(matmul([[1, 2, 3]], [[1], [2], [3]])).toEqual([[14]]));
  it('transpose sans muter la matrice', () => {
    const a = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    expect(transpose(a)).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
    expect(a).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });
  it.each([
    { a: [], b: [[1]] },
    { a: [[1, 2], [3]], b: [[1], [2]] },
    { a: [[1, 2]], b: [[1, 2]] },
    { a: [[NaN]], b: [[1]] },
    { a: [[Infinity]], b: [[1]] },
  ])('refuse les formes/valeurs invalides $a', ({ a, b }) => expect(() => matmul(a, b)).toThrow());
  it('refuse des vecteurs incompatibles et un overflow', () => {
    expect(() => dot([1], [1, 2])).toThrow();
    expect(() => dot([1e308], [1e308])).toThrow();
    expect(() => cosine([], [1])).toThrow();
    expect(() => cosine([1], [1, 2])).toThrow();
  });
  it('normalise la direction sans perdre la distinction du vecteur nul', () => {
    expect(cosine([1, 0], [2, 0])).toBe(1);
    expect(cosine([1, 0], [-2, 0])).toBe(-1);
    expect(cosine([1, 0], [0, 2])).toBe(0);
    expect(cosine([0, 0], [1, 0])).toBeNull();
  });
  it('démontre le piège de projection', () => {
    expect(cosine([1, 0, 2], [1, 0, -2])).toBeCloseTo(-0.6, 14);
    expect(cosine([1, 0], [1, 0])).toBe(1);
  });
  it('calcule le cosinus stable de grandes valeurs finies', () =>
    expect(cosine([1e200, 1e200], [1e200, 1e200])).toBeCloseTo(1, 14));
  it('normalise par ligne, variance population et epsilon', () => {
    const result = layerNorm([
      [1, 3],
      [5, 5],
    ]);
    expect(result[0]![0]).toBeCloseTo(-1 / Math.sqrt(1 + 1e-5), 14);
    expect(result[0]![1]).toBeCloseTo(1 / Math.sqrt(1 + 1e-5), 14);
    expect(result[1]).toEqual([0, 0]);
  });
  it('refuse epsilon invalide et additions de formes différentes', () => {
    expect(() => layerNorm([[1, 2]], 0)).toThrow();
    expect(() => add([[1]], [[1, 2]])).toThrow();
    expect(add([[1, 2]], [[3, 4]])).toEqual([[4, 6]]);
    expect(
      shape([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([2, 2]);
  });
});
describe('Descente de gradient réelle', () => {
  it('première mise à jour w=.8, perte=1.44, gradient=-2.4', () => {
    const history = gradientDescent(0, 0.2, 1);
    expect(history[0]).toEqual({ step: 0, weight: 0, loss: 4, gradient: -4 });
    expect(history[1]!.weight).toBeCloseTo(0.8, 14);
    expect(history[1]!.loss).toBeCloseTo(1.44, 14);
    expect(history[1]!.gradient).toBeCloseTo(-2.4, 14);
  });
  it('compare le gradient à une différence finie indépendante', () => {
    for (const w of [-3, 0, 0.5, 2, 4]) {
      const epsilon = 1e-5;
      const numerical = ((w + epsilon - 2) ** 2 - (w - epsilon - 2) ** 2) / (2 * epsilon);
      expect(gradientDescent(w, 0.2, 0)[0]!.gradient).toBeCloseTo(numerical, 8);
    }
  });
  it('converge, oscille et diverge selon le taux', () => {
    const converging = gradientDescent(0, 0.2, 10);
    expect(converging.at(-1)!.loss).toBeLessThan(0.001);
    expect(gradientDescent(0, 1, 4).map((s) => s.weight)).toEqual([0, 4, 0, 4, 0]);
    expect(gradientDescent(0, 1, 4).every((s) => s.loss === 4)).toBe(true);
    expect(gradientDescent(0, 1.1, 4).at(-1)!.loss).toBeGreaterThan(4);
  });
  it('gère taux nul et minimum exact', () => {
    expect(gradientDescent(0, 0, 2).map((s) => s.loss)).toEqual([4, 4, 4]);
    expect(gradientDescent(2, 1.1, 12).every((s) => s.loss === 0)).toBe(true);
  });
  it('rejette les paramètres hors domaine', () => {
    expect(() => gradientDescent(NaN, 0.2, 2)).toThrow();
    expect(() => gradientDescent(0, -1, 2)).toThrow();
    expect(() => gradientDescent(0, 0.2, 101)).toThrow();
    expect(() => gradientDescent(0, 0.2, 1.5)).toThrow();
  });
});
