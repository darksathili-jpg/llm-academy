# Phase C — fondements scientifiques

## Périmètre de la livraison

Modules 03 à 06 avec situation-problème, objectifs mesurables, diagnostic, cours, laboratoire, exercices corrigés, aides, transfert, grille de relecture, synthèse et sources.
Les modules 07 à 12 restent explicitement à venir.

## Expériences réellement calculées

- Embedding Explorer : table ID → vecteur inventée, coordonnées 3D, produit scalaire, normes, cosinus et trois projections orthographiques. Vecteur nul explicitement indéfini.
- Math Lab : matrices 2×2 modifiables, détail ligne-colonne, softmax/perte réutilisés, quadratique L(w)=(w−2)² avec gradient exact et trajectoire mesurée. Axe du graphe log(1+perte), tableau de valeurs brutes.
- Attention Studio : matrices Q/K/V 3×2 modifiables, scores divisés par √d_k, masquage avant softmax, poids, sorties, une ou deux têtes par découpage de colonnes. Le studio n’effectue pas Wo ; le Transformer l’effectue.
- Transformer Explorer : E, positions sin/cos, bloc pré-normalisé, projections Q/K/V, attention multi-têtes causale, concaténation/Wo, deux résidus, FFN ReLU, normalisation finale et logits. Un bloc, pas de biais ou dropout ; poids déterministes non entraînés et inspectables.

## Références numériques indépendantes

- [1,0,2] et [1,0,−2] : cosinus 3D = −0,6 ; projection 0–1 = 1.
- [[1,2],[3,4]] × [[2,0],[1,2]] = [[4,4],[10,8]].
- Gradient depuis w=0 avec η=0,2 : w=0,8 ; L=1,44. η=1 : alternance 0/4 et perte 4.
- Q=0 et deux positions autorisées : poids [0,5;0,5], sortie moyenne.
- Masque causal trois positions : première ligne [1,0,0], sommes par ligne égales à 1.
- Changer les tokens futurs ne modifie pas les logits antérieurs du bloc causal, y compris en variantes de dimension/têtes/positions/résidus.

## Migration du carnet

Schéma 2, clé locale historique conservée. Lecture/import du schéma 1 migrés en mémoire ; réponses, notes et préférences conservées. Nouvelles notes vides, scores recalculés, aucun crédit automatique. Les écritures utilisent le schéma 2. Import : 500 Ko maximum en octets UTF-8 ; 10 000 caractères par note.

## Limites

Vecteurs et poids inventés, aucun apprentissage ou langage acquis. Un graphique 2D n’est pas une représentation complète. Une carte d’attention n’est pas une preuve causale. Les seuils d’optimisation appartiennent à la quadratique illustrée.
Pyodide reste différé : les calculs actuels se font nativement en TypeScript.
Expériences réinitialisées en changeant de page ; carnet et réponses conservés.
Accessibilité automatisée complétée par inspection de captures ; audit humain et multi-navigateurs encore nécessaire.
