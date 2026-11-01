# Contrat d'évaluation progressive — LLM Academy

**Statut : exigence pédagogique obligatoire.** Une démonstration réussie, même techniquement parfaite, ne vaut pas preuve de maîtrise.

## Six niveaux de difficulté

| Niveau | Objet | Aides | Preuve attendue |
|---|---|---|---|
| N0 Diagnostic | Comprendre les prérequis, avant enseignement | Aucune note ; aides possibles | Profil des erreurs, sans sanction |
| N1 Reconnaître | Identifier la notion et son utilité sur exemple familier | Microduck et explication explicite | Décrire avec ses mots, distinguer du contre-exemple |
| N2 Prévoir | Anticiper le résultat sur une situation analogue modifiée | Indice à la demande, non imposé | Prédiction motivée avant observation |
| N3 Calculer | Résoudre un calcul ou écrire du Python en autonomie partielle | Rappel théorique optionnel | Étapes de calcul et code corrects, cas limite |
| N4 Transférer | Problème inédit mêlant deux concepts, sans nommer la technique | Microduck retiré, sans indice initial | Justification écrite + résultat + identification des hypothèses |
| N5 Critiquer/enseigner | Examiner une sortie fausse, une expérience biaisée ou une affirmation trompeuse | Aucune aide avant soumission | Corriger, argumenter les limites et proposer un test contradictoire |

**Progressivité réelle :** dès N2, varier les paramètres, le contexte, les données et le type d'erreur ; N4/N5 ne doivent pas être de simples variantes numériques du même exercice. Les exercices N3 à N5 doivent exiger une décision argumentée et non un clic ou un calcul isolé.

## Parcours différenciés

**Élève NSI** : expliquer le mécanisme, exécuter un raisonnement numérique et coder une implémentation réduite avec tests pertinents. Employer la terminologie officielle NSI, et vérifier le transfert au programme.

**Enseignant NSI** : acquérir les mêmes compétences (pas d'exemption), puis expliciter les prérequis, reconnaître et corriger les conceptions erronées, concevoir une variante pédagogique, justifier une évaluation et ses limites scientifiques.

Un enseignant qui réussit la partie « corriger » mais ne comprend pas le mécanisme n'est pas validé. Un élève qui réussit N1/N2 mais échoue à N4 ne peut pas être déclaré autonome.

## Règles de validation

- N1–N3 : évaluation formative avec aide décroissante et remédiation ciblée.
- N4 : premier essai sans indice, tâches nouvelles, justification libre.
- N5 : tâches adversariales conceptuelles, interprétation critique et limite d'un modèle.
- Consigner réponses, aides demandées, types d'erreurs, temps approximatif si pertinent, et succès au **deuxième contexte**.
- Pour valider « autonomie », exiger réussite indépendante à deux tâches N4 différentes, plus un N5 pertinent. Une réponse ouverte exige un barème explicite et une correction humaine ou une évaluation qui indique ses incertitudes ; ne pas prétendre certifier automatiquement.
- Examen différé (après un délai pédagogique défini, p. ex. 7–14 jours) avec exemples nouveaux.
- Pas de seuil magique 95/100 : publier les critères, leur pondération et les preuves de maîtrise par compétence.
- Accessibilité : alternatives au mouvement, contrastes, clavier, et difficulté conceptuelle jamais confondue avec la difficulté d'interface.

## Exemples d'escalade sur l'attention

- N1 : à l'indice 2 d'une séquence de 5 caractères, identifier les indices accessibles.
- N2 : sur 8 caractères, indice 5, prévoir la ligne du masque et justifier l'inclusion de la diagonale.
- N3 : Q=(1,0), K0=(1,0), K1=(0,1), K2=(5,0) ; masque à i=1. Calculer score, échelle, softmax, combinaison de V ; produire Python minimal testé.
- N4 : pour des vecteurs en 3 dimensions à position 2 et une séquence de 5 éléments, construire entièrement scores/masque/softmax/somme pondérée ; expliquer comment l'interdiction du futur modifie la sortie. Aucune étiquette Q/K/V fournie dans une variante.
- N5 : analyser une implémentation qui normalise sur les positions futures avant de mettre leurs poids à zéro, et une interprétation erronée « une forte attention prouve la cause de la prédiction ». Proposer des contre-tests.

## Banque d'items et protection

Chaque niveau : au moins deux variantes réellement distinctes et un contre-exemple. Ne pas exposer les corrigés avant la première soumission pour N4/N5. Un dispositif local ne constitue pas une certification sécurisée contre l'inspection du code ; pour certificatif, prévoir supervision et variantes hors ligne.

## Porte de livraison

Toute notion doit posséder N0–N5, prérequis, barèmes, erreurs fréquentes et remédiations. En l'absence de N4/N5, verdict **À RECONSTRUIRE** même si tous les tests navigateur passent. La validation de terrain sur novices reste obligatoire.
