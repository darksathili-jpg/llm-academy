# CONTRAT DE FORMATION — LLM Academy, ambition maîtrise vérifiable (R1)

**Statut : spécification opposable, pas produit terminé.** Référence protégée V4 conservée ; travail sur `feature/academy-pedagogie-microduck-r1`.

## Promesse et limites

Public : élève de spécialité NSI (Première/Terminale selon prérequis) et enseignant débutant en modèles de langage. Point de départ : aucune connaissance préalable des LLM ; Python NSI à évaluer par diagnostic, et mathématiques accessibles par des passerelles explicites.

**Objectif précis :** autonomie conceptuelle et technique sur les mécanismes fondamentaux des modèles de langage et Transformers, capacité à expliquer, implémenter de petits modèles, analyser des résultats, identifier limites, erreurs et risques. La « maîtrise parfaite » de *tous* les LLM ou de l'ensemble de la recherche contemporaine ne peut être garantie ; chaque compétence doit être démontrée par des preuves.

## Architecture à deux parcours synchronisés

| Couche | Élève NSI | Enseignant |
|---|---|---|
| Découverte | Situations manipulables avec Microduck, prédiction avant révélation | Objectif cognitif, prérequis, pièges, temps |
| Formalisation | Notion et modèle à taille réduite, notation expliquée | Hypothèses, définitions rigoureuses, démonstrations et limites |
| Programmation | Python standard puis PyTorch accompagné, tests exécutables | Invariants, cas limites, erreurs typiques, adaptation |
| Laboratoire réel | Sorties calculées par un petit modèle effectivement entraîné | Inspection des données, graine, calcul indépendant, traçabilité |
| Transfert | Problème inédit sans Microduck ni indices | Grille analytique, remédiation, preuves observables |

Pour chaque concept, trois représentations synchronisées : **situation Microduck → calcul mathématique réel → code effectif**. Les animations ne remplacent jamais les valeurs du modèle et ne doivent pas suggérer que les tokens ont une intention.

## Curriculum avec portes de maîtrise

0. **Diagnostic et passerelles** : variables, chaînes, dictionnaires, listes, boucle bornée, fonctions, tests ; fractions, exponentielle, logarithme, vecteurs et produit scalaire à partir d'exemples.
1. **Données et tokens** : corpus, licence, nettoyage, séparation, caractères/sous-mots, identifiants, coût d'un vocabulaire.
2. **Modèles statistiques** : n-grammes, distribution conditionnelle, génération réelle, limites du contexte.
3. **Réseaux neuronaux** : embeddings, paramètres appris, logits, softmax, perte, gradient et mise à jour ; distinguer entraînement et inférence.
4. **Transformer autoregressif** : positions, Q/K/V, scores, facteur d'échelle, masque causal, normalisation, somme pondérée, multi-têtes, résidu, couches et projection.
5. **Expérimentation et validation** : train/validation/test indépendants, métriques/perplexité, fuite, ablation, biais d'échantillon, choix des hyperparamètres.
6. **Génération et usages** : température, top-k/top-p, fenêtre de contexte, RAG, prompting, JSON, outils, hallucinations et vérification des sources.
7. **Adaptation, sécurité et société** : transfert, fine-tuning/LoRA, alignement, biais, confidentialité, limites d'évaluation, coûts matériels et environnementaux.
8. **Projet de synthèse** : implémentation d'un mini-modèle, lecture de traces, critique de résultats, épreuve de transfert sans guidage et défense orale.

**La progression ne dépend pas du nombre de chapitres ouverts ni du taux de clics sur les quiz.** Un score de QCM n'est jamais une certification de maîtrise.

## Rôle strict de Microduck

Microduck **matérialise la position courante**, jamais une « pensée ». Ses déplacements visualisent seulement des relations définies. Pour l'auto-attention causale, il parcourt les positions d'une **séquence de caractères**, car notre Mini-Transformer expérimental est caractère par caractère. Un changement vers tokens de mots ou sous-mots devra être explicitement annoncé et implémenté.

Phase A : Microduck signale la position ; l'élève prédit les indices consultables **avant révélation**.
Phase B : le masque triangulaire est révélé ; l'élève vérifie les invariants sans couleur seule.
Phase C : les vrais poids QK/softmax sont superposés, distincts du masque binaire et des probabilités du prochain caractère.
Phase D : Microduck se retire ; l'élève justifie sur séquence nouvelle et interprète une carte inconnue.

**Asset gate :** utiliser uniquement la planche officielle Microduck vérifiée, animation 2D sur frames cohérentes, sans SVG dessiné comme substitut. En absence d'asset identifié, afficher un repère textuel explicite et maintenir la partie animation BLOQUÉE ; ne pas prétendre que le sprite est intégré.

## Premier module : attention causale en six micro-étapes

1. Poser le problème : le modèle prédit le caractère suivant à partir du préfixe déjà présent.
2. Indexer six caractères, constater positions 0 à 5.
3. Avant révélation : à i=2, anticiper les positions autorisées ; erreur diagnostiquée selon confusion « strictement passé », « futur permis », « indice/quantité ».
4. Révéler masque binaire : j <= i (inclut la diagonale).
5. Révéler **seulement après** la distinction poids/masque ; somme des poids autorisés égale 1 ; poids futurs nuls ; cartes du vrai modèle après export.
6. Transférer : une séquence de dix caractères, position 6 → indices 0 à 6, soit sept possibilités ; expliquer pourquoi une carte d'attention ne prouve pas la compréhension sémantique.

## Contrat des preuves

- **Calculs** : oracles indépendants pour masque, QKᵀ/√d, softmax, valeurs pondérées, pertes ; protection contre NaN et vecteurs nuls ; propriétés de causalité et de normalisation.
- **Logiciel** : tests unitaires Python, E2E Playwright, navigation clavier, retour d'erreur intelligible, contrôle de réseaux externes, performances PC lycée.
- **Pédagogie** : diagnostic initial, hypothèse écrite, correction ciblée, exercice inédit immédiat, transfert différé, grille de compétences ; deux évaluateurs indépendants en cas de désaccord.
- **Comparaison Microduck** : protocole A/B à exercices comparables, durée, nombre d'aides, réussite différée, charge cognitive perçue ; pas de conclusion causale sans protocole valide.
- **RGPD et contexte scolaire** : pas d'identification nominale imposée, collecte minimale locale et information explicite, aucune publication de réponses individuelles.
- **Enseignant** : version scientifique vérifiable, déroulé de séance, corrigé avec erreurs plausibles, limites, adaptation aux difficultés et ressources institutionnelles.

## Gates du projet

G0 : contrat et inventaire des assets/états existants ; G1 : noyau Python réel et tests (historique : 7/7 rapportés) ; G2 : données de modèle + invariants et test navigateur ; G3 : Microduck officiel synchronisé avec les positions ; G4 : parcours guidé + mode enseignant + accessibilité ; G5 : transfert novice et comparaison pédagogique ; G6 : publication de préproduction distincte et recette sur matériel lycée.

**Tout gate échoué = BLOQUÉ**, pas de fusion sur main ni remplacement du site principal. Le prochain développement doit être la mission « prédire le masque causal » avec une seule idée par étape, et un journal de preuves par verdict.
