# Parcours enseignant NSI — Module 3

## Comment un modèle apprend-il, et comment vérifier ses progrès ?

**Version de travail V5 — 28 octobre 2026.** Formation destinée à un professeur de NSI qui ne connaît pas encore l'apprentissage des modèles de langage. Les modules 1 et 2 sont recommandés avant cette lecture. **Durée personnelle indicative :** 90 à 120 minutes. **Transposition en classe :** une séance de 55 minutes, distincte du prolongement Python. Ces durées ne résultent pas encore d'une observation de classe.

### Problème de départ

Un programme obtient un très bon résultat sur les exemples qu'il a déjà rencontrés. Pouvons-nous en conclure qu'il réussira aussi sur des exemples nouveaux ?

**Non.** Nous devons distinguer ce qu'il a appris sur les données utilisées pour ajuster ses paramètres et ce qu'il parvient à faire sur des données qu'il n'a pas utilisées pour cet ajustement.

### Objectifs observables

À la fin de ce module, le professeur doit pouvoir :

1. définir les termes **donnée d'entraînement**, **prédiction**, **paramètre**, **perte**, **optimisation** et **validation** ;
2. raconter, dans l'ordre, les opérations d'un cycle élémentaire d'entraînement ;
3. expliquer pourquoi la diminution d'une perte d'entraînement ne garantit ni la généralisation ni la vérité des réponses ;
4. distinguer **surapprentissage**, **mémorisation d'exemples** et **généralisation** sans supposer que ces phénomènes sont identiques ;
5. construire une comparaison correcte entre exemples utilisés pour l'entraînement et exemples réservés à l'évaluation ;
6. réaliser une manipulation dans LLM Academy, puis en préciser les limites scientifiques ;
7. analyser des prédictions avec une fonction Python et des cas de test, sans prétendre programmer un véritable LLM.

### Prérequis

Pour suivre le cours : lire un tableau de nombres, comparer deux valeurs, calculer une proportion et comprendre qu'une même opération peut être répétée.

Pour le prolongement Python : utiliser une liste, accéder à un élément par son indice, écrire une fonction, employer une instruction conditionnelle et une **boucle bornée**. Aucun calcul de dérivée ni aucune algèbre linéaire n'est exigé dans le parcours initial.

---

## 1. Observer une amélioration ne suffit pas

Imaginons que nous demandions à un programme de reconnaître si des phrases contiennent le mot « chat ». Ce programme est une **analogie pédagogique** ; ce n'est pas une expérience reproduisant l'entraînement d'un LLM.

L'enseignant constitue deux ensembles de phrases :

- **Ensemble d'entraînement :** les exemples dont les réponses peuvent servir à modifier le programme ou les paramètres du modèle.
- **Ensemble de validation :** d'autres exemples, non employés pour ces modifications, qui servent à apprécier le comportement du système au cours de sa mise au point.

Au début, le système se trompe sur plusieurs exemples d'entraînement. Après quelques essais, il se trompe moins souvent sur les mêmes exemples.

**Question à poser avant toute définition :** s'est-il réellement amélioré pour reconnaître des phrases qu'il n'a jamais rencontrées ?

**Réponse argumentée :** nous ne pouvons pas le savoir à partir des seuls exemples d'entraînement. Il faut observer les résultats sur un ensemble distinct.

**Vigilance :** une phrase figurant dans l'ensemble de validation ne doit pas servir à ajuster les paramètres pendant cette expérience. Une fois les choix de conception arrêtés, une évaluation finale crédible nécessite idéalement un **ensemble de test distinct**, non utilisé pour décider quels réglages conserver. Ne pas appeler « test final indépendant » un ensemble consulté à chaque itération.

### Exemple numérique résolu

Les pourcentages suivants sont **inventés pour expliquer le raisonnement**. Ils ne proviennent pas d'un modèle entraîné dans le laboratoire.

| État du système              | Erreur sur entraînement | Erreur sur validation |
| ---------------------------- | ----------------------: | --------------------: |
| Avant les ajustements        |                    40 % |                  42 % |
| Après plusieurs ajustements  |                    10 % |                  18 % |
| Après beaucoup d'ajustements |                     2 % |                  35 % |

**Lecture guidée :**

