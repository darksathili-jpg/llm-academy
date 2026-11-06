import { expect, test } from '@playwright/test';
const pages=[
  'microduck-transversal-r1',
  'microduck-introduction-embeddings-r1',
  'microduck-introduction-softmax-r1',
  'microduck-attention-v2',
  'microduck-introduction-attention-r1',
  'microduck-qkv-r1',
  'attention-reelle-instructions',
  'evaluation-attention-n0-n5'
];
test('portail complet : chaque mission liée existe dans la version compilée',async({page})=>{
  const response=await page.goto('pilotes/index.html');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading',{name:'Apprendre les LLM avec Microduck'})).toBeVisible();
  for(const name of pages){
    const link=page.locator('a[href="'+name+'/index.html"]');
    expect(await link.count(),'Lien manquant vers '+name).toBeGreaterThanOrEqual(1);
    const result=await page.request.get('pilotes/'+name+'/index.html');
    expect(result.status(),'Page de mission non trouvée : '+name).toBe(200);
    const body=await result.text();
    expect(body).toContain('<!doctype html>');
    expect(body).not.toMatch(/404|Not Found/i);
  }
});
test('aucun téléchargement NumWorks automatique depuis le portail',async({page})=>{
  const thirdParty:string[]=[];
  page.on('request',req=>{if(req.url().includes('numworks.com'))thirdParty.push(req.url())});
  await page.goto('pilotes/index.html');
  await expect(page.locator('img[alt^="Microduck"]')).toHaveCount(1);
  expect(thirdParty).toEqual([]);
});
