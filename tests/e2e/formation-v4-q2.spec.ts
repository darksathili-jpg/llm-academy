import { expect, test } from '@playwright/test';

/**
 * V4-Q2 — Tests additionnels sur le pilote V4.
 * Tests non exécutés lors de leur création distante ; lancer après npm run build.
 */
const url = 'pilotes/formation-v4/index.html';

test('V4-Q2 : ouvrir les quinze chapitres sans exception JavaScript', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url);
  const chapters = page.locator('#chapterGrid [data-open]');
  await expect(chapters).toHaveCount(15);

  for (let i = 0; i < 15; i++) {
    await page.locator(`#chapterGrid [data-open="${i}"]`).click();
    await expect(page.locator('#screen-course')).toBeVisible();
    await expect(page.locator('#exerciseChoices button')).toHaveCount(3);
    await page.locator('#backBtn').click();
  }
  expect(errors, `Exceptions JavaScript : ${errors.join(' | ')}`).toEqual([]);
});

test('V4-Q2 : pas de débordement global pour plusieurs tailles et chapitres', async ({ page }) => {
  await page.goto(url);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 820 });
    for (const chapter of [0, 2, 8, 14]) {
      await page.locator(`#chapterGrid [data-open="${chapter}"]`).click();
      await expect(page.locator('#screen-course')).toBeVisible();
      const { documentWidth, viewportWidth } = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      expect(documentWidth, `Débordement au chapitre ${chapter + 1}, largeur ${width}`).toBeLessThanOrEqual(viewportWidth);
      await page.locator('#backBtn').click();
    }
  }
});
