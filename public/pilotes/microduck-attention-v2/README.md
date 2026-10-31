# LLM Academy — Microduck, mission attention causale V2

Ouvrir `index.html` dans un navigateur avec les 12 PNG dans le même dossier. La page ne télécharge aucune ressource externe. Les étapes sont : hypothèse → masque et déplacement animé → transfert sans personnage. Animation réduite si le système l'exige. Le modèle PyTorch n'est pas exécuté dans cette page : les cases représentent exclusivement le masque causal déterministe `j <= i`.

Pour GitHub, copier ce dossier sous `public/pilotes/microduck-attention-v2/` dans le dépôt `llm-academy` sur la branche de travail, puis lancer le build et les tests Playwright avant diffusion. Ne pas modifier le tag V4 ni le site principal.
