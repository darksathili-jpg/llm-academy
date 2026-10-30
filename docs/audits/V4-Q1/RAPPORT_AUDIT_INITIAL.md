# V4-Q1 — Audit documentaire, statique et plan de recette

**Date :** 30 octobre 2026  
**Référence immuable :** `v4-pilote-retrouve-20261030` → `b7ef6521de29097297d0a1e9550aecf5bc829b2d`  
**Branche dédiée :** `audit/v4-qualification-q1`  
**Statut : QUALIFICATION PARTIELLE — réception technique et pédagogique NON prononcée.**

## 1. Méthode et périmètre vérifiés

Lecture directe depuis GitHub des fichiers :
- `docs/pilotes/formation-v4/QUALIFICATION_I2.md`
- `docs/pilotes/formation-v4/GUIDE_ET_VALIDATION.md`
- `docs/pilotes/formation-v4/DOSSIER_FORMATEUR.md`
- `tests/e2e/formation-v4.spec.ts`
- `package.json`
- `playwright.config.ts`

Le fichier HTML monolithique `public/pilotes/formation-v4/index.html` n'a pas pu être récupéré intégralement avec l'outil de lecture disponible : requête GitHub retournant un contenu vide. **Aucun examen ligne à ligne du code du pilote n'est donc revendiqué**. Aucun test Playwright, Vitest, audit axe, contrôle visuel réel ou essai élève n'a été exécuté dans cet audit distant. Les succès du build et les journaux Vite fournis par l'utilisateur précédemment sont des preuves d'exécution *sur son poste*, non une nouvelle exécution ici.

## 2. État des preuves

| Contrôle | Constats et preuve | État |
|---|---|---|
| Point de restauration | Tag distant et commit strictement identiques, zéro différence | CONFIRMÉ |
| Compilation | Journal PowerShell fourni : `npm run build` réussi, 88 modules transformés ; avertissement d'un chunk à 521,39 Ko | CONFIRMÉ SUR POSTE UTILISATEUR |
| 15 chapitres | Annoncés dans guide et qualification ; test Playwright prévu pour compter 15 cartes et ouvrir les chapitres | DÉCLARÉ, NON RÉEXÉCUTÉ |
| 15 expériences | Inventoriées dans dossier formateur ; résultats et rétroactions non vérifiés individuellement | À TESTER |
| 15 exercices Python | Guide : exemples à exécuter dans Python standard, pas d'interpréteur embarqué dans ce pilote | LIMITE DOCUMENTÉE |
| MathJax | Test E2E cherche un vrai `mjx-container` et zéro `mjx-merror` pour un chapitre | TEST NON EXÉCUTÉ |
| Fuite et déduplication | Test E2E cible les exemples A/B/C/A/D/E et vérifie les répartitions affichées | TEST NON EXÉCUTÉ |
| Mobile | Test E2E mesure débordement global à 320 et 390 px sur un chapitre | COUVERTURE PARTIELLE |
| Enseignant | Un test vérifie la visibilité de `#teacherDepth` | COUVERTURE PARTIELLE |
| Apprentissage autonome | Aucun protocole utilisateur indépendant avec mesures de transfert différé | NON DÉMONTRÉ |
| Accessibilité | Aucun essai lecteur d'écran, clavier complet ou projecteur réel démontré | NON DÉMONTRÉ |

## 3. Audit technique des tests existants

Les cinq tests `tests/e2e/formation-v4.spec.ts` couvrent : (1) accès aux 15 chapitres et 3 boutons de QCM ; (2) démonstration de fuite sans/après déduplication ; (3) formulation « quiz » sans certification de maîtrise ; (4) approfondissement enseignant et présence de MathJax ; (5) débordement global aux largeurs 320 et 390 px.

