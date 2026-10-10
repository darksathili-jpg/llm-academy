import { useMemo, useState } from 'react';
import { tokenCount, trainBpe } from '../../core/bpe';
export function SimpleTokens() {
  const [text, setText] = useState('la la lala'),
    [step, setStep] = useState(0);
  const result = useMemo(() => {
    try {
      return { history: trainBpe(text, 12), error: '' };
    } catch (e) {
      return { history: [], error: e instanceof Error ? e.message : 'Vérifie le texte saisi.' };
    }
  }, [text]);
  const current = result.history[Math.min(step, result.history.length - 1)];
  const pair = current?.pairs[0];
  return (
    <section className="instrument" aria-label="Découper un texte en morceaux">
      <h2>Des lettres aux morceaux de texte</h2>
      <p>
        Au départ, chaque lettre est un morceau. On regroupe ensuite les deux morceaux voisins qui
        reviennent le plus souvent ensemble. Ce regroupement s’appelle une « fusion ».
      </p>
      <label>
        Texte à découper
        <textarea
          rows={2}
          maxLength={2000}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setStep(0);
          }}
        />
      </label>
      {result.error && <p role="alert">{result.error}</p>}
      {current && (
        <>
          <p>
            <strong>{tokenCount(current)} morceaux</strong> dans les mots du texte ; les espaces ne
            sont pas comptés.
          </p>
          <div className="word-list" aria-label="Morceaux actuels">
            {current.words.map((w) => (
              <div key={w.text}>
                <span>
                  {w.text} {w.frequency > 1 ? '× ' + w.frequency : ''}
                </span>
                <div className="tokens">
                  {w.tokens.map((t, i) => (
                    <span className={'token tone-' + (i % 4)} key={i}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p>
            {pair
              ? 'Prochain regroupement : « ' + pair.pair[0] + ' » et « ' + pair.pair[1] + ' ».'
              : 'Il ne reste plus de voisins à regrouper.'}
          </p>
          <button
            disabled={!pair || step >= result.history.length - 1}
            onClick={() => setStep((s) => s + 1)}
          >
            Fusion suivante : regrouper deux morceaux
          </button>
          <button className="secondary" disabled={!step} onClick={() => setStep(0)}>
            Revenir aux lettres séparées
          </button>
          <p>
            Un morceau peut donc contenir plusieurs lettres. On appelle ce morceau un « token ».
          </p>
        </>
      )}
      <p className="muted">
        Version réduite : on regroupe les caractères à l’intérieur des mots. Les vrais outils
        peuvent découper autrement ; un token n’est pas toujours un mot.
      </p>
    </section>
  );
}
