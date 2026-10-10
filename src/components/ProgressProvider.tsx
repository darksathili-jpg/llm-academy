import { createContext, useContext, useState, type ReactNode } from 'react';
import { emptyProgress, loadProgress, saveProgress, type Progress } from '../core/progress';
const Context = createContext<{ progress: Progress; warning: string; update: (fn: (p: Progress) => Progress) => void } | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => { try { return loadProgress(window.localStorage); } catch { return { progress: emptyProgress(), warning: 'Stockage indisponible : exportez votre carnet pour le conserver.' }; } });
  const [progress, setProgress] = useState(initial.progress);
  const [warning, setWarning] = useState(initial.warning);
  function update(fn: (p: Progress) => Progress) {
    const next = fn(progress);
    setProgress(next);
    try { if (!saveProgress(window.localStorage, next)) setWarning('Sauvegarde impossible. Vos réponses restent en mémoire : exportez le carnet.'); else setWarning(''); }
    catch { setWarning('Stockage inaccessible. Exportez le carnet.'); }
  }
  return <Context.Provider value={{ progress, warning, update }}>{children}</Context.Provider>;
}
export function useProgress() { const value = useContext(Context); if (!value) throw new Error('Provider absent.'); return value; }

