import {test,expect} from '@playwright/test';
const url='pilotes/microduck-introduction-softmax-r1/index.html';
async function open(page:import('@playwright/test').Page){
 const response=await page.goto(url);
 expect(response?.status(),'Recompiler avec npm run build avant Playwright').toBe(200);
 await expect(page.getByRole('heading',{name:'Pourquoi transformer des scores en probabilités ?'})).toBeVisible();
}
async function unlockExplore(page:import('@playwright/test').Page){
 await page.locator('[data-guess="no"]').click();
 await page.locator('#why').fill('Les scores ne sont pas encore des probabilités car leur somme n’est pas égale à un.');
 await page.locator('#go2').click();
 await expect(page.locator('#part2')).toBeVisible();
}
async function unlockCalculate(page:import('@playwright/test').Page){
 await unlockExplore(page);
 await page.locator('[data-predict="flat"]').click();
 await page.locator('#go3').click();
 await expect(page.locator('#part3')).toBeVisible();
}
test('softmax : hypothèse avant révélation, distribution et changement de température',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await open(page);
 await expect(page.locator('#go2')).toBeDisabled();
 await expect(page.locator('#part2')).toBeHidden();
 await unlockExplore(page);
 const vals=await page.locator('#bars output').allTextContents();
 expect(vals).toEqual(['0,665','0,245','0,090']);
 await page.locator('#temp').fill('2');
 const vals2=await page.locator('#bars output').allTextContents();
 expect(vals2).toEqual(['0,506','0,307','0,186']);
 await expect(page.locator('#sum')).toContainText('1,000000000000');
 await expect(page.locator('#part1 .duck img')).toHaveCount(1);
 await expect(page.locator('#part4 .duck img')).toHaveCount(1);
 await expect(page.locator('.duck img')).toHaveCount(2);
 expect(errors).toEqual([]);
});
test('softmax : réponses numériques fausses ne débloquent pas le défi ; NumWorks optionnelle',async({page})=>{
 await open(page);
 await expect(page.locator('[data-llm-calculator] iframe')).toHaveCount(0);
 await unlockCalculate(page);
 await page.locator('#pA').fill('0.9');
 await page.locator('#checkPA').click();
 await expect(page.locator('#advanced')).toBeHidden();
 await page.locator('#pA').fill('0.665');
 await page.locator('#checkPA').click();
 await expect(page.locator('#advanced')).toBeVisible();
 await page.locator('[data-shift="same"]').click();
 await page.locator('#go4').click();
 await expect(page.locator('#part4')).toBeVisible();
 await page.locator('#transferD').fill('0.629');
 await page.locator('#transferE').fill('0.231');
 await page.locator('#transferF').fill('0.140');
 await page.locator('#checkTransfer').click();
 await expect(page.locator('#go5')).toBeDisabled();
 await page.locator('#transferReason').fill('Je divise les scores par T, je calcule leurs exponentielles, puis je normalise. Une probabilité ne garantit pas la vérité.');
 await page.locator('#checkTransfer').click();
 await expect(page.locator('#go5')).toBeEnabled();
 await page.locator('#go5').click();
 await expect(page.locator('#part5')).toBeVisible();
 await page.locator('#criticalReason').fill('Le calcul naïf des exponentielles peut déborder en flottants. Pour éviter cela, je soustrais le maximum des scores et je vérifie la somme, la finitude et l’invariance par translation avec un test Python.');
 await page.locator('#showRubric').click();
 await expect(page.locator('#rubric')).toBeVisible();
});
test('oracles : softmax stable et invariance par translation',async()=>{
 const stable=(scores:number[],T:number)=>{const z=scores.map(x=>x/T),m=Math.max(...z),ex=z.map(v=>Math.exp(v-m)),den=ex.reduce((a,b)=>a+b,0);return ex.map(v=>v/den)};
 const a=stable([2,1,0],1),b=stable([1002,1001,1000],1),c=stable([2,0,-1],2);
 expect(a[0]).toBeCloseTo(0.665240956,7);
 expect(c[0]).toBeCloseTo(0.62853172,7);
 expect(c[1]).toBeCloseTo(0.23122390,7);
 expect(c[2]).toBeCloseTo(0.14024438,7);
 for(let i=0;i<3;i++)expect(a[i]).toBeCloseTo(b[i],12);
 expect(c.reduce((x,y)=>x+y,0)).toBeCloseTo(1,12);
});

test('les conceptions erronées déclenchent une remédiation avant progression',async({page})=>{
 await open(page);
 await page.locator('[data-guess="yes"]').click();
 await page.locator('#why').fill('J’avais cru que le score valait directement une probabilité.');
 await expect(page.locator('#go2')).toBeDisabled();
 await page.locator('[data-guess="no"]').click();
 await expect(page.locator('#go2')).toBeEnabled();
 await page.locator('#go2').click();
 await page.locator('[data-predict="sharp"]').click();
 await expect(page.locator('#go3')).toBeDisabled();
 await page.locator('[data-predict="flat"]').click();
 await expect(page.locator('#go3')).toBeEnabled();
 await page.locator('#go3').click();
 await page.locator('#pA').fill('0.665');
 await page.locator('#checkPA').click();
 await page.locator('[data-shift="different"]').click();
 await expect(page.locator('#go4')).toBeDisabled();
 await page.locator('[data-shift="same"]').click();
 await expect(page.locator('#go4')).toBeEnabled();
});
