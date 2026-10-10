import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';
const browser = await chromium.launch(),
  page = await browser.newPage();
const requests = [];
page.on('request', (r) => {
  if (r.url().startsWith('http')) requests.push({ method: r.method(), url: r.url() });
});
const start = Date.now();
try {
  await page.goto('http://127.0.0.1:4173/llm-academy/#/activite/tokens');
  await page.locator('.stage-nav button').nth(5).click();
  const code = page.getByLabel('Code Python modifiable'),
    run = page.getByRole('button', { name: 'Exécuter Python' }),
    out = page.getByTestId('python-output');
  await code.fill(
    'import sys\ntexte = input("Texte : ")\nprint("ENTREE:", texte)\nassert texte == "école 😀"\nprint("PYTHON:", sys.version.split()[0])',
  );
  await page.getByLabel('Entrées pour input()').fill('école 😀');
  await run.click();
  await page
    .getByRole('status')
    .filter({ hasText: 'Exécution Python terminée.' })
    .waitFor({ timeout: 65000 });
  const inputOutput = await out.innerText();
  if (!inputOutput.includes('ENTREE: école 😀')) throw Error('input Unicode non vérifié');
  await code.fill('print(1/0)');
  await run.click();
  await page.getByRole('status').filter({ hasText: 'Erreur Python' }).waitFor();
  const error = await out.innerText();
  if (!error.includes('ZeroDivisionError')) throw Error('Erreur Python non affichée');
  await code.fill(
    'import js\nprint("STOCKAGE:", hasattr(js, "localStorage"))\njs.fetch("https://example.com/exfiltration")',
  );
  await run.click();
  await page.getByRole('status').filter({ hasText: 'Erreur Python' }).waitFor();
  const networkError = await out.innerText();
  if (!networkError.includes('désactivés')) throw Error('Réseau non bloqué');
  await code.fill('while True: pass');
  await run.click();
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: 'Arrêter Python' }).click();
  await page.getByRole('status').filter({ hasText: 'Worker est terminé' }).waitFor();
  await page.getByRole('button', { name: 'Réinitialiser Python' }).click();
  const result = {
    date: new Date().toISOString(),
    elapsedMs: Date.now() - start,
    inputOutput,
    error: error.slice(-600),
    networkError: networkError.slice(-600),
    infiniteLoopStopped: true,
    resetCode: await code.inputValue(),
    requests: requests.filter((r) => !r.url.includes('127.0.0.1')),
  };
  if (result.requests.some((r) => r.method !== 'GET' || r.url.includes('example.com')))
    throw Error('Requête inattendue');
  await mkdir('docs/evidence', { recursive: true });
  await writeFile('docs/evidence/python-browser.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ...result, requests: result.requests.length }, null, 2));
} finally {
  await browser.close();
}
