# V4-Q2 — Résultats Playwright transmis par l'utilisateur

**Date de consignation :** 30 octobre 2026  
**Branche d'audit :** `audit/v4-qualification-q1`  
**Statut :** 7 tests sur 7 réussis sur le poste de l'utilisateur (Chromium), durée 13,5 s.

## Preuve communiquée

L'utilisateur a transmis la sortie du terminal Playwright suivante :

- `V4.1 : quinze chapitres accessibles` : réussi (4,1 s)
- `V4-Q2 : ouvrir les quinze chapitres sans exception JavaScript` : réussi (4,6 s)
- `V4.1 : fuite réelle sans déduplication et aucun recouvrement après` : réussi (960 ms)
- `V4-Q2 : pas de débordement global pour plusieurs tailles et chapitres` : réussi (3,5 s)
- `V4.1 : un QCM ne certifie plus la maîtrise` : réussi (837 ms)
- `V4.1 : mode enseignant et MathJax réel` : réussi (900 ms)
- `V4.1 : pas de débordement global à 320 et 390 px` : réussi (893 ms)

**Bilan : `7 passed (13.5s)`.** Résultat fourni par l'utilisateur, non relancé à distance. La version exacte des fichiers locaux au moment de l'exécution n'a pas été attestée par un SHA joint à la sortie.

## Portée et limites

Ce résultat valide la non-régression **sur les sept scénarios automatisés couverts**, pas la réception globale de la formation. Restent non vérifiés : exactitude numérique des 15 expériences, exécution des 15 programmes Python, tests de clavier et lecteurs d'écran, projecteur, impression, hors-ligne, confidentialité, performances sur postes du lycée, apprentissage et transfert différé sur un échantillon novice.

## Prochaine gate : V4-Q3

Réaliser une matrice de vérité pour les 15 expériences (entrée, résultat attendu, calcul indépendant, cas limite, verdict), exécuter les quinze scripts Python dans un environnement standard, puis faire une recette pédagogique avec apprenants novices et enseignants novices. Conserver la version de référence et n'effectuer aucune fusion automatique.
