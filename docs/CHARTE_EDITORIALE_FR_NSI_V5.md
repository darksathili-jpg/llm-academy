# Charte éditoriale et linguistique — LLM Academy V5

**Statut : norme obligatoire du projet.** S'applique aux cours, consignes, aides, corrections, évaluations, titres, boutons, messages d'erreur, fiches imprimables, documentation et éléments d'interface. Aucune livraison n'est acceptée sur la seule réussite des tests techniques.

## 1. Finalité

Écrire un français **exact, naturel, explicite et adapté au public**, sans relâcher la rigueur scientifique. La formulation la plus courte n'est pas nécessairement la plus compréhensible. Chaque phrase doit permettre au lecteur de savoir **ce qu'il doit comprendre, faire ou vérifier**, sans interprétation hasardeuse.

Trois lectures distinctes :
- **Élève de Terminale NSI** : tutoiement cohérent dans les consignes ; une instruction concrète par étape ; exemple avant formalisation ; vocabulaire défini avant tout usage.
- **Professeur de NSI débutant dans l'étude des LLM** : vouvoiement ou formulation impersonnelle cohérents ; explications complètes, limites scientifiques, erreurs fréquentes et réponses attendues ; aucune connaissance tacite des LLM.
- **Documentation technique et consignes aux agents** : formulation prescriptive, conditions observables, nomenclature cohérente et fichiers explicitement désignés.

**Ne pas mélanger ces registres à l'intérieur d'un même écran.** Le cours de formation adressé au professeur peut contenir une *citation* d'une consigne formulée pour l'élève ; la citation doit être identifiable.

## 2. Normes grammaticales et typographiques

