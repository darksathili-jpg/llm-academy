def fusionner(unites, gauche, droite):
    resultat = []
    indice = 0
    while indice < len(unites):
        voisin_existe = indice + 1 < len(unites)
        if voisin_existe and unites[indice] == gauche and unites[indice + 1] == droite:
            resultat.append(gauche + droite)
            indice += 2
        else:
            resultat.append(unites[indice])
            indice += 1
    return resultat


unites = ["z", "a", "b", "a"]
assert fusionner(unites, "a", "b") == ["z", "ab", "a"]
assert unites == ["z", "a", "b", "a"]
assert fusionner(["a", "z"], "a", "b") == ["a", "z"]
assert fusionner([], "a", "b") == []
assert fusionner(["x", "x", "x"], "x", "x") == ["xx", "x"]
assert fusionner(["s", "s", "s", "t", "s", "s"], "s", "s") == ["ss", "s", "t", "ss"]
