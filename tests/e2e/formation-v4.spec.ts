import { expect, test } from '@playwright/test';

const url = 'pilotes/formation-v4/index.html';

test('V4.1 : quinze chapitres accessibles', async ({ page }) => {
  await page.goto(url);
  await expect(page.locator('#chapterGrid .chapter')).toHaveCount(15);
  for (let i = 0; i < 15; i++) {
    await page.evaluate((n) => {
      const button = document.querySelector<HTMLButtonElement>(`#chapterGrid [data-open="${n}"]`);
      button?.click();
    }, i);
    await expect(page.locator('#screen-course')).toBeVisible();
    await expect(page.locator('#exerciseChoices button')).toHaveCount(3);
    await page.locator('#backBtn').click();
  }
});

test('V4.1 : fuite réelle sans déduplication et aucun recouvrement après', async ({ page }) => {
  await page.goto(url);
  await page.locator('#chapterGrid [data-open="6"]').click();
  await page.locator('#dataNo').click();
  await expect(page.locator('#dataView')).toContainText('Entraînement : A, B, C');
  await expect(page.locator('#dataView')).toContainText('Validation : A');
  await expect(page.locator('#labResult')).toContainText('Fuite visible');
  await page.locator('#dataYes').click();
  await expect(page.locator('#dataView')).toContainText('Validation : D');
  await expect(page.locator('#dataView')).toContainText('Test final : E');
});

test('V4.1 : un QCM ne certifie plus la maîtrise', async ({ page }) => {
  await page.goto(url);
  await page.locator('#chapterGrid [data-open="0"]').click();
  await page.locator('#exerciseChoices button').nth(1).click();
  await expect(page.locator('#completion')).toContainText('Bonne réponse au quiz');
  await expect(page.locator('#completion')).toContainText('transfert');
});

test('V4.1 : mode enseignant et MathJax réel', async ({ page }) => {
  await page.goto(url);
  await page.locator('#teacherRole').click();
  await page.locator('#chapterGrid [data-open="8"]').click();
  await expect(page.locator('#teacherDepth')).toBeVisible();
  await expect(page.locator('#screen-course mjx-container').first()).toBeVisible();
  await expect(page.locator('#screen-course mjx-merror')).toHaveCount(0);
});

test('V4.1 : pas de débordement global à 320 et 390 px', async ({ page }) => {
  await page.goto(url);
  await page.locator('#chapterGrid [data-open="8"]').click();
  await expect(page.locator('#screen-course mjx-container').first()).toBeVisible();
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 820 });
    const { documentWidth, viewportWidth } = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth);
  }
});
