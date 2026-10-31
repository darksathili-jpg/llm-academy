# Préproduction indépendante — LLM Academy V4

**Objectif :** publier le pilote HTML autonome sur un dépôt **distinct** `darksathili-jpg/llm-academy-v4-preproduction`, sans changer les réglages Pages du dépôt `llm-academy`.

## Périmètre et sécurité

- Source gelée : `v4-pilote-retrouve-20261030` / `b7ef6521de29097297d0a1e9550aecf5bc829b2d`.
- Fichier à publier : `public/pilotes/formation-v4/index.html` renommé `index.html` dans le nouveau dépôt.
- Le pilote autonome comprend MathJax embarqué et le code d'atelier. L'application React principale et ses dépendances Vite ne sont **pas** copiées.
- Rien ne modifie `main`, les Pages existantes, ni le tag source.
- Cette page est publique si GitHub Pages est activé : ne pas y saisir de données nominatives ou confidentielles d'élèves.

## Création minimale (nécessite l'action du propriétaire GitHub)

1. Créer sur GitHub un nouveau dépôt public vide nommé `llm-academy-v4-preproduction` sous `darksathili-jpg`, **sans** README, `.gitignore` ou licence initialisés.
2. Dans PowerShell Windows **hors bac à sable Codex**, depuis le projet local, utiliser le script `prepare_v4_preproduction.ps1` fourni séparément ; le script vérifie que la copie locale du pilote est identique au blob du tag et refuse d'écraser un répertoire non vide.
3. Dans le dossier de sortie, exécuter :

```powershell
cd C:\Users\tsaut\llm-academy-v4-preproduction
git init -b main
git add index.html .nojekyll README.md
git commit -m "chore: publier le pilote V4 gelé en préproduction"
git remote add origin https://github.com/darksathili-jpg/llm-academy-v4-preproduction.git
git push -u origin main
```

4. Dans **le nouveau dépôt uniquement** : Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.
5. Lorsque GitHub confirme la publication, vérifier l'URL attendue `https://darksathili-jpg.github.io/llm-academy-v4-preproduction/` et contrôler navigation, MathJax, console, projection et stockage. **Ne pas annoncer cette URL comme active avant cette vérification**.

## Recette avant partage aux testeurs

- Aucune erreur bloquante dans la console.
- 15 chapitres accessibles, mode enseignant, manipulation, évaluation et rendu mathématique.
- Test à 320/390/768/1440 px et sur vidéoprojecteur réel.
- Texte d'information : environnement expérimental, aucune certification, aucun modèle entraîné, Python à exécuter hors navigateur.
- Ne pas recueillir de noms, adresses email ou données personnelles des élèves.
- Retours anonymes/agrégés : chapitre, erreur rencontrée, compréhension, temps, aide demandée, transfert inédit.

**Statut : kit et procédure préparés, nouveau dépôt et Pages non créés automatiquement faute d'action de création de dépôt disponible.**
