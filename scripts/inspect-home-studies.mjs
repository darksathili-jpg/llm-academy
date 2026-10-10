import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const root = 'docs/evidence/accueils-comparaison';
await mkdir(root, { recursive: true });
const report = {
  checkedAt: new Date().toISOString(),
  scope: 'Trois maquettes autonomes, application inchangée',
  views: [],
};
const browser = await chromium.launch();
try {
  for (const file of ['a-instrument', 'b-musee', 'c-revue']) {
    for (const [width, height] of [
      [1440, 900],
      [1920, 1080],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://127.0.0.1:5173/llm-academy/etudes-accueil/' + file + '.html');
      await expect(page.locator('[data-choice]')).toHaveCount(3);
      await expect(page.locator('[data-draw]')).toBeVisible();
      const measures = await page.evaluate(() => {
        const rect = (s) => {
          const r = document.querySelector(s).getBoundingClientRect();
          return {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            bottom: r.bottom,
            right: r.right,
          };
        };
        return {
          title: rect('h1'),
          sentence: rect('.sentence'),
          choices: rect('[data-choice]'),
          draw: rect('[data-draw]'),
          footer: rect('.review'),
          overflowX: document.documentElement.scrollWidth > innerWidth,
          overflowY: document.documentElement.scrollHeight > innerHeight,
          titleFontSize: getComputedStyle(document.querySelector('h1')).fontSize,
        };
      });
      expect(measures.overflowX).toBe(false);
      expect(measures.overflowY).toBe(false);
      expect(measures.footer.bottom).toBeLessThanOrEqual(height);
      expect(measures.draw.bottom).toBeLessThan(height - 30);
      expect(measures.title.height).toBeLessThan(height * 0.1);
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
      const screenshot = file + '-' + width + 'x' + height + '.png';
      await page.screenshot({ path: root + '/' + screenshot, fullPage: false });
      // Vérifier les trois zones avec des nombres contrôlés, distincts des captures.
      await page.evaluate(() => {
        let i = 0;
        Object.defineProperty(crypto, 'getRandomValues', {
          value(buffer) {
            buffer[0] = Math.floor([0.05, 0.7, 0.95][i++ % 3] * 4294967296);
            return buffer;
          },
        });
      });
      await page.locator('[data-choice="0"]').click();
      await expect(page.locator('[data-choice="0"]')).toHaveAttribute('aria-pressed', 'true');
      for (const word of ['canapé', 'tapis', 'bureau']) {
        await page.locator('[data-draw]').click();
        await expect(page.locator('[data-result]')).toHaveText(word);
        await expect(page.locator('[data-outcome]')).toContainText('Tu avais proposé « canapé »');
      }
      await expect(page.locator('[data-counts]')).toHaveText(
        '3 tirage(s) · canapé 1 · tapis 1 · bureau 1',
      );
      const after = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(after.violations.map((v) => v.id)).toEqual([]);
      expect(errors).toEqual([]);
      expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
      report.views.push({
        file,
        width,
        height,
        screenshot,
        measures,
        axeViolations: axe.violations.length,
        afterDrawAxeViolations: after.violations.length,
        controlledDraws: 'canapé, tapis, bureau : passed',
        errors,
      });
      await context.close();
    }
  }
  await writeFile(root + '/verification.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
