# Recette de l'intégration Microduck V2

Branche : `feature/academy-pedagogie-microduck-r1`. Le pilote gelé V4 et `main` sont exclus du périmètre.

## Origine des ressources
Kit de la conversation : `microduck_mission_v2.zip` (12 sprites PNG 256×256 avec transparence, un `index.html` et un `README.md`). Les fichiers binaires doivent être présents localement avant installation ; le commit des scripts/tests ne constitue pas leur présence sur GitHub.

## Installation contrôlée Windows
Depuis la racine `llm-academy-v4`, sur la branche cible, conserver le ZIP dans `Téléchargements` et exécuter :
```powershell
git fetch origin
git switch feature/academy-pedagogie-microduck-r1
git pull --ff-only
.\scripts\install-microduck-v2.ps1
npm run build
npx playwright test tests/e2e/microduck-attention-v2.spec.ts --reporter=list
```
Si la politique PowerShell bloque le script, depuis la même racine :
```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-microduck-v2.ps1
```
L'installateur refuse d'écraser une destination existante et vérifie présence/dimensions des 12 sprites. Si le ZIP n'a pas pu être téléchargé, cette procédure est **bloquée** ; ne pas créer d'images approximatives.

Après recette réussie, publier les 14 fichiers installés (12 PNG, HTML, README) dans `public/pilotes/microduck-attention-v2/` par un commit normal sur la branche cible, sans modifier les références publiques.

```powershell
git add public/pilotes/microduck-attention-v2/
git commit -m "feat(microduck): intégrer mission causale V2 et sprites officiels"
git push origin feature/academy-pedagogie-microduck-r1
```

URL locale Vite : `http://127.0.0.1:5173/llm-academy/pilotes/microduck-attention-v2/index.html`.

## Gate de réception
- PNG chargés sans erreur, dimensions 256×256 ;
- 1 sprite visible (pas de clones) ;
- prédiction obligatoire avant dévoilement ;
- masque triangulaire 21 cases autorisées, 15 interdites sur 6 positions ;
- possibilité de consulter le statut d'une cellule au clavier ;
- contrôle du mouvement réduit et stabilité de l'échelle ;
- transfert à l'indice 6 sur 10 positions = 7, justification humaine ;
- tests Playwright verts et essai manuel sur navigateur.

**Statut actuel : préparation des scripts et tests, pas de publication des binaires ni de recette confirmée.**
