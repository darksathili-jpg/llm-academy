def chercher(documents, requete):
    requete = requete.strip().lower()
    correspondances = []
    if requete == "":
        return correspondances
    for identifiant, texte in documents.items():
        if requete in texte.lower():
            correspondances.append(identifiant)
    return correspondances


documents = {"D1": "Le jardin est calme.", "D2": "Le quai est désert."}
assert chercher(documents, "  QUAI ") == ["D2"]
assert chercher(documents, "océan") == []
assert chercher(documents, "   ") == []
assert chercher({"B": "l'AUBE", "A": "aube", "C": "nuit"}, "Aube") == ["B", "A"]
assert chercher({"A": "Le portail ferme", "B": "Le port ouvre"}, " PORT") == ["A", "B"]
