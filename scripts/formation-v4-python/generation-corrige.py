SIGNES_DE_FIN = (".", "!", "?")


def choisir_suite(comptes, contexte):
    """Renvoie la suite la plus fréquente ou None. À égalité, prend la première."""
    suites = comptes.get(contexte, {})
    return max(suites, key=suites.get, default=None)


def generer(comptes, debut, limite):
    resultat = debut.copy()
    if not resultat:
        return resultat
    for _ in range(limite):
        contexte = resultat[-1]
        if contexte in SIGNES_DE_FIN:
            break
        suite = choisir_suite(comptes, contexte)
        if suite is None:
            break
        resultat.append(suite)
    return resultat


comptes = {"brille": {"ici": 2, "dehors": 1}, "ici": {".": 1}}
debut = ["ça", "brille"]
assert generer(comptes, debut, 1) == ["ça", "brille", "ici"]
assert debut == ["ça", "brille"]
assert generer(comptes, ["brille"], 5) == ["brille", "ici", "."]
assert generer(comptes, ["brille"], 0) == ["brille"]
assert generer(comptes, ["inconnu"], 3) == ["inconnu"]
assert generer(comptes, [], 3) == []
assert generer(comptes, ["."], 3) == ["."]
comptes = {"monte": {"haut": 2, ".": 1}, "haut": {"!": 1}}
assert generer(comptes, ["monte"], 2) == ["monte", "haut", "!"]
