import { describe, it, expect } from 'vitest';
import {
  filteredDistribution,
  DEFAULT_SAMPLING,
  seededRandom,
  sample,
  generate,
} from '../../src/core/generation';
import {
  initialize,
  makeCorpus,
  TRAIN_TEXT,
  VALID_TEXT,
  gradients,
  loss,
  trainStep,
  initializeAdapter,
  adapterGradients,
  adaptStep,
  shiftedWindow,
} from '../../src/core/training';
describe('sampling calculé', () => {
  it('filtre K puis noyau P, conserve la masse et les égalités déterministes', () => {
    const d = filteredDistribution([2, 1, 0, -1], { temperature: 1, topK: 2, topP: 0.8 });
    expect(d.kept).toEqual([0, 1]);
    expect(d.probabilities.reduce((s, p) => s + p, 0)).toBeCloseTo(1, 14);
    expect(d.probabilities[2]).toBe(0);
    expect(filteredDistribution([0, 0, 0], { temperature: 1, topK: 1, topP: 1 }).kept).toEqual([0]);
  });
  it('graines reproductibles, sans tirage sur une masse nulle', () => {
    const a = seededRandom(7),
      b = seededRandom(7);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
    expect(sample([0, 1, 0], 0)).toBe(1);
    expect(sample([0, 1, 0], 0.999)).toBe(1);
  });
  it('EOS arrête vraiment la génération', () =>
    expect(generate([0], 8, 7, DEFAULT_SAMPLING, () => [-1000, 0], 1)).toHaveLength(1));
  it.each([0, NaN, Infinity, -1])('rejette température %s', (temperature) =>
    expect(() => filteredDistribution([1, 0], { ...DEFAULT_SAMPLING, temperature })).toThrow(),
  );
  it('rejette distribution, graine et IDs corrompus', () => {
    expect(() => sample([0.1, 0.1], 0.2)).toThrow();
    expect(() => seededRandom(-1)).toThrow();
    expect(() => generate([2], 1, 7, DEFAULT_SAMPLING, () => [0, 0])).toThrow();
  });
});
describe('apprentissage neural bigramme et adaptation', () => {
  const corpus = makeCorpus(TRAIN_TEXT, VALID_TEXT);
  it('cibles décalées et aucune paire entre documents', () => {
    expect(shiftedWindow([0, 1, 2, 3], 0, 3)).toEqual({ inputs: [0, 1, 2], targets: [1, 2, 3] });
    expect(corpus.train.filter((p) => p.input === corpus.eos)).toHaveLength(0);
    expect(() => makeCorpus('école école', 'inconnu')).toThrow();
    expect(makeCorpus('école e\u0301cole', 'école').vocabulary).toHaveLength(3);
  });
  it('tous les gradients E/W concordent avec les différences finies, L2 comprise', () => {
    const m = initialize(corpus.vocabulary.length, 2),
      g = gradients(m, corpus.train, 0.03),
      eps = 1e-5;
    const objective = () => gradients(m, corpus.train, 0.03).objective;
    for (const key of ['embedding', 'projection'] as const)
      m[key].forEach((row, i) =>
        row.forEach((x, j) => {
          m[key][i][j] = x + eps;
          const plus = objective();
          m[key][i][j] = x - eps;
          const minus = objective();
          m[key][i][j] = x;
          expect(g[key][i][j]).toBeCloseTo((plus - minus) / (2 * eps), 7);
        }),
      );
  });
  it('la perte baisse et la mise à jour ne mute pas le modèle initial', () => {
    const base = initialize(corpus.vocabulary.length),
      snapshot = JSON.stringify(base);
    let m = base;
    const before = loss(m, corpus.train);
    for (let i = 0; i < 100; i++) m = trainStep(m, corpus.train, 0.8).model;
    expect(loss(m, corpus.train)).toBeLessThan(before * 0.6);
    expect(JSON.stringify(base)).toBe(snapshot);
  });
  it('gradients A/B numériques, base figée exactement', () => {
    const m = initialize(corpus.vocabulary.length),
      a = initializeAdapter(m, 2);
    a.b = a.b.map((r) => r.map(() => 0.1));
    const g = adapterGradients(m, a, corpus.train),
      eps = 1e-5;
    for (const key of ['a', 'b'] as const)
      a[key].forEach((row, i) =>
        row.forEach((x, j) => {
          a[key][i][j] = x + eps;
          const plus = loss(m, corpus.train, a);
          a[key][i][j] = x - eps;
          const minus = loss(m, corpus.train, a);
          a[key][i][j] = x;
          expect(g[key][i][j]).toBeCloseTo((plus - minus) / (2 * eps), 7);
        }),
      );
    const snapshot = JSON.stringify(m);
    adaptStep(m, a, corpus.train, 0.8);
    expect(JSON.stringify(m)).toBe(snapshot);
  });
  it('refuse corpus énorme, taux nul et marqueurs réservés', () => {
    expect(() => makeCorpus('a'.repeat(2001), 'a')).toThrow();
    expect(() => makeCorpus('<fin>', 'a')).toThrow();
    expect(() =>
      trainStep(initialize(3), [{ input: 0, target: 1, document: 0, position: 0 }], 0),
    ).toThrow();
  });
});
