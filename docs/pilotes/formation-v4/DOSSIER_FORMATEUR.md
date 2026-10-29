# LLM Academy — Dossier du formateur V4

**Document de travail, non validé institutionnellement**, 29 octobre 2026. Conçu pour des élèves de Terminale NSI et des enseignants de NSI découvrant les LLM.

## Objectifs généraux et correspondances institutionnelles

La formation mobilise les notions de chaînes, listes, dictionnaires, fonctions, boucles bornées, tests, données structurées et algorithmique des programmes NSI en vigueur. Elle ne confond jamais ces prérequis avec les architectures de LLM, qui sont un **prolongement hors programme obligatoire**. Les mathématiques supplémentaires (exponentielle, logarithme, vecteurs et dérivée) sont reconstruites dans la page et peuvent être approfondies par l’enseignant.

Le cadre ministériel de juin 2025 rend nécessaires la plus-value pédagogique, la protection des données, la transparence et la vigilance critique. Le site n’envoie aucune donnée à un service de modèle externe.

## Tableau de progression et critères de transfert

|  N° | Chapitre                                | Action vérifiable                                    | Contresens visé                                 | Ancrage Python              | Critère d’évaluation formative                                                                         |
| --: | --------------------------------------- | ---------------------------------------------------- | ----------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
|  01 | Vérifier une affirmation                | Citer une source et classer trois affirmations       | Source plausible ≠ vérité                       | Dictionnaires, tests de cas | Élève : attribuer les trois verdicts et justifier ; enseignant : identifier les preuves insuffisantes. |
|  02 | Découper le texte                       | Faire une fusion de paires sans chevauchement        | Token ≠ mot ; BPE simplifié                     | Chaînes, listes, boucles    | Décrire les états avant/après fusion et expliquer ce qui n’est pas un BPE complet.                     |
|  03 | Calculer des probabilités               | Calculer une softmax de trois logits                 | Score ≠ probabilité ≠ vérité                    | Fonctions, calculs          | Expliquer chaque terme et recalculer une distribution pour des scores modifiés.                        |
|  04 | Voir le masque causal                   | Construire et lire une matrice triangulaire          | Poids d’attention ≠ probabilités du vocabulaire | Indices, listes imbriquées  | Justifier l’impossibilité d’utiliser les positions futures.                                            |
|  05 | Apprendre et valider                    | Distinguer modification des paramètres et mesure     | Validation ≠ test final                         | Comptage, tableaux          | Montrer qu’une mesure de validation ne met pas directement à jour les poids.                           |
|  06 | Chercher avant de répondre              | Rechercher puis contrôler la pertinence d’une source | Présence d’une sous-chaîne ≠ vérité             | Chaînes, dictionnaires      | Expliquer lac/placard et la décision d’abstention.                                                     |
|  07 | Préparer les données                    | Dédupliquer et séparer des ensembles                 | Déduplication exacte ≠ absence de fuite         | Listes, ensembles           | Justifier une séparation adaptée à l’usage ciblé.                                                      |
|  08 | Représenter les tokens par des vecteurs | Calculer produit scalaire et cosinus                 | Similarité ≠ synonymie                          | Listes, boucles, fonctions  | Interpréter un vecteur nul et les limites de la projection en 2D.                                      |
|  09 | Calculer une attention pondérée         | Calculer deux poids softmax et une somme pondérée    | Attention ≠ prédiction finale                   | Listes, probabilités        | Retrouver le calcul de 17,31 et expliquer le masque.                                                   |
|  10 | Suivre un Transformer causal            | Relier les étapes d’un décodeur                      | Encodeur ≠ décodeur causal                      | Dictionnaires, masques      | Relier token, identifiant, vecteur, scores sans les confondre.                                         |
|  11 | Comprendre la perte et le gradient      | Effectuer et justifier une mise à jour               | Perte train ↓ ≠ généralisation                  | Fonctions, calculs          | Montrer un pas qui diminue la perte et un autre qui l’augmente.                                        |
|  12 | Choisir le token suivant                | Manipuler température et top-k                       | Top-k ≠ vérité ; tirage ≠ entraînement          | Boucles, tri                | Comparer deux réglages en ne changeant qu’une variable.                                                |
|  13 | Adapter un modèle existant              | Compter les coefficients de facteurs LoRA            | Peu de paramètres entraînés ≠ peu de mémoire    | Listes de listes            | Distinguer entraînement complet, fine-tuning et LoRA.                                                  |
|  14 | Concevoir une consigne vérifiable       | Écrire un contrat d’entrée/sortie                    | Format valide ≠ affirmation vérifiée            | JSON, pré/postconditions    | Fournir un cas nominal, un cas absent, un cas contradictoire.                                          |
|  15 | Évaluer, sécuriser, décider             | Calculer précision, rappel, exactitude               | Une métrique ≠ certification de sûreté          | Tests, fractions            | Documenter la méthode et le contrôle humain pour un cas scolaire.                                      |

