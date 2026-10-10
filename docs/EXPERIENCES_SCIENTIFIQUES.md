# Périmètre scientifique effectif — V2

| Instrument              | Mécanisme implémenté                                                                               | Ce qui n'est pas démontré                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Prédiction              | Deux tables de scores inventés, softmax stabilisé avec température                                 | Aucun apprentissage du contexte, aucune vérification factuelle                |
| Tokenizer               | BPE caractères Unicode, fréquences adjacentes, fusions et ID                                       | Pas un tokenizer byte-level industriel                                        |
| Génération intuitive    | Tirages indépendants d'une même distribution, PRNG LCG, T/top-k puis top-p                         | Pas un texte autoregressif ; la graine Python emploie un PRNG différent       |
| Génération scientifique | Réseau bigramme entraîné, trace autoregressive, EOS, LoRA et adaptation complète                   | Ni Transformer entraîné ni qualité linguistique de production                 |
| Attention               | Q/K/V inventés ; QKᵀ/√d, softmax sur positions autorisées, pondération de V                        | Les poids ne constituent pas une explication exhaustive du raisonnement       |
| Apprentissage           | Réseau E(V×d), W(d×V), CE moyenne, gradients analytiques, SGD, écrêtage 5, L2 facultatif           | Dernier token seulement ; ni LLM ni garantie de généralisation                |
| Détective               | Affirmations originales préparées, classement et références corrigés                               | Pas d'analyse sémantique automatique des textes libres                        |
| Prompting               | Réponses préparées éditables, comptage de mots et détection de référence                           | Aucune génération distante ; respect formel ne prouve pas exactitude          |
| Mini-RAG                | Découpage en mots avec chevauchement, TF-IDF, normalisation L2, cosinus, top 3 positifs, citations | Vecteurs lexicaux, pas embeddings sémantiques ; assemblage extractif sans LLM |
| Vecteurs                | Vecteurs inventés, normes, cosinus et projection XY/XZ/YZ                                          | Pas un espace appris, ni un indicateur de vérité                              |
| Transformer             | Bloc pré-LN réduit, positions sin/cos, multi-têtes, FFN ReLU 2d, résidus                           | Poids non entraînés, sans biais/dropout, pas un GPT de production             |

Les niveaux intuitifs présentent les observations avant les matrices. Les niveaux scientifiques gardent calculs, valeurs et limites. La fiche de chaque activité expose objectif, manipulation, observation, explication, erreurs, trois aides, correction, critères, transfert et approfondissement.

## RAG : détails reproductibles

Corpus original fictif, trois documents modifiables. Termes Unicode lettres/chiffres, NFC et minuscules, sans stemming ni suppression des mots fréquents. TF = fréquence brute. IDF = log((1+N)/(1+df))+1 sur les passages, jamais sur les questions. Vecteurs normalisés, cosinus = produit scalaire. Aucun terme connu → vecteur nul → abstention. Aucun seuil positif n'est une garantie de pertinence. Les IDs incluent le document et la position de départ ; les intervalles de mots sont affichés.

Le texte des documents demeure du texte React : une instruction ou une balise script n'est jamais exécutée. Une phrase négative partage des termes avec une phrase positive ; la recherche peut donc se tromper. La grille humaine reste nécessaire.

## Python et notebooks

Pyodide 0.28.3 fournit Python 3.13.2 dans le test navigateur observé. Chargement à la demande, Worker terminé par Arrêter ou au délai de 60 s. input() reçoit les lignes fournies ; sorties bornées, namespace neuf pour chaque exécution. Les interfaces réseau usuelles et les sous-Workers sont bloqués après chargement. Ce n'est pas une preuve d'inviolabilité contre du code hostile ni un quota de mémoire garanti. Le fichier .py est téléchargeable sans moteur ; les calculs TypeScript fonctionnent sans CDN.

Notebooks bigram-lora.ipynb et mini-gpt.ipynb : code original, exécution CPU/PyTorch séparée. Le vérificateur exécute chaque cellule et assertion. Gradients comparés aux différences finies ; poids E/W exactement figés en LoRA ; entraînement, validation et causalité vérifiés.

## Sources primaires, consultées le 10 octobre 2026

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) : attention, scaling, positions et architecture ; les variantes pédagogiques restent explicitement différentes.
- [LoRA](https://arxiv.org/abs/2106.09685) : adaptation de rang faible, base figée et facteur α/r.
- [PyTorch CrossEntropyLoss](https://docs.pytorch.org/docs/2.14/generated/torch.nn.CrossEntropyLoss.html) : cibles et logits avant softmax.
- [Autograd PyTorch](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html) : différentiation et mise à jour ; nos moteurs TypeScript utilisent des gradients analytiques testés.
- [Hugging Face, apprentissage causal](https://huggingface.co/learn/llm-course/chapter7/6) : décalage des cibles.
- [Transformers, génération](https://huggingface.co/docs/transformers/v5.5.3/main_classes/text_generation) : température et filtres ; ordre de filtrage documenté dans notre implémentation.
- [Pyodide Worker](https://pyodide.org/en/0.28.3/usage/webworker.html), [flux et input](https://pyodide.org/en/0.28.3/usage/streams.html) : API de l'exécution choisie.

Savoir établi : normalisation des probabilités, gradients, masque causal. Simplification : poids inventés, très petits corpus, bigramme, réponses préparées. Conception : trois espaces, huit étapes et critères formels. Recommandation professionnelle : confronter les observations, relire les productions libres. Les correspondances NSI et le cadre institutionnel figurent dans PROGRAMME_NSI_CORRESPONDANCES.md.
