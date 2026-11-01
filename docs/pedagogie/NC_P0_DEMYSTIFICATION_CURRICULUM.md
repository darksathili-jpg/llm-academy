# NON-CONFORMITÉ PÉDAGOGIQUE P0 — Démystification absente

**Décision : BLOQUÉ pour toute qualification pédagogique globale.** Les tests de fonctionnement réussis ne prouvent pas que des débutants comprennent. La V4 protégée et main restent inchangées.

## Diagnostic

La construction a privilégié une succession « interface → formule → exercice → test Playwright », au lieu de « besoin à résoudre → concept intuitif → mécanisme → formalisation → mise en pratique → transfert ». Exemple avéré : la mission Q/K/V demande des produits scalaires sans avoir préalablement enseigné de façon assez robuste ce qu'est l'attention, ce qu'elle produit, pourquoi on utilise des poids et comment on distingue masque et importance.

Cette anomalie concerne potentiellement **l'ensemble des 15 chapitres**, pas uniquement l'attention. Tant que chacun n'est pas audité, sa qualité pédagogique est **NON ÉTABLIE** ; cela ne signifie pas que chacun est nécessairement mauvais.

## Gate obligatoire G-DÉMYSTIFICATION (chaque notion)

1. **Question initiale** : quel problème concret doit-on résoudre ? Exemple compris sans jargon.
2. **Modèle mental accessible** : analogie bornée, animation Microduck si utile, verbalisation de ce que l'analogie ne représente pas.
3. **Contrastes** : un exemple positif, un contre-exemple, une erreur typique.
4. **Lexique progressif** : chaque nouveau mot expliqué au premier usage ; termes NSI conformes ; indice ≠ quantité, scores ≠ probabilités.
5. **Manipulation prédictive** : l'apprenant formule une hypothèse avant de voir l'effet.
6. **Formalisation** : passer du concret aux variables, vecteurs, expressions, hypothèses et limites.
7. **Calcul et code** : d'abord des nombres contrôlables à la main, puis code Python reproductible, puis modèle réel lorsque pertinent.
8. **Transfert sans Microduck** : situation inédite, réponse justifiée ; une réussite au clic ne suffit pas.
9. **Évaluation accessible** : repérer les confusions par type ; permettre remédiation et nouvelle tâche non identique.
10. **Guide enseignant** : objectif, prérequis, progression, savoirs stabilisés, erreurs fréquentes, critères d'observation, corrigé et limites.

**Règle de blocage :** une notion n'est pas « prête à enseigner » si une étape 1–4 ou 8 manque, même si 100 % des tests techniques passent.

## Première reconstruction : l'attention

Séquence imposée (ordre strict) :
A. Pourquoi un modèle doit-il combiner des informations provenant de positions différentes ?
B. Ce qui est accessible : masque causal (positions), avec Microduck.
C. Ce qui est privilégié : poids non négatifs de somme 1 ; exemple 20/80 et vecteurs V très simples.
D. Comment calculer les poids : Q/K, score, échelle, masque, softmax.
E. Comment utiliser les poids : somme pondérée de V, multi-têtes, limites d'interprétation.
F. Confronter à une attention réelle du Mini-Transformer et distinguer probabilités du prochain caractère.
G. Transfert inédit sans aide et commentaire scientifique.

Important : utiliser un exemple en mots uniquement comme **analogie linguistique explicitement bornée**. Le Mini-Transformer expérimental utilise des positions de **caractères** ; ne jamais faire croire qu'il identifie des référents linguistiques en observant une tête.

## Audit systématique des quinze chapitres

Pour chaque chapitre, produire une fiche d'audit :
- question fondamentale que le débutant doit comprendre ;
- notions présupposées sans explication ;
- prérequis Python/mathématiques nécessaires ;
- analogie Microduck, limites et risque d'anthropomorphisme ;
- expérience interactive et résultat scientifique vérifiable ;
- exercice de reformulation avant calcul ;
- transfert sans indice et grille d'évaluation ;
- verdict : CONFORME / À RECONSTRUIRE / BLOQUÉ, preuves.

Priorité diagnostique : attention/QKV, embeddings, softmax, gradient, entraînement, Transformer et généralisation. Ne pas continuer à ouvrir de nouveaux exercices tant que les prérequis manquants n'ont pas été corrigés.

## Méthode et preuves

- **Architecte scientifique** : exactitude mécanismes et calculs.
- **Ingénierie pédagogique** : novices, progression, charge cognitive, métacognition.
- **Développement** : interface, accessibilité, modes, sprites officiels.
- **Vérification indépendante** : oracles calcul, tests navigateur, erreurs typiques.
- **Recette humaine** : observation de débutants et enseignants, justifications écrites et transfert différé.

Les tests Playwright sont nécessaires mais insuffisants. Aucun score général de maîtrise ne doit être attribué avant validation humaine. Pour chaque gate, conserver résultat, artefact et justification.

## Première décision opérationnelle

Mettre la mission Q/K/V sous **prérequis non satisfait** tant qu'une mission d'introduction « Qu'est-ce que l'attention ? » n'est pas livrée, testée et accessible par navigation ordonnée. Ajouter ensuite « poids sans calcul », puis Q/K/V ; seulement après, exploration des poids réels. La correction ne doit pas se limiter à une page Markdown supplémentaire.

**État : non-conformité documentée ; remédiation fonctionnelle à implémenter ; publication du cursus complet BLOQUÉE.**
