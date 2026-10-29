# Reprise après retour enseignant — 10 octobre 2026

## Problème observé

Un enseignant indique ne pas comprendre les termes et explications. Ce retour humain compte davantage que les profils automatisés pour apprécier la compréhension. La note initiale de 91/100 ne suffit pas à conclure que l’application est utilisable et a été retirée comme appréciation actuelle.

## Changements

Accueil sans curseur technique ni sigle API ; entrée unique « Commencer en 5 minutes, sans code ». Découverte en quatre écrans : choisir un mot, comparer la variété de vingt choix calculés, vérifier une phrase avec un document, retenir trois idées. Pas de formule avant la manipulation ; définitions après l’exemple.

Dix activités reformulées avec un exemple concret, une consigne précise, une question avant/après, une explication courte et des définitions proches des commandes. Navigation entre étapes rangée dans une liste facultative. Python à ouvrir volontairement, avec possibilité de passer. Schéma du carnet et textes déjà enregistrés conservés. Découpage simple fondé sur le même moteur BPE ; version scientifique accessible.

Les choix de la découverte sont calculés avec le moteur existant, scores inventés [2,1,0], températures 0,25/1 et graine fixe 7. Vingt répétitions indépendantes du même choix de mot, pas génération d’une phrase ni modèle entraîné. Les comptes sont des fréquences observées, pas des probabilités garanties.

## Vérification humaine à faire

Commencer depuis l’accueil, sans explication orale préalable. Après la découverte, demander :

- Qu’as-tu fait varier et qu’as-tu vu changer ?
- Est-ce que ce réglage rend une réponse vraie ?
- Comment as-tu vérifié la phrase sur la bibliothèque ?

Si l’enseignant ou l’élève ne peut pas expliquer ces trois points avec ses mots, reprendre l’activité. Ne pas attribuer une note d’utilisabilité à partir du seul nombre de tests réussis. La durée de cinq minutes est indicative ; aucune réussite en classe n’est revendiquée.

## Validation technique

TypeScript strict, compilation et 119 tests unitaires réussis. Campagne de 41 tests Chromium réussie après correction d’un test qui conservait involontairement l’écran précédent entre les modes. Trois nouveaux tests couvrent la découverte, ses choix calculés, la correction d’une erreur et le découpage simple. La campagne comprend 90 analyses axe sans violation détectée, avec cinq largeurs et trois affichages. Huit captures conservées dans evidence/screens/prise-en-main et inspectées ; reproductibles avec node scripts/capture-first-steps.mjs.

Ces résultats locaux restent techniques ; la compréhension doit être retestée avec l’enseignant. Un aperçu de développement séparé sur http://127.0.0.1:5173/llm-academy/#/decouvrir évite le cache de l’ancien aperçu. Les données locales de l’adresse 4173 restent à cette adresse ; elles ne sont pas effacées ni transférées automatiquement. Les captures et tests prouvent des interactions et des calculs, pas la compréhension. Aucune fusion ni publication automatique demandée par ce retour.
