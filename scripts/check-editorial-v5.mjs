import { readFileSync } from 'node:fs';

const modules = [
  'docs/formation-enseignant/MODULE_01_MODELES_LANGAGE.md',
  'docs/formation-enseignant/MODULE_02_TOKENISATION_GENERATION.md',
];

const requiredHeadings = [
  /objectifs|saur[a-zé]* expliquer/i,
  /python/i,
  /évaluation/i,
  /correction/i,
  /limite/i,
];

const redFlags = [
  [/\\`/, 'Accents graves Markdown échappés : exemples et blocs de code illisibles'],
  [/\bune variable entière\b/i, 'Préférer « une variable de type entier »'],
  [/\bune boucle for qui tourne\b/i, 'Préférer « boucle bornée »'],
  [/\ble (?:modèle|LLM) sait que\b/i, 'Anthropomorphisme scientifiquement ambigu'],
  [/\bune probabilité de choix prouve\b/i, 'Confusion entre probabilité et vérité'],
];

let failures = 0;
for (const path of modules) {
  const body = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
  const fences = body.split('\n').filter((line) => /^\`\`\`/.test(line));
  if (fences.length % 2 !== 0) {
    console.error(path + ' : bloc de code Markdown non refermé');
    failures++;
  }
  for (const [pattern, message] of redFlags) {
    if (pattern.test(body)) {
      console.error(path + ' : ' + message);
      failures++;
    }
  }
  for (const heading of requiredHeadings) {
    if (!heading.test(body)) {
      console.error(path + ' : élément pédagogique absent : ' + heading);
      failures++;
    }
  }
  if (!failures) console.log(path + ' : contrôles éditoriaux automatiques satisfaits');
}

if (failures) {
  console.error(failures + ' problème(s) éditorial(aux) détecté(s).');
  process.exitCode = 1;
} else {
  console.log(
    'Ces vérifications ne remplacent PAS la relecture linguistique, scientifique et pédagogique humaine.',
  );
}
