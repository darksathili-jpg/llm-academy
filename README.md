# LLM / Atelier des machines à langage

Plateforme française pour voir, manipuler, programmer et expliquer les mécanismes des modèles de langage.

Refonte V2 sur la branche `refonte/atelier-v2` ; le domaine public n'est pas déclaré mis à jour tant que cette branche n'est pas fusionnée et vérifiée.

## Première visite

Commencer par `#/decouvrir` : quatre écrans en langage courant, sans code, pour choisir un mot puis vérifier une réponse. Les dix activités guidées expliquent les termes au voisinage des commandes ; les détails scientifiques restent accessibles. Voir [la reprise après retour enseignant](docs/PRISE_EN_MAIN_SIMPLE.md). L’ancienne appréciation de 91/100 ne représente plus une note actuelle d’utilisabilité.

## Trois espaces

- Atelier Terminale NSI : dix investigations, huit étapes, hypothèses et observations locales, Python facultatif et grille de relecture.
- Studio formateur : séances de 1/2/3/6 heures, questions orales, corrections progressives, deux chronomètres, reprise, projection, notes privées séparées et fiches imprimables.
- Laboratoire : dix instruments intuitifs/scientifiques ; neuf modules approfondis conservés.

Huit expériences prioritaires : prédiction, BPE, génération, attention, apprentissage neural, détective des hallucinations, prompting et mini-RAG. Les probabilités/gradients/recherches sont calculés ; les scores inventés, textes préparés et approximations sont signalés. Pas de LLM de production local, pas d'API obligatoire.

## Développement

Node 22 et npm. Installation : `npm ci`.

```
npm run dev
npm run format:check
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Preview : `npm run preview`, http://127.0.0.1:4173/llm-academy/. Si PowerShell interprète les arguments npm, utiliser `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort`.

Avec preview actif : `node scripts/verify-profiles-v2.mjs`. Vérification Python réelle facultative avec réseau : `node scripts/verify-python-browser.mjs`. Notebooks CPU/PyTorch : `python scripts/verify-notebooks.py`.

## Données et réseau

Sans compte, télémétrie ni clé API. Carnet local schéma 4 ; anciennes versions migrées ; import/export JSON contrôlé, limite 2 Mo. Les écrits libres ne reçoivent pas de note automatique. Exporter avant d'effacer le navigateur.

Calculs TypeScript et documents locaux hors ligne après mise en cache complète. Pyodide 0.28.3 se télécharge depuis jsDelivr au lancement et reste facultatif. Arrêt/reset, input, sorties bornées et délai de 60 s ; fichier .py en repli. Ce Worker n'est pas présenté comme un environnement certifié pour code hostile.

Coulisses privées dans une fenêtre séparée : jamais affichées dans Projection, jamais incluses dans les fiches. Éviter le partage du bureau complet.

## Documentation

[Rapport de validation V2](docs/RAPPORT_VALIDATION_V2.md), [guide formateur](docs/SCENARIOS_FORMATEUR.md), [périmètre scientifique](docs/EXPERIENCES_SCIENTIFIQUES.md), [correspondances NSI](docs/PROGRAMME_NSI_CORRESPONDANCES.md), [limites](docs/LIMITES_CONNUES.md), [audit initial](docs/REFONTE_AUDIT_INITIAL.md).

Les durées sont proposées ; les profils testés sont hypothétiques. Aucun essai terrain ni certification WCAG n'est revendiqué. Textes, corpus et figures originaux, références primaires citées ; aucun livre reproduit.

GitHub Pages conservé. Après autorisation de fusion : workflow de validation, publication, puis contrôle du domaine public `node scripts/verify-live.mjs`. Une URL de preview peut être contrôlée avec la variable `LLM_ACADEMY_URL`.