## Proposition de séances (durées non mesurées)

- **Élèves — progression annuelle possible :** phase 1 en 4 à 6 séances ; phase 2 en 4 à 6 séances ; phase 3 en 3 à 5 séances de 55 minutes, selon le niveau. Les manipulations de cette page sont des amorces ; des débats, exercices de transfert et temps de mise en commun doivent compléter ces séances.
- **Formation enseignants — 12 heures à éprouver :** 2 h de concepts et vérification ; 2 h tokenisation/probabilités ; 2 h vecteurs/attention ; 2 h architecture/optimisation ; 2 h adaptation, RAG et prompting ; 2 h de conception de séquences, évaluation et audit d’un cas réel.
- **Variable importante :** ces durées sont des cibles de conception, pas des temps observés ni une attestation de formation officielle.

## Routine pédagogique recommandée

1. **Observer** une expérience sans jargon non défini. 2. **Prédire** une conséquence de manipulation. 3. **Agir** et relever un résultat chiffré. 4. **Expliquer** le résultat en réutilisant le vocabulaire défini. 5. **Transférer** sur un cas inédit. 6. **Évaluer** avec des critères écrits.

## Préparer les démonstrations mathématiques

Les relations mathématiques du parcours sont construites, pas simplement affichées : proportions, softmax, produit scalaire, norme et cosinus, moyenne pondérée par attention, gradient d’une fonction quadratique, dénombrement LoRA et mesures de classification. Pour chaque relation, exiger une explication orale des symboles, les valeurs d’entrée, les calculs intermédiaires, un contrôle des bornes et un contre-exemple.

## Évaluation d’entrée / de sortie

**Diagnostic sans note** : identifier ce qu’est un token, distinguer une source d’une affirmation, comprendre une liste Python et calculer une proportion simple. Ne pas supposer la spécialité mathématiques.
**Contrôle intermédiaire** : refaire un calcul après modification des données, expliquer pourquoi une assertion ne suffit pas à démontrer la compréhension, confronter une sortie à une source.
**Transfert de fin** : en groupes, analyser une réponse à l’aide du pipeline complet (source, corpus, tokenisation, distribution, génération, contrôle, risques). La réponse doit distinguer ce qui est observé, calculé et seulement supposé.
**Réception pédagogique** : faire tester sans aide à au moins un groupe d’élèves novices et à des enseignants novices ; mesurer les abandons, les aides demandées, les justifications et la réussite différée. La seule bonne réponse à un QCM ne certifie pas la compétence.

## Réserves techniques et éthiques

- Les ateliers sont des simulateurs JavaScript originaux et documentés ; aucun modèle entraîné ne produit les réponses.
- Les programmes Python sont fournis en texte, avec des assertions, pour être exécutés dans Python standard hors du navigateur. Le site ne promet pas de faire tourner PyTorch.
- L’application sauvegarde localement les chapitres marqués comme revus, sans serveur. Le statut n’est pas une certification.
- Les illustrations Microduck sont intégrées au prototype ; vérifier les droits d’usage lors d’une éventuelle publication.
- La page reste en phase de qualification pédagogique, sans agrément institutionnel ni publication GitHub.

## Références pour approfondir ou contrôler la rigueur

- Éduscol, [programmes NSI Première et Terminale](https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g).
- Ministère, [cadre d’usage de l’IA en éducation](https://www.education.gouv.fr/cadre-d-usage-de-l-ia-en-education-450647).
- Vaswani et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762).
- Hu et al., [LoRA](https://arxiv.org/abs/2106.09685).
- Stanford, [CS336 Language Modeling from Scratch](https://cs336.stanford.edu/).
- Hugging Face, [LLM Course](https://huggingface.co/learn/llm-course/en/chapter1/1).
- NIST, [Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence).
