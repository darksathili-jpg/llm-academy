import { chromium, expect } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const base = 'http://127.0.0.1:4173/llm-academy/';
const dir = 'docs/evidence/simplification';
await mkdir(dir, { recursive: true });
const report = {
  date: new Date().toISOString(),
  kind: 'inspection automatisée, pas preuve de compréhension',
  screens: [],
  errors: [],
  pythonLocal: null,
  pythonBrowser: null,
};
const source = await readFile('src/core/demo.ts', 'utf8');
const code = source.match(/export const PYTHON_DEMO = `([\s\S]*?)`;/)?.[1];
if (!code) throw Error('Programme Python introuvable.');
const py = spawnSync('python', ['-c', code], {
  encoding: 'utf8',
  timeout: 10000,
  env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
});
if (py.status !== 0) throw Error('Python local : ' + py.stderr);
report.pythonLocal = { assertions: 'passed', output: py.stdout.trim() };
const browser = await chromium.launch();
async function capture(page, name) {
  await page.evaluate(() => {
    document.activeElement?.blur();
    scrollTo(0, 0);
  });
  await page.screenshot({ path: dir + '/' + name + '.png', fullPage: true });
  report.screens.push(name + '.png');
}
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1080 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => report.errors.push(e.message));
  await page.goto(base);
  await capture(page, 'accueil');
  await page.getByRole('link', { name: 'Essayer la première expérience' }).click();
  await capture(page, '01-question');
  await page.getByRole('button', { name: 'Faire ma proposition' }).click();
  await page
    .getByLabel('Ma proposition avant l’essai')
    .fill('Je propose canapé, à vérifier par les essais.');
  await capture(page, '02-hypothese');
  await page.getByRole('button', { name: 'Passer à l’essai' }).click();
  await page.getByRole('button', { name: 'Faire 20 essais' }).click();
  await capture(page, '03-manipulation');
  await page.getByRole('button', { name: 'Noter ce que j’observe' }).click();
  await page
    .getByLabel('Ce que j’ai observé')
    .fill('Les essais donnent plusieurs mots ; les comptes sont à comparer aux chances de départ.');
  await capture(page, '04-observation');
  await page.getByRole('button', { name: 'Lire l’explication', exact: true }).click();
  await capture(page, '05-explication');
  for (const [width, theme] of [
    [390, 'Clair'],
    [1280, 'Sombre'],
    [1920, 'Projection'],
  ]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.getByLabel(theme, { exact: true }).check();
    await page.getByRole('button', { name: 'Précédent', exact: true }).click();
    await page.getByRole('button', { name: 'Précédent', exact: true }).click();
    await capture(page, 'manipulation-' + width + '-' + theme.toLowerCase());
    await page.getByRole('button', { name: 'Noter ce que j’observe' }).click();
    await page.getByRole('button', { name: 'Lire l’explication', exact: true }).click();
  }
  if (process.argv.includes('--python')) {
    await page.getByText('Explorer avec Python', { exact: true }).click();
    await expect(page.getByLabel('Code Python modifiable')).toHaveValue(code);
    await page.getByRole('button', { name: 'Exécuter Python' }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Exécution Python terminée.' }),
    ).toBeVisible({ timeout: 120000 });
    const output = await page.locator('.python-workbench pre').innerText();
    if (!output.includes('Sur 20 essais') || !output.includes('0.6, 0.3, 0.1'))
      throw Error('Sortie Python inattendue.');
    report.pythonBrowser = { assertions: 'passed', output };
  }
  for (const file of ['01-paillasse', '02-revue', '03-scene']) {
    await page.setViewportSize({ width: 1280, height: 1080 });
    await page.goto(base + 'maquettes/' + file + '.html');
    await expect(page.locator('.contents li')).toHaveCount(6);
    await expect(page.locator('body')).toContainText('Maquette statique');
    await capture(page, 'maquette-' + file);
  }
  await context.close();
  await writeFile(dir + '/verification.json', JSON.stringify(report, null, 2) + '\n');
  console.log(
    JSON.stringify({
      screens: report.screens.length,
      errors: report.errors,
      pythonLocal: report.pythonLocal,
      pythonBrowser: report.pythonBrowser,
    }),
  );
} finally {
  await browser.close();
}
