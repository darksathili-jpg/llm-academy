import { useState } from 'react';
import { cosine, dot } from '../../core/linear';
import { formatNumber } from './Matrix';
const presets: Record<string, number[][]> = {
  parallel: [
    [1, 0, 0],
    [2, 0, 0],
  ],
  opposed: [
    [1, 0, 0],
    [-1, 0, 0],
  ],
  projection: [
    [1, 0, 2],
    [1, 0, -2],
  ],
  orthogonal: [
    [1, 0, 0],
    [0, 1, 0],
  ],
};
export function EmbeddingLab() {
  const [vectors, setVectors] = useState([
    [1, 0, 0],
    [1, 1, 0],
  ]);
  const [axes, setAxes] = useState<[number, number]>([0, 1]);
  const [lookup, setLookup] = useState(1);
  const similarity = cosine(vectors[0]!, vectors[1]!);
  const projected = cosine(
    vectors[0]!.filter((_x, i) => axes.includes(i)),
    vectors[1]!.filter((_x, i) => axes.includes(i)),
  );
  const table = [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 2],
  ];
  return (
    <div className="lab" id="embedding-lab">
      <header className="lab-header">
        <div>
          <span className="eyebrow">Expérience 03 · géométrie calculée</span>
          <h3>Embedding Explorer</h3>
        </div>
        <span className="tag">Vecteurs construits à la main</span>
      </header>
      <p>
        Prérequis : coordonnées et fractions. Objectif : comparer direction, norme et projection,
        puis distinguer un ID de son vecteur. Aucune sémantique apprise.
      </p>
      <div className="lab-toolbar">
        <button className="secondary" onClick={() => setVectors(presets.parallel!)}>
          Même direction
        </button>
        <button className="secondary" onClick={() => setVectors(presets.orthogonal!)}>
          Orthogonaux
        </button>
        <button className="secondary" onClick={() => setVectors(presets.opposed!)}>
          Directions opposées
        </button>
        <button
          onClick={() => {
            setVectors(presets.projection!);
            setAxes([0, 1]);
          }}
        >
          Piège de projection
        </button>
      </div>
      <div className="lab-grid">
        <div>
          {vectors.map((vector, i) => (
            <fieldset key={i}>
              <legend>Vecteur {i === 0 ? 'A' : 'B'}</legend>
              {vector.map((value, j) => (
                <label className="slider" key={j}>
                  Composante {j} <output>{value.toFixed(1)}</output>
                  <input
                    aria-label={'Vecteur ' + (i === 0 ? 'A' : 'B') + ' composante ' + j}
                    type="range"
                    min="-3"
                    max="3"
                    step=".1"
                    value={value}
                    onChange={(e) =>
                      setVectors((old) =>
                        old.map((v, vi) =>
                          v.map((x, c) => (vi === i && c === j ? Number(e.target.value) : x)),
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </fieldset>
          ))}
          <p className="formula">cos(A,B) = (A · B) / (‖A‖ ‖B‖)</p>
          <p>
            Produit scalaire : <output>{formatNumber(dot(vectors[0]!, vectors[1]!))}</output>
          </p>
          <p>Normes : {vectors.map((v) => Math.hypot(...v).toFixed(4)).join(' / ')}</p>
        </div>
        <div>
          <label>
            Plan affiché
            <select
              aria-label="Plan affiché"
              value={axes.join(',')}
              onChange={(e) => setAxes(e.target.value.split(',').map(Number) as [number, number])}
            >
              <option value="0,1">Composantes 0 et 1</option>
              <option value="0,2">Composantes 0 et 2</option>
              <option value="1,2">Composantes 1 et 2</option>
            </select>
          </label>
          <svg
            className="vector-plot"
            viewBox="0 0 340 340"
            role="img"
            aria-label={'Projection des vecteurs sur le plan ' + axes.join(', ')}
          >
            <title>Projection orthographique calculée</title>
            <line x1="20" y1="170" x2="320" y2="170" className="plot-axis" />
            <line x1="170" y1="20" x2="170" y2="320" className="plot-axis" />
            <text x="300" y="190">
              d{axes[0]}
            </text>
            <text x="180" y="25">
              d{axes[1]}
            </text>
            {vectors.map((v, i) => (
              <g key={i}>
                <line
                  x1="170"
                  y1="170"
                  x2={170 + 45 * v[axes[0]]!}
                  y2={170 - 45 * v[axes[1]]!}
                  className={'vector-line vector-' + i}
                />
                <circle
                  cx={170 + 45 * v[axes[0]]!}
                  cy={170 - 45 * v[axes[1]]!}
                  r={i === 0 ? 7 : 4}
                  className={'vector-end vector-' + i}
                />
                <text x={180 + 45 * v[axes[0]]!} y={160 - 45 * v[axes[1]]!}>
                  {i === 0 ? 'A' : 'B'}
                </text>
              </g>
            ))}
          </svg>
          <p className="result">
            Similarité en 3D :{' '}
            <strong data-testid="cosine-full">
              {similarity === null ? 'Indéfinie (vecteur nul)' : similarity.toFixed(4)}
            </strong>
          </p>
          <p>
            Similarité du plan :{' '}
            <strong data-testid="cosine-projected">
              {projected === null ? 'Indéfinie (projection nulle)' : projected.toFixed(4)}
            </strong>
          </p>
          <p>
            Le tableau des coordonnées reste la référence si les points se superposent. La troisième
            composante est perdue sur ce plan.
          </p>
        </div>
      </div>
      <details>
        <summary>Lire une table d’embeddings miniature</summary>
        <p>Table E : ID 0 → [1,0,0] ; ID 1 → [1,1,0] ; ID 2 → [0,1,2].</p>
        <label>
          ID à rechercher
          <select value={lookup} onChange={(e) => setLookup(Number(e.target.value))}>
            {table.map((_v, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        <p>
          Vecteur sélectionné : [{table[lookup]!.join(', ')}]. Ces lignes sont inventées ; elles ne
          proviennent pas d’un modèle.
        </p>
      </details>
      <p className="lab-limit">
        Défi : avant le « piège de projection », prédisez la similarité réelle. A=[1,0,2] et
        B=[1,0,−2] donnent −3/5 = −0,6 en 3D, mais 1 sur le plan 0–1. Le cosinus d’un vecteur nul
        est indéfini ici, contrairement à certaines bibliothèques qui régularisent le dénominateur.
        Une proximité géométrique ne prouve pas un fait ni une relation linguistique.
      </p>
    </div>
  );
}
