# LLM Academy — reconstruction par simplification

Le dernier mandat utilisateur remplace l’architecture V2 à trois espaces. Dépôt dédié llm-academy ; ne pas toucher formation-ia ni la configuration globale Codex.

## Contrat actuel

Une seule application pour Terminale NSI et enseignants, un seul parcours. Accueil à six expériences, sans jargon. Construire seulement la première : question, hypothèse, manipulation, observation, explication. Python et commandes formateur sont des prolongements de cette même expérience.

Branche simplification/demonstrateur-01 depuis 55dc4aa. Conserver les données et l’historique ; aucun nettoyage destructif, force-push, déploiement ou fusion. Anciennes sources et tests conservés, hors du parcours courant. App.tsx est l’unique entrée applicative ; ne pas ajouter un deuxième shell ni réintroduire les anciens espaces.

## Arrêt obligatoire

Une fois le démonstrateur et les trois maquettes vérifiés, ARRÊTER le développement et attendre une validation humaine explicite. Ne pas construire les cinq autres expériences. Ne pas déployer ni fusionner. Ne pas attribuer une note de compréhension à partir des tests techniques.

## Science et données

Chances préparées 6/3/1 normalisées en 60/30/10 %. Vrais tirages via sample ; aucun LLM entraîné prétendu. Répétitions d’un choix de mot, pas génération d’un texte entier. Les notes de cette expérience utilisent DEMO_KEY ; préserver STORAGE_KEY et les clés antérieures. Ne jamais lire ou exporter les notes privées du formateur.

## Vérification

npm run format:check
npm run typecheck
npm test
npm run build
npx playwright test
npm audit

Playwright sélectionne simplification.spec.ts ; les anciens tests d’interface restent historiques. Inspecter les captures mobile, bureau, projection et les trois maquettes. Optionnel : node scripts/verify-demonstrator.mjs --python avec preview sur 4173. Voir docs/SIMPLIFICATION_DEMONSTRATEUR.md.
