# Recette — Microduck et véritable attention PyTorch (R1)

**Périmètre :** branche `feature/academy-pedagogie-microduck-r1`, sans toucher à la V4 gelée ni à `main`.

## Architecture vérifiable

L'exporteur `experiments/mini_transformer/export_microduck_attention.py` réutilise **exactement** `build_comparison()` de `compare_attention.py`, donc les données de `MiniTransformer` : un état initial et le même modèle après optimisation AdamW. L'export est un instantané déterministe en fonction de la graine, du nombre de mises à jour, de l'environnement PyTorch et du prompt choisi. Il ne s'agit pas d'un modèle s'exécutant en direct dans le navigateur.

Les poids par tête sont extraits des tenseurs de l'attention de la première couche ; le navigateur affiche les nombres exportés, sans les inventer. Le personnage Microduck est un repère visuel de **la position de ligne sélectionnée**, non un avatar d'un neurone. Le masque et la softmax sont deux mécanismes distincts ; la distribution du caractère suivant est une troisième sortie.

## Générer l'activité réelle et la tester

```powershell
git switch feature/academy-pedagogie-microduck-r1
git pull --ff-only
python experiments/mini_transformer/export_microduck_attention.py
python -m unittest discover -s experiments/mini_transformer -p "test_export_microduck_attention.py" -v
npm run build
npx playwright test tests/e2e/microduck-attention-reelle-r1.spec.ts --reporter=list
```

L'export écrit `public/pilotes/microduck-attention-reelle-r1/index.html` : il **faut générer ce fichier avant le test navigateur**. Il ne contient aucun appel réseau ; les sprites sont chargés depuis la mission V2 voisine. Il s'agit de données de modèle réelles, mais elles restent limitées au corpus d'entraînement pédagogique, ce qui interdit une conclusion sur la compréhension sémantique ou la généralisation.

Ouvrir en local via `npm run dev` puis `http://localhost:5173/llm-academy/pilotes/microduck-attention-reelle-r1/index.html` (si Vite utilise l'URL et le port par défaut). Ne pas ouvrir le gabarit `microduck_attention_real_template.html` directement : il n'a volontairement pas de données et affichera une erreur.

## Vérifications conceptuelles incontournables

- Dévoilement après une hypothèse, pas avant.
- Masque triangulaire avec diagonale ; les poids futurs valent zéro.
- Pour chaque ligne et chaque tête : somme des poids égale à 1 dans la tolérance des arrondis.
- Quatre têtes examinables avant et après ; mêmes positions et mêmes paramètres d'architecture.
- Panneau enseignant : Q/K/V, produit scalaire, division par racine de dimension, masque, softmax et somme des V.
- Aucune confusion entre poids d'attention et probabilités du prochain caractère.
- Transfert à l'indice 6 sur 10 positions = sept positions accessibles, avec justification humaine.
- Visuel : une seule image Microduck et repli textuel ; mouvements réduits pris en compte.

## État

**Code livré ; tests automatiques non encore exécutés par l'assistant ni par l'utilisateur pour ce module R1.** La mission générée n'est pas encore versionnée ni publiée sur Pages. Aucun verdict de gate navigateur ou de réception pédagogique ne doit être annoncé avant résultats vérifiés.
