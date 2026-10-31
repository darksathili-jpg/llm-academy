# Résultats reçus — Mini-Transformer (31 octobre 2026)

Branche : `feature/v4-mini-transformer`.

## Exécution sur le poste de l'utilisateur

Cinq tests unitaires : `Ran 5 tests in 4.223s — OK`. Le dernier test visible est `test_no_longer_than_context ... ok`.

| Étape | Perte entraînement | Perte validation | Perplexité validation |
|---:|---:|---:|---:|
| 0 | 3.342 | 3.363 | 28.87 |
| 50 | 1.329 | 1.351 | 3.86 |
| 100 | 0.827 | 0.845 | 2.33 |
| 150 | 0.500 | 0.482 | 1.62 |
| 200 | 0.262 | 0.245 | 1.28 |
| 250 | 0.184 | 0.182 | 1.20 |

Génération observée :

```text
le chat dort dans la maisuie le jardin.
le chien jardent dans la mansor dor jardin.
le vendort s dans la maisonn.
lee chien joue
```

**Interprétation :** le modèle apprend bien à ajuster ses paramètres et à produire une sortie non préécrite, mais la qualité linguistique reste insuffisante. La validation est contaminée par la répétition des phrases dans le corpus avant découpage ; les pertes basses ne prouvent pas la généralisation.

**Décision :** gate d'exécution du prototype passé selon les résultats communiqués ; gate de généralisation et de réception pédagogique NON passé. Ne pas publier le prototype Python comme produit pédagogique fini. Prochaine priorité : corpus disjoint par phrases/documents avant répétition, protocole de comparaison honnête, et instrumenter l'attention / embeddings dans un laboratoire visuel.

Aucune modification de la V4 protégée ni du site principal.
