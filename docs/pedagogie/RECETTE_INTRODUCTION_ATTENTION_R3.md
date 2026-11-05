# R3 — La démystification précède Q/K/V

**Date :** 5 novembre 2026 · **Branche :** `feature/academy-pedagogie-microduck-r1` · **Statut :** implémenté, tests et essais humains à réaliser.

## Parcours obligatoire pour débutant (ordre scientifique)

1. `public/pilotes/microduck-introduction-attention-r1/index.html` : comprendre le besoin de combinaison, limites de l'analogie, masque causal, différence entre position accessible et poids, combinaison pondérée de deux valeurs, transfert inédit.
2. `public/pilotes/microduck-attention-v2/index.html` : matérialiser les positions et la matrice complète, avec les sprites officiels.
3. `public/pilotes/microduck-qkv-r1/index.html` : calculs de Q, K, V et softmax avec vecteurs pédagogiques choisis, explicitement distingués de vraies données apprises.
4. `public/pilotes/microduck-attention-reelle-r1/index.html` : comparer les poids réellement exportés depuis PyTorch, après génération par `export_microduck_attention.py`.
5. `public/pilotes/evaluation-attention-n0-n5/index.html` : diagnostic, explication, calcul, transfert et critique, avec correction humaine pour réponses ouvertes.

## Critères de maîtrise

Avant Q/K/V : expliquer pourquoi combiner des positions ; distinguer permission et poids ; calculer une combinaison pondérée ; savoir ce que Microduck représente et ce qu'il ne représente **pas**.

Après Q/K/V : justifier le produit scalaire, la mise à l'échelle par racine de dimension, le masquage avant softmax, la somme pondérée des vecteurs V. Faire le lien avec les cartes du Mini-Transformer réel sans prétendre que les poids expliquent causalement une prédiction.

## Audit des simplifications

- Les valeurs numériques de l'introduction (2 et 8) sont une représentation scalaire d'une combinaison, pas des vecteurs appris.
- La séquence « ababa » est caractère par caractère conformément au Mini-Transformer utilisé.
- L'exemple de transfert (valeurs 1,3,5,7,9 et poids 0,10;0,15;0,25;0,30;0,20) a pour sortie exacte **5,70**.
- Une erreur de calcul peut être détectée automatiquement ; une justification écrite exige encore un évaluateur humain.
- Le pilote n'établit pas à lui seul une efficacité auprès des élèves.

## Recette

```powershell
git switch feature/academy-pedagogie-microduck-r1
git pull --ff-only
npm run build
npx playwright test "microduck-introduction-attention-r1|microduck-qkv-r1|evaluation-attention-n0-n5" --reporter=list
```

Le serveur de tests Playwright utilise `npm run preview`, donc une compilation `dist/` récente est nécessaire.

**Gate G-DÉMYSTIFICATION : EN VÉRIFICATION** jusqu'à preuve Playwright + revue scientifique indépendante + essai novice/enseignant avec deux exercices de transfert.
