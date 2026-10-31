# Mini-Transformer — deuxième campagne de recette (31 octobre 2026)

**Branche :** `feature/v4-mini-transformer`.

## Résultats communiqués par l'utilisateur

- `Ran 7 tests in 2.212s — OK` (5 tests historiques et 2 tests supplémentaires).
- Export `attention_trace.html` réussi ; 8 positions et jusqu'à 8 prédictions.
- Modèle entraîné pendant 250 étapes avec validation composée de phrases réservées avant répétition.

| Étape | Perte train | Perte validation | Perplexité validation |
|---:|---:|---:|---:|
| 0 | 3.329 | 3.334 | 28.04 |
| 50 | 1.319 | 1.384 | 3.99 |
| 100 | 0.800 | 0.922 | 2.52 |
| 150 | 0.459 | 0.655 | 1.92 |
| 200 | 0.244 | 0.605 | 1.83 |
| 250 | 0.186 | 0.601 | 1.82 |

Génération observée :

```text
le chat regarde la lune.
le chien regarde le jardire le tort sonla maison.
le ple chien rehien t chien regarde jarde la mbre lai
```

## Interprétation et restrictions

La validation diminue encore jusqu'à l'étape 250 ; aucune remontée démontrée, donc ne pas diagnostiquer une courbe en U de surapprentissage. L'écart entre pertes train et validation indique des difficultés de généralisation. Les phrases ne sont pas identiques entre les ensembles, mais leur vocabulaire et leurs structures se recoupent fortement. Les évaluations utilisent un petit échantillonnage de batches et ne représentent pas une mesure stable sur corpus indépendant large.

L'export d'attention inspecte un modèle **non entraîné**, et ne constitue pas encore une comparaison avant/après.

**Décision :** exécution et export validés selon les sorties de l'utilisateur ; validation scientifique globale et réception pédagogique en attente.