1. Entre la première et la deuxième ligne, les erreurs diminuent sur les deux ensembles.
2. Entre la deuxième et la troisième, l'erreur d'entraînement continue de diminuer.
3. Mais l'erreur de validation augmente de 18 % à 35 %.
4. Nous avons donc un **signal possible de surapprentissage** : les ajustements favorisent les exemples vus, tandis que les performances sur les exemples distincts se dégradent.
5. Ce tableau ne suffit pas à établir la cause précise ni l'efficacité future sur toutes les situations. Il indique simplement que la performance d'entraînement ne mesure pas à elle seule la généralisation.

**Question de contrôle :** quel état choisiriez-vous si le critère retenu est la plus faible erreur de validation parmi ces trois essais ? **Le deuxième**, avec 18 % ; le troisième n'est pas préférable sur ce critère.

---

## 2. Que signifie « entraîner » un modèle ?

### 2.1 Les paramètres et les prédictions

Un modèle possède des **paramètres numériques**. Ces valeurs influencent ses calculs et donc ses prédictions. Lors de l'entraînement, une procédure d'optimisation peut les modifier pour améliorer le résultat selon un objectif défini.

Pour un modèle de langage **causal**, un objectif courant consiste à prédire le token suivant à partir des tokens précédents. Il existe d'autres objectifs d'entraînement pour d'autres familles de modèles.

**Exemple textuel :** après « Le chat dort sur le », le texte de référence contient « tapis ». Le modèle calcule des scores pour les suites possibles ; l'entraînement mesure ensuite l'écart entre ses prédictions et l'objectif défini.

Il est essentiel de ne pas confondre :

- **L'exemple cible :** ce que les données présentent comme continuation attendue pour cet exemple.
- **La prédiction du modèle :** sa sortie calculée à cette étape.
- **La vérité d'une affirmation :** question différente, qui exige des connaissances et des vérifications adaptées.

Une continuation présente dans les données d'entraînement n'est pas automatiquement une proposition factuelle vérifiée.

### 2.2 La fonction de perte

Une **fonction de perte** attribue une valeur numérique à un écart entre les sorties du modèle et les objectifs d'apprentissage, selon une convention précise.

La perte n'est pas la même chose que le pourcentage d'affirmations fausses. Dans des modèles de langage, une fonction courante mesure à quel point les distributions prédites correspondent aux tokens cibles. Sa définition mathématique détaillée peut être étudiée ultérieurement ; nous n'en faisons pas un prérequis de Terminale NSI.

**Analogie explicite, et non description d'une perte de LLM :**

Un système prédit la valeur 7 lorsque la valeur attendue est 5. Nous choisissons comme perte simplifiée le carré de la différence :

- écart : 7 − 5 = 2 ;
- perte : 2 × 2 = 4.

Si, après une modification, le système prédit 6 :

- écart : 6 − 5 = 1 ;
- perte : 1 × 1 = 1.

La perte choisie a diminué de 4 à 1. Cela signifie seulement que la prédiction se rapproche de la cible **selon notre mesure**.

**Ne pas affirmer :** « Une perte égale à 1 signifie 1 % d'erreur. » Les unités et les interprétations d'une perte dépendent de sa définition.

### 2.3 Le cycle élémentaire d'entraînement

Le schéma suivant est volontairement simplifié :

1. Sélectionner un ensemble d'exemples d'entraînement.
2. Calculer des prédictions avec les paramètres actuels.
3. Mesurer la perte selon l'objectif choisi.
4. Utiliser une procédure d'optimisation pour déterminer des ajustements.
5. Mettre à jour les paramètres.
6. Recommencer sur d'autres exemples ou lots d'exemples.
7. Mesurer périodiquement une performance sur des données de validation distinctes.

Dans un réseau neuronal, ces ajustements s'appuient notamment sur des gradients. **Un gradient n'est pas une notion que les élèves doivent maîtriser pour cette séance d'introduction.** Le module enseignant peut signaler son existence sans exiger le calcul des dérivées.

### 2.4 Précision importante sur le vocabulaire

- **Itération ou étape d'optimisation :** étape au cours de laquelle les paramètres peuvent être mis à jour.
- **Époque d'entraînement :** parcours du jeu d'entraînement selon une convention donnée.
- **Taux d'apprentissage :** paramètre réglant l'amplitude des mises à jour pour certaines méthodes d'optimisation.
- **Validation :** mesure sur des exemples tenus à l'écart de l'ajustement des paramètres.
- **Test final :** évaluation réservée à la fin des choix de modèles et de réglages.

Ne pas présenter ces termes comme des mots à mémoriser avant les exemples. Les introduire seulement lorsqu'une comparaison concrète leur donne un sens.

---

## 3. Généralisation, surapprentissage et données biaisées

### Généraliser

