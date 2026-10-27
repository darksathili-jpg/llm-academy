export type ExperimentId =
  | 'prediction'
  | 'tokenizer'
  | 'generation'
  | 'attention'
  | 'training'
  | 'detective'
  | 'prompting'
  | 'rag'
  | 'embeddings'
  | 'transformer';
export interface ActivitySheet {
  id: string;
  title: string;
  experiment: ExperimentId;
  duration: number;
  question: string;
  audience: string;
  prerequisites: string;
  goal: string;
  notions: string;
  instruction: string;
  manipulation: string;
  observation: string;
  science: string;
  errors: string;
  hints: string[];
  correction: string;
  criteria: string[];
  transfer: string;
  deeper: string;
  quiz: { question: string; choices: string[]; expected: number };
  python: string;
  input: string;
}
export const activities: ActivitySheet[] = [
  {
    id: 'credibilite',
    title: 'Un texte crédible peut-il être faux ?',
    experiment: 'detective',
    duration: 15,
    question:
      'Une réponse décrit une situation avec assurance. Les sources fournies confirment-elles chaque affirmation ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      'Découverte : savoir comparer des affirmations avec un texte court. Python (facultatif) : dictionnaires, expressions conditionnelles, fonctions et assertions.',
    goal: 'Distinguer fait étayé, contradiction et absence de preuve.',
    notions: 'Affirmations, sources, assertions',
    instruction:
      'Classez les affirmations du détective et choisissez un extrait pour chaque décision.',
    manipulation:
      "Comparez mot à mot une affirmation et la source ; n'utilisez pas le ton de la réponse.",
    observation:
      'Une phrase plausible peut être contredite ; un détail peut aussi rester invérifiable.',
    science:
      'La prédiction optimise une distribution de tokens. Elle ne constitue pas un mécanisme général de vérification factuelle.',
    errors: 'Confondre confiance et exactitude ; considérer absence de preuve comme fausseté.',
    hints: [
      "Comparez mot à mot une affirmation et la source ; n'utilisez pas le ton de la réponse.",
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      'Une phrase plausible peut être contredite ; un détail peut aussi rester invérifiable.',
    ],
    correction:
      'Une source contraire établit la contradiction ; sans source suffisante, concluez « insuffisant ».',
    criteria: [
      'Comparer trois phrases avec un petit texte.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer: 'Évaluer une notice scientifique sans confondre le style et la preuve.',
    deeper: "Construire deux affirmations différentes à partir d'une même source.",
    quiz: {
      question: 'Pour vérifier une phrase, que faut-il regarder ?',
      choices: ['Son ton assuré', 'Ce que dit la source', 'Sa longueur'],
      expected: 1,
    },
    python:
      'sources = {"S1": "Le laboratoire ouvre le mardi."}\naffirmation = "Le laboratoire ouvre le lundi."\nprint(affirmation == sources["S1"])\n# Faux indique une différence textuelle, pas une preuve sémantique.\nassert "mardi" in sources["S1"]\n',
    input: '',
  },
  {
    id: 'tokens',
    title: 'Comment fabriquer un tokenizer ?',
    experiment: 'tokenizer',
    duration: 25,
    question:
      'Le même texte peut être découpé en caractères, mots ou fragments. Quel découpage réutilise le mieux les répétitions ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      'Découverte : savoir compter des caractères et comparer des groupements. Python (facultatif) : chaînes de caractères, tuples, dictionnaires, boucles bornées et assertions.',
    goal: 'Prédire une fusion puis comparer le nombre de tokens avant/après.',
    notions: 'Listes, dictionnaires, boucles, fréquences ; BPE hors programme',
    instruction:
      'Sur le corpus « la la lala », prédisez la paire la plus fréquente. Appliquez une fusion, puis changez le corpus.',
    manipulation:
      'Comptez les paires adjacentes ; distinguez fréquence chevauchante et remplacements effectifs.',
    observation:
      'La fusion de « l » et « a » réduit le nombre de tokens. Le vocabulaire appris dépend du corpus.',
    science:
      'Le BPE miniature fusionne itérativement des paires fréquentes de caractères Unicode. Les IDs désignent des entrées de vocabulaire ; ils ne sont pas des valeurs de sens.',
    errors: 'Token=mot ; compter les octets comme caractères ; ignorer les paires chevauchantes.',
    hints: [
      'Comptez les paires adjacentes ; distinguez fréquence chevauchante et remplacements effectifs.',
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      'La fusion de « l » et « a » réduit le nombre de tokens. Le vocabulaire appris dépend du corpus.',
    ],
    correction:
      'Le corpus et les règles de départ déterminent le vocabulaire. Sur « aaa », deux paires sont comptées, une seule est remplacée à cette étape.',
    criteria: [
      'Voir des lettres se regrouper en morceaux réutilisables.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer: "Comparer les découpages de « école », d'un emoji et d'un mot inconnu.",
    deeper: "Implémenter le choix déterministe d'une paire à égalité de fréquence.",
    quiz: {
      question: 'Qu’est-ce qu’un token ?',
      choices: [
        'Toujours un mot entier',
        'Un morceau de texte',
        'Une preuve que la phrase est vraie',
      ],
      expected: 1,
    },
    python:
      'texte = input("Texte : ")\nfrequences = {}\nfor i in range(len(texte)-1):\n    paire = texte[i:i+2]\n    frequences[paire] = frequences.get(paire, 0) + 1\nprint(frequences)\nassert len("😀") == 1\n',
    input: 'la la lala',
  },
  {
    id: 'probabilites',
    title: 'Comment une machine prédit-elle la suite ?',
    experiment: 'prediction',
    duration: 15,
    question:
      'Le chat observe… Trois continuations ont des scores différents. Que se passe-t-il lorsque la température diminue ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      'Découverte : pourcentages, comparaison de trois quantités et somme égale à 100 %. Python (facultatif) : listes, fonctions, calculs, expressions conditionnelles et assertions.',
    goal: "Prédire puis mesurer la variation d'une distribution.",
    notions: 'Pourcentages, listes ; softmax hors programme',
    instruction: 'Notez votre hypothèse. Comparez T=1 et T=0,5, sans changer le contexte.',
    manipulation: 'Observez les trois probabilités ; vérifiez leur somme.',
    observation: 'La distribution se concentre sur le score maximal ; la somme reste 100 %.',
    science:
      "Le softmax transforme les scores divisés par T en probabilités. Les scores de cette expérience sont inventés et ne proviennent pas d'un réseau entraîné.",
    errors: 'Probabilité=certitude ; température=connaissance ; confusion score/probabilité.',
    hints: [
      'Observez les trois probabilités ; vérifiez leur somme.',
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      'La distribution se concentre sur le score maximal ; la somme reste 100 %.',
    ],
    correction:
      'À T=1, les scores 2/1/0 donnent environ 66,5/24,5/9,0 %. À T=0,5 : 86,7/11,7/1,6 %.',
    criteria: [
      'Comparer les chances de trois mots possibles.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer: 'Comparer les risques de choix dans un jeu aléatoire sans parler de vérité.',
    deeper: 'Retrouver ces valeurs en Python avec une exponentielle stabilisée.',
    quiz: {
      question: 'Que représentent les trois pourcentages affichés ?',
      choices: [
        'Toutes les chances de choix, soit 100 % au total',
        'La vérité de la phrase',
        'La quantité de connaissances de la machine',
      ],
      expected: 0,
    },
    python:
      'from math import exp\nscores = [2, 1, 0]\nt = float(input("Température : "))\nassert 0.1 <= t <= 3\npoids = [exp((s-max(scores))/t) for s in scores]\np = [x/sum(poids) for x in poids]\nprint(p)\nassert abs(sum(p)-1) < 1e-9\n',
    input: '0.5',
  },
  {
    id: 'contexte',
    title: 'Pourquoi le contexte change-t-il la prédiction ?',
    experiment: 'prediction',
    duration: 15,
    question:
      '« Le chat observe… » et « Le marin observe… » conduisent-ils aux mêmes continuations ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      "Découverte : comparer deux débuts de phrase en ne modifiant qu'un seul paramètre. Python (facultatif) : dictionnaires imbriqués, boucles bornées, fonctions et assertions.",
    goal: 'Comparer deux distributions en gardant T et graine fixes.',
    notions: 'Chaînes, paramètres, expérience contrôlée ; conditionnement hors programme',
    instruction:
      'Choisissez successivement les deux contextes à T=1. Comparez la place de « mer ».',
    manipulation: "Ne changez qu'un paramètre à la fois.",
    observation:
      'Dans ce modèle illustratif, « mer » devient la continuation la plus probable du marin.',
    science:
      "Une distribution peut dépendre du contexte ; ici nous choisissons explicitement deux listes de scores inventés. Ce mécanisme de sélection n'est pas un Transformer.",
    errors:
      'Attribuer une compréhension humaine à deux tables fixes ; changer plusieurs paramètres simultanément.',
    hints: [
      "Ne changez qu'un paramètre à la fois.",
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      'Dans ce modèle illustratif, « mer » devient la continuation la plus probable du marin.',
    ],
    correction:
      'Pour le marin, scores 0/1/2 : « mer » 66,5 %. Pour le chat, scores 2/1/0 : « mer » 9,0 %.',
    criteria: [
      'Changer le début d’une phrase et comparer les suites possibles.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer: 'Concevoir un test à variable unique pour une classification NSI.',
    deeper: 'Comparer un vrai bigramme entraîné, limité au dernier token, à cette simulation.',
    quiz: {
      question: 'Comment vérifier l’effet du début de phrase ?',
      choices: [
        'Changer tous les réglages à la fois',
        'Garder le réglage de variété identique et changer le début',
        'Ne pas comparer les résultats',
      ],
      expected: 1,
    },
    python:
      'from math import exp\ncontextes = {"chat": [2,1,0], "marin": [0,1,2]}\nfor nom, scores in contextes.items():\n    z = [exp(s-max(scores)) for s in scores]\n    print(nom, [round(x/sum(z), 3) for x in z])\n',
    input: '',
  },
  {
    id: 'representations',
    title: 'Comment représenter une information ?',
    experiment: 'embeddings',
    duration: 20,
    question:
      'Deux objets peuvent sembler proches sur un dessin tout en différant dans une dimension cachée.',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      'Découverte : lire trois coordonnées et comparer deux listes de nombres. Python (facultatif) : tuples, indices, fonctions et assertions. Cosinus et plongements vectoriels : approfondissement hors programme.',
    goal: 'Comparer une similarité complète et une projection.',
    notions: 'Tableaux doubles et coordonnées ; cosinus hors programme',
    instruction: 'Comparez les vecteurs proposés en 3D puis dans le plan XY.',
    manipulation: 'Changez le plan de projection, sans modifier les vecteurs.',
    observation: 'La proximité visuelle peut changer selon les dimensions retenues.',
    science:
      "Les vecteurs sont inventés. Le cosinus mesure une orientation numérique, pas une vérité ni une compréhension. Un vecteur nul n'a pas de cosinus défini.",
    errors:
      "Prendre une projection pour toute l'information ; croire que ces vecteurs sont appris.",
    hints: [
      'Changez le plan de projection, sans modifier les vecteurs.',
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      'La proximité visuelle peut changer selon les dimensions retenues.',
    ],
    correction:
      'Le cas proposé donne -0,6 en 3D et 1 dans le plan XY. La projection a perdu une dimension décisive.',
    criteria: [
      'Voir ce que l’on perd en cachant une information.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer: "Étudier la perte d'information d'un tableau de données réduit à deux colonnes.",
    deeper: 'Créer un autre couple trompeur et expliciter les dimensions.',
    quiz: {
      question: 'Que peut-il se passer si on cache un nombre ?',
      choices: [
        'On garde forcément toute l’information',
        'On peut perdre une différence importante',
        'Les objets deviennent réellement identiques',
      ],
      expected: 1,
    },
    python:
      'a, b = [1,0,2], [1,0,-2]\ndef produit(u,v):\n    assert len(u) == len(v)\n    return sum(x*y for x,y in zip(u,v))\nprint("3D", produit(a,b), "XY", produit(a[:2],b[:2]))\n',
    input: '',
  },
  {
    id: 'attention',
    title: 'Quelles positions une étape peut-elle consulter ?',
    experiment: 'attention',
    duration: 20,
    question:
      'Pour prédire à la deuxième position, le programme peut-il consulter un token situé après elle ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      "Découverte : savoir lire un tableau à double entrée. Python (facultatif) : listes de listes, boucles bornées imbriquées et assertions. Mécanisme d'attention : approfondissement hors programme.",
    goal: 'Prédire quels poids deviennent nuls avec un masque causal.',
    notions: 'Tableaux doubles, indices ; attention hors programme',
    instruction:
      'Choisissez la position 2. Activez puis désactivez le masque causal et observez le poids du token 3.',
    manipulation: "Prédisez d'abord le poids de la position future.",
    observation: 'Avec masque causal, le futur a exactement un poids nul.',
    science:
      "Le mécanisme réalise une moyenne pondérée de V selon Q et K. Le masque interdit certaines positions. Les poids sont inventés ; ils n'expliquent pas à eux seuls un raisonnement.",
    errors: 'Attention=explication du sens ; masque=petite probabilité plutôt que zéro.',
    hints: [
      "Prédisez d'abord le poids de la position future.",
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      'Avec masque causal, le futur a exactement un poids nul.',
    ],
    correction:
      'À la deuxième position, la troisième est interdite avec le masque causal. Sans masque, elle reçoit un poids calculé non nul.',
    criteria: [
      'Voir pourquoi un mot pas encore écrit doit rester inaccessible.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer: "Tester une fuite d'information du futur dans un jeu de données chronologique.",
    deeper: 'Modifier les valeurs V sans changer Q/K et comparer les sorties.',
    quiz: {
      question: 'Quand l’accès à la suite est bloqué, que devient la barre du mot suivant ?',
      choices: [
        'Elle vaut exactement zéro',
        'Elle devient la plus grande',
        'La machine apprend de nouveaux exemples',
      ],
      expected: 0,
    },
    python:
      'n = 3\nmasque = [[j <= i for j in range(n)] for i in range(n)]\nfor ligne in masque: print(ligne)\nassert masque[1][2] is False\n',
    input: '',
  },
  {
    id: 'apprentissage',
    title: 'Que signifie faire apprendre un mini-modèle ?',
    experiment: 'training',
    duration: 25,
    question:
      'Un mini-réseau voit quelques phrases. Peut-on réduire son erreur sans écrire les continuations à la main ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      "Découverte : comparer deux mesures d'erreur sur des jeux d'exemples distincts. Python (facultatif) : listes, boucles bornées, expressions conditionnelles, fonctions et assertions. Gradients : approfondissement hors programme.",
    goal: 'Comparer les pertes avant/après optimisation et distinguer entraînement/validation.',
    notions: 'Fonctions et tests ; gradients hors programme',
    instruction:
      'Relevez les pertes initiales. Entraînez 100 étapes. Comparez entraînement et validation.',
    manipulation:
      'Gardez un corpus de validation distinct ; observez les prédictions et les paramètres.',
    observation:
      "La perte d'entraînement peut baisser sans garantir une baisse équivalente en validation.",
    science:
      'Le réseau neural bigramme multiplie une ligne E par W. Ses gradients sont calculés et ses poids mis à jour par SGD. Il ne prend que le dernier token, sans attention.',
    errors:
      "Moins de perte=vérité ; validation incluse dans l'apprentissage ; bigramme=LLM de production.",
    hints: [
      'Gardez un corpus de validation distinct ; observez les prédictions et les paramètres.',
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      "La perte d'entraînement peut baisser sans garantir une baisse équivalente en validation.",
    ],
    correction:
      'Des poids changent réellement. Une amélioration sur le corpus vu ne garantit ni généralisation ni exactitude factuelle.',
    criteria: [
      'Comparer les erreurs avant et après des essais d’apprentissage.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer: 'Séparer les données vues et les cas nouveaux dans un algorithme de classification.',
    deeper: "Modifier un corpus, relancer de zéro et mesurer l'effet d'un entraînement long.",
    quiz: {
      question: 'Pourquoi garder des exemples pour un test séparé ?',
      choices: [
        'Pour vérifier si la machine progresse aussi sur des exemples non utilisés pour apprendre',
        'Pour garantir que toutes les réponses seront vraies',
        'Pour lui montrer les réponses du test pendant l’apprentissage',
      ],
      expected: 0,
    },
    python:
      '# Une étape de gradient sur une fonction très réduite, pas un LLM.\nx, taux = 4.0, 0.1\npertes = []\nfor _ in range(20):\n    pertes.append((x-1)**2)\n    x -= taux*2*(x-1)\nprint(pertes[0], pertes[-1])\nassert pertes[-1] < pertes[0]\n',
    input: '',
  },
  {
    id: 'generation',
    title: 'Comment comparer deux stratégies de génération ?',
    experiment: 'generation',
    duration: 20,
    question:
      'Les mêmes scores peuvent produire des suites différentes. Comment comparer les stratégies sans confondre leurs causes ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      "Découverte : comparer des tirages en ne changeant qu'un réglage. Python (facultatif) : listes, dictionnaires, boucles bornées, expressions conditionnelles et assertions.",
    goal: 'Répéter un tirage avec la même graine, puis comparer T et top-k.',
    notions: 'Listes, expériences contrôlées ; sampling hors programme',
    instruction: 'Effectuez 20 tirages avec graine 7, T=1. Recommencez puis activez top-k=1.',
    manipulation: 'Comparez les suites et les effectifs ; gardez les autres variables fixes.',
    observation: 'La même graine reproduit les tirages. Avec top-k=1, seul le score maximal reste.',
    science:
      'Un générateur pseudo-aléatoire reproductible échantillonne une distribution renormalisée. Une expérience finie ne reproduit pas exactement les fréquences théoriques.',
    errors:
      'Une graine plus élevée=plus créatif ; diversité=exactitude ; effectifs=probabilités exactes.',
    hints: [
      'Comparez les suites et les effectifs ; gardez les autres variables fixes.',
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      'La même graine reproduit les tirages. Avec top-k=1, seul le score maximal reste.',
    ],
    correction:
      'Avec top-k=1, les 20 tokens sont identiques ici ; avec la même graine et mêmes paramètres, la trace est identique.',
    criteria: [
      'Comparer des choix répétés avec les mêmes réglages.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer: 'Comparer deux algorithmes probabilistes sur un protocole reproductible.',
    deeper: 'Comparer filtrage top-k puis top-p et leur ordre.',
    quiz: {
      question: 'À quoi sert la graine dans cet essai ?',
      choices: [
        'À reproduire les mêmes choix avec les mêmes réglages',
        'À vérifier si les phrases sont vraies',
        'À apprendre de nouveaux mots',
      ],
      expected: 0,
    },
    python:
      'import random\np = [0.665, 0.245, 0.09]\ndef essais():\n    r = random.Random(7)\n    return r.choices(["lune","porte","mer"], weights=p, k=20)\nprint(essais())\nassert essais() == essais()\n# Le PRNG Python diffère du générateur JavaScript : traces non identiques entre moteurs.\n',
    input: '',
  },
  {
    id: 'erreurs',
    title: 'Pourquoi une réponse plausible peut-elle échouer ?',
    experiment: 'detective',
    duration: 20,
    question: 'Une réponse de discipline mélange des faits étayés, une invention et une erreur.',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      'Découverte : distinguer contradiction et information absente dans un document. Python (facultatif) : dictionnaires, expressions conditionnelles, fonctions et assertions.',
    goal: 'Justifier chaque classement avec une source et une limite.',
    notions: 'Spécification, comparaison, preuve ; évaluation LLM hors programme',
    instruction:
      'Choisissez une discipline différente du premier cas. Classez les affirmations et expliquez la preuve.',
    manipulation: "Ne choisissez pas une preuve parce qu'elle contient simplement les mêmes mots.",
    observation:
      "La vérification demande une relation entre l'affirmation et la source, pas seulement un recouvrement lexical.",
    science:
      "Les sorties du détective sont originales et prédéfinies. Nous n'attribuons pas leur erreur à un mécanisme unique d'un modèle inconnu.",
    errors:
      "Confondre citation présente et citation pertinente ; inventer un mécanisme causal de l'erreur.",
    hints: [
      "Ne choisissez pas une preuve parce qu'elle contient simplement les mêmes mots.",
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      "La vérification demande une relation entre l'affirmation et la source, pas seulement un recouvrement lexical.",
    ],
    correction:
      '« Insuffisant » est une conclusion correcte lorsque les sources fournies ne permettent pas de trancher.',
    criteria: [
      'Distinguer une erreur d’une information absente.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer: 'Construire une question qui oblige à signaler une incertitude documentaire.',
    deeper: "Tester l'évaluation par un pair et expliciter un désaccord.",
    quiz: {
      question: 'Si le texte ne donne pas l’âge de Nora, que conclure ?',
      choices: [
        'Nora a forcément douze ans',
        'On ne peut pas connaître son âge à partir de ce texte',
        'Nora n’a forcément pas douze ans',
      ],
      expected: 1,
    },
    python:
      'preuves = {"A": "étayé", "B": "contredit", "C": "insuffisant"}\nassert set(preuves.values()) == {"étayé", "contredit", "insuffisant"}\nfor affirmation, statut in preuves.items():\n    print(affirmation, statut)\n# Ce dictionnaire encode des corrections préparées ; il ne comprend aucun texte.\n',
    input: '',
  },
  {
    id: 'fiabilite',
    title: "Comment tester la fiabilité d'un système ?",
    experiment: 'rag',
    duration: 25,
    question:
      'Ajouter des documents suffit-il à rendre une réponse fiable ? Que faire quand la recherche ne trouve rien ?',
    audience: 'Terminale NSI ; enseignant accompagné',
    prerequisites:
      'Découverte : savoir lire et confronter une citation à une question. Python (facultatif) : chaînes de caractères, dictionnaires, boucles bornées, fonctions et assertions. RAG et TF-IDF : prolongements hors programme.',
    goal: 'Relier chaque extrait à sa source et observer une abstention.',
    notions: 'Dictionnaires, recherche, assertions ; TF-IDF/RAG hors programme',
    instruction:
      "Posez une question sur l'observatoire. Inspectez les passages, puis essayez un mot absent du corpus.",
    manipulation: 'Changez la taille des passages ; comparez les sources et les scores.',
    observation:
      "La recherche peut retourner des extraits ou s'abstenir ; leur pertinence doit encore être lue.",
    science:
      'Le mini-RAG calcule des vecteurs TF-IDF lexicaux et leur cosinus. Il assemble des extraits cités, sans générateur LLM ni embeddings sémantiques.',
    errors:
      'Cosinus=preuve ; extrait retrouvé=réponse juste ; instructions dans le document=ordres à exécuter.',
    hints: [
      'Changez la taille des passages ; comparez les sources et les scores.',
      'Relevez deux valeurs ou deux extraits précis avant de conclure.',
      "La recherche peut retourner des extraits ou s'abstenir ; leur pertinence doit encore être lue.",
    ],
    correction:
      'Un terme inconnu dans tout le corpus donne un vecteur de requête nul et une abstention. Une citation reste à examiner.',
    criteria: [
      'Lire un passage retrouvé et vérifier d’où il vient.',
      'Appuyer ma réponse sur un nombre ou un passage précis.',
      'Dire ce que l’expérience ne permet pas de conclure.',
    ],
    transfer:
      'Définir des tests positifs, négatifs et adversariaux pour un assistant documentaire.',
    deeper: 'Comparer deux découpages avec une grille de pertinence et de traçabilité.',
    quiz: {
      question: 'Un passage retrouvé contient les mots de la question. Que faire ensuite ?',
      choices: [
        'Le croire sans le lire',
        'Le lire et vérifier qu’il répond à la question',
        'Considérer son score comme une preuve de vérité',
      ],
      expected: 1,
    },
    python:
      'documents = {"S1": "L\'observatoire ouvre le mardi.", "S2": "La bibliothèque ouvre le jeudi."}\nquestion = input("Mot recherché : ").lower()\nresultats = [(id, texte) for id, texte in documents.items() if question in texte.lower()]\nprint(resultats or "Abstention")\n# Recherche de sous-chaîne, différente du TF-IDF du laboratoire.\n',
    input: 'observatoire',
  },
];
export const stages = [
  'Situation-problème',
  'Hypothèse',
  'Expérience',
  'Observation',
  'Explication',
  'Programmation',
  'Transfert',
  'Évaluation',
];
