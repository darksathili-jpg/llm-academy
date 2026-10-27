import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('première découverte : phrase, vingt choix réels, source et erreur corrigée', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'Commencer en 5 minutes, sans code →' }).click();
  await expect(page.locator('h1')).toHaveText('Quel mot vient ensuite ?');
  await expect(page.getByRole('button', { name: /Comparer avec/ })).toBeDisabled();
  await page.getByLabel('tapis', { exact: true }).check();
  await page.getByRole('button', { name: /Comparer avec/ }).click();
  await expect(page.locator('body')).toContainText('Tu as proposé « tapis »');
  const initial = await page.locator('.choice-results li strong').allTextContents();
  expect(initial.map(Number).reduce((a, b) => a + b, 0)).toBe(20);
  await expect(page.getByRole('button', { name: /Continuer :/ })).toBeDisabled();
  await page.getByRole('button', { name: 'Choix plus variés', exact: true }).click();
  const varied = await page.locator('.choice-results li strong').allTextContents();
  expect(varied.map(Number).reduce((a, b) => a + b, 0)).toBe(20);
  expect(varied).not.toEqual(initial);
  await page.getByRole('button', { name: 'Choix presque toujours identiques' }).click();
  await expect(page.locator('.choice-results li strong')).toHaveText(initial);
  await page.getByRole('button', { name: /Continuer :/ }).click();
  await page.getByLabel('Le document confirme cette réponse.', { exact: true }).check();
  await page.getByRole('button', { name: 'Vérifier avec le document' }).click();
  await expect(page.locator('.feedback')).toContainText('Tu peux changer ton choix');
  await expect(page.getByRole('button', { name: /Retenir/ })).toHaveCount(0);
  await page.getByLabel('Le document dit le contraire.', { exact: true }).check();
  await page.getByRole('button', { name: 'Vérifier avec le document' }).click();
  await page.getByRole('button', { name: /Retenir/ }).click();
  await expect(page.locator('.takeaways li')).toHaveCount(3);
  await page.getByText('Les trois mots techniques, maintenant expliqués').click();
  await expect(page.locator('.plain-glossary')).toContainText('Ce n’est pas de la chaleur');
  await page.getByRole('link', { name: /Première activité :/ }).click();
  await expect(page.locator('h1')).toHaveText('Une réponse bien écrite est-elle forcément vraie ?');
});
test('découpage simple : calcul BPE réel, texte modifiable et détails scientifiques disponibles', async ({
  page,
}) => {
  await page.goto('./#/experience/tokenizer');
  await expect(page.locator('.instrument')).toContainText('8 morceaux');
  await page.getByRole('button', { name: /Fusion suivante :/ }).click();
  await expect(page.locator('.instrument')).toContainText('4 morceaux');
  await page.getByRole('button', { name: 'Revenir aux lettres séparées' }).click();
  await expect(page.locator('.instrument')).toContainText('8 morceaux');
  await page.getByLabel('Texte à découper').fill('école école');
  await expect(page.locator('.instrument')).toContainText('10 morceaux');
  await page.getByLabel('Scientifique', { exact: true }).check();
  await expect(page.locator('#bpe-lab')).toBeVisible();
});
test('découverte accessible dans les trois modes, clavier et cinq largeurs', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const theme of ['Clair', 'Sombre', 'Projection']) {
    await page.goto('./#/decouvrir');
    await page.reload();
    await page.getByLabel(theme, { exact: true }).check();
    await page.getByLabel('canapé', { exact: true }).check();
    await page.getByRole('button', { name: /Comparer avec/ }).click();
    await expect(page.locator('h1')).toBeFocused();
    for (const width of [390, 768, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.screenshot({
      path: info.outputPath('decouverte-' + theme + '.png'),
      fullPage: true,
    });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('dossier enseignant : remédiation, transfert, référence Python', async ({ page }) => {
  await page.goto('./#/enseignant');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Enseigner sans présupposer');
  const first = page.locator('details.lesson-section').first();
  await first.locator('summary').first().click();
  await expect(first).toContainText('Conception erronée probable');
  await expect(first).toContainText('Ce que l’enseignant doit observer');
  await first.getByText('Code de référence et assertions', { exact: true }).click();
  await expect(first.locator('pre.code-output')).toContainText('assert classer');
});

test('Terminale NSI : mission Python au choix et bilan sans fausse certification', async ({
  page,
}) => {
  await page.goto('./#/activite/tokens');
  await page.getByText('Aller à une autre étape', { exact: true }).click();
  await page.getByRole('button', { name: /Coder \(facultatif\)/ }).click();
  await page.getByRole('button', { name: /Mission Python NSI : Compter des paires/ }).click();
  await expect(page.locator('.investigation-stage')).toContainText('deux caractères');
  await page.getByText('Afficher le code Python', { exact: true }).click();
  await expect(page.getByLabel('Code Python modifiable')).toHaveValue(/def compter_paires\(mots\)/);
  await page.getByText('Consulter le corrigé Python après mes essais').click();
  await expect(page.locator('.investigation-stage pre.code-output').last()).toContainText(
    'effectifs.get(paire, 0)',
  );
  await page.getByRole('button', { name: /Vérifier ta compréhension/ }).click();
  await expect(page.getByRole('heading', { name: 'Bilan de mes traces' })).toBeVisible();
  await expect(page.getByLabel('Bilan de mes traces')).toContainText('Il manque encore des traces');
});
