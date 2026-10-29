# LLM Academy V4 — Dossier de travail et validation

Date : 29 octobre 2026. Statut : **candidat pédagogique local, non reçu**. Aucun déploiement ni modification du dépôt L1.

## Objectif et frontières

Application HTML autonome, MathJax embarqué, deux modes Élève / Enseignant. **15 chapitres**, 15 expériences de base, 15 exercices Python standard avec assertions et 15 questions corrigées. Une épreuve de transfert transversale conclut le cursus ; elle n'est pas une certification. Les durées indiquées sont des estimations de conception, pas des mesures en classe.

L'application n'exécute **aucun vrai LLM**, ni réseau entraîné, ni interpréteur Python dans le navigateur : les ateliers numériques sont des calculateurs JavaScript documentés, et les exercices Python sont à lire, télécharger et lancer dans un environnement Python séparé. Les exemples sont originaux et fictifs.

## Progression proposée

**Phase 1 — Fondations (1–6)** : vérification des sources ; tokens ; softmax ; causalité ; entraînement/validation ; recherche documentaire.

**Phase 2 — Mécanismes (7–11)** : préparation des données ; vecteurs/embeddings ; Q/K/V ; architecture d'un Transformer causal ; perte et gradient.

**Phase 3 — Application critique (12–15)** : génération/top-k ; adaptation fine/LoRA ; ingénierie des consignes ; évaluation et usages en éducation.

## Mode d'emploi

1. Ouvrir `LLM_Academy_Formation_Complete_V4.html` dans Chrome ou Firefox ; aucune installation.
2. Choisir Élève ou Enseignant. Les concepts ne sont pas masqués en mode Élève : le mode Enseignant *ajoute* les approfondissements.
3. Filtrer une phase ; ouvrir directement n'importe quel chapitre.
4. Manipuler d'abord, lire l'explication mathématique, étudier le Python, répondre puis expliquer le transfert.
5. Ouvrir « Glossaire et références » et « Atelier LaTeX » à tout moment. Les sources sont des appuis externes et non des prérequis à la lecture de l'application.

## Contrôles avant utilisation officielle

- Les 15 manipulations doivent avoir un résultat observable et correct, et leur texte explicatif doit être adapté au calcul réellement réalisé.
- Vérifier les **15 exercices Python** dans un environnement Python standard (sans PyTorch).
- Les exposés mathématiques (softmax, cosinus, attention, gradient, précision/rappel) doivent être relus par un enseignant compétent, et chaque symbole défini.
- Tests élèves / enseignants novices sans aide : terminologie, compréhension, transfert inédit après délai, temps réel et difficultés.
- Tests matériels : projecteur réel, clavier, 320–1440px, lecteurs d'écran et impression.
- Contrôles de conformité au BO pour les *prérequis NSI*, sans assimiler LLM aux attendus du bac.
- Évaluation finale et certificats : **aucune certification reconnue n'est délivrée**.
- Vérifier l'environnement de diffusion : confidentialité, droits des illustrations et licences des bibliothèques embarquées.

## Références contrôlées

- [Éduscol — programmes NSI](https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g) ; BO spécial Première 22 janvier 2019, Terminale 25 juillet 2019.
- [Cadre ministériel d'usage de l'IA en éducation](https://www.education.gouv.fr/cadre-d-usage-de-l-ia-en-education-450647) (13 juin 2025).
- [Vaswani et al. (2017), Attention Is All You Need](https://arxiv.org/abs/1706.03762).
- [Hu et al. (2021), LoRA](https://arxiv.org/abs/2106.09685).
- [Stanford CS336, Spring 2026](https://cs336.stanford.edu/).
- [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/en/chapter1/1).
- [NIST Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence).

Les sources avancées ne sont pas indispensables pour suivre les explications, mais permettent d'en contrôler le fond.
