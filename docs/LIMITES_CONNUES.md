# Limites connues — 10 octobre 2026

## Usage et pédagogie

- Aucun essai réel avec élèves, enseignants, groupe de 25 personnes ou vidéoprojecteur physique. Les quatre profils sont des parcours automatisés hypothétiques. Les durées des stages et activités sont des propositions.
- Les écrits libres ont des grilles de relecture et restent à évaluer humainement. Les étapes visitées et les résultats fermés ne certifient pas une compétence.
- Les cas disciplinaires sont originaux et explicitement fictifs ou entièrement définis par les sources du dossier.
- Le contenu scientifique avancé conserve une charge cognitive élevée ; il est séparé du parcours intuitif. Les neuf modules approfondis restent disponibles ; les trois derniers modules de la collection initiale ne sont pas encore rédigés.

## Simulations

- Pas de LLM de production dans le navigateur. Deux tables fixes illustrent le contexte dans le prédicteur ; le réseau réellement entraîné est un bigramme neural.
- Les vecteurs et poids du bloc Transformer sont inventés. L'attention n'est pas une explication exhaustive du raisonnement.
- Les tirages intuitifs sont indépendants sur une distribution fixe. Le laboratoire scientifique propose une génération autoregressive réduite.
- Le mini-RAG est lexical TF-IDF/cosinus, avec réponse extractive citée. Il ne comprend pas les négations, synonymes ou relations sémantiques comme un modèle de langage. Les scores n'établissent pas la vérité.
- Le prompting utilise des réponses préparées et ne mesure automatiquement que la forme.

## Navigateur et données

- Tests Chromium exécutés ; Firefox, Safari, lecteurs d'écran et matériel de projection restent à vérifier. Axe sans violation ne constitue pas une certification WCAG.
- Cache utilisable après téléchargement complet. Une première visite hors ligne ne peut pas installer l'application. Les mises à jour peuvent attendre la fermeture des anciens onglets.
- Pyodide est externe, facultatif et non précaché : connexion au premier chargement, requêtes techniques au CDN, sans transmission du code par l'interface. Code .py et expériences TypeScript en repli.
- Worker isolé, délais et tailles bornés, interfaces réseau usuelles bloquées ; pas de preuve de sécurité absolue pour code hostile ni quota mémoire ferme.
- Une séance active par navigateur. Étape, horloges, zoom et révélation reprennent au rechargement. Les paramètres de prédiction/sampling persistent ; les états d'entraînement et autres expériences complexes persistent pendant la console mais repartent de zéro après fermeture.
- Les horloges tournent pendant la fermeture lorsqu'elles étaient en marche. Mettre en pause avant une interruption sans temps écoulé.
- Les notes privées sont dans les Coulisses, jamais lues par Projection ni incluses dans les exports. Un partage de bureau entier peut néanmoins montrer la fenêtre privée : le navigateur ne connaît pas l'écran partagé.
- Carnet JSON version 4, imports 1/2/3 migrés ; limite 2 Mo cohérente avec les longueurs Unicode autorisées. Stockage local effaçable par le navigateur ; exporter les traces importantes.

## Avant publication

La branche dédiée n'est pas fusionnée dans main et aucune publication V2 n'est revendiquée. Faire relire le rapport, tester sur le matériel cible puis autoriser la fusion. Le workflow doit ensuite réussir sur GitHub Actions/Linux, suivi du contrôle public scripts/verify-live.mjs. Les preuves locales ne remplacent pas ce contrôle du domaine publié.
