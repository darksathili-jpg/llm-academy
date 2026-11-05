import { test, expect } from '@playwright/test';
const url='pilotes/microduck-introduction-embeddings-r1/index.html';
async function open(page: import('@playwright/test').Page) {
 const r=await page.goto(url);
 expect(r?.status(), 'Exécuter npm run build pour mettre dist à jour').toBe(200);
 await expect(page.getByRole('heading',{name:'Pourquoi donner des vecteurs aux tokens ?'})).toBeVisible();
}
test('embeddings : de l’identifiant à la distance puis au cosinus',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await open(page);
 await expect(page.locator('#vectors')).toBeHidden();
 await page.locator('[data-id="no"]').click();await page.locator('#go2').click();
 await expect(page.locator('#vectors')).toBeVisible();
 await expect(page.locator('.tile img')).toHaveCount(1);
 expect(await page.locator('.tile img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth===256)).toBe(true);
 await page.locator('#distance').fill('2.83');await page.locator('#checkDistance').click();await page.locator('#go3').click();
 await expect(page.locator('#compare')).toBeVisible();
 await page.locator('#dot').fill('2');await page.locator('#checkDot').click();
 await expect(page.locator('#cosSection')).toBeVisible();
 await page.locator('#cos').fill('0.71');await page.locator('#checkCos').click();
 await expect(page.locator('#go4')).toBeEnabled();await page.locator('#go4').click();
 await expect(page.locator('#transfer')).toBeVisible();
 expect(errors).toEqual([]);
});
test('embeddings : un calcul erroné ne débloque pas le transfert et la justification n’est pas certifiée',async({page})=>{
 await open(page);
 await page.locator('[data-id="yes"]').click();await page.locator('#go2').click();
 await page.locator('#distance').fill('2');await page.locator('#checkDistance').click();
 await expect(page.locator('#go3')).toBeDisabled();
 await page.locator('#distance').fill('2.83');await page.locator('#checkDistance').click();await page.locator('#go3').click();
 await page.locator('#dot').fill('2');await page.locator('#checkDot').click();
 await page.locator('#cos').fill('0.71');await page.locator('#checkCos').click();await page.locator('#go4').click();
 await page.locator('#uv').fill('5');await page.locator('#uw').fill('3');
 await page.locator('#justify').fill('La distance UV vaut 5 alors que UW vaut 3 ; un identifiant n’est qu’une étiquette et non une coordonnée.');
 await page.locator('#checkTransfer').click();
 await expect(page.locator('#transferFeedback')).toContainText('Distances correctes');
 await expect(page.locator('#transferFeedback')).toContainText('pas certifiée automatiquement');
});
test('oracles vectoriels de référence indépendants de l’interface',async()=>{
 expect(Math.hypot(2,-2)).toBeCloseTo(Math.sqrt(8),12);
 expect(2/(2*Math.sqrt(2))).toBeCloseTo(Math.SQRT1_2,12);
 expect(Math.hypot(3,-4)).toBe(5);
 expect(Math.hypot(-3,0)).toBe(3);
});
