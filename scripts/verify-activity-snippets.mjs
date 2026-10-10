import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
const source = await readFile('src/content/activities.ts', 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { activities } = await import(
  'data:text/javascript;base64,' + Buffer.from(outputText).toString('base64')
);
const results = [];
for (const activity of activities) {
  const result = spawnSync('python', ['-c', activity.python], {
    input: activity.input + '\n',
    encoding: 'utf8',
    timeout: 10000,
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });
  if (result.error || result.status !== 0)
    throw Error(activity.id + ': ' + (result.error?.message ?? result.stderr));
  results.push({ id: activity.id, status: result.status, output: result.stdout.slice(0, 2000) });
}
await writeFile(
  'docs/evidence/activity-python.json',
  JSON.stringify(
    {
      date: new Date().toISOString(),
      kind: 'Python local, snippets identiques aux activités ; Pyodide vérifié séparément',
      results,
    },
    null,
    2,
  ),
);
console.log(results.length + ' snippets Python exécutés avec assertions réussies.');
