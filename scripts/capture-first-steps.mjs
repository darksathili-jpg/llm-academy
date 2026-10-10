import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const base = 'http://127.0.0.1:4173/llm-academy/';
const dir = 'docs/evidence/screens/prise-en-main';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
async function shot(page, name) {
  await page.evaluate(() => {
    document.activeElement?.blur();
    scrollTo(0, 0);
  });
  await page.screenshot({ path: dir + '/' + name + '.png', fullPage: true });
}
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(base);
  await shot(page, 'accueil');
  await page.getByRole('link', { name: 'Commencer en 5 minutes, sans code →' }).click();
  await shot(page, '01-phrase');
  await page.getByLabel('tapis', { exact: true }).check();
  await page.getByRole('button', { name: /Comparer avec/ }).click();
  await page.getByRole('button', { name: 'Choix plus variés', exact: true }).click();
  await shot(page, '02-choix');
  await page.getByRole('button', { name: /Continuer :/ }).click();
  await page.getByLabel('Le document dit le contraire.', { exact: true }).check();
  await page.getByRole('button', { name: 'Vérifier avec le document' }).click();
  await shot(page, '03-verification');
  await page.getByRole('button', { name: /Retenir/ }).click();
  await shot(page, '04-essentiel');
  await context.close();
  for (const theme of ['Clair', 'Sombre', 'Projection']) {
    const c = await browser.newContext({ viewport: { width: 390, height: 1000 } });
    const p = await c.newPage();
    await p.goto(base + '#/decouvrir');
    await p.getByLabel(theme, { exact: true }).check();
    await p.getByLabel('canapé', { exact: true }).check();
    await p.getByRole('button', { name: /Comparer avec/ }).click();
    await p.getByRole('button', { name: 'Choix plus variés', exact: true }).click();
    await shot(p, 'mobile-' + theme.toLowerCase());
    await c.close();
  }
  console.log('8 captures de la découverte enregistrées dans ' + dir);
} finally {
  await browser.close();
}
