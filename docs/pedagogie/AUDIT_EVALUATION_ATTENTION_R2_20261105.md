# Audit pédagogique R2 — parcours Attention N0–N5

**Date :** 2026-11-05. **Périmètre :** page `public/pilotes/evaluation-attention-n0-n5/index.html`, contrat N0–N5, préalable Q/K/V. **Statut : EN VÉRIFICATION ; qualification pédagogique BLOQUÉE.**

## Non-conformités confirmées par lecture du code

| Gravité | Constat | Action | Statut |
|---|---|---|---|
| P0 / logiciel | `openEvaluation()` appelait `openEvaluation()` au lieu de `page.goto(url)` ; récursion infinie dans le test | Remplacement et maintien du contrôle de page réellement servie | CORRIGÉ dans le dépôt, test non encore exécuté |
| P0 / pédagogie | Toute réponse non vide, même fausse, permettait d'atteindre N5 sans lecture des critères | Autoévaluation avec trois vérifications et justification écrite avant passage, sans attribution de compétence automatique | ATTÉNUÉ ; seule correction humaine ou oracle robuste établit la réussite |
| P1 / pédagogie | N4/N5 donnaient l'aide sans tentative | Première tentative écrite avant aide ; aide consignée | ATTÉNUÉ ; le texte minimal n'atteste pas un effort sérieux |
| P1 / séquencement | Aucune liaison explicite vers les notions préparatoires | Liens visibles vers masque causal et Q/K/V | CORRIGÉ techniquement, mais prérequis non évalués automatiquement |
| P1 / difficulté | N4 ne teste que des scores égaux parmi les positions autorisées : softmax uniforme 1/3 | Ajouter une **variante N4-B non uniforme**, changement de dimensions, changement de contexte, sans personnage, avec oracle Python indépendant | À FAIRE |
| P1 / transfert | Une seule tâche N4 et une seule N5, sans différé ; contradictoire avec le contrat de deux tâches inédites | Banque de variantes et épreuve différée à sept ou quatorze jours, hors contexte | À FAIRE |
| P1 / enseignant | Le mode enseignant ajoute des consignes, mais n'évalue pas leur production avec un barème spécifique | Grille de qualité de remédiation et de conception d'items ; double correction sur échantillon | À FAIRE |
| P1 / architecture | Activités dans `public/pilotes` isolées de la navigation principale, sans diagnostic de connaissance préalable intégré | Parcours d'entrée puis prérequis → manipulation → formalisation → évaluation, avec itinéraire visible | À FAIRE |
| P2 / traçabilité | Copier la trace locale dépend de l'API Clipboard et aucune sauvegarde durable | Export JSON téléchargeable après consentement et information des élèves | À FAIRE |

## Définition de maîtrise par niveau

**N0** : diagnostiquer, pas noter ; repérer les analogies spontanées.  
**N1** : distinguer permission et importance, reconnaître indices autorisés et interdits.  
**N2** : prédire sur un exemple modifié et justifier la diagonale.  
**N3** : calculer produits scalaires, échelle, masque, softmax, combinaison de V ; produire et tester du Python.  
**N4** : deux contextes distincts, calculs non uniformes, cas limite, justification sans Microduck, ressources choisies par l'apprenant.  
**N5** : détecter une implémentation trompeuse, produire un contre-exemple numérique, formuler une propriété testable et un protocole d'essai.  

**Élèves** : solution mathématique justifiée + Python testé + transfert. **Enseignants** : mêmes critères ET analyse des obstacles, remédiation réalisable, construction d'une évaluation équivalente. Pas de certification par autoévaluation.

## Exemple de variante N4-B (oracle à contrôler avant intégration)

Position 2 sur 5 ; dimension de clé 2 ; q=(1,1), k0=(1,0), k1=(0,0), k2=(0,1), k3=(10,10), k4=(0,0). Valeurs v0=(1,0), v1=(0,2), v2=(2,1), v3=(99,99), v4=(0,0). Les scores accessibles sont (1/√2, 0, 1/√2), qui donnent des poids non uniformes. Une erreur de masque entraînerait une domination artificielle de la position 3. Faire calculer le vecteur de sortie, contrôler la somme des poids et produire une fonction Python vérifiable.

## Conditions d'acceptation avant pilote officiel

1. Tests de fonctionnement et vérification des oracles numériques : réussite effective, journaux conservés.
2. Deux exercices N4 indépendants et deux variantes N5, l'un sur erreur de calcul, l'autre sur interprétation scientifique.
3. Présentation en deux modes élève/enseignant avec des critères de réussite distincts ; correction humaine pour le raisonnement libre.
4. Essai avec novices réels : hypothèse initiale, temps d'aide, formulation autonome, taux de transfert et entretien sur les confusions.
5. Contrôle de compréhension différé ; ne pas conclure sur le seul taux de réussite immédiat.
6. Navigation pédagogique complète et accessible, sans exposition prématurée des corrigés.

**Attention :** ce document est un audit et un plan de remédiation, pas une preuve d'efficacité chez les élèves.
