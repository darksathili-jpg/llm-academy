# LLM Academy — audit drastique V4, preuves et limites

**Base auditée :** V3 `0331c9458e8896289636f4d7ba4d7d19fa95b5bd` ; branche de correction `refonte/qualification-pedagogique-v4`. L'audit porte sur les fichiers de contenu, les missions Python, la progression, les scénarios formateurs et les tests du dépôt. Il **ne vaut pas observation directe d'élèves ni expertise d'accessibilité assistive ou essai sur vidéoprojecteur physique**.

## Verdict intermédiaire

La V3 disposait d'une architecture et de tests automatisés robustes, mais plusieurs dispositifs ont été améliorés au titre de la V4 :

- **P0 pédagogique** : mêmes prérequis Python pour les dix investigations, y compris les tâches accessibles sans Python. Résolu avec des prérequis propres à chaque activité.
- **P1 progression** : dix modules affichés sur un plan unique, sans repérer les mécanismes mathématiques avancés. Résolu en un parcours conseillé de sept investigations accessibles, suivi de trois approfondissements explicites, sans prétendre que les LLM soient exigibles en NSI.
- **P1 qualité scientifique** : le défi de normalisation acceptait une masse négative si la somme restait positive ; la recherche par sous-chaîne acceptait une recherche vide, renvoyant tous les documents. Corrigé, nouveaux cas limites testables.
- **P1 ingénierie pédagogique** : modalités de travail attribuées selon le rang du scénario plutôt que l'objectif. Résolu par modalités explicites liées aux activités.
- **P1 formation** : aucun ensemble de trois séances NSI complètes et directement imprimables pour les deux publics. Résolu par trois déroulements de 60 minutes, fiches enseignant **avec** corrigés et fiches participant **sans** corrigés, routes distinctes.
- **P2 non levé** : efficience des consignes, compréhension autonome, conformité clavier/lecteur d'écran, typographies projetées et transfert réel. Nécessitent des essais humains.

## Audit activité par activité

| Investigation   | Ce qui doit être compris                                     | Risque à combattre                                                              | Décision V4                                                                                                            |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Crédibilité     | Une affirmation se confronte à un passage de référence       | Une formulation assurée serait une preuve                                       | Prérequis documentaires puis dictionnaire Python ; classifieur explicitement limité à des faits fournis                |
| Tokens          | Le découpage dépend des fusions et du vocabulaire            | Un token serait toujours un mot ; le comptage des paires constituerait tout BPE | Découverte visuelle avant code ; consigne Python distingue comptage de paires et construction d'un tokenizer           |
| Probabilités    | La répartition des choix n'est pas une confiance de vérité   | Confondre probabilité de choix et véracité ; confondre normalisation et softmax | Prévision sur barres puis pourcentages ; rejet des poids négatifs, nuls ou non utilisables ; limite du modèle indiquée |
| Contexte        | Une suite prédite dépend du texte déjà présent               | Deux listes préparées seraient la preuve d'un LLM comprenant les personnages    | Changement d'un seul paramètre ; entraînement réel non revendiqué                                                      |
| Représentations | Une projection peut masquer une différence                   | Le plan à deux coordonnées rendrait deux objets réellement identiques           | Reportée dans l'approfondissement ; vecteurs inventés et cosinus hors programme                                        |
| Attention       | La position calculée ne doit pas consulter les suivantes     | Le « masque » serait une activité de pensée ou d'apprentissage                  | Reportée dans l'approfondissement ; masque causal, tableaux et indices avant Q/K/V                                     |
| Apprentissage   | La mesure hors entraînement teste une généralisation limitée | Un score d'entraînement meilleur prouverait la vérité                           | Reportée dans l'approfondissement ; code Python de taux d'erreur distinct de la perte d'entraînement                   |
| Génération      | Même graine et mêmes réglages reproduisent un tirage         | Température et top-k changeraient les paramètres du réseau                      | Distinguer les vingt choix indépendants d'une génération autorégressive ; borne négative refusée dans le défi          |
| Erreurs         | « Contredit » diffère de « non documenté »                   | Une valeur absente serait fausse                                                | Exercices centrés sur les extraits, puis transfert vers une autre source                                               |
| Fiabilité       | Rechercher des passages n'est ni comprendre ni prouver       | Premier résultat ou score TF-IDF serait une vérité                              | Recherche vide refusée ; sous-chaîne et faux positifs explicités ; RAG lexical sans génération                         |

