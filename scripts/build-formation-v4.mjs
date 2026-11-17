import { readFile, readdir, writeFile } from 'node:fs/promises';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

function replaceRequired(text, marker, replacement) {
  if (!text.includes(marker)) throw new Error(`Formation V4 : repère manquant (${marker})`);
  return text.replace(marker, () => replacement);
}

export async function buildFormationV4(target) {
  const pythonDirectory = new URL('./formation-v4-python/', import.meta.url);
  const [page, sections, interaction, styles, bigram, filenames] = await Promise.all([
    readFile(target, 'utf8'),
    readSource('./formation-v4-priorites.html'),
    readSource('./formation-v4-priorites.js'),
    readSource('./formation-v4-priorites.css'),
    readSource('../public/pilotes/formation-v4-r1/bigram.js'),
    readdir(pythonDirectory),
  ]);
  const python = Object.fromEntries(
    await Promise.all(
      filenames
        .filter((name) => name.endsWith('.py'))
        .sort()
        .map(async (name) => [
          name.slice(0, -3),
          await readFile(new URL(name, pythonDirectory), 'utf8'),
        ]),
    ),
  );
  let code = replaceRequired(
    interaction,
    '/* MOTEUR_BIGRAMME */',
    bigram.replace(/^export /gm, ''),
  );
  code = replaceRequired(
    code,
    '/* FICHIERS_PYTHON */ {}',
    JSON.stringify(python).replaceAll('<', '\\u003c'),
  );

  const screens = "['screen-home','screen-course','screen-reference']";
  let html = replaceRequired(
    page,
    screens,
    "['screen-home','screen-course','screen-reference','screen-generation','screen-tp','screen-teacher']",
  );
  html = replaceRequired(html, '</head>', `<style>\n${styles}\n</style>\n</head>`);
  html = replaceRequired(
    html,
    'Sans compte ni serveur · Pas de publication GitHub',
    'Sans compte · Calculs dans le navigateur',
  );
  html = replaceRequired(html, '</main>', `${sections}\n</main>`);
  html = replaceRequired(html, '</body></html>', `<script>\n${code}\n</script>\n</body></html>`);
  await writeFile(target, html);
}
