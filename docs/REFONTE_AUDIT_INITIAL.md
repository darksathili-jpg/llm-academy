# Audit initial — 10 octobre 2026

Périmètre public : accueil, six modules, carnet, références. Le commit local f48bc94 ajoute trois modules encore absents du site public lors de l'audit. Branche refonte/atelier-v2. Les durées en classe ne sont pas mesurées : les estimations éditoriales ne remplacent pas une observation.

## Preuves navigateur

Script scripts/audit-v1.mjs ; données docs/evidence/audit-v1.json. 108 captures Chromium, 390/768/1440/1920 px, trois thèmes. Aucun débordement, aucune erreur JS. 27 contrôles axe à 1440 px, aucune violation détectée. Cela ne certifie ni WCAG ni la lisibilité au fond d'une salle.
Accueil : 2 797 caractères, contenu haut de 2 671 px. Modules : environ 8 200–10 400 caractères et 6 500–8 100 px à 1440. Captures conservées dans test-results/audit-v1, reproductibles par le script.

## Constats, gravité et décision

| Constat vérifiable                                                  | Gravité                       | Effet pédagogique                                    | Décision                                             |
| ------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Aucun scénario de stage ni console                                  | Critique pour l'usage demandé | Le formateur doit tout préparer ailleurs             | Studio prioritaire, conduite minutée, projection     |
| Cours long avant les manipulations                                  | Majeure                       | Difficile d'investiguer, navigation collective lente | Une étape et une question à la fois                  |
| Même grille de cartes à l'accueil                                   | Majeure artistique            | Les usages ne se distinguent pas                     | Trois espaces, typographie et instruments éditoriaux |
| Projection : texte 19 px et colonne centrée étroite                 | Majeure                       | Le contraste seul ne rend pas une séance lisible     | Vue dédiée, texte agrandi, consigne seule            |
| Corpus/poids inventés correctement signalés                         | À conserver                   | Réduit le risque de fausse capacité linguistique     | Garder les limites au voisinage des calculs          |
| Carnet, calculs et cache locaux fonctionnels                        | À conserver                   | Sans compte, export possible                         | Migration additive et tests de non-régression        |
| Modules 07–09 : pas de tests unitaires propres aux nouveaux moteurs | Majeure                       | Gradients et adaptation insuffisamment garantis      | Différences finies, convergence, invariants LoRA     |
| Formatage initial : 22 fichiers refusés                             | Modérée technique             | CI bloquée                                           | Corriger avant livraison                             |

## Audit pédagogique par module

| Module                     | Public/prérequis réels                                           | Objectif observable et manipulation                       | Charge, rétroaction, transfert et usage collectif                                                                        |
| -------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 01 Probabilités            | Lycéen guidé ; fonctions, pourcentages ; exponentielle implicite | Comparer distribution et perte en changeant les logits    | Texte dense ; valeurs et quiz exacts ; transfert écrit non corrigé automatiquement ; extraire une expérience courte      |
| 02 Tokenisation            | NSI avec listes, dictionnaires, boucles                          | Compter les paires, apprendre puis appliquer les fusions  | Exemple Unicode original, progression concrète ; risque tokens=mots explicité ; compatible démonstration si accès direct |
| 03 Vecteurs                | Lycéen accompagné ; coordonnées, produit scalaire hors NSI       | Mesurer une similarité et la déformation d'une projection | Trois dimensions et plusieurs mesures simultanées ; bonnes valeurs inspectables ; besoin d'un niveau intuitif            |
| 04 Calculs/gradient        | Public technique ; matrices et dérivées hors programme NSI       | Calculer un produit et suivre une descente quadratique    | Charge élevée, analogie pente utile mais limitée ; pas une entrée Terminale ; conserver au laboratoire                   |
| 05 Attention               | Technique ; multiplication matricielle, softmax                  | Modifier Q/K/V et comparer les masques                    | Calcul réel, poids inventés ; attention ne prouve pas le raisonnement ; une vue intuitive manque                         |
| 06 Transformer             | Avancé ; attention, dimensions, normalisation                    | Inspecter chaque étape, tester l'influence du futur       | Très dense et long, excellent instrument avancé ; commencer par causalité et réserver les détails                        |
| 07 Architecture GPT, local | Avancé ; Transformer, logits                                     | Décaler les cibles et générer une trace                   | Mini-GPT non entraîné annoncé ; conserver notebook réel et distinguer architecture/capacité                              |
| 08 Entraînement, local     | Technique ; gradients                                            | Faire baisser une perte et comparer validation            | Réseau bigramme réel, pas Transformer ; corpus original ; comparaison validation essentielle ; tests manquants           |
| 09 Adaptation, local       | Avancé ; loss, sampling                                          | Mesurer filtrage, adapter A/B avec base figée             | Beaucoup de notions sur un écran ; distinguer sampling et entraînement ; séparer instruments intuitifs/avancés           |

Pour tous : objectifs de calcul vérifiables, écrits libres avec grille, exemples originaux, analogies limitées. Aucun test utilisateur en classe effectué ; aucun temps réel d'apprentissage annoncé. Le dispositif collectif et le retour immédiat à une démonstration restent à construire.

## Socle vérifié

97 tests unitaires exécutés et réussis. Deux notebooks PyTorch exécutés intégralement avec assertions ; gradients analytiques/numériques concordants et apprentissage réel. Build et TypeScript strict réussis. Résultat des tests navigateur du commit local à ajouter après exécution. Les tests antérieurs de phase C ne prouvent pas les nouvelles fonctionnalités.
