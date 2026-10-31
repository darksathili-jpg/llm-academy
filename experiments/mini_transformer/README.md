# Mini-Transformer — laboratoire expérimental V4-R2

**Branche isolée :** `feature/v4-mini-transformer`. Aucun changement sur la V4 publiée, la préproduction ou `main`.

## Ce qui est réellement implémenté

Un modèle neuronal **autorégressif caractère par caractère**, avec embeddings de tokens et de positions, auto-attention causale multi-têtes (Q, K, V), normalisation, connexion résiduelle, réseau feed-forward, projection vers le vocabulaire, cross-entropie, rétropropagation et mise à jour AdamW. Les poids ne sont pas préprogrammés. Le programme montre une perte d'entraînement et de validation puis génère effectivement des caractères depuis ses propres probabilités, avec température, top-k et graine.

**Ce n'est pas un LLM commercial**, ni un modèle préentraîné. Le corpus est artificiel et court ; le modèle peut mémoriser et produire des textes de faible qualité. Le découpage 90/10 sur des phrases répétées est exclusivement une démonstration de fonctionnement : **ce n'est pas une validation de généralisation indépendante**.

## Installation / exécution

Depuis la racine du projet :

```powershell
python -m pip install torch
python experiments/mini_transformer/mini_transformer.py --steps 250 --seed 42
python -m unittest discover -s experiments/mini_transformer -p "test_*.py" -v
```

Le prototype utilise uniquement Python et PyTorch ; l'exécution demande un environnement Python avec PyTorch, contrairement à la page HTML autonome. Il n'est pas encore intégré dans le navigateur.

## Preuves attendues

- Tenseur de logits de dimension `batch × longueur × vocabulaire`.
- Attention nulle vers les positions futures ; modifier un caractère futur ne change pas la sortie des positions précédentes.
- Calcul de perte fini ; gradient et mise à jour effective d'un poids.
- Même modèle, même prompt et même graine : génération identique.
- Réexécuter l'entraînement et archiver la courbe train/validation sur un corpus **sans répétition inter-ensembles** avant toute conclusion sur généralisation.

**État : code et cinq tests unitaires publiés, tests non exécutés par l'assistant dans cette session. La récupération réseau de la copie GitHub n'a pas été possible dans l'environnement d'exécution.**

## Parcours pédagogique cible

1. Revoir le générateur de bigrammes comme modèle témoin, en 10 minutes, pas comme résultat final.
2. Observer une génération avant/après entraînement du mini-Transformer.
3. Inspecter un tenseur d'embeddings, les scores Q·K, le masque causal, les poids d'attention et les logits.
4. Analyser la cross-entropie et l'effet des paramètres d'entraînement.
5. Faire expliquer aux élèves pourquoi une génération cohérente sur un corpus répété **ne prouve pas une capacité de généralisation**.

**Gate avant intégration :** exécution des tests unitaires, protocole pédagogique, contrôle de non-fuite des données, performances sur PC lycée. Ne pas présenter cette maquette Python comme un labo web terminé.
