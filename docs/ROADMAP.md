# Roadmap — 10 octobre 2026

## État V2 — branche de revue

Branche refonte/atelier-v2. Audit et prototype validés (8091589). Parcours NSI, studio et laboratoire opérationnels (0da807f). Consolidation, sources, profils et rapport validés (2809153). Branche transférée ; [PR #1](https://github.com/darksathili-jpg/llm-academy/pull/1) en brouillon. 119 tests unitaires et 38 scénarios Chromium réussis ; Python navigateur, dix snippets et deux notebooks vérifiés.

Disponible dans la branche : dix investigations NSI, quatre séances prêtes à animer, console/projecteur, notes privées séparées, Python Worker à la demande, dix instruments, neuf modules approfondis, deux notebooks originaux PyTorch, carnet de schéma 4 migré sans abandon de sa clé historique.

Les huit expériences prioritaires sont utilisables. Le mini-RAG est lexical TF-IDF/cosinus avec réponse extractive ; les réponses du prompting sont préparées. Aucun LLM distant obligatoire et aucun LLM de production local.

## Public actuel et publication

L'audit du domaine public au début de ce mandat a constaté la livraison phase C, six modules. Les modifications V2 ne sont pas déclarées publiées. Aucun changement de main ni déploiement n'est nécessaire à la revue de la branche.

La [CI Linux #7](https://github.com/darksathili-jpg/llm-academy/actions/runs/38059760957) a réussi pour le commit 2809153 ; publication ignorée. Après autorisation : fusion de la branche, nouvelle validation sur main, publication Pages, puis node scripts/verify-live.mjs avec un navigateur neuf. Le rapport local ne suffit pas à certifier une publication.

## Retour enseignant et reprise de la compréhension

Un enseignant signale que les termes et explications sont trop difficiles. L’appréciation initiale de 91/100 est retirée comme note actuelle. Reprise par une découverte guidée sans code, dix activités en langage courant et un découpage simplifié. Voir PRISE_EN_MAIN_SIMPLE.md ; un nouvel essai humain reste nécessaire avant de juger la compréhension.

## Reste à faire

Essais avec élèves et enseignants, matériel de projection, lecteurs d'écran, Firefox/Safari ; revue scientifique indépendante. Trois modules de la collection initiale restent à rédiger, notamment agents et évaluation approfondie. Les fonctionnalités d'expérimentation V2 ne sont pas assimilées à ces cours complets.

Voir RAPPORT_VALIDATION_V2.md, SCENARIOS_FORMATEUR.md et LIMITES_CONNUES.md pour le périmètre réel.
