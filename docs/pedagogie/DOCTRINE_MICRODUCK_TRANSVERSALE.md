# Doctrine pédagogique transversale Microduck — LLM Academy

**Décision du 31 octobre 2026 :** généraliser Microduck comme médiateur d'apprentissage à **tout le cursus**, pas comme décoration systématique. La V4 gelée et le site principal restent intacts.

## Validation de départ

L'utilisateur rapporte `npm run build` réussi (88 modules, avertissement non bloquant de chunk de 521 Ko) et `2 passed (9.2s)` pour `tests/e2e/microduck-attention-r1.spec.ts`. Tests réalisés sur son poste, non relancés par l'assistant. Validation technique ciblée, pas encore réception pédagogique.

## Contrat de chaque module

Chaque chapitre doit fournir : (1) question concrète formulée avec Microduck ; (2) hypothèse **avant** dévoilement ; (3) manipulation où le personnage incarne un état correctement défini ; (4) correspondance explicite avec données/calculs réels ; (5) formalisation progressive en français rigoureux et code Python ; (6) erreur caractéristique et remédiation ; (7) transfert inédit sans Microduck ; (8) fiche enseignant, preuve de maîtrise et limites.

Microduck **ne pense pas à la place du Transformer**, ne remplace pas les données et ne certifie pas un élève. Le principe d'effacement progressif des aides est obligatoire. Démontrer la plus-value du personnage par essai comparatif, pas par postulat.

## Cartographie exhaustive des chapitres V4

| Chapitre | Mission Microduck proposée | Relation scientifique non négociable |
|---|---|---|
| 01 Sources | Microduck enquête sur des affirmations contradictoires | Faits établis, non établis, contradictoires ; preuve et provenance |
| 02 Tokens | Il découpe une inscription selon les règles du tokenizer | Token ≠ mot ; segmentation exacte observable |
| 03 Softmax | Il compare plusieurs issues pondérées avant tirage | Scores, normalisation, température ; probabilité ≠ vérité |
| 04 Masque causal | Il avance dans une séquence et constate les positions accessibles | j ≤ i, futur inaccessible, personnage = repère d'indice |
| 05 Entraînement | Il observe prédiction → perte → correction → nouvelle prédiction | Vrais paramètres, séparation entraînement/validation |
| 06 Recherche/RAG | Il cherche des documents et vérifie leurs sources | Recherche de sous-chaîne ≠ pertinence ; récupération ≠ exactitude |
| 07 Données | Il trie des corpus et détecte des doublons/fuites | Séparation par unités pertinentes et contamination potentielle |
| 08 Embeddings | Il compare des vecteurs selon leurs coordonnées | Produit scalaire/normes/cosinus ; aucune synonymie garantie |
| 09 Attention | Il interroge les positions autorisées et observe les poids | Q/K/V, masque, softmax, somme pondérée, résultats réels |
| 10 Transformer | Il suit la circulation d'une représentation à travers les blocs | Embeddings, positions, résidu, attention, FFN et logits |
| 11 Gradient | Il expérimente une mise à jour de paramètres et ses effets | Dérivée, gradient, descente, perte réelle ; pas d'analogie trompeuse |
| 12 Génération | Il confronte plusieurs sorties de distributions apprises | Température, top-k, graine, probabilités du modèle |
| 13 LoRA | Il examine les dimensions et les paramètres mis à jour | Rang, matrices, coûts, limites du comptage |
| 14 Prompting | Il négocie un contrat de réponse vérifiable | Format valide ≠ information vraie ; injection et robustesse |
| 15 Évaluation | Il teste des réponses nouvelles, compte les erreurs | Matrice de confusion, précision, rappel, biais, transfert |

## Identité et accessibilité

- Utiliser le **sprite officiel fourni ou validé**, sans SVG de substitution et sans personnage générique. Tant que son asset exact n'est pas identifié, la mission conserve un repère textuel honnêtement signalé comme temporaire.
- Toutes les animations ont une alternative textuelle et un mode mouvement réduit, des commandes clavier, un contraste vérifié en clair/sombre/vidéoprojecteur.
- Synchroniser déplacement et évolution d'état : une action = une conséquence observable ; pas d'animation décorative qui suggère une opération inexistante.
- Ne pas introduire d'obstacle ludique superflu avant le contenu ; inclure une option « aller directement au mécanisme ».
- Vocabulaire NSI conforme : variable de type entier, affecter une valeur à une variable, boucle bornée, instruction.

## Gates communs

G0 doctrine et asset vérifiés ; G1 scénario/erreurs/objectif défini ; G2 calcul oracle indépendant ; G3 contrôle Playwright et clavier ; G4 lecture enseignant ; G5 essai novice et transfert différé ; G6 diffusion contrôlée.

**Priorité :** consolider l'attention causale, puis construire des prototypes des modules 02 (tokenisation) et 03 (probabilités) pour valider la réutilisabilité du dispositif avant de refondre l'ensemble des quinze chapitres.

**Statut : doctrine publiée, généralisation des quinze parcours pas encore développée.**
