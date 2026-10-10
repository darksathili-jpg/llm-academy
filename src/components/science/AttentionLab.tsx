import { useState } from 'react';
import { scaledAttention } from '../../core/attention';
import { MatrixEditor, MatrixView, formatNumber } from './Matrix';
export function AttentionLab() {
  const [q, setQ] = useState([
    [1, 0],
    [0, 1],
    [1, 1],
  ]);
  const [k, setK] = useState([
    [1, 0],
    [0, 1],
    [1, 1],
  ]);
  const [v, setV] = useState([
    [1, 0],
    [0, 2],
    [3, 1],
  ]);
  const [causal, setCausal] = useState(true);
  const [headCount, setHeadCount] = useState(1);
  const [headIndex, setHeadIndex] = useState(0);
  const [row, setRow] = useState(1);
  const width = 2 / headCount;
  const heads = Array.from({ length: headCount }, (_, h) =>
    scaledAttention(
      q.map((r) => r.slice(h * width, (h + 1) * width)),
      k.map((r) => r.slice(h * width, (h + 1) * width)),
      v.map((r) => r.slice(h * width, (h + 1) * width)),
      causal,
    ),
  );
  const selected = heads[headIndex]!;
  const concat = q.map((_r, i) => heads.flatMap((h) => h.output[i]!));
  return (
    <div className="lab" id="attention-lab">
      <header className="lab-header">
        <div>
          <span className="eyebrow">Expérience 05 · scores → poids → valeurs</span>
          <h3>Attention Studio</h3>
        </div>
        <span className="tag">Matrices saisies, non apprises</span>
      </header>
      <p>
        Objectif : prévoir l’effet de Q, K, V et du masque sur une somme pondérée. Prérequis :
        produit matriciel et softmax (module 04). Trois positions 0, 1 et 2, deux caractéristiques.
        Seules les valeurs finies de −4 à 4 sont appliquées.
      </p>
      <div className="matrix-editor-grid">
        <MatrixEditor title="Q" matrix={q} onChange={setQ} />
        <MatrixEditor title="K" matrix={k} onChange={setK} />
        <MatrixEditor title="V" matrix={v} onChange={setV} />
      </div>
      <div className="attention-controls">
        <label className="radio">
          <input type="checkbox" checked={causal} onChange={(e) => setCausal(e.target.checked)} />
          Masque causal : interdire le futur
        </label>
        <label>
          Nombre de têtes
          <select
            aria-label="Nombre de têtes"
            value={headCount}
            onChange={(e) => {
              setHeadCount(Number(e.target.value));
              setHeadIndex(0);
            }}
          >
            <option value={1}>1 tête · d_k = 2</option>
            <option value={2}>2 têtes · d_k = 1</option>
          </select>
        </label>
        <label>
          Tête observée
          <select value={headIndex} onChange={(e) => setHeadIndex(Number(e.target.value))}>
            {heads.map((_h, i) => (
              <option key={i} value={i}>
                Tête {i}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="formula">
        Scores = Q Kᵀ / √d_k ; poids = softmax par ligne après masquage ; sortie = poids × V.
      </p>
      <div className="lab-grid">
        <MatrixView title="Scores avant masque" matrix={selected.scores} />
        <MatrixView title="Scores après masque" matrix={selected.maskedScores} />
      </div>
      <MatrixView
        title="Poids d’attention (lignes = queries, colonnes = keys)"
        matrix={selected.weights}
        heat
      />
      <p className="muted">
        La couleur code le poids et chaque cellule donne sa valeur. Une cellule à 0 au-dessus de la
        diagonale est interdite lorsque le masque est actif.
      </p>
      <label>
        Position à expliquer
        <select value={row} onChange={(e) => setRow(Number(e.target.value))}>
          {q.map((_r, i) => (
            <option key={i} value={i}>
              Position {i}
            </option>
          ))}
        </select>
      </label>
      <p data-testid="attention-row-sum">
        Somme des poids de cette ligne :{' '}
        {selected.weights[row]!.reduce((s, x) => s + x, 0).toFixed(4)}.
      </p>
      <div className="calculation-list">
        {selected.output[row]!.map((value, j) => (
          <p key={j} className="formula">
            Sortie[{row},{j}] ={' '}
            {selected.weights[row]!.map(
              (w, i) => w.toFixed(4) + ' × ' + v[i]![headIndex * width + j],
            ).join(' + ')}{' '}
            = {formatNumber(value)}
          </p>
        ))}
      </div>
      <MatrixView title="Sortie de la tête observée" matrix={selected.output} />
      {headCount > 1 && (
        <MatrixView title="Concaténation des deux têtes (sans projection finale)" matrix={concat} />
      )}
      <details>
        <summary>Défis et lecture des limites</summary>
        <ol>
          <li>
            Masque actif : modifiez V de la position 2. Les sorties des positions 0 et 1 doivent
            rester identiques.
          </li>
          <li>
            Désactivez le masque : le futur devient accessible. Ce mode est une comparaison, pas une
            génération autorégressive valide.
          </li>
          <li>
            Q=0 : tous les scores valent zéro ; les positions autorisées ont des poids uniformes. V
            change la sortie sans changer les poids.
          </li>
          <li>
            Avec deux têtes, nous découpons les colonnes des matrices saisies. Dans un Transformer,
            ces matrices sont obtenues par des projections apprises ; leurs sorties sont concaténées
            puis projetées.
          </li>
        </ol>
      </details>
      <p className="lab-limit">
        Les matrices ne portent aucun sens linguistique et ne sont pas entraînées. Les poids sont
        des coefficients de mélange, pas une preuve d’explication causale d’une réponse. Les calculs
        internes conservent la précision complète ; seules les valeurs affichées sont arrondies. Le
        masque intervient avant softmax.
      </p>
    </div>
  );
}