- Relire les accords, les déterminants, les prépositions, les pronoms et leurs antécédents ; éviter les ellipses qui rendent une consigne ambiguë.
- Employer une ponctuation et une typographie françaises cohérentes : « guillemets français », accents sur les majuscules lorsque nécessaires, espaces insécables avant : ; ? ! dans les supports publiés, et séparation cohérente des nombres et unités.
- Privilégier une phrase contenant une seule idée nouvelle ; fractionner les phrases à plusieurs subordonnées lorsque la relation logique n'est pas évidente.
- Choisir un vocabulaire précis plutôt qu'un synonyme décoratif. Un même concept porte le même nom tout au long d'un cours.
- Définir tout sigle et tout emprunt à l'anglais lors de sa première occurrence ; utiliser ensuite le terme français retenu. Conserver le terme anglais seulement lorsque son rôle technique l'impose (par exemple `token`, `top-k`, `softmax`), avec définition.
- Préférer **« programme »**, **« instruction »**, **« résultat »**, **« choix »**, **« passage de référence »**, **« observation »** aux anglicismes ou métaphores vagues lorsqu'ils sont suffisants.
- Éviter les effets de manche, le ton commercial, la surpromesse et les jugements (« spectaculaire », « exceptionnel », « l'IA pense », « le modèle sait que… »).
- Éviter **« toujours »**, **« jamais »**, **« prouve »** ou **« garantit »** lorsqu'une hypothèse, une limite ou un contre-exemple existe.

## 3. Vocabulaire NSI obligatoire

| Formulation attendue | À éviter | Motif |
| --- | --- | --- |
| « une variable de type entier » | « une variable entière » | Distinguer variable et type |
| « affecter une valeur à une variable » | « donner un nombre à une variable » lorsque l'affectation est la notion étudiée | Nommer l'opération |
| « une boucle bornée `for` » | « une boucle `for` qui tourne » | Nommer la structure enseignée |
| « une instruction conditionnelle `if` » | « un `if` » dans une première explication | Définir avant d'abréger |
| « une fonction renvoie une valeur » | « une fonction affiche une valeur » pour `return` | Distinguer `return` et `print` |
| « un appel de fonction » | « une exécution de fonction » lorsqu'il s'agit de nommer la syntaxe d'appel | Identifier le mécanisme |
| « une liste », « un dictionnaire », « un tuple » | « tableau », « objet » par substitution non expliquée | Respecter le type de données utilisé |
| « tester une assertion » et « vérifier un cas de test » | « prouver que le programme est correct » après quelques `assert` | Ne pas surévaluer une vérification |

**Règle :** vérifier la terminologie dans les programmes et ressources officiels lorsque le doute existe ; la table ci-dessus est une règle éditoriale locale, non une citation littérale du Bulletin officiel. Ne jamais prétendre qu'un concept spécifique aux LLM est obligatoire au baccalauréat NSI sans texte normatif précis.

## 4. Vocabulaire scientifique stable

- **Modèle de langage** : système paramétré qui réalise des tâches sur des séquences linguistiques ; pour un modèle causal, la génération s'explique par la prédiction successive de tokens.
- **Token** : unité produite par le tokenizer ; ce n'est pas nécessairement un mot.
- **Tokenisation** : transformation d'un texte en unités selon des règles définies.
- **Corpus** : ensemble de données textuelles retenues pour une étude ou un apprentissage.
- **Contexte** : informations disponibles pour calculer la sortie dans une situation donnée.
- **Entraînement** : procédure d'optimisation qui ajuste des paramètres.
- **Inférence** : utilisation du modèle avec ses paramètres pour produire une sortie ; l'inférence ordinaire ne réentraîne pas les paramètres.
- **Probabilité de sélection** : quantité associée au choix d'un candidat ; **ne mesure pas automatiquement la vérité** de l'énoncé.
- **Génération autorégressive** : ajout d'une sortie au contexte, puis nouvelle prédiction.
- **Étayé / contredit / non documenté** : verdict *relatif à une source précise*. Une absence de mention n'établit pas la fausseté.

Toujours distinguer **mécanisme réel**, **modèle réduit**, **données fictives**, **analogie** et **affirmation vérifiée par une source**. Ne pas qualifier une animation de « véritable apprentissage » si elle ne modifie aucun paramètre appris.

## 5. Structure rédactionnelle d'une activité

Rédiger dans cet ordre :

1. **Question concrète** compréhensible avant l'introduction des concepts.
2. **Exemple initial** dont tous les éléments sont définis.
3. **Objectif observable** (« À la fin, tu pourras… »), sans verbe vague tel que « maîtriser ».
4. **Prérequis** explicitement identifiés.
5. **Hypothèse à écrire** avant la manipulation.
6. **Consigne opératoire** : commande exacte, valeur de départ, unique variable modifiée, observation demandée.
7. **Résultat attendu** : calcul ou observation vérifiable, sans valeurs inventées lorsque celles-ci dépendent de l'application.
8. **Explication** : établir le lien entre l'action et l'observation.
9. **Limite scientifique** : préciser ce que l'expérience ne démontre pas.
10. **Exercice progressif**, **aide**, **corrigé argumenté**, **contre-exemple**, **transfert nouveau** et **critères de vérification humaine**.

**Interdit :** introduire un terme dans une consigne avant de l'avoir défini à l'endroit où l'élève en a besoin.

## 6. Exigences particulières des cours enseignants

La formation enseignant n'est pas un catalogue de déroulements pédagogiques. Elle doit d'abord contenir un **cours autonome** permettant au professeur d'acquérir les notions, puis une **transposition didactique** explicitant ce qu'il enseignera aux élèves, ce qu'il simplifiera et ce qu'il gardera comme approfondissement.

Chaque module inclut obligatoirement : définitions, explications causales, exemples numériques ou textuels résolus, cas limites, contre-exemples, activités vérifiables, erreurs fréquentes, remédiations, évaluation indépendante et corrigé détaillé. Le déroulement de séance est **une application du cours**, pas un substitut au cours.

## 7. Relecture indépendante et décision

Le responsable de la rédaction **ne valide pas lui-même son texte**. La mission de vérification est séparée :

- **Vérification linguistique** : orthographe, syntaxe, accords, anaphores, cohérence du registre, formulation des questions, lisibilité des instructions, ponctuation.
- **Vérification scientifique** : exactitude des mécanismes, conditions et limites ; distinction entre probabilité et vérité, entre simulation et modèle entraîné.
- **Vérification NSI** : conformité des exercices aux notions déclarées, précision du vocabulaire et absence de prérequis non enseignés.
- **Vérification pédagogique** : chaque question est résoluble avec les contenus antérieurs ; une personne novice explique l'exemple sans aide extérieure.
- **Vérification technique** : liens, données, code exécutable, copies imprimables, affichage clair/sombre/projection, clavier et cas limites.

Décisions possibles : **ACCEPTÉ**, **À CORRIGER**, **BLOQUÉ**. Un défaut susceptible de donner une mauvaise représentation scientifique ou de rendre une consigne incompréhensible entraîne **BLOQUÉ** pour le module concerné.

Les contrôles automatisés peuvent détecter des erreurs de format ou quelques formulations interdites ; **ils ne constituent jamais une preuve de qualité de français**. Une relecture humaine compétente et des essais sur des lecteurs novices restent nécessaires.

## 8. Exemples avant / après

| À corriger | Formulation retenue |
| --- | --- |
| « On voit que ça change. » | « Compare la probabilité du mot “mer” avant et après la modification de la température. » |
| « Le LLM apprend en répondant. » | « Pendant la génération habituelle, le modèle utilise ses paramètres entraînés ; cette opération ne les modifie pas automatiquement. » |
| « Les mots sont découpés par l'IA. » | « Le tokenizer transforme le texte en une séquence de tokens selon des règles établies. » |
| « Le modèle a 90 % de certitude. » | « Dans cette simulation, ce token a une probabilité de sélection de 90 %. » |
| « Le document ne dit rien, donc c'est faux. » | « Ce document ne permet pas de conclure : l'information n'y figure pas. » |
| « Fais l'exercice et regarde. » | « Exécute le programme, relève la valeur renvoyée, puis explique pourquoi elle respecte ou non l'assertion. » |

## 9. Critère de livraison du 25 novembre 2026

Aucun module n'est déclaré « achevé » sans **rapport de relecture linguistique**, **rapport scientifique**, **corrections appliquées**, **vérification de l'interface correspondante** et **au moins un essai humain documenté** lorsqu'une affirmation sur l'autonomie de compréhension est formulée.

**Autorité finale :** responsable pédagogique humain ; les agents proposent et vérifient, mais n'attestent pas seuls la compréhension des élèves et des enseignants.
