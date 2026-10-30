# LLM Academy — Qualification I2 de la formation V4.1

**Date :** 29 octobre 2026. **Statut :** corrections ciblées intégrées sur la branche d'intégration ; réception scientifique et pédagogique **non prononcée**.

**Périmètre :** `public/pilotes/formation-v4/index.html`. La version V4.1 correspond exactement à l'artefact de qualification local (empreinte Git blob `df4b47bb9af84512fde1ceb2d7a843ec33afcb01`), à l'exclusion des cours React et des modifications locales L1.

## Corrections examinées

- **I2-01 — Démonstration de fuite :** documents `A,B,C,A,D,E`. Sans déduplication : entraînement `A,B,C`, validation `A`, test `D,E`, soit une fuite effectivement observable. Après déduplication : entraînement `A,B,C`, validation `D`, test `E`, sans recouvrement exact dans cet exemple.
- **I2-02 — Sémantique des acquis :** la réponse à un unique QCM est désormais intitulée « quiz réussi », et ne certifie ni la manipulation, ni l'exercice de transfert, ni la maîtrise.
- **I2-03 — Mobile :** le sélecteur de chapitres et les blocs mathématiques respectent la largeur de l'écran ; certains calculs conservent un défilement local lorsque nécessaire.
- **I2-04 — Métadonnées :** description corrigée de six à quinze expériences.
- **Formatage :** exception provisoire strictement ciblée dans `.prettierignore` pour le fichier autonome contenant la distribution MathJax embarquée. Les autres sources et tests restent vérifiés par Prettier. Dette de maintenance à traiter lors de la découpe de l'application.

## Preuves et limites

Sur le candidat local, les contrôles ciblés précédents indiquaient : 15 chapitres accessibles, 15 programmes Python standard avec assertions réussies, pas de débordement global à 320/390/768/1440 px lors des essais DOM, et dix formules MathJax réelles sans erreur au chapitre d'attention à 320 px. La navigation rapide utilisait un moteur MathJax simulé : elle ne prouve pas son rendu.

Les cinq tests Playwright ajoutés dans `tests/e2e/formation-v4.spec.ts` doivent être exécutés sur le **vrai serveur Vite** et dans la CI de cette branche. Un résultat CI vert ne suffira pas à certifier la formation : aucun essai autonome d'élèves ou d'enseignants novices n'est encore établi.

**Réserves bloquantes pour une formation de référence :** profondeur des cours enseignants, mathématiques sans prérequis cachés, Python actuellement non exécutable dans le pilote HTML, évaluation du transfert et des acquis différés, accessibilité à confronter à des usagers réels.

## Gouvernance

Ce commit ne doit ni fusionner `main`, ni publier le site, ni intégrer L1. Une Pull Request **brouillon** visant `refonte/v5-cours-enseignant` est destinée uniquement au déclenchement et à la consultation des vérifications automatisées. Les tests du dépôt ne constituent pas une réception pédagogique.

**État : I2-A en cours ; G1/L1 suspendu ; L2 non autorisé.**
