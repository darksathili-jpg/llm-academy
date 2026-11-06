# Grille d'évaluation et protocole de recette humaine — Softmax R2

**État au 6 novembre 2026 :** document de recette, sans résultats d'élèves ni résultats Playwright R2 confirmés. **Publication pédagogique BLOQUÉE**.

## Objectif

Une réussite des tests Chromium prouve le fonctionnement prévu de l'interface, pas la compréhension du mécanisme. La recette doit comparer la première réponse non aidée, la correction après rétroaction et un transfert différé.

**Déroulement :** démonstration et exploration libres ; puis deux défis N4 avec calculatrice facultative et sans indice méthodologique ; enfin N5. L'élève exporte volontairement sa trace JSON et l'enseignant examine les justifications. Ne demander aucun nom dans la trace ; organiser le recueil selon les règles de l'établissement. Les temps et les identités ne sont pas enregistrés automatiquement.

## Barème élève NSI — 20 points

| Critère | Points | Preuve exigée |
|---|---:|---|
| N4-A : normalisation des scores (2,0,-1), T=2 | 4 | Valeurs `0,6285 ; 0,2312 ; 0,1402` ± arrondi et somme ≈ 1 |
| N4-A : justification | 3 | Division par T, exponentielles stabilisées possibles, normalisation, probabilités ≠ vérité |
| N4-B : retrouver T pour scores (2,0) et pA=0,80 | 4 | `T = 2/ln(4) ≈ 1,4427` ; vérifier par softmax |
| N4-B : raisonnement et contrôle | 3 | Définir les deux issues, établir un rapport, contrôler T > 0 et l'ordre des probabilités |
| N5 : analyse critique | 4 | Débordement numérique de `exp(1000)`, translation commune invariante, soustraction du maximum, test |
| Expression et limites scientifiques | 2 | Distinction scores/probabilités/vérité, limites des flottants et incertitude justifiée |

**Qualification formative :** 14/20 peut guider la remédiation, mais **ne suffit pas à certifier** une autonomie si N4-B ou N5 est absent ou si la première tentative n'est pas indépendante. Un seuil numérique n'est jamais une preuve isolée.

## Complément enseignant NSI — 10 points

| Critère | Points | Preuve exigée |
|---|---:|---|
| Deux obstacles distincts et vraisemblables | 3 | Identifier la confusion score/probabilité et une erreur numérique ou logique séparée |
| Remédiation active | 3 | L'élève doit prévoir, expérimenter puis expliquer ; éviter la simple répétition du cours |
| Nouvel item de difficulté différente | 2 | Paramètres/contexte nouveaux, erreur typique analysée, correction vérifiable |
| Critères d'évaluation et limites | 2 | Barème clair, distinction test logiciel/maîtrise, correctifs scientifiques justifiés |

**Exigence cumulative :** un enseignant doit aussi résoudre et justifier l'intégralité du barème élève. Le complément ne remplace pas les compétences scientifiques.

## Registre des erreurs et remédiations

| Code | Observation | Vérification | Remédiation |
|---|---|---|---|
| E1 | Le score 2 est lu comme 200 % ou 100 % | Demander si la somme des scores doit valoir 1 | Comparer scores puis probabilités, sans nommer d'abord la méthode |
| E2 | La température est ajoutée au score au lieu de diviser | Calculer avec T=1 et T=2 et décrire l'aplatissement | Expérimenter puis faire écrire s/T |
| E3 | T=0 est proposé | Vérifier le domaine de définition et la division | Étudier la limite T→0⁺, pas une division par zéro |
| E4 | Oubli de normaliser | Vérifier la somme des trois poids | Calculer les exponentielles, leur somme et chaque quotient |
| E5 | Décalage commun censé modifier la distribution | Comparer scores (2,1,0) et (1002,1001,1000) | Factoriser les exponentielles et contrôler numériquement |
| E6 | Le calcul de exp(1000) est jugé sans risque | Exécuter un cas numérique extrême et vérifier la finitude | Soustraire le maximum avant exponentielle |
| E7 | « Probabilité élevée » = « réponse vraie » | Proposer une sortie fausse avec score élevé | Distinguer préférence statistique, calibration et véracité |
| E8 | Le texte de justification est long mais incorrect | Confronter chacune des opérations et hypothèses au calcul | Correction humaine argumentée ; ne pas noter la longueur |

## Définition précise des preuves

- **Premier essai :** la trace exportée conserve les valeurs proposées et le texte avant tout affichage des bonnes valeurs numériques. La remédiation peut ensuite afficher les résultats attendus lors d'une nouvelle tentative N4-A.
- **Deuxième essai :** vérifier si l'apprenant a identifié la nature de son erreur ou simplement recopié un corrigé.
- **Évaluation différée :** après 7 à 14 jours, proposer des données inédites. Par exemple deux scores (1, −1), cible pA=0,75 (oracle T=2/ln(3) ≈ 1,82048) et un scénario d'erreur numérique différent.
- **Reproductibilité :** conserver séparément le barème, le journal de tests, les productions anonymisées si autorisées et la décision humaine.
- **Admissibilité d'une preuve :** une justification de cinquante caractères ne prouve aucune compétence ; elle déclenche seulement l'examen par l'enseignant.

## Réception et décision

| Porte | Condition | État |
|---|---|---|
| G-T | Tests Playwright et erreurs JavaScript | **NON VÉRIFIÉ** depuis les ajouts R2 |
| G-M | Calculs et oracles revus indépendamment | **À CONTRÔLER** |
| G-P | Débutant peut reformuler puis transférer sur les deux N4 | **NON RÉALISÉ** |
| G-E | Enseignant résout la partie scientifique et produit une remédiation | **NON RÉALISÉ** |
| G-D | Réussite différée sur données nouvelles | **NON RÉALISÉ** |

**Décision :** ne pas fusionner `main`, ne pas publier officiellement, ne pas attribuer une validation pédagogique tant que ces cinq portes ne sont pas franchies.
