import { activities } from './activities';

/**
 * Ordre pédagogique conseillé, et non une liste de notions exigibles au baccalauréat NSI.
 * Les sept premières activités privilégient l'expérience avant l'explication scientifique.
 * Les trois dernières ouvrent des prolongements hors programme.
 */
export const essentials = [
  'credibilite',
  'tokens',
  'probabilites',
  'contexte',
  'generation',
  'erreurs',
  'fiabilite',
] as const;
export const extensions = ['representations', 'attention', 'apprentissage'] as const;
export const teachingOrder = [...essentials, ...extensions];

export function orderedActivities() {
  return teachingOrder.map((id) => {
    const activity = activities.find((item) => item.id === id);
    if (!activity) throw Error('Activité absente du parcours : ' + id);
    return activity;
  });
}
