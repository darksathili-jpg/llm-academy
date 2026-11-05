import {expect,test} from '@playwright/test';
const samples=[
 {path:'microduck-introduction-embeddings-r1',title:'Défi d’autonomie — réinvestir ses connaissances',section:'#transfer'},
 {path:'microduck-introduction-attention-r1',title:'Défi d’autonomie — expliquer un nouveau cas',section:'#part4'},
 {path:'microduck-attention-v2',title:'Défi d’autonomie — expliquer un nouveau cas',section:'#transfer'}
];
for(const item of samples){
 test(item.path+' : l’autonomie ne signifie pas retirer Microduck',async({page})=>{
   const response=await page.goto('pilotes/'+item.path+'/index.html');
   expect(response?.status()).toBe(200);
   await expect(page.locator(item.section+' h2')).toHaveText(new RegExp(item.title));
   await expect(page.locator('body')).not.toContainText('Transfert sans Microduck');
 });
}
test('embeddings : Microduck conserve sa présence de compagnon dans le défi',async({page})=>{
 await page.goto('pilotes/microduck-introduction-embeddings-r1/index.html');
 await expect(page.locator('#transfer img')).toHaveCount(1);
 await expect(page.locator('#transfer img')).toHaveAttribute('alt','Microduck, compagnon de progression');
});