Un système **généralise** dans la mesure où ce qu'il a appris sur ses données lui permet de produire des résultats pertinents sur des exemples nouveaux, dans les conditions de l'évaluation considérée.

La généralisation n'est jamais établie une fois pour toutes par un seul petit ensemble de validation.

### Surapprendre

Il y a **surapprentissage** lorsqu'un modèle s'adapte trop étroitement aux données d'entraînement, au détriment de sa performance sur des exemples distincts. Une baisse de la perte d'entraînement accompagnée d'une dégradation de la validation constitue un signal caractéristique, mais l'analyse dépend des données et des mesures.

### Mémoriser

La **mémorisation** concerne la conservation ou la reproduction de caractéristiques de certains exemples. Elle peut participer à des comportements de surapprentissage, mais les deux notions ne doivent pas être utilisées comme des synonymes universels.

### Être représentatif

Si les données de validation ne représentent pas les situations visées, un bon résultat de validation peut donner une confiance injustifiée. La composition des données, leur qualité, leur diversité et les éventuels biais importent.

**Cas de classe :** un outil de correction est évalué uniquement sur des phrases courtes et sans faute de frappe. Peut-on conclure qu'il fonctionne aussi bien sur de longues productions d'élèves contenant des erreurs ? **Non.** Le protocole ne couvre pas ces situations.

---

## 4. Une manipulation dans LLM Academy

**Activité existante :** https://darksathili-jpg.github.io/llm-academy/#/activite/apprentissage

**Avant de commencer :** prévenir les participants que cette activité appartient aux **approfondissements** du parcours élève. Le laboratoire présenté repose sur un **mini-réseau bigramme** ; il ajuste réellement certains paramètres, mais **il ne représente pas un LLM moderne complet**.

### Protocole guidé, environ 15 minutes

1. Ouvrir l'activité « Que change l'entraînement d'une machine ? ».
2. Repérer les deux mesures intitulées « entraînement » et « validation ». Vérifier qu'il s'agit bien de mesures distinctes.
3. Écrire une prédiction : « Après 100 étapes, les deux erreurs vont-elles nécessairement diminuer de la même manière ? »
4. Relever les valeurs initiales affichées. **Ne pas inventer de nombres à l'avance.**
5. Lancer une série de 100 étapes selon le bouton proposé par le laboratoire.
6. Relever les nouvelles valeurs, comparer les écarts et décrire les deux courbes.
7. Expliquer ce que l'observation autorise ou interdit de conclure.

**Résultat à rechercher :** observer si les paramètres du mini-modèle changent et comment les mesures évoluent. Une perte d'entraînement réduite ne constitue pas une garantie d'amélioration sur la validation.

**Limites obligatoires :** le réseau est un modèle réduit fondé sur des relations entre deux tokens consécutifs. Il ne possède pas le mécanisme d'attention d'un Transformer moderne ; une progression observée ne démontre aucune compréhension humaine ni une fiabilité factuelle générale.

**Remédiation :** si un élève dit « l'erreur descend, donc tout ce qu'il répond est vrai », demander : « Sur quels exemples cette erreur a-t-elle été calculée ? Mesure-t-elle la vérité des réponses ou un objectif de prédiction ? »

---

## 5. Prolongement Python NSI : mesurer une proportion d'erreurs

Cet exercice **ne programme pas un réseau neuronal**. Il fait travailler les listes, les fonctions, les instructions conditionnelles, les boucles bornées et les assertions.

### Énoncé

Écrire une fonction `taux_erreur(predictions, attendus)` qui reçoit deux listes non vides de même longueur. Chaque position correspond à un cas évalué : la première liste contient la prédiction et la seconde la réponse attendue.

La fonction renvoie la proportion de positions pour lesquelles les deux valeurs sont différentes. Elle doit refuser deux listes de longueurs différentes et les listes vides.

**Exemple résolu :**

```python
predictions = ["chat", "chien", "oiseau", "chat"]
attendus = ["chat", "chat", "oiseau", "chien"]
```

Deux positions sur quatre ne correspondent pas : le résultat attendu est **2 / 4 = 0,5**.

### Aide graduée

**Aide 1.** Vérifier que les listes ont la même longueur et que cette longueur est strictement positive.

**Aide 2.** Déclarer une variable de type entier `erreurs`, initialement égale à 0. Employer une boucle bornée sur les indices. Pour chaque différence, affecter à cette variable une valeur supérieure de 1.

**Aide 3.** Diviser le nombre d'erreurs par le nombre de cas.

### Correction commentée

