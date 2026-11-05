# Registre de qualification pédagogique des quinze notions — R1

**Date : 2026-11-05. Branche : `feature/academy-pedagogie-microduck-r1`.**

## Principe de sincérité

Ce tableau suit les quinze thèmes **tels que cartographiés dans `DOCTRINE_MICRODUCK_TRANSVERSALE.md`**. Le rattachement exact à tous les chapitres de l'application V4 reste à confirmer par un audit de navigation et de contenu : ne pas prétendre avoir vérifié chacun des quinze parcours de production. Les prototypes `public/pilotes` ne constituent pas une intégration dans l'application principale.

- **Concept expliqué** = page structurée besoin → intuition → limites → formalisation.
- **Activité** = l'élève manipule, prévoit et compare à une règle scientifique.
- **Transfert** = situation nouvelle avec justificatif, Microduck retiré.
- **Preuve** = navigateur + oracles scientifiques + évaluation novice/enseignant ; un fichier de tests écrit n'est pas un test passé.

## Inventaire et décision de qualification

| Thème | Besoin à démystifier | État du travail sur la branche | Verdict pédagogique |
|---|---|---|---|
| 01 Sources | Pourquoi une sortie plausible n'est-elle pas une preuve ? | Doctrine seulement | À RECONSTRUIRE |
| 02 Tokens | Pourquoi segmenter un texte en unités numériques ? | Mission de fusion pédagogique, sans introduction conceptuelle complète | À RECONSTRUIRE |
| 03 Softmax | Pourquoi convertir des scores en distribution normalisée ? | Exploration de température avec scores explicitement choisis | À RECONSTRUIRE |
| 04 Masque causal | Pourquoi empêcher l'accès au futur ? | Mission V2 avec sprites officiels et contrôle Playwright rapporté réussi | EN VÉRIFICATION PÉDAGOGIQUE |
| 05 Entraînement | Pourquoi et comment changer des paramètres ? | Modèle PyTorch expérimental, pas de prérequis novice complet | À RECONSTRUIRE |
| 06 Recherche/RAG | Pourquoi une information récupérée peut-elle rester fausse ? | Doctrine seulement | À RECONSTRUIRE |
| 07 Données | Pourquoi séparer le corpus avant tout apprentissage ? | Correction technique de séparation train/validation rapportée ; pédagogie non validée | À RECONSTRUIRE |
| 08 Embeddings | Pourquoi un identifiant ne suffit-il pas ? | **Nouveau** pilote `microduck-introduction-embeddings-r1`, oracle distance/cosinus et transfert | EN VÉRIFICATION TECHNIQUE ET PÉDAGOGIQUE |
| 09 Attention | Pourquoi combiner les positions et comment calculer les poids ? | Introduction, Q/K/V, données PyTorch et N0–N5, tests précédents partiellement communiqués | EN VÉRIFICATION PÉDAGOGIQUE |
| 10 Transformer | Comment les blocs transforment-ils les représentations ? | Mini-Transformer expérimental ; formation novice à auditer | À RECONSTRUIRE |
| 11 Gradient | Pourquoi la perte renseigne-t-elle une modification de paramètre ? | Doctrine seulement pour le pilote Microduck | À RECONSTRUIRE |
| 12 Génération | Pourquoi une probabilité ne dicte-t-elle pas toujours le même texte ? | Expérience de distribution jouet et génération de modèle, séquencement à reprendre | À RECONSTRUIRE |
| 13 LoRA | Pourquoi adapter peu de paramètres peut-il suffire ? | Doctrine seulement | À RECONSTRUIRE |
| 14 Prompting | Pourquoi des instructions précises ne garantissent-elles pas la vérité ? | Doctrine seulement | À RECONSTRUIRE |
| 15 Évaluation | Comment évaluer un modèle sans fuite ni réponses apprises ? | Contrat N0–N5 sur l'attention seulement, non général | À RECONSTRUIRE |

## Ordre de remédiation recommandé, fondé sur les prérequis

1. **Tokens → embeddings → scores / softmax → masque causal → attention Q/K/V** : connaître l'objet de chaque opération et sa signification.
2. **Entraînement / gradient → validation / données → génération** : distinguer calcul pendant l'apprentissage et inférence, puis évaluer.
3. **Transformer complet → recherche/RAG → adaptation/LoRA → prompting → évaluation critique** : relier mécanismes et usages, sans simplifications trompeuses.
4. **Sources / fiabilité** est transversal dès le début : provenance des informations, limites et vérification des sorties.

À chaque thème, suivre **N0 diagnostic → N1 reformulation → N2 prédiction modifiée → N3 calcul/code → N4 deux transferts différents → N5 contre-exemple/critique**. Les enseignants effectuent le même parcours scientifique puis ajoutent diagnostic d'erreurs et proposition de remédiation.

## Gates de livraison par thème

- G-D0 : notions et prérequis explicitement expliqués.
- G-D1 : expérience interactive scientifiquement fidèle ; personnage Microduck utile et jamais anthropomorphisé.
- G-D2 : oracles numériques indépendants et tests navigateur exécutés.
- G-D3 : parcours novice et enseignant avec critères différents ; interventions accessibles au clavier et sous trois modes visuels.
- G-D4 : transfert inédit N4 en deux contextes + N5 critique ; justification vérifiée humainement.
- G-D5 : essai réel novices, suivi différé, correction documentée et décision de publication contrôlée.

**Un seul gate manquant = NON QUALIFIÉ pour publication officielle**. La V4 protégée, `main` et le site public ne doivent pas changer par cette mission.
