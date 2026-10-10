/// <reference lib="webworker" />
export {};
const scope = self as unknown as DedicatedWorkerGlobalScope;
interface PyDictionary {
  destroy(): void;
}
interface Runtime {
  runPythonAsync: (code: string, options: { globals: PyDictionary }) => Promise<unknown>;
  globals: { get: (name: string) => () => PyDictionary };
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
  setStdin: (options: { stdin: () => string | null }) => void;
}
let runtime: Runtime | undefined;
scope.onmessage = async (event: MessageEvent<{ code: string; input?: string }>) => {
  let output = '';
  try {
    if (
      typeof event.data.code !== 'string' ||
      event.data.code.length > 16000 ||
      typeof (event.data.input ?? '') !== 'string' ||
      (event.data.input ?? '').length > 4000
    )
      throw Error('Code ou entrées hors limites.');
    if (!runtime) {
      scope.postMessage({ kind: 'status', text: 'Téléchargement de Pyodide 0.28.3…' });
      const url = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.mjs';
      const module = (await import(/* @vite-ignore */ url)) as {
        loadPyodide: (options: { indexURL: string }) => Promise<Runtime>;
      };
      runtime = await module.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/',
      });
      for (const name of [
        'fetch',
        'XMLHttpRequest',
        'WebSocket',
        'WebTransport',
        'EventSource',
        'Worker',
        'SharedWorker',
        'importScripts',
      ]) {
        try {
          Object.defineProperty(scope, name, {
            value: () => {
              throw Error('Réseau et sous-Workers désactivés dans cet atelier.');
            },
            writable: false,
            configurable: false,
          });
        } catch {
          /* unsupported browser interface */
        }
      }
    }
    const append = (text: string) => {
      output = (output + text + '\n').slice(-32000);
    };
    runtime.setStdout({ batched: append });
    runtime.setStderr({ batched: append });
    const lines = (event.data.input ?? '').split(/\r?\n/u);
    runtime.setStdin({ stdin: () => lines.shift() ?? null });
    const globals = runtime.globals.get('dict')();
    try {
      await runtime.runPythonAsync(event.data.code, { globals });
      scope.postMessage({ kind: 'done', text: output || 'Exécution terminée sans sortie.' });
    } finally {
      globals.destroy();
    }
  } catch (e) {
    scope.postMessage({
      kind: 'error',
      text: (e instanceof Error ? e.message : String(e)).slice(-32000),
    });
  }
};
