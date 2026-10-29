# Progression pédagogique

## Deux parcours, mêmes critères

Découverte : diagnostic, cours guidé, hypothèse, laboratoire, exercices, transfert.
Développeur : même évaluation, avec accès rapide au laboratoire et lecture de pseudocode/détails algorithmiques.
Aucun prérequis n'interdit l'accès. Les diagnostics orientent les révisions, sans produire une certification.

## 01 — Comprendre les LLM

Problème : une continuation plausible est-elle vraie ?
Compétences : distinguer entraînement et inférence ; calculer une probabilité conditionnelle et une perte ; expliquer pourquoi une probabilité ne garantit pas un fait.
Laboratoire : trois logits fictifs → softmax → probabilité d'une cible → perte.
Évaluation : calcul numérique, mise en situation, diagnostic d'une affirmation. Transfert : protocole de vérification d'une réponse.

## 02 — Tokenisation

Problème : pourquoi le même texte a-t-il plusieurs longueurs numériques ?
Compétences : distinguer mot/token/ID, compter des paires, prévoir une fusion BPE, appliquer un vocabulaire fixé, expliquer les inconnus et le budget de contexte.
Laboratoire : corpus original « lac lac lama », entraînement pas à pas puis encodage séparé.
Évaluation : paire/fréquence, tokens après une fusion, budget de contexte. Transfert : comparer deux corpus et expliquer la variation.

## 03 — Représentations vectorielles

Calculer produit/norme/cosinus, sélectionner un embedding par ID, démontrer une perte d’information par projection. Laboratoire avec contre-exemple mesuré ; quatre exercices et protocole de comparaison au transfert.

## 04 — Fondements mathématiques

Contrôler les formes et un produit ligne-colonne ; normaliser des scores ; mettre à jour un poids et comparer des pertes mesurées. Gradient vérifié par différence finie. Transfert : essai contrôlé et limite de généralisation.

## 05 — Attention

Calculer scores/poids/sorties, appliquer le masque avant softmax, contrôler plusieurs têtes. Transfert : détecter un masque appliqué après softmax sans renormalisation.

## 06 — Architecture Transformer

Suivre positions, normalisations, Q/K/V, concaténation/projection, résidus et FFN jusqu’aux logits. Transfert : intervention sur le futur et comparaison des sorties antérieures.

## Modules à venir

07 Mini-LLM ; 08 Entraînement ; 09 Génération et adaptation ; 10 Prompting ; 11 RAG ; 12 Agents, fiabilité et évaluation.

## Justifications

Les questions fermées et numériques ont des corrections explicites.
Les explications libres ont une grille de relecture et restent marquées « à relire », jamais « validées par IA ».
