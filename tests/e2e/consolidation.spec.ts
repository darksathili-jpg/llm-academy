import { test, expect } from '@playwright/test';
import { scenarios } from '../../src/content/scenarios';
test('formats 60/360 exploitables, correction progressive et pause activité indépendante', async ({
  page,
}) => {
  for (const duration of [60, 360]) {
    await page.goto('./#/animation/' + duration);
    for (const [i, s] of scenarios.find((x) => x.duration === duration)!.steps.entries()) {
      await page.locator('.console-steps button').nth(i).click();
      await expect(page.locator('h1')).toHaveText(s.title);
      await expect(page.locator('.projected-answer')).toHaveCount(0);
    }
  }
  await page.goto('./#/animation/120');
  await page.locator('.console-steps button').nth(2).click();
  await page.getByRole('button', { name: 'Révéler la réponse', exact: true }).click();
  await expect(page.locator('.projected-answer')).not.toContainText('Sur « aaa »');
  await page.getByRole('button', { name: 'Compléter la réponse', exact: true }).click();
  await expect(page.locator('.projected-answer')).toContainText('Sur « aaa »');
  await page.getByRole('button', { name: 'Masquer la réponse', exact: true }).click();
  await expect(page.locator('.projected-answer')).toHaveCount(0);
  await page.getByRole('button', { name: 'Démarrer / reprendre' }).click();
  await page.getByRole('button', { name: 'Pause / reprise activité' }).click();
  const frozen = await page.getByTestId('activity-clock').innerText();
  await page.waitForTimeout(1100);
  await expect(page.getByTestId('activity-clock')).toHaveText(frozen);
  await expect(page.getByTestId('session-clock')).not.toHaveText('00:00:00');
  await page.getByRole('button', { name: 'Mettre en pause' }).click();
  await expect(page.getByTestId('activity-clock')).toHaveText(frozen);
});

test('impression : détails ouverts pour le rendu, état initial restauré ensuite', async ({
  page,
}) => {
  await page.goto('./#/studio/180');
  await expect(page.locator('.session-plan>details[open]')).toHaveCount(0);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await expect(page.locator('.session-plan>details[open]')).toHaveCount(9);
  await expect(
    page.getByText('Notez votre hypothèse. Comparez T=1 et T=0,5, sans changer le contexte.', {
      exact: true,
    }),
  ).toBeVisible();
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  await page.emulateMedia({ media: 'screen' });
  await expect(page.locator('.session-plan>details[open]')).toHaveCount(0);
});
