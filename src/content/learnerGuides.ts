export interface LearnerGuide {
  title: string;
  goal: string;
  question: string;
  example: string;
  tryIt: string;
  guess: string;
  observe: string;
  explain: string;
  transfer: string;
  hint: string;
  glossary: [string, string][];
}
export const learnerGuides: Record<string, LearnerGuide> = {
  credibilite: {
    title: 'Une réponse bien écrite est-elle forcément vraie ?',
    goal: 'Comparer trois phrases avec un petit texte.',
    question: 'Si une réponse paraît convaincante, comment savoir si elle est juste ?',
    example: 'Nora referme une fenêtre. Quelqu’un écrit pourtant : « Nora ouvre la fenêtre. »',
    tryIt:
      'Lis le texte de Nora. Pour chaque phrase, choisis : le texte la confirme, le texte dit le contraire, ou le texte ne permet pas de savoir. Choisis ensuite le passage qui explique ta décision.',
    guess: 'Une phrase bien rédigée peut-elle dire le contraire du texte de départ ? Pourquoi ?',
    observe:
      'Quelle phrase est confirmée ? Laquelle est contredite ? Que sais-tu de l’âge de Nora ?',
    explain:
      'Une phrase peut être bien écrite et fausse. Pour vérifier, on compare ce qu’elle affirme avec une source : ici, le petit texte de Nora. Si le texte ne donne pas son âge, on ne peut pas le deviner.',
    transfer: 'Quelqu’un affirme : « Nora a douze ans. » Que lui réponds-tu à partir du texte ?',
    hint: 'Repère les mots « referma » et « ouvre ». Ils décrivent deux gestes contraires.',
    glossary: [
      ['Étayé', 'Le texte confirme la phrase.'],
      ['Contredit', 'Le texte dit le contraire.'],
      ['Insuffisant', 'Le texte ne donne pas assez d’informations.'],
    ],
  },
  tokens: {
    title: 'Pourquoi découper un texte en petits morceaux ?',
    goal: 'Voir des lettres se regrouper en morceaux réutilisables.',
    question: 'Une machine traite-t-elle une phrase comme un seul bloc ?',
    example:
      'Dans « la la lala », les lettres « l » et « a » reviennent souvent l’une à côté de l’autre.',
    tryIt:
      'Dans « Texte à découper », garde « la la lala ». Compte les morceaux, puis clique une fois sur « Fusion suivante ». Compare le nombre et la forme des morceaux avant et après.',
    guess:
      'Si on regroupe « l » et « a » en un seul morceau « la », restera-t-il autant de morceaux ?',
    observe:
      'Combien de morceaux vois-tu avant et après le regroupement ? Quel morceau revient souvent ?',
    explain:
      'La machine travaille sur des morceaux de texte. Un morceau peut être une lettre, une partie de mot ou un mot entier. On appelle ces morceaux des « tokens ». Ici, on regroupe des lettres qui reviennent souvent ensemble ; cela ne leur donne pas une signification.',
    transfer: 'Essaie « école école ». Quelles lettres pourrais-tu regrouper ?',
    hint: 'Compte les morceaux séparés. Clique une seule fois sur « Fusion suivante », puis recompte.',
    glossary: [
      ['Token', 'Un morceau de texte traité par la machine.'],
      ['Corpus', 'Le texte utilisé comme exemple pour apprendre des regroupements.'],
      ['Fusion', 'Le regroupement de deux morceaux en un seul.'],
    ],
  },
  probabilites: {
    title: 'Comment choisir le mot qui vient ensuite ?',
    goal: 'Comparer les chances de trois mots possibles.',
    question:
      'Après « Le chat observe… », plusieurs mots sont possibles. Comment la machine choisit-elle ?',
    example:
      'Le mot « lune » peut avoir plus de chances d’être choisi que « porte ». Cela ne prouve pas qu’un chat regarde réellement la lune.',
    tryIt:
      'Garde le début de phrase « Le chat observe… ». Déplace le curseur « Température » de 1 à 0,5. Regarde la barre du mot « lune » : grandit-elle ou diminue-t-elle ?',
    guess:
      'Penses-tu qu’un réglage plus bas favorisera encore davantage le mot déjà le plus probable ?',
    observe:
      'Note les chances du mot « lune » avant et après. Une barre plus longue signifie davantage de chances d’être choisi.',
    explain:
      'La machine répartit les chances entre plusieurs mots possibles. Le réglage appelé « température » change cette répartition : plus bas, il favorise davantage le premier choix. Il ne rend pas la réponse plus vraie. Dans cet exemple, les préférences de départ sont choisies par nous, pas apprises par une IA.',
    transfer:
      'Un mot a 90 % de chances d’être choisi. Cela signifie-t-il que la phrase est vraie à 90 % ? Explique la différence.',
    hint: 'Compare seulement la première barre. Ne change pas le début de phrase en même temps.',
    glossary: [
      ['Probabilité', 'La chance qu’un choix soit fait : 50 % signifie une chance sur deux.'],
      ['Température', 'Un réglage de la diversité des choix ; ce n’est pas une mesure de chaleur.'],
    ],
  },
  contexte: {
    title: 'Pourquoi le début de la phrase compte-t-il ?',
    goal: 'Changer le début d’une phrase et comparer les suites possibles.',
    question: 'Après « Le chat observe… » et « Le marin observe… », attends-tu les mêmes mots ?',
    example: 'Le mot « mer » paraît plus attendu avec un marin qu’avec un chat.',
    tryIt:
      'Garde « Température » à 1. Dans « Début de phrase », choisis le chat, puis le marin. Compare uniquement la barre « mer ».',
    guess: 'Avec quel début de phrase le mot « mer » aura-t-il le plus de chances d’être choisi ?',
    observe: 'Les chances du mot « mer » sont-elles identiques dans les deux cas ?',
    explain:
      'Ce qui est déjà écrit aide à choisir la suite : c’est le « contexte ». Ici, deux listes de préférences ont été préparées pour le chat et le marin. La simulation illustre l’effet du début de phrase ; elle ne comprend pas ces personnages.',
    transfer: 'Propose deux débuts de phrase pour lesquels tu n’attends pas la même suite.',
    hint: 'Change seulement le personnage. Lis le pourcentage de « mer » dans chacun des deux cas.',
    glossary: [
      ['Contexte', 'Le texte déjà disponible au moment de choisir la suite.'],
      ['Température', 'Le réglage qui rend les choix plus ou moins variés.'],
    ],
  },
  representations: {
    title: 'Deux objets semblables cachent-ils une différence ?',
    goal: 'Voir ce que l’on perd en cachant une information.',
    question:
      'Si on ne regarde que deux nombres sur trois, peut-on croire à tort que deux objets sont identiques ?',
    example: 'A est décrit par [1, 0, 2] et B par [1, 0, −2]. Le troisième nombre les distingue.',
    tryIt:
      'Regarde les trois nombres de A et B. Coche « Montrer seulement le plan XY » : le troisième nombre est alors ignoré. Compare le résultat.',
    guess: 'Les deux objets paraîtront-ils identiques si on cache le troisième nombre ?',
    observe:
      'Quel nombre diffère entre A et B ? Que devient la comparaison quand ce nombre est caché ?',
    explain:
      'On peut décrire une information par une liste de nombres, appelée « vecteur ». Si on n’en regarde qu’une partie, on peut perdre une différence importante. Les listes de cet exemple sont inventées ; elles ne représentent pas des mots appris par une IA.',
    transfer:
      'Deux élèves ont la même note en français et en maths, mais des notes différentes en histoire. Que perd-on si on compare seulement les deux premières matières ?',
    hint: 'Compare les nombres une colonne à la fois : les deux premiers sont identiques, le troisième ne l’est pas.',
    glossary: [
      ['Vecteur', 'Une liste de nombres pour décrire une information.'],
      ['Plan XY', 'Ici, les deux premiers nombres, en ignorant le troisième.'],
      ['Cosinus', 'Le nom du calcul de comparaison affiché ; il ne juge pas la vérité.'],
    ],
  },
  attention: {
    title: 'Quels mots la machine peut-elle regarder ?',
    goal: 'Voir pourquoi un mot pas encore écrit doit rester inaccessible.',
    question:
      'Pour écrire la suite, la machine peut-elle s’aider de mots qui n’existent pas encore ?',
    example:
      'Dans « Le chat observe », plaçons-nous au mot « chat ». Le mot « observe » est situé après lui.',
    tryIt:
      'Choisis la position « 2 — chat ». Laisse « Masque causal » coché, puis clique sur « Calculer les poids ». Regarde la barre « 3 · observe ». Décoche ensuite la case et recalcule.',
    guess: 'Le mot « observe », placé après « chat », doit-il pouvoir aider à calculer « chat » ?',
    observe:
      'La barre « observe » est-elle à zéro quand la case est cochée ? Que change le fait de la décocher ?',
    explain:
      'Lorsqu’un modèle écrit la suite d’un texte, il dispose des morceaux précédents, pas de la suite à venir. La case bloque l’accès aux positions suivantes. Les pourcentages montrent comment ce petit calcul répartit l’utilisation des positions autorisées ; ils ne montrent pas une pensée humaine.',
    transfer:
      'Pourquoi serait-il trompeur d’utiliser la réponse d’un exercice pour prétendre qu’on l’a trouvée sans la connaître ?',
    hint: 'Garde la deuxième position. Compare seulement la dernière barre, avec puis sans la case cochée.',
    glossary: [
      [
        'Attention',
        'Un calcul qui combine des informations provenant de plusieurs morceaux de texte.',
      ],
      [
        'Masque causal',
        'La règle qui empêche de consulter les morceaux situés après la position étudiée.',
      ],
      ['Poids', 'La part attribuée à chaque position dans le calcul.'],
    ],
  },
  apprentissage: {
    title: 'Que change l’entraînement d’une machine ?',
    goal: 'Comparer les erreurs avant et après des essais d’apprentissage.',
    question:
      'Comment vérifier qu’une machine a progressé, plutôt que seulement répété ses exemples ?',
    example:
      'On lui montre des suites de mots, puis on la teste sur d’autres suites qui n’ont pas servi à la faire apprendre.',
    tryIt:
      'Note les deux valeurs d’erreur. Clique une fois sur « Entraîner 100 étapes ». Compare les valeurs et les deux courbes.',
    guess:
      'Après des essais d’apprentissage, les erreurs diminueront-elles aussi sur les exemples gardés pour le test ?',
    observe: 'Quelle erreur a baissé ? Les deux courbes évoluent-elles de la même façon ?',
    explain:
      'À chaque essai, la machine ajuste ses nombres pour mieux choisir le mot suivant. On vérifie aussi ses erreurs sur des exemples qui ne servent pas à ces ajustements. Progresser sur les premiers exemples ne suffit pas à prouver qu’elle réussira ailleurs, ni que ses phrases seront vraies.',
    transfer:
      'Pourquoi ne faut-il pas donner exactement les questions du contrôle pendant l’entraînement ?',
    hint: 'La courbe « entraînement » concerne les exemples utilisés pour apprendre ; « validation » concerne ceux gardés pour le test.',
    glossary: [
      ['Entraînement', 'Les essais pendant lesquels la machine ajuste ses réglages.'],
      ['Validation', 'Le test sur des exemples exclus de ces ajustements.'],
      [
        'Perte',
        'Le nombre qui mesure ici l’erreur de prédiction : plus bas signifie moins d’erreur sur ces exemples.',
      ],
    ],
  },
  generation: {
    title: 'Pourquoi deux réponses peuvent-elles être différentes ?',
    goal: 'Comparer des choix répétés avec les mêmes réglages.',
    question:
      'Si plusieurs mots sont possibles, la machine doit-elle toujours choisir le premier ?',
    example: 'On refait vingt choix de mots dans les mêmes conditions pour comparer les résultats.',
    tryIt:
      'Garde « Graine » à 7, « Température » à 1 et « Top-k » désactivé. Clique deux fois sur « Effectuer 20 tirages ». Compare les listes. Choisis ensuite « Top-k : 1 » et refais les vingt choix.',
    guess: 'Si on autorise un seul mot, les vingt choix pourront-ils être différents ?',
    observe:
      'Les deux premières listes sont-elles identiques ? Combien de mots différents restent-ils avec « Top-k : 1 » ?',
    explain:
      'Une machine peut choisir parmi plusieurs mots, en donnant plus de chances à certains. Ici, le nombre nommé « graine » permet de reproduire les mêmes choix. Quand on autorise seulement le premier mot, les résultats deviennent identiques. On répète ici un seul choix de mot : ce n’est pas encore la fabrication d’une phrase entière.',
    transfer:
      'Pour comparer deux réglages, pourquoi faut-il garder les autres conditions identiques ?',
    hint: '« Top-k : 1 » signifie : n’autoriser qu’un seul mot. Observe alors les vingt résultats.',
    glossary: [
      ['Graine', 'Un nombre qui permet de refaire la même suite de choix.'],
      ['Top-k', 'Le nombre de mots candidats que l’on garde.'],
      ['Top-p', 'Un autre réglage de sélection ; laisse-le à 1 pour cette activité.'],
      ['Température', 'Le réglage qui rend les choix plus ou moins variés.'],
    ],
  },
  erreurs: {
    title: 'Quand faut-il répondre « on ne sait pas » ?',
    goal: 'Distinguer une erreur d’une information absente.',
    question: 'Si un document ne donne pas une information, faut-il la compléter au hasard ?',
    example: 'Le texte dit que Nora referme la fenêtre, mais ne donne pas son âge.',
    tryIt:
      'Dans le détective, lis les trois phrases sur Nora. Cherche pour chacune ce qui est écrit dans le texte. Pour son âge, choisis « insuffisant » et « aucune » comme preuve.',
    guess: 'Peut-on conclure que Nora a douze ans ? Peut-on conclure qu’elle ne les a pas ?',
    observe:
      'Quelle phrase est fausse d’après le texte ? Pour laquelle manque-t-il simplement une information ?',
    explain:
      'Deux situations sont différentes : le texte peut dire le contraire d’une phrase, ou ne rien dire à son sujet. Dans le second cas, la bonne réponse est « on ne sait pas à partir de ce texte ». Inventer le détail manquant peut produire une réponse convaincante mais sans preuve.',
    transfer:
      'Un document donne une date mais aucun lieu. Que répondre si on te demande où l’événement s’est produit ?',
    hint: 'L’absence d’âge ne prouve aucun âge. Elle ne prouve pas non plus que « douze ans » est faux.',
    glossary: [
      ['Hallucination', 'Une information produite sans fondement suffisant, parfois inventée.'],
      ['Source', 'Le document auquel on se réfère pour vérifier une affirmation.'],
    ],
  },
  fiabilite: {
    title: 'Comment retrouver une réponse dans des documents ?',
    goal: 'Lire un passage retrouvé et vérifier d’où il vient.',
    question: 'Une réponse accompagnée d’un extrait est-elle plus facile à vérifier ?',
    example:
      'La question concerne un observatoire. On cherche d’abord les passages qui parlent de cet observatoire.',
    tryIt:
      'Garde la question proposée et clique sur « Retrouver les passages ». Lis le premier extrait et sa référence. Remplace ensuite la question par « xyzabsent » et relance la recherche.',
    guess: 'Si aucun document ne contient les mots cherchés, faut-il inventer une réponse ?',
    observe: 'Quel document contient le premier passage ? Que se passe-t-il avec « xyzabsent » ?',
    explain:
      'On cherche d’abord des passages dans les documents, puis on les utilise pour préparer une réponse. Dans ce petit exemple, la recherche compare les mots et recopie des extraits : aucune IA ne rédige une réponse. Une référence permet de retrouver le document ; elle ne garantit pas à elle seule que l’extrait répond bien à la question.',
    transfer:
      'Un extrait contient le bon mot mais parle d’un autre sujet. Est-ce une preuve suffisante ? Pourquoi ?',
    hint: 'Une référence comme [S1:…] désigne un passage du document S1. Lis le passage, pas seulement son score.',
    glossary: [
      ['RAG', 'Une méthode qui retrouve des documents pour aider à préparer une réponse.'],
      [
        'Abstention',
        'Le choix de ne pas fournir de réponse quand on n’a pas de passage utilisable.',
      ],
      ['Score', 'Un nombre servant à classer les passages, pas à certifier leur vérité.'],
    ],
  },
};
export const plainSteps = [
  'La question',
  'Avant d’essayer',
  'À toi d’essayer',
  'Ce que tu observes',
  'Ce que ça signifie',
  'Coder (facultatif)',
  'Un autre exemple',
  'Vérifier ta compréhension',
];