```python
def taux_erreur(predictions, attendus):
    """Renvoie la proportion de prédictions différentes des valeurs attendues."""
    if len(predictions) != len(attendus) or len(attendus) == 0:
        raise ValueError("Les deux listes doivent être non vides et de même longueur.")

    erreurs = 0
    for indice in range(len(attendus)):
        if predictions[indice] != attendus[indice]:
            erreurs = erreurs + 1

    return erreurs / len(attendus)


assert taux_erreur(
    ["chat", "chien", "oiseau", "chat"],
    ["chat", "chat", "oiseau", "chien"],
) == 0.5

assert taux_erreur(["A", "B"], ["A", "B"]) == 0.0
assert taux_erreur(["A", "B"], ["B", "A"]) == 1.0

try:
    taux_erreur([], [])
except ValueError:
    pass
else:
    raise AssertionError("Les listes vides doivent être refusées.")

try:
    taux_erreur(["A"], ["A", "B"])
except ValueError:
    pass
else:
    raise AssertionError("Des listes de tailles différentes doivent être refusées.")

print("Cinq cas de test réussis.")
```

### Justification des instructions

- L'instruction conditionnelle vérifie les préconditions définies dans l'énoncé.
- La variable de type entier `erreurs` représente le nombre de différences relevées.
- La boucle bornée `for` parcourt les indices des listes, sans accéder à une position inexistante.
- À chaque différence, une nouvelle valeur est affectée à la variable `erreurs`.
- La fonction **renvoie** une proportion ; l'instruction `print` n'intervient que pour afficher le bilan des tests.
- Les assertions couvrent cinq situations. Elles ne prouvent pas la correction du programme pour toutes les entrées.

**Transfert :** proposer un autre ensemble de quatre prédictions qui donne un taux de 25 %. Écrire l'assertion correspondante et justifier le résultat sans exécuter le programme.

**Limite scientifique :** cette mesure de désaccord position par position n'est **ni la fonction de perte d'un LLM ni une mesure de véracité documentaire**. Elle sert à raisonner sur une évaluation définie.

---

## 6. Vérifier un système : protocole expérimental

Pour comparer deux versions d'un modèle ou deux réglages, définir avant l'essai :

1. la tâche à réaliser et les types d'exemples visés ;
2. les données d'entraînement et les données de validation ;
3. la mesure retenue et sa méthode de calcul ;
4. les conditions contrôlées : version du modèle, règles de sélection, graine si utile, découpage des jeux de données ;
5. les cas particuliers qui pourraient invalider une conclusion trop générale.

**Un contre-exemple important :** si un professeur consulte vingt fois les résultats du même ensemble de validation pour choisir le meilleur réglage, cette validation influence indirectement les décisions de mise au point. Une évaluation finale sur un jeu de test indépendant devient d'autant plus importante.

**Autre contre-exemple :** si les mêmes phrases, ou des phrases presque identiques, figurent dans l'entraînement et la validation, la séparation ne garantit plus un véritable contrôle sur des situations indépendantes.

---

## 7. Évaluation du professeur

Répondre d'abord sans consulter les corrections.

**Q1.** Quelle opération distingue un entraînement d'une inférence ordinaire ?

**Q2.** Pourquoi est-il nécessaire de disposer d'exemples de validation différents des exemples d'entraînement ?

**Q3.** Dans le tableau initial, quel état possède le plus faible taux d'erreur sur l'entraînement ? Est-il également le meilleur sur la validation ?

**Q4.** Une perte calculée sur la prédiction de tokens mesure-t-elle directement la proportion de phrases factuellement fausses ?

**Q5.** Quelle différence établissez-vous entre un ensemble de validation et un ensemble de test final ?

**Q6.** Pourquoi faut-il se méfier d'une validation contenant presque les mêmes exemples que l'entraînement ?

**Q7.** À quoi sert un paramètre numérique dans un modèle ?

**Q8 — Transfert.** Une application affiche « 99 % de réussite » sur les exemples de son concepteur. Quelle information manque-t-il avant de recommander cet outil à une classe ?

**Q9 — Transfert.** Concevoir une intervention de deux minutes pour un élève qui pense qu'une seule bonne réponse prouve qu'un modèle a « appris la leçon ».

### Corrigé détaillé

**R1.** L'entraînement comporte une procédure qui peut modifier les paramètres pour réduire un objectif de perte ; l'inférence ordinaire calcule une sortie avec les paramètres disponibles sans les ajuster pour cette seule réponse.

