import type { Module } from './modules';
export const representationModules: Module[] = [
  {
    id: '03',
    title: 'Représentations vectorielles',
    subtitle: 'Un token devient un vecteur, pas une vérité',
    duration: '60–75 min · estimation',
    problem:
      'Deux points semblent voisins sur une carte d’embeddings en deux dimensions. Peut-on en déduire que leurs vecteurs originaux sont proches, que leurs mots ont le même sens, ou que leurs affirmations sont vraies ? Construisez un contre-exemple et inspectez les nombres derrière la carte.',
    objectives: [
      'Retrouver un vecteur à partir de son ID dans une table.',
      'Calculer produit scalaire, norme et similarité cosinus.',
      'Prévoir l’effet d’un changement de direction ou de norme.',
      'Démontrer par un exemple qu’une projection 2D perd de l’information.',
    ],
    prerequisite:
      'Addition, multiplication, coordonnées. Les ID de token sont présentés au module 02.',
    diagnostic: {
      question: 'Pour A=[1,2] et B=[3,0], que vaut A·B ?',
      choices: ['3', '6', '[3,0]'],
      expected: 0,
      feedback:
        '1×3 + 2×0 = 3. Un produit scalaire renvoie un nombre, pas un vecteur. Les composantes doivent correspondre.',
    },
    sections: [
      {
        title: '01 / Une adresse, puis une représentation',
        paragraphs: [
          'Le tokenizer donne des identifiants discrets. Une table E de taille vocabulaire × dimension associe à chaque ID une ligne de nombres : son embedding. Si l’ID est 2, chercher E[2] sélectionne une ligne ; cela ne multiplie pas le vecteur par deux.',
          'Dans la table inventée de notre laboratoire, E[0]=[1,0,0], E[1]=[1,1,0] et E[2]=[0,1,2]. Trois tokens ont chacun trois composantes. La dimension mesure le nombre de coordonnées, indépendamment du nombre de tokens et de leurs ID.',
          'Dans un modèle entraîné, ces entrées sont des paramètres ajustés avec l’objectif d’apprentissage. Les nombres affichés ici sont choisis pour illustrer la géométrie ; aucune association entre mots et sens n’a été apprise. Ne les présentez donc pas comme un espace sémantique réel.',
        ],
      },
      {
        title: '02 / Produit scalaire : additionner des contributions',
        formula: 'A·B = Σᵢ Aᵢ Bᵢ ; ‖A‖ = √(Σᵢ Aᵢ²)',
        paragraphs: [
          'Pour A=[1,2,0] et B=[2,1,0], le produit scalaire vaut 1×2 + 2×1 + 0×0 = 4. Le calcul exige le même nombre de composantes. La norme de A est √5 : elle décrit la longueur du vecteur.',
          'Le produit scalaire dépend à la fois des directions et des normes. Si on double B, le produit double même si sa direction reste inchangée. C’est une raison de distinguer ce score d’une mesure qui normalise les longueurs.',
          'Le calcul en machine n’est pas une arithmétique réelle exacte. Nous contrôlons les valeurs finies et les dimensions. Les comparaisons de tests utilisent des tolérances lorsque la racine ou la division produisent un arrondi.',
        ],
      },
      {
        title: '03 / Comparer des directions avec le cosinus',
        formula: 'cos(A,B) = (A·B)/(‖A‖ ‖B‖)',
        paragraphs: [
          'Pour deux vecteurs non nuls, cette similarité appartient à [−1,1]. Elle vaut 1 pour une même direction, 0 pour des directions orthogonales et −1 pour des directions opposées. Multiplier l’un des vecteurs par un nombre strictement positif ne change pas ce cosinus.',
          'Le cosinus entre [1,0,0] et [2,0,0] vaut 1, même si leurs longueurs diffèrent. Entre [1,0,0] et [0,1,0], il vaut 0. Une valeur nulle décrit ici une relation géométrique, pas une absence démontrée de lien linguistique.',
          'Pour un vecteur nul, la norme vaut zéro et notre formule est indéfinie. L’interface l’indique explicitement. Des bibliothèques régularisent le dénominateur avec epsilon pour obtenir un nombre calculable ; cette convention numérique ne donne pas une direction au vecteur nul.',
        ],
      },
      {
        title: '04 / Ce que la carte ne montre pas',
        paragraphs: [
          'Projeter [x,y,z] sur le plan x–y consiste ici à omettre z. Cette projection orthographique est calculée directement ; elle n’utilise ni PCA ni t-SNE. Elle préserve les coordonnées affichées, mais peut perdre des distances et des directions essentielles.',
          'Prenez A=[1,0,2] et B=[1,0,−2]. En trois dimensions, leur produit vaut −3 et leurs normes valent √5, donc leur cosinus vaut −0,6. Sur le plan des deux premières coordonnées, ils deviennent tous deux [1,0], avec un cosinus égal à 1.',
          'Les projections 0–1, 0–2 et 1–2 du laboratoire permettent d’inspecter différentes paires de composantes. Aucune de ces vues isolées ne remplace les coordonnées originales. Notez la mesure complète avant de commenter une proximité visuelle.',
        ],
      },
      {
        title: '05 / Du vecteur de token au vecteur contextualisé',
        paragraphs: [
          'La table initiale associe une ligne au token. Les couches suivantes peuvent transformer cette représentation en fonction des autres positions accessibles. Le même token dans deux contextes peut donc recevoir des représentations finales différentes, bien qu’il parte de la même entrée de table.',
          'Une coordonnée d’un embedding appris ne doit pas automatiquement recevoir une étiquette humaine comme « animal » ou « positif ». L’information peut être répartie sur plusieurs directions. Notre exploration numérique n’attribue aucune étiquette sémantique aux axes.',
          'Pour utiliser une similarité dans une application, il faudra préciser le modèle, le type de vecteur comparé, la normalisation et une évaluation sur la tâche réelle. Une mesure de proximité, à elle seule, ne prouve pas la véracité d’un passage retrouvé.',
        ],
      },
    ],
    hypothesis:
      'Doublez la norme de B sans changer sa direction. Prédisez le produit scalaire et le cosinus, puis vérifiez. Ensuite, activez le piège de projection et expliquez les deux mesures.',
    transfer:
      'Un collègue affirme que deux textes sont équivalents parce que leurs points se superposent sur une carte 2D. Proposez un contre-exemple numérique, puis un protocole qui comparerait leurs représentations originales sans confondre similarité et vérité.',
    rubric: [
      'Je donne les coordonnées complètes et le plan projeté.',
      'Je calcule ou relève les deux cosinus au lieu de juger seulement la carte.',
      'Je distingue géométrie, équivalence de texte et vérification factuelle.',
    ],
    summary: [
      'Un ID sélectionne une ligne dans une table de vecteurs.',
      'Le produit scalaire dépend des normes et des directions ; le cosinus normalise les normes.',
      'Le vecteur nul n’a pas de direction dans notre formule.',
      'Une projection peut masquer des différences présentes dans l’espace original.',
    ],
    developerNote:
      'Le moteur compare les dimensions et utilise Math.hypot pour les normes. Le cosinus normalise les deux vecteurs avant leur produit scalaire ; il retourne null lorsque l’une des normes est nulle. Le SVG est une projection directe des coordonnées, non une figure préfabriquée.',
    references: [
      {
        title: 'PyTorch — Embedding',
        url: 'https://docs.pytorch.org/docs/2.14/generated/torch.nn.Embedding.html',
        reason: 'Table de recherche de vecteurs par indices.',
      },
      {
        title: 'PyTorch — cosine_similarity',
        url: 'https://docs.pytorch.org/docs/2.14/generated/torch.nn.functional.cosine_similarity.html',
        reason:
          'Formule et rôle de la régularisation epsilon ; notre outil indique explicitement le cas nul.',
      },
    ],
  },
  {
    id: '04',
    title: 'Fondements mathématiques',
    subtitle: 'Des calculs visibles aux premières mises à jour',
    duration: '75–90 min · estimation',
    problem:
      'Un programme prétend multiplier deux matrices puis améliorer une prédiction en « descendant le gradient ». Comment contrôler chaque opération plutôt que faire confiance à un graphe qui descend ? Vous allez calculer un coefficient, une probabilité et une vraie trajectoire d’optimisation.',
    objectives: [
      'Vérifier les formes avant une multiplication matricielle.',
      'Calculer un coefficient d’un produit ligne par colonne.',
      'Relier logits, softmax et perte logarithmique.',
      'Effectuer une mise à jour de gradient et reconnaître convergence, oscillation et divergence sur une quadratique.',
    ],
    prerequisite:
      'Fractions, multiplication et module 01. Le vecteur du module 03 prépare le produit scalaire.',
    diagnostic: {
      question:
        'Une matrice A possède 3 lignes et 2 colonnes. Une matrice B possède 2 lignes et 4 colonnes. Quelle est la forme de AB ?',
      choices: ['2×2', '3×4', '4×3'],
      expected: 1,
      feedback: 'Les dimensions internes 2 coïncident ; les dimensions externes donnent 3×4.',
    },
    sections: [
      {
        title: '01 / Un tableau de nombres avec une forme',
        paragraphs: [
          'Un vecteur est une liste de coordonnées. Une matrice ajoute un axe : elle comporte des lignes et des colonnes. Dans nos laboratoires, les lignes représentent souvent des positions de tokens et les colonnes des caractéristiques. La forme 3×4 signifie trois lignes de quatre valeurs.',
          'Un tenseur général peut avoir davantage d’axes : lot de séquences, têtes d’attention, positions et caractéristiques. Cette première livraison manipule explicitement des matrices à deux axes ; elle ne masque pas les dimensions derrière un schéma.',
          'Le sens d’un axe doit être précisé. La matrice d’attention n×n a deux axes de positions, tandis qu’une table d’embeddings vocabulaire×d a un axe de tokens possibles et un axe de caractéristiques. Des formes numériquement identiques n’impliquent pas des rôles identiques.',
        ],
      },
      {
        title: '02 / Le produit ligne par colonne',
        formula: '(AB)ᵢⱼ = Σₖ Aᵢₖ Bₖⱼ',
        paragraphs: [
          'Si A est n×d et B est d×m, leur produit est n×m. La dimension interne d doit coïncider : elle énumère les termes additionnés. Multiplier directement une matrice 3×2 par une matrice 3×4 n’est donc pas défini.',
          'Pour A=[[1,2],[3,4]] et B=[[2,0],[1,2]], le coefficient [0,0] vaut 1×2 + 2×1 = 4. La première ligne du produit est [4,4] et la seconde [10,8]. Vérifiez ces valeurs dans le laboratoire, puis changez un coefficient.',
          'Une multiplication élément par élément est une opération différente. De même, AB n’est pas en général égal à BA ; BA peut même être impossible. Pour une projection de représentations, XW combine les caractéristiques de chaque ligne avec les colonnes de W.',
        ],
      },
      {
        title: '03 / D’un calcul de score à un objectif',
        paragraphs: [
          'Les logits d’une prédiction sont transformés par softmax en une distribution. La soustraction du maximum stabilise les exponentielles sans changer le résultat. La perte d’une cible observée est −ln(p cible), calculée ici sans prendre le logarithme d’une probabilité déjà arrondie.',
          'Avec trois scores identiques, les probabilités valent 1/3 et la perte de n’importe quelle cible vaut ln(3), environ 1,0986. Si la probabilité cible vaut 0,5, la perte vaut environ 0,6931. Une petite perte indique une bonne prédiction de cette cible selon cet objectif, pas une démonstration de vérité.',
          'Le laboratoire du module 01 est réutilisé pour que le même calcul conserve la même convention. Pour préparer l’optimisation, choisissez ensuite une fonction plus simple que la perte d’un réseau entier : une quadratique à une variable.',
        ],
      },
      {
        title: '04 / Une pente locale qui guide une mise à jour',
        formula: 'L(w)=(w−2)² ; dL/dw=2(w−2) ; w suivant=w−η×dL/dw',
        paragraphs: [
          'La dérivée mesure ici la variation locale de la perte lorsque w change légèrement. À w=0, la dérivée vaut −4 : augmenter un peu w diminue la perte. Soustraire le gradient fait donc augmenter w dans ce cas.',
          'Avec un taux η=0,2, la première mise à jour donne w=0,8. La perte passe de 4 à 1,44. Le laboratoire calcule chaque poids, son gradient et sa perte ; aucun point de la courbe n’est une animation arbitraire.',
          'Le gradient d’une fonction à plusieurs paramètres contient une dérivée partielle par paramètre. La rétropropagation applique la règle de chaîne pour obtenir ces dérivées à travers une composition d’opérations. Notre exercice calcule une dérivée analytique simple ; il n’implémente pas encore la rétropropagation d’un mini-LLM.',
        ],
      },
      {
        title: '05 / La vitesse peut devenir instabilité',
        paragraphs: [
          'Pour cette fonction, posez e=w−2. Après une mise à jour, e suivant=(1−2η)e. Si 0<η<1, la valeur absolue de ce facteur est inférieure à 1 : l’erreur décroît. Pour η=0, elle reste fixe ; pour η=1, elle change de signe sans décroître.',
          'Au-delà de 1, la valeur absolue de l’erreur grandit, sauf si le départ est exactement au minimum. Le graphe utilise log(1+perte) sur l’axe vertical afin de montrer cette divergence sans écraser les petites valeurs. Le tableau conserve les nombres bruts.',
          'Ces seuils résultent de la courbure précise de notre quadratique. Ils ne constituent pas un choix d’hyperparamètre pour un Transformer. Dans les phases suivantes, il faudra distinguer perte d’entraînement, validation et capacité de généralisation.',
        ],
      },
    ],
    hypothesis:
      'Avant de lancer le calcul, prévoyez w et L après une mise à jour depuis w=0 avec η=0,2. Comparez ensuite η=1 et 1,1 sans changer le point de départ.',
    transfer:
      'Un graphique d’entraînement diminue puis oscille. Décrivez un test contrôlé sur notre quadratique qui distingue un taux trop grand d’un problème d’affichage. Expliquez ensuite pourquoi votre observation ne suffit pas à diagnostiquer un LLM.',
    rubric: [
      'Je conserve le départ et la fonction de perte entre les essais.',
      'Je relève poids, gradients et pertes brutes, et précise l’échelle du graphe.',
      'Je limite la conclusion au modèle testé et propose une validation indépendante.',
    ],
    summary: [
      'Les dimensions internes déterminent si un produit matriciel est défini.',
      'Chaque coefficient d’AB est un produit scalaire ligne-colonne.',
      'Une dérivée et un taux définissent une mise à jour réelle.',
      'Une convergence observée dépend de la fonction et du protocole ; ce n’est pas une garantie générale.',
    ],
    developerNote:
      'Les fonctions de matrices refusent les formes irrégulières, les valeurs non finies et les produits incompatibles. La descente enregistre l’état initial et les états après chaque mise à jour. Le gradient analytique est comparé dans les tests à une différence finie centrée.',
    references: [
      {
        title: 'PyTorch — matmul',
        url: 'https://docs.pytorch.org/docs/2.14/generated/torch.matmul.html',
        reason: 'Conventions du produit matriciel ; notre moteur se limite à deux axes.',
      },
      {
        title: 'PyTorch — autograd',
        url: 'https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html',
        reason: 'Différentiation et chaîne de calcul ; prolongement pour la phase entraînement.',
      },
    ],
  },
];
