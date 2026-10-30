import { expect, test } from '@playwright/test';

const url = 'pilotes/formation-v4/index.html';
async function chapter(page: import('@playwright/test').Page, i: number) {
  await page.goto(url);
  await page.locator(`#chapterGrid [data-open="${i}"]`).click();
  await expect(page.locator('#screen-course')).toBeVisible();
}

test('Q4 softmax : scores [2,1,0] et variation de température', async ({ page }) => {
  await chapter(page, 2);
  // Oracle indépendant : [e²,e,1]/(e²+e+1) ≈ [66,5%;24,5%;9,0%].
  await expect(page.locator('#probaBars')).toContainText('66,5 %');
  await expect(page.locator('#probaBars')).toContainText('24,5 %');
  await expect(page.locator('#probaBars')).toContainText('9,0 %');
  await page.locator('#temperature').fill('2');
  await expect(page.locator('#probaBars')).toContainText('50,6 %');
  await expect(page.locator('#probaBars')).toContainText('30,7 %');
  await expect(page.locator('#probaBars')).toContainText('18,6 %');
});

test('Q4 masque causal : positions futures interdites', async ({ page }) => {
  await chapter(page, 3);
  const buttons = page.locator('#maskGrid button');
  await expect(buttons).toHaveCount(16);
  await expect(page.locator('#maskGrid button[aria-label*="interdite"]')).toHaveCount(6);
  await expect(page.locator('#maskGrid button[aria-label*="autorisée"]')).toHaveCount(10);
});

test('Q4 entraînement : perte baisse sur dort et augmente sur mange', async ({ page }) => {
  await chapter(page, 4);
  await expect(page.locator('#trainLoss')).toHaveText('1,099');
  await expect(page.locator('#valLoss')).toHaveText('1,099');
  await page.locator('#trainStep').click();
  await expect(page.locator('#trainLoss')).toHaveText('0,693');
  await expect(page.locator('#valLoss')).toHaveText('1,386');
});

test('Q4 vecteurs : cosinus indépendant 0,8 ; 0 ; -1', async ({ page }) => {
  await chapter(page, 7);
  await expect(page.locator('#vectorCalc')).toContainText('cosinus = 0.80');
  await page.locator('[data-vector="1"]').click();
  await expect(page.locator('#vectorCalc')).toContainText('cosinus = 0.00');
  await page.locator('[data-vector="2"]').click();
  await expect(page.locator('#vectorCalc')).toContainText('cosinus = -1.00');
});

test('Q4 attention : moyenne softmax de 10 et 20', async ({ page }) => {
  await chapter(page, 8);
  await expect(page.locator('#attCalc')).toContainText('17.311');
  await page.locator('#attScore').fill('0');
  await expect(page.locator('#attCalc')).toContainText('15.000');
});

test('Q4 gradient : pas sûr puis pas trop grand', async ({ page }) => {
  await chapter(page, 10);
  await expect(page.locator('#gradientCalc')).toContainText('perte = 4.000');
  await page.locator('#gradientStep').click();
  await expect(page.locator('#gradientCalc')).toContainText('Paramètre w = 1.000');
  await expect(page.locator('#gradientCalc')).toContainText('perte = 1.000');
  await page.locator('#gradientReset').click();
  await page.locator('#gradientEta').selectOption('1.2');
  await page.locator('#gradientStep').click();
  await expect(page.locator('#gradientCalc')).toContainText('perte = 7.840');
});

test('Q4 top-k : un seul candidat à k=1', async ({ page }) => {
  await chapter(page, 11);
  await page.locator('#samplingK').selectOption('1');
  await expect(page.locator('#samplingView')).toContainText('canapé : 100.0 %');
  await expect(page.locator('#samplingView')).toContainText('tapis : 0.0 %');
  await expect(page.locator('#samplingView')).toContainText('bureau : 0.0 %');
});

test('Q4 LoRA : facteurs 4×r et r×4 → 8r coefficients', async ({ page }) => {
  await chapter(page, 12);
  await expect(page.locator('#loraCount')).toContainText('8 coefficients');
  await page.locator('#loraRank').fill('2');
  await expect(page.locator('#loraCount')).toContainText('16 coefficients.');
  await page.locator('#loraRank').fill('4');
  await expect(page.locator('#loraCount')).toContainText('32 coefficients.');
});

test('Q4 classification : précision, rappel, exactitude + zéro vrai positif', async ({ page }) => {
  await chapter(page, 14);
  await expect(page.locator('#evScore')).toContainText('Précision = 75.0 %');
  await expect(page.locator('#evScore')).toContainText('rappel = 60.0 %');
  await expect(page.locator('#evScore')).toContainText('exactitude = 70.0 %');
  await page.locator('#evTP').fill('0');
  await page.locator('#evFP').fill('0');
  await expect(page.locator('#evScore')).toContainText('Précision = non définie');
  await expect(page.locator('#evScore')).toContainText('rappel = 0.0 %');
  await expect(page.locator('#evScore')).toContainText('exactitude = 66.7 %');
});
