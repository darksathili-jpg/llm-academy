import { expect, test } from '@playwright/test';

const url = 'pilotes/formation-v4/';

test('la génération expose les comptes, change de contexte et distingue les arrêts', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url);
  await page.getByRole('button', { name: 'Générer un texte pas à pas' }).click();
  const step = page.getByRole('button', { name: 'Générer un token' });
  const restart = page.getByRole('button', { name: 'Recommencer avec ces valeurs' });
  const status = page.locator('#v4-generation-status');
  const trace = page.locator('#v4-generation-trace li');
  await step.click();
  await expect(trace.first()).toContainText('« dort » (2) 2/3');
  await expect(trace.first()).toContainText('« joue » (4) 1/3');
  const first = await trace.first().innerText();
  await step.click();
  await expect(trace.nth(1)).toContainText(/Après « (dort|joue) »/);
  await expect(status).toContainText('Arrêt sur le signe de fin');
  await expect(step).toBeDisabled();
  await restart.click();
  await step.click();
  await expect(trace.first()).toHaveText(first);
  await page.locator('#v4-budget').fill('1');
  await expect(step).toBeDisabled();
  await restart.click();
  await step.click();
  await expect(status).toContainText('Arrêt au budget de 1');
  await page.locator('#v4-prefix').fill('dragon');
  await restart.click();
  await expect(status).toContainText('Arrêt faute de suite observée');
  await expect(step).toBeDisabled();
  expect(errors).toEqual([]);
});

test('les liens de chapitre, les téléchargements Python et les fiches suivent le parcours', async ({
  page,
}) => {
  await page.goto(url);
  await page.locator('#chapterGrid [data-open="1"]').click();
  await page.getByRole('button', { name: 'Travail pratique de fusion' }).click();
  await expect(page.locator('#v4-tp-fusion')).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Synthèse', exact: false })).toBeVisible();
  for (const filename of ['fusion', 'recherche', 'generation']) {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: `Télécharger ${filename}.py`, exact: true }).click(),
    ]);
    expect(download.suggestedFilename()).toBe(`${filename}.py`);
  }
  const fiches = page.getByRole('button', { name: 'Fiches de séance' });
  await expect(fiches).toBeHidden();
  await page.getByRole('button', { name: 'Enseignant', exact: true }).click();
  await fiches.click();
  await expect(page.getByRole('heading', { name: 'Essai en classe à documenter' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Télécharger le corrigé Python de la recherche' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Élève', exact: true }).click();
  await expect(page.locator('#screen-teacher')).toBeHidden();
  await expect(page.locator('#screen-home')).toBeVisible();
});
