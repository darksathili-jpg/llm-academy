import { useEffect, useId, useState, type CSSProperties } from 'react';
import type { Matrix } from '../../core/linear';
export function formatNumber(value: number): string {
  if (value === -Infinity) return '−∞ (masqué)';
  if (Math.abs(value) < 1e-10) return '0.0000';
  return Math.abs(value) > 1e5 ? value.toExponential(3) : value.toFixed(4);
}
export function MatrixView({
  matrix,
  title,
  heat = false,
}: {
  matrix: Matrix;
  title: string;
  heat?: boolean;
}) {
  return (
    <div className="table-scroll">
      <table className={heat ? 'matrix-table heat-table' : 'matrix-table'}>
        <caption>
          {title} · {matrix.length} × {matrix[0]?.length ?? 0}
        </caption>
        <thead>
          <tr>
            <th scope="col">Position</th>
            {matrix[0]?.map((_x, j) => (
              <th scope="col" key={j}>
                {j}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <th scope="row">{i}</th>
              {row.map((value, j) => (
                <td key={j} style={heat ? ({ '--heat': value } as CSSProperties) : undefined}>
                  <span>{formatNumber(value)}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function MatrixNumber({
  value,
  label,
  onChange,
}: {
  value: number;
  label: string;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  const id = useId();
  useEffect(() => setDraft(String(value)), [value]);
  const number = Number(draft.replace(',', '.'));
  const valid =
    /^[-+]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[-+]?\d+)?$/i.test(draft) &&
    Number.isFinite(number) &&
    number >= -4 &&
    number <= 4;
  return (
    <label>
      <span>{label}</span>
      <input
        aria-label={label}
        aria-describedby={id}
        aria-invalid={!valid}
        inputMode="decimal"
        value={draft}
        maxLength={30}
        onChange={(event) => {
          const text = event.target.value;
          setDraft(text);
          const n = Number(text.replace(',', '.'));
          if (
            /^[-+]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[-+]?\d+)?$/i.test(text) &&
            Number.isFinite(n) &&
            n >= -4 &&
            n <= 4
          )
            onChange(n);
        }}
        onBlur={() => {
          if (!valid) setDraft(String(value));
        }}
      />
      <small id={id}>
        {valid ? '−4 à 4' : 'Non appliqué : calcul avec la dernière valeur valide.'}
      </small>
    </label>
  );
}
export function MatrixEditor({
  matrix,
  title,
  onChange,
}: {
  matrix: Matrix;
  title: string;
  onChange: (matrix: Matrix) => void;
}) {
  return (
    <fieldset className="matrix-editor">
      <legend>
        {title} · {matrix.length} × {matrix[0]?.length}
      </legend>
      <div
        className="matrix-inputs"
        style={{ gridTemplateColumns: 'repeat(' + matrix[0]!.length + ', minmax(0, 1fr))' }}
      >
        {matrix.flatMap((row, i) =>
          row.map((value, j) => (
            <MatrixNumber
              key={i + ',' + j}
              label={title + ' ligne ' + i + ' colonne ' + j}
              value={value}
              onChange={(n) =>
                onChange(matrix.map((r, ri) => r.map((x, cj) => (ri === i && cj === j ? n : x))))
              }
            />
          )),
        )}
      </div>
    </fieldset>
  );
}
