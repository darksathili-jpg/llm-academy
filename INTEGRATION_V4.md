# LLM Academy — Kit d’intégration de la formation autonome V4

**État : prévisualisation locale uniquement.** Aucun commit, push, déploiement, fusion, ni autorisation de L2. Candidat de formation non certifié. Ce kit **n’inclut pas les modifications locales L1**.

## Contenu

- `public/pilotes/formation-v4/index.html` : prototype autonome de 15 chapitres ; JavaScript/CSS/MathJax et illustrations inclus dans ce fichier.
- `docs/pilotes/formation-v4/` : documentation et journal des contrôles effectués lors de la fabrication du prototype.

## Intégration sans toucher à L1

Depuis PowerShell dans le dépôt Git principal :

```powershell
$dest = "$env:USERPROFILE\llm-academy-v4"
Test-Path -LiteralPath $dest
# Continuer uniquement si False et si la branche n’existe pas déjà.
git branch --list integration/formation-autonome-v4
git worktree add -b integration/formation-autonome-v4 "$dest" 1bd20ae9e8dc59112c7e7dfa794657a8961b42ec
```

Ensuite, extraire **le contenu** du ZIP dans la racine de ce nouveau worktree (PowerShell `Expand-Archive` avec `-DestinationPath $dest`, **sans `-Force` en cas de fichiers existants**) et contrôler `git status --short`.

La V4 est une **prévisualisation parallèle** : elle ne remplace ni `src/App.tsx`, ni `main`, ni le chantier L1. Le prototype peut être lu en ouvrant directement le HTML. Une fois les dépendances installées, démarrer Vite depuis le worktree pour consulter :

`http://127.0.0.1:5173/llm-academy/pilotes/formation-v4/index.html`

Le port doit être celui indiqué dans le terminal Vite. Pour tester la compilation GitHub Pages, exécuter la commande du dépôt (`npm run build`) dans un environnement disposant des permissions nécessaires et vérifier le fichier `dist/pilotes/formation-v4/index.html`.

## Point de qualification impératif

Le fichier HTML inclut le moteur MathJax compilé et ne doit pas être reformatté automatiquement. La commande `npm run format:check` vérifie aussi les fichiers statiques : une **stratégie explicite de formatage/exception** doit être approuvée pour ce fichier. Si une exception est retenue, ajouter son chemin exact à `.prettierignore` sur la branche d’intégration, et vérifier que ce choix n’entraîne pas de dette sur les sources éditables. Les documents V1.1 historiquement non formatés ne doivent pas être réécrits silencieusement.

Il faudra ensuite vérifier les chemins de navigation vers ce pilote, la lisibilité, les scripts mathématiques, les exercices et l’ensemble des tests existants. Le pilote V4 n’est **pas encore intégré au moteur React** : déplacer les activités vers le site principal constitue une étape ultérieure nécessitant audit et décision humaine.

**Aucune publication ni réception pédagogique n’est impliquée par le présent kit.**
