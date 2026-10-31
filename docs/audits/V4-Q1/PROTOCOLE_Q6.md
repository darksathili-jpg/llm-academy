# V4-Q6 — Recette d'usage réel et protocole pédagogique

**Date :** 31 octobre 2026 · **Branche :** `audit/v4-qualification-q1` · **Référence protégée :** `v4-pilote-retrouve-20261030`

## Tests ajoutés — non exécutés à la publication

`tests/e2e/formation-v4-q6-usage.spec.ts` contient cinq scénarios : persistance du rôle enseignant au rechargement et retour élève, bouton projection réversible et `aria-pressed`, ouverture au clavier, état du chapitre pour impression, structure du stockage local `done/role`.

Ce sont des **tests ciblés**, et non un audit WCAG exhaustif ni un test de confidentialité réseau. Le contrôle d'impression vérifie le contenu DOM sous média print mais **pas le rendu papier ou PDF**. Le contrôle clavier vérifie un accès et non un parcours complet. Le contrôle localStorage ne suffit pas à démontrer qu'aucune donnée n'est transmise ailleurs.

## Commandes

```powershell
git pull --ff-only
npm run build
npx playwright test tests/e2e/formation-v4-q6-usage.spec.ts --reporter=list
```

Ne pas modifier le pilote si un test échoue avant triage : erreur d'assertion, comportement attendu ou défaut réel.

## Recette manuelle de classe (à documenter)

| Domaine | Protocole | Preuve |
|---|---|---|
| Modes | Tester lisibilité élève / enseignant / projection sur vidéoprojecteur réel, contraste des mathématiques, menus, champs et corrections | Captures et défauts |
| Clavier | Parcours intégral par Tab/Shift+Tab/Entrée/Espace/Esc ; présence de focus visible et ordre cohérent | Rapport horodaté |
| Lecteur d'écran | Faire parcourir une leçon et une manipulation par utilisateur ou testeur compétent avec NVDA | Difficultés réelles |
| Impression | Imprimer ou générer PDF d'un chapitre avec maths, code et explications ; vérifier pagination | PDF/captures |
| Hors ligne | Charger une fois, couper le réseau, recharger le pilote depuis son chemin servi et accéder aux ressources embarquées | État réseau et résultat |
| Stockage | Terminer un quiz, recharger, confirmer reprise ; effacer uniquement les données du site de test puis confirmer réinitialisation | Copies d'écran avant/après |
| Données | Examiner réseau et stockage pour prouver absence d'envoi nominatif ; qualifier les services tiers éventuels | Journal réseau |
| Matériel lycée | Chrome et Firefox si disponibles, bureau 320/390/768/1440, PC lent, projection | Matrice par équipement |

## Épreuve pédagogique proposée

Au moins un groupe d'élèves novices de Terminale NSI et des enseignants novices, avec consentement et collecte minimale sans noms publics. Diagnostic initial bref, une manipulation guidée, une tâche nouvelle sans aide, une justification écrite et, plusieurs jours plus tard, un exercice différé. Répertorier durée, recours aux indices, erreurs conceptuelles et abandon. Distinguer `quiz réussi` de `compétence transférée` : seul un raisonnement sur une situation inédite constitue un indice de transfert.

## Décision

V4-Q6 **PRÉPARÉE**, aucune exécution de ces cinq nouveaux tests revendiquée. Réception globale non prononcée. Aucune modification de `main`, de la version gelée, du pilote ni de son déploiement.
