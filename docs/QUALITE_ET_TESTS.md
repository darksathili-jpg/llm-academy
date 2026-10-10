# Qualité et tests
## Plan
- Unitaires : softmax (normalisation, stabilité, translation, erreurs), perte, probabilités de séquence.
- BPE : fréquence pondérée par occurrences, égalités, chevauchements, Unicode, corpus vide, limites, immutabilité, encodage, inconnus et IDs.
- Persistance : format/version, clés autorisées, types et bornes, données corrompues, refus des résultats falsifiés à l'import.
- E2E Chromium : routes hash, diagnostic, corrections, BPE, carnet/rechargement, export/import, thèmes, largeur 390px, clavier, offline, base GitHub Pages.
- Accessibilité axe : accueil, modules, labo, carnet, trois thèmes ; vérification manuelle du focus et contraste.
## Commandes
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
Le test E2E sert dist sous /llm-academy/ : il teste la production, pas uniquement le serveur de développement.
## Limites
Un scan automatique ne certifie pas WCAG 2.2 AA. Lecteur d'écran réel et plusieurs navigateurs restent à auditer.
Les textes libres ne sont pas évalués sémantiquement par une IA ; la grille est une aide à la relecture.
Voir ROADMAP pour les résultats effectivement obtenus.

