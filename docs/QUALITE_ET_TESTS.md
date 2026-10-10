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

## Résultats observés — 10 octobre 2026

- TypeScript strict : réussi ; build de production : réussi.
- 52 tests unitaires et 14 scénarios Chromium : réussis localement et dans GitHub Actions/Linux.
- Axe sur accueil, deux modules, carnet et références dans trois thèmes : zéro violation relevée.
- Débordement horizontal contrôlé à 390, 768 et 1440 px ; captures bureau/mobile relues.
- Sauvegarde, import/export, stockage refusé, corrections, navigation et hors ligne : réussis.
- npm audit : zéro vulnérabilité signalée après mise à jour de Vitest.
- Site public : HTTP 200, exercices/progression et BPE vérifiés, rechargement hors ligne réussi, zéro erreur JavaScript.
  Preuve : [workflow de livraison](https://github.com/darksathili-jpg/llm-academy/actions/runs/38033954722).
  Commande de contrôle public : node scripts/verify-live.mjs. Les résultats ci-dessus décrivent les observations ; ils ne constituent pas une certification d’accessibilité ou de pédagogie.

## Phase C — résultats locaux observés le 10 octobre 2026

- 97 tests unitaires : calcul matriciel, cosinus et projections, LayerNorm, gradient comparé à une différence finie, softmax masqué, références numériques et invariance causale du Transformer.
- 25 scénarios Chromium : anciennes fonctionnalités et quatre nouveaux modules, validation des 24 exercices, migration du carnet historique, imports versionnés, trois thèmes et fonctionnement hors ligne.
- TypeScript strict, formatage reproductible, compilation et audit npm réussis ; zéro vulnérabilité signalée.
- Axe : zéro violation relevée sur les quatre nouveaux modules dans les trois thèmes. Largeurs 390, 768 et 1440 px ; captures du studio d'attention sur bureau et du Transformer sur mobile relues.
- Le workflow applique aussi le contrôle du formatage. Le statut de publication et la preuve du contrôle public sont consignés dans [ROADMAP](ROADMAP.md).
