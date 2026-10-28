# Formation des enseignants de NSI aux modèles de langage — V5

**Édition de travail du 28 octobre 2026.** Cursus autonome pour des professeurs de NSI sans formation préalable sur les grands modèles de langage (LLM). La rédaction des quatre modules est achevée au stade **brouillon éditorial** ; les validations humaine, ergonomique et pédagogique restent à effectuer. **Cette formation ne figure pas encore comme quatre cours intégrés dans l'interface web.** Le site V4 public n'est pas modifié.

## Finalité pédagogique

Le parcours ne vise pas à mémoriser des acronymes. Il donne au professeur les connaissances nécessaires pour **expliquer**, **illustrer**, **faire manipuler**, **vérifier** et **transposer en Terminale NSI** quelques mécanismes représentatifs des modèles de langage, sans attribuer au programme officiel des exigences qu'il ne contient pas.

**Public visé :** enseignant de NSI disposant des bases de Python et acceptant de découvrir les notions propres aux modèles de langage. Pas de prérequis en optimisation numérique, en dérivation ou en algèbre linéaire avancée.

## Progression retenue

| Ordre | Cours complet                                                        | Acquis recherchés                                                                                | Prolongement Python                                   |
| ----- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| 1     | [Comprendre les modèles de langage](MODULE_01_MODELES_LANGAGE.md)    | Modèle, entraînement, inférence, token, contexte, probabilité et vérité                          | Normaliser des poids                                  |
| 2     | [Tokenisation et génération](MODULE_02_TOKENISATION_GENERATION.md)   | Tokenizer, paires fréquentes, fusion, graine, top-k, génération autorégressive                   | Compter des paires adjacentes                         |
| 3     | [Apprentissage et évaluation](MODULE_03_APPRENTISSAGE_EVALUATION.md) | Paramètres, perte, entraînement, validation, test, généralisation et surapprentissage            | Mesurer un taux d'erreur                              |
| 4     | [Fiabilité, sources et RAG](MODULE_04_FIABILITE_SOURCES_RAG.md)      | Sources, abstention, recherche lexicale, RAG, limites des citations et injections d'instructions | Rechercher des sous-chaînes sans inventer de réponses |

**Durées estimées :** les cours demandent environ 6 à 8 heures de travail personnel, selon les acquis initiaux et le temps passé aux exercices. Ces durées ne sont pas issues d'une mesure auprès de participants.

## Méthode de travail proposée au professeur

Pour chaque module :

1. Lire le problème concret, puis formuler une première réponse avant de découvrir la théorie.
2. Étudier les définitions dans l'ordre, sans passer directement aux formules ou aux outils avancés.
3. Refaire les exemples résolus, puis expliquer à voix haute les étapes essentielles.
4. Réaliser les manipulations dans LLM Academy en consignant **hypothèse, variable modifiée, observation et limite**.
5. Résoudre le prolongement Python si les prérequis sont disponibles ; comprendre la différence entre une **analogie** et un **modèle entraîné**.
6. Répondre à l'évaluation sans consulter le corrigé.
7. Comparer les réponses au corrigé argumenté, noter les incompréhensions et refaire les exercices de transfert.
8. Préparer seulement ensuite la transposition en classe.

**Règle :** une réponse correcte à une question fermée ne certifie pas l'acquisition de la notion. L'explication et le transfert restent à examiner.

## Trois niveaux de formation à distinguer

**Niveau 1 — Comprendre.** Le professeur sait définir les termes, expliquer un exemple et identifier la limite d'une simulation.

**Niveau 2 — Expliquer à un élève.** Il sait produire une consigne précise, anticiper une erreur fréquente et conduire une activité sans terme non défini.

**Niveau 3 — Vérifier l'apprentissage.** Il sait construire un cas nouveau, demander une justification et distinguer une erreur de compréhension d'une difficulté de manipulation.

Les cours ne deviennent des **formations validées** que lorsque ces trois niveaux ont été observés chez des personnes réelles, sans confondre réussite technique et maîtrise pédagogique.

## Transposition dans la spécialité NSI

Les cours sur les LLM sont des **applications complémentaires**. Les activités de programmation privilégient les listes, dictionnaires, tuples, chaînes de caractères, fonctions, instructions conditionnelles, boucles bornées et assertions, selon les prérequis explicités.

Les notions telles que **softmax, gradient, représentations vectorielles et mécanisme d'attention** ne sont pas imposées comme prérequis à la Terminale NSI.

Terminologie à respecter systématiquement : **« variable de type entier »**, **« affecter une valeur à une variable »**, **« boucle bornée »**, **« instruction conditionnelle »**, **« fonction qui renvoie une valeur »**.

Programme de référence : https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g

## Critères de réception avant le 25 novembre 2026

| Domaine                    | Preuve demandée                                                                                     | État au 28 octobre                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Rédaction des quatre cours | Un document autonome par module, avec théorie, exemple, pratique, évaluation et corrigé             | **Rédigé**                                                        |
| Français                   | Relecture compétente des accords, de la syntaxe, de la terminologie et des formulations de consigne | **À faire indépendamment**                                        |
| Exactitude scientifique    | Relecture des analogies, limites et liens entre les observations et les conclusions                 | **À faire indépendamment**                                        |
| Python NSI                 | Exécution des quatre corrigés et d'un jeu de cas limites                                            | **Contrôle automatique ajouté ; résultats à vérifier dans la CI** |
| Intégration applicative    | Cours consultables dans le dossier enseignant avec une interface lisible et imprimable              | **Non réalisée**                                                  |
| Accessibilité              | Clavier, lecteur d'écran, modes clair/sombre, mobile, projection réelle, impression                 | **Non vérifiée sur ces nouveaux cours**                           |
| Compréhension humaine      | Essais avec des professeurs ne connaissant pas les LLM, recueil des incompréhensions et corrections | **Non réalisés**                                                  |
| Publication                | Autorisation humaine, déploiement et contrôle du domaine public                                     | **Non autorisée pour V5**                                         |

**Décision actuelle :** **EN VÉRIFICATION**, et non « formation achevée et validée ».

## Organisation de la révision

- **Rédacteur :** prépare les cours et propose les modifications.
- **Vérificateur linguistique indépendant :** relit la syntaxe, l'orthographe, les formulations ambiguës et la cohérence des termes.
- **Vérificateur scientifique / NSI :** examine la justesse des mécanismes, la conformité des exercices et la distinction entre le programme officiel et les prolongements.
- **Testeur technique :** exécute les exemples, vérifie les liens, les interfaces, l'impression et les régressions.
- **Responsable pédagogique humain :** examine les rapports et décide d'accepter, de demander des corrections ou de bloquer la livraison.

Charte obligatoire : [Charte éditoriale et linguistique V5](../CHARTE_EDITORIALE_FR_NSI_V5.md).

## Maintien de la version publique

La branche de travail `refonte/v5-cours-enseignant` n'est pas fusionnée. Le workflow de publication ne déploie pas cette branche. Les quatre cours sont disponibles **dans les fichiers du dépôt**, pas encore comme pages intégrées au site GitHub Pages.

**Étape d'intégration suivante :** concevoir une interface de formation enseignant permettant une lecture chapitrée, une séparation cours/évaluation/corrigé, une navigation cohérente, une impression économique et un suivi local sans fausse certification. Ne pas coder cette interface avant d'avoir défini son contrat ergonomique.
