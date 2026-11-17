def chercher(documents, requete):
    """Renvoie les identifiants des documents contenant la requête normalisée."""
    raise NotImplementedError("Complète la fonction chercher.")


documents = {"D1": "Le jardin est calme.", "D2": "Le quai est désert."}
assert chercher(documents, "  QUAI ") == ["D2"]
assert chercher(documents, "océan") == []
# Ajoute ici tes assertions, dont une requête composée seulement d'espaces.
