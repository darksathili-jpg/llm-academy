# LLM Academy — consignes de reprise
Dépôt dédié : https://github.com/darksathili-jpg/llm-academy.
## Exigences
- Français, contenu original, sources primaires ; indiquer les simplifications.
- Application statique React + TypeScript strict, Vite, base /llm-academy/.
- Calculs purs testables. Aucun résultat, progrès ou bouton fictif.
- Phases A/B d'abord. Modules 03–12 explicitement indisponibles.
- Progression locale versionnée, export/import validé, pas de compte ni clé privée.
- Modes clair/sombre/projection, clavier, reduced-motion, responsive.
- Pyodide uniquement à la demande dans les futures phases ; pas en page d'accueil.
- Ne pas copier un livre. Pas de force-push, suppression destructive ou secret.
## Commandes
npm ci
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run dev
npm run preview
## Structure
src/core : moteurs et persistance ; src/content : pédagogie ;
src/components : UI et laboratoires ; tests : tests unitaires et navigateur ;
docs : cadrage, références, statut et décisions.
## Avant de livrer
Lire docs/ROADMAP.md, inspecter git status, conserver les changements existants.
Exécuter les validations. Rapporter les résultats observés, les limites et l'état réel du déploiement.

