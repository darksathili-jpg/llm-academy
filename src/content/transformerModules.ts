import type { Module } from './modules';
export const transformerModules: Module[] = [
  {
    id: '05',
    title: 'Attention',
    subtitle: 'Calculer ce qu’une position peut lire',
    duration: '75–90 min · estimation',
    problem:
      'Une visualisation montre qu’un token « regarde » un autre token. Qu’est-ce qui est réellement calculé et que doit-on empêcher pour prédire sans lire la réponse future ? Manipulez Q, K et V, puis testez les sorties plutôt que commenter uniquement les couleurs.',
    objectives: [
      'Suivre les formes Q, K, V et QKᵀ.',
      'Calculer un poids et une somme pondérée de valeurs.',
      'Appliquer le masque causal avant la normalisation.',
      'Distinguer poids, sortie, plusieurs têtes et explication causale.',
    ],
    prerequisite: 'Produit matriciel et softmax (module 04). Chaque ligne représente une position.',
    diagnostic: {
      question:
        'Une distribution [0,25 ; 0,75] pondère deux valeurs 0 et 4. Quelle est la moyenne pondérée ?',
      choices: ['1', '3', '4'],
      expected: 1,
      feedback: '0,25×0 + 0,75×4 = 3. Les poids sont multipliés par les valeurs avant l’addition.',
    },
    sections: [
      {
        title: '01 / Trois rôles dans un même calcul',
        paragraphs: [
          'Une query décrit la requête numérique d’une position ; une key sert à calculer sa compatibilité avec cette requête ; une value contient les caractéristiques qui seront mélangées. Ce sont des rôles mathématiques, pas trois catégories de mots.',
          'Dans une auto-attention de Transformer, Q=XWq, K=XWk et V=XWv proviennent de projections de la même entrée. Les paramètres des projections peuvent être différents. Dans le studio, vous fournissez Q, K et V directement afin d’isoler leur influence.',
          'Pour n positions, Q et K ont la forme n×d_k et V la forme n×d_v. Le produit QKᵀ compare chaque query à chaque key et donne n×n scores. Transposer K échange ses axes afin de rendre le produit défini.',
        ],
      },
      {
        title: '02 / De la compatibilité au mélange',
        formula: 'A=softmax_ligne(QKᵀ/√d_k) ; O=AV',
        paragraphs: [
          'Chaque score est un produit scalaire divisé par √d_k. Le softmax est appliqué séparément sur chaque ligne ; les poids autorisés d’une query totalisent 1. La sortie mélange ensuite les lignes de V selon ces poids.',
          'Si les poids valent [0,5 ; 0,5] et les valeurs scalaires 2 et 4, la sortie vaut 3. Si V change sans changer Q, K ni le masque, les poids restent identiques mais la sortie peut changer. Si Q est nul, tous les scores de sa ligne sont égaux et les poids autorisés sont uniformes.',
          'Le facteur √d_k fixe l’échelle des scores selon la dimension. Le studio utilise deux caractéristiques pour une tête, ou une caractéristique par tête lorsqu’il en affiche deux. Les tableaux donnent les scores avant normalisation et les poids calculés, arrondis uniquement à l’affichage.',
        ],
      },
      {
        title: '03 / Interdire les informations futures',
        paragraphs: [
          'Pour une prédiction autorégressive à la position i, les positions j>i ne doivent pas être accessibles. Le masque causal met leurs scores à −∞ avant le softmax. Dans notre moteur, ces entrées reçoivent exactement un poids nul.',
          'Pour trois positions, la première ligne peut lire seulement la position 0 : ses poids sont [1,0,0]. La seconde peut lire 0 et 1. La troisième peut lire les trois. La diagonale est autorisée parce que le token courant appartient déjà au contexte qui prédit le suivant.',
          'Masquer après le softmax sans renormaliser laisserait une somme des poids incorrecte. Le studio montre à la fois les scores masqués et les poids ; son mode non causal est une ablation explicite qui permet de constater la fuite du futur.',
        ],
      },
      {
        title: '04 / Plusieurs têtes, puis une projection',
        paragraphs: [
          'Des têtes distinctes peuvent former plusieurs mélanges de caractéristiques. Leurs sorties sont concaténées sur l’axe des caractéristiques, puis une projection Wo retrouve généralement la largeur du modèle.',
          'Quatre sorties de forme 3×2 donnent une concaténation 3×8, sans ajouter de positions. La projection finale doit ensuite produire la forme requise par la branche résiduelle. Les valeurs par tête ne sont pas moyennées automatiquement.',
          'Le studio découpe les colonnes des matrices saisies pour illustrer deux têtes et leur concaténation. Le module 06 montre les projections et Wo dans un passage avant complet. Aucun rôle linguistique particulier n’est attribué d’avance à une tête.',
        ],
      },
      {
        title: '05 / Une observation n’est pas une preuve causale',
        paragraphs: [
          'Un poids élevé indique un coefficient important dans ce mélange de valeurs. Il ne prouve pas à lui seul pourquoi une réponse finale a été produite : il faut aussi considérer V, la projection, les résidus et les couches suivantes.',
          'Pour tester le masque, changez seulement la dernière ligne de V en mode causal. Les premières sorties doivent rester fixes. Pour tester la séparation scores/valeurs, changez V et comparez les poids. Ces hypothèses produisent des mesures contrôlables.',
          'Les matrices inventées permettent de vérifier le calcul, sans démontrer une capacité linguistique. Une interprétation d’un modèle entraîné exigerait un autre protocole et des interventions appropriées ; une couleur sur une grille n’est pas une certification d’explication.',
        ],
      },
    ],
    hypothesis:
      'Avec le masque causal actif, prédisez l’effet d’un changement de V[2] sur les sorties 0 et 1. Comparez les nombres, puis refaites l’intervention sans masque.',
    transfer:
      'Un programme applique softmax, met les poids futurs à zéro et ne renormalise pas. Construisez un contre-exemple avec deux positions, expliquez l’erreur et décrivez le test qui détecterait ce bug.',
    rubric: [
      'Je donne les scores ou poids de départ et la position query.',
      'Je vérifie que la somme doit valoir 1 sur les positions autorisées.',
      'Je propose un masquage avant softmax et un contrôle d’absence de fuite future.',
    ],
    summary: [
      'Q et K produisent les scores ; V fournit les données mélangées.',
      'Le softmax normalise chaque ligne sur les positions autorisées.',
      'Le masque causal interdit le futur avant cette normalisation.',
      'Les têtes sont concaténées puis projetées ; les poids ne suffisent pas à expliquer une réponse.',
    ],
    developerNote:
      'Le moteur contrôle les formes, applique softmax aux seuls scores autorisés puis complète avec des zéros. Les tests comparent les sorties à une moyenne pondérée de référence et modifient uniquement les positions futures pour vérifier leur absence d’influence.',
    references: [
      {
        title: 'Vaswani et al. — Attention Is All You Need',
        url: 'https://arxiv.org/html/1706.03762v7',
        reason: 'Définition de l’attention mise à l’échelle, multi-têtes et masque.',
      },
      {
        title: 'PyTorch — scaled_dot_product_attention',
        url: 'https://docs.pytorch.org/docs/2.14/generated/torch.nn.functional.scaled_dot_product_attention.html',
        reason:
          'Conventions de calcul et de masquage ; aucune dépendance PyTorch dans notre navigateur.',
      },
    ],
  },
  {
    id: '06',
    title: 'Architecture Transformer',
    subtitle: 'Suivre un bloc, de ses tokens à ses logits',
    duration: '90–105 min · estimation',
    problem:
      'Un schéma de Transformer semble relier des boîtes, mais cache les formes et les opérations. Pouvez-vous prédire à quelle étape une dimension change, où le futur est bloqué et ce qu’un résidu additionne ? Traversez un bloc miniature entièrement calculé.',
    objectives: [
      'Suivre les formes des activations d’un bloc causal.',
      'Distinguer information de position, normalisation et mélange par attention.',
      'Vérifier les additions résiduelles et le FFN positionnel.',
      'Relier la dernière représentation à une distribution sur le vocabulaire sans attribuer une performance à des poids non entraînés.',
    ],
    prerequisite: 'Embeddings, produit matriciel, softmax et attention (modules 03–05).',
    diagnostic: {
      question:
        'X a la forme 3×4 et une branche F(X) possède la même forme. Quelle est la forme de X+F(X) ?',
      choices: ['6×4', '3×8', '3×4'],
      expected: 2,
      feedback:
        'Une addition conserve la forme 3×4. Elle additionne les coefficients correspondants, sans concaténer les lignes ou les colonnes.',
    },
    sections: [
      {
        title: '01 / Des tokens, des positions et une largeur',
        paragraphs: [
          'Une séquence de n ID sélectionne n lignes dans une table d’embeddings de largeur d_model. L’entrée est donc n×d_model. Cette largeur est le nombre de caractéristiques par position, pas la longueur de contexte.',
          'Le Transformer Explorer ajoute à chaque ligne un codage positionnel sinus/cosinus de même forme. À la position 0, les composantes alternent 0 et 1. Le mécanisme permet de présenter des entrées différentes selon l’ordre des tokens.',
          'Les positions sinusoïdales sont un choix de notre démonstration. GPT-2 emploie des embeddings positionnels appris ; d’autres architectures utilisent d’autres mécanismes. Le laboratoire n’affirme pas reproduire tous les choix d’un modèle nommé GPT.',
        ],
      },
      {
        title: '02 / Normaliser et projeter',
        formula: 'LN(x)=(x−moyenne(x))/√(variance(x)+epsilon)',
        paragraphs: [
          'Notre bloc emploie une pré-normalisation : la normalisation précède chaque sous-couche. LayerNorm calcule ici la moyenne et la variance sur les caractéristiques de chaque position séparément. Elle ne mélange donc pas les tokens entre eux.',
          'Nous fixons gamma à 1, beta à 0 et epsilon à 10⁻⁵. La variance est divisée par le nombre de caractéristiques. Une ligne constante devient une ligne nulle, sans division par zéro. Dans un modèle entraîné, les paramètres affines et les autres poids peuvent être appris.',
          'La première représentation normalisée est projetée vers Q, K et V. Leurs colonnes sont ensuite réparties entre h têtes, avec d_k=d_v=d_model/h. Le moteur refuse un nombre de têtes qui ne divise pas cette largeur.',
        ],
      },
      {
        title: '03 / Mélanger, puis préserver un chemin direct',
        paragraphs: [
          'Chaque tête effectue l’attention causale étudiée au module 05. Les sorties sont concaténées puis multipliées par Wo. Le résultat retrouve n×d_model, afin de pouvoir l’ajouter à l’entrée X.',
          'Ce calcul X+attention est une connexion résiduelle. Il offre un chemin direct pour les valeurs de X tout en ajoutant une transformation. Il ne garantit pas à lui seul la réussite d’un entraînement ; il impose aussi une compatibilité de formes.',
          'La case « connexions résiduelles » permet de retirer les deux additions pour une comparaison mesurée. Ce retrait est une ablation de cette miniature. L’écart affiché est calculé sur sa distribution finale, pas extrapolé à un modèle entraîné.',
        ],
      },
      {
        title: '04 / Transformer les caractéristiques de chaque position',
        formula: 'FFN(x)=ReLU(xW1)W2',
        paragraphs: [
          'Après la deuxième normalisation, une projection W1 élargit les caractéristiques, puis ReLU remplace les valeurs négatives par zéro. W2 projette le résultat vers d_model. Nous choisissons une largeur interne de 2×d_model, sans biais, pour garder les tableaux lisibles.',
          'Ce feed-forward network utilise les mêmes poids à chaque position mais traite les lignes séparément. Il ne mélange pas les tokens ; l’attention réalise ce mélange. La sortie FFN doit revenir à n×d_model avant la seconde addition résiduelle.',
          'Le laboratoire affiche les matrices après l’expansion, la non-linéarité et la reprojection. Il ne représente pas ces opérations par une animation arbitraire. Le choix de ReLU est illustratif ; des architectures réelles peuvent choisir d’autres activations et largeurs.',
        ],
      },
      {
        title: '05 / Un passage avant ne signifie pas un modèle compétent',
        paragraphs: [
          'Une normalisation finale précède la projection sur les six tokens du vocabulaire miniature. Chaque ligne contient six logits ; le softmax de la dernière ligne donne la distribution du prochain token selon cette construction.',
          'Tous les poids sont issus d’une formule déterministe, inspectable dans le laboratoire. Aucun entraînement, dropout ou ajustement de langage n’est effectué. Une distribution normalisée est donc un résultat de calcul valide, sans capacité linguistique démontrée.',
          'Le Transformer original de 2017 est un encodeur-décodeur. Une architecture autorégressive de type GPT utilise une pile causale adaptée à la continuation. Notre bloc illustre cette circulation avec des simplifications explicites ; la phase suivante ajoutera un modèle miniature entraînable, des données et des évaluations.',
        ],
      },
      {
        title: '06 / Tester une architecture par ses invariants',
        paragraphs: [
          'Changez uniquement le dernier token lorsque le masque est actif. L’attention n’autorise pas les positions précédentes à le lire ; les normalisations et le FFN restent positionnels. Leurs logits doivent donc rester identiques. Le test unitaire contrôle cet invariant jusqu’à la projection finale.',
          'Changez ensuite une seule option : positions, résidus ou causalité. Comparez les étapes et la distribution à la configuration complète avec les mêmes tokens, dimensions et têtes. Ces interventions isolent des effets du calcul, sans mesurer une performance d’application.',
          'Lorsque les dimensions changent, les poids de démonstration sont reconstruits avec la même formule. Une comparaison entre largeurs n’est donc pas une comparaison de modèles entraînés identiques. Notez toujours la configuration et la donnée observée.',
        ],
      },
    ],
    hypothesis:
      'Avec n=3, d_model=4 et h=2, prévoyez les formes d’une tête, de la concaténation et de l’expansion FFN. Parcourez ensuite les étapes pour contrôler chaque prédiction.',
    transfer:
      'Un collègue a retiré le masque causal parce que les sorties lui semblent meilleures. Proposez un test où changer uniquement le token futur révèle une fuite dans les logits antérieurs. Expliquez pourquoi une différence de distribution ne constitue pas une amélioration linguistique mesurée.',
    rubric: [
      'Je fixe les tokens précédents et tous les poids lors du test.',
      'Je compare les premières lignes des logits avec et sans masque.',
      'Je distingue invariant architectural, ablation et évaluation de performance.',
    ],
    summary: [
      'La largeur des caractéristiques et la longueur de séquence sont deux axes distincts.',
      'L’attention mélange les positions ; normalisation et FFN opèrent ici par position.',
      'Une branche doit retrouver la forme de son résidu avant l’addition.',
      'Des poids non entraînés permettent de vérifier une architecture, pas de certifier une capacité linguistique.',
    ],
    developerNote:
      'Le bloc pré-normalisé possède un chemin causal testé jusqu’aux logits. Les poids, les activations et les formes sont inspectables. Le pipeline est déterministe et sans état caché : une même séquence et une même configuration donnent le même résultat.',
    references: [
      {
        title: 'Vaswani et al. — Attention Is All You Need',
        url: 'https://arxiv.org/html/1706.03762v7',
        reason: 'Architecture encodeur-décodeur originale, positions sin/cos et sous-couches.',
      },
      {
        title: 'Radford et al. — GPT-2, rapport original',
        url: 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf',
        reason: 'Architecture autorégressive et changements de normalisation.',
      },
      {
        title: 'PyTorch — LayerNorm',
        url: 'https://docs.pytorch.org/docs/2.14/generated/torch.nn.LayerNorm.html',
        reason: 'Variance, paramètres affines et epsilon de normalisation.',
      },
    ],
  },
];
