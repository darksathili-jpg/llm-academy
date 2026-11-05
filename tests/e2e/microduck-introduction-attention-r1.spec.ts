import { expect, test } from '@playwright/test';
const url='pilotes/microduck-introduction-attention-r1/index.html';
async function open(page:import('@playwright/test').Page){
 const response=await page.goto(url);
 expect(response?.status(), 'Reconstruire dist avec npm run build avant les tests').toBe(200);
 await expect(page.getByRole('heading',{name:'À quoi sert l’attention dans un Transformer ?'})).toBeVisible();
}
test('prérequis : hypothèse et justification requises, sprite unique et progression',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await open(page);
 await expect(page.locator('#part2')).toBeHidden();
 await expect(page.locator('#go2')).toBeDisabled();
 await page.locator('[data-intuition="look"]').click();
 await expect(page.locator('#go2')).toBeDisabled();
 await page.locator('#why').fill('Il combine plusieurs représentations du contexte sans raisonnement conscient.');
 await page.locator('#go2').click();
 await expect(page.locator('#part2')).toBeVisible();
 await expect(page.locator('#tiles img')).toHaveCount(1);
 expect(await page.locator('#tiles img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth===256)).toBe(true);
 await page.locator('[data-access="different"]').click();
 await page.locator('#go3').click();
 await expect(page.locator('#part3')).toBeVisible();
 await expect(page.locator('#formula')).toContainText('6,50');
 await page.locator('#slider').fill('50');
 await expect(page.locator('#formula')).toContainText('5,00');
 await page.locator('[data-weight="two"]').click();
 await page.locator('#go4').click();
 await expect(page.locator('#part4')).toBeVisible();
 expect(errors).toEqual([]);
});
test('transfert : oracle exact, nouvelle situation, pas de certification automatique',async({page})=>{
 await open(page);
 await page.locator('[data-intuition="look"]').click();
 await page.locator('#why').fill('Les informations accessibles peuvent être combinées avec des poids.');
 await page.locator('#go2').click();
 await page.locator('[data-access="different"]').click();
 await page.locator('#go3').click();
 await page.locator('[data-weight="two"]').click();
 await page.locator('#go4').click();
 await page.locator('#count').fill('5');
 await page.locator('#output').fill('5.70');
 await page.locator('#explanation').fill('Les indices futurs 5 et 6 sont masqués. Les poids autorisés peuvent différer.');
 await page.locator('#check').click();
 await expect(page.locator('#transferFeedback')).toContainText('Résultats numériques corrects : 5 positions et 5,70');
 await expect(page.locator('#transferFeedback')).toContainText('évaluée par un enseignant');
 await expect(page.locator('#nextLinks')).toBeVisible();
 await expect(page.locator('#nextLinks a').first()).toHaveAttribute('href','../microduck-qkv-r1/index.html');
});
