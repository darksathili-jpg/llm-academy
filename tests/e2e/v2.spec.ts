import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { activities } from '../../src/content/activities';
import { scenarios } from '../../src/content/scenarios';
import { PRIVATE_KEY, SESSION_KEY } from '../../src/core/session';
test('parcours NSI complet : hypothèses, manipulations, transferts et carnet sans faux score', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto('./#/atelier');
  await expect(page.locator('.editorial-row')).toHaveCount(10);
  for (const a of activities) {
    await page.goto('./#/activite/' + a.id);
    await page.getByRole('button', { name: 'Étape suivante', exact: true }).click();
    await page.getByLabel('Mon hypothèse et ma justification').fill('Hypothèse originale ' + a.id);
    await page.getByRole('button', { name: 'Étape suivante', exact: true }).click();
    await expect(page.locator('.investigation-stage')).toContainText(a.manipulation);
    await page.getByRole('button', { name: 'Étape suivante', exact: true }).click();
    await page.getByLabel('Mes observations').fill('Une observation vérifiable.');
    await page.getByRole('button', { name: 'Étape suivante', exact: true }).click();
    await page
      .getByLabel('Mon explication du résultat')
      .fill('Je distingue le calcul de la vérité.');
    await page.getByRole('button', { name: 'Étape suivante', exact: true }).click();
    await expect(page.getByLabel('Code Python modifiable')).toHaveValue(a.python);
    await page.getByRole('button', { name: 'Étape suivante', exact: true }).click();
    await page
      .getByLabel('Ma réponse à la situation de transfert')
      .fill('Un cas différent et une source.');
    await page.getByRole('button', { name: 'Étape suivante', exact: true }).click();
    await page.getByLabel(a.quiz.choices[a.quiz.expected], { exact: true }).check();
    await page.getByRole('button', { name: 'Vérifier cette conclusion' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Conclusion validée' })).toBeVisible();
    await page.reload();
    await expect(page.locator('.stage-nav button[aria-current=step]')).toContainText('8');
  }
  await page.goto('./#/carnet');
  await page.getByText('Comment fabriquer un tokenizer ? — Évaluation', { exact: true }).click();
  await expect(
    page.getByText('Hypothèse : Hypothèse originale tokens', { exact: true }),
  ).toBeVisible();
});
test('120 et 180 : étapes, corrections à la demande, démo précédente et reprise des horloges', async ({
  page,
}) => {
  for (const duration of [120, 180]) {
    await page.goto('./#/animation/' + duration);
    await expect(page.locator('.projected-answer')).toHaveCount(0);
    await page.getByRole('button', { name: 'Démarrer / reprendre' }).click();
    await page.waitForTimeout(1100);
    await page.getByRole('button', { name: 'Mettre en pause' }).click();
    const before = await page.getByTestId('session-clock').innerText();
    expect(before).not.toBe('00:00:00');
    await page.getByRole('button', { name: 'Suivant', exact: true }).click();
    await page.getByRole('button', { name: 'Ouvrir la démonstration' }).click();
    await page.getByLabel('Température').fill('0.5');
    await page.getByRole('button', { name: 'Suivant', exact: true }).click();
    await page.getByRole('button', { name: 'Précédent', exact: true }).click();
    await page.getByRole('button', { name: 'Ouvrir la démonstration' }).click();
    await expect(page.getByLabel('Température')).toHaveValue('0.5');
    await page.getByRole('button', { name: 'Révéler la réponse', exact: true }).click();
    await expect(page.locator('.projected-answer')).toBeVisible();
    await page.reload();
    await expect(page.getByTestId('session-clock')).toHaveText(before);
    await expect(page.locator('.projected-answer')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.projected-answer')).toHaveCount(0);
    for (const step of scenarios.find((s) => s.duration === duration)!.steps) {
      await page
        .getByRole('button', {
          name: new RegExp('Étape \\d+ : ' + step.title.replace(/[.*+?^\$()|[\]{}]/g, '\\$&')),
        })
        .click();
      await expect(page.locator('h1')).toHaveText(step.title);
    }
  }
});
test('notes privées absentes du DOM projeté et des exports ; synchronisation deux fenêtres', async ({
  page,
  context,
}) => {
  await page.goto('./#/coulisses');
  await page.getByLabel('Notes privées').fill('SECRET FORMATEUR 9345');
  await page.goto('./#/animation/120');
  await expect(page.locator('body')).not.toContainText('SECRET FORMATEUR 9345');
  await page.getByRole('button', { name: 'Nouvelle séance' }).click();
  const projection = await context.newPage();
  await projection.goto('./#/projection/120');
  await page.getByRole('button', { name: 'Suivant', exact: true }).click();
  await expect(projection.locator('h1')).toHaveText('Comment une machine prédit-elle la suite ?');
  await expect(projection.locator('body')).not.toContainText('SECRET FORMATEUR 9345');
  expect(
    await projection.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), SESSION_KEY),
  ).not.toHaveProperty('privateNotes');
  await page.goto('./#/studio/120');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporter la fiche de conduite' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('llm-conduite-120.html');
  const path = await download.path();
  const content = await readFile(path!, 'utf8');
  expect(content).not.toContain('SECRET FORMATEUR 9345');
  expect(content).toContain('Réponse attendue');
  expect(await page.evaluate((key) => localStorage.getItem(key), PRIVATE_KEY)).toBe(
    'SECRET FORMATEUR 9345',
  );
});
test('RAG réel, abstention et import de texte sans exécution', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('./#/experience/rag');
  await page.getByRole('button', { name: 'Retrouver les passages' }).click();
  await expect(page.locator('.extractive-answer')).toContainText('[S1:');
  await page.getByLabel('Question documentaire').fill('xyzabsent');
  await page.getByRole('button', { name: 'Retrouver les passages' }).click();
  await expect(page.locator('.extractive-answer')).toContainText('abstention');
  await page.getByText('Modifier les trois documents locaux').click();
  await page.getByLabel('S1 —').fill('<script>globalThis.pwned=true</script> observatoire');
  await page.getByLabel('Question documentaire').fill('observatoire');
  await page.getByRole('button', { name: 'Retrouver les passages' }).click();
  expect(await page.evaluate(() => 'pwned' in globalThis)).toBe(false);
  expect(errors).toEqual([]);
});
test('sampling reproductible, attention causale et prompting aux critères mesurés', async ({
  page,
}) => {
  await page.goto('./#/experience/generation');
  await page.getByRole('button', { name: 'Effectuer 20 tirages' }).click();
  const trace = await page.getByTestId('sample-sequence').innerText();
  await page.getByRole('button', { name: 'Effectuer 20 tirages' }).click();
  await expect(page.getByTestId('sample-sequence')).toHaveText(trace);
  await page.getByLabel('Top-k', { exact: false }).selectOption('1');
  await page.getByRole('button', { name: 'Effectuer 20 tirages' }).click();
  await expect(page.getByTestId('sample-sequence')).not.toContainText('mer');
  await page.goto('./#/experience/attention');
  await page.getByRole('button', { name: 'Calculer les poids' }).click();
  await expect(page.locator('.measure-row').last()).toContainText('0.0 %');
  await page.goto('./#/experience/prompting');
  await expect(page.locator('body')).toContainText('limite dépassée');
  await expect(page.locator('body')).toContainText('limite respectée');
});
test('Python : réseau refusé, repli, input fourni et Worker arrêtable', async ({ page }) => {
  await page.route('https://cdn.jsdelivr.net/**', (route) => route.abort());
  await page.goto('./#/activite/tokens');
  await page.getByRole('button', { name: /Programmation/ }).click();
  await page.getByRole('button', { name: 'Exécuter Python' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Erreur Python' })).toBeVisible({
    timeout: 10000,
  });
  const p = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger le code .py' }).click();
  expect((await p).suggestedFilename()).toBe('experience-llm.py');
  await page.unroute('https://cdn.jsdelivr.net/**');
  await page.route('https://cdn.jsdelivr.net/**', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: 'export async function loadPyodide(){return new Promise(()=>{})}',
    }),
  );
  await page.getByLabel('Code Python modifiable').fill('while True: pass');
  await page.getByRole('button', { name: 'Exécuter Python' }).click();
  await page.getByRole('button', { name: 'Arrêter Python' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Worker est terminé' })).toBeVisible();
  await page.getByRole('button', { name: 'Réinitialiser Python' }).click();
  await expect(page.getByLabel('Entrées pour input()')).toHaveValue('la la lala');
});
for (const [theme, value] of [
  ['Clair', 'light'],
  ['Sombre', 'dark'],
  ['Projection', 'projector'],
]) {
  test('V2 visuels et accessibilité : ' + theme, async ({ page }, info) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const route of [
      '',
      '#/atelier',
      '#/activite/probabilites',
      '#/studio',
      '#/studio/120',
      '#/studio/180',
      '#/animation/120',
      '#/projection/180',
      '#/experience/prediction',
      '#/experience/attention',
      '#/experience/detective',
      '#/experience/prompting',
      '#/experience/rag',
      '#/experience/training',
      '#/experience/embeddings',
      '#/experience/transformer',
      '#/module/07',
      '#/module/08',
      '#/module/09',
    ]) {
      await page.goto('./' + route);
      if (!route.includes('animation') && !route.includes('projection'))
        await page.getByLabel(theme, { exact: true }).check();
      for (const width of [390, 768, 1280, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1080 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        if (
          (route === '' || route === '#/animation/120' || route === '#/experience/prediction') &&
          [390, 1440, 1920].includes(width)
        )
          await page.screenshot({
            path: info.outputPath(
              (route.replace(/[^a-z0-9]/gi, '') || 'home') + '-' + value + '-' + width + '.png',
            ),
            fullPage: true,
          });
      }
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        axe.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}
test('V2 utilisable hors ligne après cache, y compris les instruments chargés à la demande', async ({
  page,
  context,
}) => {
  await page.goto('./#/studio/120');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  try {
    await page.reload();
    await page.getByRole('link', { name: 'Ouvrir la console' }).click();
    await expect(page.locator('h1')).toHaveText('Ouvrir la boîte noire');
    await page.goto('./#/experience/training');
    await expect(page.locator('#intuitive-training')).toBeVisible();
    await page.goto('./#/experience/rag');
    await page.getByRole('button', { name: 'Retrouver les passages' }).click();
    await expect(page.locator('.extractive-answer')).toContainText('[S1:');
  } finally {
    await context.setOffline(false);
  }
});
