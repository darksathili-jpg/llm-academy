import { useEffect, useRef, useState } from 'react';
import referenceCode from '../../content/python-reference.py?raw';
export function PythonWorkbench({
  initialCode = referenceCode,
  initialInput = '',
  hints = [
    'Repérez les variables et la sortie attendue.',
    'Ajoutez une assertion sur un résultat simple.',
    'Comparez les valeurs avant et après une modification.',
  ],
}: {
  initialCode?: string;
  initialInput?: string;
  hints?: string[];
}) {
  const [code, setCode] = useState(initialCode),
    [input, setInput] = useState(initialInput),
    [output, setOutput] = useState(''),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState(''),
    [hint, setHint] = useState(0);
  const worker = useRef<Worker | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function dispose() {
    worker.current?.terminate();
    worker.current = null;
    clearTimeout(timer.current);
  }
  useEffect(() => () => dispose(), []);
  function stop() {
    dispose();
    setBusy(false);
    setStatus('Exécution arrêtée. Le Worker est terminé.');
  }
  function reset() {
    dispose();
    setBusy(false);
    setCode(initialCode);
    setInput(initialInput);
    setOutput('');
    setHint(0);
    setStatus('Code, entrées et moteur réinitialisés.');
  }
  function run() {
    if (busy) return;
    setBusy(true);
    setOutput('');
    setStatus('Préparation de Python…');
    try {
      worker.current ??= new Worker(new URL('../../workers/python.worker.ts', import.meta.url), {
        type: 'module',
      });
      worker.current.onmessage = (e: MessageEvent<{ kind: string; text: string }>) => {
        if (typeof e.data?.text !== 'string' || !['status', 'done', 'error'].includes(e.data.kind))
          return;
        const text = e.data.text.slice(-32000);
        if (e.data.kind === 'status') {
          setStatus(text);
          return;
        }
        clearTimeout(timer.current);
        setBusy(false);
        setOutput(text);
        setStatus(
          e.data.kind === 'error'
            ? 'Erreur Python ou téléchargement. Corrigez le code ; le fichier .py reste disponible en repli.'
            : 'Exécution Python terminée.',
        );
      };
      worker.current.onerror = () => {
        dispose();
        setBusy(false);
        setStatus(
          'Chargement Python impossible. Téléchargez le code pour l’exécuter avec Python local, ou utilisez les calculs TypeScript.',
        );
      };
      timer.current = setTimeout(() => {
        dispose();
        setBusy(false);
        setStatus('Délai de 60 secondes atteint. Le Worker a été arrêté.');
      }, 60000);
      worker.current.postMessage({ code, input });
    } catch (e) {
      dispose();
      setBusy(false);
      setStatus(e instanceof Error ? e.message : 'Moteur indisponible.');
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/x-python' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experience-llm.py';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="python-workbench">
      <h3>Programmer et vérifier en Python</h3>
      <p>
        Code éditable exécuté dans un Web Worker. Pyodide 0.28.3 se télécharge à la demande depuis
        jsDelivr. L’interface n’envoie ni code ni carnet à un serveur.
      </p>
      <label>
        Code Python modifiable
        <textarea
          className="code-editor"
          spellCheck={false}
          rows={14}
          maxLength={16000}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={busy}
        />
      </label>
      <label>
        Entrées pour input() · une réponse par ligne
        <textarea
          rows={3}
          maxLength={4000}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
        />
      </label>
      <div className="lab-toolbar">
        <button disabled={busy} onClick={run}>
          Exécuter Python
        </button>
        <button className="secondary" disabled={!busy} onClick={stop}>
          Arrêter Python
        </button>
        <button className="secondary" onClick={reset}>
          Réinitialiser Python
        </button>
        <button className="secondary" onClick={download}>
          Télécharger le code .py
        </button>
        <button
          className="secondary"
          disabled={hint >= hints.length}
          onClick={() => setHint((n) => n + 1)}
        >
          Aide Python ({hint}/{hints.length})
        </button>
      </div>
      {hints.slice(0, hint).map((h) => (
        <p key={h}>{h}</p>
      ))}
      <p role="status">{status}</p>
      <pre className="code-output" data-testid="python-output">
        {output || 'Les sorties apparaîtront après exécution.'}
      </pre>
      <p className="muted">
        Code limité à 16 000 caractères, entrées à 4 000, sorties à 32 000 ; délai maximal 60 s
        comprenant le chargement. La mémoire WebAssembly dépend du navigateur, sans quota garanti.
        Après chargement, les interfaces réseau usuelles du Worker sont bloquées. Ce Worker isole
        l’exécution, sans constituer une certification de sécurité pour du code hostile. Python
        externe n’est pas inclus dans le cache hors ligne ; en repli, téléchargez le code ou
        poursuivez les expériences TypeScript.
      </p>
      <details>
        <summary>Notebooks Python/PyTorch facultatifs</summary>
        <a href={import.meta.env.BASE_URL + 'notebooks/mini-gpt.ipynb'} download>
          Mini-GPT
        </a>{' '}
        ·{' '}
        <a href={import.meta.env.BASE_URL + 'notebooks/bigram-lora.ipynb'} download>
          Gradients et LoRA
        </a>
        <p>PyTorch s’exécute séparément, pas dans ce navigateur.</p>
      </details>
    </section>
  );
}
