# Architecture et décisions
## ADR 01 — React, Vite, TypeScript strict
Application statique. Les routes hash évitent les erreurs 404 d'un hébergement sans réécriture. Base /llm-academy/. Composants pédagogiques partagés ; moteurs indépendants de React.
## ADR 02 — Calculs
Softmax stable par soustraction du maximum. BPE Unicode à frontières de mots ; égalités départagées par ordre des points de code de la clé JSON des paires. Fusions non chevauchantes de gauche à droite ; fréquences recalculées à chaque étape. Historique immuable.
Les espaces sont conservés séparément à l'encodage ; pas de normalisation implicite. [UNK] = ID 0. Alphabet trié puis tokens appris ajoutés ; pas de correspondance avec les IDs d'un modèle réel.
## ADR 03 — État et stockage
État React local par activité, provider pour le carnet. Schéma JSON version 1 contrôlé à l'import et à la lecture. Résultats validés enregistrés par exercice ; notes et réponses de transfert restent des auto-observations. Le module est acquis uniquement si tous ses exercices corrigés sont réussis.
Échecs localStorage signalés ; utilisation possible en mémoire. Export JSON avec limite de taille à l'import.
## ADR 04 — Hors ligne
Service worker généré au build avec liste des assets locaux et version de leur contenu. Pré-cache atomique, activation d'une nouvelle version seulement après fermeture des onglets. Nettoyage uniquement des caches de cette application. Cache-first des assets ; navigation vers shell local. Échec d'installation signalé. Aucune ressource distante obligatoire.
## ADR 05 — Python
Aucun calcul de phase B ne justifie Pyodide. Futur worker chargé à la demande : timeout, annulation, budgets mémoire et cache optionnel. Aucun entraînement d'un LLM moderne promis dans un navigateur.
## Déploiement
Workflow CI : typecheck, unitaires, build, Chromium, E2E sur artefact de production ; publication GitHub Pages via branche gh-pages. Ce choix conserve le mode Pages « Deploy from a branch » déjà utilisé, sans exiger une mutation administrative. Ne publier que si tous les contrôles passent.

