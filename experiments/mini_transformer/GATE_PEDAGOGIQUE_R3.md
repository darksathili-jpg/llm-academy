# Gate pédagogique R3 — ne plus livrer de page vide

**Statut : spécification de correction, non implémentée.** La capture utilisateur a montré que le gabarit HTML sans données laisse deux panneaux vides. Le correctif de diagnostic ne suffit pas.

## Contrat de livraison

- Fournir un **unique point d'entrée pour l'apprenant**, sans nécessité de comprendre ou ouvrir un fichier `template`.
- En cas d'absence d'export PyTorch, remplacer les panneaux par une erreur visible et des instructions précises ; jamais d'interface vide.
- Une première étape explicite « Qu'est-ce qu'une ligne ? » : index de la position qui consulte.
- Une deuxième « Qu'est-ce qu'une colonne ? » : position consultée, futur masqué.
- Une troisième « Que mesure la couleur ? » : poids d'attention calculé ; somme sur positions autorisées = 1 ; poids != explication causale et != probabilité du prochain caractère.
- Avant/après entraînement : conserver le même texte, le même modèle initial et afficher le nombre d'étapes. Ne pas promettre un effet systématique sur chaque cellule.
- La comparaison doit être **testée dans Chromium**, et non uniquement vérifiée par des tests Python de fichier.
- Transfert : expliquer le cas de l'indice 6 dans une séquence de dix caractères ; justification « indices 0 à 6, soit 7 positions ».

## Gates

G1 : 7 tests PyTorch précédemment rapportés réussis (historique).
G2 : export réel de données + test de contenu.
G3 : ouverture de la page générée dans un navigateur, matrices et probabilités effectivement visibles.
G4 : recette manuelle élève novice, sans explication orale préalable.
G5 : publication indépendante et contrôlée, après validation humaine.

Ne pas modifier la V4 gelée ni la préproduction publique actuelle sans décision explicite.
