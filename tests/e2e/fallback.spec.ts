import { test, expect } from '@playwright/test';
test('chargement refusé : message utile et carnet conservé', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/llm-academy/#/module/01');
  await page.getByLabel('Votre réponse et vos observations').fill('Une trace à préserver');
  await page.route('**/assets/TransformerLab-*.js', (route) => route.abort());
  await page.goto('http://127.0.0.1:4173/llm-academy/#/experience/transformer');
  await page.getByLabel('Scientifique', { exact: true }).check();
  await expect(page.getByRole('alert')).toContainText('Laboratoire indisponible');
  await page.goto('http://127.0.0.1:4173/llm-academy/#/carnet');
  await expect(page.getByLabel('Observations / module 01')).toHaveValue('Une trace à préserver');
  await context.close();
});
