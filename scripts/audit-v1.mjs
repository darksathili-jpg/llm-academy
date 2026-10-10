import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const url = 'https://darksathili-jpg.github.io/llm-academy/',
  output = 'test-results/audit-v1';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' }),
    page = await context.newPage(),
    errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  const moduleRoutes = await page
    .locator('a[href^="#/module/"]')
    .evaluateAll((links) =>
      [...new Set(links.map((a) => a.getAttribute('href').split('?')[0]))].sort(),
    );
  const routes = ['#/', ...moduleRoutes, '#/carnet', '#/references'],
    records = [];
  for (const route of routes) {
    await page.goto(url + route);
    const name = route === '#/' ? 'home' : route.slice(2).replaceAll('/', '-');
    for (const [theme, label] of [
      ['light', 'Clair'],
      ['dark', 'Sombre'],
      ['projector', 'Projection'],
    ]) {
      await page.getByLabel(label, { exact: true }).check();
      for (const width of [390, 768, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.screenshot({
          path: output + '/' + name + '-' + theme + '-' + width + '.png',
          fullPage: width === 1440 && theme === 'light',
        });
        const metrics = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          characters: document.querySelector('main')?.innerText.length,
          mainHeight: document.querySelector('main')?.scrollHeight,
          buttons: document.querySelectorAll('main button').length,
          bodyFont: getComputedStyle(document.body).fontSize,
        }));
        let violations = [];
        if (width === 1440) {
          const audit = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze();
          violations = audit.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            targets: v.nodes.map((n) => n.target),
          }));
        }
        records.push({
          route,
          title: await page.getByRole('heading', { level: 1 }).innerText(),
          theme,
          width,
          capture: name + '-' + theme + '-' + width + '.png',
          ...metrics,
          violations,
        });
      }
    }
    console.log('Audited', route);
  }
  const result = { source: url, date: '2026-10-10', routes, records, javascriptErrors: errors };
  await writeFile(output + '/manifest.json', JSON.stringify(result, null, 2));
  await mkdir('docs/evidence', { recursive: true });
  await writeFile('docs/evidence/audit-v1.json', JSON.stringify(result, null, 2));
  console.log(
    JSON.stringify({
      pages: routes.length,
      captures: records.length,
      overflow: records.filter((r) => r.overflow).length,
      violations: records.reduce((s, r) => s + r.violations.length, 0),
      javascriptErrors: errors.length,
    }),
  );
} finally {
  await browser.close();
}
