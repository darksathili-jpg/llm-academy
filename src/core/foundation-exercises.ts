import type { Exercise } from './exercises';
export const foundationExercises: Exercise[] = [
  {
    id: 'm03-dot',
    module: '03',
    kind: 'number',
    level: 'Calcul',
    prompt: 'A=[1,2,0] et B=[2,1,0]. Quel est leur produit scalaire ?',
    expected: 4,
    tolerance: 0,
    hint: 'Multipliez les composantes correspondantes et additionnez.',
    correction:
      '1×2 + 2×1 + 0×0 = 4. Le produit scalaire inclut les normes ; il ne s’agit pas encore du cosinus.',
  },
  {
    id: 'm03-cosine',
    module: '03',
    kind: 'number',
    level: 'Prédiction',
    prompt:
      'A=[1,0,2] et B=[1,0,−2]. Leur produit vaut −3 et leurs normes valent √5. Quelle est leur similarité cosinus ?',
    expected: -0.6,
    tolerance: 0.001,
    hint: 'Divisez le produit scalaire par √5 × √5.',
    correction:
      '−3/5 = −0,6. Sur le plan des composantes 0 et 1, les deux vecteurs semblent pourtant identiques.',
  },
  {
    id: 'm03-zero',
    module: '03',
    kind: 'choice',
    level: 'Débogage',
    prompt:
      'Que peut-on conclure du cosinus entre un vecteur nul et un vecteur non nul dans notre formule sans régularisation ?',
    choices: [
      'Il vaut toujours 1',
      'Il est indéfini : une norme est nulle',
      'Il révèle que les mots sont antonymes',
    ],
    expected: 'Il est indéfini : une norme est nulle',
    hint: 'Regardez le dénominateur.',
    correction:
      'La norme du vecteur nul vaut 0 : la division n’est pas définie. L’outil affiche cette limite au lieu d’inventer une similarité.',
  },
  {
    id: 'm03-lookup',
    module: '03',
    kind: 'choice',
    level: 'Transfert',
    prompt:
      'Dans une table E, le token numéro 2 possède le vecteur [0,1,2]. Comment obtient-on son embedding ?',
    choices: [
      'En sélectionnant la ligne E[2]',
      'En multipliant tous les vecteurs par 2',
      'En classant les tokens selon leur ID',
    ],
    expected: 'En sélectionnant la ligne E[2]',
    hint: 'Un ID est une adresse dans la table.',
    correction:
      'La recherche sélectionne une ligne. La valeur numérique de l’ID ne représente ni une distance ni une importance sémantique.',
  },
  {
    id: 'm04-matmul',
    module: '04',
    kind: 'number',
    level: 'Calcul',
    prompt: 'A=[[1,2],[3,4]] et B=[[2,0],[1,2]]. Quelle est la valeur de (AB)[0,0] ?',
    expected: 4,
    tolerance: 0,
    hint: 'Première ligne de A, première colonne de B.',
    correction:
      '1×2 + 2×1 = 4. Le produit cellule par cellule donnerait 2, ce qui serait une autre opération.',
  },
  {
    id: 'm04-gradient',
    module: '04',
    kind: 'number',
    level: 'Prédiction',
    prompt:
      'L(w)=(w−2)². À w=0, le gradient vaut −4. Avec η=0,2, quel est le poids après une mise à jour ?',
    expected: 0.8,
    tolerance: 0.001,
    hint: 'Appliquez w suivant = w − η×gradient.',
    correction:
      '0 − 0,2×(−4) = 0,8. Le signe négatif du gradient fait augmenter le poids ici ; la perte passe de 4 à 1,44.',
  },
  {
    id: 'm04-shapes',
    module: '04',
    kind: 'choice',
    level: 'Débogage',
    prompt: 'Peut-on multiplier directement A de forme 3×2 et B de forme 3×4 ?',
    choices: [
      'Oui, le résultat vaut 3×4',
      'Non, les dimensions internes 2 et 3 diffèrent',
      'Oui, en supprimant une ligne automatiquement',
    ],
    expected: 'Non, les dimensions internes 2 et 3 diffèrent',
    hint: 'Comparez le nombre de colonnes de A et de lignes de B.',
    correction:
      'Un produit n×d par d×m est défini si les dimensions internes coïncident. Le moteur refuse une forme incompatible.',
  },
  {
    id: 'm04-rate',
    module: '04',
    kind: 'choice',
    level: 'Transfert',
    prompt: 'Pour L(w)=(w−2)², départ w=0 et η=1, que mesure-t-on ?',
    choices: [
      'Une perte strictement décroissante',
      'Une alternance 0 puis 4 avec perte constante 4',
      'Un entraînement de LLM réussi',
    ],
    expected: 'Une alternance 0 puis 4 avec perte constante 4',
    hint: 'Calculez successivement les gradients −4 et 4.',
    correction:
      'w alterne entre 0 et 4 ; L vaut 4. Le seuil dépend de la courbure de cette quadratique et ne constitue pas une recommandation pour entraîner un LLM.',
  },
  {
    id: 'm05-average',
    module: '05',
    kind: 'number',
    level: 'Calcul',
    prompt:
      'Une ligne d’attention vaut [0,5 ; 0,5] et les valeurs correspondantes valent [2] et [4]. Quelle est la sortie scalaire ?',
    expected: 3,
    tolerance: 0,
    hint: 'Additionnez les deux valeurs pondérées.',
    correction: '0,5×2 + 0,5×4 = 3. Les poids mélangent les valeurs, pas les keys.',
  },
  {
    id: 'm05-mask',
    module: '05',
    kind: 'number',
    level: 'Prédiction',
    prompt:
      'Pour les positions 0,1,2, combien de poids de la ligne query 0 restent non nuls après un masque causal standard incluant la position courante ?',
    expected: 1,
    tolerance: 0,
    hint: 'La première position ne peut lire que son propre token.',
    correction:
      'Seul le poids vers key 0 est autorisé : [1,0,0]. Les autres scores sont masqués avant softmax.',
  },
  {
    id: 'm05-v',
    module: '05',
    kind: 'choice',
    level: 'Débogage',
    prompt:
      'Q et K restent fixes. On change uniquement V. Qu’est-ce qui peut changer dans l’attention standard ?',
    choices: [
      'Les poids softmax changent forcément',
      'La sortie peut changer, les poids restent identiques',
      'Le masque causal disparaît',
    ],
    expected: 'La sortie peut changer, les poids restent identiques',
    hint: 'Séparez softmax(QKᵀ/√d_k) et la multiplication par V.',
    correction:
      'Les scores et les poids ne dépendent ici que de Q, K et du masque. Les valeurs V déterminent les éléments mélangés.',
  },
  {
    id: 'm05-heads',
    module: '05',
    kind: 'number',
    level: 'Transfert',
    prompt:
      'Quatre têtes ont chacune une sortie de forme 3×2. Quelle est la largeur de leur concaténation avant projection finale ?',
    expected: 8,
    tolerance: 0,
    hint: 'Les colonnes des quatre sorties sont juxtaposées.',
    correction:
      '4×2 = 8 : la concaténation a la forme 3×8. Une projection Wo peut ensuite retrouver d_model.',
  },
  {
    id: 'm06-ffn',
    module: '06',
    kind: 'number',
    level: 'Calcul',
    prompt:
      'Dans notre miniature, n=3 et d_model=4. La couche FFN interne a une largeur 2×d_model. Combien de colonnes possède sa matrice d’activations ?',
    expected: 8,
    tolerance: 0,
    hint: 'La dimension des positions ne change pas ; seule la largeur est doublée.',
    correction:
      '2×4=8 colonnes ; la forme interne est 3×8. Cette largeur est un choix pédagogique explicite, pas une règle universelle.',
  },
  {
    id: 'm06-causal',
    module: '06',
    kind: 'choice',
    level: 'Prédiction',
    prompt:
      'On change le token à la dernière position d’un bloc causal. Les logits d’une position antérieure doivent-ils changer ?',
    choices: [
      'Oui, toujours',
      'Non, si aucun autre mécanisme ne mélange le futur',
      'Ils deviennent forcément tous nuls',
    ],
    expected: 'Non, si aucun autre mécanisme ne mélange le futur',
    hint: 'Suivez le masque et les opérations appliquées séparément à chaque position.',
    correction:
      'Dans ce bloc, attention causale, normalisation par ligne et FFN positionnel préservent les premières sorties. Cela constitue un invariant testable contre les fuites du futur.',
  },
  {
    id: 'm06-residual',
    module: '06',
    kind: 'choice',
    level: 'Débogage',
    prompt:
      'Une branche produit une matrice 3×8. L’entrée X vaut 3×4. Peut-on calculer directement X + branche ?',
    choices: [
      'Oui, toute addition agrandit la matrice',
      'Non, il faut retrouver la même forme 3×4',
      'Oui, en moyennant les tokens',
    ],
    expected: 'Non, il faut retrouver la même forme 3×4',
    hint: 'Une addition de matrices demande les mêmes dimensions.',
    correction:
      'La branche FFN doit être reprojetée vers d_model avant l’addition résiduelle. C’est une contrainte de forme.',
  },
  {
    id: 'm06-gpt',
    module: '06',
    kind: 'choice',
    level: 'Transfert',
    prompt:
      'Pourquoi la distribution du Transformer Explorer ne constitue-t-elle pas une réponse linguistique fiable ?',
    choices: [
      'Parce que toutes les architectures Transformer échouent',
      'Parce que les poids sont construits sans entraînement',
      'Parce qu’une matrice a toujours moins de quatre lignes',
    ],
    expected: 'Parce que les poids sont construits sans entraînement',
    hint: 'Distinguez exécution d’une architecture et acquisition de capacités.',
    correction:
      'Le passage avant est réel, mais les poids de démonstration ne sont pas appris. Une distribution normalisée ne prouve aucune capacité de compréhension ni performance linguistique.',
  },
];
