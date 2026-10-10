# Cahier des charges
## Première livraison : phases A et B
Construire une formation francophone qui alterne comprendre, visualiser, manipuler, expliquer et évaluer.
Modules 01 et 02 complets : problème, objectifs, diagnostic, cours, expérience, exercices gradués, aide, évaluation, transfert, synthèse et références.
Le programme comporte douze modules ; seuls les deux premiers sont disponibles.
## Laboratoires
1. Distribution explicite de trois prochains tokens : logits modifiables, softmax stable, probabilité et perte calculées. Ce n'est pas un LLM.
2. BPE sur caractères Unicode : corpus modifiable, fréquences de paires, fusions déterministes, historique, vocabulaire/IDs, encodage d'un texte et caractères inconnus. Ce n'est pas un tokenizer de production.
## Acceptation
Compilation TypeScript stricte, calculs testés sur résultats de référence, navigation par hash sous /llm-academy/, trois thèmes, sauvegarde locale et export/import vérifié.
Évaluations de calcul réellement corrigées ; explications libres relues à l'aide d'une grille, jamais notées automatiquement comme exactes.
Tests navigateur, persistance, responsive, accessibilité automatique et production.
## Contraintes
Sans compte, serveur, télémétrie, API privée ou dépendance Python en phases A/B.
Cache versionné du shell et des assets, message d'échec et cache limité au scope de cette application.
Contenu original. Aucun chapitre, illustration ou exercice d'ouvrage reproduit.

