import type { Module } from './modules';
export const module09: Module = {
  id: '09',
  title: 'Génération et adaptation',
  subtitle: 'Séparer distribution, hasard et modification des paramètres',
  duration: '90–120 min · estimation',
  problem:
    'Une réponse varie quand vous changez la température. Une autre varie après adaptation. Ces changements modifient-ils les mêmes objets ? Manipulez une distribution, examinez les tirages, puis adaptez réellement des paramètres en conservant une base fixe.',
  objectives: [
    'Calculer une distribution après température, top-k et top-p.',
    'Interpréter un tirage reproductible sans confondre fréquence et probabilité.',
    'Distinguer prompting, sampling, pré-entraînement et adaptation.',
    'Vérifier une mise à jour de bas rang et le gel des poids de base.',
  ],
  prerequisite: 'Modules 01, 07 et 08 : probabilité conditionnelle, autorégression et gradients.',
  diagnostic: {
    question:
      'Pour des probabilités triées [0,5;0,3;0,2] et top-p=0,6, combien de tokens faut-il garder ?',
    choices: ['1', '2', '3'],
    expected: 1,
    feedback:
      'Le premier token cumule 0,5, en dessous de 0,6. On inclut le second : cumul 0,8. On garde le token qui franchit le seuil puis renormalise.',
  },
  sections: [
    {
      title: '01 / La température agit sur les logits',
      paragraphs: [
        'Une température T>0 divise les logits avant softmax. Avec [ln(2),0] et T=1, on obtient [2/3,1/3]. Avec T=2, les poids deviennent [√2,1], donc la distribution est plus uniforme. Des logits égaux restent égaux pour toute température positive.',
        'La température ne change pas les poids du modèle. Elle modifie une règle de sélection appliquée à ses sorties. Choisir le maximum, appelé décodage glouton, se définit séparément : T=0 n’est pas une division valide. Notre contrôle impose T≥0,1.',
        'Augmenter T n’ajoute pas de connaissance et ne garantit pas que chaque texte soit plus original. Une distribution davantage étalée permet seulement des tokens auparavant moins probables. La qualité doit être évaluée sur la tâche.',
      ],
      formula: 'p_j(T) = exp(z_j/T) / Σ_k exp(z_k/T)',
    },
    {
      title: '02 / Top-k et noyau top-p',
      paragraphs: [
        'Top-k conserve k tokens de plus grande probabilité, puis renormalise. Top-p conserve le plus petit préfixe trié dont la masse atteint ou dépasse p, y compris le token qui franchit le seuil. Il garde donc un nombre variable de tokens selon la distribution.',
        'Dans notre laboratoire, l’ordre est température, top-k, renormalisation, top-p, renormalisation. Le seuil top-p s’applique ainsi à la distribution restreinte par top-k. Des bibliothèques ou configurations peuvent ajouter d’autres transformateurs ; comparer des réglages nécessite de vérifier l’ordre exact.',
        'Pour [0,5;0,3;0,2] et p=0,6, le noyau garde les deux premiers tokens ; les probabilités finales sont [0,625;0,375;0]. Avec top-k=1, la distribution finale concentre toute sa masse sur un token, quelle que soit la température tant que l’ordre n’est pas changé.',
      ],
    },
    {
      title: '03 / Un tirage n’est pas sa distribution',
      paragraphs: [
        'Un nombre uniforme u dans [0,1) sélectionne l’intervalle cumulatif d’un token. Pour [0,625;0,375], u=0,5 sélectionne le premier token ; u=0,7 le second. Un token de probabilité nulle ne doit jamais être sélectionné.',
        'Le laboratoire effectue 200 tirages et affiche les comptes. Une fréquence observée n’égale pas exactement une probabilité théorique, même avec un moteur correct. La graine reproduit la même séquence de tirages pour le même algorithme et le même nombre d’appels.',
        'La comparaison de deux générations garde contexte, poids, filtres et graine constants si l’objectif est d’isoler une autre variable. Un RNG LCG simple est choisi pour l’inspection ; ses séquences ne sont pas celles des bibliothèques de génération ni adaptées à la cryptographie.',
      ],
    },
    {
      title: '04 / Adapter signifie modifier des paramètres',
      paragraphs: [
        'Le pré-entraînement construit des poids sur un objectif et un corpus initiaux. Un fine-tuning poursuit l’optimisation sur de nouvelles données ; il peut conserver le même objectif causal ou utiliser des exemples supervisés formatés pour une tâche.',
        'Dans la seconde expérience, la base bigramme reçoit 100 pas réels sur les phrases du module 08. Un corpus de domaine modifie certaines continuations. En mode complet, E et W sont mis à jour ; en mode LoRA, ces deux matrices restent gelées et seuls A et B changent.',
        'Modifier le prompt ou le contexte agit sur les entrées. Modifier le sampling agit sur la sélection. Adapter agit sur les paramètres. Ces trois mécanismes peuvent se combiner, mais leurs effets doivent être mesurés séparément.',
      ],
    },
    {
      title: '05 / Une mise à jour de bas rang inspectable',
      paragraphs: [
        'Nous ajoutons à W de forme d×V une matrice (α/r)AB, avec A de forme d×r et B de forme r×V. Cette convention matricielle correspond à des activations lignes ; l’article utilise aussi des conventions avec vecteurs colonnes. Le rang de AB est au plus r.',
        'La base W est gelée. Ici α=r donne un facteur 1, A est initialisé et B est nul. La mise à jour initiale est donc nulle. Le gradient de A est initialement nul, celui de B peut être non nul ; initialiser A et B à zéro annulerait les deux gradients.',
        'Avec d=4, V=8 et r=1, on entraîne 12 paramètres pour l’adaptateur, contre 64 pour E et W en mode complet. La comparaison n’est pas une promesse de qualité équivalente. Le gain dépend du rang, des couches adaptées, du modèle et des données.',
      ],
      formula: 'W_effectif = W_gelé + (α/r)AB ; paramètres adaptateur = r(d+V)',
    },
    {
      title: '06 / Mesurer ce qui a été gagné et perdu',
      paragraphs: [
        'La perte de domaine avant/après est réellement recalculée. Le changement maximal de E/W permet de vérifier le gel en mode LoRA. La projection effective et les matrices A/B sont inspectables. La génération emploie les paramètres actuels et les filtres choisis.',
        'La perte de domaine seule ne mesure pas la conservation des capacités initiales. Le notebook mesure également la perte sur le corpus d’origine et compare LoRA au fine-tuning complet, avec budgets explicites. Un modèle peut s’améliorer sur une continuation et se dégrader sur une autre.',
        'Une adaptation ne garantit pas l’actualisation exhaustive des faits ni l’absence d’hallucinations. Le modèle du navigateur est bigramme ; le notebook mini-GPT montre la construction d’un bloc causal, sans revendiquer les performances d’un LLM moderne. Le prochain parcours explorera le contexte et les applications.',
      ],
    },
  ],
  hypothesis:
    'Avec top-k=1, prédisez les comptes des 200 tirages. Puis comparez LoRA avant/après 50 pas : quelles matrices doivent changer ? Vérifiez la perte et le changement mesuré des poids de base.',
  transfer:
    'Concevez une comparaison de LoRA et fine-tuning sur des consignes originales. Fixez données, initialisation, rang, budget, génération et jeu de test. Ajoutez une mesure de conservation des tâches initiales et expliquez pourquoi une meilleure perte de domaine ne suffit pas.',
  rubric: [
    'Je garde contexte et sampling constants pour comparer les poids.',
    'Je compte les paramètres et vérifie le gel de la base.',
    'Je mesure une tâche de domaine et une tâche initiale séparément.',
    'Je indique les limites du rang, des données et du modèle.',
  ],
  summary: [
    'Température et filtres modifient la distribution, sans entraînement.',
    'Top-p conserve le token qui franchit le seuil.',
    'Une graine fixe reproduit un algorithme et son ordre de tirages.',
    'LoRA entraîne une mise à jour de bas rang avec une base gelée.',
  ],
  developerNote:
    'filteredDistribution expose les distributions intermédiaires et refuse les paramètres invalides. adaptStep dérive A/B avec base gelée ; les tests vérifient les gradients par différences finies, la mise à jour nulle initiale et l’absence de mutation. La trace de génération utilise les poids effectivement affichés.',
  references: [
    {
      title: 'Hugging Face — GenerationConfig 5.5.3',
      url: 'https://huggingface.co/docs/transformers/v5.5.3/main_classes/text_generation',
      reason:
        'Définitions des paramètres de décodage. Notre ordre de filtres est affiché explicitement.',
    },
    {
      title: 'Hu et al. — LoRA',
      url: 'https://arxiv.org/abs/2106.09685',
      reason: 'Article original sur le gel des poids et les mises à jour de bas rang.',
    },
    {
      title: 'PyTorch — CrossEntropyLoss 2.14',
      url: 'https://docs.pytorch.org/docs/2.14/generated/torch.nn.CrossEntropyLoss.html',
      reason: 'La perte attend des logits non normalisés et des indices de cibles.',
    },
  ],
};
