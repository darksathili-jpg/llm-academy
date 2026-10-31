import {expect,test} from '@playwright/test';
const url='pilotes/microduck-attention-r1/index.html';
test('hypothèse requise avant révélation, puis masque correct',async({page})=>{
  await page.goto(url);
  await expect(page.locator('#verify')).toBeHidden();
  await expect(page.locator('#reveal')).toBeDisabled();
  await page.locator('[data-guess="3"]').click();
  await page.locator('#reveal').click();
  await expect(page.locator('#verify')).toBeVisible();
  await expect(page.locator('#mask tr')).toHaveCount(7);
  await expect(page.locator('#mask td.yes')).toHaveCount(21);
  await expect(page.locator('#mask td.no')).toHaveCount(15);
  await page.locator('#position').fill('4');
  await expect(page.locator('#explain')).toContainText('5 position(s)');
});
test('transfert sans animation ni certification automatique',async({page})=>{
  await page.goto(url);
  await page.locator('[data-guess="2"]').click();
  await page.locator('#reveal').click();
  await page.locator('#next').click();
  await expect(page.locator('#transfer')).toBeVisible();
  await page.locator('#number').fill('7');
  await page.locator('#reason').fill('Les indices 0,1,2,3,4,5,6 sont accessibles ; 7,8,9 sont futurs.');
  await page.locator('#check').click();
  await expect(page.locator('#transferFeedback')).toContainText('correction humaine');
});
