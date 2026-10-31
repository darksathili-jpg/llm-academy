import {expect,test} from '@playwright/test';
const url='pilotes/microduck-attention-reelle-r1/index.html';
test('attention réelle : hypothèse avant données et poids normalisés',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);
 await expect(page.locator('#loadError')).toBeHidden();
 await expect(page.locator('#lab')).toBeHidden();
 await page.locator('[data-pred="3"]').click();
 await page.locator('#reveal').click();
 await expect(page.locator('#before tr')).toHaveCount(9);
 await expect(page.locator('#after tr')).toHaveCount(9);
 await expect(page.locator('#strip img')).toHaveCount(1);
 expect(await page.locator('#strip img').evaluate((x:HTMLImageElement)=>x.complete&&x.naturalWidth===256)).toBe(true);
 await page.locator('#before td button').nth(0).click();
 await expect(page.locator('#cellDetail')).toContainText('Poids réellement calculé');
 await page.locator('#head').selectOption('2');
 await expect(page.locator('#before tr')).toHaveCount(9);
 expect(errors).toEqual([]);
});
test('attention réelle : transfert indépendant et provenance renseignée',async({page})=>{
 await page.goto(url);
 await expect(page.locator('#provenance')).toContainText('250 mises à jour');
 await page.locator('[data-pred="2"]').click();
 await page.locator('#reveal').click();
 await page.locator('#count').fill('7');
 await page.locator('#argument').fill('Indices 0 à 6 ; futur 7, 8 et 9 interdit.');
 await page.locator('#check').click();
 await expect(page.locator('#transferResult')).toContainText('Évaluation humaine nécessaire');
});
