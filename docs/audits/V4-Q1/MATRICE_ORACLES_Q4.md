# V4-Q4 — Qualification des calculs scientifiques

Date : 30 octobre 2026. Référence protégée : `v4-pilote-retrouve-20261030`.

## Travail effectué

Lecture intégrale du blob Git du pilote HTML `df4b47bb9af84512fde1ceb2d7a843ec33afcb01`, y compris des fonctions JavaScript qui calculent les sorties des expériences. Neuf tests Playwright supplémentaires sont déposés dans `tests/e2e/formation-v4-q4-science.spec.ts`. Ils utilisent des **résultats attendus numériques calculés indépendamment** et évaluent des valeurs affichées dans la page, pas seulement la présence des contrôles.

## Matrice d'oracles

| Chapitre | Contrôle | Oracle |
|---|---|---|
| 03 | Softmax scores [2,1,0] | T=1 : 66,5 / 24,5 / 9,0 % ; T=2 : 50,6 / 30,7 / 18,6 % |
| 04 | Masque causal 4×4 | 10 positions autorisées, 6 interdites |
| 05 | Un pas d'entraînement | perte train ln(3)→ln(2), perte validation ln(3)→ln(4) |
| 08 | Similarité cosinus | 0,80 ; 0 ; −1 selon vecteur |
| 09 | Attention à deux valeurs | score 1 : 17,311 ; score 0 : 15,000 |
| 11 | Gradient L(w)=(w−2)² | η=0,25 → w=1 et perte=1 ; η=1,2 → perte=7,84 |
| 12 | Génération top-k | k=1 : [100 %, 0 %, 0 %] |
| 13 | LoRA 4×4 | r=1,2,4 : 8,16,32 coefficients factorisés |
| 15 | VP=3,FP=1,FN=2,VN=4 | précision 75 %, rappel 60 %, exactitude 70 % ; VP=FP=0 → précision non définie |

Ces vérifications ciblent neuf chapitres ; elles ne constituent **pas** une qualification complète des quinze manipulations, ni la certification de leur modèle pédagogique. Les chapitres 01, 02, 06, 07, 10 et 14 restent à couvrir par des scénarios scientifiques détaillés. Le test Q2 antérieur vérifie déjà un cas de fuite/déduplication au chapitre 07, mais ne couvre pas toutes ses limites.

## À exécuter (sans Codex)

Depuis PowerShell, sur `audit/v4-qualification-q1` :

```powershell
git pull --ff-only
npm run build
npx playwright test tests/e2e/formation-v4-q4-science.spec.ts --reporter=list
```

**Statut : tests publiés mais NON EXÉCUTÉS au moment de ce rapport.** Un éventuel échec devra être trié entre erreur de test, affichage, valeur numérique et modèle mathématique, avant correction. La référence protégée n'a pas été modifiée.

## Critères de réception

- Tous les tests d'oracle réussis sur le pilote réel.
- Cas limites supplémentaires et six expériences restantes contrôlés.
- Relecture didactique indépendante, tests de transfert sans assistance.
- Aucun résultat scientifiquement non fondé présenté comme une preuve d'acquisition.
