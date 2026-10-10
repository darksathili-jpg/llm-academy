import { describe, expect, it } from 'vitest';
import {
  emptyProgress,
  loadProgress,
  moduleScore,
  parseProgress,
  STORAGE_KEY,
  saveProgress,
} from '../../src/core/progress';
describe('Migration du carnet phases A/B vers C', () => {
  const legacy = {
    version: 1,
    theme: 'dark',
    track: 'developer',
    answers: { 'm01-proba': '0,5', 'm02-frequency': '3' },
    notes: { '01': 'Preuve originale', '02': 'Deux corpus observés' },
  };
  it('conserve toutes les données et ajoute sept notes vides', () => {
    const p = parseProgress(JSON.stringify(legacy));
    expect(p.version).toBe(4);
    expect(p.answers).toEqual(legacy.answers);
    expect(p.theme).toBe('dark');
    expect(p.track).toBe('developer');
    expect(p.notes['01']).toBe(legacy.notes['01']);
    expect(p.notes['02']).toBe(legacy.notes['02']);
    for (const id of ['03', '04', '05', '06', '07', '08', '09'] as const) {
      expect(p.notes[id]).toBe('');
      expect(moduleScore(p, id).correct).toBe(0);
    }
  });
  it('migre à la lecture de la même clé locale et écrit le nouveau schéma', () => {
    let raw = JSON.stringify(legacy);
    const used: string[] = [];
    const storage = {
      getItem: (key: string) => {
        used.push(key);
        return raw;
      },
      setItem: (key: string, v: string) => {
        used.push(key);
        raw = v;
      },
    };
    const p = loadProgress(storage);
    expect(p.warning).toBe('');
    saveProgress(storage, p.progress);
    expect(JSON.parse(raw).version).toBe(4);
    expect(used).toEqual([STORAGE_KEY, STORAGE_KEY]);
  });
  it('réimporte un carnet de phase C avec réponses et notes des nouveaux modules', () => {
    const p = emptyProgress();
    p.notes['06'] = 'Les premières lignes ne changent pas.';
    p.answers['m05-average'] = '3';
    const again = parseProgress(JSON.stringify(p));
    expect(again).toEqual(p);
    expect(moduleScore(again, '05').correct).toBe(1);
  });
  it('rejette une version legacy qui cache des notes de modules inconnus', () =>
    expect(() =>
      parseProgress(JSON.stringify({ ...legacy, notes: { ...legacy.notes, '03': 'injection' } })),
    ).toThrow());
  it('refuse une réponse de module futur dans un schéma legacy', () =>
    expect(() =>
      parseProgress(
        JSON.stringify({ ...legacy, answers: { ...legacy.answers, 'm05-average': '3' } }),
      ),
    ).toThrow());
  it('rejette une version courante sans toutes les notes', () =>
    expect(() =>
      parseProgress(JSON.stringify({ ...emptyProgress(), notes: legacy.notes })),
    ).toThrow());
  it('compte la limite en octets Unicode, pas seulement en caractères', () => {
    const p = emptyProgress();
    p.notes['01'] = '😀'.repeat(4000);
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
    expect(() => parseProgress('😀'.repeat(130000))).toThrow();
  });
});
