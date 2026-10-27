import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('V4 : sept activités pour débuter, trois approfondissements facultatifs', async ({ page }) => {
  await page.goto('./#/atelier');
  const beginner = page.getByRole('region', {
    name: 'Pour commencer : sept activités accessibles',
  });
  const advanced = page.getByRole('region', {
    name: 'Pour approfondir : trois mécanismes facultatifs',
  });
  await expect(beginner.locator('a.editorial-row')).toHaveCount(7);
  await expect(advanced.locator('a.editorial-row')).toHaveCount(3);
  await beginner.locator('a[href="#/activite/credibilite"]').click();
  await expect(page.locator('.investigation-stage')).toContainText('Découverte :');
  await expect(page.locator('.investigation-stage')).toContainText('Python (facultatif)');
  await page.goto('./#/activite/representations');
  await expect(page.locator('.investigation-stage')).toContainText('hors programme');
});

test('V4 : l’ordre des liens respecte le parcours conseillé', async ({ page }) => {
  await page.goto('./#/activite/fiabilite');
  await page.getByText('Aller à une autre étape', { exact: true }).click();
  await page.getByRole('button', { name: /Vérifier ta compréhension/ }).click();
  await expect(page.getByRole('link', { name: 'Activité suivante →' })).toHaveAttribute(
    'href',
    '#/activite/representations',
  );
});

test('V4 : trois séances de 60 minutes proposent consignes et preuves', async ({ page }) => {
  await page.goto('./#/enseignant');
  const sequences = page.locator('#fiches-seances details.lesson-section');
  await expect(sequences).toHaveCount(3);
  await sequences.first().locator('summary').first().click();
  await expect(sequences.first()).toContainText('Déroulement minuté');
  await expect(sequences.first()).toContainText('Réponse attendue');
  await expect(sequences.first()).toContainText('Limite scientifique');
  await expect(sequences.first().locator('ol > li')).toHaveCount(5);
});

test('V4 : routes débutant et dossier formateur sans défaut WCAG automatique', async ({ page }) => {
  for (const route of ['atelier', 'enseignant']) {
    await page.setViewportSize({ width: 390, height: 880 });
    await page.goto('./#/' + route);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const report = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(report.violations).toEqual([]);
  }
});

test('V4 : fiches séparées sans corrigé divulgué au participant', async ({ page }) => {
  await page.goto('./#/fiche/predire-verifier');
  await expect(page.getByText('FICHE PARTICIPANT', { exact: true })).toBeVisible();
  await expect(page.locator('.teacher-sequence-print')).not.toContainText('Réponse attendue :');
  await expect(page.locator('.teacher-sequence-print')).not.toContainText('Erreur à anticiper :');
  await expect(page.locator('.teacher-sequence-print .answer-space')).toHaveCount(6);
  await expect(page.getByRole('link', { name: 'Afficher la fiche formateur' })).toHaveCount(0);
  await page.goto('./#/seance/predire-verifier');
  await expect(page.getByText('FICHE FORMATEUR — CORRIGÉS INCLUS')).toBeVisible();
  await expect(page.locator('.teacher-sequence-print')).toContainText('Réponse attendue :');
  await expect(page.getByRole('button', { name: 'Imprimer cette fiche' })).toBeVisible();
});
