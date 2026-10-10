import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base = 'http://127.0.0.1:4173/llm-academy/',
  browser = await chromium.launch();
const report = {
  date: new Date().toISOString(),
  kind: 'profils hypothétiques automatisés, pas une étude utilisateurs',
  profiles: [],
  sessionActions: [],
  errors: [],
};
async function profile(name, fn) {
  const context = await browser.newContext(),
    page = await context.newPage(),
    started = Date.now();
  let actions = 0;
  page.on('pageerror', (e) => report.errors.push(e.message));
  const action = async (label, f) => {
    const t = Date.now();
    await f();
    actions++;
    return { label, ms: Date.now() - t };
  };
  await fn(page, action);
  report.profiles.push({ name, actions, elapsedMs: Date.now() - started });
  await context.close();
}
try {
  await profile('A — Terminale NSI sans matrices', async (p, a) => {
    await a('Ouvrir une investigation', () => p.goto(base + '#/activite/probabilites'));
    await a('Passer à l’hypothèse', () =>
      p.getByRole('button', { name: 'Étape suivante', exact: true }).click(),
    );
    await a('Écrire une hypothèse', () =>
      p
        .getByLabel('Ce que je pense avant l’essai, et pourquoi')
        .fill('La température faible concentre les choix.'),
    );
    await a('Ouvrir l’expérience', () =>
      p.getByRole('button', { name: 'Étape suivante', exact: true }).click(),
    );
    await a('Modifier T', () => p.getByLabel('Température').fill('0.5'));
    await expect(p.locator('.measure-row').first()).toContainText('86.7 %');
    await a('Passer à l’observation', () =>
      p.getByRole('button', { name: 'Étape suivante', exact: true }).click(),
    );
    await a('Écrire la preuve', () =>
      p.getByLabel('Ce que j’ai vu pendant l’essai').fill('86,7 % pour lune ; la somme est 100 %.'),
    );
    await a('Passer à l’explication', () =>
      p.getByRole('button', { name: 'Étape suivante', exact: true }).click(),
    );
    await expect(p.locator('.investigation-stage')).toContainText(/pas apprises par une IA/u);
  });
  await profile('B — Enseignant de lettres sans code', async (p, a) => {
    await a('Ouvrir le détective', () => p.goto(base + '#/experience/detective'));
    await a('Choisir la discipline', () => p.getByLabel('Discipline').selectOption('0'));
    for (const [i, v] of ['étayé', 'contredit', 'insuffisant'].entries()) {
      await a('Classer ' + (i + 1), () =>
        p.getByLabel('Classement de l’affirmation ' + (i + 1)).selectOption(v),
      );
      await a('Citer la preuve ' + (i + 1), () =>
        p
          .getByLabel('Preuve pour l’affirmation ' + (i + 1))
          .selectOption(i === 2 ? 'aucune' : 'S1'),
      );
    }
    await a('Vérifier', () => p.getByRole('button', { name: 'Vérifier les preuves' }).click());
    await expect(p.getByText('Classement et référence validés.', { exact: false })).toHaveCount(3);
  });
  await profile('C — Formateur, 2 h, 25 enseignants hypothétiques', async (p, a) => {
    const add = async (label, f) => report.sessionActions.push(await a(label, f));
    await add('1 Entrer dans le studio', () => p.goto(base + '#/studio'));
    await add('2 Sélectionner 2 h', () => p.getByRole('link', { name: /2 h Comprendre/ }).click());
    await add('3 Afficher la première consigne', () =>
      p.getByRole('link', { name: 'Ouvrir la console' }).click(),
    );
    await expect(p.locator('h1')).toHaveText('Ouvrir la boîte noire');
    await add('4 Lancer le chrono', () =>
      p.getByRole('button', { name: 'Démarrer / reprendre' }).click(),
    );
    await add('5a Passer à l’expérience', () =>
      p.getByRole('button', { name: 'Suivant', exact: true }).click(),
    );
    await add('5b Ouvrir la démonstration', () =>
      p.getByRole('button', { name: 'Ouvrir la démonstration' }).click(),
    );
    await add('6 Modifier T', () => p.getByLabel('Température').fill('0.5'));
    await add('7 Lire le résultat', () =>
      expect(p.locator('.measure-row').first()).toContainText('86.7 %'),
    );
    await add('8 Révéler une réponse', () =>
      p.getByRole('button', { name: 'Révéler la réponse', exact: true }).click(),
    );
    await add('9 Passer à l’activité suivante', () =>
      p.getByRole('button', { name: 'Suivant', exact: true }).click(),
    );
    await add('10 Reprendre après interruption', () => p.reload());
    await expect(p.locator('h1')).toHaveText('Comment fabriquer un tokenizer ?');
    await add('11 Exporter le déroulé', async () => {
      const download = p.waitForEvent('download');
      await p.getByRole('button', { name: 'Fiche de conduite', exact: true }).click();
      await download;
    });
  });
  await profile('D — Enseignant NSI, Python et Transformer', async (p, a) => {
    await a('Ouvrir la programmation', () => p.goto(base + '#/activite/attention'));
    await a('Choisir une étape', () =>
      p.getByText('Aller à une autre étape', { exact: true }).click(),
    );
    await a('Choisir Python', () => p.locator('.stage-nav button').nth(5).click());
    await a('Afficher Python', () =>
      p.getByText('Afficher le code Python', { exact: true }).click(),
    );
    await expect(p.getByLabel('Code Python modifiable')).toContainText('masque');
    await a('Ouvrir le Transformer', () => p.goto(base + '#/experience/transformer'));
    await a('Choisir scientifique', () => p.getByLabel('Scientifique', { exact: true }).check());
    await expect(p.locator('#transformer-lab')).toBeVisible();
    await a('Avancer dans les calculs', () =>
      p
        .locator('#transformer-lab')
        .getByRole('button', { name: 'Étape suivante', exact: true })
        .click(),
    );
    await expect(p.getByTestId('transformer-stage')).toHaveText('Positions');
    await a('Choisir le niveau intuitif', () => p.getByLabel('Intuitif', { exact: true }).check());
    await expect(p.getByLabel('Token à la troisième position')).toBeVisible();
  });
  const context = await browser.newContext(),
    p = await context.newPage();
  await p.goto(base + '#/studio/360');
  await p.emulateMedia({ media: 'print' });
  const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (bg !== 'rgb(255, 255, 255)') throw Error('Impression non monochrome');
  await mkdir('test-results', { recursive: true });
  await p.pdf({ path: 'test-results/conduite-360-print.pdf', format: 'A4', printBackground: true });
  report.print = 'PDF A4 généré ; fond blanc et commandes masquées';
  await context.close();
  if (report.errors.length) throw Error(report.errors.join('; '));
  await writeFile('docs/evidence/profiles-v2.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
