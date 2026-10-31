# Audit pédagogique contradictoire — V4-Q7 (31 octobre 2026)

## Décision

**Réception pédagogique suspendue.** Les campagnes Q2–Q6 rapportées réussies prouvent le fonctionnement de scénarios ciblés, pas que la promesse « Comprendre les LLM. Vraiment. » est remplie. La version protégée et la préproduction existante doivent rester intouchées pendant la correction. Les remarques ci-dessous proviennent d'une contre-expertise transmise par l'utilisateur ; plusieurs fonctions de démonstration ont aussi été lues directement dans le HTML gelé. Les jugements scientifiques plus larges devront être confirmés par les tests proposés.

## Défauts prioritaires et critères de sortie

| Priorité | Limite | Correction attendue | Preuve de réception |
|---|---|---|---|
| P0-1 | Aucun modèle ne génère de suite de texte | Modèle de bigrammes **réel** sur corpus français court, comptes et distribution conditionnelle, graine reproductible, température et top-k ; entraîner/générer localement | Même graine/paramètres => sortie identique ; changement de distribution mesuré ; génération non codée en dur ; exemples nouveaux |
| P0-2 | Chapitre 05 : l'accroissement d'un compte détériore immédiatement la validation, ne montre pas une courbe de surapprentissage | Séparer le **déplacement de masse** du surapprentissage ; expérimenter unigramme/bigramme/trigramme, lissage et perte/perplexité sur ensembles distincts ; attention : courbe en U non garantie pour ces trois modèles sans protocole adapté | Protocole reproductible, graphiques et exemples contredisant « s'entraîner dégrade toujours la validation » |
| P0-3 | Chaîne 08→11 fragmentée | Produit scalaire avec vecteur non unitaire [4,3], scores Q·K, softmax, somme des V, mini-passage causal deux tokens ; connecter perte de prédiction et gradients | Valeurs de référence indépendantes, conservation des dimensions, masque ; différences testées |
| P0-4 | Quiz et synthèse confondent bonne réponse et maîtrise | Distracteurs plausibles, réponses permutées si possible, feedback adapté au choix, transfert inédit, export avec libellés ; code anonyme de copie facultatif | Taux de réussite au premier essai, transferts non isomorphes, évaluations aveugles |
| P1 | Source 01 : temps verbal discordant et correction manuscrite | Affirmations cohérentes temporellement ; vérification de faits structurés avec règles explicites **sans prétention de compréhension** | cas confirmé/contredit/absent et justification testés |
| P1 | Exemple de rang LoRA trop petit | d=1000, r=8 : dense 1 000 000, deux facteurs 16 000 ; garder contre-exemple r trop grand | Calculs, limites et coûts auxiliaires explicités |
| P1 | Exemples Python silencieux, décimales hétérogènes | `print` didactiques lorsque utiles, formatage français dans interface sans casser le code Python | sortie visible par exemple, tests des rendus |
| P1 | Lacunes : hallucinations, fenêtre de contexte, biais, alignement, impacts énergétiques | Parcours transversal de cas vérifiables avec limites, définitions et sources | aucun thème réduit à une étiquette sans activité |
| P2 | MathJax embarqué massif et URL tierces | Mesurer chargement sur PC lycée, réseau hors ligne et dépendances ; alléger sans perte d'accessibilité | mesures de poids/temps, zéro requête externe observée si cette promesse est maintenue |
| P2 | Modes et contrastes | Distinguer contraste/projection d'un vrai mode sombre ; contrôler champs, focus et lisibilité | captures navigateur, vidéoprojecteur réel et navigation clavier |

## Ordre d'exécution

1. **V4-R1 : génération observable** — mini-modèle de bigrammes et distribution qui change vraiment selon contexte ; API et code Python lisibles ; jeu de tests et fiche enseignant.
2. **V4-R2 : expérience entraînement/validation** — séparation train/validation/test, comparaisons honnêtes et perplexité ; lien au générateur.
3. **V4-R3 : chaîne calculatoire** — vecteurs, Q/K/V, causalité, passage avant, erreur et ajustement.
4. **V4-R4 : évaluation pédagogique** — quiz révisés, réponse libre, transfert inédit, export corrigé.
5. **V4-R5 : qualité de diffusion** — réseau, performance, accessibilité, terminologie officielle NSI.

## Critères bloquants

- Ne pas confondre bigrammes statistiques et LLM/Transformer : le premier est un **modèle de langage pédagogique**, pas un LLM.
- Ne jamais annoncer une « courbe en U » garantie : une validation peut évoluer différemment selon données, capacité et entraînement.
- Aucun nouveau label « validé pédagogiquement » sans épreuve de transfert auprès de vrais débutants.
- Conserver les 42 vérifications historiques et ajouter des tests, sans adapter un oracle seulement pour obtenir du vert.
- Toute sortie présentée comme une génération doit effectivement être échantillonnée depuis une distribution apprise du corpus.

**Statut : rapport de contre-audit créé ; aucune refonte applicative effectuée et aucune nouvelle préproduction publiée.**
