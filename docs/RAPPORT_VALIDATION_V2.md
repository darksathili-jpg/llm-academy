# Rapport de validation V2 — 10 octobre 2026

## Livré sur la branche refonte/atelier-v2

Nouvel accueil éditorial et trois espaces. Dix investigations NSI en huit étapes, traces locales exportables et aides graduées. Studio 60/120/180/360 minutes, déroulement complet, questions orales et réponses, tâches individuelles/binômes/collectives, correction à la demande, horloges, clavier, reprise, écran secondaire facultatif, notes privées dans une fenêtre séparée et deux fiches imprimables distinctes.

Dix instruments, dont les huit expériences prioritaires ; niveaux intuitifs et scientifiques. Les moteurs existants sont conservés. Les modules 07–09 et les deux notebooks préparés dans le commit utilisateur f48bc94 ont été vérifiés et intégrés. La bibliothèque comprend neuf modules approfondis, pas douze cours achevés.

Carnet version 4 : même clé historique, migration 1/2/3, notes/réponses/thèmes conservés, investigations ajoutées ; aucun score libre inventé. Import plafonné à 2 Mo, compatible avec les traces Unicode maximales autorisées. Les notes privées n'entrent ni dans le carnet ni dans les fiches.

## Tests initiaux effectivement observés — avant la reprise du vocabulaire

| Vérification                    | Résultat                                                                                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| TypeScript strict et build Vite | Réussis                                                                                             |
| Vitest                          | 119 tests réussis, 10 fichiers                                                                      |
| Playwright/Chromium             | 38 scénarios réussis ; formats 60/360, correction progressive et pause indépendante inclus          |
| Axe                             | 57 analyses V2 + 27 analyses historiques sans violation détectée                                    |
| Responsive                      | V2 390/768/1280/1440/1920 px dans les trois modes ; historiques 390/768/1440                        |
| Cache hors ligne                | Rechargement, routes, calculs, RAG et instrument chargé à la demande vérifiés                       |
| Import/export                   | Migration, Unicode maximal, texte script inerte, fichier corrompu et stockage refusé                |
| Confidentialité                 | Notes absentes du DOM projeté et du HTML de conduite ; deux fenêtres synchronisées                  |
| Notebook PyTorch                | Deux notebooks exécutés intégralement, assertions et gradients numériques réussis                   |
| Pyodide réel                    | Python 3.13.2, input Unicode, ZeroDivisionError, réseau usuel bloqué, boucle infinie arrêtée, reset |
| Profils simulés                 | Quatre parcours réussis ; zéro erreur JS                                                            |
| Impression                      | PDF A4 de la séance 6 h généré ; fond blanc, commandes masquées                                     |

Formatage Prettier vérifié ; audit npm exécuté, zéro vulnérabilité signalée. Dix snippets Python d’activité exécutés localement avec assertions réussies, preuve dans evidence/activity-python.json. Aucune preuve distante de déploiement V2 n'est annoncée.

## Preuves et comparaison visuelle

Audit public initial : 108 captures, zéro débordement/erreur JS, 27 contrôles axe. Longs modules à 6 500–8 100 px, pas de studio et cartes répétées à l'accueil. Source : evidence/audit-v1.json et scripts/audit-v1.mjs.

Maquette accueil/expérience inspectée à 1440 et 390 px avant généralisation. Captures V2 : accueil clair bureau, accueil sombre mobile, instrument de prédiction et console 1920 px relus. Les trois espaces se distinguent maintenant en lignes numérotées ; le premier instrument calcule des probabilités. La console affiche une consigne courte, sans notes privées ; la manipulation précède les explications dans le parcours NSI.

Un débordement de titre long en projection/mobile a été corrigé sans masquer le contenu. L’inspection réelle du rendu d’impression a révélé que les détails repliés ne peignaient pas leurs paragraphes malgré des dimensions positives : une ouverture temporaire avant impression, restaurée ensuite, a corrigé ce défaut et possède un test dédié. Deux sélecteurs de tests erronés ont été corrigés. Le repli de chargement a été ajouté après revue des imports différés, puis testé avec un composant effectivement bloqué. Ces premiers échecs ne sont pas comptés comme succès.

Captures avant/après conservées dans evidence/screens et reproductibles par scripts/capture-v2-review.mjs ; campagne multi-format via tests/e2e/v2.spec.ts ; PDF : test-results/conduite-360-print.pdf. Résultats Python : evidence/python-browser.json. Profils : evidence/profiles-v2.json. Les artefacts temporaires ne sont pas requis pour compiler le dépôt.

## Séance simulée, onze étapes

Entrée studio → choix 2 h → première consigne → chrono → démonstration → paramètres → résultat → correction → activité suivante → rechargement/reprise → export.

