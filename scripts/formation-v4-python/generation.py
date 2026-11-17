SIGNES_DE_FIN = (".", "!", "?")


def choisir_suite(comptes, contexte):
    """Renvoie la suite la plus fréquente ou None. À égalité, prend la première."""
    suites = comptes.get(contexte, {})
    return max(suites, key=suites.get, default=None)


def generer(comptes, debut, limite):
    """Renvoie une nouvelle liste, avec au plus limite tokens ajoutés."""
    raise NotImplementedError("Complète la fonction generer.")


comptes = {"brille": {"ici": 2, "dehors": 1}, "ici": {".": 1}}
assert generer(comptes, ["ça", "brille"], 1) == ["ça", "brille", "ici"]
assert generer(comptes, ["brille"], 5) == ["brille", "ici", "."]
# Ajoute ici tes assertions, dont un cas avec une limite égale à zéro.
