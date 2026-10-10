# LLM Academy — consignes de reprise

Dépôt dédié : https://github.com/darksathili-jpg/llm-academy. Refonte V2 sur refonte/atelier-v2 ; conserver les changements et le carnet historique.

## Exigences

Français, contenu original, sources primaires datées, simplifications au voisinage des expériences. React/TypeScript strict/Vite, base /llm-academy/. Aucun résultat fictif, score libre inventé ou vrai LLM local prétendu. Trois espaces : atelier NSI, studio formateur prioritaire, laboratoire.

Dix investigations et quatre scénarios disponibles ; neuf modules approfondis, trois cours de la collection initiale encore à venir. Moteurs purs testables. Carnet schéma 4, migrations 1/2/3 et même clé ; imports bornés 2 Mo. Notes privées uniquement en Coulisses : ne jamais les lire dans Projection ni les exporter dans le carnet/fiches.

Pyodide 0.28.3 à la demande en Worker ; code .py en repli ; aucun quota mémoire dur revendiqué. Pas de compte, clé privée, télémétrie ni service LLM obligatoire. Garder clair/sombre/projection/impression, clavier, responsive et hors ligne.

Ne pas copier un livre. Pas de force-push, suppression destructive, modification des réglages globaux Codex ou déploiement non autorisé.

## Validation

npm run format:check
npm run typecheck
npm test
npm run build
npx playwright test
npm audit

Optionnel avec réseau et Python/PyTorch local :
python scripts/verify-notebooks.py
node scripts/verify-python-browser.mjs
node scripts/verify-profiles-v2.mjs

Les scripts navigateur nécessitent le serveur de preview sur 4173. Lire docs/RAPPORT_VALIDATION_V2.md et docs/LIMITES_CONNUES.md. Inspecter les captures, pas seulement les tests. Rapporter les résultats observés en français, les limites et l'état réel de publication.
