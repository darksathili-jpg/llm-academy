# LLM Academy

Plateforme francophone pour comprendre les LLM en expérimentant leurs mécanismes.
Livraison 2 : modules 01 à 06, six laboratoires, 24 exercices et carnet local migré sans perte depuis la première livraison. Modules 07 à 12 explicitement à venir.

## Développer

Prérequis : Node 22.13+ et npm.

```sh
npm ci
npm run dev
npm run format:check
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

## Publier

Le workflow .github/workflows/pages.yml valide et construit l'application puis publie l’artefact dist avec les actions officielles GitHub Pages. Dans Settings > Pages > Build and deployment > Source, sélectionner GitHub Actions. Avec des droits d’administration et des identifiants Git locaux déjà configurés, le script optionnel node scripts/configure-pages.mjs --enable-actions effectue cette configuration ; --inspect lit son état. Les identifiants restent en mémoire et ne sont jamais écrits dans le dépôt.
Site publié et vérifié : https://darksathili-jpg.github.io/llm-academy/
Vérifier le site public avec Chromium : node scripts/verify-live.mjs (connexion requise au début). Voir docs/ROADMAP.md pour la preuve du workflow et les limites de la livraison.
Le routage hash et la base /llm-academy/ sont compatibles avec GitHub Pages.

## Laboratoires scientifiques

Vecteurs et projections ; calcul matriciel et gradient ; attention Q/K/V et masque causal ; passage avant d’un Transformer miniature. Les résultats sont calculés, les vecteurs/poids de démonstration sont inventés et non entraînés. Voir [phase C](docs/PHASE_C.md).

## Données

Aucun compte ni clé API. Carnet stocké dans ce navigateur, exportable en JSON. L'import est contrôlé ; les réponses sont recalculées pour déterminer les compétences. Effacer les données du navigateur efface le carnet. Mode hors ligne après une première visite réussie en production.

## Documentation

[Cahier des charges](docs/CAHIER_DES_CHARGES.md) · [Architecture](docs/ARCHITECTURE.md) · [Pédagogie](docs/PROGRESSION_PEDAGOGIQUE.md) · [Références](docs/REFERENCES.md) · [Tests](docs/QUALITE_ET_TESTS.md) · [Roadmap](docs/ROADMAP.md).
