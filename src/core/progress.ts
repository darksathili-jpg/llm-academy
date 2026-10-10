import { exercises, isCorrect, MODULE_IDS, isModuleId, type ModuleId } from './exercises';
/** Preserve the legacy storage key: migration updates its content, never abandons a learner's data. */
export const STORAGE_KEY = 'llm-academy.progress.v1';
export const MAX_CARNET_BYTES = 500_000;
export type Theme = 'light' | 'dark' | 'projector';
export type Track = 'discovery' | 'developer';
export interface Progress {
  version: 3;
  theme: Theme;
  track: Track;
  answers: Record<string, string>;
  notes: Record<ModuleId, string>;
}
export function emptyProgress(): Progress {
  return {
    version: 3,
    theme: 'light',
    track: 'discovery',
    answers: {},
    notes: Object.fromEntries(MODULE_IDS.map((id) => [id, ''])) as Record<ModuleId, string>,
  };
}
export function parseProgress(raw: string): Progress {
  if (new TextEncoder().encode(raw).length > MAX_CARNET_BYTES)
    throw new Error('Fichier trop volumineux (500 Ko maximum).');
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Format de carnet invalide.');
  const v = value as Record<string, unknown>;
  if (v.version !== 1 && v.version !== 2 && v.version !== 3)
    throw new Error('Version de carnet non prise en charge.');
  if (
    typeof v.theme !== 'string' ||
    !['light', 'dark', 'projector'].includes(v.theme) ||
    typeof v.track !== 'string' ||
    !['discovery', 'developer'].includes(v.track)
  )
    throw new Error('Préférences invalides.');
  if (
    !v.answers ||
    typeof v.answers !== 'object' ||
    Array.isArray(v.answers) ||
    !v.notes ||
    typeof v.notes !== 'object' ||
    Array.isArray(v.notes)
  )
    throw new Error('Réponses ou notes invalides.');
  const required: readonly string[] =
    v.version === 1 ? ['01', '02'] : v.version === 2 ? MODULE_IDS.slice(0, 6) : MODULE_IDS;
  const answers: Record<string, string> = {};
  for (const [id, answer] of Object.entries(v.answers)) {
    if (
      !exercises.some((e) => e.id === id && required.includes(e.module)) ||
      typeof answer !== 'string' ||
      answer.length > 300
    )
      throw new Error('Réponse inconnue ou invalide.');
    answers[id] = answer;
  }
  const importedNotes = v.notes as Record<string, unknown>,
    notes = emptyProgress().notes;
  if (Object.keys(importedNotes).some((key) => !isModuleId(key) || !required.includes(key)))
    throw new Error('Notes inconnues.');
  for (const id of required) {
    const note = importedNotes[id];
    if (typeof note !== 'string' || note.length > 10000) throw new Error('Notes invalides.');
    notes[id as ModuleId] = note;
  }
  return { version: 3, theme: v.theme as Theme, track: v.track as Track, answers, notes };
}
export function moduleScore(
  progress: Progress,
  module: ModuleId,
): { correct: number; total: number } {
  const list = exercises.filter((e) => e.module === module);
  return {
    correct: list.filter((e) => isCorrect(e, progress.answers[e.id] ?? '')).length,
    total: list.length,
  };
}
export function loadProgress(storage: Pick<Storage, 'getItem'>): {
  progress: Progress;
  warning: string;
} {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return { progress: raw ? parseProgress(raw) : emptyProgress(), warning: '' };
  } catch {
    return {
      progress: emptyProgress(),
      warning:
        'Le carnet enregistré est illisible ou inaccessible. Il reste utilisable en mémoire ; exportez vos nouvelles réponses.',
    };
  }
}
export function saveProgress(storage: Pick<Storage, 'setItem'>, progress: Progress): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
