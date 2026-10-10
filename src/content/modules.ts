import { constructionModules } from './constructionModules';
import { representationModules } from './representationModules';
import { transformerModules } from './transformerModules';
import type { ModuleId } from '../core/exercises';
export interface Section {
  title: string;
  paragraphs: string[];
  formula?: string;
}
export interface Module {
  id: ModuleId;
  title: string;
  subtitle: string;
  duration: string;
  problem: string;
  objectives: string[];
  prerequisite: string;
  diagnostic: { question: string; choices: string[]; expected: number; feedback: string };
  sections: Section[];
  hypothesis: string;
  transfer: string;
  rubric: string[];
  summary: string[];
  developerNote?: string;
  references: { title: string; url: string; reason: string }[];
}
export const modules: Module[] = [
  {
    id: '01',
    title: 'Comprendre les LLM',
    subtitle: 'De la continuation plausible à la réponse vérifiée',
    duration: '45–60 min · estimation',
    problem:
      'Une application complète « La capitale de… » avec une réponse fluide. A-t-elle calculé une suite plausible, consulté une base de faits, ou démontré sa réponse ? Vous allez séparer ces trois opérations et mesurer ce que prédit réellement un modèle de langage.',
    objectives: [
      'Calculer une probabilité conditionnelle et celle d’une séquence de deux tokens.',
      'Distinguer mise à jour des poids et utilisation d’un modèle à poids fixes.',
      'Relier probabilité de la cible et perte logarithmique.',
      'Proposer une vérification adaptée à une affirmation factuelle.',
    ],
    prerequisite:
      'Savoir calculer une fraction. Aucune connaissance en réseau de neurones requise.',
    diagnostic: {
      question:
        'Un sac contient 2 jetons rouges et 3 bleus. Quelle est la probabilité de tirer un bleu au hasard ?',
      choices: ['3/2', '3/5', '2/5'],
      expected: 1,
      feedback:
        '3 issues favorables sur 5 : 3/5 = 0,6. Une probabilité est comprise entre 0 et 1. La somme des probabilités des issues possibles vaut 1.',
    },
    sections: [
      {
        title: '01 / Un modèle d’une distribution, pas un dictionnaire de réponses',
        paragraphs: [
          'Un token est une unité discrète représentant un morceau de texte : parfois un mot, parfois une partie de mot, parfois de la ponctuation. Le module suivant montrera comment ces unités sont construites. Ici, nous supposons un vocabulaire déjà fixé.',
          'Un modèle de langage associe au contexte une distribution sur les prochains tokens. Pour une phrase commençant par « Le ciel est », plusieurs continuations sont possibles. Dans notre expérience, nous réduisons volontairement le vocabulaire à bleu, gris et rose. Un véritable modèle dispose d’un vocabulaire bien plus grand.',
          'L’énoncé P(bleu | Le ciel est) = 0,6 signifie que la distribution du modèle attribue 60 % de sa masse à ce prochain token dans ce contexte. Cela ne signifie ni que le ciel observé est bleu, ni que 60 % des informations générées sont exactes. Nous pouvons tester cette différence sans caméra, sans données météorologiques et sans modèle entraîné.',
        ],
      },
      {
        title: '02 / Du score à la probabilité',
        formula: 'pᵢ = exp(zᵢ) / Σⱼ exp(zⱼ)',
        paragraphs: [
          'Le modèle produit des scores appelés logits. Un logit peut être négatif et n’est pas directement une probabilité. La fonction softmax transforme une liste de scores en valeurs positives dont la somme vaut 1.',
          'Pour trois poids exponentiels 2, 3 et 5, la somme vaut 10 et les probabilités sont 0,2 ; 0,3 ; 0,5. Pour des logits égaux, les probabilités sont égales. Ajouter la même constante à tous les logits ne modifie pas la distribution : le facteur commun se simplifie dans la division.',
          'Le calcul informatique soustrait le plus grand logit avant de prendre les exponentielles. Cette transformation conserve le résultat mathématique et limite les débordements numériques. Les valeurs du laboratoire sont effectivement calculées, puis arrondies pour l’affichage.',
        ],
      },
      {
        title: '03 / Générer : enrichir le contexte, puis recommencer',
        formula: 'P(A, B | c) = P(A | c) × P(B | c, A)',
        paragraphs: [
          'Après avoir choisi un token, on l’ajoute au contexte. On recalcule une distribution pour le token suivant. Ce fonctionnement est dit autorégressif. Choisir systématiquement le token le plus probable est une stratégie possible ; tirer au hasard dans la distribution en est une autre.',
          'Si la probabilité de A vaut 0,4 et celle de B après A vaut 0,3, la probabilité de cette suite particulière vaut 0,12. Ce produit repose sur des probabilités conditionnelles : il ne suppose pas que les tokens sont indépendants.',
          'Une sortie fluide peut combiner des dépendances de langue et des informations apprises. Mais le mécanisme de continuation ne vérifie pas chaque fait dans une source. Un système peut ajouter une recherche, un calcul ou un contrôle explicite ; ces opérations doivent alors être distinguées de la seule génération.',
        ],
      },
      {
        title: '04 / Apprendre n’est pas répondre',
        paragraphs: [
          'Lors de l’entraînement, des séquences servent à construire des tâches de prédiction. Pour chaque position, le modèle cherche à attribuer une probabilité élevée au token cible observé. Une fonction de perte mesure l’erreur et une procédure d’optimisation modifie les paramètres.',
          'La perte d’une cible est −ln(p cible). Si p = 1, la perte vaut 0 ; si p = 0,5, elle vaut environ 0,6931. Plus la cible est improbable, plus la pénalité augmente. La perte moyenne sur un ensemble de positions résume un objectif d’apprentissage, mais n’est pas une note générale de fiabilité factuelle.',
          'Lors d’une inférence à poids fixes, le modèle utilise ses paramètres pour produire les distributions. Le contexte peut changer sans que les poids changent. Enregistrer une conversation dans un historique applicatif et entraîner à nouveau un modèle sont également deux opérations différentes. Un fournisseur peut proposer des politiques de réutilisation des données : cela ne transforme pas automatiquement chaque réponse en entraînement en temps réel.',
        ],
      },
      {
        title: '05 / De la capacité à la fiabilité',
        paragraphs: [
          'Un modèle de langage peut servir à reformuler, résumer, aider à coder ou proposer des hypothèses. La qualité dépend du modèle, de la tâche, du contexte et du protocole de vérification ; aucune performance chiffrée n’est déduite ici sans mesure.',
          'Une « hallucination » désigne ici une affirmation produite sans fondement suffisant ou incompatible avec les éléments de référence. Une phrase incorrecte peut être fluide et assurée. Inversement, une phrase hésitante peut contenir un fait exact : le style n’est pas un instrument de mesure de vérité.',
          'Pour une date, recherchez une source primaire et comparez l’événement concerné. Pour un calcul, exécutez un calcul indépendant. Pour du code, formulez des cas de test. La vérification doit cibler le contenu et conserver une trace de la preuve, plutôt que demander au modèle de confirmer sa propre réponse.',
        ],
      },
    ],
    hypothesis:
      'Avec trois logits égaux, chaque continuation doit avoir la même probabilité. Que devient la perte si vous désignez une autre cible ? Testez votre prédiction dans le laboratoire.',
    transfer:
      'Une application affirme : « Notre bibliothèque locale a ouvert en 1978 ». Écrivez une procédure de vérification en trois étapes, en précisant la preuve recherchée et ce que vous feriez si deux sources se contredisaient.',
    rubric: [
      'Je distingue la plausibilité du texte et la véracité de la date.',
      'Je choisis une source primaire liée à cette bibliothèque.',
      'Je prévois une comparaison, une trace de la preuve et le traitement d’un désaccord.',
    ],
    summary: [
      'Un modèle de langage fournit une distribution conditionnée par un contexte.',
      'La génération répète la prédiction après avoir ajouté un token.',
      'Entraînement : poids modifiés ; inférence décrite ici : poids fixes.',
      'La perte de prédiction et la vérité factuelle sont deux critères différents.',
    ],
    references: [
      {
        title: 'PyTorch — Softmax',
        url: 'https://pytorch.org/docs/stable/generated/torch.nn.Softmax.html',
        reason: 'Définition mathématique de la normalisation des scores.',
      },
      {
        title: 'PyTorch — CrossEntropyLoss',
        url: 'https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html',
        reason: 'Objectif d’apprentissage pour une cible discrète.',
      },
      {
        title: 'Vaswani et al. — Attention Is All You Need',
        url: 'https://arxiv.org/abs/1706.03762',
        reason: 'Architecture Transformer ; le modèle du papier est un encodeur-décodeur.',
      },
    ],
  },
  {
    id: '02',
    title: 'Tokenisation',
    subtitle: 'Ouvrir la boîte noire du texte numérique',
    duration: '60–75 min · estimation',
    problem:
      'Deux applications comptent des nombres de tokens différents pour la même phrase française. L’une doit tenir dans un petit budget de contexte. Comment expliquer la différence sans invoquer le nombre de mots ou de lettres ? Construisez un vocabulaire miniature pour observer ce qui change.',
    objectives: [
      'Distinguer caractère, mot, sous-mot et identifiant numérique.',
      'Compter les paires d’un corpus et prévoir la prochaine fusion BPE.',
      'Encoder un texte en appliquant uniquement les règles apprises.',
      'Expliquer les inconnus et calculer un budget de contexte simplifié.',
    ],
    prerequisite:
      'Savoir identifier une paire de caractères adjacents. Le module 01 présente le rôle du token.',
    diagnostic: {
      question:
        'Dans le mot « lac », combien de paires adjacentes observe-t-on avant toute fusion ?',
      choices: ['1 : lac', '2 : l–a et a–c', '3 : l, a et c'],
      expected: 1,
      feedback:
        'Un mot de trois symboles contient deux positions de paires adjacentes : l–a et a–c. Les trois caractères ne sont pas trois paires.',
    },
    sections: [
      {
        title: '01 / Quatre objets à distinguer',
        paragraphs: [
          'Un caractère correspond ici à un point de code Unicode, un mot à une portion séparée par des espaces, un token à un symbole du vocabulaire et un ID à son numéro local. Ces définitions sont celles de notre miniature ; d’autres tokeniseurs découpent le texte autrement.',
          'La chaîne « lama » contient quatre caractères. Un découpage caractère donne [l, a, m, a], un découpage mot [lama], et un découpage sous-mot pourrait donner [la, m, a]. Le texte est le même, mais la longueur en tokens varie selon le vocabulaire et l’algorithme.',
          'Un ID n’est pas une quantité sémantique. Si la reçoit l’ID 5 et m l’ID 4, cela ne veut pas dire que la est plus grand ou plus important. Ces nombres servent à retrouver des entrées, par exemple dans une table de vecteurs étudiée au module 03. Deux vocabulaires peuvent donner des numéros différents au même morceau de texte.',
        ],
      },
      {
        title: '02 / Apprendre un vocabulaire par fusion',
        paragraphs: [
          'L’idée de Byte Pair Encoding utilisée ici est de remplacer des paires de symboles fréquentes par de nouveaux symboles. Nous partons des caractères présents dans le corpus. À chaque étape, nous comptons toutes les paires adjacentes, choisissons la plus fréquente, puis fusionnons ses occurrences sans chevauchement.',
          'Avec « lac lac lama », l–a apparaît trois fois, a–c deux fois, a–m et m–a une fois. La première fusion produit le symbole la. Le corpus devient [la, c], [la, c], [la, m, a]. Il contient alors sept tokens au lieu de dix. Les prochains comptes doivent être recalculés sur cette nouvelle segmentation.',
          'Deux paires peuvent avoir le même compte. Pour rendre notre expérience reproductible, une égalité est départagée par l’ordre lexicographique des clés JSON des paires, selon les unités UTF-16. Un autre choix déterministe peut produire un autre vocabulaire. Ce critère est une convention de l’outil, pas une vérité linguistique.',
          'Dans « aaa », a–a possède deux positions chevauchantes. Une fusion de gauche à droite en remplace seulement une et donne [aa, a]. Le nombre de paires comptées n’est donc pas toujours égal au nombre de remplacements effectifs. Le laboratoire montre ces deux quantités.',
        ],
      },
      {
        title: '03 / Encoder ne veut pas dire réapprendre',
        paragraphs: [
          'Après l’apprentissage, l’encodeur utilise l’alphabet et la liste ordonnée des fusions. Il ne choisit pas une nouvelle paire fréquente dans le texte de test. Vous pouvez saisir une nouvelle phrase sans changer le corpus : le vocabulaire reste fixé à l’étape courante.',
          'Après la seule règle (l, a) → la, « lama » est encodé [la, m, a]. Si le vocabulaire ne contient pas z, « laz » donne [la, [UNK]]. Le marqueur inconnu (ID 0) constate une absence ; il n’invente pas de représentation réversible pour z.',
          'Notre alphabet comprend des caractères Unicode vus pendant l’apprentissage. Des tokeniseurs travaillent plutôt sur les octets et évitent ainsi ce type d’inconnu de caractère grâce à un alphabet de base couvrant les octets. Les étapes de normalisation, les frontières de mots et les tokens spéciaux diffèrent entre systèmes. Notre outil enseigne des fusions ; il ne reproduit pas le tokenizer d’un service commercial.',
        ],
      },
      {
        title: '04 / Le contexte est un budget',
        paragraphs: [
          'Pour une architecture et une interface données, une limite de contexte contraint la séquence traitée. Instructions, historique, documents récupérés et sortie peuvent contribuer à cette longueur ; le détail dépend du système et de ses limites supplémentaires.',
          'Dans notre exercice, un budget total de 16 tokens contient 4 tokens d’instructions et 6 tokens de documents. Il reste au plus 6 tokens pour une sortie si aucune autre unité n’occupe le contexte. Il faut compter les unités du tokenizer effectivement utilisé, pas le nombre de mots.',
          'Le laboratoire conserve les espaces séparément et ne les inclut pas dans son budget miniature. Ne réutilisez donc pas ce compteur pour estimer une facture ou une capacité de contexte réelle. La tokenisation peut dépendre de la langue, de l’orthographe, des espaces et du corpus d’apprentissage.',
        ],
      },
      {
        title: '05 / Une représentation a des limites',
        paragraphs: [
          'Une fusion fréquente économise des positions sur certaines données sans démontrer qu’elle constitue une unité de sens. Un token peut être un fragment arbitraire ; le sens dépend aussi du modèle et du contexte.',
          'L’expérience est limitée à 2 000 caractères de corpus et douze fusions, afin de rendre chaque compte lisible. Elle n’apprend ni des millions d’exemples ni un vocabulaire optimisé pour plusieurs langues. Toutes les fréquences proviennent néanmoins du corpus affiché.',
          'Pour un test de généralisation, gardez un texte de test fixe et comparez deux corpus d’apprentissage. Notez le nombre de tokens et les inconnus. Une meilleure compression du corpus d’entraînement ne garantit pas une meilleure compression sur ce texte nouveau.',
        ],
      },
    ],
    hypothesis:
      'Prédisez la première paire fusionnée dans « lac lac lama ». Avant de lancer une fusion, calculez sa fréquence. Comparez ensuite les tokens de « lama lac » avant et après cette seule fusion.',
    transfer:
      'Gardez « lama lac » comme texte de test. Comparez un vocabulaire appris sur « lac lac lama » et un autre sur « loup loup lune ». Relevez longueur, inconnus et règles. Expliquez pourquoi changer le corpus peut modifier le résultat sans changer le texte de test.',
    rubric: [
      'Je donne les deux corpus et conserve le même texte de test.',
      'Je relève des nombres effectivement observés et au moins une règle.',
      'Je distingue compression, couverture de l’alphabet et qualité linguistique.',
    ],
    summary: [
      'Les IDs dépendent d’un vocabulaire, pas de la valeur d’un mot.',
      'Le BPE miniature recompte les paires après chaque fusion.',
      'Un encodage applique des règles fixées ; il ne les apprend pas.',
      'Un budget réel nécessite le véritable tokenizer du modèle.',
    ],
    references: [
      {
        title: 'Sennrich, Haddow, Birch — unités sous-lexicales',
        url: 'https://arxiv.org/abs/1508.07909',
        reason: 'Article original sur la segmentation sous-lexicale en traduction.',
      },
      {
        title: 'Hugging Face — BPE',
        url: 'https://huggingface.co/learn/llm-course/chapter6/5',
        reason: 'Complément sur l’apprentissage, l’encodage et le BPE sur octets.',
      },
    ],
  },
  ...representationModules,
  ...transformerModules,
  ...constructionModules,
];
export const upcoming = [
  'Prompting et contexte',
  'RAG et applications',
  'Agents, fiabilité et évaluation',
];