**R2.** Pour voir si les performances s'étendent à des exemples non utilisés pour modifier les paramètres, et ne pas mesurer seulement l'adaptation aux exemples déjà vus.

**R3.** Le troisième état, avec 2 % sur l'entraînement. Non : sur la validation, le deuxième état présente 18 % d'erreur, contre 35 % pour le troisième.

**R4.** Non. La perte est liée à l'objectif mathématique retenu et aux données ; elle ne constitue pas une vérification documentaire des affirmations générées.

**R5.** La validation aide à guider la mise au point et le choix des réglages. Le test final sert à estimer les performances après ces choix, sur des données réservées à cette fin.

**R6.** Les ressemblances peuvent faciliter artificiellement les prédictions et conduire à surestimer les performances sur des cas vraiment nouveaux.

**R7.** Il intervient dans les calculs et influence les sorties ; certains paramètres sont ajustés pendant l'entraînement.

**R8.** Il manque notamment la composition des exemples, la méthode de mesure, les cas d'échec, les résultats indépendants et l'adéquation avec les productions réelles d'élèves.

**R9.** Demander d'abord si la réponse avait déjà été rencontrée. Comparer une question connue et un exemple nouveau, puis faire distinguer « réponse correcte observée » et « apprentissage ou généralisation démontrés ».

### Critères de relecture

L'enseignant est capable de :

- présenter les trois ensembles **entraînement / validation / test final** sans les confondre ;
- expliquer une baisse de perte et sa limite ;
- justifier, à partir de valeurs, pourquoi un modèle peut surapprendre ;
- proposer un protocole de comparaison et une remédiation pour un élève.

**Décision humaine uniquement :** les réponses libres doivent être effectivement examinées. Aucune note automatique n'est attribuée.

---

## 8. Transposition dans une séance de 55 minutes

| Temps proposé | Intervention de l'enseignant                        | Production observable                                    |
| ------------- | --------------------------------------------------- | -------------------------------------------------------- |
| 0–8 min       | Présenter le tableau des trois états, sans corriger | Choix justifié de l'état à conserver                     |
| 8–18 min      | Définir entraînement, validation et test final      | Trois définitions avec un exemple                        |
| 18–30 min     | Montrer comment la perte évolue                     | Description d'un écart, sans prétendre mesurer la vérité |
| 30–43 min     | Faire manipuler le mini-réseau du laboratoire       | Deux valeurs avant/après et une limite                   |
| 43–51 min     | Analyser un cas de surapprentissage                 | Conclusion argumentée à partir du tableau                |
| 51–55 min     | Proposer un nouveau cas de validation               | Critère à vérifier sur un exemple inédit                 |

Cette séance constitue un **approfondissement** : elle n'est pas à imposer à une classe qui n'a pas encore distingué modèle, token et prédiction.

### Remédiations ciblées

- **« Le modèle apprend à chaque question. »** Revenir aux changements de paramètres et à la différence entraînement / inférence.
- **« Une perte plus petite signifie une réponse plus vraie. »** Demander ce que mesure précisément la perte.
- **« La validation sert à réentraîner. »** Réexaminer le rôle des trois ensembles.
- **« Le mini-réseau est un LLM moderne. »** Faire identifier le contexte limité à un token et l'absence de mécanisme d'attention.
- **« Un test réussi suffit. »** Faire construire un nouveau cas qui pourrait mettre le système en défaut.

---

## 9. Limites, références et contrôle éditorial

**Ce que le cours ne prétend pas réaliser :** entraîner un LLM moderne, calculer les gradients détaillés, prouver l'absence de biais, évaluer toutes les situations de production ou certifier des acquisitions avec des réponses libres.

**Références scientifiques :**

- Hugging Face, _How do Transformers work?_, https://huggingface.co/docs/course/en/chapter1/4 — objectifs de préentraînement et distinction entre modèle initial et ajustement.
- Hugging Face, _Causal language modeling_, https://huggingface.co/docs/transformers/tasks/language_modeling — préparation et entraînement d'un modèle causal.
- Éduscol, _Programmes et ressources en NSI_, https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g — référence pour les notions Python du lycée, et **non** pour rendre obligatoires les détails des LLM.

**Vérifications avant acceptation :** refaire les calculs du tableau, exécuter les assertions Python, relire la terminologie et les nuances, vérifier l'interface réelle du laboratoire, faire lire le cours à un enseignant novice et observer son explication de la différence entre entraînement, validation et inférence. Les durées et la compréhension ne sont pas encore validées sur le terrain.
