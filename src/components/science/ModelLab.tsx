import { useState } from 'react';
import { miniForward, MINI_VOCABULARY } from '../../core/transformer';
import { generate, DEFAULT_SAMPLING } from '../../core/generation';
import { shiftedWindow } from '../../core/training';
import { crossEntropy } from '../../core/math';
import { MatrixView } from './Matrix';
export function ModelLab() {
  const [sequence, setSequence] = useState([0, 1, 2, 3, 4, 5]);
  const [length, setLength] = useState(3),
    [start, setStart] = useState(0),
    [seed, setSeed] = useState(7);
  const [trace, setTrace] = useState<ReturnType<typeof generate>>([]);
  const window = shiftedWindow(sequence, start, length);
  const result = miniForward([...window.inputs], {
    width: 4,
    heads: 2,
    positions: true,
    causal: true,
    residual: true,
  });
  const logits = result.stages.at(-1)!.matrix;
  const average =
    logits.reduce((s, row, i) => s + crossEntropy(row, window.targets[i]!), 0) / logits.length;
  function resetTrace() {
    setTrace([]);
  }
  return (
    <div className="lab" id="model-lab">
      <header className="lab-header">
        <div>
          <span className="eyebrow">Expérience 07 · séquences et génération</span>
          <h3>Mini-model Builder</h3>
        </div>
        <span className="tag">Transformer non entraîné</span>
      </header>
      <p>
        Objectif : décaler les cibles et construire une boucle autorégressive. Prérequis : modules
        02–06. Six tokens fixés ; les paramètres inspectables du module 06 sont réutilisés, sans
        apprentissage.
      </p>
      <fieldset className="sequence-editor">
        <legend>Document original de six tokens</legend>
        <div>
          {sequence.map((id, i) => (
            <label key={i}>
              Position {i}
              <select
                aria-label={'Token source ' + i}
                value={id}
                onChange={(e) => {
                  setSequence((old) => old.map((x, j) => (j === i ? Number(e.target.value) : x)));
                  resetTrace();
                }}
              >
                {MINI_VOCABULARY.map((t, j) => (
                  <option key={t} value={j}>
                    {j} : {t}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="transformer-controls">
        <label>
          Longueur de fenêtre
          <select
            value={length}
            onChange={(e) => {
              const n = Number(e.target.value);
              setLength(n);
              setStart(Math.min(start, 5 - n));
              resetTrace();
            }}
          >
            {[2, 3, 4, 5].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Début de fenêtre
          <select
            value={start}
            onChange={(e) => {
              setStart(Number(e.target.value));
              resetTrace();
            }}
          >
            {Array.from({ length: 6 - length }, (_, i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
        <label>
          Graine de génération
          <select
            value={seed}
            onChange={(e) => {
              setSeed(Number(e.target.value));
              resetTrace();
            }}
          >
            {[7, 11, 42].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="matrix-scroll">
        <table>
          <caption>Entrées et cibles décalées · teacher forcing</caption>
          <thead>
            <tr>
              <th>Position locale</th>
              <th>Entrée</th>
              <th>Cible suivante</th>
              <th>Perte de cible</th>
            </tr>
          </thead>
          <tbody>
            {window.inputs.map((id, i) => (
              <tr key={i}>
                <th scope="row">{i}</th>
                <td>
                  {MINI_VOCABULARY[id]} (ID {id})
                </td>
                <td data-testid="shifted-target">
                  {MINI_VOCABULARY[window.targets[i]!]} (ID {window.targets[i]})
                </td>
                <td>{crossEntropy(logits[i]!, window.targets[i]!).toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MatrixView title="Logits causaux pour chaque position" matrix={logits} />
      <p className="result" data-testid="sequence-loss">
        Perte moyenne : {average.toFixed(6)} nats. Forme : {length} × 6.
      </p>
      <button
        onClick={() =>
          setTrace(
            generate(
              window.inputs,
              5,
              seed,
              DEFAULT_SAMPLING,
              (context) =>
                miniForward(context.slice(-6), {
                  width: 4,
                  heads: 2,
                  positions: true,
                  causal: true,
                  residual: true,
                })
                  .stages.at(-1)!
                  .matrix.at(-1)!,
              5,
            ),
          )
        }
      >
        Générer jusqu'à 5 tokens
      </button>
      <p className="muted">
        Échantillonnage T=1 sans filtrage. « fin » arrête la génération ; au-delà de six positions,
        seuls les six derniers tokens sont traités et les positions repartent à zéro.
      </p>
      <div role="status" data-testid="autoregressive-output">
        {trace.length > 0 && (
          <p className="generated-text">
            {window.inputs.map((i) => MINI_VOCABULARY[i]).join(' ')}{' '}
            <strong>{trace.map((s) => MINI_VOCABULARY[s.token]).join(' ')}</strong>
          </p>
        )}
      </div>
      {trace.length > 0 && (
        <div className="matrix-scroll">
          <table>
            <caption>Trace réelle : prédire, tirer, ajouter</caption>
            <thead>
              <tr>
                <th>Étape</th>
                <th>Contexte avant tirage</th>
                <th>u</th>
                <th>Token</th>
                <th>p choisi</th>
              </tr>
            </thead>
            <tbody>
              {trace.map((s, i) => (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{s.context.map((id) => MINI_VOCABULARY[id]).join(' ')}</td>
                  <td>{s.draw.toFixed(6)}</td>
                  <td>{MINI_VOCABULARY[s.token]}</td>
                  <td>{s.probabilities[s.token]!.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="lab-limit">
        La perte compare des logits aux vraies cibles du document. La boucle de génération utilise
        au contraire ses propres tokens. Ces poids inventés ne produisent pas une langue apprise. Au
        module 08, un modèle plus petit permet d'inspecter chaque gradient ; le notebook
        complémentaire entraîne un vrai bloc causal.
      </p>
    </div>
  );
}
