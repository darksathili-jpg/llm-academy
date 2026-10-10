import { it, expect } from 'vitest';
import { chunkDocuments, retrieve } from '../../src/core/rag';
import { freshSession, parseSession, toggle, elapsed } from '../../src/core/session';
it('TF-IDF : ordre réel, sources, Unicode et abstention', () => {
  const chunks = chunkDocuments(
    [
      { id: 'a', title: 'Jardin', text: 'École jardin jardin sol plantes eau' },
      { id: 'b', title: 'Ciel', text: 'Une étoile émet de la lumière' },
    ],
    5,
    1,
  );
  const r = retrieve(chunks, 'e\u0301cole jardin');
  expect(r.ranked[0].chunk.document).toBe('a');
  expect(r.ranked[0].score).toBeGreaterThan(0);
  expect(r.answer).toContain('[a:0]');
  expect(retrieve(chunks, 'xyzzz').ranked).toEqual([]);
});
it('découpage borné et chevauchement effectif', () => {
  const chunks = chunkDocuments([{ id: 'a', title: 'A', text: '1 2 3 4 5 6 7 8' }], 5, 2);
  expect(chunks.map((c) => [c.start, c.end])).toEqual([
    [0, 5],
    [3, 8],
  ]);
  expect(() => chunkDocuments([], 5, 5)).toThrow();
  expect(() => retrieve(chunks, 'a', 0)).toThrow();
});
it('chronomètre : pause/reprise avec timestamps, reload sans dérive', () => {
  let c = toggle({ elapsed: 0, started: null }, 1000);
  expect(elapsed(c, 6000)).toBe(5000);
  c = toggle(c, 6000);
  expect(elapsed(c, 9000)).toBe(5000);
  c = toggle(c, 9000);
  expect(elapsed(c, 10000)).toBe(6000);
});
it('séance : liste blanche sans aucune note privée', () => {
  const session = freshSession(120);
  expect(
    parseSession(
      JSON.stringify({
        ...session,
        privateNotes: 'SECRET',
        sessionClock: { ...session.sessionClock, secret: 'SECRET' },
      }),
    ),
  ).toEqual(session);
  expect(() => parseSession(JSON.stringify({ ...session, zoom: 1000 }))).toThrow();
  expect(() => parseSession('{}')).toThrow();
});
