# Recette Microduck V2 — résultats communiqués

**Date :** 31 octobre 2026  
**Branche :** `feature/academy-pedagogie-microduck-r1`

## Résultats du poste utilisateur

- Génération du service worker réussie : identifiant `a7bd09d55475c63e`, 34 ressources locales.
- Test Playwright `V2 : sprites réels, hypothèse puis masque correct` : réussi (1,9 s).
- Test Playwright `V2 : déplacement un seul Microduck et transfert argumenté` : réussi (771 ms).
- Bilan : **2 passed (6.6s)**.

Ces tests ont été exécutés par l'utilisateur, pas relancés à distance par l'assistant. Aucun essai élève novice n'est encore documenté.

## Décision

Gate technique initial **réussi selon la sortie transmise**. Les 12 fichiers PNG et la page HTML de la mission sont actuellement installés localement ; leur présence dans le dépôt distant n'est pas attestée par cette campagne. Les fichiers applicatifs doivent être ajoutés et poussés séparément sur la branche de travail, sans toucher à `main` ni à la V4 protégée.

## Publication des fichiers locaux

Depuis `llm-academy-v4` sur `feature/academy-pedagogie-microduck-r1` :

```powershell
git status -sb
git add public/pilotes/microduck-attention-v2/
git commit -m "feat(microduck): integrer mission V2 et sprites officiels"
git push origin feature/academy-pedagogie-microduck-r1
```

Ne pas publier en cas d'anomalie sur `git status`; demander une revue de la liste des fichiers concernés.

## Suite pédagogique

Comparer l'animation Microduck à une représentation sans animation, vérifier l'interprétation des cellules de la matrice et intégrer progressivement l'export réel des poids du Mini-Transformer.