**Lacunes constatées dans la couverture du code de test** (cela ne démontre pas que l'application est défaillante) :
1. Aucune assertion sur l'exactitude numérique de chaque expérience, les bornes ou les cas extrêmes.
2. Aucune exécution réelle des 15 scripts Python dans les tests consultés.
3. Aucun test de conservation et remise à zéro des données locales, ni de résilience après rechargement.
4. Aucun test du mode projection, de l'impression, de l'accessibilité clavier de bout en bout ni du lecteur d'écran.
5. Aucun contrôle de la console JavaScript sur l'ensemble des parcours ; aucun test hors ligne/service worker.
6. Couverture responsive limitée à deux tailles sur un seul chapitre ; les largeurs 768/1440 et autres vues ne sont pas couvertes dans ces cinq tests.
7. La vérification de 3 boutons de QCM ne démontre pas la validité des réponses, des justifications ou du transfert.

La configuration `playwright.config.ts` utilise Chromium seulement, une prévisualisation Vite sur `127.0.0.1:4173/llm-academy/`, et un serveur `npm run preview`. Il faut **construire le site avant l'exécution Playwright**, car `vite preview` sert le dossier `dist`.

## 4. Audit pédagogique à partir des documents

**Points étayés par le dossier :** parcours en trois phases (fondations 01–06 ; mécanismes 07–11 ; application critique 12–15), articulation concepts / calcul / Python / transfert, refus de certifier la maîtrise par un seul QCM, limites des simulateurs JavaScript clairement reconnues, prérequis NSI distingués des notions LLM hors programme.

**Réserves majeures :**
- L'exécution Python exige de quitter le pilote ; friction et perte potentielle d'autonomie, sans preuve de guidage suffisant pour les novices.
- Les notions d'exponentielle, logarithme, vecteurs et dérivée imposent un étayage explicite, y compris pour les élèves sans spécialité mathématiques.
- Les 15 manipulations ne suffisent pas à établir le transfert : il faut des tâches inédites, des explications écrites et une mesure différée.
- Le mode Enseignant annonce des approfondissements mais leur qualité scientifique et leur usage réel doivent être évalués par des enseignants novices.
- L'accessibilité, les durées et les difficultés réelles ne peuvent être validées sans essais utilisateurs.

## 5. Priorités et gates

**P0 — préalable à une réception :**
1. Lancer `npm run build`, puis `npm run test:e2e -- tests/e2e/formation-v4.spec.ts`, en conservant les sorties et traces. En cas d'échec, classer la cause ; ne pas modifier la référence gelée.
2. Vérifier l'exactitude des 15 expériences avec cas nominaux, limites et contre-exemples, ainsi que les 15 scripts Python réellement exécutés.
3. Réaliser une épreuve novice sans assistance et une tâche de transfert différé (critères annoncés avant passation).

**P1 — robustesse et usage lycée :**
4. Étendre les tests aux modes clair/sombre/projection, 320/390/768/1440 px, clavier, MathJax et impressions.
5. Vérifier stockage local, absence de donnée personnelle transmise, comportement hors ligne et droits des médias / bibliothèques.
6. Contrôler les consignes et les critères d'évaluation : vocabulaire précis NSI, rétroaction explicative, distinction simulation / véritable LLM.

**P2 — maintenance :**
7. Découper à terme le fichier HTML monolithique et sortir MathJax embarqué du contournement `.prettierignore`, après tests de non-régression.
8. Étudier le chunk de 521 Ko pour la performance sans modifier la référence.

## 6. Décision

**V4-Q1 = AUDIT DOCUMENTAIRE PARTIEL TERMINÉ ; QUALIFICATION D'EXÉCUTION BLOQUÉE faute d'environnement navigateur/test et d'accès au HTML monolithique via lecture GitHub.**  
Aucune conclusion « application validée », « accessible » ou « pédagogiquement efficace » n'est autorisée.  
Aucune modification du pilote, aucun déploiement et aucune fusion de branches n'ont été effectués.  
Prochaine preuve indispensable : rapport Playwright exécuté sur `dist` à partir du tag gelé, puis campagne d'évaluation pédagogique auprès de novices.
