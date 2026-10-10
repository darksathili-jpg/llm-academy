# Même modèle E[id]W que le navigateur, corpus original et graine 7.
# Python standard uniquement ; pas de PyTorch.
import math

train = """le chat voit la lune
le chien voit la lune
le chat voit la lune
le chien voit le chat"""
docs = [line.split() for line in train.splitlines()]
vocab = ["<début>", "<fin>"] + list(dict.fromkeys(word for doc in docs for word in doc))
ids = [[0] + [vocab.index(word) for word in doc] + [1] for doc in docs]
pairs = [(doc[i], doc[i+1]) for doc in ids for i in range(len(doc)-1)]
state = 7
def random_value():
    global state
    state = (1664525 * state + 1013904223) % 2**32
    return state / 2**32
V, D = len(vocab), 4
E = [[(random_value()-.5)*.4 for _ in range(D)] for _ in range(V)]
W = [[(random_value()-.5)*.4 for _ in range(V)] for _ in range(D)]

def logits(token):
    return [sum(E[token][k]*W[k][j] for k in range(D)) for j in range(V)]
def softmax(z):
    values = [math.exp(x-max(z)) for x in z]
    return [x/sum(values) for x in values]
def loss():
    total = 0
    for token, target in pairs:
        z = logits(token)
        total += max(z)-z[target]+math.log(sum(math.exp(x-max(z)) for x in z))
    return total/len(pairs)

dE = [[0.0]*D for _ in range(V)]
dW = [[0.0]*V for _ in range(D)]
for token, target in pairs:
    p = softmax(logits(token))
    dz = [(x-(j==target))/len(pairs) for j,x in enumerate(p)]
    for k in range(D):
        for j in range(V):
            dE[token][k] += dz[j]*W[k][j]
            dW[k][j] += E[token][k]*dz[j]
before = loss()
old, eps = W[0][0], 1e-5
W[0][0] = old+eps
plus = loss()
W[0][0] = old-eps
minus = loss()
W[0][0] = old
finite_difference = (plus-minus)/(2*eps)
print("Vocabulaire :", vocab)
print("Paires :", len(pairs), "Paramètres :", 2*V*D)
print("Perte avant :", round(before, 9))
print("Gradient W[0][0] :", round(dW[0][0], 9))
print("Différence finie :", round(finite_difference, 9))
assert abs(dW[0][0]-finite_difference) < 1e-8
# Gradient moyen ; taux = 0.8 ; clipping de norme 5 comme dans le navigateur.
norm = math.sqrt(sum(x*x for row in dE+dW for x in row))
scale = min(1, 5/(norm or 1))
for i in range(V):
    for k in range(D):
        E[i][k] -= .8*scale*dE[i][k]
for k in range(D):
    for j in range(V):
        W[k][j] -= .8*scale*dW[k][j]
print("Perte après une mise à jour :", round(loss(), 9))
print("Vérification du gradient : OK")