Douze opérations automatisées, dont une vérification de lecture : onze interactions applicatives, avec deux commandes pour ouvrir la démonstration. Dans la mesure enregistrée, le profil formateur prend 615 ms ; ce temps local automatisé ne représente ni le temps d'un humain ni la durée du stage. Chaque opération possède sa durée dans evidence/profiles-v2.json.

A : élève NSI, hypothèse/T/observation sans matrices. B : enseignant de lettres, preuves sans code. C : formateur, parcours ci-dessus. D : enseignant NSI, code Python puis détails du Transformer et retour intuitif. Aucun participant réel.

## Grille initiale — invalidée par le retour enseignant

Un enseignant a signalé après essai qu’il ne comprenait pas les termes et les explications. Ce retour invalide l’appréciation initiale d’utilisabilité : les tests automatisés n’établissent pas la compréhension. La grille ci-dessous est conservée comme historique, pas comme note actuelle. Aucun nouveau score n’est attribué avant un nouvel essai humain.

Cette grille appréciait la conformité observée au mandat ; elle ne certifie pas l'efficacité des apprentissages ni WCAG. Les points retirés correspondent aux validations terrain encore absentes, pas à des fonctions prétendument réalisées.

| Critère                  |   Note | Preuves et réserves                                                                                                                |
| ------------------------ | -----: | ---------------------------------------------------------------------------------------------------------------------------------- |
| Pédagogie                |  22/25 | Dix investigations testées, objectifs observables, transfert et grilles ; progression non éprouvée en classe                       |
| Formation                |  23/25 | Quatre scénarios minutés, 120/180 parcourus, reprise/export/notes protégées ; matériel réel et déroulement humain à vérifier       |
| Identité visuelle        |  14/15 | Trois directions évaluées, prototype inspecté, nouvelles entrées éditoriales et instruments ; validation graphique externe absente |
| Science                  |  14/15 | Calculs, gradients, convergence, causalité, LoRA et notebooks exécutés ; revue indépendante encore souhaitable                     |
| Technique                |   9/10 | Build strict, tests, cache, migration et repli ; CI/Linux réussie ; essais multi-navigateurs et terrain encore nécessaires         |
| Accessibilité/projection |   9/10 | Contrastes axe, cinq largeurs, clavier, plein écran avec repli et PDF ; lecteurs d'écran et salle réelle non testés                |
| Total indicatif          | 91/100 | Appréciation initiale retirée : compréhension insuffisante signalée par un enseignant                                              |

Aucun défaut critique de perte de données, de fausse génération ou de projection de notes n'a été observé dans les parcours validés. Ce constat est limité aux tests exécutés ; voir LIMITES_CONNUES.md.

## Clôture

Contrôles locaux finaux réussis : formatage, TypeScript strict/build, 119 tests unitaires, 38 scénarios Chromium, audit npm (0 vulnérabilité), deux notebooks PyTorch et dix snippets Python. Python navigateur et quatre profils mesurés vérifiés séparément. La CI de branche valide sans déployer ; publication réservée à main après autorisation. Branche transférée et [PR #1 ouverte en brouillon](https://github.com/darksathili-jpg/llm-academy/pull/1). [GitHub Actions/Linux #7](https://github.com/darksathili-jpg/llm-academy/actions/runs/38059760957) a validé le commit 2809153b88d16eec1adf5c41bddf7a24973c361e : formatage, TypeScript, 119 tests unitaires, build, 38 scénarios Chromium et artefact Pages réussis. L’étape publish est skipped : aucune publication V2. Preuve structurée : evidence/ci-v2.json.
\n

## Reprise après retour enseignant

Un retour humain a signalé des termes et explications incompréhensibles. La découverte en quatre écrans, les dix guides en langage courant et la version simple du découpage ont été ajoutés. Les explications scientifiques sont accessibles à la demande. Python et la navigation vers une étape précise s’ouvrent volontairement. Les textes du carnet, ses clés et la signification des réponses fermées sont préservés ; le vocabulaire des quiz est reformulé.

Validation de la reprise : 119 tests unitaires, TypeScript/build et 41 tests Chromium réussis. Les analyses axe sont désormais 60 routes/modes V2, 27 historiques et 3 pour la deuxième étape de découverte, soit 90 sans violation détectée. Captures : evidence/screens/prise-en-main. Le premier test multi-mode de découverte a échoué parce qu’il restait sur le deuxième écran entre deux modes ; le rechargement entre modes a corrigé le protocole. Aucun succès initial fictif n’est comptabilisé.

La validation technique ne rétablit pas une note pédagogique. Un nouvel essai enseignant/élève reste nécessaire. Voir PRISE_EN_MAIN_SIMPLE.md.
