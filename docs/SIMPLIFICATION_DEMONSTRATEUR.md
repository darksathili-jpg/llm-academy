# Reconstruction par simplification — 10 octobre 2026

## Sécurisation

Dépôt dédié llm-academy, initialement propre sur refonte/atelier-v2, commit 55dc4aab9e753b7f7a8bc03dea7310ad726cfe74. Nouvelle branche locale simplification/demonstrateur-01. Aucun nettoyage, changement de main, déploiement ou modification de la configuration globale. L’ancien travail reste dans l’historique, sa branche et ses sources.

## Une seule architecture

Une entrée React : App.tsx. Un accueil à six sujets et une seule expérience active. Les cinq étapes sont obligatoires ; Python et animation s’ouvrent sous cette expérience. Aucun espace NSI/formateur/laboratoire séparé, aucun niveau obligatoire à choisir, aucun catalogue de modules dans la navigation.

Les cinq autres expériences sont annoncées, sans faux liens ni fausse disponibilité. Les anciennes pages et tests restent conservés mais ne sont plus raccordés à l’interface. Les tests des moteurs et des migrations restent actifs ; les tests navigateur sélectionnent le contrat simplifié.

## Trois propositions graphiques

- **La Paillasse** : feuille d’expérience, grandes lettres sans empattements, marge de folio et règle de hasard. La largeur réelle des trois zones porte l’information. Composition retenue provisoirement pour le démonstrateur.
- **La Revue** : titre de revue, double page en colonnes, figure numérotée et annotations dans les marges. Le rythme est celui d’un article qu’on lit et annote.
- **La Scène** : phrase et mots à grande échelle, affichage frontal et rythme de séance collective. Le vocabulaire est mis en lumière plutôt que dans un tableau de bord.

Ces différences portent sur les compositions, la hiérarchie et le rôle des schémas. Les maquettes montrent accueil et manipulation ; elles sont statiques et le disent. La sélection définitive appartient à la revue humaine. Aucun score esthétique n’est attribué.

## Expérience 01

Question : compléter « Le chat dort sur le… » avec canapé, tapis ou bureau.
Hypothèse : écrire ce que l’on pense avant l’essai ; possibilité de le proposer oralement en groupe.
Manipulation : tirer un mot, recommencer ou faire vingt essais. Aucun réglage de température, graine, top-k ou matrice dans le parcours principal.
Observation : compter les résultats réellement obtenus et les comparer à la proposition.
Explication : distinguer chances et résultats finis, choix d’un mot et vérité, puis définir token après l’essai.

Le formateur ouvre ses commandes dans cette même expérience : masquer, montrer, révéler l’explication en trois parties, projeter. Le code et les commandes sont retirés de l’écran projeté. Les modes clair/sombre/projection partagent le même contenu et le même moteur.

## Calculs réels et limites

Préférences choisies par nous : 6, 3, 1. Division par 10 : probabilités 0,6, 0,3, 0,1, somme 1. Le moteur sample existant parcourt ces intervalles. Un entier uniforme du navigateur est ramené dans [0,1) pour sélectionner un mot. Les essais s’accumulent réellement, jusqu’à 100 ; les comptes ne sont jamais présentés comme les probabilités théoriques.

Aucun modèle n’est entraîné dans ce démonstrateur. Les chances ne proviennent pas d’un LLM, et le texte ne vérifie aucun fait. Trois mots entiers servent de tokens pédagogiques ; un vrai découpage peut employer des fragments. Les vingt essais repartent du même début de phrase, sans génération d’un texte entier.

Le Python facultatif normalise les mêmes préférences et parcourt les mêmes intervalles. Son générateur pseudo-aléatoire est différent ; les résultats précis peuvent donc différer. Les assertions vérifient la somme des chances, les frontières et le total de vingt résultats.

## Données

Le carnet antérieur garde sa clé et son schéma. Les notes du démonstrateur ont une clé séparée llm-academy.experience01.v1, avec textes bornés et traces validées. Un contenu corrompu reste intact ; l’interface poursuit en mémoire au lieu de l’écraser. Les notes privées historiques ne sont ni lues ni exportées. Aucune note automatique sur les écrits.

## Vérifications

Vérifications exécutées localement le 10 octobre 2026 :

- TypeScript strict et construction de production : réussis.
- Tests unitaires : 123 réussis, dont les frontières du tirage et le refus de traces incohérentes.
- Chromium : 10 scénarios réussis. Parcours des cinq étapes, tirages contrôlés, notes, ancien carnet intact, stockage refusé ou corrompu, commandes formateur, projection, clavier, repli Python sans réseau et consultation des maquettes depuis le cache actif.
- Axe : aucune violation détectée dans 27 analyses (accueil et cinq étapes dans les trois palettes, puis trois maquettes à trois tailles/palettes). Les tests d’accessibilité ne valent pas certification WCAG.
- Résolutions 390, 1280 et 1920 px : absence de débordement horizontal vérifiée. Inspection visuelle des captures mobile, bureau, projection et des trois compositions ; légende et repère de tirage clarifiés.
- Python : programme réellement exécuté localement et dans le navigateur avec Pyodide. Assertions réussies, probabilités [0.6, 0.3, 0.1], vingt résultats effectivement comptés. La graine Python fixée donne 16 canapé, 3 tapis, 1 bureau ; ce résultat n’est pas imposé aux tirages du navigateur.
- Dépendances : npm audit ne signale aucune vulnérabilité connue au moment du contrôle.

L’inspection a trouvé puis fait corriger une navigation : le cache hors ligne renvoyait l’accueil à la place des pages de maquette. Le test navigateur vérifie désormais leur ouverture après activation du cache. Aucun déploiement n’a servi à ces contrôles.

Les douze captures et les sorties d’exécution se trouvent dans [evidence/simplification](evidence/simplification/verification.json). Elles représentent des parcours automatisés, pas des personnes ayant appris. Le mode projection et ses commandes sont testés dans Chromium ; aucun vidéoprojecteur physique, lecteur d’écran, Firefox ou Safari n’a été validé.

La première action est une proposition, puis un essai. Le vocabulaire scientifique est introduit après les manipulations ; les commandes formateur restent dans un prolongement fermé. Ces choix ont été inspectés dans l’interface. Leur compréhension réelle reste à vérifier avec un débutant, et aucune note pédagogique ne leur est attribuée.

## Critère humain et arrêt

Après essai sans aide préalable, demander : « Que pensais-tu avant ? Qu’as-tu vu ? Pourquoi un mot favori peut-il ne pas sortir ? Est-ce une preuve que la phrase est vraie ? »
Si la personne ne peut pas répondre avec ses mots, reprendre cette seule expérience. Ne pas compenser par plus de modules ou par une note artificielle.

Arrêt obligatoire après les vérifications. Les cinq expériences suivantes, toute fusion et toute publication attendent une validation humaine explicite.
