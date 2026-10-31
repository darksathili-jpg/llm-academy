import {expect,test} from '@playwright/test';
const url='pilotes/microduck-transversal-r1/index.html';
test('tokens : hypothèse obligatoire, fusion et transfert',async({page})=>{
 await page.goto(url);
 await expect(page.locator('#tokReveal')).toBeHidden();
 await page.locator('#tokPredict').click();
 await expect(page.locator('#tokReveal')).toBeHidden();
 await page.locator('#tokGuess').fill('3');
 await page.locator('#tokPredict').click();
 await expect(page.locator('#tokUnits .tok')).toHaveText(['a','b','a','b','a']);
 await page.locator('#tokMerge').click();
 await expect(page.locator('#tokUnits .tok')).toHaveText(['ab','ab','a']);
 await page.locator('#tokTransfer').fill('b, ab, ab');
 await page.locator('#tokCheck').click();
 await expect(page.locator('#tokTransferFeedback')).toContainText('Découpage correct');
});
test('probabilités : prédiction, softmax et effet de température',async({page})=>{
 await page.goto(url);
 await page.locator('#probTab').click();
 await expect(page.locator('#probReveal')).toBeHidden();
 await page.locator('[data-probguess="no"]').click();
 await expect(page.locator('#probReveal')).toBeVisible();
 await expect(page.locator('#probBars')).toContainText('66,5 %');
 await page.locator('#temperature').fill('2');
 await expect(page.locator('#probBars')).toContainText('50,6 %');
 await page.locator('[data-transfer="decrease"]').click();
 await expect(page.locator('#probTransferFeedback')).toContainText('Correct');
});
