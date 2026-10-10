import { useMemo, useState } from 'react';
import { MINI_VOCABULARY, miniForward } from '../../core/transformer';
import { MatrixView } from './Matrix';
export function TransformerLab() {
  const [ids, setIds] = useState([0, 1, 2]);
  const [width, setWidth] = useState(4);
  const [heads, setHeads] = useState(2);
  const [positions, setPositions] = useState(true);
  const [causal, setCausal] = useState(true);
  const [residual, setResidual] = useState(true);
  const [stageIndex, setStageIndex] = useState(0);
  const [headIndex, setHeadIndex] = useState(0);
  const forward = useMemo(
    () => miniForward(ids, { width, heads, positions, causal, residual }),
    [ids, width, heads, positions, causal, residual],
  );
  const stage = forward.stages[stageIndex]!;
  const baseline = miniForward(ids, {
    width,
    heads,
    positions: true,
    causal: true,
    residual: true,
  });
  const delta = Math.max(
    ...forward.probabilities.map((p, i) => Math.abs(p - baseline.probabilities[i]!)),
  );
  function reset() {
    setIds([0, 1, 2]);
    setWidth(4);
    setHeads(2);
    setPositions(true);
    setCausal(true);
    setResidual(true);
    setHeadIndex(0);
    setStageIndex(0);
  }
  return (
    <div className="lab" id="transformer-lab">
      <header className="lab-header">
        <div>
          <span className="eyebrow">Expérience 06 · passage avant complet</span>
          <h3>Transformer Explorer</h3>
        </div>
        <span className="tag">1 bloc · pré-normalisation</span>
      </header>
      <p>
        Objectif : suivre les formes et les valeurs d’un bloc causal. Prérequis : modules 03–05.
        Chaque étape est calculée avec des poids déterministes inventés, affichables ci-dessous. Ce
        modèle n’a appris aucune langue.
      </p>
      <div className="transformer-controls">
        <label>
          Dimension d_model
          <select
            value={width}
            onChange={(e) => {
              const d = Number(e.target.value);
              setWidth(d);
              if (heads > d || d % heads) {
                setHeads(1);
                setHeadIndex(0);
              }
            }}
          >
            {[2, 4, 8].map((d) => (
              <option value={d} key={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nombre de têtes
          <select
            aria-label="Nombre de têtes"
            value={heads}
            onChange={(e) => {
              setHeads(Number(e.target.value));
              setHeadIndex(0);
            }}
          >
            {[1, 2, 4]
              .filter((h) => h <= width && width % h === 0)
              .map((h) => (
                <option value={h} key={h}>
                  {h}
                </option>
              ))}
          </select>
        </label>
        <label>
          Longueur de séquence
          <select
            value={ids.length}
            onChange={(e) =>
              setIds((old) =>
                Array.from(
                  { length: Number(e.target.value) },
                  (_, i) => old[i] ?? i % MINI_VOCABULARY.length,
                ),
              )
            }
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="sequence-editor">
        <legend>Tokens d’entrée : ID → vecteur</legend>
        <div>
          {ids.map((id, i) => (
            <label key={i}>
              Position {i}
              <select
                aria-label={'Token position ' + i}
                value={id}
                onChange={(e) =>
                  setIds((old) => old.map((x, j) => (i === j ? Number(e.target.value) : x)))
                }
              >
                {MINI_VOCABULARY.map((t, index) => (
                  <option value={index} key={t}>
                    {index} : {t}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="ablation-options">
        <label className="radio">
          <input
            type="checkbox"
            checked={positions}
            onChange={(e) => setPositions(e.target.checked)}
          />
          Codage positionnel
        </label>
        <label className="radio">
          <input type="checkbox" checked={causal} onChange={(e) => setCausal(e.target.checked)} />
          Attention causale
        </label>
        <label className="radio">
          <input
            type="checkbox"
            checked={residual}
            onChange={(e) => setResidual(e.target.checked)}
          />
          Connexions résiduelles
        </label>
      </div>
      {!causal && (
        <p className="notice">
          Attention non causale : le modèle accède au futur. Cette ablation sert uniquement à la
          comparaison.
        </p>
      )}
      <p className="result">
        n = {ids.length} · d_model = {width} · h = {heads} · d_k = d_v = {width / heads} · largeur
        FFN = {2 * width}
      </p>
      <nav className="pipeline" aria-label="Étapes du passage Transformer">
        {forward.stages.map((s, i) => (
          <button
            className={i === stageIndex ? '' : 'secondary'}
            aria-pressed={i === stageIndex}
            onClick={() => setStageIndex(i)}
            key={s.name}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {s.name}
            <small>
              {s.matrix.length} × {s.matrix[0]!.length}
            </small>
          </button>
        ))}
      </nav>
      <section className="stage-view">
        <h4 data-testid="transformer-stage">{stage.name}</h4>
        <p>{stage.explanation}</p>
        <MatrixView title={stage.name} matrix={stage.matrix} />
      </section>
      <div className="lab-toolbar">
        <button
          className="secondary"
          disabled={stageIndex === 0}
          onClick={() => setStageIndex((i) => i - 1)}
        >
          Étape précédente
        </button>
        <button
          disabled={stageIndex === forward.stages.length - 1}
          onClick={() => setStageIndex((i) => i + 1)}
        >
          Étape suivante
        </button>
        <button className="secondary" onClick={reset}>
          Rétablir la démonstration
        </button>
      </div>
      <details>
        <summary>Observer l’attention d’une tête</summary>
        <label>
          Tête à afficher
          <select value={headIndex} onChange={(e) => setHeadIndex(Number(e.target.value))}>
            {forward.heads.map((_h, i) => (
              <option value={i} key={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        <MatrixView title="Poids de la tête" matrix={forward.heads[headIndex]!.weights} heat />
      </details>
      <h4>Distribution à la dernière position</h4>
      <div className="bars">
        {forward.probabilities.map((p, i) => (
          <div className="bar-row" key={i}>
            <span>{MINI_VOCABULARY[i]}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: p * 100 + '%' }} />
            </div>
            <output>{(p * 100).toFixed(2)} %</output>
          </div>
        ))}
      </div>
      <p data-testid="transformer-delta">
        Écart maximal à la configuration complète (mêmes tokens/dimensions/têtes) :{' '}
        {delta.toFixed(6)}.
      </p>
      <details>
        <summary>Inspecter tous les poids et les conventions</summary>
        <p>
          Pour une matrice de taille r × c et une graine s, W[i,j]=(((i+1)×7+(j+1)×3+s) mod 11 −
          5)/10. E : s=1 ; Wq : 2 ; Wk : 5 ; Wv : 8 ; Wo : 10 ; W1 : 3 ; W2 : 6 ; Wlogits : 4. Pas
          de biais ni dropout. LayerNorm : gamma=1, beta=0, variance divisée par d et epsilon=10⁻⁵.
          FFN : ReLU puis projection. Positions sin/cos, pas RoPE.
        </p>
        {Object.entries(forward.parameters).map(([name, matrix]) => (
          <MatrixView key={name} title={name} matrix={matrix} />
        ))}
      </details>
      <p className="lab-limit">
        Défis : changez le dernier token en mode causal et constatez que les premières lignes des
        logits restent fixes. Retirez ensuite les positions et les résidus, une ablation à la fois.
        Les écarts sont mesurés sur cette miniature, pas sur GPT entraîné. Les chiffres ne mesurent
        aucune performance linguistique. GPT désigne une famille d’architectures ; ce bloc
        illustratif ne reproduit pas tous ses choix.
      </p>
    </div>
  );
}
