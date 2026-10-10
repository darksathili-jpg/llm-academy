import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const root = 'dist';
async function list(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await list(p)));
    else files.push(p.replaceAll('\\', '/'));
  }
  return files;
}
const files = await list(root);
const hash = createHash('sha256');
hash.update(await readFile(new URL(import.meta.url)));
for (const path of files.sort()) {
  hash.update(path);
  hash.update(await readFile(path));
}
const version = hash.digest('hex').slice(0, 16);
const resources = files.map((p) => './' + p.slice(root.length + 1));
const sw = `
const PREFIX = 'llm-academy-shell-';
const CACHE = PREFIX + '${version}';
const RESOURCES = ${JSON.stringify(resources)};
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(async cache => {
  try { await cache.addAll(RESOURCES); }
  catch(error) { await caches.delete(CACHE); throw error; }
 }));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 const scope = new URL(self.registration.scope);
 if(event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
 if(event.request.mode === 'navigate') {
  const page = url.pathname.startsWith(new URL('./maquettes/',scope).pathname) ? event.request : new URL('./index.html',scope);
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(page, { ignoreVary: true })) || fetch(event.request)));
 } else {
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(event.request, { ignoreVary: true })) || fetch(event.request)));
 }
});
`;
await writeFile(join(root, 'sw.js'), sw);
await writeFile(join(root, '.nojekyll'), '');
console.log(
  'Service worker généré : ' + version + ' (' + resources.length + ' ressources locales)',
);
