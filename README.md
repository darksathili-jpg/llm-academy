# LLM Academy
Plateforme francophone pour comprendre les LLM en expérimentant leurs mécanismes.
Première livraison : modules 01 et 02, expériences de probabilités et BPE, évaluations et carnet local. Modules 03–12 annoncés explicitement comme à venir.
## Développer
Prérequis : Node 22.13+ et npm.
```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```
## Publier
Le workflow .github/workflows/pages.yml valide et construit l'application puis publie dist sur gh-pages. Dans Settings > Pages, sélectionner Deploy from a branch, gh-pages, / (root). Si la branche n'existe pas encore, attendre le premier workflow puis la sélectionner.
URL prévue : https://darksathili-jpg.github.io/llm-academy/
Le routage hash et la base /llm-academy/ sont compatibles avec GitHub Pages.
## Données
Aucun compte ni clé API. Carnet stocké dans ce navigateur, exportable en JSON. L'import est contrôlé ; les réponses sont recalculées pour déterminer les compétences. Effacer les données du navigateur efface le carnet. Mode hors ligne après une première visite réussie en production.
## Documentation
[Cahier des charges](docs/CAHIER_DES_CHARGES.md) · [Architecture](docs/ARCHITECTURE.md) · [Pédagogie](docs/PROGRESSION_PEDAGOGIQUE.md) · [Références](docs/REFERENCES.md) · [Tests](docs/QUALITE_ET_TESTS.md) · [Roadmap](docs/ROADMAP.md).

