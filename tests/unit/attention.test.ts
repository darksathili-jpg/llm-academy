import { describe, expect, it } from 'vitest';
import { scaledAttention } from '../../src/core/attention';
describe('Attention : calculs et causalité', () => {
  it('calcule la distribution de référence non causale', () => {
    const result = scaledAttention(
      [[1, 0]],
      [
        [1, 0],
        [0, 1],
      ],
      [[2], [4]],
      false,
    );
    const p = 1 / (1 + Math.exp(-1 / Math.sqrt(2)));
    expect(result.scores[0]).toEqual([1 / Math.sqrt(2), 0]);
    expect(result.weights[0]![0]).toBeCloseTo(p, 14);
    expect(result.output[0]![0]).toBeCloseTo(2 * p + 4 * (1 - p), 14);
  });
  it('donne une moyenne uniforme pour queries nulles', () => {
    const result = scaledAttention([[0], [0]], [[1], [2]], [[2], [4]], false);
    expect(result.weights).toEqual([
      [0.5, 0.5],
      [0.5, 0.5],
    ]);
    expect(result.output).toEqual([[3], [3]]);
  });
  it('masque avant softmax, diagonale incluse et zéros exacts', () => {
    const result = scaledAttention([[0], [0], [0]], [[0], [0], [0]], [[1], [2], [3]]);
    expect(result.weights[0]).toEqual([1, 0, 0]);
    expect(result.weights[1]).toEqual([0.5, 0.5, 0]);
    result.weights.forEach((row) => expect(row.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 14));
    expect(result.maskedScores[0]![1]).toBe(-Infinity);
    expect(result.output[1]![0]).toBe(1.5);
  });
  it('changing future K and V does not affect earlier causal outputs', () => {
    const q = [
        [1, 0],
        [0, 1],
        [1, 1],
      ],
      k = [
        [1, 0],
        [0, 1],
        [1, 1],
      ],
      v = [
        [1, 0],
        [0, 2],
        [3, 1],
      ];
    const base = scaledAttention(q, k, v);
    const altered = scaledAttention(
      q,
      [
        [1, 0],
        [0, 1],
        [-3, 2],
      ],
      [
        [1, 0],
        [0, 2],
        [-4, 4],
      ],
    );
    expect(altered.output.slice(0, 2)).toEqual(base.output.slice(0, 2));
  });
  it('V influence les sorties mais jamais les poids à Q/K fixes', () => {
    const q = [[1], [2]],
      k = [[1], [2]];
    const a = scaledAttention(q, k, [[1], [2]], false),
      b = scaledAttention(q, k, [[4], [3]], false);
    expect(a.weights).toEqual(b.weights);
    expect(a.output).not.toEqual(b.output);
  });
  it('reste stable pour de grands scores', () => {
    const result = scaledAttention([[10000], [10000]], [[10000], [9999]], [[2], [4]], false);
    expect(result.weights[0]).toEqual([1, 0]);
    expect(result.output[0]).toEqual([2]);
  });
  it('vérifie les dimensions Q/K/V et le domaine du masque', () => {
    expect(() => scaledAttention([[1, 2]], [[1]], [[1]])).toThrow();
    expect(() => scaledAttention([[1]], [[1], [2]], [[1]])).toThrow();
    expect(() => scaledAttention([[1]], [[1], [2]], [[1], [2]], true)).toThrow();
  });
  it('deux têtes scalaires ont leurs propres scores', () => {
    const h0 = scaledAttention([[1], [0]], [[1], [0]], [[1], [0]], false),
      h1 = scaledAttention([[0], [1]], [[0], [1]], [[0], [2]], false);
    expect(h0.output[0]![0]).toBeCloseTo(1 / (1 + Math.exp(-1)), 14);
    expect(h1.output[0]![0]).toBe(1);
  });
});
