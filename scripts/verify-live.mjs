import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const url = process.env.LLM_ACADEMY_URL ?? 'https://darksathili-jpg.github.io/llm-academy/';
const browser = await chromium.launch();
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(url);
  if (response?.status() !== 200) throw new Error('La page publique ne répond pas HTTP 200.');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Une machine');
  await page.getByRole('link', { name: 'Entrer dans le premier module' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Comprendre les LLM');
  const exercise = page.locator('form').first();
  await exercise.getByLabel('Votre résultat').fill('0,5');
  await exercise.getByRole('button', { name: 'Vérifier ma réponse' }).click();
  await expect(page.locator('.progress-label')).toContainText('1 / 4');
  await page.reload();
  await expect(page.locator('.progress-label')).toContainText('1 / 4');
  await page.getByRole('link', { name: 'Continuer vers la tokenisation' }).click();
  const bpe = page.locator('#bpe-lab');
  await bpe.getByRole('button', { name: 'Fusion suivante' }).click();
  await expect(bpe.getByText('7', { exact: true })).toBeVisible();
  await page.goto(url + '#/module/03?section=experience');
  const embedding = page.locator('#embedding-lab');
  await embedding.getByRole('button', { name: 'Piège de projection' }).click();
  await expect(embedding.getByTestId('cosine-full')).toHaveText('-0.6000');
  await expect(embedding.getByTestId('cosine-projected')).toHaveText('1.0000');
  await page.goto(url + '#/module/04?section=experience');
  await expect(page.getByTestId('matmul-detail')).toContainText('= 4.0000');
  await page.goto(url + '#/module/05?section=experience');
  const attention = page.locator('#attention-lab');
  const output = attention
    .getByRole('table')
    .filter({ has: page.getByText('Sortie de la tête observée', { exact: false }) });
  const before = await output.locator('tbody tr').nth(0).textContent();
  await attention.getByLabel('V ligne 2 colonne 0').fill('-4');
  await expect(output.locator('tbody tr').nth(0)).toHaveText(before);
  await attention.getByLabel('Masque causal : interdire le futur').uncheck();
  await expect(output.locator('tbody tr').nth(0)).not.toHaveText(before);
  await page.goto(url + '#/module/06?section=experience');
  const transformer = page.locator('#transformer-lab');
  await expect(transformer.getByTestId('transformer-stage')).toHaveText('Embeddings');
  await transformer.getByRole('button', { name: 'Étape suivante', exact: true }).click();
  await expect(transformer.getByTestId('transformer-stage')).toHaveText('Positions');
  await expect(page.locator('.mini-progress strong')).toHaveText('1 / 36');
  await page.goto(url + '#/module/07?section=experience');
  await page.getByRole('button', { name: "Générer jusqu'à 5 tokens" }).click();
  await expect(page.getByTestId('autoregressive-output')).not.toBeEmpty();
  await page.goto(url + '#/module/08?section=experience');
  const beforeTraining = Number(await page.getByTestId('train-loss').textContent());
  await page.getByRole('button', { name: '20 mises à jour', exact: true }).click();
  if (Number(await page.getByTestId('train-loss').textContent()) >= beforeTraining)
    throw new Error('Perte non améliorée.');
  await page.goto(url + '#/module/09?section=experience');
  const beforeAdaptation = Number(await page.getByTestId('adapt-loss').textContent());
  await page.getByRole('button', { name: 'Adapter pendant 50 pas' }).click();
  if (Number(await page.getByTestId('adapt-loss').textContent()) >= beforeAdaptation)
    throw new Error('Adaptation non améliorée.');
  await expect(page.getByTestId('base-weight-delta')).toContainText('0.000000');
  await page.goto(url + '#/module/06?section=experience');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#transformer-lab')).toBeVisible();
  await page
    .locator('#transformer-lab')
    .getByRole('button', { name: 'Étape suivante', exact: true })
    .click();
  await expect(page.getByTestId('transformer-stage')).toHaveText('Positions');
  await context.setOffline(false);
  await mkdir('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/live-v2.png', fullPage: false });
  if (errors.length) throw new Error('Erreurs JavaScript : ' + errors.join('; '));
  console.log(
    JSON.stringify(
      {
        url,
        http: 200,
        modules: ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
        bpe: '10 → 7 tokens',
        projection: { cosine3D: -0.6, cosine2D: 1 },
        matrixProduct: '4.0000',
        attention: 'futur bloqué ; influence vérifiée sans masque',
        transformer: 'étapes calculées et fonctionnement hors ligne',
        progression: 'sauvegarde et rechargement vérifiés',
        training: 'perte améliorée après 20 pas',
        adaptation: 'perte améliorée ; base gelée',
        javascriptErrors: 0,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
