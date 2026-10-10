import { activities, type ActivitySheet } from './activities';
const extras: ActivitySheet[] = [
  {
    id: 'prompting',
    title: 'Comparer des instructions et des critères',
    experiment: 'prompting',
    duration: 20,
    question: 'Un texte qui respecte la forme peut-il rester faux ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      'Python : variables, listes, dictionnaires, boucles, fonctions et assertions. Les notions propres aux LLM sont des prolongements.',
    goal: 'Mesurer deux contraintes formelles et vérifier le fond séparément.',
    notions: 'Spécification, tests, grille de preuves ; prompting hors programme',
    instruction:
      'Comparer les deux réponses prédéfinies, puis modifier les critères et vérifier les sources.',
    manipulation:
      'Changer le maximum de mots et la référence exigée. Lire les réponses et le dossier S1.',
    observation: 'Une réponse peut réussir un test formel et échouer à la vérification factuelle.',
    science:
      'Le compteur mesure les mots séparés par espaces ; une expression régulière détecte une référence [S1–S3]. Aucun modèle ne génère de réponse et aucune amélioration sémantique n’est promise.',
    errors: 'Confondre respect d’une consigne, présence d’une citation et exactitude.',
    hints: [
      'Comptez les mots.',
      'Vérifiez la référence dans le dossier S1.',
      'Comparez ouverture quotidienne et ouverture le mardi.',
    ],
    correction:
      'La réponse longue invente une ouverture quotidienne ; S1 indique mardi à dix-huit heures. La seconde est conforme à cette information.',
    criteria: [
      'Définir un critère observable.',
      'Vérifier le lien entre citation et fait.',
      'Ne pas attribuer une sortie préparée à un générateur.',
    ],
    transfer: 'Écrire une grille de relecture d’une réponse dans sa discipline.',
    deeper:
      'Constituer un jeu de cas avec négations, références non pertinentes et contraintes contradictoires.',
    quiz: {
      question: 'Quelle limite reste à vérifier ?',
      choices: [
        'Une contrainte formelle prouve l’exactitude',
        'La citation doit être comparée à la source',
        'Le nombre de mots garantit le sens',
      ],
      expected: 1,
    },
    python:
      'texte = "L’observatoire ouvre le mardi [S1]."\nprint("Mots :", len(texte.split()))\nassert "[S1]" in texte\n# Présence de citation ne prouve pas son exactitude.\n',
    input: 'observatoire',
  },
  {
    id: 'transformer',
    title: 'Suivre le calcul d’un Transformer réduit',
    experiment: 'transformer',
    duration: 30,
    question: 'Le futur peut-il modifier une représentation passée dans ce bloc ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      'Python : variables, listes, dictionnaires, boucles, fonctions et assertions. Les notions propres aux LLM sont des prolongements.',
    goal: 'Comparer les valeurs de la deuxième position après modification du troisième token.',
    notions: 'Indices et tableaux ; Transformer pré-normalisé hors programme',
    instruction:
      'Modifier le troisième token ; relever une étape après attention avec et sans masque.',
    manipulation: 'Garder tous les paramètres fixes sauf le futur et le masque causal.',
    observation:
      'Avec causalité, les valeurs des positions antérieures ne changent pas ; sans causalité elles peuvent changer.',
    science:
      'Bloc pré-normalisé d=4, deux têtes, positions sin/cos et FFN ReLU de largeur 2d. Poids déterministes non entraînés, sans biais/dropout. Toutes les étapes utilisent les moteurs existants.',
    errors: 'Prendre un bloc réduit pour un modèle de production entraîné.',
    hints: [
      'Choisissez une étape après attention.',
      'Comparez exactement la deuxième ligne.',
      'Désactivez le masque et recommencez.',
    ],
    correction:
      'Le masque empêche la contribution du futur ; l’égalité des traces avant la position modifiée se teste numériquement.',
    criteria: [
      'Changer une seule variable.',
      'Comparer des valeurs précises.',
      'Nommer les simplifications du bloc.',
    ],
    transfer: 'Définir un test de non-fuite d’information dans un traitement séquentiel.',
    deeper: 'Comparer les ablations de positions, résidus et têtes dans le niveau scientifique.',
    quiz: {
      question: 'Quelle conclusion est justifiée ?',
      choices: [
        'Le futur reçoit un poids nul',
        'Le futur est forcément prioritaire',
        'Le masque entraîne le modèle',
      ],
      expected: 0,
    },
    python:
      'n = 3\nmasque = [[j <= i for j in range(n)] for i in range(n)]\nfor ligne in masque: print(ligne)\nassert masque[1][2] is False\n',
    input: '',
  },
];
export const laboratorySheets: ActivitySheet[] = [...activities, ...extras];
