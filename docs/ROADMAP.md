# Roadmap et état — 10 octobre 2026
## Livraison 1 — phases A et B implémentées
- Socle React/TypeScript strict/Vite, navigation hash, trois thèmes, responsive et clavier.
- Modules 01 et 02 : diagnostic, cours original, hypothèse, visualisation calculée, exercices, aides, transfert, synthèse et sources.
- Laboratoire de probabilités : softmax stable et perte ; BPE : comptes, fusions, historique, vocabulaire/IDs et encodage sur corpus modifiable.
- Huit exercices corrigés, progression dérivée des réponses, carnet local et export/import contrôlé.
- Cache de production local et versionné, alertes de stockage.
## Validation locale observée
Typecheck et build réussis. 52 tests unitaires et 14 tests Chromium réussis.
Axe : aucune violation relevée sur cinq pages × trois thèmes ; contrôle de débordement à 390, 768 et 1440 px.
Test hors ligne avec réseau coupé réussi. Audit npm de production : aucune vulnérabilité signalée.
Vulnérabilités initiales de Vitest 3 corrigées par Vitest 5.
## Déploiement
Workflow de validation avant publication avec les actions officielles Pages.
Statut de publication à compléter après validation du workflow et ouverture du site public.
## Limites connues
Aucune certification WCAG : audit manuel multi-navigateurs/lecteurs d’écran encore nécessaire.
Activités libres à relire ; aucune correction sémantique par IA.
BPE Unicode miniature, pas byte-level ; compteur inadapté aux factures ou contextes d’API réels.
Les expériences se réinitialisent en changeant de page ; réponses et carnet sont conservés.
Pas de Pyodide en phase B, car aucun de ces calculs ne nécessite Python.
## C — Fondements scientifiques, à venir
Embeddings, algèbre, Q/K/V, masques causaux, Transformer. Moteurs vérifiés et visualisations calculées.
## D — Construction et entraînement, à venir
Mini-modèle, gradient, sampling, adaptation ; notebooks Python/PyTorch et Pyodide à la demande lorsque pertinent.
## E — Ingénierie IA, à venir
Prompting, index local/RAG, outils et protocoles d’évaluation. Jeux de données originaux.
## F — Audit final, à venir
Relecture scientifique et pédagogique, navigateurs et technologies d’assistance, performance mesurée, robustesse.

