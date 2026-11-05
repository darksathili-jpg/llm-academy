import {expect,test} from '@playwright/test';
const url='pilotes/microduck-qkv-r1/index.html';
test('QKV : hypothèse, produits scalaires, softmax et somme pondérée',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);
 await expect(page.getByRole('link',{name:/pourquoi l’attention existe/})).toHaveAttribute('href','../microduck-introduction-attention-r1/index.html');
 await expect(page.locator('#step2')).toBeHidden();
 await expect(page.locator('#unlock')).toBeDisabled();
 await page.locator('[data-mask="current"]').click();await page.locator('#unlock').click();
 await page.locator('#dot0').fill('1');await page.locator('#dot1').fill('0');await page.locator('#checkDot').click();
 await expect(page.locator('#step3')).toBeVisible();
 await page.locator('#p0').fill('0.67');await page.locator('#checkSoftmax').click();
 await expect(page.locator('#step4')).toBeVisible();
 await page.locator('#out0').fill('1.34');await page.locator('#out1').fill('1.32');await page.locator('#checkValues').click();
 await expect(page.locator('#step5')).toBeVisible();
 await expect(page.locator('#track img')).toHaveCount(1);
 expect(await page.locator('#track img').evaluate((x:HTMLImageElement)=>x.complete&&x.naturalWidth===256)).toBe(true);
 expect(errors).toEqual([]);
});
test('QKV : erreur de produit scalaire empêche de franchir le gate',async({page})=>{
 await page.goto(url);await page.locator('[data-mask="all"]').click();await page.locator('#unlock').click();
 await page.locator('#dot0').fill('5');await page.locator('#dot1').fill('0');await page.locator('#checkDot').click();
 await expect(page.locator('#step3')).toBeHidden();
 await expect(page.locator('#dotFeedback')).toContainText('Recalcule');
});
