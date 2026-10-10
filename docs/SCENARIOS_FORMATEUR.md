# Conduire une formation avec LLM / — V2

## Avant la séance

Choisir Studio formateur → 1, 2, 3 ou 6 heures. Chaque page contient objectifs, prérequis, matériel, préparation, productions et déroulé. Ouvrir les réponses attendues seulement pour préparer. Exporter la fiche de conduite HTML : elle est imprimable, complète et contient les corrections préparées. Exporter séparément la fiche participant, sans corrections ni notes privées.

Matériel : ordinateur + vidéoprojecteur, navigateur récent ; un ordinateur par binôme si possible. Les participants peuvent aussi écrire leurs hypothèses sur papier. Les séances ne demandent ni compte ni programmation. Python et les matrices restent des approfondissements facultatifs.

Charger le site avec une connexion et attendre le cache. Vérifier le rechargement hors ligne avant le stage. Si Python est prévu, tester son chargement externe et garder le fichier .py en repli. Vérifier la taille réelle des caractères depuis le fond de la salle : une capture ne remplace pas ce contrôle.

## Déroulements prêts à utiliser

| Format | Déroulement en minutes                                                                                                                                                                                         | Total |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----: |
| 1 h    | ouverture 5 ; prédiction 10 ; tokens 10 ; génération 10 ; erreurs 15 ; synthèse 10                                                                                                                             |    60 |
| 2 h    | ouverture 10 ; prédiction 15 ; tokens 20 ; génération 15 ; erreurs 25 ; prompting 20 ; synthèse 15                                                                                                             |   120 |
| 3 h    | ouverture 10 ; prédiction 20 ; tokens 20 ; attention 20 ; apprentissage 25 ; erreurs 25 ; prompting 20 ; RAG 25 ; synthèse 15                                                                                  |   180 |
| 6 h    | ouverture 15 ; prédiction 20 ; tokens 25 ; contexte 20 ; vecteurs 20 ; pause 15 ; attention 25 ; apprentissage 30 ; génération 25 ; pause 30 ; erreurs 30 ; prompting 25 ; RAG 40 ; transfert 30 ; synthèse 10 |   360 |

Le stage de six heures inclut 45 minutes de pause. Ces temps sont proposés, pas mesurés auprès d'un groupe. Les activités alternent individuel, binômes et collectif ; la fiche de conduite précise une question orale, une réponse attendue, une production et les erreurs fréquentes à chaque étape.

## Console et projection

Ouvrir la console depuis la fiche. Afficher d'abord la consigne et la question orale, recueillir une hypothèse, puis ouvrir la démonstration. Les paramètres de prédiction et de sampling sont conservés localement. Les expériences visitées restent montées pendant cette console : revenir à une étape retrouve sa démonstration.

Deux horloges à timestamps : séance et activité. La commande principale démarre/met en pause les deux ; la commande activité peut agir séparément. Changer d'étape remet l'horloge d'activité à zéro. Recharger reprend l'étape, le zoom, la révélation et les horloges. Une horloge en marche continue pendant la fermeture : mettre en pause pour une interruption sans temps écoulé.

Révéler la réponse dévoile une première phrase ; Compléter affiche la suite ; Masquer revient à la consigne seule. Changer d'étape masque à nouveau. Flèches gauche/droite : étapes ; Espace : chrono hors champs et commandes focalisées ; R : cycle de révélation. Les commandes restent accessibles au clavier.

Plein écran utilise l'API du navigateur, avec message de repli. Taille 100/125/150 %. L'écran secondaire est facultatif. Ouvrir Projection dans une autre fenêtre ; les étapes et horloges sont synchronisées par stockage local, entre fenêtres de même origine.

## Notes privées

Les Coulisses sont une fenêtre séparée. Garder cette fenêtre hors de l'écran partagé. La console et Projection ne lisent jamais la clé privée, et les exports n'incluent aucune note personnelle. Le navigateur ne peut pas détecter que vous partagez tout votre bureau : choisir la bonne fenêtre reste un geste matériel du formateur.

Une seule séance active est sauvegardée par navigateur. Les notes privées persistent séparément. Les sorties et états avancés d'un entraînement ne sont pas restaurés après fermeture ; le carnet des participants, les étapes et horloges le sont. Avant un stage, exporter les traces utiles.

## Cas transdisciplinaires

Lettres : lecture d'un texte original et âge absent du dossier. Mathématiques : périmètre, aire et unité. Histoire-géographie : archives fictives, différence de population et cause non établie. Sciences : deux mesures et généralisation abusive. Langues : traduction d'un horaire et détail absent. NSI : spécification d'une fonction et validité des entrées.

Chaque cas oblige à distinguer étayé, contredit et insuffisant, puis à sélectionner une référence et justifier le lien. Les corrections sont préparées et argumentées ; aucune réponse n'est attribuée à un LLM réel.

Synthèse attendue : un mécanisme, une preuve et une limite. Remettre la fiche participant, le carnet exportable et les références officielles ; privilégier un protocole de vérification à une recette de prompt.
