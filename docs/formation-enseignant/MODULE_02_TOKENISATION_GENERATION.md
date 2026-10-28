# Parcours enseignant NSI — Module 2
## Tokenisation et génération : comment une suite de texte est-elle construite ?

**Version de travail V5 — 28 octobre 2026.** Cours destiné à un professeur de NSI débutant sur les LLM. **Prérequis :** module 1, chaînes de caractères, indices et boucles bornées Python. **Durée personnelle estimée :** 75 à 100 minutes. **Séance élève proposée :** 55 minutes, après préparation. Le contenu n'est pas encore validé par des enseignants novices.

### Ce que le professeur saura expliquer après ce module

1. Distinguer **texte**, **token**, **identifiant de token** et **vocabulaire**.
2. Expliquer avec un exemple la fréquence d'une paire de caractères puis sa fusion.
3. Distinguer l'**apprentissage d'un vocabulaire** et l'**encodage d'un nouveau texte** avec des règles de tokenisation déjà fixées.
4. Distinguer vingt tirages indépendants du **même** token d'une génération **autorégressive** qui enrichit son contexte.
5. Expliquer les effets de **graine**, **température** et **top-k**, sans les présenter comme des preuves de vérité.
6. Construire un exercice Python reposant sur une boucle bornée et en identifier les limites scientifiques.

---

## 1. Revenir à une situation concrète

Deux personnes écrivent le même mot « chaton ». Un programme peut le segmenter en « chat » + « on » ; un autre peut le segmenter en « ch » + « at » + « on ». Cela ne veut pas dire que le sens du mot a changé : **la représentation interne dépend du tokenizer utilisé**.

**Question initiale :** pourquoi ne pas considérer nécessairement chaque mot comme une unité indivisible ?

Un vocabulaire limité ne peut pas comporter confortablement toutes les variantes de mots, graphies, erreurs, noms propres et mélanges de langues. Des unités plus petites peuvent aider à représenter des formes jamais rencontrées exactement sous forme de mot complet. Ce choix comporte des compromis et ne prouve aucune compréhension sémantique.

**Termes à définir avant toute manipulation :**

- **Token :** unité produite par une règle de segmentation pour être traitée par le modèle.
- **Tokenizer :** procédé et ressources qui transforment du texte en séquence de tokens, et inversement selon les capacités du tokenizer.
- **Vocabulaire :** ensemble des unités reconnues, avec leurs identifiants.
- **Identifiant de token :** nombre servant à représenter un token dans une séquence.
- **Corpus :** ensemble de textes utilisé pour une étude ou un apprentissage ; ici, il sera minuscule.

**Ne jamais dire :** « Tous les tokenizers découpent les mots au même endroit. » Ne pas considérer non plus le nombre de caractères comme égal au nombre de tokens.

---

## 2. Le principe d'une fusion de paires

Le cours introduit un **principe de type BPE** : on part d'unités élémentaires, on mesure des fréquences, puis on apprend des règles permettant de fusionner certains couples fréquemment adjacents.

### Exemple résolu, faisable au tableau

Corpus fictif : « maman ».

