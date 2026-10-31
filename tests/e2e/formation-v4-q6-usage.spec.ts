import { expect, test } from '@playwright/test';

const url = 'pilotes/formation-v4/index.html';

test('Q6 : rôle enseignant conservé après rechargement, puis retour élève', async ({ page }) => {
  await page.goto(url);
  await page.locator('#teacherRole').click();
  await page.reload();
  await page.locator('#chapterGrid [data-open="8"]').click();
  await expect(page.locator('#teacherDepth')).toBeVisible();
  await page.locator('#studentRole').click();
  await expect(page.locator('#teacherDepth')).toBeHidden();
});

test('Q6 : bouton projection réversible avec indication accessible', async ({ page }) => {
  await page.goto(url);
  const b = page.locator('#projectorBtn');
  await b.click();
  await expect(page.locator('body')).toHaveClass(/projector/);
  await expect(b).toHaveAttribute('aria-pressed', 'true');
  await b.click();
  await expect(page.locator('body')).not.toHaveClass(/projector/);
  await expect(b).toHaveAttribute('aria-pressed', 'false');
});

test('Q6 : les contrôles de chapitre restent activables au clavier', async ({ page }) => {
  await page.goto(url);
  const b = page.locator('#chapterGrid [data-open="0"]');
  await b.focus();
  await expect(b).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#screen-course')).toBeVisible();
});

test('Q6 : le média imprimé contient bien le chapitre sans erreur JS', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await page.locator('#chapterGrid [data-open="2"]').click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#screen-course')).toBeVisible();
  await expect(page.locator('#pythonSample')).not.toBeEmpty();
  expect(errors).toEqual([]);
});

test('Q6 : stockage local du rôle : aucune donnée nominative ajoutée par ce parcours', async ({ page }) => {
  await page.goto(url);
  await page.locator('#teacherRole').click();
  const record = await page.evaluate(() => localStorage.getItem('llm-academy-v2-learning'));
  expect(record).not.toBeNull();
  const parsed = JSON.parse(record!);
  expect(parsed.role).toBe('teacher');
  expect(Array.isArray(parsed.done)).toBe(true);
  expect(Object.keys(parsed).sort()).toEqual(['done', 'role']);
});
