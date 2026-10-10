import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch();
await mkdir('docs/evidence/screens', { recursive: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } }),
    page = await context.newPage();
  await page.goto('https://darksathili-jpg.github.io/llm-academy/');
  await page.screenshot({ path: 'docs/evidence/screens/home-before.png', fullPage: true });
  await page.goto('http://127.0.0.1:4173/llm-academy/');
  await page.screenshot({ path: 'docs/evidence/screens/home-after.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('http://127.0.0.1:4173/llm-academy/#/experience/prediction');
  await page.getByLabel('Projection', { exact: true }).check();
  await page.getByLabel('Température').fill('0.5');
  await page.evaluate(() => {
    document.activeElement?.blur();
    scrollTo(0, 0);
  });
  await page.screenshot({
    path: 'docs/evidence/screens/prediction-mobile-projector.png',
    fullPage: true,
  });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://127.0.0.1:4173/llm-academy/#/animation/180');
  await page.locator('.console-steps button').nth(1).click();
  await page.screenshot({ path: 'docs/evidence/screens/studio-projector.png', fullPage: true });
  await page.goto('http://127.0.0.1:4173/llm-academy/#/studio/180');
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await page.screenshot({ path: 'docs/evidence/screens/studio-print.png', fullPage: true });
  console.log(
    JSON.stringify({
      printParagraphHeights: await page
        .locator('.session-plan details>p')
        .evaluateAll((p) => p.map((x) => x.getBoundingClientRect().height)),
      captures: 5,
    }),
  );
  await context.close();
} finally {
  await browser.close();
}
