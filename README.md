# LLM Academy — démonstrateur par simplification

Une seule application pour les élèves de Terminale NSI et les enseignants, y compris non informaticiens. Un même parcours, avec deux prolongements facultatifs rattachés à l’expérience : Python et animation pédagogique.

## Périmètre arrêté

Branche locale `simplification/demonstrateur-01`, issue de `55dc4aa`. Accueil à six sujets ; seule l’expérience 01 « Le mot d’après » est construite, en cinq étapes : question, hypothèse, manipulation, observation, explication.

Les cinq autres expériences ne sont pas implémentées dans ce démonstrateur. Aucun déploiement ni fusion avec main. Le développement doit s’arrêter après vérification, jusqu’à validation humaine explicite.

## Essayer localement

Node 22 et dépendances déjà installées :

```powershell
npm run dev
```

Accueil : http://127.0.0.1:5173/llm-academy/
Expérience : http://127.0.0.1:5173/llm-academy/#/experience/01
Maquettes : http://127.0.0.1:5173/llm-academy/#/maquettes

Trois compositions consultables, statiques et explicitement identifiées : La Paillasse, La Revue et La Scène. Le démonstrateur adopte provisoirement La Paillasse ; le choix humain reste ouvert.

## Données et science

Les chances sont préparées : préférences 6/3/1 normalisées en 60/30/10 %. Tirages réels via le moteur existant ; aucune IA entraînée ni vérification factuelle simulée. Chaque essai recommence le même choix de mot.

Les nouvelles notes utilisent une clé distincte ; carnet, réponses, notes privées et historique précédents restent conservés. L’export de l’expérience inclut le carnet antérieur, sans les notes privées du formateur. Pyodide facultatif, à la demande, avec fichier Python en repli.

## Vérification

```
npm run format:check
npm run typecheck
npm test
npm run build
npx playwright test
npm audit
```

Les tests navigateur actifs portent sur le démonstrateur. Les tests des interfaces antérieures restent dans Git et dans les fichiers, mais ne sont plus le contrat d’interface actuel. Les moteurs et migrations historiques restent testés.

Après lancement du preview de production sur 4173 : `node scripts/verify-demonstrator.mjs`, ou `node scripts/verify-demonstrator.mjs --python` pour vérifier aussi Python réel (connexion nécessaire).

[Décisions, preuves et limites](docs/SIMPLIFICATION_DEMONSTRATEUR.md). Les contrôles automatisés ne prouvent pas la compréhension humaine.
