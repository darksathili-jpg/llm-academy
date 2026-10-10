import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const url = 'https://darksathili-jpg.github.io/llm-academy/';
const browser = await chromium.launch();
try {
 const context = await browser.newContext();
 const page = await context.newPage();
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 const response = await page.goto(url);
 if (response?.status() !== 200) throw new Error('La page publique ne répond pas HTTP 200.');
 await expect(page.getByRole('heading',{level:1})).toContainText('Comprendre.');
 await page.getByRole('link',{name:'Entrer dans le premier module'}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Comprendre les LLM');
 const exercise=page.locator('form').first();
 await exercise.getByLabel('Votre résultat').fill('0,5');
 await exercise.getByRole('button',{name:'Vérifier ma réponse'}).click();
 await expect(page.locator('.progress-label')).toContainText('1 / 4');
 await page.reload();
 await expect(page.locator('.progress-label')).toContainText('1 / 4');
 await page.getByRole('link',{name:'Continuer vers la tokenisation'}).click();
 const lab=page.locator('#bpe-lab');
 await lab.getByRole('button',{name:'Fusion suivante'}).click();
 await expect(lab.getByText('7',{exact:true})).toBeVisible();
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.reload();
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);
 await page.reload();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Tokenisation');
 await context.setOffline(false);
 await page.goto(url);
 await mkdir('test-results',{recursive:true});
 await page.screenshot({path:'test-results/live-desktop.png',fullPage:true});
 if(errors.length)throw new Error('Erreurs JavaScript : '+errors.join('; '));
 console.log(JSON.stringify({url,http:200,modules:['01','02'],bpe:'10 → 7 tokens après la première fusion',progression:'sauvegarde et rechargement vérifiés',offline:'rechargement public hors ligne réussi',javascriptErrors:0},null,2));
} finally {await browser.close();}

