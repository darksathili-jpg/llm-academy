import { exercises, isCorrect, type ModuleId } from './exercises';
export const STORAGE_KEY = 'llm-academy.progress.v1';
export type Theme = 'light' | 'dark' | 'projector';
export type Track = 'discovery' | 'developer';
export interface Progress { version: 1; theme: Theme; track: Track; answers: Record<string, string>; notes: Record<ModuleId, string> }
export function emptyProgress(): Progress { return { version: 1, theme: 'light', track: 'discovery', answers: {}, notes: { '01': '', '02': '' } }; }
export function parseProgress(raw: string): Progress {
  if (raw.length > 100_000) throw new Error('Fichier trop volumineux (100 Ko maximum).');
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Format de carnet invalide.');
  const v = value as Record<string, unknown>;
  if (v.version !== 1) throw new Error('Version de carnet non prise en charge.');
  if (!['light','dark','projector'].includes(String(v.theme)) || !['discovery','developer'].includes(String(v.track))) throw new Error('Préférences invalides.');
  if (!v.answers || typeof v.answers !== 'object' || Array.isArray(v.answers) || !v.notes || typeof v.notes !== 'object' || Array.isArray(v.notes)) throw new Error('Réponses ou notes invalides.');
  const answers: Record<string, string> = {};
  for (const [id, answer] of Object.entries(v.answers)) {
    if (!exercises.some(e => e.id === id) || typeof answer !== 'string' || answer.length > 300) throw new Error('Réponse inconnue ou invalide.');
    answers[id] = answer;
  }
  const notes = v.notes as Record<string, unknown>;
  if (Object.keys(notes).some(key => key !== '01' && key !== '02') || typeof notes['01'] !== 'string' || typeof notes['02'] !== 'string' || notes['01'].length > 10000 || notes['02'].length > 10000) throw new Error('Notes invalides.');
  return { version: 1, theme: v.theme as Theme, track: v.track as Track, answers, notes: { '01': notes['01'], '02': notes['02'] } };
}
export function moduleScore(progress: Progress, module: ModuleId): { correct: number; total: number } {
  const list = exercises.filter(e => e.module === module);
  return { correct: list.filter(e => isCorrect(e, progress.answers[e.id] ?? '')).length, total: list.length };
}
export function loadProgress(storage: Pick<Storage,'getItem'>): { progress: Progress; warning: string } {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return { progress: raw ? parseProgress(raw) : emptyProgress(), warning: '' };
  } catch { return { progress: emptyProgress(), warning: 'Le carnet enregistré est illisible ou inaccessible. Il reste utilisable en mémoire ; exportez vos nouvelles réponses.' }; }
}
export function saveProgress(storage: Pick<Storage,'setItem'>, progress: Progress): boolean {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(progress)); return true; } catch { return false; }
}

