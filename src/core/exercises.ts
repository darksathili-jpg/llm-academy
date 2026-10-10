import { foundationExercises } from './foundation-exercises';
export const MODULE_IDS = ['01', '02', '03', '04', '05', '06'] as const;
export type ModuleId = (typeof MODULE_IDS)[number];
export function isModuleId(value: string): value is ModuleId {
  return (MODULE_IDS as readonly string[]).includes(value);
}
export interface Exercise {
  id: string;
  module: ModuleId;
  kind: 'number' | 'choice';
  level: string;
  prompt: string;
  choices?: string[];
  expected: string | number;
  tolerance?: number;
  hint: string;
  correction: string;
}
export const exercises: Exercise[] = [
  {
    id: 'm01-proba',
    module: '01',
    kind: 'number',
    level: 'Calcul',
    prompt:
      'Les poids non normalisés de trois continuations sont 2, 3 et 5. Quelle est la probabilité de la troisième ? Donnez un nombre entre 0 et 1.',
    expected: 0.5,
    tolerance: 0.001,
    hint: 'Divisez le poids de la cible par la somme des trois poids.',
    correction:
      '5 / (2 + 3 + 5) = 0,5. Une probabilité concerne une continuation dans ce contexte, pas sa vérité.',
  },
  {
    id: 'm01-sequence',
    module: '01',
    kind: 'number',
    level: 'Prédiction',
    prompt:
      'P(A | contexte) = 0,4 et P(B | contexte, A) = 0,3. Quelle est la probabilité de produire A puis B ?',
    expected: 0.12,
    tolerance: 0.001,
    hint: 'La règle de chaîne multiplie les probabilités conditionnelles successives.',
    correction:
      '0,4 × 0,3 = 0,12. La probabilité du second token dépend du contexte enrichi par A ; on ne suppose pas leur indépendance.',
  },
  {
    id: 'm01-inference',
    module: '01',
    kind: 'choice',
    level: 'Débogage',
    prompt:
      'Un service génère une réponse avec un modèle dont les poids restent fixes. Que se passe-t-il ?',
    choices: [
      'Un entraînement à chaque réponse',
      'Une inférence avec le contexte fourni',
      'Une validation de tous les faits',
    ],
    expected: 'Une inférence avec le contexte fourni',
    hint: 'Distinguez calcul de sortie et mise à jour des paramètres.',
    correction:
      'Ici les poids ne changent pas : c’est une inférence. Le texte du dialogue peut changer les activations et les sorties sans entraîner le modèle.',
  },
  {
    id: 'm01-truth',
    module: '01',
    kind: 'choice',
    level: 'Analyse',
    prompt:
      'Une réponse contient une date très plausible, mais aucune source vérifiée. Quelle conclusion est justifiée ?',
    choices: [
      'La probabilité élevée certifie la date',
      'La date doit être vérifiée dans une source fiable',
      'Toute date produite est forcément fausse',
    ],
    expected: 'La date doit être vérifiée dans une source fiable',
    hint: 'Ni plausibilité ni absence de preuve ne suffisent pour établir une vérité.',
    correction:
      'Vérifiez la date dans une source primaire adaptée. Le mécanisme de génération ne fournit pas à lui seul une garantie factuelle.',
  },
  {
    id: 'm02-frequency',
    module: '02',
    kind: 'number',
    level: 'Calcul',
    prompt:
      'Corpus : « lac lac lama ». Au départ, combien d’occurrences de la paire (l, a) compte-t-on ?',
    expected: 3,
    tolerance: 0,
    hint: 'Les deux occurrences de lac et celle de lama contribuent.',
    correction:
      'l–a apparaît une fois dans chacun des trois mots : 3 occurrences. La fréquence d’un mot pondère les comptes de ses paires.',
  },
  {
    id: 'm02-merge',
    module: '02',
    kind: 'choice',
    level: 'Prédiction',
    prompt: 'Après la fusion (l, a) → la, quel est l’encodage de « lama » ?',
    choices: ['[lama]', '[la, m, a]', '[l, am, a]'],
    expected: '[la, m, a]',
    hint: 'Seule la règle apprise s’applique. Les autres caractères restent séparés.',
    correction:
      'Les symboles l et a adjacents fusionnent : [la, m, a]. Une fusion ne crée pas automatiquement tous les mots qui contiennent la paire.',
  },
  {
    id: 'm02-budget',
    module: '02',
    kind: 'number',
    level: 'Transfert',
    prompt:
      'Dans un budget total de 16 tokens, les instructions occupent 4 tokens et les documents 6. Combien reste-t-il au maximum pour la sortie, si rien d’autre ne consomme de tokens ?',
    expected: 6,
    tolerance: 0,
    hint: 'Soustrayez les deux parties déjà réservées.',
    correction:
      '16 − 4 − 6 = 6 tokens. En production, les tokens spéciaux et l’historique peuvent aussi occuper le budget ; certaines API imposent en plus une limite de sortie.',
  },
  {
    id: 'm02-unknown',
    module: '02',
    kind: 'choice',
    level: 'Limites',
    prompt:
      'Le corpus d’apprentissage ne contient pas « z ». Que fait notre BPE miniature lorsqu’il encode « laz » ?',
    choices: [
      'Il réentraîne le vocabulaire automatiquement',
      'Il signale z comme [UNK], sans modifier les règles',
      'Il sait toujours reconstruire z à partir de [UNK]',
    ],
    expected: 'Il signale z comme [UNK], sans modifier les règles',
    hint: 'Le vocabulaire est fixé avant de traiter le texte de test.',
    correction:
      'L’encodage n’apprend pas de règle. Un caractère absent est inconnu (ID 0) ; [UNK] ne permet pas de le reconstruire. Le BPE sur octets répond différemment à ce problème.',
  },
  ...foundationExercises,
];
export function isCorrect(exercise: Exercise, raw: string): boolean {
  if (exercise.kind === 'choice') return raw === exercise.expected;
  if (!/^[-+]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[-+]?\d+)?$/i.test(raw.trim())) return false;
  const n = Number(raw.trim().replace(',', '.'));
  return Number.isFinite(n) && Math.abs(n - Number(exercise.expected)) <= (exercise.tolerance ?? 0);
}
