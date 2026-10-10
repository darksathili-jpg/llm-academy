import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { exercises } from '../../src/core/exercises';
import { STORAGE_KEY } from '../../src/core/progress';
test('vecteurs : projection trompeuse mesurée et changement de plan', async ({ page }) => {
  await page.goto('./#/module/03');
  const lab = page.locator('#embedding-lab');
  await lab.getByRole('button', { name: 'Piège de projection' }).click();
  await expect(lab.getByTestId('cosine-full')).toHaveText('-0.6000');
  await expect(lab.getByTestId('cosine-projected')).toHaveText('1.0000');
  await lab.getByLabel('Plan affiché').selectOption('0,2');
  await expect(lab.getByTestId('cosine-projected')).toHaveText('-0.6000');
  await lab.getByRole('button', { name: 'Même direction' }).click();
  await expect(lab.getByTestId('cosine-full')).toHaveText('1.0000');
  await lab.getByRole('button', { name: 'Orthogonaux' }).click();
  await expect(lab.getByTestId('cosine-full')).toHaveText('0.0000');
});
test('mathématiques : produit modifié, champs invalides et perte mesurée', async ({ page }) => {
  await page.goto('./#/module/04');
  const lab = page.locator('#math-lab');
  await expect(lab.getByTestId('matmul-detail')).toContainText('= 4.0000');
  const input = lab.getByLabel('A ligne 0 colonne 0');
  await input.fill('2');
  await expect(lab.getByTestId('matmul-detail')).toContainText('= 6.0000');
  await input.fill('non numérique');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(lab.getByTestId('matmul-detail')).toContainText('= 6.0000');
  await input.press('Tab');
  await expect(input).toHaveValue('2');
  await lab.getByRole('button', { name: 'Oscillation η = 1' }).click();
  await expect(lab.getByTestId('gradient-loss')).toHaveText('4.0000');
  await lab.getByRole('button', { name: 'Divergence η = 1,1' }).click();
  expect(Number(await lab.getByTestId('gradient-loss').textContent())).toBeGreaterThan(4);
  await lab.getByRole('button', { name: 'Convergence η = 0,2' }).click();
  expect(Number(await lab.getByTestId('gradient-loss').textContent())).toBeLessThan(0.01);
});
test('attention : futur bloqué, effets de V et deux têtes', async ({ page }) => {
  await page.goto('./#/module/05');
  const lab = page.locator('#attention-lab');
  const output = lab
    .getByRole('table')
    .filter({ has: page.getByText('Sortie de la tête observée', { exact: false }) });
  const before = (await output.locator('tbody tr').nth(0).textContent())!;
  await lab.getByLabel('V ligne 2 colonne 0').fill('-4');
  await expect(output.locator('tbody tr').nth(0)).toHaveText(before);
  await lab.getByLabel('Masque causal : interdire le futur').uncheck();
  await expect(output.locator('tbody tr').nth(0)).not.toHaveText(before);
  await expect(lab.getByTestId('attention-row-sum')).toContainText('1.0000');
  await lab.getByLabel('Nombre de têtes', { exact: true }).selectOption('2');
  await expect(
    lab
      .getByRole('table')
      .filter({ has: page.getByText('Concaténation des deux têtes', { exact: false }) }),
  ).toBeVisible();
  await lab.getByLabel('Tête observée').selectOption('1');
  await expect(lab.getByTestId('attention-row-sum')).toContainText('1.0000');
});
test('Transformer : étapes calculées, largeur, tête et ablations', async ({ page }) => {
  await page.goto('./#/module/06');
  const lab = page.locator('#transformer-lab');
  await expect(lab.getByTestId('transformer-stage')).toHaveText('Embeddings');
  await lab.getByRole('button', { name: 'Étape suivante', exact: true }).click();
  await expect(lab.getByTestId('transformer-stage')).toHaveText('Positions');
  await lab.getByRole('button', { name: 'Expansion + ReLU', exact: false }).click();
  await expect(
    lab
      .getByRole('table')
      .filter({ has: page.getByText('Expansion + ReLU · 3 × 8', { exact: true }) }),
  ).toBeVisible();
  await lab.getByLabel('Dimension d_model').selectOption('8');
  await expect(lab.getByText('d_k = d_v = 4', { exact: false })).toBeVisible();
  await lab.getByLabel('Nombre de têtes', { exact: true }).selectOption('4');
  await lab.getByLabel('Connexions résiduelles').uncheck();
  expect(
    Number(
      (await lab.getByTestId('transformer-delta').innerText()).split(':')[1]!.trim().slice(0, -1),
    ),
  ).toBeGreaterThan(0);
  await lab.getByRole('button', { name: 'Rétablir la démonstration' }).click();
  await expect(lab.getByTestId('transformer-delta')).toContainText('0.000000');
});
test('migration locale des données historiques et import du format 1', async ({ page }) => {
  const legacy = {
    version: 1,
    theme: 'dark',
    track: 'developer',
    answers: { 'm01-proba': '0.5', 'm02-frequency': '3' },
    notes: { '01': 'Ma preuve historique', '02': 'Corpus original' },
  };
  await page.addInitScript(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: STORAGE_KEY, value: legacy },
  );
  await page.goto('./#/carnet');
  await expect(page.getByLabel('Observations / module 01')).toHaveValue('Ma preuve historique');
  await expect(page.getByLabel('Observations / module 03')).toHaveValue('');
  await expect(page.locator('.mini-progress strong')).toHaveText('2 / 36');
  await page.getByLabel('Projection', { exact: true }).check();
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).version, STORAGE_KEY),
  ).toBe(3);
  await page.getByLabel('Choisir un carnet JSON').setInputFiles({
    name: 'ancien.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(legacy)),
  });
  await page.getByRole('button', { name: 'Remplacer par ce carnet' }).click();
  await expect(page.getByLabel('Observations / module 02')).toHaveValue('Corpus original');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
