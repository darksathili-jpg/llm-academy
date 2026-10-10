import { useState } from 'react';
import { gradientDescent, matmul } from '../../core/linear';
import { MatrixEditor, MatrixView, formatNumber } from './Matrix';
import { ProbabilityLab } from '../ProbabilityLab';
export function MathLab() {
  const [a, setA] = useState([
    [1, 2],
    [3, 4],
  ]);
  const [b, setB] = useState([
    [2, 0],
    [1, 2],
  ]);
  const [rate, setRate] = useState(0.2);
  const [steps, setSteps] = useState(8);
  const [initial, setInitial] = useState(0);
  const [cell, setCell] = useState<[number, number]>([0, 0]);
  const result = matmul(a, b);
  const history = gradientDescent(initial, rate, steps),
    last = history.at(-1)!;
  const maxLoss = Math.max(1, ...history.map((s) => s.loss));
  const points = history
    .map(
      (s) =>
        35 +
        (s.step / Math.max(1, steps)) * 440 +
        ',' +
        (220 - (Math.log1p(s.loss) / Math.log1p(maxLoss)) * 180),
    )
    .join(' ');
  return (
    <div id="math-lab">
      <div className="lab">
        <header className="lab-header">
          <div>
            <span className="eyebrow">Expérience 04 A · algèbre</span>
            <h3>Calcul matriciel guidé</h3>
          </div>
          <span className="tag">Lignes × colonnes</span>
        </header>
        <p>
          Prérequis : addition et multiplication. Modifiez A et B (valeurs finies de −4 à 4) et
          vérifiez un coefficient de C = AB.
        </p>
        <div className="lab-grid">
          <MatrixEditor title="A" matrix={a} onChange={setA} />
          <MatrixEditor title="B" matrix={b} onChange={setB} />
        </div>
        <MatrixView title="C = A B" matrix={result} />
        <label>
          Coefficient à expliquer
          <select
            value={cell.join(',')}
            onChange={(e) => setCell(e.target.value.split(',').map(Number) as [number, number])}
          >
            {[0, 1].flatMap((i) =>
              [0, 1].map((j) => (
                <option key={i + ',' + j} value={i + ',' + j}>
                  C[{i},{j}]
                </option>
              )),
            )}
          </select>
        </label>
        <p className="formula" data-testid="matmul-detail">
          C[{cell.join(',')}] = {a[cell[0]]!.map((x, k) => x + ' × ' + b[k]![cell[1]]).join(' + ')}{' '}
          = {formatNumber(result[cell[0]]![cell[1]]!)}
        </p>
        <p className="lab-limit">
          Données originales, matrices 2 × 2. Le produit ne multiplie pas seulement les cellules
          correspondantes. Pour A de forme n × d et B de forme d × m, C possède la forme n × m ; le
          moteur refuse les dimensions internes incompatibles.
        </p>
      </div>
      <section className="math-subsection">
        <h3>Softmax et perte d’une cible</h3>
        <p>
          Reprenez le calcul du module 01 : trois logits, une distribution normalisée et une perte
          −ln(p). Testez l’invariance quand tous les scores changent de la même constante.
        </p>
        <ProbabilityLab />
      </section>
      <div className="lab" id="gradient-lab">
        <header className="lab-header">
          <div>
            <span className="eyebrow">Expérience 04 B · optimisation</span>
            <h3>Descente de gradient mesurée</h3>
          </div>
          <span className="tag">Une seule variable</span>
        </header>
        <p>
          Objectif : prédire la variation de L(w)=(w−2)². Gradient exact : 2(w−2). La mise à jour
          est w suivant = w − η × gradient. Aucun réseau neuronal ni rétropropagation générale.
        </p>
        <div className="lab-grid">
          <div>
            <label className="slider">
              Taux d’apprentissage η <output>{rate.toFixed(2)}</output>
              <input
                aria-label="Taux d’apprentissage"
                type="range"
                min="0"
                max="1.2"
                step=".05"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </label>
            <label className="slider">
              Poids initial <output>{initial.toFixed(1)}</output>
              <input
                aria-label="Poids initial"
                type="range"
                min="-4"
                max="4"
                step=".5"
                value={initial}
                onChange={(e) => setInitial(Number(e.target.value))}
              />
            </label>
            <label className="slider">
              Nombre de mises à jour <output>{steps}</output>
              <input
                aria-label="Nombre de mises à jour"
                type="range"
                min="1"
                max="12"
                step="1"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
              />
            </label>
            <div className="lab-toolbar">
              <button className="secondary" onClick={() => setRate(0.2)}>
                Convergence η = 0,2
              </button>
              <button className="secondary" onClick={() => setRate(1)}>
                Oscillation η = 1
              </button>
              <button onClick={() => setRate(1.1)}>Divergence η = 1,1</button>
            </div>
            <p className="result">
              Poids final :{' '}
              <strong data-testid="gradient-weight">{formatNumber(last.weight)}</strong>
              <br />
              Perte finale : <strong data-testid="gradient-loss">{formatNumber(last.loss)}</strong>
            </p>
          </div>
          <div>
            <svg
              className="loss-plot"
              viewBox="0 0 510 260"
              role="img"
              aria-label="Perte mesurée à chaque mise à jour, axe vertical logarithmique log(1+perte)"
            >
              <title>Perte réellement calculée</title>
              <line x1="35" y1="220" x2="485" y2="220" className="plot-axis" />
              <line x1="35" y1="30" x2="35" y2="220" className="plot-axis" />
              <polyline points={points} className="loss-line" />
              {history.map((s) => (
                <circle
                  key={s.step}
                  cx={35 + (s.step / Math.max(1, steps)) * 440}
                  cy={220 - (Math.log1p(s.loss) / Math.log1p(maxLoss)) * 180}
                  r="3"
                  className="loss-point"
                />
              ))}
              <text x="150" y="250">
                Mises à jour (0 à {steps})
              </text>
              <text x="45" y="25">
                log(1 + perte), maximum {maxLoss.toFixed(2)}
              </text>
            </svg>
            <p>
              Le graphe utilise une échelle log(1+perte) pour rendre la divergence lisible. Le
              tableau donne les valeurs brutes.
            </p>
          </div>
        </div>
        <details>
          <summary>Tableau des poids, gradients et pertes</summary>
          <div className="table-scroll">
            <table>
              <caption>Trajectoire calculée, incluant l’état initial</caption>
              <thead>
                <tr>
                  <th scope="col">Étape</th>
                  <th scope="col">w</th>
                  <th scope="col">Gradient</th>
                  <th scope="col">L(w)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((s) => (
                  <tr key={s.step}>
                    <th scope="row">{s.step}</th>
                    <td>{formatNumber(s.weight)}</td>
                    <td>{formatNumber(s.gradient)}</td>
                    <td>{formatNumber(s.loss)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <p className="lab-limit">
          Défi : comparez η=0,2, 1 et 1,1. Pour cette quadratique seule, l’erreur est multipliée à
          chaque étape par 1−2η. Entre 0 et 1, elle converge ; à 1 elle oscille sans diminuer ;
          au-delà de 1 elle diverge sauf départ au minimum. Ces seuils ne sont pas transférables
          directement à un LLM.
        </p>
      </div>
    </div>
  );
}
