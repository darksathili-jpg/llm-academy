# Recette R1 — démystification progressive de la softmax

Date : 5 novembre 2026. Branche : `feature/academy-pedagogie-microduck-r1`.

## Livrables

- `public/pilotes/microduck-introduction-softmax-r1/index.html` : page autonome de démystification, la calculatrice NumWorks officielle n'est chargée que sur demande.
- `tests/e2e/microduck-introduction-softmax-r1.spec.ts` : tests de navigation, oracles, correction d'idées fausses, température, passage et défi critique.
- Liens depuis `microduck-transversal-r1` et `microduck-qkv-r1`.

## Échelons réellement présents

N0/N1 : conflit cognitif « score le plus élevé = certitude ». Une erreur reçoit une remédiation avant d'autoriser le passage.

N2 : modifier T dans [0,5 ; 3] et distinguer concentration / aplatissement des probabilités.

N3 : calculer pA pour (2,1,0) et T=1, puis justifier l'invariance des poids quand on ajoute la même constante aux trois scores.

N4-A : problème inédit (2,0,-1) à T=2 avec les trois probabilités numériques et une justification, Microduck présent comme compagnon sans fournir la méthode.

N4-B : **problème inverse distinct** : pour les scores (2,0), retrouver T > 0 tel que pA≈0,80 et justifier le résultat. Oracle : T = 2/ln(4) ≈ 1,442695. Le passage au défi critique requiert les deux résultats numériques et leurs justifications rédigées, qui restent soumises à correction humaine.

N5 : discerner le débordement numérique possible sur les scores (1000,999,998), proposer une softmax stable et un test Python. **Mode enseignant** : fournir en outre deux diagnostics d'erreurs distinctes, une remédiation active et une question nouvelle avec critères de correction. Une longueur minimale ne prouve pas la qualité de ces réponses.

Les tâches N4 et N5 n'automatisent que certains contrôles ou l'accès à la grille ; **elles ne certifient pas les explications libres**. Deux problèmes N4 différents sont désormais présents. Pas de qualification officielle sans correction humaine, deuxième N5 contradictoire et étude différée.

## Valeurs de référence indépendantes

`softmax([2,1,0],1) = [0.665240956, 0.244728471, 0.090030573]`

`softmax([2,1,0],2) = [0.506480391, 0.307195886, 0.186323723]`

`softmax([2,0,-1],2) = [0.628531719, 0.231223898, 0.140244383]`

Méthode : `z_i = s_i/T`, `m=max(z)`, `e_i=exp(z_i-m)`, `p_i=e_i/sum(e)`, pour T>0. L'invariance par translation est un résultat mathématique exact, les arrondis des nombres flottants introduisant une tolérance.

## Commandes de test

```powershell
git switch feature/academy-pedagogie-microduck-r1
git pull --ff-only
npm run build
npx playwright test "microduck-introduction-softmax-r1" --reporter=list
```

URL en développement : `http://localhost:5173/llm-academy/pilotes/microduck-introduction-softmax-r1/index.html`.

**Statut : travaux R2 réalisés sur branche ; dernier résultat utilisateur avant R2 : 3/4 tests réussis (une assertion d'images trop stricte, corrigée depuis). La réussite de la nouvelle suite Playwright n'a pas été vérifiée ; maîtrise réelle non mesurée.** Aucune fusion `main`, aucune publication officielle.
