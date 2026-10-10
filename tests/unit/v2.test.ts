import { it, expect } from 'vitest';
import { activities } from '../../src/content/activities';
import { scenarios } from '../../src/content/scenarios';
import { emptyProgress, parseProgress } from '../../src/core/progress';
import { emptyInvestigation, parseInvestigations } from '../../src/core/investigation';
it('dix fiches complètes, choix correct et huit étapes bornées', () => {
  expect(activities).toHaveLength(10);
  for (const a of activities) {
    for (const field of [
      'question',
      'audience',
      'prerequisites',
      'goal',
      'notions',
      'instruction',
      'manipulation',
      'observation',
      'science',
      'errors',
      'correction',
      'transfer',
      'deeper',
      'python',
    ] as const)
      expect(a[field].length).toBeGreaterThan(10);
    expect(a.hints).toHaveLength(3);
    expect(a.quiz.choices[a.quiz.expected]).toBeTruthy();
  }
  expect(() => parseInvestigations({ tokens: { ...emptyInvestigation(), stage: 8 } })).toThrow();
});
it('scénarios : minutes exactes, collectif, binômes, individuel et réponses préparées', () => {
  for (const s of scenarios) {
    expect(s.steps.reduce((n, x) => n + x.minutes, 0)).toBe(s.duration);
    expect(new Set(s.steps.map((x) => x.mode)).size).toBe(3);
    for (const x of s.steps) {
      expect(x.expected.length).toBeGreaterThan(10);
      expect(x.vigilance.length).toBeGreaterThan(10);
      expect(x.output.length).toBeGreaterThan(10);
    }
  }
});
it('migration 3 conserve réponses, notes et thème, ajoute investigations vides', () => {
  const old = { ...emptyProgress(), version: 3, theme: 'dark', answers: { 'm01-proba': '0.5' } };
  old.notes['09'] = 'Une trace LoRA';
  const p = parseProgress(JSON.stringify(old));
  expect(p.version).toBe(4);
  expect(p.notes['09']).toBe(old.notes['09']);
  expect(p.answers).toEqual(old.answers);
  expect(p.investigations).toEqual({});
});
it('investigations exportables ; script importé reste une chaîne, IDs inconnus rejetés', () => {
  const p = emptyProgress();
  p.investigations.tokens = {
    ...emptyInvestigation(),
    hypothesis: '<script>alert(1)</script>',
    stage: 7,
  };
  expect(parseProgress(JSON.stringify(p))).toEqual(p);
  expect(() => parseInvestigations({ unknown: emptyInvestigation() })).toThrow();
  expect(() =>
    parseProgress(
      JSON.stringify({
        ...p,
        investigations: { tokens: { ...p.investigations.tokens, observation: 'a'.repeat(4001) } },
      }),
    ),
  ).toThrow();
});

it('export/import de toutes les notes Unicode aux longueurs maximales autorisées', () => {
  const p = emptyProgress();
  for (const id of Object.keys(p.notes) as (keyof typeof p.notes)[])
    p.notes[id] = '😀'.repeat(5000);
  for (const a of activities)
    p.investigations[a.id] = {
      stage: 7,
      hypothesis: '😀'.repeat(2000),
      observation: '😀'.repeat(2000),
      explanation: '😀'.repeat(2000),
      transfer: '😀'.repeat(2000),
      answer: '1',
    };
  expect(parseProgress(JSON.stringify(p))).toEqual(p);
});
