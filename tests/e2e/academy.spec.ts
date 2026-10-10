import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { exercises } from '../../src/core/exercises';
import { emptyProgress } from '../../src/core/progress';
test('navigation, liens de section et routes sous GitHub Pages', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Une machine');
  await page.getByRole('link', { name: 'Entrer dans le premier module' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Comprendre les LLM');
  await page.getByRole('link', { name: 'Expérimenter', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Comprendre les LLM');
  await page.getByRole('link', { name: 'Continuer vers la tokenisation' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tokenisation');
  await page.getByRole('link', { name: 'Carnet d’apprentissage', exact: false }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Carnet de laboratoire');
  await page.goto('./#/inconnue');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cette page n’existe pas');
  expect(errors).toEqual([]);
});
test('BPE : vraie fusion, changement de corpus, inconnus et historique', async ({ page }) => {
  await page.goto('./#/module/02');
  const lab = page.locator('#bpe-lab');
  await expect(lab.getByText('10', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: 'Fusion suivante' }).click();
  await expect(lab.getByText('7', { exact: true })).toBeVisible();
  await expect(lab.getByText('Étape 1 /')).toBeVisible();
  await lab.getByRole('textbox', { name: 'Texte de test', exact: true }).fill('laz');
  await expect(lab.getByLabel('Tokens du texte de test').getByText('[UNK]')).toBeVisible();
  await lab.getByRole('button', { name: 'Étape précédente' }).click();
  await expect(lab.getByText('10', { exact: true })).toBeVisible();
  await lab.getByLabel('Corpus d’apprentissage').fill('aaa');
  await lab.getByRole('button', { name: 'Appliquer le corpus' }).click();
  await expect(lab.getByRole('cell', { name: '2', exact: true })).toBeVisible();
  await lab.getByRole('button', { name: 'Fusion suivante' }).click();
  await expect(
    lab.getByText('Cette fusion a remplacé 1 paires effectivement', { exact: false }),
  ).toBeVisible();
  await lab.getByLabel('Corpus d’apprentissage').fill('');
  await lab.getByRole('button', { name: 'Appliquer le corpus' }).click();
  await expect(lab.getByRole('button', { name: 'Fusion suivante' })).toBeDisabled();
});
test('probabilités calculées et diagnostic réellement corrigé', async ({ page }) => {
  await page.goto('./#/module/01');
  await page.getByText('Vérifier mes prérequis', { exact: false }).click();
  await page.getByLabel('3/5', { exact: true }).check();
  await expect(page.getByText('Prérequis prêt.')).toBeVisible();
  const lab = page.locator('#probability-lab');
  await lab.getByRole('button', { name: 'Comparer des scores égaux' }).click();
  await expect(lab.getByText('33.33 %')).toHaveCount(3);
  await expect(lab.getByText('1.0986', { exact: true })).toBeVisible();
});
test('évaluation des huit compétences et persistance après rechargement', async ({ page }) => {
  for (const module of ['01', '02']) {
    await page.goto('./#/module/' + module);
    for (const e of exercises.filter((x) => x.module === module)) {
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
    .fill('Deux corpus, un texte fixe et des comptes observés.');
  await page.reload();
  await expect(page.getByLabel('Votre réponse et vos observations')).toHaveValue(
    'Deux corpus, un texte fixe et des comptes observés.',
  );
  await expect(page.locator('.mini-progress strong')).toHaveText('8 / 36');
});
test('correction d’une erreur et progrès sans succès fictif', async ({ page }) => {
  await page.goto('./#/module/01');
  const form = page.locator('form').first();
  await form.getByLabel('Votre résultat').fill('1');
  await form.getByRole('button', { name: 'Vérifier ma réponse' }).click();
  await expect(form.getByRole('status')).toContainText('À reprendre.');
  await expect(page.locator('.progress-label')).toContainText('0 / 4');
  await form.getByLabel('Votre résultat').fill('0,5');
  await form.getByRole('button', { name: 'Vérifier ma réponse' }).click();
  await expect(page.locator('.progress-label')).toContainText('1 / 4');
  await form.getByLabel('Votre résultat').fill('0');
  await form.getByRole('button', { name: 'Vérifier ma réponse' }).click();
  await expect(page.locator('.progress-label')).toContainText('0 / 4');
});
test('export et import avec prévisualisation, sans confiance dans un score externe', async ({
  page,
}) => {
  await page.goto('./#/carnet');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporter mon carnet' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('llm-academy-carnet.json');
  const p = emptyProgress();
  p.answers['m01-proba'] = '0.5';
  p.notes['02'] = 'Import vérifié';
  await page.getByLabel('Choisir un carnet JSON').setInputFiles({
    name: 'carnet.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ ...p, score: 100 })),
  });
  await expect(page.getByRole('status').filter({ hasText: 'Fichier valide' })).toBeVisible();
  await page.getByRole('button', { name: 'Remplacer par ce carnet' }).click();
  await expect(page.locator('.mini-progress strong')).toHaveText('1 / 36');
  await expect(page.getByLabel('Observations / module 02')).toHaveValue('Import vérifié');
  await page.getByLabel('Choisir un carnet JSON').setInputFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":999}'),
  });
  await expect(page.getByRole('status').filter({ hasText: 'Version de carnet' })).toBeVisible();
  await expect(page.locator('.mini-progress strong')).toHaveText('1 / 36');
});
test('parcours développeur, stockage et préférences', async ({ page }) => {
  await page.goto('./#/bibliotheque');
  await page.getByLabel('Parcours développeur', { exact: false }).check();
  await page.getByRole('link', { name: /01 Comprendre les LLM/ }).click();
  await expect(page.getByText('Lecture développeur : moteur et invariants')).toBeVisible();
  await page.getByLabel('Sombre', { exact: true }).check();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
for (const theme of ['Clair', 'Sombre', 'Projection']) {
  test('accessibilité et absence de débordement : ' + theme, async ({ page }) => {
    for (const route of ['', '#/module/01', '#/module/02', '#/carnet', '#/references']) {
      await page.goto('./' + route);
      await page.getByLabel(theme, { exact: true }).check();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        results.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        ).toBe(true);
      }
    }
  });
}
test('navigation clavier et lien d’évitement', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('link', { name: 'Modules approfondis', exact: true }).click();
  await page.getByRole('link', { name: /02 Tokenisation/ }).click();
  await expect(page.locator('main')).toBeFocused();
});
test('cache de production utilisable hors ligne', async ({ page, context }) => {
  await page.goto('./');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  try {
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Une machine');
    await page.getByRole('link', { name: 'Entrer dans le premier module' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Comprendre les LLM');
  } finally {
    await context.setOffline(false);
  }
});
test('stockage refusé : usage en mémoire avec alerte', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked');
      },
    });
  });
  await page.goto('./');
  await expect(page.getByRole('alert')).toContainText('Stockage indisponible');
  await page.getByLabel('Sombre', { exact: true }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('alert')).toContainText('Stockage inaccessible');
});
test('captures de contrôle bureau et mobile', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('home-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#/module/02');
  await page.getByRole('link', { name: 'Expérimenter', exact: true }).click();
  await expect(page.locator('#bpe-lab h3')).toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath('bpe-mobile.png'), fullPage: false });
});
