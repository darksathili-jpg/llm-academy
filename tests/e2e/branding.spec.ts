import { expect, test } from '@playwright/test';

test('identité LLM Academy du lycée Watteau visible et accessible', async ({ page }) => {
  await page.goto('./#/');
  const brand = page.getByRole('link', {
    name: 'Accueil de LLM Academy — Lycée Watteau, Valenciennes',
  });
  await expect(brand).toBeVisible();
  const logo = brand.locator('img.academy-logo');
  await expect(logo).toHaveAttribute('src', /llm-academy-watteau\.webp$/);
  await expect
    .poll(async () =>
      logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await expect(page.getByText('Lycée Watteau · Valenciennes', { exact: true })).toBeVisible();
  await expect(page.locator('header.academy-header img[src$=".svg"]')).toHaveCount(0);
  await expect(logo).toHaveJSProperty('naturalWidth', 160);
  await logo.focus();
  await expect(brand).toHaveAttribute('href', '#/');
});

test('logo Watteau sans débordement horizontal en mode clair, sombre et projection', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('./#/');
  for (const label of ['Clair', 'Sombre', 'Projection']) {
    await page.getByRole('radio', { name: label }).check();
    await expect(page.locator('header.academy-header img.academy-logo')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});
