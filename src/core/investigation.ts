import { activities } from '../content/activities';
export interface Investigation {
  stage: number;
  hypothesis: string;
  observation: string;
  explanation: string;
  transfer: string;
  answer: string;
}
export type Investigations = Record<string, Investigation>;
export const emptyInvestigation = (): Investigation => ({
  stage: 0,
  hypothesis: '',
  observation: '',
  explanation: '',
  transfer: '',
  answer: '',
});
export function parseInvestigations(value: unknown): Investigations {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw Error('Investigations invalides.');
  const result: Investigations = {};
  for (const [id, raw] of Object.entries(value)) {
    if (
      !activities.some((a) => a.id === id) ||
      !raw ||
      typeof raw !== 'object' ||
      Array.isArray(raw)
    )
      throw Error('Activité inconnue.');
    const x = raw as Investigation;
    if (!Number.isInteger(x.stage) || x.stage < 0 || x.stage > 7) throw Error('Étape invalide.');
    const item = emptyInvestigation();
    item.stage = x.stage;
    for (const key of ['hypothesis', 'observation', 'explanation', 'transfer', 'answer'] as const) {
      if (typeof x[key] !== 'string' || x[key].length > 4000) throw Error('Trace hors limites.');
      item[key] = x[key];
    }
    result[id] = item;
  }
  return result;
}
