# V4-Q4 — Résultats des tests scientifiques

**Date de consignation :** 30 octobre 2026  
**Branche :** `audit/v4-qualification-q1`  
**Référence protégée :** `v4-pilote-retrouve-20261030`

## Résultat communiqué par l'utilisateur

Exécution sous Chromium de `tests/e2e/formation-v4-q4-science.spec.ts` :

| Test | Contrôle | Résultat |
|---|---|---|
| 1 | Softmax [2,1,0] et température | Réussi (1,7 s) |
| 2 | Masque causal et futur interdit | Réussi (558 ms) |
| 3 | Pertes d'entraînement et de validation | Réussi (620 ms) |
| 4 | Cosinus 0,8 / 0 / -1 | Réussi (680 ms) |
| 5 | Attention pondérée | Réussi (586 ms) |
| 6 | Gradient : pas stable et trop grand | Réussi (811 ms) |
| 7 | Top-k=1 | Réussi (578 ms) |
| 8 | Dénombrement LoRA | Réussi (588 ms) |
| 9 | Précision, rappel, exactitude et zéro VP | Réussi (646 ms) |

**Bilan : `9 passed (10.1s)`.** Résultats fournis par l'utilisateur ; campagne non rejouée directement dans cet environnement. Le SHA exact de la copie locale au moment du test n'est pas joint à la sortie.

## Portée et suites

Cumul des campagnes communiquées : Q2 sept tests Playwright, Q3 quinze programmes Python, Q4 neuf tests Playwright — 31 réussites signalées (contrôles non tous indépendants).

Restent à auditer : preuves scientifiques ciblées des expériences 01, 02, 06, 07 (au-delà du scénario déjà testé), 10 et 14 ; accessibilité, projection, hors ligne, confidentialité et essais pédagogiques auprès de novices. La réception globale n'est pas prononcée.

Aucune modification du pilote, du tag de référence, ni de `main`.
