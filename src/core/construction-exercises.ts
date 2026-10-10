import type {Exercise} from './exercises';
export const constructionExercises: Exercise[] = [
  {
    "module": "07",
    "id": "m07-shift",
    "kind": "number",
    "level": "Calcul",
    "prompt": "Le document [0,1,2,3] fournit les entrées [0,1,2]. Quel est l’ID de la dernière cible ?",
    "expected": 3,
    "tolerance": 0.0001,
    "hint": "Décalez la cible d’une position vers le futur.",
    "correction": "Les cibles sont [1,2,3]. La dernière cible est 3 et ne fait pas partie des entrées de cette fenêtre."
  },
  {
    "module": "07",
    "id": "m07-parameters",
    "kind": "number",
    "level": "Dimensions",
    "prompt": "E a la forme 8×4 et W la forme 4×8. Sans biais, combien de paramètres entraînables contient ce modèle ?",
    "expected": 64,
    "tolerance": 0.0001,
    "hint": "Additionnez les nombres d’entrées des deux matrices.",
    "correction": "8×4 + 4×8 = 64. On compte les paramètres, pas les logits ni les tokens."
  },
  {
    "module": "07",
    "id": "m07-leak",
    "kind": "choice",
    "level": "Débogage",
    "prompt": "Des fenêtres chevauchantes d’un même document sont distribuées au hasard entre entraînement et validation. Quelle correction traite le risque de fuite ?",
    "choices": [
      "Augmenter la température",
      "Séparer les documents et leurs doublons avant le fenêtrage",
      "Appliquer softmax deux fois"
    ],
    "expected": "Séparer les documents et leurs doublons avant le fenêtrage",
    "hint": "Les fenêtres peuvent partager les mêmes préfixes et cibles.",
    "correction": "Séparer en amont et contrôler les doublons limite la contamination. Le sampling n’affecte pas le protocole de données."
  },
  {
    "module": "07",
    "id": "m07-generation",
    "kind": "choice",
    "level": "Transfert",
    "prompt": "Après avoir généré un token, quelle entrée faut-il utiliser au prochain pas autorégressif ?",
    "choices": [
      "Le contexte enrichi du token choisi",
      "La cible réelle suivante du jeu de test",
      "Le même contexte sans ajout"
    ],
    "expected": "Le contexte enrichi du token choisi",
    "hint": "La génération ne dispose pas de la prochaine vérité terrain.",
    "correction": "On ajoute le token choisi puis recalcule les logits. Utiliser la cible réelle correspond au teacher forcing."
  },
  {
    "module": "08",
    "id": "m08-gradient",
    "kind": "number",
    "level": "Calcul",
    "prompt": "Pour une seule cible de probabilité 0,25, quelle est la dérivée de la perte par rapport à son logit ?",
    "expected": -0.75,
    "tolerance": 0.0001,
    "hint": "Pour la cible, la dérivée vaut p−1.",
    "correction": "0,25−1=−0,75. SGD soustrait ce gradient ; il tend localement à augmenter le logit cible."
  },
  {
    "module": "08",
    "id": "m08-sgd",
    "kind": "number",
    "level": "Calcul",
    "prompt": "Un poids vaut 0,4, son gradient vaut −0,2 et η=0,5. Quelle est sa valeur après SGD ?",
    "expected": 0.5,
    "tolerance": 0.0001,
    "hint": "Soustrayez η multiplié par le gradient.",
    "correction": "0,4−0,5×(−0,2)=0,5. Le signe du gradient détermine le sens de la mise à jour."
  },
  {
    "module": "08",
    "id": "m08-validation",
    "kind": "choice",
    "level": "Débogage",
    "prompt": "Quelle opération doit être exclue de la mesure de validation ?",
    "choices": [
      "Calculer la perte avec les poids actuels",
      "Mettre les poids à jour avec les gradients de validation",
      "Garder une trace de la graine"
    ],
    "expected": "Mettre les poids à jour avec les gradients de validation",
    "hint": "La validation mesure le modèle, elle ne fournit pas le gradient d’entraînement.",
    "correction": "Modifier les poids à partir de la validation transforme celle-ci en données d’entraînement et invalide ce rôle de mesure."
  },
  {
    "module": "08",
    "id": "m08-overfit",
    "kind": "choice",
    "level": "Interprétation",
    "prompt": "La perte d’entraînement baisse et celle de validation augmente. Quelle conclusion est justifiée ?",
    "choices": [
      "Le modèle garantit des réponses factuelles",
      "Examiner surapprentissage, décalage de distribution et protocole",
      "La validation doit nécessairement être supprimée"
    ],
    "expected": "Examiner surapprentissage, décalage de distribution et protocole",
    "hint": "Un écart observé ne prouve pas une seule cause.",
    "correction": "Il faut comparer corpus, capacité, pas et hyperparamètres. Une meilleure prédiction des exemples d’entraînement ne garantit pas la généralisation."
  },
  {
    "module": "09",
    "id": "m09-nucleus",
    "kind": "number",
    "level": "Calcul",
    "prompt": "Pour [0,5;0,3;0,2] et top-p=0,6 sans top-k, quelle est la probabilité finale du premier token ?",
    "expected": 0.625,
    "tolerance": 0.0001,
    "hint": "Le noyau inclut le token qui dépasse le seuil, puis renormalise.",
    "correction": "Le noyau garde 0,5 et 0,3 ; masse 0,8. 0,5/0,8=0,625. Écarter le second conserverait une masse insuffisante."
  },
  {
    "module": "09",
    "id": "m09-lora-count",
    "kind": "number",
    "level": "Dimensions",
    "prompt": "Un adaptateur de rang 1 ajuste une projection 4×8 avec A de forme 4×1 et B de forme 1×8. Combien de paramètres sont entraînables ?",
    "expected": 12,
    "tolerance": 0.0001,
    "hint": "Les poids de la projection de base sont gelés.",
    "correction": "4×1+1×8=12 paramètres. L’adaptateur peut produire une matrice de rang au plus 1."
  },
  {
    "module": "09",
    "id": "m09-zero-init",
    "kind": "choice",
    "level": "Débogage",
    "prompt": "Pourquoi éviter d’initialiser A et B tous deux à zéro dans W+AB ?",
    "choices": [
      "Les deux gradients sont alors nuls",
      "Le vocabulaire devient trop grand",
      "Le masque causal disparaît"
    ],
    "expected": "Les deux gradients sont alors nuls",
    "hint": "Les dérivées de AB contiennent respectivement B et A.",
    "correction": "Avec A=B=0, les deux branches de gradient s’annulent. Initialiser A et mettre B à zéro conserve une mise à jour initiale nulle tout en permettant à B d’apprendre."
  },
  {
    "module": "09",
    "id": "m09-sampling",
    "kind": "choice",
    "level": "Transfert",
    "prompt": "Que modifie la température dans une inférence à poids fixes ?",
    "choices": [
      "Les poids par rétropropagation",
      "La distribution utilisée pour sélectionner le prochain token",
      "Le corpus de pré-entraînement"
    ],
    "expected": "La distribution utilisée pour sélectionner le prochain token",
    "hint": "Elle divise les logits avant softmax.",
    "correction": "La température transforme les scores utilisés pour la sélection. Le fine-tuning modifie les paramètres ; ces mécanismes doivent être distingués."
  }
];
