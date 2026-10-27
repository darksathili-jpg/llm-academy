/**
 * Test de fumée Chromium sur le véritable site public GitHub Pages.
 * N'est exécuté qu'après le déploiement de l'artefact Vite compilé.
 */
import { chromium, expect } from '@playwright/test';

const base = new URL(process.env.SITE_URL || 'https://darksathili-jpg.github.io/llm-academy/');
const revision = process.env.GITHUB_SHA || 'unknown';
const attempts = 12;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (base.protocol !== 'https:' || !base.pathname.endsWith('/llm-academy/')) {
  throw new Error('URL GitHub Pages inattendue : ' + base);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 850 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    errors.length = 0;
    try {
      const url = new URL(base);
      url.searchParams.set('revision', revision.slice(0, 12));
      url.searchParams.set('check', String(attempt));
      url.hash = '/atelier';

      const response = await page.goto(url.toString(), {
        waitUntil: 'domcontentloaded',
        timeout: 25000,
      });
      if (response?.status() !== 200) {
        throw new Error('HTTP ' + response?.status() + ' pour ' + url);
      }

      await expect(
        page.getByRole('region', { name: 'Pour commencer : sept activités accessibles' }),
      ).toBeVisible({ timeout: 6000 });
      await expect(
        page.getByRole('region', { name: 'Pour approfondir : trois mécanismes facultatifs' }),
      ).toBeVisible();
      await expect(
        page.locator(
          'section[aria-label="Pour commencer : sept activités accessibles"] a.editorial-row',
        ),
      ).toHaveCount(7);

      await page.goto(new URL('#/enseignant', base).toString(), {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.locator('#fiches-seances details.lesson-section')).toHaveCount(3);

      await page.goto(new URL('#/fiche/predire-verifier', base).toString(), {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.getByText('FICHE PARTICIPANT', { exact: true })).toBeVisible();
      await expect(page.locator('.teacher-sequence-print')).not.toContainText('Réponse attendue :');

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      if (overflows) throw new Error('Débordement horizontal sur mobile');
      if (errors.length > 0) throw new Error('Erreur JavaScript : ' + errors.join(' ; '));

      console.log(
        'Site V4 réellement affiché : 7 activités débutants, 3 extensions, 3 fiches enseignant et fiche participant sans corrigés ; mobile OK. URL : ' +
          base,
      );
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      console.warn('Contrôle public ' + attempt + '/' + attempts + ' : ' + String(error));
      if (attempt < attempts) await wait(8000);
    }
  }

  if (lastError) throw lastError;
} finally {
  await browser.close();
}
