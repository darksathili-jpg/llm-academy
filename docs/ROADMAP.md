# Roadmap et état — 10 octobre 2026

## Livraisons disponibles

- Phases A/B : socle React/TypeScript/Vite, modules 01/02, probabilités et BPE Unicode, carnet local, thèmes, navigation clavier et cache hors ligne.
- Phase C : modules 03 à 06, vecteurs/projections, algèbre/gradient, attention Q/K/V et Transformer miniature. Chaque module comporte diagnostic, cours original, hypothèse, expérience calculée, exercices, transfert, synthèse et sources.
- Six modules, six laboratoires et 24 exercices corrigés. Carnet de schéma 2 avec migration des notes, réponses et préférences de schéma 1. Aucune compétence attribuée automatiquement.
- Moteurs purs testables et poids de démonstration inspectables ; voir [périmètre scientifique](PHASE_C.md).

## Validation locale observée — phase C

Formatage, TypeScript strict et build réussis. 97 tests unitaires et 25 scénarios Chromium réussis.
Axe : zéro violation relevée sur accueil, modules 01–06, carnet et références, dans les trois thèmes. Débordement contrôlé à 390, 768 et 1440 px ; captures bureau/mobile relues.
Calculs de référence, masques causaux, variantes du Transformer, migration/import/export, correction des 24 exercices et rechargement hors ligne vérifiés.
Audit npm : zéro vulnérabilité signalée.

## Publication

Site : https://darksathili-jpg.github.io/llm-academy/

Le workflow valide formatage, types, tests, build et scénarios Chromium/Linux avant de publier avec les actions officielles Pages.
La nouvelle phase C est prête localement ; sa publication et le contrôle du domaine public sont en cours.
Livraison A/B précédemment vérifiée : [workflow](https://github.com/darksathili-jpg/llm-academy/actions/runs/38033954722).
Commande reproductible : `node scripts/verify-live.mjs`. Le test utilise un navigateur neuf et ne touche pas au carnet personnel de l'utilisateur.

## Limites connues

- Audit automatisé d'accessibilité ; relecture humaine, lecteurs d'écran et autres navigateurs encore nécessaires.
- Activités libres accompagnées d'une grille, sans correction sémantique par IA.
- BPE Unicode miniature, sans byte-level ; compteur inadapté aux factures ou contextes d'API.
- Vecteurs/poids inventés, modèle non entraîné ; aucune capacité linguistique démontrée.
- Bloc illustratif pré-normalisé, sans biais/dropout, FFN ReLU de largeur 2 d_model, positions sin/cos ; simplifications explicites.
- Expériences réinitialisées lors d'un changement de page ; carnet et réponses conservés.
- Pyodide différé : les calculs des phases B/C s'effectuent nativement en TypeScript.

## D — Construction et entraînement, à venir

Modules 07–09 : architecture GPT, entraînement, adaptation. Mini-modèle, gradients, sampling, notebooks Python/PyTorch et Pyodide à la demande lorsque pertinent.

## E — Ingénierie IA, à venir

Modules 10–12 : RAG, agents et évaluation ; jeux de données originaux et applications pratiques.

## F — Audit final, à venir

Relecture scientifique et pédagogique, navigateurs et technologies d'assistance, performance mesurée et robustesse.
