# LLM Academy — consignes de reprise

Dépôt dédié : https://github.com/darksathili-jpg/llm-academy. Refonte V2 sur refonte/atelier-v2 ; conserver les changements et le carnet historique.

## Exigences

Français, contenu original, sources primaires datées, simplifications au voisinage des expériences. React/TypeScript strict/Vite, base /llm-academy/. Aucun résultat fictif, score libre inventé ou vrai LLM local prétendu. Trois espaces : atelier NSI, studio formateur prioritaire, laboratoire.

Dix investigations et quatre scénarios disponibles ; neuf modules approfondis, trois cours de la collection initiale encore à venir. Moteurs purs testables. Carnet schéma 4, migrations 1/2/3 et même clé ; imports bornés 2 Mo. Notes privées uniquement en Coulisses : ne jamais les lire dans Projection ni les exporter dans le carnet/fiches.

Pyodide 0.28.3 à la demande en Worker ; code .py en repli ; aucun quota mémoire dur revendiqué. Pas de compte, clé privée, télémétrie ni service LLM obligatoire. Garder clair/sombre/projection/impression, clavier, responsive et hors ligne.

Ne pas copier un livre. Pas de force-push, suppression destructive, modification des réglages globaux Codex ou déploiement non autorisé.

## Validation

npm run format:check
npm run typecheck
npm test
npm run build
npx playwright test
npm audit

Optionnel avec réseau et Python/PyTorch local :
python scripts/verify-notebooks.py
node scripts/verify-python-browser.mjs
node scripts/verify-profiles-v2.mjs

Les scripts navigateur nécessitent le serveur de preview sur 4173. Lire docs/RAPPORT_VALIDATION_V2.md et docs/LIMITES_CONNUES.md. Inspecter les captures, pas seulement les tests. Rapporter les résultats observés en français, les limites et l'état réel de publication.

## Exigence éditoriale prioritaire — français et vocabulaire NSI (V5)

**À lire avant toute rédaction ou modification de l'interface :** `docs/CHARTE_EDITORIALE_FR_NSI_V5.md`.

- **Rédacteur** : utiliser un français rigoureux, fluide et sans ambiguïté ; soigner accords, syntaxe, ponctuation, cohérence du tutoiement ou du vouvoiement et terminologie scientifique. Définir le vocabulaire avant son emploi. Tout sigle ou terme anglais est explicité lors de sa première apparition.
- **Responsable pédagogique NSI** : distinguer clairement cours obligatoire, application de notions NSI et approfondissement hors programme. Employer « variable de type entier », « affecter une valeur à une variable », « boucle bornée » et « instruction » avec précision ; ne pas confondre `return` et `print`.
- **Vérificateur indépendant** : effectuer une relecture linguistique **et** une relecture scientifique avant acceptation, au-delà des tests automatiques. Une consigne grammaticalement correcte mais ambiguë reste non conforme ; une analogie pédagogique scientifiquement trompeuse est bloquante.
- **Orchestrateur** : refuser le statut ACCEPTÉ si le rapport de revue linguistique, la justification scientifique et la lecture par une personne novice ne sont pas documentés. Les agents ne peuvent pas valider seuls la compréhension humaine.
- **Périmètre** : appliquer ces contraintes aux cours, exercices, aides, corrections, évaluations, fiches enseignant et élève, messages d'erreur, boutons et textes d'interface, ainsi qu'à la documentation.
- **Processus** : rédiger → relire la langue → vérifier la science et le vocabulaire NSI → vérifier la compréhension novice → corriger → seulement alors proposer une livraison. Le nombre de tests réussis ne constitue pas une preuve de qualité du français.

Le travail V5 reste sur une branche distincte. Ne pas fusionner ni déployer cette branche sans accord humain explicite.
