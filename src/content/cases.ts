/** Original fictional dossier for six disciplines. No real institution facts invented. */
export const cases = [
  {
    discipline: 'Lettres',
    source:
      'S1 — Texte original : « Nora referma la fenêtre. Elle redoutait que le vent emporte sa lettre. »',
    claims: [
      {
        text: 'Nora referme une fenêtre.',
        verdict: 'étayé',
        evidence: 'S1',
        reason: 'Le geste figure explicitement dans le texte.',
      },
      {
        text: 'Nora ouvre la fenêtre.',
        verdict: 'contredit',
        evidence: 'S1',
        reason: 'Le texte dit referma, pas ouvrit.',
      },
      {
        text: 'Nora a douze ans.',
        verdict: 'insuffisant',
        evidence: 'aucune',
        reason: 'Aucun âge ne figure dans cet extrait.',
      },
    ],
  },
  {
    discipline: 'Mathématiques',
    source:
      'S1 — Définition du dossier : un carré a quatre côtés de même longueur. S2 — Donnée : le côté du carré mesure 3 cm.',
    claims: [
      {
        text: 'Le périmètre vaut 12 cm.',
        verdict: 'étayé',
        evidence: 'S1+S2',
        reason: 'Quatre fois 3 donne 12.',
      },
      {
        text: 'Le périmètre vaut 9 cm.',
        verdict: 'contredit',
        evidence: 'S1+S2',
        reason: '9 est l’aire numérique en cm², pas le périmètre.',
      },
      {
        text: 'Le carré est bleu.',
        verdict: 'insuffisant',
        evidence: 'aucune',
        reason: 'Aucune couleur fournie.',
      },
    ],
  },
  {
    discipline: 'Histoire-géographie',
    source:
      'S1 — Archive fictive : « En 1842, la commune imaginaire de Valrose compte 800 habitants. » S2 — Archive fictive : « En 1862, elle en compte 1 000. »',
    claims: [
      {
        text: 'La population augmente de 200 habitants entre ces dates.',
        verdict: 'étayé',
        evidence: 'S1+S2',
        reason: '1 000 − 800 = 200.',
      },
      {
        text: 'La commune compte 800 habitants en 1862.',
        verdict: 'contredit',
        evidence: 'S2',
        reason: 'Le second extrait donne 1 000.',
      },
      {
        text: 'Une usine explique cette hausse.',
        verdict: 'insuffisant',
        evidence: 'aucune',
        reason: 'Aucune cause n’est établie par ces deux nombres.',
      },
    ],
  },
  {
    discipline: 'Sciences',
    source:
      'S1 — Protocole original : deux plantes reçoivent la même eau et le même sol ; une seule variable change, la lumière. S2 — Résultat : après dix jours, la plante éclairée mesure 8 cm et l’autre 5 cm.',
    claims: [
      {
        text: 'Les tailles observées diffèrent de 3 cm.',
        verdict: 'étayé',
        evidence: 'S2',
        reason: 'La différence mesurée est 8 − 5.',
      },
      {
        text: 'Les deux plantes mesurent 8 cm.',
        verdict: 'contredit',
        evidence: 'S2',
        reason: 'La seconde mesure 5 cm.',
      },
      {
        text: 'Toutes les plantes réagiront exactement ainsi.',
        verdict: 'insuffisant',
        evidence: 'aucune',
        reason: 'Deux plantes ne démontrent pas une universalité.',
      },
    ],
  },
  {
    discipline: 'Langues',
    source:
      'S1 — Message original : « The library is closed on Monday and opens on Tuesday at nine. »',
    claims: [
      {
        text: 'La bibliothèque ouvre mardi à neuf heures.',
        verdict: 'étayé',
        evidence: 'S1',
        reason: 'Tuesday at nine correspond à mardi à neuf heures.',
      },
      {
        text: 'Elle ouvre lundi.',
        verdict: 'contredit',
        evidence: 'S1',
        reason: 'Closed on Monday indique la fermeture.',
      },
      {
        text: 'Elle possède 10 000 livres.',
        verdict: 'insuffisant',
        evidence: 'aucune',
        reason: 'Le message ne donne pas l’effectif des livres.',
      },
    ],
  },
  {
    discipline: 'NSI',
    source:
      'S1 — Code original : def double(x): return 2*x. S2 — Spécification : pour un entier, retourner son double ; aucune contrainte sur les nombres flottants.',
    claims: [
      {
        text: 'double(3) renvoie 6.',
        verdict: 'étayé',
        evidence: 'S1',
        reason: 'Le produit de 2 par 3 vaut 6.',
      },
      {
        text: 'double(3) renvoie 9.',
        verdict: 'contredit',
        evidence: 'S1',
        reason: 'La fonction multiplie par 2.',
      },
      {
        text: 'Le code valide toutes les entrées possibles.',
        verdict: 'insuffisant',
        evidence: 'aucune',
        reason: 'Aucun contrôle de type ni test exhaustif n’est fourni.',
      },
    ],
  },
] as const;
export const localDocuments = [
  {
    id: 'S1',
    title: 'Observatoire — dossier fictif',
    text: 'L’observatoire du lycée imaginaire de Valrose ouvre le mardi à dix-huit heures. Les visiteurs observent la Lune avec un télescope. La réservation est gratuite. En cas de pluie, la séance est reportée au mardi suivant.',
  },
  {
    id: 'S2',
    title: 'Bibliothèque — dossier fictif',
    text: 'La bibliothèque de Valrose ouvre le jeudi à neuf heures. Elle propose des livres de sciences et des ateliers de lecture. Les ateliers durent trente minutes. La bibliothèque ferme pendant les vacances scolaires.',
  },
  {
    id: 'S3',
    title: 'Atelier NSI — dossier fictif',
    text: 'L’atelier NSI de Valrose utilise Python pour programmer et tester des fonctions. Les élèves travaillent en binômes. Les documents de cet atelier sont des textes originaux fictifs. Aucun nom d’élève ni donnée personnelle n’est nécessaire.',
  },
];
