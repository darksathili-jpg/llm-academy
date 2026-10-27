import type { Investigation } from './investigation';

const WRITTEN_TRACES = [
  ['hypothesis', 'Hypothèse avant la manipulation'],
  ['observation', 'Observation de l’expérience'],
  ['explanation', 'Explication personnelle'],
  ['transfer', 'Réponse à une situation nouvelle'],
] as const;

/**
 * Signale seulement des traces présentes ou absentes.
 * La longueur et le QCM ne prouvent jamais la compréhension.
 */
export function reviewInvestigation(
  investigation: Investigation,
  expectedAnswer: string,
): { missing: string[]; conclusionCorrect: boolean; readyForReview: boolean } {
  const missing = WRITTEN_TRACES.filter(([key]) => !investigation[key].trim()).map(
    ([, label]) => label,
  );
  const conclusionCorrect = investigation.answer === expectedAnswer;
  return {
    missing,
    conclusionCorrect,
    readyForReview: missing.length === 0 && conclusionCorrect,
  };
}
