# Softmax R2 — Analyse de la recette manuelle et décision de passage de porte

**Date : 6 novembre 2026.** **Branche :** `feature/academy-pedagogie-microduck-r1`.  
**Source des constats manuels :** compte rendu fourni par l'utilisateur dans la conversation. Il rapporte **8/8 OK** pour l'affichage Microduck, la variation des probabilités avec la température, la calculatrice NumWorks, les défis A/B, le défi critique, le mode enseignant et l'export JSON.

## Verdict circonscrit

**RECETTE MANUELLE FONCTIONNELLE : ACCEPTÉE pour ces huit observations.** Aucune anomalie n'a été déclarée dans ce périmètre. Cela ne vaut ni validation de conformité visuelle exhaustive, ni validation d'accessibilité, ni validation de maîtrise chez un élève ou enseignant novice.

| Porte | Preuve | Verdict |
|---|---|---|
| G-MAN | 8 observations OK déclarées par l'utilisateur | **ACCEPTÉE (périmètre limité)** |
| G-T | Suite Playwright actuelle de 8 tests, incluant export et premières tentatives | **EN ATTENTE** ; précédent rapport 3/4, puis correction de sélecteur non encore revérifiée publiquement |
| G-MATH | Oracle T=2/ln(4)≈1,442695 et sorties de softmax contrôlés par calcul indépendant | **Références contrôlées** ; tests d'intégration encore en attente |
| G-P | Résultats argumentés de novices, corrections humaines des N4 et N5 | **NON RÉALISÉE** |
| G-E | Productions d'enseignants nouveaux et diagnostic/remédiation évalués sur barème complémentaire | **NON RÉALISÉE** |
| G-D | Transfert différé après 7–14 jours sur données non vues | **NON RÉALISÉE** |

## Anomalies et améliorations encore ouvertes — ordonnancement

**P1 · Qualité de l'évaluation libre.** Le code n'examine ni la cohérence des justifications N4 ni la véracité de l'analyse N5. La longueur minimale donne seulement accès à la grille. La correction doit rester humaine et s'appuyer sur le barème élève /20 et le complément enseignant /10. Ne pas afficher de note ou compétence automatisée.

**P1 · Valeur du premier essai.** La première tentative des défis A/B/C est conservée en mémoire et dans le JSON exporté ; mais l'apprenant peut avoir utilisé les explications et la calculatrice. Présenter le premier essai comme « avant correction des défis », pas comme mesure incontestable d'absence d'aide. Pour une épreuve autonome, définir et superviser la condition d'absence d'indice.

**P1 · Test de robustesse scientifique.** Tester les erreurs suivantes : T=0 ou T négative, entrée vide/non finie, somme ≈1, invariance à l'ajout d'une constante, erreur de calcul d'une des trois probabilités, reset et nouvelle tentative, distinction entre softmax d'attention et distribution de génération. Conserver l'oracle indépendant.

**P1 · Production de l'enseignant.** Vérifier la qualité de deux erreurs distinctes, une remédiation active, un item inédit avec résultat justifié et une grille explicite. L'existence de champs et le fait de pouvoir les remplir ne démontrent pas cette compétence.

**P1 · Recette de terrain.** Faire passer un diagnostic avant séquence, suivre compréhension et demande d'aide à chaque étape, puis deux défis nouveaux et N5, et une évaluation différée après 7–14 jours. Consigner les erreurs selon E1–E8 et comparer premier essai / correction / transfert différé.

**P2 · Traces et confidentialité.** Le JSON contient les textes libres ; informer les participants, collecter seulement ce qui est nécessaire, anonymiser avant partage, limiter les accès et vérifier les règles applicables dans l'établissement. Vérifier explicitement la suppression/absence de transmission automatique et la reproductibilité de l'export.

**P2 · Accessibilité et ergonomie.** Contrôle clavier, lecteurs d'écran, contraste, affichage clair/sombre/vidéoprojecteur et compatibilité des mobiles. NumWorks reste optionnelle et ne doit pas être obligatoire pour évaluer l'idée mathématique.

## Recette technique à relancer

```powershell
git switch feature/academy-pedagogie-microduck-r1
git pull --ff-only
npm run build
npx playwright test "microduck-introduction-softmax-r1|microduck-softmax-evidence-r2" --reporter=list
```

**Résultat attendu : 8 tests ; pas encore constaté.** Après réception des résultats, enregistrer les succès/échecs effectifs sans les anticiper.

## Décision

**Feu vert pour une expérimentation pédagogique encadrée sur la branche pilote**, après succès de G-T, sans changement de `main`. **Pas de fusion ni publication officielle** tant que G-P, G-E et G-D n'ont pas été franchies. Pour une publication officielle, ajouter le contrôle d'accessibilité et le traitement des données.
