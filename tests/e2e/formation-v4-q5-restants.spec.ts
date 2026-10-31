import { expect, test } from '@playwright/test';

const url = 'pilotes/formation-v4/index.html';
async function open(page: import('@playwright/test').Page, index: number) {
  await page.goto(url);
  await page.locator(`#chapterGrid [data-open="${index}"]`).click();
  await expect(page.locator('#screen-course')).toBeVisible();
}

test('Q5 sources : confirmé, contredit, absent ; erreur puis correction', async ({ page }) => {
  await open(page, 0);
  await expect(page.locator('#factLocal')).toBeEmpty();
  await page.getByRole('button', { name: 'Contredite', exact: true }).click();
  await expect(page.locator('#factLocal')).toContainText('Examine les mots');
  await page.getByRole('button', { name: 'Confirmée', exact: true }).click();
  await expect(page.locator('#factLocal')).toContainText('Juste');
  await page.getByRole('button', { name: /Affirmation suivante/ }).click();
  await page.getByRole('button', { name: 'Contredite', exact: true }).click();
  await expect(page.locator('#factLocal')).toContainText('Juste');
  await page.getByRole('button', { name: /Affirmation suivante/ }).click();
  await page.getByRole('button', { name: 'Impossible à déterminer' }).click();
  await expect(page.locator('#factLocal')).toContainText('Juste');
});

test('Q5 tokenisation : fusion de paires sans chevauchement', async ({ page }) => {
  await open(page, 1);
  await expect(page.locator('#tokenList .tok')).toHaveCount(4);
  await page.locator('#tokMerge').click();
  await expect(page.locator('#tokenList .tok')).toHaveText(['ab','ab']);
  await page.locator('#tokB').click();
  await page.locator('#tokMerge').click();
  await expect(page.locator('#tokenList .tok')).toHaveText(['ab','ab','a']);
  await page.locator('#tokC').click();
  await page.locator('#tokMerge').click();
  await expect(page.locator('#tokenList .tok')).toHaveText(['b','ab','a']);
});

test('Q5 recherche : lac/placard, absence et requête vide', async ({ page }) => {
  await open(page, 5);
  await page.locator('#ragGo').click();
  await expect(page.locator('#ragMatches')).toContainText('2 document(s)');
  await expect(page.locator('#ragMatches')).toContainText('S1');
  await expect(page.locator('#ragMatches')).toContainText('S2');
  await page.locator('#ragQuery').fill('introuvable');
  await page.locator('#ragGo').click();
  await expect(page.locator('#ragMatches')).toContainText('0 document(s)');
  await page.locator('#ragQuery').fill('   ');
  await page.locator('#ragGo').click();
  await expect(page.locator('#ragMatches')).toContainText('Recherche vide : aucun résultat');
});

test('Q5 données : recouvrement A sans déduplication et séparation après', async ({ page }) => {
  await open(page, 6);
  await page.locator('#dataNo').click();
  await expect(page.locator('#dataView')).toContainText('Validation : A');
  await expect(page.locator('#labResult')).toContainText('Fuite visible');
  await page.locator('#dataYes').click();
  await expect(page.locator('#dataView')).toContainText('Validation : D');
  await expect(page.locator('#dataView')).toContainText('Test final : E');
  await expect(page.locator('#labResult')).toContainText('aucun identifiant');
});

test('Q5 architecture : six étapes et distinction attention/distribution', async ({ page }) => {
  await open(page, 9);
  await expect(page.locator('#pipelineBtns button')).toHaveCount(6);
  await page.locator('#pipelineBtns button').nth(3).click();
  await expect(page.locator('#pipelineText')).toContainText('premier token ne peut pas consulter le second');
  await expect(page.locator('#labResult')).toContainText('Le masque causal');
  await page.locator('#pipelineBtns button').nth(5).click();
  await expect(page.locator('#pipelineText')).toContainText('softmax');
  await expect(page.locator('#labResult')).toContainText('distribution');
});

test('Q5 consignes : JSON, texte, champ absent et non-vérification factuelle', async ({ page }) => {
  await open(page, 13);
  await expect(page.locator('#pOutput')).toHaveText('{"lieu":"bibliothèque","jour":"mardi"}');
  await page.locator('#pJson').uncheck();
  await page.locator('#pDo').click();
  await expect(page.locator('#pOutput')).toHaveText('Lieu : bibliothèque ; jour : mardi');
  await page.locator('#pLieu').fill('');
  await page.locator('#pDo').click();
  await expect(page.locator('#labResult')).toContainText('Renseigne les deux champs');
  await page.locator('#pLieu').fill('bibliothèque');
  await page.locator('#pJson').check();
  await page.locator('#pDo').click();
  await expect(page.locator('#pOutput')).toHaveText('{"lieu":"bibliothèque","jour":"mardi"}');
  await expect(page.locator('#labResult')).toContainText('ne peut pas vérifier automatiquement');
});