test('validation des 24 exercices et notes des six modules persistantes', async ({ page }) => {
  for (const id of ['01', '02', '03', '04', '05', '06']) {
    await page.goto('./#/module/' + id);
    for (const e of exercises.filter((x) => x.module === id)) {
      const form = page.locator('form').filter({ hasText: e.prompt });
      if (e.kind === 'number') await form.getByLabel('Votre résultat').fill(String(e.expected));
      else await form.getByLabel(String(e.expected), { exact: true }).check();
      await form.getByRole('button', { name: 'Vérifier ma réponse' }).click();
      await expect(form.getByRole('status')).toContainText('Résultat validé.');
    }
    await expect(page.locator('.progress-label')).toContainText('4 / 4');
  }
  await page
    .getByLabel('Votre réponse et vos observations')
    .fill('Les logits antérieurs restent fixes avec le masque causal.');
  await page.reload();
  await expect(page.getByLabel('Votre réponse et vos observations')).toHaveValue(
    'Les logits antérieurs restent fixes avec le masque causal.',
  );
  await expect(page.locator('.mini-progress strong')).toHaveText('24 / 36');
});
for (const theme of ['Clair', 'Sombre', 'Projection']) {
  test('phase C : accessibilité et responsive en mode ' + theme, async ({ page }) => {
    test.setTimeout(60000);
    for (const id of ['03', '04', '05', '06']) {
      await page.goto('./#/module/' + id);
      await page.getByLabel(theme, { exact: true }).check();
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        axe.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
    }
  });
}
test('modules scientifiques disponibles hors ligne', async ({ page, context }) => {
  await page.goto('./');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  try {
    for (const id of ['03', '04', '05', '06']) {
      await page.goto('./#/module/' + id);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
    await page
      .locator('#transformer-lab')
      .getByRole('button', { name: 'Étape suivante', exact: true })
      .click();
    await expect(page.getByTestId('transformer-stage')).toHaveText('Positions');
  } finally {
    await context.setOffline(false);
  }
});
test('captures phase C : attention bureau et Transformer mobile', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./#/module/05?section=experience');
  await expect(page.locator('#attention-lab h3')).toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath('attention-desktop.png'), fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#/module/06?section=experience');
  await expect(page.locator('#transformer-lab h3')).toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath('transformer-mobile.png'), fullPage: false });
});
