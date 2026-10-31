# Contrat didactique R4 — Auto-attention causale, élèves NSI et enseignants

**Statut : cadrage pédagogique, non validation des acquis.** Branche : `feature/v4-mini-transformer`.

## Objectif observable
À la fin, l'apprenant distingue identifiant de token, embedding, information de position, requête Q, clé K, valeur V, score, masque, poids et sortie pondérée. Il peut expliquer pourquoi une position ne consulte pas les suivantes, reconstituer un petit calcul et interpréter une matrice réelle **sans lui prêter une signification causale injustifiée**.

## Cinq paliers avec seuils de progression
1. **Position / causalité** : sur 4 positions, indiquer pour i=2 les indices 0,1,2 ; expliquer l'interdiction de i=3. Preuve : justification écrite.
2. **Représentations** : différencier index, vecteur appris et ajout de la position. Preuve : classer trois représentations.
3. **Q, K, V** : calculer un produit scalaire en dimension 2 à partir de valeurs fournies, expliquer l'échelle par racine de la dimension et la différence entre score et probabilité. Proposer ensuite softmax détaillée sur deux scores et somme pondérée de deux valeurs. Le calcul est un **exemple didactique** distinct des poids réels.
4. **Observer PyTorch** : 4 têtes sélectionnables ; au clic sur une cellule, afficher ligne/colonne, score si exporté, poids, caractère consulté, statut causal, somme de ligne ; expliciter que le modèle est **caractère par caractère**, pas mot par mot. La comparaison avant/après doit porter sur une même entrée et une même initialisation.
5. **Transfert** : pour 10 caractères, à i=6 exactement 7 positions accessibles ; expliquer pourquoi des variations d'attention ne prouvent pas une compréhension sémantique ni la généralisation.

## Mode enseignant
- Prérequis réels/optionnels : programmation NSI, tableaux, boucles bornées ; vecteurs et exponentielle traités avec marche d'accès mathématique.
- Distinguer invariant algorithmique (masque) et quantité apprise (scores Q·K).
- Formule rigoureuse : `softmax(QKᵀ/√d_k + M)V`, où M vaut 0 sur les positions autorisées, −∞ sur les positions futures.
- Normalisation sur les positions autorisées ; une ligne somme à 1, les futurs ont poids nul.
- Cas limites : un seul token, température, saturation, absence d'inférence causale depuis des cartes d'attention.
- La corrélation de cartes avant/après ne suffit pas à affirmer un mécanisme explicatif.

## Accessibilité et style
- Mode clair / sombre / vidéoprojecteur avec contrôle réel des contrastes.
- Tables navigables et alternatives textuelles ; absence de dépendance exclusive à la couleur.
- Glossaire consultable en contexte, exemple minimal avant la matrice 8×8.
- Aides graduées, erreurs expliquées selon leur nature, jamais seulement « faux ».
- Terminologie officielle NSI : variable de type entier, affecter une valeur à une variable, boucle bornée, instruction.

## Gates de réception
1. Vérification calculatoire indépendante (masque, normalisation, scores et sortie pondérée).
2. Tests navigateur de navigation clavier et lisibilité des matrices sur petits écrans.
3. Audit enseignant de toutes les explications scientifiques.
4. Test novice sans intervention orale, puis exercice de transfert différé et analyse des erreurs.

Aucun palier ne vaut certification automatique à partir d'un simple clic.
