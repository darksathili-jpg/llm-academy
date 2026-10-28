# Parcours enseignant NSI — Module 1
## Comprendre ce que fait un modèle de langage : du texte à la génération d'une réponse

**Version de travail V5 — 28 octobre 2026.** Document de formation autonome destiné aux professeurs de NSI qui découvrent les LLM. Il est conçu pour être lu **avant** de préparer la séance élève. Il ne suppose ni d’avoir suivi la spécialité mathématiques ni de posséder une expérience préalable en intelligence artificielle.

**Durée de formation personnelle conseillée :** 90 à 120 minutes (durées estimées, non mesurées). **Mise en classe proposée :** 55 minutes, après préparation. **Statut :** contenu rédigé, en attente de relecture pédagogique indépendante et d'essais avec des personnes novices. Aucun résultat d'apprentissage n'est présumé.

### Pourquoi ce module est nécessaire

Un enseignant sait généralement expliquer ce que fait une fonction Python : elle reçoit des arguments, exécute des instructions, puis peut renvoyer une valeur. Un LLM constitue un objet différent : il utilise les paramètres appris d'un modèle statistique pour calculer des scores sur les suites possibles d'un texte. Comment passer de ce mécanisme à une réponse qui ressemble à une explication rédigée ? Et surtout, comment éviter de confondre une phrase convaincante avec un fait vérifié ?

Nous allons construire une réponse **sans demander de formule de réseau neuronal**. L'objectif n'est ni de prétendre programmer un vrai LLM avec vingt lignes de Python, ni d'exiger que le professeur maîtrise déjà les Transformers.

---

## Objectifs observables

À la fin, l'enseignant doit pouvoir, sans lire ce cours :

