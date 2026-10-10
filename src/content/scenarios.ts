import { activities, type ExperimentId } from './activities';
export interface SessionStep {
  id: string;
  title: string;
  minutes: number;
  instruction: string;
  mode: 'individuel' | 'binômes' | 'collectif';
  question: string;
  expected: string;
  vigilance: string;
  experiment?: ExperimentId;
  output: string;
}
export interface Scenario {
  duration: 60 | 120 | 180 | 360;
  title: string;
  audience: string;
  goals: string[];
  prerequisites: string;
  materials: string[];
  preparation: string[];
  steps: SessionStep[];
  synthesis: string;
  resources: string[];
}
const layouts = {
  '60': [
    ['intro', 5],
    ['probabilites', 10],
    ['tokens', 10],
    ['generation', 10],
    ['erreurs', 15],
    ['synthese', 10],
  ],
  '120': [
    ['intro', 10],
    ['probabilites', 15],
    ['tokens', 20],
    ['generation', 15],
    ['erreurs', 25],
    ['prompting', 20],
    ['synthese', 15],
  ],
  '180': [
    ['intro', 10],
    ['probabilites', 20],
    ['tokens', 20],
    ['attention', 20],
    ['apprentissage', 25],
    ['erreurs', 25],
    ['prompting', 20],
    ['fiabilite', 25],
    ['synthese', 15],
  ],
  '360': [
    ['intro', 15],
    ['probabilites', 20],
    ['tokens', 25],
    ['contexte', 20],
    ['representations', 20],
    ['pause', 15],
    ['attention', 25],
    ['apprentissage', 30],
    ['generation', 25],
    ['pause', 30],
    ['erreurs', 30],
    ['prompting', 25],
    ['fiabilite', 40],
    ['transfert', 30],
    ['synthese', 10],
  ],
} as Record<string, [string, number][]>;
function step(id: string, minutes: number, index: number): SessionStep {
  const a = activities.find((x) => x.id === id);
  if (a)
    return {
      id: id + '-' + index,
      title: a.title,
      minutes,
      instruction: a.instruction,
      mode: index % 3 === 1 ? 'individuel' : index % 3 === 2 ? 'binômes' : 'collectif',
      question: a.question,
      expected: a.correction,
      vigilance: a.errors,
      experiment: a.experiment,
      output: a.goal + ' Produire une observation et une justification.',
    };
  const custom: Record<string, Omit<SessionStep, 'id' | 'minutes'>> = {
    intro: {
      title: 'Ouvrir la boîte noire',
      instruction:
        'Individuellement, écrivez une attente et un risque. En groupe, distinguez plausibilité, preuve et usage pédagogique. Utilisez des exemples fictifs ; aucun compte élève.',
      mode: 'collectif',
      question: 'Quelles preuves vous feraient changer d’avis sur une réponse crédible ?',
      expected:
        'Une source indépendante, pertinente et lisible ; ni le ton ni la confiance affichée.',
      vigilance: 'Ne pas demander de données personnelles ni promettre un vrai LLM local.',
      output: 'Une question de départ et un protocole de vérification.',
    },
    prompting: {
      title: 'Comparer des instructions avec des critères',
      instruction:
        'En binômes, définissez deux critères observables. Comparez les réponses prédéfinies, puis vérifiez aussi les affirmations avec le dossier S1. Modifier une instruction ne génère rien ici.',
      mode: 'binômes',
      question: 'Une réponse courte et citée est-elle forcément exacte ?',
      expected:
        'Non. Longueur et présence de référence sont des critères formels. L’exactitude demande de lire la source et d’évaluer le lien.',
      vigilance:
        'Ne pas confondre citation et preuve, ni réponse préparée et sortie réellement générée.',
      experiment: 'prompting',
      output: 'Une grille séparant contraintes formelles et vérification du fond.',
    },
    pause: {
      title: 'Pause et sauvegarde',
      instruction:
        'Faites une pause. Avant de quitter l’onglet, vérifiez que le chronomètre est mis en pause. Exportez le carnet si vous avez produit des traces personnelles.',
      mode: 'individuel',
      question: 'Quelles traces souhaite-t-on conserver ?',
      expected:
        'Les observations et justifications utiles, sans noms ni données personnelles inutiles.',
      vigilance: 'Le stockage local peut être effacé par le navigateur.',
      output: 'Une reprise de séance préparée.',
    },
    transfert: {
      title: 'Concevoir une activité de sa discipline',
      instruction:
        'En binômes, choisissez lettres, mathématiques, histoire-géographie, sciences, langues ou NSI. Rédigez une question, une manipulation et une grille de preuves. Faites relire votre activité par un autre binôme.',
      mode: 'binômes',
      question: 'Comment observer un apprentissage plutôt qu’une réponse mémorisée ?',
      expected:
        'Demander une prédiction, modifier une variable, recueillir une observation et justifier un transfert sur un cas différent.',
      vigilance: 'L’évaluation de productions libres demande une relecture humaine.',
      experiment: 'detective',
      output:
        'Une fiche de quinze minutes comprenant un test positif, un test négatif et une limite.',
    },
    synthese: {
      title: 'Synthétiser et préparer le transfert',
      instruction:
        'Chacun formule un mécanisme compris, une limite et une preuve à demander. Partagez en groupe. Remettez la fiche participant et les références ; ne transmettez aucune note privée.',
      mode: 'collectif',
      question: 'Que peut-on affirmer après ces expériences, et que reste-t-il à vérifier ?',
      expected:
        'Tokens, distributions, données et sources expliquent des mécanismes. Ces simulations ne démontrent ni une compréhension humaine ni la fiabilité générale d’un LLM.',
      vigilance: 'Un quiz validé ne certifie pas la compréhension ni un futur usage responsable.',
      output: 'Un protocole de vérification transférable et une limite explicite.',
    },
  };
  return { id: id + '-' + index, minutes, ...custom[id] };
}
export const scenarios: Scenario[] = ([60, 120, 180, 360] as const).map((duration) => ({
  duration,
  title:
    duration === 60
      ? 'Découvrir et exercer son jugement'
      : duration === 120
        ? 'Comprendre, expérimenter, vérifier'
        : duration === 180
          ? 'Des mécanismes à l’activité de classe'
          : 'Concevoir une formation et éprouver ses limites',
  audience:
    'Enseignants de toutes disciplines ; groupe hétérogène. Pas de connaissance d’algèbre linéaire exigée.',
  goals: [
    'Distinguer probabilité et preuve.',
    'Décrire un mécanisme à partir d’une manipulation.',
    'Construire une grille de vérification adaptée à sa discipline.',
  ],
  prerequisites:
    'Savoir ouvrir une page web et lire un document. Python est facultatif dans le stage ; les prolongements scientifiques restent accessibles.',
  materials: [
    'Un ordinateur et un vidéoprojecteur ; texte agrandissable.',
    'Un navigateur récent ; un ordinateur par binôme si possible, papier en repli.',
    'Connexion lors de la première visite ; calculs TypeScript ensuite utilisables hors ligne.',
  ],
  preparation: [
    'Ouvrir le site avec le réseau, attendre le cache puis tester une visite hors ligne.',
    'Tester la lisibilité depuis le fond de la salle et sélectionner Projection.',
    'Choisir un cas disciplinaire ; rappeler de ne pas saisir de données personnelles.',
    'Si Python est utilisé, tester son téléchargement ; prévoir le code .py local en repli.',
    'Sur deux écrans, projeter la fenêtre Projection et garder les Coulisses hors du partage.',
  ],
  steps: layouts[String(duration)].map(([id, minutes], index) => step(id, minutes, index)),
  synthesis:
    'Une sortie probable peut être fausse. Une source et un calcul sont des éléments à examiner. Toute activité doit articuler hypothèse, expérience, preuve et limite.',
  resources: [
    'Le carnet JSON exportable, sans compte.',
    'La fiche participant imprimable : consignes, critères, synthèse et références.',
    'Les programmes NSI et le cadre d’usage de l’IA en éducation.',
    'Les laboratoires locaux et les notebooks facultatifs.',
  ],
}));
