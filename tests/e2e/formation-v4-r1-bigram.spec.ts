import {test,expect} from '@playwright/test';
const url='pilotes/formation-v4-r1/index.html';
test('R1 : entraînement local, génération reproductible et trace',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await expect(page.locator('#stats')).toContainText('contextes appris');
  await page.locator('#generate').click();
  const first=await page.locator('#output').innerText();
  expect(first).toMatch(/^le\s+\S+/);
  await expect(page.locator('#trace p').first()).toContainText('Après « le »');
  await page.locator('#generate').click();
  expect(await page.locator('#output').innerText()).toBe(first);
  expect(errors).toEqual([]);
});
test('R1 : changement de corpus entraîne un autre modèle',async({page})=>{
  await page.goto(url);
  await page.locator('#corpus').fill('le robot avance . le robot parle . le robot apprend .');
  await page.locator('#train').click();
  await expect(page.locator('#stats')).toContainText('contextes appris');
  await page.locator('#generate').click();
  await expect(page.locator('#trace p').first()).toContainText('robot');
  await expect(page.locator('#output')).toContainText('robot');
});
test('R1 : top-k=1 impose le maximum appris et mot inconnu traité',async({page})=>{
  await page.goto(url);
  await page.locator('#topk').selectOption('1');
  await page.locator('#generate').click();
  await expect(page.locator('#trace p').first()).toContainText('100.0 %');
  await page.locator('#start').fill('introuvable');
  await page.locator('#generate').click();
  await expect(page.locator('#status')).toContainText('aucune suite connue');
});
