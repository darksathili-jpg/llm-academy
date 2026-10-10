import { describe, it, expect } from 'vitest';
import { CHANCES, counts, chooseWord, freshDemo, parseDemo, STEPS } from '../../src/core/demo';
describe('démonstrateur : choix réels et notes préservées', () => {
  it('normalise le jeu préparé et choisit chaque intervalle, y compris les frontières', () => {
    expect(CHANCES).toEqual([0.6, 0.3, 0.1]);
    expect(CHANCES.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 14);
    expect([0, 0.599999, 0.6, 0.899999, 0.9, 0.999999].map((r) => chooseWord(r).token)).toEqual([
      0, 0, 1, 1, 2, 2,
    ]);
    expect(() => chooseWord(1)).toThrow();
    expect(() => chooseWord(-0.1)).toThrow();
    expect(() => chooseWord(NaN)).toThrow();
  });
  it('compte les résultats observés sans les convertir en chances théoriques', () => {
    expect(counts([chooseWord(0.8), chooseWord(0.95), chooseWord(0.75)])).toEqual([0, 2, 1]);
    expect(counts([])).toEqual([0, 0, 0]);
    expect(STEPS).toHaveLength(5);
  });
  it('conserve les textes Unicode, filtre les champs inconnus et refuse un résultat inventé', () => {
    const session = {
      ...freshDemo(),
      step: 3,
      hypothesis: 'école 😀 <script>',
      observation: 'un résultat',
      attempts: [chooseWord(0.7)],
    };
    expect(parseDemo(JSON.stringify({ ...session, privateNotes: 'secret' }))).toEqual(session);
    expect(() =>
      parseDemo(JSON.stringify({ ...session, attempts: [{ draw: 0.7, token: 0 }] })),
    ).toThrow();
  });
  it('borne les traces et refuse les formats corrompus sans modifier le stockage', () => {
    for (const patch of [
      { version: 2 },
      { step: 5 },
      { hypothesis: 'a'.repeat(2001) },
      { attempts: Array(101).fill(chooseWord(0.5)) },
      { oral: 'oui' },
    ])
      expect(() => parseDemo(JSON.stringify({ ...freshDemo(), ...patch }))).toThrow();
    expect(() => parseDemo('{corrompu')).toThrow();
  });
});
