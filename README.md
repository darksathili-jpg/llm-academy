# LLM / Atelier des machines à langage

## Pilote pédagogique Microduck — accès complet sur cette branche

**Branche de recette :** `feature/academy-pedagogie-microduck-r1`. Cette version **n'est pas fusionnée dans `main`**, et son paquet n'est pas le site public officiel.

**[Ouvrir le portail des missions dans le dépôt](public/pilotes/index.html)** (source HTML ; GitHub affiche le code, et non l'activité exécutée). Le portail rassemble les activités disponibles dans l'ordre conseillé : tokenisation, embeddings, softmax, masque causal, démystification de l'attention, Q/K/V et évaluation N0–N5.

### Voir l'interface fonctionner en local

```powershell
git switch feature/academy-pedagogie-microduck-r1
git pull --ff-only
npm ci
npm run dev
```

**Ouvrir ensuite :** http://localhost:5173/llm-academy/pilotes/index.html

L'accès direct à la **Softmax R2** est http://localhost:5173/llm-academy/pilotes/microduck-introduction-softmax-r1/index.html (le dossier conserve le suffixe `r1` pour éviter de casser les liens et tests existants).

### Publier un vrai site HTTPS pour les élèves (préproduction indépendante)

Le paquet GitHub Actions ci-dessous **ne crée pas de site web**. Pour obtenir une URL que des élèves peuvent ouvrir depuis n'importe quel poste, un site GitHub Pages **dans un dépôt séparé** est nécessaire. La branche de travail contient le script Windows [`scripts/publish-microduck-pilot.ps1`](scripts/publish-microduck-pilot.ps1), qui publie uniquement les pages statiques de `public/pilotes/`, sans modifier le dépôt `llm-academy` ni son GitHub Pages public.

**Pré-requis :** Git, GitHub CLI (`gh`), puis `gh auth login` si nécessaire. Le script a besoin de droits permettant de créer le dépôt public `darksathili-jpg/llm-academy-pilote` et d'activer GitHub Pages. Il vérifie le contenu obligatoire et refuse de remplacer un dépôt existant non géré par lui.

```powershell
git switch feature/academy-pedagogie-microduck-r1
git pull --ff-only
gh auth status
.\scripts\publish-microduck-pilot.ps1
```

Si PowerShell interdit l'exécution du script, utiliser dans **ce seul terminal** : `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, après lecture de son contenu. Il ne faut pas désactiver les protections globalement.

Après le push et l'activation de Pages, vérifier dans [Settings > Pages du dépôt pilote](https://github.com/darksathili-jpg/llm-academy-pilote/settings/pages) et ouvrir l'**URL attendue (à vérifier, non encore publiée)** : `https://darksathili-jpg.github.io/llm-academy-pilote/`.

Pour une mise à jour après corrections, réexécuter le même script. Les élèves accèdent aux activités sans GitHub, sans `npm` ni installation locale. **Attention :** GitHub Pages est public ; éviter toute donnée personnelle ou trace pédagogique publiée dans ce dépôt. L'activité conserve l'export JSON en local, mais ne l'envoie pas au serveur.

### Télécharger le paquet compilé depuis GitHub Actions

Le workflow [**Microduck pilot — build and downloadable preview**](.github/workflows/microduck-pilot-preview.yml) génère un artefact `llm-academy-microduck-pilote` depuis cette branche et **ne déploie pas sur GitHub Pages**. Dans l'onglet [Actions du dépôt](https://github.com/darksathili-jpg/llm-academy/actions/workflows/microduck-pilot-preview.yml), ouvrir la dernière exécution **réussie** de ce workflow, puis télécharger l'artefact en bas de la page. Une connexion GitHub peut être nécessaire pour le téléchargement ; l'archive n'est pas une URL de démonstration hébergée.

Le paquet `dist/` contient l'application compilée et les pilotes ; pour l'afficher correctement sous le préfixe `/llm-academy/`, le plus simple est de travailler depuis le dépôt après `npm run build`, puis `npm run preview` et ouvrir http://127.0.0.1:4173/llm-academy/pilotes/index.html. L'artefact sert à vérifier, conserver et transmettre la construction ; il ne doit pas être ouvert directement par double-clic dans l'Explorateur Windows.

**Attention réelle PyTorch :** la page d'exploration issue d'un modèle entraîné est générée à la demande par `python experiments/mini_transformer/export_microduck_attention.py` ; elle ne figure pas dans le dépôt sous forme d'HTML prêt à publier. Le portail mène donc à une notice honnête et pas à une page manquante.

**Qualification :** recette manuelle Softmax R2 8/8 rapportée et tests automatisés déclarés réussis par l'utilisateur. Le pilote global n'est pas encore qualifié pédagogiquement auprès de débutants ; voir la [grille de recette humaine Softmax R2](docs/pedagogie/GRILLE_RECETTE_HUMAINE_SOFTMAX_R2.md) et le [registre des quinze notions](docs/pedagogie/REGISTRE_QUALIFICATION_15_NOTIONS_R1.md).

---


Plateforme française pour voir, manipuler, programmer et expliquer les mécanismes des modèles de langage.

Qualification pédagogique V4 sur `refonte/qualification-pedagogique-v4`, construite sur la V3. La branche n'est pas fusionnée dans `main`. Sa publication de démonstration se fait directement par GitHub Actions, sous réserve de la configuration de GitHub Pages.

## Formation enseignant V5 en préparation (non publiée)

Quatre cours autonomes ont été rédigés dans [docs/formation-enseignant/](docs/formation-enseignant/README.md) : fonctionnement d'un modèle de langage, tokenisation et génération, apprentissage et évaluation, puis fiabilité des sources et RAG. Ils comprennent des exemples commentés, des manipulations guidées, un prolongement Python, une évaluation et des corrections argumentées.

**Attention :** ces documents ne sont pas encore intégrés à l'interface enseignant et restent en attente de relectures linguistiques et pédagogiques indépendantes. Le site public V4 demeure inchangé. La [charte éditoriale V5](docs/CHARTE_EDITORIALE_FR_NSI_V5.md) s'applique aux textes et aux exercices.

## Première visite

Commencer par `#/decouvrir` : quatre écrans en langage courant, sans code, pour choisir un mot puis vérifier une réponse. Les dix activités guidées expliquent les termes au voisinage des commandes ; les détails scientifiques restent accessibles. Voir [la reprise après retour enseignant](docs/PRISE_EN_MAIN_SIMPLE.md). L’ancienne appréciation de 91/100 ne représente plus une note actuelle d’utilisabilité.

## Trois espaces

- Atelier Terminale NSI : sept activités conseillées pour débuter, trois approfondissements facultatifs ; prérequis différenciés, dix missions Python avec assertions et corrigés distincts.
- Studio formateur : séances de 1/2/3/6 heures, questions orales, corrections progressives, deux chronomètres, reprise, projection, notes privées séparées et fiches imprimables. Dossier pour enseignants débutants : `#/enseignant`. Trois séances de 60 minutes et leurs fiches séparées : `#/seance/<id>` (enseignant avec corrigés) / `#/fiche/<id>` (participant sans corrigés).
- Laboratoire : dix instruments intuitifs/scientifiques ; neuf modules approfondis conservés.

Huit expériences prioritaires : prédiction, BPE, génération, attention, apprentissage neural, détective des hallucinations, prompting et mini-RAG. Les probabilités/gradients/recherches sont calculés ; les scores inventés, textes préparés et approximations sont signalés. Pas de LLM de production local, pas d'API obligatoire.

## Développement

Node 22 et npm. Installation : `npm ci`.

```
npm run dev
npm run format:check
npm run typecheck
npm test
python3 scripts/verify-nsi-challenges.py
npm run build
npx playwright install chromium
npm run test:e2e
```

Preview : `npm run preview`, http://127.0.0.1:4173/llm-academy/. Si PowerShell interprète les arguments npm, utiliser `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort`.

Avec preview actif : `node scripts/verify-profiles-v2.mjs`. Vérification Python réelle facultative avec réseau : `node scripts/verify-python-browser.mjs`. Notebooks CPU/PyTorch : `python scripts/verify-notebooks.py`.

## Données et réseau

Sans compte, télémétrie ni clé API. Carnet local schéma 4 ; anciennes versions migrées ; import/export JSON contrôlé, limite 2 Mo. Les écrits libres ne reçoivent pas de note automatique. Exporter avant d'effacer le navigateur.

Calculs TypeScript et documents locaux hors ligne après mise en cache complète. Pyodide 0.28.3 se télécharge depuis jsDelivr au lancement et reste facultatif. Arrêt/reset, input, sorties bornées et délai de 60 s ; fichier .py en repli. Ce Worker n'est pas présenté comme un environnement certifié pour code hostile.

Coulisses privées dans une fenêtre séparée : jamais affichées dans Projection, jamais incluses dans les fiches. Éviter le partage du bureau complet.

## Documentation

[Audit V4 activité par activité](docs/AUDIT_PEDAGOGIQUE_V4.md) et [refonte pédagogique NSI V3](docs/REFONTE_NSI_V3.md). Les dix corrigés Python sont exécutés dans la CI ; cela ne remplace pas une validation en classe.

[Rapport de validation V2](docs/RAPPORT_VALIDATION_V2.md), [guide formateur](docs/SCENARIOS_FORMATEUR.md), [périmètre scientifique](docs/EXPERIENCES_SCIENTIFIQUES.md), [correspondances NSI](docs/PROGRAMME_NSI_CORRESPONDANCES.md), [limites](docs/LIMITES_CONNUES.md), [audit initial](docs/REFONTE_AUDIT_INITIAL.md).

Les durées sont proposées ; les profils testés sont hypothétiques. Aucun essai terrain ni certification WCAG n'est revendiqué. Textes, corpus et figures originaux, références primaires citées ; aucun livre reproduit.

GitHub Pages conservé. Après autorisation de fusion : workflow de validation, publication, puis contrôle du domaine public `node scripts/verify-live.mjs`. Une URL de preview peut être contrôlée avec la variable `LLM_ACADEMY_URL`.

## Publication de démonstration V4 (sans fusion)

Dans [Settings > Pages](https://github.com/darksathili-jpg/llm-academy/settings/pages), choisir **Build and deployment > Source : GitHub Actions**. Ne pas choisir « Deploy from a branch » : la racine de la branche contient le point d'entrée TypeScript de Vite, qui n'est pas directement publiable.

Le workflow `.github/workflows/pages.yml` :

1. vérifie le format, TypeScript, les tests unitaires, les dix corrigés Python et les tests navigateur ;
2. construit `dist/` avec `base: '/llm-academy/'` et refuse une entrée TypeScript non compilée ;
3. autorise la publication uniquement pour un `push` sur `main` ou `refonte/qualification-pedagogique-v4`, jamais pour une Pull Request ;
4. publie l'artefact `dist/` avec `actions/deploy-pages` ;
5. lance `node scripts/verify-live-pages.mjs` dans Chromium contre l'URL réellement publiée, puis contrôle le parcours V4, le dossier enseignant, la fiche participant et l'absence de débordement mobile.

Consulter l'onglet **Actions > Validate and publish LLM Academy**. Si l'étape `publish` refuse la branche, examiner **Settings > Environments > github-pages** : autoriser la branche V4 dans les règles de déploiement. Le site public https://darksathili-jpg.github.io/llm-academy/ est unique : publier V4 remplace temporairement la version actuellement servie, sans fusion Git.

La validation automatique du site en Chromium ne remplace pas une inspection humaine sur vidéoprojecteur, au clavier, avec lecteur d'écran et sur les navigateurs requis.