Séquence initiale de caractères : \`m | a | m | a | n\`.

| Paires adjacentes | Nombre d'occurrences |
|---|---:|
| (« m », « a ») | 2 |
| (« a », « m ») | 1 |
| (« a », « n ») | 1 |

La paire (« m », « a ») est la plus fréquente. Si la règle autorise sa fusion, on obtient :

\`ma | ma | n\`.

Le nombre d'unités passe de 5 à 3. Ce résultat dépend du corpus et de la règle sélectionnée. Une implémentation réelle peut inclure des contraintes et des conventions supplémentaires.

### Cas limite important : le chevauchement

Pour « aaa », il existe deux occurrences adjacentes de la paire (« a », « a ») : caractères aux positions (0,1) et (1,2). Cependant, ces occurrences **se chevauchent**. On ne peut pas les remplacer simultanément toutes les deux par deux unités indépendantes, puisqu'elles réutiliseraient le caractère central.

**Conclusion pédagogique :** compter les paires n'est pas identique à exécuter un algorithme complet de fusion. L'exercice Python ci-dessous **compte**, mais ne prétend pas reproduire toutes les règles BPE.

### Ce que le BPE scolaire simplifie

Certaines variantes de BPE sont fondées sur des octets plutôt que sur des caractères Unicode pris isolément. Les espaces, accents, signes spéciaux et règles de pré-tokenisation peuvent modifier les résultats. Aucun exemple de cette page n'est présenté comme une transcription fidèle du tokenizer d'un service commercial.

**Sources :** Sennrich, Haddow et Birch, *Neural Machine Translation of Rare Words with Subword Units* (2016), https://arxiv.org/abs/1508.07909 ; Hugging Face, chapitre sur BPE : https://huggingface.co/learn/llm-course/chapter6/5.

---

## 3. Apprendre les règles et les appliquer : deux opérations différentes

**Apprentissage du vocabulaire :** on parcourt un corpus d'apprentissage, on collecte les fréquences et on apprend une suite de règles de fusion.

**Encodage du texte :** on prend une nouvelle chaîne et on la segmente à l'aide de règles et d'un vocabulaire **déjà établis**.

Un modèle de langage utilise généralement des séquences produites par un tokenizer déterminé. Si l'on change ce tokenizer, les identifiants et le lien avec les représentations apprises ne sont pas automatiquement compatibles.

**Contre-exemple utile :** « Si je colle une nouvelle phrase dans un champ de l'application, je réentraîne le vocabulaire de tous les LLM. » Faux. Le texte est traité selon les règles de l'application ou du tokenizer en question ; il n'y a pas nécessairement apprentissage.

**Question de transfert :** peut-on comparer honnêtement la longueur en tokens de deux textes sans préciser le tokenizer utilisé ? **Non**, pas si l'on attend une valeur universelle exacte.

---

## 4. Une limite de contexte se mesure en tokens

Un modèle et une application disposent de limites de contexte qui dépendent de leur conception et de leurs conditions d'exécution. Ces limites concernent les **tokens**, pas directement un nombre universel de mots ou de pages.

**Exercice de budget abstrait :** dans une expérience fictive autorisant au maximum 20 tokens pour l'ensemble d'un échange, si 12 tokens sont déjà occupés par l'entrée et que cette limite vaut aussi pour la sortie, au plus 8 tokens supplémentaires peuvent être produits dans ce budget simplifié.

**Correction :** 20 − 12 = 8.

**Attention :** les systèmes réels peuvent ajouter des messages ou tokens techniques, appliquer des limites distinctes et utiliser d'autres contraintes. Ce calcul n'est pas une prédiction de la capacité d'un produit commercial.

---

## 5. Générer un texte : ce qui change d'une étape à la suivante

Au module 1, le modèle calculait des scores sur des continuations. Pour générer un texte **autorégressif**, il procède de nouveau à partir d'un contexte contenant la sortie précédente.

Exemple inventé :

\`\`\`text
Contexte de départ : Le chat
Prédiction 1       : dort
Nouveau contexte   : Le chat dort
Prédiction 2       : ici
Nouveau contexte   : Le chat dort ici
Prédiction 3       : .
Texte final        : Le chat dort ici.
\`\`\`

Cette trace sert uniquement à voir la **réinjection de la sortie dans le contexte**. Elle ne donne pas les scores d'un réseau et ne constitue pas une sortie vérifiée d'un modèle réel.

### Ne pas confondre avec vingt tirages indépendants

Dans le laboratoire « Génération » de LLM Academy, on peut effectuer **vingt tirages** avec les mêmes réglages et la même distribution de candidats. Cela permet de comparer des distributions et de constater la reproductibilité d'une séquence pseudoaléatoire fixée.

Ces tirages n'enrichissent pas nécessairement le contexte après chaque résultat. **Ils ne constituent donc pas à eux seuls une phrase générée de manière autorégressive.**

C'est une différence essentielle à faire relever par l'enseignant avant l'animation.

---

## 6. Trois commandes à présenter avec prudence

### Graine

Un générateur pseudoaléatoire déterministe peut produire les mêmes tirages lorsqu'on repart de la **même graine**, avec le même algorithme et les mêmes conditions. Cela aide à comparer deux essais dans une simulation.

La graine n'est ni une connaissance, ni une preuve de véracité.

### Température

Dans beaucoup de stratégies de génération, la **température** modifie la concentration de la distribution de choix. Une température plus basse peut favoriser davantage les candidats déjà privilégiés.

La définition exacte dépend de la transformation des scores ; une température n'est pas un niveau de compréhension ni de véracité.

### Top-k

Le **top-k** conserve au plus un certain nombre \`k\` de candidats parmi ceux ayant les scores les plus élevés, avant le choix final selon la stratégie utilisée.

Avec top-k égal à 1, un seul candidat est conservé (hors conventions particulières de scores ex æquo). Cela n'entraîne pas le modèle.

**Erreur pédagogique fréquente :** « top-k 1 donne forcément la bonne réponse ». Faux : le candidat le mieux classé peut être erroné.

---

## 7. Deux manipulations guidées dans LLM Academy

### A. Apprendre à observer une fusion (15 min)

Adresse : https://darksathili-jpg.github.io/llm-academy/#/activite/tokens

1. Dans le laboratoire de découpage, garder le corpus proposé « la la lala ».
2. **Avant** le clic, compter les unités présentées et annoncer une prédiction.
3. Déclencher **une seule** fusion. Relever la paire sélectionnée et le nombre de morceaux.
4. Comparer avec la prédiction : le nombre a-t-il diminué ?
5. Recommencer avec « école école ». Noter que le résultat n'est pas nécessairement celui d'un tokenizer de production.

**Trace requise :** corpus initial, comptage initial, règle appliquée, comptage final, conclusion.

**Limite :** le laboratoire de départ simplifie le BPE en partant de caractères ; les différences de vocabulaire rendent impossible une règle universelle de segmentation.

**Remédiation :** si l'élève affirme « le nombre de mots a baissé », lui faire entourer les mots séparés par des espaces puis les unités internes : deux comptages différents.

### B. Comparer des tirages contrôlés (15 min)

Adresse : https://darksathili-jpg.github.io/llm-academy/#/activite/generation

1. Garder graine 7, température 1 et top-k désactivé.
2. Lancer deux séries de vingt tirages et comparer les résultats **dans la simulation**.
3. Modifier uniquement top-k pour conserver un seul candidat.
4. Décrire le nombre de candidats différents obtenus.
5. Répondre à : « A-t-on construit une phrase complète ? »

**Trace requise :** réglages, résultat de chaque expérience, seule variable modifiée, conclusion et limite.

**Résultats attendus :** les séries reproduites avec la même graine et les mêmes conditions sont identiques ; avec un seul candidat retenu, les résultats sont identiques entre eux dans cette simulation. Il s'agit de choix de candidats, pas d'une démonstration de vérité.

---

## 8. Prolongement Python : compter des paires dans une chaîne

### Consigne Terminale NSI

Écrire la fonction \`compter_paires\` qui reçoit une chaîne de caractères et renvoie un **dictionnaire** associant chaque couple de caractères adjacents à son nombre d'occurrences.

Une paire est représentée par un **tuple de deux caractères**. Les paires qui se chevauchent doivent être comptées.

**Données d'essai :**
- \`"maman"\` doit produire les effectifs 2 pour \`("m", "a")\`, 1 pour \`("a", "m")\`, 1 pour \`("a", "n")\`.
- \`"aaa"\` doit produire 2 pour \`("a", "a")\`.
- Une chaîne vide produit un dictionnaire vide.

### Première aide

Parcourir les valeurs de l'indice \`i\` de 0 à \`len(texte) - 2\`. L'instruction \`texte[i]\` donne le premier caractère de la paire et \`texte[i + 1]\` le suivant.

### Seconde aide

Pour une paire déjà présente dans le dictionnaire, **affecter une valeur supérieure de 1** à l'effectif associé. Sinon, affecter la valeur 1.

### Correction intégrale

\`\`\`python
def compter_paires(texte):
    """Compte les paires de caractères adjacents."""
    effectifs = {}
    for i in range(len(texte) - 1):
        paire = (texte[i], texte[i + 1])
        if paire in effectifs:
            effectifs[paire] = effectifs[paire] + 1
        else:
            effectifs[paire] = 1
    return effectifs


assert compter_paires("maman") == {
    ("m", "a"): 2,
    ("a", "m"): 1,
    ("a", "n"): 1,
}
assert compter_paires("aaa") == {("a", "a"): 2}
assert compter_paires("") == {}
assert compter_paires("a") == {}
print("Quatre tests réussis")
\`\`\`

**Pourquoi la boucle est bornée :** le nombre de passages dépend de la longueur de la chaîne reçue, qui est finie. Dans cet algorithme, \`range(len(texte) - 1)\` évite de lire un caractère après la fin de la chaîne.

**Cas limite :** pour « aaa », les paires aux positions (0,1) et (1,2) sont toutes deux comptées. Cela ne signifie pas que deux fusions simultanées sont possibles.

**Transfert :** modifier la fonction pour recevoir une **liste de chaînes** et cumuler les effectifs de paires de chacune, sans créer artificiellement de paire entre le dernier caractère d'une chaîne et le premier de la suivante.

**Limite scientifique :** le comptage d'occurrences n'est pas une implémentation complète de BPE et ne représente pas l'architecture d'un LLM.

---

## 9. Évaluation de l'enseignant, sans aide

**Q1.** Pourquoi « un token = un mot » est-il une explication insuffisante ?

**Q2.** Pour « maman », quelle paire est la plus fréquente ? Que donne sa fusion dans notre exemple ?

**Q3.** Pourquoi peut-on compter deux occurrences de (« a », « a ») dans « aaa » sans pouvoir effectuer deux fusions indépendantes ?

**Q4.** L'encodage d'une nouvelle phrase réentraîne-t-il automatiquement les règles du tokenizer ?

**Q5.** Quel est le rôle d'une graine dans une simulation pseudoaléatoire déterministe ?

**Q6.** Comment distinguer les vingt tirages de la simulation de la création d'une phrase par un modèle causal ?

**Q7.** Quel paramètre changer pour limiter la distribution aux trois candidats les mieux classés, sans modifier leurs paramètres d'entraînement ?

**Q8 — Transfert.** On donne deux textes et deux tokenizers. Que faut-il fixer pour comparer équitablement les résultats de découpage ?

**Q9 — Transfert pédagogique.** Concevoir un contre-exemple simple permettant de distinguer « fréquence d'une paire » de « nombre de fusions possibles ».

### Corrections attendues

1. Selon le tokenizer, un token peut être un fragment, un caractère, un mot ou d'autres unités.
2. (« m », « a »), deux occurrences ; « ma | ma | n » dans la règle illustrative.
3. Les occurrences se chevauchent sur le caractère central ; deux fusions indépendantes se disputeraient cette unité.
4. Non. L'encodage emploie des règles fixées, sauf mécanisme supplémentaire d'apprentissage explicitement déclenché.
5. Elle permet de retrouver des suites identiques si l'algorithme et les conditions restent les mêmes ; elle ne garantit pas la vérité.
6. Les vingt tirages indépendants utilisent la même situation de départ ; une génération causale augmente le contexte après chaque token.
7. Top-k réglé à 3 ; il s'agit d'une restriction de candidats à la sortie.
8. Fixer notamment le tokenizer, sa version, les conventions de découpage et la chaîne exacte de caractères.
9. « aaa » : deux occurrences chevauchantes de (« a », « a »), mais pas deux fusions indépendantes réalisables simultanément.

**Acceptation humaine :** expliquer correctement Q3 et Q6 est indispensable. Un enseignant qui les confond risquerait de transmettre deux contresens techniques en classe.

---

## 10. Scénario élève de 55 minutes

| Temps indicatif | Action | Preuve demandée |
|---|---|---|
| 0–6 min | Prévision de la segmentation de « maman » | Proposition personnelle |
| 6–16 min | Décomposition, comptage et fusion au tableau | Tableau des paires |
| 16–28 min | Laboratoire Tokens | Avant/après et limite |
| 28–38 min | Comparer génération autorégressive et vingt tirages | Deux schémas différents |
| 38–49 min | Laboratoire Génération, graine puis top-k | Une variable modifiée |
| 49–55 min | Transfert avec « aaa » ou nouveau corpus | Justification de l'absence de fusion double |

Le programme Python constitue une activité **supplémentaire**, pas une obligation ajoutée à ces 55 minutes. Ne pas annoncer de durée mesurée tant qu'une classe n'a pas été observée.

### Signaux d'alerte à observer

- L'élève parle uniquement de « mots » alors qu'il compare des morceaux de mots.
- Il prétend que le système « apprend » en changeant top-k.
- Il explique la reproductibilité par « l'IA sait déjà la réponse ».
- Il confond les vingt tirages avec une phrase générée.
- Il applique les effectifs de « maman » comme s'ils constituaient une règle universelle pour tous les corpus.

**Question finale :** « Ce laboratoire est-il un LLM ? » Réponse : non ; ces expériences illustrent des opérations particulières avec des modèles réduits et des distributions choisies.

---

## Contrôle de qualité avant intégration

- Refaire indépendamment le tableau des paires de « maman » et le cas « aaa ».
- Exécuter les quatre tests Python et ajouter au moins deux cas nouveaux.
- Observer un enseignant novice expliquer la différence entre **compter**, **fusionner** et **encoder avec un vocabulaire figé**.
- Vérifier les libellés des commandes sur la version réellement publiée ; une modification de l'interface peut rendre un protocole obsolète.
- Ne pas publier ce cours comme « validé » avant un retour réel de formation.

**Références principales :** Sennrich et al. (2016), https://arxiv.org/abs/1508.07909 ; Hugging Face, BPE, https://huggingface.co/learn/llm-course/chapter6/5 ; Hugging Face, génération de texte, https://huggingface.co/learn/llm-course/chapter1/8 ; programme NSI, https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g.
