# V4-Q3 — Matrice de qualification scientifique et pédagogique

**Date :** 30 octobre 2026 · **Référence gelée :** `v4-pilote-retrouve-20261030` · **Statut : en cours, non reçu**

## Examen direct du code

Le blob Git `df4b47bb9af84512fde1ceb2d7a843ec33afcb01` a été récupéré intégralement par SHA (2 637 640 caractères). Les 15 exemples Python ont été repérés : 6 propriétés `python:` en littéraux JS et 9 propriétés `"python"` en chaînes JSON. Le script `tests/science/verifier_python_v4.py` est ajouté pour **extraire et réellement exécuter** ces programmes avec assertions et délai d'exécution. **Il n'a pas été exécuté dans cette session**.

Le pilote précise explicitement qu'il **ne dispose pas d'interpréteur Python embarqué** : les boutons copient ou téléchargent les exemples. La présence de 15 exemples ne vaut donc pas validation scientifique.

## Matrice des 15 chapitres

| Chapitre | Manipulation de référence selon dossier formateur | Calcul/vérité indépendante et cas limites à auditer | État |
|---|---|---|---|
| 01 Sources | Classer trois affirmations | Source contredisant une proposition / information absente ; justification de provenance | À éprouver |
| 02 Tokens | Fusion non chevauchante des paires | `abab → [ab,ab]`, `ababa → [ab,ab,a]` ; token ≠ mot | Exemples présents ; à exécuter |
| 03 Softmax | Scores `[2,1,0]` | Distribution ≈ `[0.66524,0.24473,0.09003]`, somme 1 ; translation commune des scores | À éprouver |
| 04 Causalité | Masque triangulaire | Pour 3 positions : 1/2/3 positions autorisées ; futur non accessible | À éprouver |
| 05 Entraînement/validation | Modifier les comptes et comparer des pertes | Mise à jour sur entraînement seulement ; métriques indépendantes, changement de distribution | À éprouver |
| 06 Recherche | Motif `lac` | `lac` présent dans `lac` et `placard` en sous-chaîne ; motif vide → aucun résultat | Exemples présents ; à exécuter |
| 07 Données | Déduplication et séparation | A,B,C,A,D,E → A,B,C,D,E ; ensembles disjoints dans cet exemple, pas garantie générale | E2E fuite réussi ; logique élargie à éprouver |
| 08 Embeddings | Cosinus et produit scalaire | Orthogonalité ; vecteur nul : cosinus non défini / garde-fou explicite | À éprouver |
| 09 Attention | Softmax + somme pondérée | Retrouver la valeur 17,31 documentée avec calcul indépendant, puis variation de score | À éprouver |
| 10 Transformer causal | Ordre des opérations | ID ≠ token ≠ vecteur ; masque avant normalisation ; cache causal | À éprouver |
| 11 Perte/gradient | Mise à jour de paramètre | Pour `L(w)=(w-c)^2`, gradient `2(w-c)` ; pas trop élevé peut augmenter la perte | À éprouver |
| 12 Génération | Température et top-k | k=1 sélectionne le maximum ; T>0 ; échantillonnage ≠ vérité | À éprouver |
| 13 LoRA | Dénombrement des paramètres | Pour `W ∈ R^{d×k}` et rang r : `r(d+k)` paramètres adaptés, contre `dk` pour W seul | À éprouver |
| 14 Consignes | Contrat d'entrée/sortie | Cas nominal, information absente et contradiction ; format JSON valide ≠ exactitude factuelle | À éprouver |
| 15 Évaluation | Précision / rappel / exactitude | TP/(TP+FP), TP/(TP+FN), (TP+TN)/N ; dénominateurs nuls gérés explicitement | À éprouver |

Les valeurs numériques ci-dessus sont des **oracles proposés** pour tests indépendants, pas des résultats déjà obtenus du navigateur.

## Contrôle Python automatisé à exécuter

Depuis la branche d'audit sur Windows :

```powershell
python tests/science/verifier_python_v4.py
```

**Gate P0 :** sortie `15/15 programmes exécutés sans erreur`. Les assertions embarquées sont des contrôles de cohérence des exemples, **pas une validation des calculs indépendants**.

## Critère scientifique renforcé

Pour chaque simulation, conserver une feuille `entrée → prédiction → résultat observé → calcul indépendant → interprétation → limites → verdict`. Un résultat visuel plausible ne suffit pas. Calculer les oracles sans copier la logique de l'application, notamment pour softmax, cosinus, attention, gradient, LoRA et précision/rappel.

## Réception pédagogique : protocole minimal sans prétention statistique

- Un groupe d'élèves novices et des enseignants novices ; consignes sans assistance initiale, puis aides graduées.
- Mesurer : taux d'achèvement, temps observé, nombre et niveau d'aides, erreurs de vocabulaire, qualité des justifications, cas de transfert inédit immédiat et différé.
- Ne jamais transformer un « quiz réussi » ou une case « chapitre revu » en certification.
- Répertorier les besoins d'accessibilité, l'usage du clavier, le contraste en projection et l'absence de spécialité mathématiques.

## Décision

Les **sept tests Playwright précédents ont été rapportés réussis** par l'utilisateur. Le présent audit établit la présence des quinze extraits Python et met en place leur vérificateur, mais ne prétend pas avoir exécuté ce script ni certifié les quinze simulations. **Gate scientifique V4-Q3 non franchie.** La version protégée, le pilote et la branche principale restent inchangés.
