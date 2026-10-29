# Références scientifiques et techniques

Sources consultées le 9 octobre 2026. Les activités, textes, figures et corpus sont originaux.

- Sennrich, Haddow, Birch (2016), [Neural Machine Translation of Rare Words with Subword Units](https://arxiv.org/abs/1508.07909) : unités sous-lexicales, origine de BPE en NLP.
- [Hugging Face — BPE](https://huggingface.co/learn/llm-course/chapter6/5) : apprentissage de fusions, encodage avec règles fixées, distinction byte-level/caractères.
- Vaswani et al. (2017), [Attention Is All You Need](https://arxiv.org/abs/1706.03762) : architecture Transformer ; l'article décrit un encodeur-décodeur, pas exactement GPT.
- [PyTorch — Softmax](https://pytorch.org/docs/stable/generated/torch.nn.Softmax.html) et [CrossEntropyLoss](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html) : distribution et perte.
- [Vite — déploiement statique](https://vite.dev/guide/static-deploy.html) et [GitHub Pages — workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Ouvrages de référence, sans adaptation de contenu

Sebastian Raschka, Build a Large Language Model (From Scratch), Manning, 2024.
Jay Alammar et Maarten Grootendorst, Hands-On Large Language Models, O'Reilly, 2024.
Chip Huyen, AI Engineering, O'Reilly, 2025.
Ces ouvrages orientent le programme futur ; aucune reproduction de leurs chapitres ou exercices.

## Simplifications explicites

Le laboratoire de probabilités n'a ni paramètres appris ni contexte neuronal.
Le BPE emploie des caractères Unicode, des frontières de mots et un alphabet issu du corpus.
Les IDs sont locaux ; les inconnus ne sont pas réversibles ; les espaces ne consomment pas de token dans ce modèle.
Les tokeniseurs de production peuvent travailler sur des octets, d'autres pré-découpages et des tokens spéciaux.

## Sources primaires de phase C — vérifiées le 10 octobre 2026

- [Attention Is All You Need, texte intégral](https://arxiv.org/html/1706.03762v7) : attention, multi-têtes, masque, positions et distinction encodeur-décodeur.
- [GPT-2, rapport original de Radford et al.](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) : architecture autorégressive et pré-normalisation.
- [Embedding](https://docs.pytorch.org/docs/2.14/generated/torch.nn.Embedding.html), [cosine_similarity](https://docs.pytorch.org/docs/2.14/generated/torch.nn.functional.cosine_similarity.html), [matmul](https://docs.pytorch.org/docs/2.14/generated/torch.matmul.html), [LayerNorm](https://docs.pytorch.org/docs/2.14/generated/torch.nn.LayerNorm.html), [scaled_dot_product_attention](https://docs.pytorch.org/docs/2.14/generated/torch.nn.functional.scaled_dot_product_attention.html), [autograd](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html) : conventions de référence, sans dépendance PyTorch dans le navigateur.
  Les activités et figures restent originales. Notre cosinus signale les normes nulles ; ce choix diffère de la régularisation epsilon. Les vecteurs, les poids et les seuils de la quadratique ne proviennent pas d’un LLM entraîné.

## Sources complémentaires V2 — vérifiées le 10 octobre 2026

Voir PROGRAMME_NSI_CORRESPONDANCES.md pour les programmes officiels et l'usage en classe ; EXPERIENCES_SCIENTIFIQUES.md pour les mécanismes, simplifications et liens scientifiques.

- [React lazy/Suspense](https://react.dev/reference/react/lazy) : chargement à la demande, composants déclarés hors rendu, erreur prise en charge par une frontière.
- [Vite et GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages) : base /llm-academy/, build statique et publication Actions ; preview uniquement local.
- [Vitest](https://vitest.dev/guide/) : moteurs purs et tests unitaires.
- [Playwright webServer](https://playwright.dev/docs/test-webserver) : serveur de build avant les parcours reproductibles.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) : clavier, focus, contraste et taille ; tests automatisés sans certification.

Versions conservées et verrouillées dans package-lock.json : React 19.3.0, TypeScript 5.9.3, Vite 7.3.7, Vitest 5.0.3, Playwright 1.64.0. Ce sont les versions effectivement installées et testées, pas une affirmation de dernières versions disponibles. Aucun nouveau framework n'a été ajouté. Pyodide 0.28.3 est épinglé pour reproduire les Workers et input ; Python observé 3.13.2. PyTorch local 2.10.0+cpu exécute les notebooks.

Savoir scientifique et calculs : sources primaires citées. Simplification pédagogique : poids inventés, corpus réduits, réponses préparées. Choix de conception : trois espaces, huit étapes, console. Cadre institutionnel : programme NSI et cadre d'usage. Recommandations professionnelles : examen des preuves, minimisation des données et relecture humaine. Aucune conformité réglementaire globale n'est déduite des tests.
