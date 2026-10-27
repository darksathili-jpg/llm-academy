# LLM Academy — refonte pédagogique NSI V3

> Branche de travail : `refonte/nsi-pedagogie-v3`. Hérite de la V2, sans fusion ni déploiement automatique.

## Mandat et publics

La plateforme doit permettre à un élève de Terminale NSI de comprendre des mécanismes fondamentaux des modèles de langage **en programmant**, et à un enseignant de NSI débutant de préparer une séance rigoureuse, sans prérequis scientifique sur les LLM.

Les mécanismes des LLM ne sont pas des attendus obligatoires du programme officiel de NSI. Les activités s'appuient sur des compétences du programme (types, structures, chaînes, dictionnaires, boucles, algorithmes, fonctions, tests) et explicitent les prolongements hors programme (BPE, logits, réseaux de neurones, attention, gradient, LoRA).

## Changements intégrés à la V2

1. **Dix missions Python NSI** dans `src/content/nsiChallenges.ts`, associées une pour une aux dix investigations. Chaque mission comporte une fonction incomplète, une consigne, un indice, une situation de transfert, des assertions exécutables et un corrigé distinct. Les programmes n'exigent aucune bibliothèque externe.
2. **Une sélection explicite dans l'activité** : démonstration du calcul existant ou « Mission Python NSI ». Le corrigé n'est pas montré sans ouverture volontaire. Le téléchargement `.py` et l'exécution Pyodide restent ceux de la V2, avec leur repli hors réseau.
3. **Un bilan de traces sans fausse certification** : `reviewInvestigation` signale une hypothèse, une observation, une explication ou un transfert absents. Une réponse au QCM ne suffit jamais à annoncer une compétence acquise. Les textes doivent faire l'objet d'une relecture humaine.
4. **Un dossier enseignant accessible dans l'application** (`#/enseignant`) : pour chacune des dix activités, prérequis, déclencheur, conception erronée probable, remédiation, preuves observables, question de transfert et corrigé Python.
5. **Une terminologie d'évaluation plus précise** dans les modules approfondis et l'import du carnet : on parle d'exercices vérifiés, non de maîtrise certifiée.
6. **Des tests de non-régression** : test unitaire sur la présence et l'intégrité pédagogique des missions, E2E sur la navigation du dossier formateur et l'accès au défi Python, script Python exécutant réellement les corrigés et leurs assertions.

## Critères d'acceptation

| Dimension | Critère vérifiable | Preuve attendue |
| --- | --- | --- |
| NSI | Les dix défis sont lisibles, exécutables et corrigés avec du Python standard | `python3 scripts/verify-nsi-challenges.py` |
| Reproductibilité | Toutes les assertions des dix corrigés réussissent | Sortie du script et CI |
| Progression | Le novice peut choisir un exemple complet ; l'élève NSI choisit une mission | Parcours Chromium de l'activité |
| Remédiation | La validation finale montre les traces manquantes sans note automatique | Tests unitaires et E2E |
| Formation | L'enseignant dispose des erreurs typiques et des critères de preuve | Route `#/enseignant` et test E2E |
| Accessibilité | Clavier, contraste, focus, navigation, projection et impression | Tests automatisés **puis essais humains** |
| Publication | La branche est validée et revue avant fusion | CI, comparaison du commit, test du domaine public |

## Vérifications reproductibles

```sh
npm ci
npm run format:check
npm run typecheck
npm test
python3 scripts/verify-nsi-challenges.py
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

Sur GitHub Actions, la publication n'est autorisée que sur `main` ; cette branche reste une proposition technique non publiée.

## Protocole de compréhension (à réaliser humainement)

**Élèves :** laisser découvrir la séquence sans commentaire initial ; relever le besoin d'aide ; demander une prédiction, un résultat observé et une explication du mécanisme ; faire modifier une fonction Python et proposer un cas de test non fourni ; présenter ensuite une situation nouvelle.

**Enseignants novices :** demander la différence entre simulateur et modèle entraîné ; expliquer une manipulation en mots courants ; identifier une conception erronée ; utiliser la fiche pour conduire une démonstration ; vérifier la réponse d'un élève sans s'appuyer seulement sur le QCM.

**Conditions :** plusieurs profils, deux navigateurs au minimum, test clavier complet, vidéoprojecteur physique (vue fond de salle), navigateur sans réseau et essais sur écran étroit.

## Limites conservées

- Pas de véritable LLM moderne entraîné dans le navigateur. Les instruments pédagogiques sont explicitement limités.
- L'exécution des assertions n'évalue que les cas de test prévus ; elle ne prouve ni la correction générale ni la compréhension.
- Le statut « traces prêtes à relire » n'est ni une note ni une certification.
- Les données restent locales et peuvent disparaître si le navigateur est nettoyé. Exporter le carnet.
- Pyodide reste un moteur externe chargé à la demande, sans garantie d'un quota mémoire dur ni environnement certifié pour le code hostile.
- La qualité pédagogique ne peut être déclarée avant un test réel avec des élèves et des enseignants.
- Les trois modules approfondis non encore réalisés ne font pas partie de cette livraison.
