// Repository administration helper. Credentials remain in process memory.
import { spawnSync } from 'node:child_process';
const repo = 'darksathili-jpg/llm-academy';
const command = process.argv[2];
if (command !== '--inspect' && command !== '--enable-actions') {
  console.error('Usage: node scripts/configure-pages.mjs --inspect | --enable-actions');
  process.exit(1);
}
const credential = spawnSync('git', ['-c', 'credential.interactive=never', 'credential', 'fill'], {
  input: 'protocol=https\nhost=github.com\n\n',
  encoding: 'utf8',
  env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' },
});
if (credential.status !== 0) {
  console.error(
    'Authentification GitHub locale indisponible. Configurez GitHub Pages via Settings > Pages > GitHub Actions.',
  );
  process.exit(1);
}
const fields = Object.fromEntries(
  credential.stdout
    .split(/\r?\n/)
    .filter((line) => line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);
if (!fields.password) {
  console.error('Identifiant GitHub manquant.');
  process.exit(1);
}
const headers = {
  Authorization: 'Bearer ' + fields.password,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};
async function request(method, body) {
  const response = await fetch('https://api.github.com/repos/' + repo + '/pages', {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    console.error('API Pages : HTTP ' + response.status);
    process.exit(1);
  }
  if (response.status === 204) return null;
  return response.json();
}
if (command === '--enable-actions') await request('PUT', { build_type: 'workflow' });
const state = await request('GET');
console.log(
  JSON.stringify(
    {
      repository: repo,
      build_type: state.build_type,
      status: state.status,
      url: state.html_url,
      source: state.source,
    },
    null,
    2,
  ),
);
