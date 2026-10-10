import { useEffect, useRef, useState } from 'react';
import referenceCode from '../../content/python-reference.py?raw';
export function PythonWorkbench() {
  const [code, setCode] = useState(referenceCode),
    [output, setOutput] = useState(''),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState('');
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
    setStatus('Exécution arrêtée. Le moteur sera rechargé au prochain lancement.');
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
        if (e.data.kind === 'status') {
          setStatus(e.data.text);
          return;
        }
        clearTimeout(timer.current);
        setBusy(false);
        setOutput(e.data.text);
        setStatus(
          e.data.kind === 'error'
            ? 'Erreur Python ou téléchargement. Vérifiez le réseau ; corrigez le code ou relancez.'
            : 'Exécution Python terminée.',
        );
      };
      worker.current.onerror = () => {
        dispose();
        setBusy(false);
        setStatus('Chargement Python impossible. Vérifiez le réseau et réessayez.');
      };
      timer.current = setTimeout(() => {
        dispose();
        setBusy(false);
        setStatus('Délai de 60 secondes atteint. Le calcul a été arrêté ; vous pouvez relancer.');
      }, 60000);
      worker.current.postMessage({ code });
    } catch (error) {
      dispose();
      setBusy(false);
      setStatus(error instanceof Error ? error.message : 'Moteur indisponible.');
    }
  }
  return (
    <section className="python-workbench">
      <h4>Programmer et vérifier en Python</h4>
      <p>
        Reproduisez la perte, les gradients et une mise à jour du même modèle bigramme, sans
        bibliothèque externe. Modifiez le code, puis comparez les sorties. Python 0.28.3 se
        télécharge depuis jsDelivr uniquement au lancement et s'exécute dans un Worker.
      </p>
      <label>
        Code Python modifiable
        <textarea
          className="code-editor"
          spellCheck={false}
          rows={16}
          maxLength={16000}
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
        <button
          className="secondary"
          disabled={busy}
          onClick={() => {
            setCode(referenceCode);
            setOutput('');
            setStatus('Code de référence rétabli.');
          }}
        >
          Rétablir le code
        </button>
      </div>
      <p role="status">{status}</p>
      <pre className="code-output" data-testid="python-output">
        {output || 'Les sorties apparaîtront après exécution.'}
      </pre>
      <p className="muted">
        Connexion nécessaire au téléchargement. Le cache hors ligne des laboratoires TypeScript
        n'inclut pas ce moteur externe. Pas de PyTorch dans ce navigateur ; le notebook ci-dessous
        s'exécute dans un environnement Python/PyTorch séparé. Arrêter termine le Worker ; aucun
        carnet n'est transmis au serveur.
      </p>
      <a
        className="button secondary"
        href={import.meta.env.BASE_URL + 'notebooks/mini-gpt.ipynb'}
        download
      >
        Télécharger le notebook PyTorch · mini-GPT
      </a>{' '}
      <a href={import.meta.env.BASE_URL + 'notebooks/bigram-lora.ipynb'} download>
        Télécharger le notebook · gradients et LoRA
      </a>
    </section>
  );
}
