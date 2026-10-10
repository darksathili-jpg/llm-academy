import type { Module } from './modules';
export const module08: Module = {
  id: '08',
  title: 'Entraînement',
  subtitle: 'Suivre les gradients, mesurer l’apprentissage et la généralisation',
  duration: '90–120 min · estimation',
  problem:
    'La courbe d’entraînement baisse mais une continuation nouvelle devient moins probable. Le modèle s’améliore-t-il ? Calculez les gradients, effectuez de vraies mises à jour et comparez deux ensembles qui jouent des rôles différents.',
  objectives: [
    'Relier l’entropie croisée à un gradient de logits.',
    'Effectuer une mise à jour SGD sur un modèle neuronal miniature.',
    'Comparer entraînement, validation et objectif régularisé.',
    'Identifier surapprentissage, fuite de données et limites d’une mesure.',
  ],
  prerequisite: 'Modules 04 et 07 : produit matriciel, perte, dérivation et cibles décalées.',
  diagnostic: {
    question:
      'Si la cible a p=0,25, quel est son gradient de logit pour une seule entropie croisée ?',
    choices: ['0,25', '−0,75', '−ln(0,25)'],
    expected: 1,
    feedback:
      'Le gradient est p−1 pour la cible, soit −0,75. La perte vaut −ln(0,25), mais perte et dérivée sont des objets différents.',
  },
  sections: [
    {
      title: '01 / Choisir un modèle inspectable',
      paragraphs: [
        'Pour inspecter toute la rétropropagation, nous réduisons le modèle à deux matrices : E de forme V×d et W de forme d×V. Pour un token i, z=E[i]W. Softmax fournit les probabilités du token suivant. Les paramètres sont réellement modifiés, à partir d’une initialisation pseudo-aléatoire de graine 7.',
        'C’est un modèle neuronal de langage bigramme : sa prédiction ne dépend que du token précédent. Il ne possède ni attention, ni positions, ni contexte long. Il permet de comprendre la chaîne de dérivation ; il ne doit pas être présenté comme l’entraînement du Transformer du module 06.',
        'La capacité factorisée E·W et le contexte d’un seul token imposent des limites différentes. Même une excellente optimisation ne permet pas de distinguer deux contextes ayant le même dernier token. Le notebook complémentaire mini-GPT augmente le contexte avec une attention causale.',
      ],
    },
    {
      title: '02 / La dérivée de l’entropie croisée',
      paragraphs: [
        'Pour z, p=softmax(z) et la cible y, la perte est logsumexp(z)−z[y]. Sa dérivée est p[j]−1 si j est la cible, et p[j] sinon. Les dérivées des logits s’additionnent à zéro : déplacer tous les logits d’une même constante ne change pas la perte.',
        'Pour un lot de N paires, le laboratoire divise chaque contribution par N afin d’optimiser une moyenne. La chaîne de dérivation donne dW=Eᵀdz et dE=dzWᵀ. Les contributions visant la même ligne E sont accumulées avant toute mise à jour.',
        'Nous comparons le gradient analytique à une différence finie centrale sur chaque paramètre dans les tests. Le script Python modifiable reprend exactement corpus, graine, poids et une mise à jour. Modifier epsilon permet de discuter erreur de troncature et précision numérique.',
      ],
      formula: '∂L/∂z_j = p_j − 1[j=y] ; moyenne de lot : division par N',
    },
    {
      title: '03 / Optimiser ne consiste pas à dessiner une courbe',
      paragraphs: [
        'SGD soustrait au poids le taux d’apprentissage multiplié par son gradient. Les courbes sont recalculées avec les nouveaux poids, après chaque mise à jour. Le laboratoire utilise le lot complet, sans momentum, avec un maximum de 400 pas par expérience.',
        'Un taux trop petit peut donner peu de progrès dans ce budget ; un taux élevé peut provoquer oscillations ou dégradation. Nous n’imposons pas une forme prédéfinie de courbe. Le clipping global limite ici la norme du gradient à 5 et son déclenchement est rapporté. Cette limite stabilise certains calculs, sans garantir la convergence.',
        'La pénalité L2 ajoute λ/2·somme(θ²) à l’objectif et λθ au gradient. Les deux courbes affichent la perte de prédiction sans pénalité pour rester comparables. L’objectif pénalisé est affiché séparément. Cet ajout au gradient n’est pas automatiquement équivalent à AdamW avec décroissance découplée.',
      ],
      formula: 'θ_suivant = θ − η · gradient ; objectif = perte moyenne + λ/2 · Σ θ²',
    },
    {
      title: '04 / Les ensembles n’ont pas le même rôle',
      paragraphs: [
        'Seules les paires d’entraînement contribuent aux gradients. La validation sert à mesurer des continuations distinctes avec les mêmes paramètres. Nos phrases sont originales, le split est explicite et les limites de taille maintiennent les calculs inspectables.',
        'Un mot absent du vocabulaire d’entraînement est refusé en validation au lieu de modifier discrètement le vocabulaire. Les corpus affichés peuvent être édités ; le bouton d’application les valide ensemble puis réinitialise poids et historique. Des modifications en attente désactivent l’entraînement pour éviter un mélange d’expériences.',
        'Choisir sans cesse les hyperparamètres en regardant la validation adapte indirectement votre choix à cet ensemble. Un test final séparé reste nécessaire pour une évaluation finale. Le petit laboratoire ne remplace pas ce protocole de test.',
      ],
    },
    {
      title: '05 / Observer un écart de généralisation',
      paragraphs: [
        'Surapprendre signifie améliorer les exemples observés sans amélioration comparable sur les données visées hors entraînement. Comparez les pertes, les corpus et le nombre de pas ; ne concluez pas uniquement à partir d’une séparation visuelle entre courbes.',
        'Répétez une phrase à l’entraînement et inversez une continuation dans la validation. Vous créez volontairement un décalage de distribution. Une validation plus mauvaise peut refléter ce décalage, une capacité insuffisante ou un choix d’optimisation, et ne prouve pas à elle seule un mécanisme unique.',
        'Une perte moyenne donne un critère de prédiction. Elle ne mesure pas la justesse des faits, la sécurité ni la qualité d’une application. La perplexité exp(perte) n’est comparable que pour des tokenisations et protocoles cohérents ; un petit vocabulaire rend les comparaisons aux LLM modernes trompeuses.',
      ],
    },
    {
      title: '06 / Garder une trace reproductible',
      paragraphs: [
        'Notez les corpus, leur tokenisation, la graine, les dimensions, le taux, λ, le clipping et les pas. Le tableau expose les 30 dernières mesures tandis que la courbe conserve tout l’historique de l’expérience courante. Le carnet permet de conserver votre interprétation.',
        'Python est facultatif et chargé uniquement au lancement. Le calcul s’exécute dans un Worker : vous pouvez l’arrêter, et un délai de 60 secondes limite les exécutions bloquées. Le téléchargement externe nécessite une connexion ; les laboratoires TypeScript restent utilisables hors ligne.',
        'Le notebook bigram-lora.ipynb vérifie les gradients analytiques contre autograd, puis entraîne et adapte le même modèle. Le notebook mini-gpt.ipynb entraîne un bloc causal plus riche ; ses mesures ne se confondent pas avec les courbes du modèle bigramme.',
      ],
    },
  ],
  hypothesis:
    'Avec les corpus par défaut et η=0,8, prédisez l’évolution après 20 puis 100 pas. Relevez les deux pertes. Changez une seule variable, puis réinitialisez les poids avant de comparer.',
  transfer:
    'Rédigez un journal d’expérience pour comparer η=0,2 et η=2 sur les mêmes corpus et la même graine. Donnez les mesures, votre critère de sélection, une hypothèse alternative à « le modèle a mémorisé », et la place d’un test final.',
  rubric: [
    'Je conserve corpus, initialisation et budget constants entre comparaisons.',
    'Je donne les pertes réellement observées, pas une forme de courbe supposée.',
    'Je distingue objectif pénalisé et perte de prédiction.',
    'Je ne transforme pas la validation en données de gradient ni en test final.',
  ],
  summary: [
    'Le gradient cible vaut p−1 ; la moyenne de lot divise par N.',
    'La chaîne de dérivation accumule les contributions avant SGD.',
    'La validation est une mesure avec poids fixes.',
    'Une baisse d’entraînement ne prouve ni généralisation ni fiabilité factuelle.',
  ],
  developerNote:
    'gradients calcule E/W sans mutation ; trainStep retourne de nouveaux poids. Tests numériques indépendants par différences finies, conservation des corpus et séparation des paires. Les mesures après mise à jour et l’objectif pénalisé sont distincts. Le Worker Python est créé au clic puis terminé à l’annulation ou au changement de page.',
  references: [
    {
      title: 'PyTorch — CrossEntropyLoss 2.14',
      url: 'https://docs.pytorch.org/docs/2.14/generated/torch.nn.CrossEntropyLoss.html',
      reason: 'La perte attend des logits non normalisés et des indices de cibles.',
    },
    {
      title: 'PyTorch — Autograd',
      url: 'https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html',
      reason: 'Accumulation des gradients et rétropropagation.',
    },
    {
      title: 'Pyodide 0.28.3 — Web Workers',
      url: 'https://pyodide.org/en/0.28.3/usage/webworker.html',
      reason: 'Exécuter Python hors du fil principal ; runtime épinglé et chargé à la demande.',
    },
  ],
};
