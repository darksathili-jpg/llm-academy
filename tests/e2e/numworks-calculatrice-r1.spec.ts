import {test,expect} from '@playwright/test';
for(const name of ['microduck-introduction-embeddings-r1','microduck-qkv-r1','microduck-transversal-r1']){
 test(name+' : simulateur tiers facultatif sans chargement automatique',async({page})=>{
   let requests=0;
   await page.route('https://www.numworks.com/**',route=>{requests++;return route.abort()});
   const response=await page.goto('pilotes/'+name+'/index.html');
   expect(response?.status()).toBe(200);
   await expect(page.locator('[data-llm-calculator] .llm-calculator')).toBeVisible();
   await expect(page.locator('[data-llm-calculator] iframe')).toHaveCount(0);
   expect(requests).toBe(0);
   await page.getByRole('button',{name:'Afficher la calculatrice NumWorks officielle'}).click();
   await expect(page.locator('[data-llm-calculator] iframe')).toHaveAttribute('src','https://www.numworks.com/simulator/embed/');
   await expect(page.locator('[data-llm-calculator] iframe')).toHaveAttribute('title',/NumWorks/);
   await expect(page.locator('[data-llm-calculator] [role=status]')).toContainText('service tiers');
   await page.getByRole('button',{name:'Masquer la calculatrice'}).click();
   await expect(page.locator('[data-llm-calculator] iframe')).toBeHidden();
 });
}
