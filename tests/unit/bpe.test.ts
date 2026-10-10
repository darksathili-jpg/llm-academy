import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CORPUS,
  countPairs,
  encodeBpe,
  mergeTokens,
  tokenCount,
  trainBpe,
} from '../../src/core/bpe';
describe('BPE miniature', () => {
  it('compte les occurrences pondérées et apprend la paire attendue', () => {
    const states = trainBpe(DEFAULT_CORPUS);
    expect(states[0]!.pairs[0]).toEqual({ pair: ['l', 'a'], count: 3 });
    expect(tokenCount(states[0]!)).toBe(10);
    expect(states[1]!.merges).toEqual([['l', 'a']]);
    expect(tokenCount(states[1]!)).toBe(7);
    expect(states[1]!.replacements).toBe(3);
    expect(states[1]!.words.find((w) => w.text === 'lama')!.tokens).toEqual(['la', 'm', 'a']);
  });
  it('recalcule les comptes sur la nouvelle segmentation', () => {
    const states = trainBpe(DEFAULT_CORPUS, 2);
    expect(states[1]!.pairs[0]).toEqual({ pair: ['la', 'c'], count: 2 });
    expect(states[2]!.words[0]!.tokens).toEqual(['lac']);
    expect(tokenCount(states[2]!)).toBe(5);
  });
  it('applique les règles à un texte sans apprendre de nouveau', () => {
    const state = trainBpe(DEFAULT_CORPUS, 1)[1]!;
    const before = JSON.stringify(state);
    expect(
      encodeBpe('lama lac', state)
        .filter((t) => t.id !== null)
        .map((t) => t.text),
    ).toEqual(['la', 'm', 'a', 'la', 'c']);
    expect(JSON.stringify(state)).toBe(before);
  });
  it('conserve les espaces et signale les inconnus', () => {
    const state = trainBpe(DEFAULT_CORPUS, 1)[1]!;
    const result = encodeBpe('la  z\n', state);
    expect(result.map((t) => t.original).join('')).toBe('la  z\n');
    expect(result.filter((t) => t.unknown)).toEqual([
      { text: '[UNK]', id: 0, unknown: true, original: 'z' },
    ]);
    expect(result.filter((t) => t.id === null).map((t) => t.text)).toEqual(['  ', '\n']);
  });
  it('donne des IDs stables par état et réserve 0', () => {
    const state = trainBpe(DEFAULT_CORPUS, 1)[1]!;
    expect(encodeBpe('la', state)[0]!.id).toBe(5);
    expect(encodeBpe('z', state)[0]!.id).toBe(0);
  });
  it('traite les points de code Unicode, emoji inclus', () => {
    const state = trainBpe('é😀 é😀', 0)[0]!;
    expect(state.words[0]!.tokens).toEqual(['é', '😀']);
    expect(encodeBpe('é😀', state).filter((t) => t.unknown)).toHaveLength(0);
  });
  it('distingue comptes chevauchants et remplacements réels', () => {
    const states = trainBpe('aaa', 1);
    expect(states[0]!.pairs[0]!.count).toBe(2);
    expect(states[1]!.replacements).toBe(1);
    expect(states[1]!.words[0]!.tokens).toEqual(['aa', 'a']);
  });
  it('fusionne sans chevauchement', () =>
    expect(mergeTokens(['a', 'a', 'a', 'a'], ['a', 'a'])).toEqual(['aa', 'aa']));
  it('départage les égalités de manière déterministe', () => {
    const state = trainBpe('ba ab', 1)[1]!;
    expect(state.merges).toEqual([['a', 'b']]);
    expect(trainBpe('ab ba', 1)[1]!.merges).toEqual(state.merges);
  });
  it('ne fusionne pas entre des mots', () => {
    const states = trainBpe('a b', 10);
    expect(states).toHaveLength(1);
    expect(states[0]!.pairs).toEqual([]);
  });
  it('ne modifie pas les états antérieurs', () => {
    const initial = trainBpe(DEFAULT_CORPUS, 0)[0]!;
    expect(trainBpe(DEFAULT_CORPUS, 12)[0]).toEqual(initial);
  });
  it('gère le corpus vide et le texte de test vide', () => {
    const states = trainBpe('  ', 12);
    expect(states).toHaveLength(1);
    expect(encodeBpe('', states[0]!)).toEqual([]);
    expect(encodeBpe('z', states[0]!)[0]!.unknown).toBe(true);
  });
  it('bornes de calcul', () => {
    expect(() => trainBpe('a'.repeat(2001))).toThrow();
    expect(() => trainBpe('x', 51)).toThrow();
    expect(() => trainBpe('x', -1)).toThrow();
    expect(() => trainBpe('x', 0.5)).toThrow();
    expect(() => trainBpe('a\u0000b')).toThrow();
  });
  it('effectue des comptes exacts sur mots répétés', () =>
    expect(countPairs([{ text: 'xy', frequency: 7, tokens: ['x', 'y'] }])[0]!.count).toBe(7));
  it('conserve le texte et un budget décroissant sur plusieurs corpus', () => {
    for (const corpus of [
      'banane banane bananier',
      'été été étés',
      '😀😀 😀!',
      'aaa aaaaa',
      'ab, ab!',
    ]) {
      const states = trainBpe(corpus, 12);
      states.forEach((state, i) => {
        expect(
          encodeBpe(corpus, state)
            .map((t) => t.original)
            .join(''),
        ).toBe(corpus);
        if (i) expect(tokenCount(state)).toBeLessThan(tokenCount(states[i - 1]!));
      });
    }
  });
});