1. Expliquer avec ses propres mots ce qu'est un modèle de langage et ce que signifie « prédire le prochain token ».
2. Distinguer **entraînement** (ajustement des paramètres à partir de données) et **inférence** (utilisation d'un modèle déjà entraîné).
3. Expliquer les mots **token**, **contexte**, **score**, **probabilité de choix** et **génération**, après avoir illustré chacun avec un exemple.
4. Décrire pourquoi choisir successivement des tokens permet de produire un texte, sans garantir sa vérité.
5. Montrer, à partir d'un document, la différence entre affirmation **étayée**, **contredite** et **non documentée**.
6. Préparer une expérience où l'élève change un seul paramètre et formule une observation vérifiable.
7. Expliquer précisément la limite de chacune des simulations utilisées dans LLM Academy.

### Les seuls prérequis

- Lire une phrase et comparer deux versions d'un même document.
- Lire des pourcentages : Dans un tirage où les issues sont équiprobables, une probabilité de 20 % correspond à 20 issues favorables sur 100 issues possibles.
- Connaître en Python les listes, les fonctions, les instructions conditionnelles et la boucle bornée `for` pour le prolongement facultatif. Tout le reste est introduit ici.

**Important pour la NSI :** le fonctionnement interne des LLM n'est pas présenté comme une notion exigible au baccalauréat. Les exercices peuvent mobiliser des notions de programmation du programme officiel ; les concepts spécialisés de l'IA sont des applications et prolongements.

---

## 1. Une phrase plausible n'est pas une preuve

**Situation de départ (ne pas donner l'explication immédiatement).**

Un petit document indique :

> « La médiathèque du quartier ouvre le mardi et le jeudi. Elle est fermée le lundi. »

Une réponse rédigée par un assistant annonce :

> « La médiathèque accueille les lecteurs tous les jours, y compris le lundi. »

Le texte de l'assistant est grammatical, fluide et semble assuré.

**Question :** la phrase est-elle vraie simplement parce qu'elle est bien formulée ?

**Raisonnement attendu :** non. Le document contredit explicitement l'ouverture le lundi. La qualité de la rédaction n'est pas un critère de vérité.

Introduisons maintenant une troisième affirmation : « La médiathèque ouvre à 9 heures ». Le document ne précise pas les horaires. Elle n'est donc **ni confirmée ni contredite** par ce document : les informations sont insuffisantes pour conclure.

| Affirmation examinée | Ce que fournit la source | Verdict relatif à cette source |
|---|---|---|
| Ouverte le mardi | « ouvre le mardi » | Étayée |
| Ouverte le lundi | « fermée le lundi » | Contredite |
| Ouvre à 9 heures | Aucun horaire | Non documentée |

**Point décisif :** « non documentée » ne signifie pas « fausse ». Même « étayée » signifie ici « conforme au document fourni » : cela ne prouve pas que ce document lui-même soit exact ou à jour.

**Erreur fréquente à corriger :** « Les LLM choisissent toutes leurs réponses au hasard. » Cette affirmation est inexacte : leurs sorties dépendent des paramètres appris, du contexte et des réglages de génération. Le choix final peut comporter une part pseudoaléatoire. Des réponses peuvent être exactes ou utiles ; leur vérification doit néanmoins être proportionnée aux enjeux.

### Vérification de compréhension 1

*Question.* Si un autre document affirme que la médiathèque ouvre le samedi, mais que le document de départ ne le mentionne pas, quel verdict porte-t-on **à partir du document de départ uniquement** ?

*Réponse attendue.* Non documentée ; il faut lire et évaluer l'autre source avant d'en tirer une conclusion générale.

---

## 2. Le modèle de langage : définir avant de manipuler

### 2.1 Le terme « modèle »

Dans ce cours, un **modèle** est un système de calcul dont les paramètres ont été ajustés en exploitant des données. Les paramètres sont des valeurs numériques qui influencent le résultat des calculs. Un modèle de langage traite des séquences de tokens et permet, entre autres tâches, de calculer des scores pour les suites possibles.

Un **LLM** (« Large Language Model ») est un modèle de langage de grande taille, généralement entraîné sur de grands ensembles de données. La taille ne se réduit pas au nombre de documents : le nombre de paramètres, l'architecture et le calcul mobilisé interviennent aussi. Nous n'imposons aucun seuil arbitraire à partir duquel un modèle deviendrait « large ».

**Ce que l'on peut expliquer sans déformer le mécanisme :** pour expliquer la génération par un modèle autorégressif, il est pertinent de montrer la prédiction du token suivant à partir des tokens déjà disponibles. Cela ne signifie pas que toutes les architectures ou toutes les tâches d'IA fonctionnent uniquement de cette façon.

### 2.2 Le terme « entraînement »

Pendant un **entraînement**, on présente des exemples au modèle. Un calcul produit une estimation ; une fonction de perte mesure un écart selon l'objectif choisi ; une procédure d'optimisation ajuste des paramètres pour réduire cet écart sur les exemples d'apprentissage.

Pour l'entraînement d'un modèle de langage causal, un objectif courant consiste à prédire le prochain token de nombreuses séquences. Il existe ensuite d'autres étapes possibles, dont l'ajustement à des instructions ou à des préférences.

**Exemple schématique :**

- Exemple d'entraînement : « Le chat dort sur le tapis. »
- Après le début « Le chat dort sur le », le mot « tapis » — ou plus exactement un token de continuation suivant le vocabulaire — est un exemple de suite observée.
- Après de très nombreux exemples et ajustements, les paramètres influencent la distribution des suites possibles.

**Attention :** le modèle ne mémorise pas simplement une grande table avec la « bonne réponse » pour chaque question. Nous n'affirmons pas non plus qu'il n'est jamais capable de mémoriser des passages.

### 2.3 Le terme « inférence »

Lors d'une **inférence**, on exploite un modèle déjà entraîné. Sa sortie dépend de l'entrée, des paramètres appris et des réglages de génération. La procédure ordinaire de génération ne réentraîne pas ses paramètres à chaque token produit.

| Situation | Qu'est-ce qui change ? | Le modèle apprend-il de cet acte ? |
|---|---|---|
| Entraînement | Les paramètres peuvent être modifiés | Oui, selon la procédure d'optimisation |
| Génération d'une réponse | Le texte de contexte s'allonge et les calculs recommencent | Pas par ce seul acte de génération |
| Changer la température | La règle de choix à partir des scores est modifiée | Non |
| Ajouter un extrait dans la question | Le contexte disponible est modifié | Non, pas par cet ajout seul |

**Distinction à faire verbaliser :** « Je donne un nouveau document au modèle » ne signifie pas « je réentraîne le modèle sur ce document ».

---

## 3. Tokens et contexte : ce que le système reçoit

### 3.1 Pourquoi des tokens ?

Un programme n'effectue pas directement un calcul sur une « idée ». Les modèles de langage manipulent une représentation numérique du texte. Une première étape courante consiste à découper le texte en **tokens** selon un vocabulaire et des règles de tokenisation.

Un token peut correspondre à un mot, une partie de mot, un caractère ou un autre segment, selon le tokenizer. **Un token n'est donc pas nécessairement un mot.**

**Exemple purement pédagogique :**

```text
Texte :       chaton
Découpage A : chat | on
Découpage B : ch | at | on
```

Ces deux découpages sont des illustrations fabriquées pour comprendre le principe. **Ce n'est pas le résultat certifié d'un tokenizer de production.** Un tokenizer particulier donne un résultat précis pour le texte et la version considérés.

Dans une application, les tokens sont associés à des identifiants numériques ; le modèle utilise des représentations numériques de ces identifiants. Nous détaillerons ces représentations plus tard.

**Erreur fréquente :** « Le modèle lit d'abord des mots complets, puis les comprend un à un. » Ce n'est pas une description correcte du mécanisme.

### 3.2 Le contexte

Le **contexte** est l'information fournie au modèle pour réaliser une prédiction : notamment les tokens déjà présents dans l'entrée et, au cours de la génération, ceux déjà produits. Dans une application réelle, d'autres éléments peuvent structurer ce contexte.

Comparez :

- « Le chat observe… »
- « Le marin observe… »

On n'attend pas nécessairement la même continuation. Cela illustre qu'une prédiction dépend du texte disponible.

**Précision scientifique :** les deux listes de préférences du laboratoire de LLM Academy sont préparées pour illustrer cet effet. Leur différence ne prouve pas qu'un modèle entraîné ait compris les personnages.

### Vérification de compréhension 2

*Question.* Lorsque je colle un nouveau document dans une conversation, qu'est-ce qui change d'abord : le contexte exploité à l'inférence ou les paramètres entraînés du modèle ?

*Réponse attendue.* Le contexte exploité à l'inférence, pas automatiquement les paramètres du modèle.

---

## 4. Des scores au choix du token suivant

Un modèle de génération produit des **scores** pour les tokens candidats. Selon l'architecture et la stratégie employées, ces scores servent à établir une distribution de probabilités, puis à sélectionner une continuation. Une probabilité de choix **ne doit pas** être interprétée comme une probabilité que l'affirmation soit vraie.

### Exemple résolu sans formule avancée

Imaginons un **mini-système fabriqué**, ayant seulement trois suites possibles après « Le chat regarde la… » :

| Token candidat | Poids fictif | Probabilité après normalisation |
|---|---:|---:|
| lune | 2 | 2 / 10 = 20 % |
| porte | 3 | 3 / 10 = 30 % |
| mer | 5 | 5 / 10 = 50 % |
| **Total** | **10** | **100 %** |

Nous avons choisi les poids 2, 3 et 5 pour pouvoir les vérifier. La **normalisation** consiste ici à diviser chaque poids par leur somme, soit 10.

**Ce calcul est une analogie élémentaire.** Un véritable LLM ne se limite pas à trois candidats ; ses scores ne sont pas nécessairement des poids positifs déjà normalisables ainsi. Les modèles modernes utilisent notamment des logits et des transformations telles que softmax. Ces calculs constituent un approfondissement scientifique **non nécessaire ici**.

### Deux choix possibles

- **Choix du maximum :** toujours sélectionner « mer » avec cette distribution, si la règle ne change pas.
- **Tirage probabiliste :** sélectionner un candidat selon sa probabilité : « mer » est favorisé, mais d'autres continuations restent possibles.

Même dans ce mini-système, le mot favorisé n'est pas automatiquement le mot vrai, pertinent ou souhaitable dans une situation réelle.

**Autre précaution :** une probabilité de 50 % ne signifie pas que cinq choix sur dix donneront forcément « mer » lors d'un petit essai. Sur des essais nombreux et comparables, les fréquences peuvent se rapprocher des probabilités théoriques.

### Vérification de compréhension 3

*Question.* Si l'on remplace les poids [2, 3, 5] par [4, 6, 10], les probabilités changent-elles ?

*Correction.* Non : la somme devient 20 et l'on obtient encore [20 %, 30 %, 50 %]. Multiplier tous les poids par une même valeur positive ne change pas les proportions.

---

## 5. Pourquoi un texte entier peut-il apparaître ?

Jusqu'ici, on a décrit un seul choix. Pour générer un texte, un modèle **autorégressif** recommence à partir du contexte augmenté du token qu'il vient de produire.

**Schéma original, volontairement simplifié :**

```text
Texte initial : « Le chat regarde la »

              [Contexte disponible]
                        |
                        v
             [Scores des suites]
                        |
                        v
              [Sélection d'un token]
                        |
                        v
             [Ajout au texte courant]
                        |
                        v
             [Nouvelle prédiction]
                        |
                        v
         ... jusqu'à la condition d'arrêt
```

Prenons une trace fictive :

1. Entrée initiale : « Le chat regarde la ».
2. Un token de continuation est sélectionné : « lune ».
3. Le contexte devient : « Le chat regarde la lune ».
4. Une nouvelle prédiction permet éventuellement de choisir un signe de ponctuation ou une autre suite.
5. Le processus finit selon une règle d'arrêt ou un nombre maximal de tokens.

**Une réponse qui semble présenter un raisonnement cohérent ne garantit pas que les affirmations qu'elle contient ont été vérifiées.**

**Ce que le schéma ne représente pas :** les représentations vectorielles, les couches de Transformer, le mécanisme d'attention, les caches de calcul, les instructions de plus haut niveau et les mécanismes de sûreté. Le schéma reste exact sur le principe général du choix successif pour la génération causale, mais ne constitue pas une architecture complète.

### Vérification de compréhension 4

*Question.* Pourquoi une seconde prédiction peut-elle différer de la première ?

*Réponse attendue.* Parce que le contexte a changé après l'ajout du premier token. Les scores recalculés peuvent donc être différents.

---

## 6. Manipulations dans LLM Academy — protocole enseignant

Les liens ci-dessous pointent vers les activités **V4 déjà disponibles** sur le site public. Ce document n'ajoute pas encore une nouvelle interface. Avant la classe, vérifier que l'URL publique est accessible et que l'expérience affiche bien les commandes annoncées.

### Manipulation A — Probabilités d'un prochain token (12 minutes)

**Ouvrir :** https://darksathili-jpg.github.io/llm-academy/#/activite/probabilites

1. Lire la situation sans actionner les commandes.
2. Écrire une hypothèse : « Si je diminue le réglage température, la proposition déjà favorisée aura-t-elle davantage ou moins de chances d'être choisie ? »
3. À l'étape « Expérience », conserver le même début de phrase, puis comparer la température 1 à 0,5.
4. Relever **la même barre** avant et après ; ne modifier aucun autre réglage.
5. Expliquer la différence entre la répartition observée et la vérité d'une phrase.

**Résultat attendu :** dans cette simulation, abaisser le réglage rend la distribution plus concentrée sur le candidat le plus favorisé. Les valeurs exactes doivent être **lues dans l'interface**, pas inventées ici.

**Ce que l'expérience démontre :** pour les scores simulés, le paramètre modifie les chances de sélection.

**Ce qu'elle ne démontre pas :** une amélioration de la vérité, une compréhension du monde, un entraînement réel de paramètres.

**Si un élève se trompe :** lui demander de pointer la barre étudiée et de revenir à la différence entre « être choisi » et « être vrai ».

### Manipulation B — Modifier le contexte (10 minutes)

**Ouvrir :** https://darksathili-jpg.github.io/llm-academy/#/activite/contexte

1. Conserver la température 1.
2. Choisir « Le chat observe… », relever la probabilité du candidat « mer ».
3. Choisir « Le marin observe… », relever la même probabilité.
4. Écrire ce qui a changé et ce qui a été conservé.

**Résultat attendu :** la répartition proposée par la simulation varie avec le contexte choisi.

**Limite impérative à verbaliser :** les distributions sont prédéfinies ; l'expérience illustre l'idée de contexte et ne constitue pas à elle seule la preuve d'un apprentissage neuronal.

### Manipulation C — Vérifier une affirmation (12 minutes)

**Ouvrir :** https://darksathili-jpg.github.io/llm-academy/#/activite/credibilite

1. Lire le texte-source sur Nora.
2. Classer « Nora ouvre la fenêtre », puis justifier avec le passage « referme ».
3. Examiner l'affirmation sur l'âge de Nora.
4. Choisir « informations insuffisantes » lorsque l'âge n'est pas précisé.
5. Proposer une quatrième affirmation et indiquer quelle source permettrait de la vérifier.

**Résultat attendu :** l'élève distingue **contredite** de **non documentée**.

**Limite :** la comparaison est effectuée avec un court document fictif fourni. Ce n'est pas un système automatique général de fact-checking.

### Trace commune attendue

Pour chaque manipulation, faire compléter quatre courtes rubriques **dans cet ordre** :

1. **Mon hypothèse :** je prévois…
2. **Ce que j'ai modifié :** uniquement…
3. **Ce que j'ai observé :** la valeur / la barre / l'extrait…
4. **Ce que je peux conclure, et ce que je ne peux pas conclure :** …

Une réponse correcte au QCM, seule, ne suffit pas à valider ces apprentissages.

---

## 7. Prolongement Python NSI — coder une analogie et la délimiter

**Objectif :** utiliser les structures Python déjà connues pour comprendre une normalisation de poids, **sans prétendre implémenter un LLM**.

### Énoncé à donner aux élèves

Écrire une fonction `normaliser` qui reçoit une **liste de nombres de type `int` ou `float`**, tous positifs ou nuls, et qui renvoie la liste des proportions correspondantes. La somme des poids doit être strictement positive.

La fonction doit refuser une liste vide, une liste dont la somme est nulle, ou une liste contenant un poids négatif.

Par exemple :

```python
normaliser([2, 3, 5])  # [0.2, 0.3, 0.5]
```

Pour résoudre le problème, prévoir une boucle bornée, calculer la somme des éléments, puis construire une nouvelle liste par ajouts successifs.

### Aide 1 — décomposer

- Vérifier d'abord que la liste n'est pas vide.
- Parcourir les poids pour détecter une valeur négative et calculer la somme.
- Vérifier que la somme n'est pas nulle.
- Parcourir de nouveau les poids ; ajouter à la liste résultat chaque quotient « poids / somme ».

### Aide 2 — commencer le programme

```python
def normaliser(poids):
    if len(poids) == 0:
        raise ValueError("Liste vide interdite")
    somme = 0
    for valeur in poids:
        # À compléter : refus des poids négatifs et accumulation.
        pass
    # À compléter : somme nulle et construction du résultat.
```

### Corrigé intégral, avec raisons des instructions

```python
def normaliser(poids):
    """Renvoie les proportions associées à des poids non négatifs."""
    if len(poids) == 0:
        raise ValueError("Liste vide interdite")

    somme = 0
    for valeur in poids:
        if valeur < 0:
            raise ValueError("Un poids est négatif")
        somme = somme + valeur

    if somme == 0:
        raise ValueError("La somme est nulle")

    proportions = []
    for valeur in poids:
        proportions.append(valeur / somme)
    return proportions


assert normaliser([2, 3, 5]) == [0.2, 0.3, 0.5]
assert normaliser([0, 5]) == [0.0, 1.0]

try:
    normaliser([2, -1])
except ValueError:
    pass
else:
    raise AssertionError("Le poids négatif aurait dû être refusé")

try:
    normaliser([0, 0])
except ValueError:
    pass
else:
    raise AssertionError("La somme nulle aurait dû être refusée")

print("Quatre vérifications réussies")
```

**Explication de l'algorithme :**

- `somme` est une variable de type entier dans le parcours `[2, 3, 5]`. À chaque itération, on **affecte une nouvelle valeur** à cette variable.
- Les deux boucles `for` sont des **boucles bornées** : elles parcourent chacune la liste fournie.
- La première boucle vérifie les données et construit la somme ; la seconde remplit la liste `proportions`.
- `raise ValueError` signale une entrée qui ne satisfait pas les conditions précisées par l'énoncé.
- Les instructions `assert` vérifient ici plusieurs cas définis, mais **ne constituent pas une démonstration de correction pour toutes les entrées**.

**Transfert :** tester `[4, 6, 10]`. Expliquer pourquoi les résultats sont les mêmes qu'avec `[2, 3, 5]`. Proposer un autre cas limite, puis vérifier si la fonction se comporte comme prévu.

**Limite scientifique explicite :** cette fonction n'implémente ni les logits, ni la fonction softmax, ni les couches d'un Transformer, ni la génération de texte. Elle est une **analogie arithmétique** de la construction de proportions à partir de poids valides. Le laboratoire visuel peut employer un calcul différent.

---

## 8. L'enseignant se teste : évaluation indépendante

**Consigne :** répondre sans consulter les sections précédentes, puis comparer au corrigé. Les questions de transfert demandent de rédiger une justification, pas seulement de cocher une option.

**Q1.** Un token est-il toujours un mot ? Citer un contre-exemple possible.

**Q2.** Quand on colle un document dans une question, le modèle est-il nécessairement réentraîné ?

**Q3.** On a trois poids fictifs : 1, 1 et 2. Quelles sont les proportions obtenues après normalisation ?

**Q4.** Un token reçoit une probabilité de choix de 80 %. Peut-on conclure que la proposition est vraie à 80 % ?

**Q5.** Une sortie bien rédigée contredit explicitement une source fiable et pertinente. Que faut-il en conclure sur cette sortie, dans ce cas ?

**Q6.** Une source ne mentionne pas un événement ; un assistant affirme que l'événement s'est produit. Le silence de la source suffit-il à prouver que l'affirmation est fausse ?

**Q7.** Expliquer en deux phrases ce que signifie « génération autorégressive ».

**Q8 — Transfert.** Un collègue dit : « J'ai changé la température et la réponse est différente ; le modèle a appris. » Répondre et proposer une expérience qui pourrait départager les interprétations.

**Q9 — Transfert enseignant.** Un élève dit : « Si l'ordinateur choisit un mot probable, c'est qu'il sait ce qui est vrai. » Construire une intervention pédagogique de deux minutes, avec un exemple et une question à lui poser.

### Corrigé argumenté

**R1.** Non. Selon le tokenizer, un mot peut être découpé en plusieurs fragments, ou un token peut inclure d'autres signes. Ne pas attribuer un découpage imaginaire à un tokenizer précis.

**R2.** Non. Le document modifie d'abord le contexte d'inférence. Modifier les paramètres du modèle suppose une autre procédure, telle qu'un entraînement ou un ajustement.

**R3.** Somme 4 ; proportions 1/4, 1/4 et 2/4, soit **25 %, 25 %, 50 %**.

**R4.** Non. La probabilité de sélection d'un token n'est pas une mesure de vérité d'une proposition. La phrase complète peut être vraie, fausse ou non vérifiable.

**R5.** La sortie est contredite par la source ; vérifier que la source porte sur les mêmes faits et reste digne de confiance avant de généraliser.

**R6.** Non. Le silence de cette source signifie seulement que la preuve manque dans ce document. Chercher une source pertinente supplémentaire.

**R7.** Un modèle sélectionne une continuation à partir des tokens disponibles. Il ajoute le token produit au contexte, puis recommence jusqu'à une condition d'arrêt.

**R8.** Changer un réglage de sélection n'ajuste pas automatiquement les paramètres entraînés. Avec le même contexte, comparer deux tirages sous un réglage contrôlé, et recommencer dans les mêmes conditions ; on observe le choix de sortie, pas une preuve d'apprentissage.

**R9.** Présenter un texte-source « La médiathèque est fermée le lundi » et une réponse assurée « Elle ouvre le lundi ». Demander : « Quelle partie du document autorise ou contredit cette conclusion ? » Faire distinguer fluidité, probabilité d'une continuation et fiabilité documentaire.

### Grille de validation humaine

| Critère | Acquis dans la réponse si… | À reprendre si… |
|---|---|---|
| Vocabulaire | Token, contexte et inférence sont correctement distingués | Le token est présenté comme un mot entier dans tous les cas |
| Mécanisme | La génération est décrite comme une suite de prédictions dépendant du contexte | La réponse est présentée comme rédigée d'un seul coup par le modèle causal |
| Mathématiques élémentaires | Les proportions et leur somme sont justifiées | Les pourcentages sont pris pour des niveaux de vérité |
| Vérification | Contradiction et absence d'information sont distinguées | Une absence de mention est qualifiée automatiquement de fausseté |
| Transfert enseignant | Une remédiation concrète, vérifiable et compréhensible est proposée | La réponse se limite à « l'IA hallucine parfois » |
| Limites | La simulation et le modèle réel ne sont pas confondus | Les poids fictifs sont présentés comme des paramètres appris |

**Décision pédagogique :** l'enseignant peut animer une première séance lorsque les six critères sont effectivement démontrés dans ses réponses ou une simulation orale. Ce verdict relève d'une personne ; aucun score automatique de texte libre n'est autorisé.

---

## 9. Prêt à enseigner : séance de 55 minutes

La séance ne cherche pas à faire apprendre toute la théorie de ce module en une heure. Elle s'appuie sur trois idées seulement : **une continuation est choisie ; le contexte influence le choix ; une phrase plausible doit pouvoir être vérifiée**.

| Temps proposé | Activité | Action visible de l'élève | Intervention attendue |
|---|---|---|---|
| 0–5 min | Réponse crédible, document contradictoire | S'engager sur vrai / faux / indécidable | Faire chercher un extrait plutôt qu'un ton |
| 5–12 min | Définir token et contexte avec « Le chat… » | Expliquer le vocabulaire avec ses mots | Refuser les notions non définies |
| 12–25 min | Expérience probabilités | Hypothèse, changement d'un paramètre, observation | Distinguer « choisi » et « vrai » |
| 25–35 min | Expérience contexte | Comparer chat et marin à réglages constants | Rappeler les préférences préparées |
| 35–47 min | Expérience crédibilité | Étayé, contredit, non documenté avec preuve | Remédier à la confusion absence / contradiction |
| 47–55 min | Transfert écrit | Deux phrases : mécanisme + limite, puis un exemple inédit | Relire les justifications, pas seulement les réponses |

**Prérequis de séance :** vérifier l'accès au site, préparer un document papier de repli, projeter les commandes en taille lisible, garder les fiches corrigées côté enseignant. Le prolongement Python peut prendre une séance distincte, afin de ne pas surcharger cette introduction.

### Que faire si un élève reste bloqué ?

1. **Il confond token et mot.** Revenir au découpage fictif « chat | on » ; demander combien de fragments sont visibles.
2. **Il confond probabilité et vérité.** Faire confronter une phrase assurée au document sur la médiathèque.
3. **Il pense que changer la température entraîne le modèle.** Revenir au tableau « entraînement / inférence / réglage ».
4. **Il ne comprend pas la barre affichée.** Lui demander d'abord de nommer le mot associé, puis de comparer une seule valeur.
5. **Il dit « faux » dès que le texte est silencieux.** Demander : « Quel passage dit le contraire ? » ; s'il n'en trouve aucun, formuler « informations insuffisantes ».

### Ce qui doit rester hors de cette première séance

Pas de softmax, de dérivées, de produit matriciel, de Q/K/V, de cache KV ni d'optimisation par gradient. Ces termes apparaîtront uniquement dans la formation approfondie pour les enseignants qui le souhaitent, et **après** les mécanismes intuitifs correspondants.

---

## 10. Ce que ce module ne démontre pas

- Un petit laboratoire probabiliste avec des scores choisis à l'avance n'est pas un LLM entraîné.
- Le comptage de paires de caractères n'est pas à lui seul un tokenizer complet.
- La prédiction du token suivant n'est pas une théorie exhaustive de toutes les capacités de tous les modèles.
- L'inférence d'un modèle ne garantit ni l'exactitude des réponses ni l'absence de biais. La confidentialité des données dépend également de l'application et de ses conditions d'utilisation.
- Une source citée n'est pas automatiquement une source fiable ; il faut en vérifier l'identité, la pertinence et le contenu.
- Un exercice réussi en Python ou un QCM correct ne prouve pas à lui seul qu'un élève sait réutiliser la notion.
- Les temps et les remédiations de ce module n'ont pas encore été validés par des essais réels en classe.

---

## 11. Références consultables et hiérarchie des affirmations

**Programme scolaire (référence normative pour la NSI) :**

- Éduscol, *Programmes et ressources en numérique et sciences informatiques — voie générale* : https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g
- Ministère, *Épreuve terminale NSI à partir de la session 2027* (note de service du 11 septembre 2026, portant sur l'épreuve et non sur une prétendue obligation d'enseigner les LLM) : https://www.education.gouv.fr/bo/2026/Special4/MENE2622643N

**Références scientifiques (pour l'enseignant ; les élèves n'ont pas à les lire avant l'activité) :**

- Vaswani et al., *Attention Is All You Need* (2017) : https://arxiv.org/abs/1706.03762 — architecture Transformer originale, **encodeur-décodeur**, et non une description identique de toutes les familles GPT.
- Hugging Face, *LLM Course : How Transformers solve tasks* : https://huggingface.co/learn/llm-course/chapter1/5 — distinction des familles de modèles, dont les modèles causaux utilisés en génération.
- Hugging Face, *LLM Course : Text generation inference* : https://huggingface.co/learn/llm-course/chapter1/8 — principe de génération token après token.

Ces références servent à distinguer une analogie pédagogique des mécanismes documentés ; les exemples sur la médiathèque et les poids [2, 3, 5] sont **originaux et fictifs**.

---

## 12. Contrôle de qualité avant intégration dans le site

**Relecture scientifique :** vérifier la distinction entre token, mot, score et probabilité ; distinguer entraînement/inférence ; nommer la limite du modèle réduit à chaque expérience ; ne pas généraliser abusivement la génération causale à toutes les architectures.

**Relecture pédagogique :** tester la lecture sans connaissance préalable des LLM ; relever chaque mot nouveau utilisé avant définition ; vérifier qu'il existe un exemple et un contre-exemple ; faire réaliser les quatre questions de compréhension avant de dévoiler les corrections.

**Relecture NSI :** vérifier la terminologie « affecter une valeur à une variable », « boucle bornée », « instruction », « variable de type entier » ; ne pas faire passer un prolongement mathématique pour un attendu du BO.

**Relecture utilisateur :** un enseignant réellement novice réalise seul les manipulations A, B et C, rédige les réponses R7–R9, puis explique une activité en deux minutes sans recourir au corrigé. Documenter les blocages observés. **Ne pas déclarer ce module « validé pédagogiquement » avant cette épreuve.**
