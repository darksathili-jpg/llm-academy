# V4-Q5 — Résultats des six scénarios complémentaires

**Date de consignation :** 31 octobre 2026  
**Branche :** `audit/v4-qualification-q1`  
**Référence protégée :** `v4-pilote-retrouve-20261030`

## Preuve communiquée

L'utilisateur a transmis : `6 passed` après la procédure d'exécution de `tests/e2e/formation-v4-q5-restants.spec.ts`.

Ce bilan est attribué aux six scénarios de V4-Q5 (sources, fusion de tokens, recherche, déduplication, architecture causale, contrat JSON), mais **les lignes détaillées, la durée, la version exacte et les traces ne sont pas jointes à ce message**. La campagne n'a pas été réexécutée à distance.

## Bilan provisoire

Q2 : 7/7 tests Playwright ; Q3 : 15/15 programmes Python ; Q4 : 9/9 tests d'oracles ; Q5 : 6/6 tests complémentaires. Soit 37 réussites rapportées dans les différentes campagnes. Ces contrôles ne sont ni tous indépendants ni équivalents à 37 compétences certifiées.

## Décision

**Gate de non-régression ciblée Q5 franchie selon le compte rendu utilisateur ; réception générale NON prononcée.**

Périmètre à poursuivre dans V4-Q6 : test d'accessibilité clavier et axe, lecteur d'écran humain, modes projection/clair/sombre, impression, persistance et réinitialisation, comportement hors ligne, contrôle de confidentialité et test pédagogique de transfert différé.

Aucune modification de la référence protégée ni de l'application.
