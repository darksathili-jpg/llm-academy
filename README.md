# LLM / Atelier des machines à langage

Plateforme française pour voir, manipuler, programmer et expliquer les mécanismes des modèles de langage.

Qualification pédagogique V4 sur `refonte/qualification-pedagogique-v4`, construite sur la V3. La branche n'est pas fusionnée dans `main`. Sa publication de démonstration se fait directement par GitHub Actions, sous réserve de la configuration de GitHub Pages.

## Première visite

Commencer par `#/decouvrir` : quatre écrans en langage courant, sans code, pour choisir un mot puis vérifier une réponse. Les dix activités guidées expliquent les termes au voisinage des commandes ; les détails scientifiques restent accessibles. Voir [la reprise après retour enseignant](docs/PRISE_EN_MAIN_SIMPLE.md). L’ancienne appréciation de 91/100 ne représente plus une note actuelle d’utilisabilité.

## Trois espaces

- Atelier Terminale NSI : sept activités conseillées pour débuter, trois approfondissements facultatifs ; prérequis différenciés, dix missions Python avec assertions et corrigés distincts.
- Studio formateur : séances de 1/2/3/6 heures, questions orales, corrections progressives, deux chronomètres, reprise, projection, notes privées séparées et fiches imprimables. Dossier pour enseignants débutants : `#/enseignant`. Trois séances de 60 minutes et leurs fiches séparées : `#/seance/<id>` (enseignant avec corrigés) / `#/fiche/<id>` (participant sans corrigés).
- Laboratoire : dix instruments intuitifs/scientifiques ; neuf modules approfondis conservés.

Huit expériences prioritaires : prédiction, BPE, génération, attention, apprentissage neural, détective des hallucinations, prompting et mini-RAG. Les probabilités/gradients/recherches sont calculés ; les scores inventés, textes préparés et approximations sont signalés. Pas de LLM de production local, pas d'API obligatoire.

## Développement

Node 22 et npm. Installation : `npm ci`.

```
npm run dev
npm run format:check
npm run typecheck
npm test
python3 scripts/verify-nsi-challenges.py
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

[Audit V4 activité par activité](docs/AUDIT_PEDAGOGIQUE_V4.md) et [refonte pédagogique NSI V3](docs/REFONTE_NSI_V3.md). Les dix corrigés Python sont exécutés dans la CI ; cela ne remplace pas une validation en classe.

[Rapport de validation V2](docs/RAPPORT_VALIDATION_V2.md), [guide formateur](docs/SCENARIOS_FORMATEUR.md), [périmètre scientifique](docs/EXPERIENCES_SCIENTIFIQUES.md), [correspondances NSI](docs/PROGRAMME_NSI_CORRESPONDANCES.md), [limites](docs/LIMITES_CONNUES.md), [audit initial](docs/REFONTE_AUDIT_INITIAL.md).

Les durées sont proposées ; les profils testés sont hypothétiques. Aucun essai terrain ni certification WCAG n'est revendiqué. Textes, corpus et figures originaux, références primaires citées ; aucun livre reproduit.

GitHub Pages conservé. Après autorisation de fusion : workflow de validation, publication, puis contrôle du domaine public `node scripts/verify-live.mjs`. Une URL de preview peut être contrôlée avec la variable `LLM_ACADEMY_URL`.

## Publication de démonstration V4 (sans fusion)

Dans [Settings > Pages](https://github.com/darksathili-jpg/llm-academy/settings/pages), choisir **Build and deployment > Source : GitHub Actions**. Ne pas choisir « Deploy from a branch » : la racine de la branche contient le point d'entrée TypeScript de Vite, qui n'est pas directement publiable.

Le workflow `.github/workflows/pages.yml` :

1. vérifie le format, TypeScript, les tests unitaires, les dix corrigés Python et les tests navigateur ;
2. construit `dist/` avec `base: '/llm-academy/'` et refuse une entrée TypeScript non compilée ;
3. autorise la publication uniquement pour un `push` sur `main` ou `refonte/qualification-pedagogique-v4`, jamais pour une Pull Request ;
4. publie l'artefact `dist/` avec `actions/deploy-pages` ;
5. lance `node scripts/verify-live-pages.mjs` dans Chromium contre l'URL réellement publiée, puis contrôle le parcours V4, le dossier enseignant, la fiche participant et l'absence de débordement mobile.

Consulter l'onglet **Actions > Validate and publish LLM Academy**. Si l'étape `publish` refuse la branche, examiner **Settings > Environments > github-pages** : autoriser la branche V4 dans les règles de déploiement. Le site public https://darksathili-jpg.github.io/llm-academy/ est unique : publier V4 remplace temporairement la version actuellement servie, sans fusion Git.

La validation automatique du site en Chromium ne remplace pas une inspection humaine sur vidéoprojecteur, au clavier, avec lecteur d'écran et sur les navigateurs requis.
