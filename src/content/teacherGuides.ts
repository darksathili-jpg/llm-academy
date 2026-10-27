/** Repères de médiation pour un enseignant de NSI découvrant les LLM. */
export interface TeacherGuideData {
  starter: string;
  misconception: string;
  response: string;
  evidence: string;
  probe: string;
}

// prettier-ignore
export const teacherGuides: Record<string, TeacherGuideData> = {
  "credibilite": {
    "starter": "Lire l'affirmation et la source avant de regarder le style de la réponse.",
    "misconception": "Une réponse assurée et bien rédigée serait nécessairement juste.",
    "response": "Faire pointer un extrait qui confirme, contredit ou ne tranche pas. Ne jamais appeler « faux » une donnée simplement absente.",
    "evidence": "L'élève cite une source précise et explique ce que l'absence de source autorise à conclure.",
    "probe": "Une date absente du document est-elle nécessairement fausse ?"
  },
  "tokens": {
    "starter": "Faire compter les caractères du corpus avant de fusionner les paires.",
    "misconception": "Un token serait toujours un mot ; un nouveau corpus donnerait nécessairement les mêmes tokens.",
    "response": "Comparer la segmentation après une fusion, puis modifier seulement le corpus d'apprentissage.",
    "evidence": "L'élève prévoit le comptage de ('l','a') puis justifie la nouvelle longueur.",
    "probe": "Pourquoi un autre vocabulaire peut-il découper différemment la même chaîne ?"
  },
  "probabilites": {
    "starter": "Donner trois poids entiers et demander un pronostic avant toute formule.",
    "misconception": "Un token probable rendrait une affirmation factuellement vraie.",
    "response": "Comparer les proportions issues des poids à une affirmation dont la preuve manque.",
    "evidence": "L'élève calcule une somme de probabilités de 1 et distingue prédiction et vérité.",
    "probe": "Le mot le plus probable peut-il conduire à une phrase incorrecte ?"
  },
  "contexte": {
    "starter": "Comparer deux débuts de phrase sans changer les continuations possibles.",
    "misconception": "Le modèle vérifierait une source externe dès qu'on change le contexte.",
    "response": "Demander d'identifier exactement ce qui a été modifié et ce qui est resté constant.",
    "evidence": "L'élève explique pourquoi les fréquences conditionnelles diffèrent entre deux contextes.",
    "probe": "Le changement du début de phrase modifie-t-il nécessairement les poids appris ?"
  },
  "representations": {
    "starter": "Dessiner deux points dont les deux premières coordonnées sont identiques.",
    "misconception": "Deux représentations identiques sur un écran seraient identiques en toute dimension.",
    "response": "Montrer les coordonnées masquées ; distinguer vecteur d'un token et sens d'un mot.",
    "evidence": "L'élève produit un contre-exemple concret de projection trompeuse.",
    "probe": "Peut-on conclure à l'identité de deux vecteurs 3D à partir de leurs deux premières composantes ?"
  },
  "attention": {
    "starter": "Dessiner trois positions et demander ce que la première peut consulter.",
    "misconception": "L'attention serait une preuve que le modèle comprend, ou que la position initiale voit le futur.",
    "response": "Distinguer masque d'accès et pondération calculée ; comparer avec et sans masque.",
    "evidence": "L'élève prédit correctement les cases autorisées et explique l'absence d'influence des positions futures.",
    "probe": "Pourquoi le masque doit-il agir avant la normalisation des scores ?"
  },
  "apprentissage": {
    "starter": "Faire prédire l'évolution d'une mesure d'erreur avant plusieurs mises à jour.",
    "misconception": "Une baisse de l'erreur d'entraînement prouverait la généralisation et la vérité des sorties.",
    "response": "Faire comparer entraînement et validation avec poids fixes pendant la mesure.",
    "evidence": "L'élève explique quel jeu de données sert aux mises à jour et lequel sert à mesurer.",
    "probe": "Un modèle peut-il s'améliorer sur l'entraînement tout en se dégradant sur d'autres exemples ?"
  },
  "generation": {
    "starter": "Rejouer les mêmes tirages avec la même graine, puis modifier un seul réglage.",
    "misconception": "La température améliorerait la connaissance du modèle ; la graine changerait ses paramètres appris.",
    "response": "Garder poids, corpus et contexte constants pour isoler les choix de sortie.",
    "evidence": "L'élève distingue les mécanismes de filtrage, de tirage et de mise à jour des paramètres.",
    "probe": "Modifier top-k, sans entraîner de nouveau, change-t-il les poids du modèle ?"
  },
  "erreurs": {
    "starter": "Utiliser trois affirmations : une confirmée, une contredite, une dont la source ne parle pas.",
    "misconception": "Une affirmation non documentée devrait toujours être classée fausse.",
    "response": "Exiger une comparaison textuelle exacte et distinguer contradiction et absence de preuve.",
    "evidence": "L'élève justifie les trois verdicts par le document ou par l'absence d'information.",
    "probe": "Quelle preuve permet de déclarer une contradiction plutôt qu'une incertitude ?"
  },
  "fiabilite": {
    "starter": "Retrouver un passage sur une requête et vérifier sa pertinence.",
    "misconception": "Un extrait classé premier serait automatiquement la bonne réponse.",
    "response": "Expliquer que la recherche lexicale du laboratoire ne comprend pas les synonymes ni les négations.",
    "evidence": "L'élève vérifie le passage et sait s'abstenir lorsqu'aucune preuve pertinente n'existe.",
    "probe": "Pourquoi une référence documentaire ne suffit-elle pas à prouver une réponse ?"
  }
};
