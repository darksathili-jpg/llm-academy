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

