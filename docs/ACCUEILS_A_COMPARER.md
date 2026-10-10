# Trois accueils à comparer — 10 octobre 2026

## Périmètre préservé

État de départ propre : commit 0fdc58c, branche simplification/demonstrateur-01. Les maquettes sont isolées sur graphisme/accueils-a-comparer. Aucun fichier existant de l’application n’a été modifié ; aucune nouvelle architecture, aucun module, aucune publication ou fusion.

Les pages sont des études HTML/CSS autonomes. Leur seule interaction permet de proposer un mot et d’observer un tirage. Aucun compte, carnet, stockage ni appel à une IA. L’utilisateur a retenu l’étude B « Cabinet des possibles » le 10 octobre 2026. Les trois maquettes restent conservées pour comparaison.

## Les trois directions

| Proposition               | Composition et visualisation                                                                                                                                   | Typographie                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| A — Instrument de mesure  | Phrase et choix à gauche, règle de hasard horizontale, mode d’emploi en marge. Trois zones de largeurs 60/30/10.                                               | Arial pour la lecture et les commandes, Consolas pour les mesures.                       |
| B — Cabinet des possibles | Scène centrale sombre, phrase reliée aux trois suites possibles, conduite de l’expérience sur un axe latéral. L’épaisseur des branches représente les chances. | Bahnschrift pour l’ensemble, Consolas pour les repères. Repli Arial.                     |
| C — Cahier de recherche   | Composition éditoriale avec question en marge, mots alignés sur trois figures de points et légende scientifique.                                               | Georgia pour la lecture, Arial pour les commandes et légendes, Consolas pour les traces. |

Pas de grille de cartes, de dégradé décoratif, de titre géant ou de panneaux empilés. Les graphiques servent à représenter les chances préparées.

## Consulter localement

Serveur de développement existant, port 5173 :

- [A — Instrument](http://127.0.0.1:5173/llm-academy/etudes-accueil/a-instrument.html)
- [B — Musée](http://127.0.0.1:5173/llm-academy/etudes-accueil/b-musee.html)
- [C — Revue](http://127.0.0.1:5173/llm-academy/etudes-accueil/c-revue.html)

Chaque page propose les liens vers les deux autres. Si le serveur a été fermé : lancer npm run dev depuis llm-academy.

## Captures et contrôles

Captures du premier écran, sans défilement, à l’échelle 1 ; fichiers de dimensions exactes :

| Proposition | 1440 × 900                                                         | 1920 × 1080                                                         |
| ----------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| A           | [Capture](evidence/accueils-comparaison/a-instrument-1440x900.png) | [Capture](evidence/accueils-comparaison/a-instrument-1920x1080.png) |
| B           | [Capture](evidence/accueils-comparaison/b-musee-1440x900.png)      | [Capture](evidence/accueils-comparaison/b-musee-1920x1080.png)      |
| C           | [Capture](evidence/accueils-comparaison/c-revue-1440x900.png)      | [Capture](evidence/accueils-comparaison/c-revue-1920x1080.png)      |

Les six captures ont été inspectées visuellement : proportions, marges, hiérarchie, cohérence des familles, contrastes et visibilité de la phrase, des trois choix et du tirage. L’inspection a conduit à corriger la proposition C : alignement des mots avec leurs points et pied de page initialement coupé à 900 px.

Résultat final : aucune page ne déborde aux deux tailles demandées. Les titres sont à 29 ou 30 px, avec une hauteur de 36 à 38 px. Le bouton de tirage est entièrement visible, avec sa limite basse entre 614 et 735 px selon la proposition et la résolution. Les titres ne dominent pas l’espace utile.

Douze analyses Axe avant et après interaction : aucune violation détectée, y compris les contrôles de contraste du texte. Contrôles navigateur : choix sélectionné, trois zones de tirage, compteurs observés, absence d’erreur JavaScript et de stockage local. Voir [mesures et résultats](evidence/accueils-comparaison/verification.json).

Pour refaire les captures sur le serveur 5173 : node scripts/inspect-home-studies.mjs.

## Honnêteté scientifique et limites

Même jeu préparé dans les trois pages : préférences 6/3/1 normalisées par leur somme en probabilités 0,6/0,3/0,1. Tirage calculé depuis un entier aléatoire uniforme du navigateur, puis choix dans l’intervalle correspondant. Les résultats et comptes affichés proviennent des tirages exécutés. Les contrôles utilisent ensuite des nombres imposés uniquement pour vérifier les trois zones ; les captures présentent l’état initial, sans résultat inventé.

Ces chances ne sont pas apprises par un modèle. Les trois mots entiers représentent des tokens pédagogiques. Rien ne garantit que la phrase décrit un fait réel.

Vérification sur Chromium aux deux résolutions demandées. Les captures et les tests ne prouvent pas la compréhension humaine et ne constituent pas une certification d’accessibilité. Les rendus peuvent varier avec les polices du poste ; la direction B a été choisie par l’utilisateur.

## Arrêt

Décision humaine reçue : « etude b ». L’étude B fixe la direction graphique retenue. Le choix est consigné sans modification de l’application ; le développement des fonctionnalités et modules reste suspendu.
