import {test,expect} from '@playwright/test';
const url='pilotes/evaluation-attention-n0-n5/index.html';
async function openEvaluation(page: import('@playwright/test').Page) {
 const response=await openEvaluation(page);
 expect(response?.status(), 'La page doit être disponible dans dist. Exécuter npm run build avant Playwright.').toBe(200);
 await expect(page.locator('#level'), 'Page N0–N5 absente : dist obsolète. Exécuter npm run build.').toBeVisible();
}

test('évaluation graduée : pas de passage sans réponse, traces et six niveaux',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await openEvaluation(page);
 await expect(page.locator('#level')).toContainText('N0');
 await page.locator('#submit').click();await expect(page.locator('#rubric')).toBeHidden();
 for(let i=0;i<6;i++){
  await expect(page.locator('#level')).toContainText('N'+i);
  await page.locator('#response').fill('Justification argumentée du niveau '+i);
  if(i===1)await page.locator('#hint').click();
  await page.locator('#submit').click();
  await expect(page.locator('#rubric')).toBeVisible();
  if(i<5)await page.locator('#next').click();
 }
 await expect(page.locator('#progress')).toContainText('6 niveau(x)');
 await page.locator('#next').click();
 await expect(page.locator('#feedback')).toContainText('évaluateur');
 expect(errors).toEqual([]);
});
test('enseignant : protocole explicite et réinitialisation',async({page})=>{
 await openEvaluation(page);await page.locator('#role').selectOption('enseignant');
 await expect(page.locator('#teacherTask')).toContainText('deux conceptions initiales');
 await page.locator('#response').fill('Diagnostic de prérequis');await page.locator('#submit').click();
 await expect(page.locator('#progress')).toContainText('1 niveau(x)');
 await page.locator('#reset').click();
 await expect(page.locator('#progress')).toContainText('0 niveau(x)');
 await expect(page.locator('#level')).toContainText('N0');
});
