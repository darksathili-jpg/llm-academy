# V4-Q2 — Reprise de validation réelle

**Date :** 30 octobre 2026  
**Branche :** `audit/v4-qualification-q1`  
**Référence gelée :** `v4-pilote-retrouve-20261030` / `b7ef652`  
**Verdict actuel : NON VALIDÉ à l'exécution.**

## Réalisation effective

Deux tests Playwright supplémentaires sont ajoutés dans `tests/e2e/formation-v4-q2.spec.ts` :
- ouverture successive des 15 chapitres, trois boutons de réponse, retour et collecte des exceptions JavaScript ;
- contrôle de débordement global sur quatre chapitres représentatifs et quatre largeurs (320, 390, 768, 1440).

Ils reprennent les identifiants déjà présents dans `tests/e2e/formation-v4.spec.ts`. Ils n'affirment pas la conformité pédagogique ni la justesse numérique des laboratoires. **Ces nouveaux tests n'ont pas été exécutés**.

## Limitation d'exécution

L'environnement de cette conversation ne peut pas cloner le dépôt GitHub ni lancer le serveur Vite de l'utilisateur ; la récupération intégrale du grand HTML autonome est également indisponible. Les tests sont donc proposés comme *candidats de non-régression*, sans résultats inventés.

## Commandes de qualification (Windows, depuis llm-academy-v4)

```powershell
git fetch origin
git switch audit/v4-qualification-q1
git pull --ff-only
npm ci
npm run build
npx playwright test tests/e2e/formation-v4.spec.ts tests/e2e/formation-v4-q2.spec.ts --reporter=list
```

À exécuter seulement si l'environnement est autorisé et dispose du navigateur Playwright installé. Si le navigateur manque : `npx playwright install chromium`. Le serveur de test est automatiquement démarré par `playwright.config.ts` via Vite preview après le build.

## Gates non encore franchis

1. Résultats verts des sept tests E2E (cinq préexistants + deux nouveaux), avec traces en cas d'échec.
2. Relecture de l'exactitude des 15 expériences et exécution des 15 scripts Python dans un environnement standard.
3. Audit réel du mode projection, clavier complet, lecteurs d'écran, hors ligne et données stockées.
4. Épreuves pédagogiques avec élèves et enseignants novices, transfert inédit puis différé.

Aucune modification fonctionnelle du pilote, aucune fusion, aucune publication. Le tag reste intact.
