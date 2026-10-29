# Rapport de contrôle — V4 autonome

Contrôle effectué le 29 octobre 2026 sur les fichiers de la version V4 créée dans cet environnement.

- **Syntaxe JavaScript** : contrôle par `node --check`, réussi.
- **Nouveaux exercices Python** : neuf extraits exécutés dans Python standard, avec leurs assertions, réussis. Les six exercices repris de V3 ne sont pas déclarés réexécutés pendant cette passe.
- **Interactions dans Chromium** : les 15 chapitres s'ouvrent, possèdent un atelier interactif et trois réponses de compréhension ; les neuf nouvelles expériences ont fait l'objet de vérifications d'interaction. Aucun événement d'erreur JavaScript détecté pendant la campagne.
- **Filtres** : 6 chapitres dans Fondations, 5 dans Mécanismes, 4 dans Pratique ; « Tous » affiche 15 chapitres.
- **Accès direct** : 15 options, sélection cohérente ; bouton final de retour au catalogue vérifié.
- **Épreuve de synthèse** : choix absent, bonne réponse et retour vérifiés.
- **MathJax** : les chapitres mathématiques et l'espace de référence ont produit des formules sans erreur `mjx-merror` observée.
- **Largeurs** : 320, 390 et 1440 pixels sans débordement horizontal global observé sous Chromium.

## Limites des vérifications

Chromium a été testé en injectant le contenu HTML en mémoire via Playwright (`set_content`) : les tentatives de navigation HTTP locale étaient bloquées par l'environnement de test. Le fonctionnement direct depuis un fichier `file://` doit être vérifié sur le poste de destination ; le prototype V3 utilisait la même construction autonome. Les contrôles n'incluent pas Firefox/Safari, lecteur d'écran, projecteur physique, tests de novice, audit complet des sources ni étude de l'acquisition des compétences sur plusieurs semaines.

**Verdict : prototype technique candidat à la recette humaine, sans certification institutionnelle, sans mise en production.**
