/** Défis Python : prolongements NSI, sans bibliothèque externe ni prétention à entraîner un LLM. */
export interface NsiChallenge {
  id: string;
  title: string;
  goal: string;
  instruction: string;
  hint: string;
  transfer: string;
  starter: string;
  solution: string;
}

// prettier-ignore
export const nsiChallenges: Record<string, NsiChallenge> = {
  "credibilite": {
    "id": "credibilite",
    "title": "Classer une affirmation",
    "goal": "Écrire une fonction qui distingue une affirmation étayée, contredite ou non documentée.",
    "instruction": "Le dictionnaire contient la valeur de vérité documentée pour certaines affirmations. La fonction ne doit jamais inventer une information absente.",
    "hint": "Tester d'abord si l'affirmation est une clé du dictionnaire avec in.",
    "transfer": "Ajouter une affirmation absente et vérifier que la fonction renvoie « insuffisant ».",
    "starter": "def classer(affirmation, faits):\n    \"\"\"Renvoie 'etaye', 'contredit' ou 'insuffisant'.\"\"\"\n    # TODO : consulter le dictionnaire faits.\n    pass\n\nfaits = {\"ouvre_lundi\": False, \"ouvre_mardi\": True}\nassert classer(\"ouvre_lundi\", faits) == \"contredit\"\nassert classer(\"ouvre_mardi\", faits) == \"etaye\"\nassert classer(\"heure_ouverture\", faits) == \"insuffisant\"\nprint(\"Trois tests réussis.\")",
    "solution": "def classer(affirmation, faits):\n    if affirmation not in faits:\n        return \"insuffisant\"\n    if faits[affirmation]:\n        return \"etaye\"\n    return \"contredit\"\n\nfaits = {\"ouvre_lundi\": False, \"ouvre_mardi\": True}\nassert classer(\"ouvre_lundi\", faits) == \"contredit\"\nassert classer(\"ouvre_mardi\", faits) == \"etaye\"\nassert classer(\"heure_ouverture\", faits) == \"insuffisant\"\nprint(\"Trois tests réussis.\")"
  },
  "tokens": {
    "id": "tokens",
    "title": "Compter des paires",
    "goal": "Utiliser un dictionnaire pour compter les paires de caractères adjacents d'un corpus.",
    "instruction": "Parcourir chaque mot, puis ses indices de 0 à len(mot)-2. Une paire est un tuple de deux caractères.",
    "hint": "Une boucle bornée for i in range(len(mot) - 1) permet de lire mot[i] et mot[i+1].",
    "transfer": "Tester le corpus ['aaa'] : la paire ('a','a') est observée deux fois.",
    "starter": "def compter_paires(mots):\n    \"\"\"Renvoie un dictionnaire associant chaque paire à son effectif.\"\"\"\n    effectifs = {}\n    # TODO : parcourir les mots et compter les paires adjacentes.\n    return effectifs\n\nresultat = compter_paires([\"lac\", \"lac\", \"lama\"])\nassert resultat[(\"l\", \"a\")] == 3\nassert resultat[(\"a\", \"c\")] == 2\nassert compter_paires([\"aaa\"])[(\"a\", \"a\")] == 2\nprint(\"Trois tests réussis.\")",
    "solution": "def compter_paires(mots):\n    effectifs = {}\n    for mot in mots:\n        for i in range(len(mot) - 1):\n            paire = (mot[i], mot[i + 1])\n            effectifs[paire] = effectifs.get(paire, 0) + 1\n    return effectifs\n\nresultat = compter_paires([\"lac\", \"lac\", \"lama\"])\nassert resultat[(\"l\", \"a\")] == 3\nassert resultat[(\"a\", \"c\")] == 2\nassert compter_paires([\"aaa\"])[(\"a\", \"a\")] == 2\nprint(\"Trois tests réussis.\")"
  },
  "probabilites": {
    "id": "probabilites",
    "title": "Normaliser des poids",
    "goal": "Écrire une fonction qui renvoie une liste de probabilités de somme égale à 1.",
    "instruction": "Le programme reçoit des poids positifs. Calculer leur somme, puis diviser chaque poids par cette somme. Ce ne sont pas des logits.",
    "hint": "Affecter total = sum(poids), puis construire une liste de quotients.",
    "transfer": "Pourquoi faut-il refuser le cas où tous les poids sont nuls ?",
    "starter": "def normaliser(poids):\n    \"\"\"Renvoie les probabilités associées à des poids positifs.\"\"\"\n    if not poids or sum(poids) <= 0:\n        raise ValueError(\"Somme strictement positive attendue\")\n    # TODO : calculer et renvoyer les probabilités.\n    pass\n\np = normaliser([2, 3, 5])\nassert len(p) == 3\nassert abs(p[2] - 0.5) < 1e-9\nassert abs(sum(p) - 1) < 1e-9\nprint(\"Trois tests réussis.\")",
    "solution": "def normaliser(poids):\n    if not poids or sum(poids) <= 0:\n        raise ValueError(\"Somme strictement positive attendue\")\n    total = sum(poids)\n    return [poids[i] / total for i in range(len(poids))]\n\np = normaliser([2, 3, 5])\nassert len(p) == 3\nassert abs(p[2] - 0.5) < 1e-9\nassert abs(sum(p) - 1) < 1e-9\nprint(\"Trois tests réussis.\")"
  },
  "contexte": {
    "id": "contexte",
    "title": "Choisir selon le contexte",
    "goal": "Utiliser un dictionnaire de fréquences conditionnées par le contexte.",
    "instruction": "Chaque contexte possède un dictionnaire de continuations et de fréquences. Renvoyer la continuation la plus fréquente ; None si le contexte est inconnu.",
    "hint": "Chercher d'abord statistiques[contexte], puis parcourir ses clés pour garder le meilleur effectif.",
    "transfer": "Modifier uniquement les effectifs associés à 'le marin' et comparer.",
    "starter": "def mot_suivant(contexte, statistiques):\n    \"\"\"Renvoie le mot le plus fréquent ou None.\"\"\"\n    # TODO : consulter les statistiques du contexte.\n    pass\n\ntable = {\n    \"le chat\": {\"dort\": 4, \"nage\": 1},\n    \"le marin\": {\"dort\": 1, \"nage\": 5}\n}\nassert mot_suivant(\"le chat\", table) == \"dort\"\nassert mot_suivant(\"le marin\", table) == \"nage\"\nassert mot_suivant(\"inconnu\", table) is None\nprint(\"Trois tests réussis.\")",
    "solution": "def mot_suivant(contexte, statistiques):\n    if contexte not in statistiques:\n        return None\n    effectifs = statistiques[contexte]\n    meilleur = None\n    maximum = -1\n    for mot in effectifs:\n        if effectifs[mot] > maximum:\n            maximum = effectifs[mot]\n            meilleur = mot\n    return meilleur\n\ntable = {\n    \"le chat\": {\"dort\": 4, \"nage\": 1},\n    \"le marin\": {\"dort\": 1, \"nage\": 5}\n}\nassert mot_suivant(\"le chat\", table) == \"dort\"\nassert mot_suivant(\"le marin\", table) == \"nage\"\nassert mot_suivant(\"inconnu\", table) is None\nprint(\"Trois tests réussis.\")"
  },
  "representations": {
    "id": "representations",
    "title": "Projeter un vecteur",
    "goal": "Comprendre qu'une projection peut faire disparaître une information.",
    "instruction": "La fonction reçoit un tuple (x, y, z) et renvoie uniquement les deux premières coordonnées.",
    "hint": "Renvoyer un tuple constitué de la composante d'indice 0 et de celle d'indice 1.",
    "transfer": "Construire deux vecteurs ayant la même projection et une troisième coordonnée différente.",
    "starter": "def projection_xy(vecteur):\n    \"\"\"Renvoie les deux premières coordonnées d'un vecteur 3D.\"\"\"\n    # TODO : construire le tuple projeté.\n    pass\n\na = (1, 2, 3)\nb = (1, 2, -3)\nassert projection_xy(a) == (1, 2)\nassert projection_xy(a) == projection_xy(b)\nassert a != b\nprint(\"Trois tests réussis.\")",
    "solution": "def projection_xy(vecteur):\n    return (vecteur[0], vecteur[1])\n\na = (1, 2, 3)\nb = (1, 2, -3)\nassert projection_xy(a) == (1, 2)\nassert projection_xy(a) == projection_xy(b)\nassert a != b\nprint(\"Trois tests réussis.\")"
  },
  "attention": {
    "id": "attention",
    "title": "Construire un masque causal",
    "goal": "Construire un tableau de booléens indiquant quelles positions passées sont consultables.",
    "instruction": "Pour la ligne i et la colonne j, la case doit valoir True si j <= i, False sinon. Construire une liste de listes.",
    "hint": "Utiliser deux boucles bornées imbriquées, puis tester la condition j <= i.",
    "transfer": "Pour n=4, combien de cases True contient la matrice ?",
    "starter": "def masque_causal(n):\n    \"\"\"Renvoie une liste de listes de booléens.\"\"\"\n    masque = []\n    # TODO : construire les n lignes de n cases.\n    return masque\n\nassert masque_causal(3) == [\n    [True, False, False],\n    [True, True, False],\n    [True, True, True]\n]\nassert masque_causal(1) == [[True]]\nprint(\"Deux tests réussis.\")",
    "solution": "def masque_causal(n):\n    masque = []\n    for i in range(n):\n        ligne = []\n        for j in range(n):\n            ligne.append(j <= i)\n        masque.append(ligne)\n    return masque\n\nassert masque_causal(3) == [\n    [True, False, False],\n    [True, True, False],\n    [True, True, True]\n]\nassert masque_causal(1) == [[True]]\nprint(\"Deux tests réussis.\")"
  },
  "apprentissage": {
    "id": "apprentissage",
    "title": "Mesurer une erreur",
    "goal": "Évaluer des prédictions sur des exemples distincts de ceux utilisés pour construire le modèle.",
    "instruction": "À partir de deux listes de même taille, calculer la proportion de positions dont les valeurs diffèrent.",
    "hint": "Compter les indices pour lesquels predictions[i] != cibles[i], puis diviser par len(cibles).",
    "transfer": "Comparer le taux d'erreur avant et après une modification des prédictions.",
    "starter": "def taux_erreur(predictions, cibles):\n    \"\"\"Renvoie une proportion d'erreurs entre 0 et 1.\"\"\"\n    if len(predictions) != len(cibles) or not cibles:\n        raise ValueError(\"Listes de même longueur non vide\")\n    # TODO : compter les désaccords.\n    pass\n\nassert taux_erreur([\"a\", \"b\", \"c\"], [\"a\", \"x\", \"c\"]) == 1 / 3\nassert taux_erreur([\"a\", \"b\"], [\"a\", \"b\"]) == 0\nprint(\"Deux tests réussis.\")",
    "solution": "def taux_erreur(predictions, cibles):\n    if len(predictions) != len(cibles) or not cibles:\n        raise ValueError(\"Listes de même longueur non vide\")\n    erreurs = 0\n    for i in range(len(cibles)):\n        if predictions[i] != cibles[i]:\n            erreurs += 1\n    return erreurs / len(cibles)\n\nassert taux_erreur([\"a\", \"b\", \"c\"], [\"a\", \"x\", \"c\"]) == 1 / 3\nassert taux_erreur([\"a\", \"b\"], [\"a\", \"b\"]) == 0\nprint(\"Deux tests réussis.\")"
  },
  "generation": {
    "id": "generation",
    "title": "Générer une suite déterministe",
    "goal": "Construire une boucle bornée de génération à partir d'une table de transitions.",
    "instruction": "Commencer par le mot de départ, chercher sa continuation, l'ajouter puis recommencer. Arrêter si la transition manque ou vaut '<FIN>'.",
    "hint": "Pour chaque répétition : mot = table.get(mot), puis break si mot is None ou vaut '<FIN>'.",
    "transfer": "Ajouter un cycle dans la table et vérifier que maximum borne la longueur.",
    "starter": "def generer(depart, table, maximum):\n    \"\"\"Renvoie la suite sans ajouter la marque <FIN>.\"\"\"\n    suite = [depart]\n    # TODO : répéter la recherche et ajouter les mots autorisés.\n    return suite\n\ntransitions = {\"le\": \"chat\", \"chat\": \"dort\", \"dort\": \"<FIN>\"}\nassert generer(\"le\", transitions, 5) == [\"le\", \"chat\", \"dort\"]\nassert generer(\"inconnu\", transitions, 5) == [\"inconnu\"]\nprint(\"Deux tests réussis.\")",
    "solution": "def generer(depart, table, maximum):\n    suite = [depart]\n    mot = depart\n    for _ in range(maximum):\n        mot = table.get(mot)\n        if mot is None or mot == \"<FIN>\":\n            break\n        suite.append(mot)\n    return suite\n\ntransitions = {\"le\": \"chat\", \"chat\": \"dort\", \"dort\": \"<FIN>\"}\nassert generer(\"le\", transitions, 5) == [\"le\", \"chat\", \"dort\"]\nassert generer(\"inconnu\", transitions, 5) == [\"inconnu\"]\nprint(\"Deux tests réussis.\")"
  },
  "erreurs": {
    "id": "erreurs",
    "title": "Diagnostiquer des affirmations",
    "goal": "Distinguer une contradiction d'une information absente grâce à deux dictionnaires.",
    "instruction": "Comparer chaque valeur affirmée avec la valeur de référence de même clé. Si la clé manque : 'insuffisant'.",
    "hint": "Utiliser if cle not in source, elif affirmations[cle] == source[cle], puis else.",
    "transfer": "Tester une affirmation absente de la source : elle n'est pas automatiquement fausse.",
    "starter": "def diagnostiquer(affirmations, source):\n    \"\"\"Renvoie un dictionnaire de verdicts.\"\"\"\n    verdicts = {}\n    # TODO : traiter chaque clé des affirmations.\n    return verdicts\n\nsource = {\"jour\": \"mardi\", \"salle\": \"B12\"}\naffirmations = {\"jour\": \"lundi\", \"salle\": \"B12\", \"age\": 17}\nresultat = diagnostiquer(affirmations, source)\nassert resultat[\"jour\"] == \"contredit\"\nassert resultat[\"salle\"] == \"etaye\"\nassert resultat[\"age\"] == \"insuffisant\"\nprint(\"Trois tests réussis.\")",
    "solution": "def diagnostiquer(affirmations, source):\n    verdicts = {}\n    for cle in affirmations:\n        if cle not in source:\n            verdicts[cle] = \"insuffisant\"\n        elif affirmations[cle] == source[cle]:\n            verdicts[cle] = \"etaye\"\n        else:\n            verdicts[cle] = \"contredit\"\n    return verdicts\n\nsource = {\"jour\": \"mardi\", \"salle\": \"B12\"}\naffirmations = {\"jour\": \"lundi\", \"salle\": \"B12\", \"age\": 17}\nresultat = diagnostiquer(affirmations, source)\nassert resultat[\"jour\"] == \"contredit\"\nassert resultat[\"salle\"] == \"etaye\"\nassert resultat[\"age\"] == \"insuffisant\"\nprint(\"Trois tests réussis.\")"
  },
  "fiabilite": {
    "id": "fiabilite",
    "title": "Retrouver un passage et s'abstenir",
    "goal": "Rechercher un mot dans un corpus et conserver les identifiants des documents trouvés.",
    "instruction": "Renvoyer une liste d'identifiants dont le texte contient le mot recherché, en ignorant la casse. Une liste vide signifie aucune preuve trouvée par cette recherche.",
    "hint": "Parcourir les clés du dictionnaire et tester mot.casefold() in texte.casefold().",
    "transfer": "Expliquer pourquoi la présence d'un mot dans un passage ne certifie pas une réponse.",
    "starter": "def chercher(corpus, mot):\n    \"\"\"Renvoie la liste des identifiants correspondants.\"\"\"\n    documents = []\n    # TODO : rechercher une sous-chaîne sans tenir compte de la casse.\n    return documents\n\ncorpus = {\"S1\": \"Le lac est bleu.\", \"S2\": \"Le lama dort.\"}\nassert chercher(corpus, \"LAC\") == [\"S1\"]\nassert chercher(corpus, \"absent\") == []\nprint(\"Deux tests réussis.\")",
    "solution": "def chercher(corpus, mot):\n    documents = []\n    for identifiant in corpus:\n        if mot.casefold() in corpus[identifiant].casefold():\n            documents.append(identifiant)\n    return documents\n\ncorpus = {\"S1\": \"Le lac est bleu.\", \"S2\": \"Le lama dort.\"}\nassert chercher(corpus, \"LAC\") == [\"S1\"]\nassert chercher(corpus, \"absent\") == []\nprint(\"Deux tests réussis.\")"
  }
};
