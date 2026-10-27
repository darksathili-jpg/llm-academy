/** Séquences de référence prêtes à animer ; durées indicatives, non testées en classe. */
export interface TeacherSequenceStep {
  minutes: number;
  kind: string;
  activity: string;
  teacher: string;
  learner: string;
  question: string;
  expected: string;
  vigilance: string;
}
export interface TeacherSequence {
  id: string;
  title: string;
  duration: number;
  audience: string;
  prerequisites: string;
  objectives: string[];
  equipment: string;
  steps: TeacherSequenceStep[];
  teacherExit: string;
  scientificLimit: string;
}

// prettier-ignore
export const teacherSequences: TeacherSequence[] = [
  {
    "id": "predire-verifier",
    "title": "Une réponse probable n'est pas nécessairement vraie",
    "duration": 60,
    "audience": "Terminale NSI — sans spécialité mathématiques ; enseignant débutant sur les LLM",
    "prerequisites": "Lire un document, comparer des pourcentages et des dictionnaires Python ; aucun calcul de softmax requis.",
    "objectives": [
      "Distinguer la probabilité d'un choix de mot de la vérité d'une phrase.",
      "Classer étayé / contredit / insuffisant à partir d'une source.",
      "Justifier une fonction Python avec des assertions et un cas non fourni."
    ],
    "equipment": "Navigateur, vidéoprojecteur, accès aux activités Crédibilité et Probabilités ; Python facultatif en cas de réseau indisponible.",
    "steps": [
      {
        "minutes": 5,
        "kind": "Situation-problème",
        "activity": "credibilite",
        "teacher": "Lire « Nora referme une fenêtre » puis afficher « Nora ouvre la fenêtre ». Demander si le ton affirmatif est une preuve.",
        "learner": "Écrire une hypothèse et citer exactement les mots contradictoires.",
        "question": "La phrase peut-elle être bien formulée et fausse ?",
        "expected": "Oui, car « ouvre » est incompatible avec « referme » dans le document.",
        "vigilance": "Ne pas interpréter l'âge absent de Nora comme une affirmation fausse."
      },
      {
        "minutes": 15,
        "kind": "Vérification documentaire",
        "activity": "credibilite",
        "teacher": "Faire classer les trois affirmations sans donner le corrigé. Comparer les justifications entre binômes.",
        "learner": "Attribuer un verdict et un passage ou « aucune preuve » à chaque affirmation.",
        "question": "Quelle différence entre contradiction et information manquante ?",
        "expected": "La contradiction s'appuie sur un extrait opposé ; l'absence de donnée commande de s'abstenir.",
        "vigilance": "Exiger la lecture du passage, pas le seul choix du bouton."
      },
      {
        "minutes": 15,
        "kind": "Probabilité contrôlée",
        "activity": "probabilites",
        "teacher": "Afficher les trois mots proposés. Ne faire varier que la température. Préciser que les scores initiaux du simulateur sont inventés.",
        "learner": "Noter les pourcentages avant/après et vérifier leur somme.",
        "question": "Une chance de 90 % signifie-t-elle une vérité de 90 % ?",
        "expected": "Non : la probabilité décrit un choix de mot conditionné par les réglages et le contexte.",
        "vigilance": "Éviter d'introduire logarithmes et exponentielles comme prérequis."
      },
      {
        "minutes": 15,
        "kind": "Programmation NSI",
        "activity": "credibilite",
        "teacher": "Ouvrir « Mission Python NSI : Classer une affirmation ». Faire compléter la fonction et expliquer le rôle du dictionnaire de référence.",
        "learner": "Affecter des valeurs booléennes aux clés de faits, tester trois cas avec assert et proposer un cas sans clé.",
        "question": "Pourquoi renvoyer « insuffisant » pour une clé absente ?",
        "expected": "Le dictionnaire n'autorise aucune conclusion sur une valeur non documentée.",
        "vigilance": "Le dictionnaire est une source structurée choisie pour l'exercice, pas un vérificateur universel."
      },
      {
        "minutes": 10,
        "kind": "Transfert et sortie",
        "activity": "erreurs",
        "teacher": "Inventer une nouvelle affirmation dont le document ne donne pas la réponse. Faire écrire deux phrases de synthèse.",
        "learner": "Classer la nouvelle affirmation et distinguer mécanisme de prédiction et procédure de vérification.",
        "question": "Quel autre document permettrait de décider ?",
        "expected": "Une source indépendante contenant l'information pertinente, lue et interprétée.",
        "vigilance": "Ne pas attribuer de maîtrise sur la seule case cochée."
      }
    ],
    "teacherExit": "L'élève fournit une citation, un verdict correctement justifié et un test Python inédit.",
    "scientificLimit": "Le laboratoire de probabilités utilise des préférences inventées, non un LLM de production. La fonction Python classe des faits déjà documentés."
  },
  {
    "id": "tokens-generation",
    "title": "Des caractères aux choix de mots : construire un modèle réduit",
    "duration": 60,
    "audience": "Terminale NSI et professeur découvrant la tokenisation ; groupe sans bagage en algèbre linéaire",
    "prerequisites": "Chaînes de caractères, listes, dictionnaires, boucle bornée, fonction, assertion. Savoir compter.",
    "objectives": [
      "Observer une fusion de paires fréquentes dans un corpus.",
      "Distinguer morceau de texte (token) et mot entier.",
      "Expliquer l'effet d'une graine et du paramètre top-k, sans prétendre entraîner un modèle moderne."
    ],
    "equipment": "Laboratoires Découper un texte et Comparer les générations, feuille pour noter les effectifs, éditeur Python facultatif.",
    "steps": [
      {
        "minutes": 5,
        "kind": "Prévision",
        "activity": "tokens",
        "teacher": "Écrire « la la lala » et demander combien de morceaux de départ sont affichés.",
        "learner": "Compter et prédire l'effet d'une fusion de « l » et « a ».",
        "question": "Une fusion diminue-t-elle toujours le nombre de mots ?",
        "expected": "Elle diminue ici le nombre de morceaux traités, pas nécessairement le nombre de mots.",
        "vigilance": "Ne pas dire que tout token est un mot entier."
      },
      {
        "minutes": 15,
        "kind": "Décomposition inspectable",
        "activity": "tokens",
        "teacher": "Faire manipuler la fusion du corpus « la la lala », puis « école école ». Mentionner qu'il s'agit d'un exemple simplifié fondé sur des caractères.",
        "learner": "Relever la paire regroupée, les effectifs et le nombre de morceaux avant/après.",
        "question": "Le même texte est-il découpé de manière identique par tous les tokenizers ?",
        "expected": "Non : le vocabulaire et les règles apprises à partir d'autres corpus peuvent changer le découpage.",
        "vigilance": "La mission Python compte des paires ; elle ne réalise pas toute la procédure BPE."
      },
      {
        "minutes": 10,
        "kind": "Tirages comparés",
        "activity": "generation",
        "teacher": "Garder la graine et la température, refaire deux séries de vingt choix, puis choisir top-k égal à 1.",
        "learner": "Décrire les identités de séries puis l'effet du filtrage.",
        "question": "Ce réglage entraîne-t-il à nouveau le modèle ?",
        "expected": "Non, il sélectionne les candidats possibles à la sortie ; les scores initiaux ne changent pas.",
        "vigilance": "Vingt choix indépendants ne constituent pas une phrase générée de façon autorégressive."
      },
      {
        "minutes": 20,
        "kind": "Programmation Python",
        "activity": "tokens",
        "teacher": "Faire coder compter_paires avec deux boucles bornées, puis demander le cas limite « aaa ». Si besoin, ouvrir le défi Génération pour une seconde boucle bornée.",
        "learner": "Affecter une valeur à chaque entrée du dictionnaire des effectifs ; utiliser assert pour plusieurs corpus.",
        "question": "Pourquoi la paire (« a », « a ») apparaît-elle deux fois dans « aaa » ?",
        "expected": "Les indices 0–1 et 1–2 donnent deux occurrences qui se chevauchent.",
        "vigilance": "Ne pas confondre une occurrence chevauchante avec une fusion simultanée."
      },
      {
        "minutes": 10,
        "kind": "Transfert",
        "activity": "generation",
        "teacher": "Donner un corpus nouveau « ici ici ». Faire prévoir au moins une paire puis demander comment comparer les réglages de génération.",
        "learner": "Proposer une hypothèse, une expérience à variable unique et une limite.",
        "question": "Une génération reproductible est-elle nécessairement exacte ?",
        "expected": "Non ; reproductibilité du tirage et validité factuelle sont des propriétés distinctes.",
        "vigilance": "Ni la graine ni top-k ne certifient la vérité."
      }
    ],
    "teacherExit": "L'élève prédit une fusion, produit des effectifs vérifiés et justifie une comparaison de tirages contrôlée.",
    "scientificLimit": "Démonstration BPE simplifiée à partir de caractères ; distribution de génération réduite, différente d'un tokenizer et d'un LLM industriel."
  },
  {
    "id": "preuves-rag",
    "title": "Vérifier, rechercher et savoir s'abstenir",
    "duration": 60,
    "audience": "Terminale NSI ou formation d'enseignants novices sur la fiabilité",
    "prerequisites": "Lire une source, manipuler des chaînes et des dictionnaires ; aucun modèle distant ni compte élève.",
    "objectives": [
      "Distinguer contradiction, preuve suffisante et absence d'information.",
      "Comprendre qu'une recherche lexicale ne vérifie pas la vérité.",
      "Écrire une procédure Python simple avec cas positif, négatif et abstention."
    ],
    "equipment": "Laboratoires Détective et RAG ; documents fictifs intégrés ; navigateur ; Python en option.",
    "steps": [
      {
        "minutes": 5,
        "kind": "Diagnostic initial",
        "activity": "erreurs",
        "teacher": "Afficher une affirmation dont la source ne donne pas l'âge de Nora ; demander deux conclusions opposées.",
        "learner": "Écrire pourquoi on ne peut ni confirmer ni infirmer le nombre proposé.",
        "question": "L'absence de preuve est-elle une preuve de fausseté ?",
        "expected": "Non. Le document ne contient pas l'information demandée.",
        "vigilance": "Ne pas nommer toute information inconnue une hallucination démontrée."
      },
      {
        "minutes": 15,
        "kind": "Enquête documentaire",
        "activity": "credibilite",
        "teacher": "Faire classer trois affirmations ; chaque binôme doit citer le passage pertinent ou expliquer l'absence de passage.",
        "learner": "Reporter affirmation, extrait, verdict et justification.",
        "question": "Que faut-il montrer pour parler de contradiction ?",
        "expected": "Un passage de référence qui établit l'incompatibilité avec l'affirmation.",
        "vigilance": "La crédibilité stylistique ne prouve rien."
      },
      {
        "minutes": 15,
        "kind": "RAG : recherche et limites",
        "activity": "fiabilite",
        "teacher": "Rechercher une question présente dans les documents, puis « xyzabsent » et une reformulation avec synonymes.",
        "learner": "Lire le passage classé premier puis identifier les recherches sans résultat exploitable.",
        "question": "Un extrait bien classé prouve-t-il la réponse ?",
        "expected": "Non, on doit lire le passage et vérifier qu'il apporte bien l'information.",
        "vigilance": "Le laboratoire effectue une recherche lexicale ; il ne génère pas une réponse avec un LLM."
      },
      {
        "minutes": 15,
        "kind": "Programmation et tests",
        "activity": "fiabilite",
        "teacher": "Ouvrir la mission Python Chercher et s'abstenir ; faire expliquer la condition de présence d'une sous-chaîne et le cas vide.",
        "learner": "Coder la fonction, tester les majuscules puis un mot absent, et chercher un faux positif de sous-chaîne.",
        "question": "Pourquoi la chaîne « lac » pourrait-elle apparaître dans « placard » ?",
        "expected": "La recherche teste une sous-chaîne ; elle ignore les frontières de mots et le sens du contexte.",
        "vigilance": "Ne pas présenter ce code comme un RAG complet ni comme une recherche sémantique."
      },
      {
        "minutes": 10,
        "kind": "Transfert autonome",
        "activity": "erreurs",
        "teacher": "Donner un second mini-document fictif et une affirmation contenant un lieu absent. Faire choisir et justifier le verdict.",
        "learner": "Rédiger une réponse avec preuve, degré d'incertitude et test de vérification possible.",
        "question": "Quand faut-il répondre « je ne peux pas conclure » ?",
        "expected": "Lorsque les documents disponibles ne donnent pas une preuve suffisante et pertinente.",
        "vigilance": "Demander une source indépendante avant de conclure sur un fait sensible."
      }
    ],
    "teacherExit": "L'élève donne un verdict justifié, explique une limite de la recherche lexicale et écrit un cas de test d'abstention.",
    "scientificLimit": "La simulation RAG est lexicale, sans génération. Les citations indiquent des passages, elles ne constituent pas une preuve automatique."
  }
];