## Architecture pédagogique retenue

La première visite conserve une découverte sans code. Le parcours conseillé progresse ainsi :

**Sept activités de découverte :** crédibilité → tokens → probabilités → contexte → génération → erreurs → fiabilité.

**Trois approfondissements facultatifs :** représentations → attention → apprentissage.

Cette structure n'affirme pas que les mécanismes d'attention, l'entraînement par gradients ou les embeddings sont des attentes du baccalauréat de NSI. Les prolongements Python, en revanche, manipulent chaînes de caractères, listes, dictionnaires, fonctions, boucles bornées, expressions conditionnelles et assertions. Employer systématiquement : « affecter une valeur à une variable », « variable de type entier », « boucle bornée », « instruction ».

## Trois séances prêtes à animer

1. **Une réponse probable n'est pas nécessairement vraie — 60 min.** Hypothèse, comparaison à une source, réglage de probabilité, fonction Python, transfert.
2. **Des caractères aux choix de mots — 60 min.** Tokenisation simplifiée, comptage de paires adjacentes, vingt tirages reproductibles, programme Python et transfert.
3. **Vérifier, rechercher et savoir s'abstenir — 60 min.** Preuve/contradiction/absence, recherche lexicale, cas positif/négatif, recherche vide, faux positifs et synthèse.

Routes : `#/enseignant` (préparation), `#/seance/<id>` (fiche formateur avec réponses), `#/fiche/<id>` (fiche participant sans réponses). Les temps sont planifiés, non mesurés en classe.

**Attention :** la séparation formateur/participant est **une séparation d'affichage et d'impression**, pas un contrôle d'accès. Le site n'a pas de connexion enseignant : les corrigés du dossier public restent consultables par tout utilisateur. Ne pas présenter la fiche participant comme sécurisée contre la consultation des solutions.

## Contrat de qualité technique

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

L'outil de test Python exécute les dix corrigés et leurs assertions. Les scénarios de navigateur doivent couvrir la séparation de la fiche participant, les parcours, la projection et l'accessibilité automatisée. **Ne jamais transformer une CI verte en certificat de compréhension ou WCAG.**

## Protocole d'observation à exécuter avant validation pédagogique

**Profil élève novice Terminale NSI** : ouvrir la découverte sans aide orale ; relever les termes incompris, la prédiction avant manipulation, le paramètre effectivement modifié, la qualité de la réponse libre, l'usage autonome des cas limites Python, une réponse de transfert réellement nouvelle.

**Profil enseignant de NSI novice sur les LLM** : préparer une séance depuis la fiche ; expliquer pourquoi le laboratoire n'est pas un LLM de production ; conduire deux manipulations ; identifier une mauvaise interprétation possible ; distinguer fiche corrigée et fiche participant ; produire une remédiation avant de lire le corrigé.

**Accessibilité et déploiement** : tester au clavier complet, lecteur d'écran, mobile, fond de salle sur projecteur réel, environnement hors ligne, puis Firefox et Safari si disponibles. Les tests axe automatisés ne couvrent pas ces usages.

**Critère de décision** : suspendre la fusion si une erreur scientifique, une consigne incompréhensible, une divulgation des corrigés sur la fiche participant, une régression de navigation ou une perte de données est constatée. Reproduire, corriger, retester puis faire vérifier indépendamment. La validation pédagogique doit être signée par un humain.

## Sources normatives et limites

- [Programmes et ressources NSI — Éduscol](https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g).
- [Cadre d'usage de l'IA en éducation — ministère](https://www.education.gouv.fr/cadre-d-usage-de-l-ia-en-education-450647).
- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/).

Pas de score de « qualité pédagogique / 100 » sans données humaines. Pas de déploiement autorisé par le seul résultat de CI.
