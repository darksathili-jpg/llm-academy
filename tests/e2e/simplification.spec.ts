import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { emptyProgress, STORAGE_KEY } from '../../src/core/progress';
import { DEMO_KEY, PYTHON_DEMO } from '../../src/core/demo';
async function hypothesis(page: import('@playwright/test').Page) {
  await page.goto('./#/experience/01');
  await page.getByRole('button', { name: 'Faire ma proposition' }).click();
  await page
    .getByLabel('Ma proposition avant l’essai')
    .fill('Je pense que canapé sortira souvent.');
  await page.getByRole('button', { name: 'Passer à l’essai' }).click();
}
test('un seul accueil, six sujets sans jargon et une seule expérience ouverte', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('.experience-index>li')).toHaveCount(6);
  await expect(page.locator('.experience-index a')).toHaveCount(1);
  expect(await page.locator('main').innerText()).not.toMatch(
    /token|transformer|softmax|top-k|température|matrice/i,
  );
  await expect(page.getByText('Animer cette expérience', { exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: 'Essayer la première expérience' }).click();
  await expect(page.locator('.step-titles li')).toHaveCount(5);
  await page.goto('./#/experience/02');
  await expect(page.locator('h1')).toHaveText('Cette expérience n’est pas ouverte.');
});
test('cinq étapes : proposition, tirages réels contrôlés, observation, explication et sauvegarde', async ({
  page,
}) => {
  await page.addInitScript(() => {
    let i = 0;
    const values = [0.05, 0.7, 0.97];
    Object.defineProperty(crypto, 'getRandomValues', {
      value: (buffer: Uint32Array) => {
        buffer[0] = Math.floor(values[i++ % 3]! * 4294967296);
        return buffer;
      },
    });
  });
  await hypothesis(page);
  await expect(page.locator('.chance-labels')).toContainText('60 %');
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: 'Tirer un mot', exact: true }).click();
  await expect(page.locator('.chosen-word')).toHaveText('bureau');
  await expect(page.locator('.draw-status')).toContainText('canapé 1 · tapis 1 · bureau 1');
  await page.getByRole('button', { name: 'Noter ce que j’observe' }).click();
  await expect(page.locator('.observed-counts dd')).toHaveText(['1 fois', '1 fois', '1 fois']);
  await page.getByLabel('Ce que j’ai observé').fill('Trois mots différents malgré un favori.');
  await page.getByRole('button', { name: 'Lire l’explication', exact: true }).click();
  await expect(page.locator('.explanation h3')).toHaveCount(3);
  await expect(page.locator('.explanation')).toContainText(
    'Ici, elles ont été préparées par nous.',
  );
  await page.reload();
  await expect(page.locator('.stage-label h2')).toHaveText('Une explication');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger mes notes' }).click();
  const path = await (await downloadPromise).path();
  const data = JSON.parse(await readFile(path!, 'utf8'));
  expect(data.experience.observation).toBe('Trois mots différents malgré un favori.');
  expect(data.experience.attempts.map((a: { token: number }) => a.token)).toEqual([0, 1, 2]);
});
test('carnet historique intact, stockage refusé et données corrompues conservées', async ({
  page,
  context,
}) => {
  const prior = emptyProgress();
  prior.notes['01'] = 'NOTE ANTÉRIEURE 😀';
  prior.investigations.tokens = {
    stage: 2,
    hypothesis: 'ancienne',
    observation: '',
    explanation: '',
    transfer: '',
    answer: '',
  };
  await page.addInitScript(({ key, data }) => localStorage.setItem(key, data), {
    key: STORAGE_KEY,
    data: JSON.stringify(prior),
  });
  await hypothesis(page);
  const after = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
  expect(after).toEqual(prior);
  const other = await context.newPage();
  await other.addInitScript((key) => localStorage.setItem(key, '{corrompu'), DEMO_KEY);
  await other.goto('./#/experience/01');
  await expect(other.getByRole('alert')).toContainText('restent conservées');
  await other.getByRole('button', { name: 'Faire ma proposition' }).click();
  expect(await other.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toBe('{corrompu');
  await other.close();
  const denied = await context.newPage();
  await denied.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw Error('refus');
      },
    }),
  );
  await denied.goto('./#/experience/01');
  await denied.getByRole('button', { name: 'Faire ma proposition' }).click();
  await denied.getByLabel('Ma proposition avant l’essai').fill('Je peux continuer en mémoire.');
  await denied.getByRole('button', { name: 'Passer à l’essai' }).click();
  await expect(denied.locator('.stage-label h2')).toHaveText('Une manipulation');
});
test('formateur dans la même expérience : réponses masquées, révélation graduée et projection', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('llm-academy.studio.private.v1', 'SECRET ANCIEN FORMATEUR'),
  );
  await page.goto('./#/experience/01');
  await expect(page.getByRole('button', { name: 'Masquer les réponses' })).not.toBeVisible();
  await page.getByText('Animer cette expérience', { exact: true }).click();
  await page.getByRole('button', { name: 'Faire ma proposition' }).click();
  await page.getByRole('button', { name: 'Proposer notre hypothèse à l’oral' }).click();
  await page.getByRole('button', { name: 'Passer à l’essai' }).click();
  await page.getByRole('button', { name: 'Tirer un mot', exact: true }).click();
  await page.getByRole('button', { name: 'Masquer les réponses', exact: true }).click();
  await expect(page.locator('.chosen-word')).toHaveText('…');
  await expect(page.locator('.chance-ruler')).toHaveCount(0);
  await page.getByRole('button', { name: 'Noter ce que j’observe' }).click();
  await page.getByLabel('Ce que j’ai observé').fill('Ma saisie mmmmm');
  await page.getByLabel('Ce que j’ai observé').press('m');
  await expect(page.locator('.observed-counts')).toHaveCount(0);
  await page.getByRole('button', { name: 'Lire l’explication', exact: true }).click();
  await expect(page.locator('.explanation h3')).toHaveCount(0);
  for (let i = 1; i <= 3; i++) {
    await page.getByRole('button', { name: 'Révéler l’explication suivante' }).click();
    await expect(page.locator('.explanation h3')).toHaveCount(i);
  }
  await page.getByRole('button', { name: 'Projeter l’expérience' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'projector');
  await expect(page.locator('.extensions')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('SECRET ANCIEN FORMATEUR');
  await page.getByRole('button', { name: 'Quitter la projection' }).click();
  await expect(page.locator('.simple-header')).toBeVisible();
});
test('Python reste un prolongement : code du même jeu, téléchargement et repli sans réseau', async ({
  page,
}) => {
  await page.goto('./#/experience/01');
  await expect(page.getByLabel('Code Python modifiable')).not.toBeVisible();
  await page.getByText('Explorer avec Python', { exact: true }).click();
  await expect(page.getByLabel('Code Python modifiable')).toHaveValue(PYTHON_DEMO);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger le code .py' }).click();
  expect(await readFile((await (await downloadPromise).path())!, 'utf8')).toBe(PYTHON_DEMO);
  await page.route('https://cdn.jsdelivr.net/**', (r) => r.abort());
  await page.getByRole('button', { name: 'Exécuter Python' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Erreur Python' })).toBeVisible({
    timeout: 10000,
  });
});
test('clavier : lien de passage au contenu et saisie sans interception', async ({ page }) => {
  await page.goto('./#/experience/01');
  await page.keyboard.press('Tab');
  await page.getByRole('link', { name: 'Aller au contenu' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.experience-heading h1')).toHaveText('Le mot d’après.');
  await page.getByRole('button', { name: 'Faire ma proposition' }).click();
  await page.getByLabel('Ma proposition avant l’essai').fill('à gauche');
  await page.getByLabel('Ma proposition avant l’essai').press('ArrowRight');
  await expect(page.locator('.stage-label h2')).toHaveText('Une hypothèse');
  await page.locator('.stage-label h2').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.stage-label h2')).toHaveText('Une manipulation');
});
for (const theme of ['Clair', 'Sombre', 'Projection'])
  test('lecture, cinq étapes et accessibilité : ' + theme, async ({ page }, info) => {
    test.setTimeout(90000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('./');
    await page.getByLabel(theme, { exact: true }).check();
    for (const width of [390, 1280, 1920]) {
      await page.setViewportSize({ width, height: 1080 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    let axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(axe.violations).toEqual([]);
    await page.goto('./#/experience/01');
    for (let step = 0; step < 5; step++) {
      for (const width of [390, 1280, 1920]) {
        await page.setViewportSize({ width, height: 1080 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
      axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
      if (step === 2) {
        await page.setViewportSize({ width: theme === 'Projection' ? 1920 : 390, height: 1080 });
        await page.screenshot({
          path: info.outputPath('manipulation-' + theme + '.png'),
          fullPage: true,
        });
      }
      if (step === 0) await page.getByRole('button', { name: 'Faire ma proposition' }).click();
      if (step === 1) {
        await page.getByLabel('Ma proposition avant l’essai').fill('Une idée à essayer.');
        await page.getByRole('button', { name: 'Passer à l’essai' }).click();
      }
      if (step === 2) {
        await page.getByRole('button', { name: 'Faire 20 essais' }).click();
        await page.getByRole('button', { name: 'Noter ce que j’observe' }).click();
      }
      if (step === 3) {
        await page.getByLabel('Ce que j’ai observé').fill('Plusieurs résultats possibles.');
        await page.getByRole('button', { name: 'Lire l’explication', exact: true }).click();
      }
    }
    expect(errors).toEqual([]);
  });
test('trois maquettes consultables et distinctes : bureau, mobile et projection', async ({
  page,
}, info) => {
  await page.goto('./#/maquettes');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await page.getByRole('link', { name: 'La Revue →' }).click();
  await expect(page.locator('body')).toContainText('Maquette statique');
  for (const file of ['01-paillasse', '02-revue', '03-scene']) {
    await page.goto('./maquettes/' + file + '.html');
    await expect(page.locator('.contents li')).toHaveCount(6);
    await expect(page.locator('body')).toContainText('Maquette statique');
    for (const [width, theme] of [
      [390, 'Clair'],
      [1280, 'Sombre'],
      [1920, 'Projection'],
    ] as const) {
      await page.setViewportSize({ width, height: 1080 });
      await page.getByLabel(theme, { exact: true }).check();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({ path: info.outputPath(file + '-' + width + '.png'), fullPage: true });
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
    }
  }
});
