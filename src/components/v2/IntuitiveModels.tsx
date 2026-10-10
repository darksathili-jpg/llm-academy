import { useState } from 'react';
import {
  TRAIN_TEXT,
  VALID_TEXT,
  makeCorpus,
  initialize,
  trainStep,
  loss,
  tinyForward,
  type TinyModel,
} from '../../core/training';
import { miniForward, MINI_VOCABULARY } from '../../core/transformer';
import { softmax } from '../../core/math';
import { LossCurve, type LossPoint } from '../science/LossCurve';
import { ProbabilityBars } from './Experiments';
const corpus = makeCorpus(TRAIN_TEXT, VALID_TEXT);
const measure = (m: TinyModel, step: number): LossPoint => ({
  step,
  train: loss(m, corpus.train),
  validation: loss(m, corpus.validation),
});
export function IntuitiveTraining() {
  const [model, setModel] = useState(() => initialize(corpus.vocabulary.length)),
    [points, setPoints] = useState<LossPoint[]>(() => [
      measure(initialize(corpus.vocabulary.length), 0),
    ]),
    [selected, setSelected] = useState(2);
  const last = points.at(-1)!;
  function train() {
    let m = model;
    const next: LossPoint[] = [];
    for (let i = 0; i < Math.min(100, 400 - last.step); i++) {
      m = trainStep(m, corpus.train, 0.8).model;
      next.push(measure(m, last.step + i + 1));
    }
    setModel(m);
    setPoints((p) => [...p, ...next]);
  }
  return (
    <section className="instrument" id="intuitive-training">
      <h2>Apprendre, puis tester ailleurs</h2>
      <p>
        Un vrai réseau neural bigramme, extrêmement réduit. Il apprend les suites du dernier mot ;
        il n’a ni attention ni compréhension du sens.
      </p>
      <details>
        <summary>Voir les corpus originaux</summary>
        <h3>Entraînement</h3>
        <pre>{TRAIN_TEXT}</pre>
        <h3>Validation, exclue des mises à jour</h3>
        <pre>{VALID_TEXT}</pre>
      </details>
      <div className="lab-toolbar">
        <button disabled={last.step >= 400} onClick={train}>
          Entraîner 100 étapes
        </button>
        <button
          className="secondary"
          onClick={() => {
            const fresh = initialize(corpus.vocabulary.length);
            setModel(fresh);
            setPoints([measure(fresh, 0)]);
          }}
        >
          Revenir aux poids initiaux
        </button>
      </div>
      <p>
        <strong>{last.step} étapes</strong> · erreur entraînement :{' '}
        <output>{last.train.toFixed(4)}</output> · validation :{' '}
        <output>{last.validation.toFixed(4)}</output>.
      </p>
      <LossCurve points={points} />
      <label>
        Mot précédent
        <select value={selected} onChange={(e) => setSelected(Number(e.target.value))}>
          {corpus.vocabulary.map((w, i) => (
            <option key={w} value={i}>
              {w}
            </option>
          ))}
        </select>
      </label>
      <ProbabilityBars
        probabilities={softmax(tinyForward(model, selected))}
        labels={corpus.vocabulary}
      />
      <p>
        La perte mesure l’erreur de prédiction, pas la véracité. Un écart entre entraînement et
        validation invite à examiner la généralisation ; le surapprentissage demande un protocole,
        pas seulement une belle courbe.
      </p>
    </section>
  );
}
export function IntuitiveTransformer() {
  const [causal, setCausal] = useState(true),
    [position, setPosition] = useState(1),
    [future, setFuture] = useState(2);
  const ids = [0, 1, future],
    result = miniForward(ids, { width: 4, heads: 2, positions: true, causal, residual: true });
  return (
    <section className="instrument">
      <h2>Une chaîne de calculs, pas une boîte magique</h2>
      <p>
        Bloc miniature calculé, poids inventés non entraînés. Changez le troisième token et observez
        les calculs de la deuxième position : le masque bloque l’influence du futur.
      </p>
      <label>
        Token à la troisième position
        <select value={future} onChange={(e) => setFuture(Number(e.target.value))}>
          {MINI_VOCABULARY.map((t, i) => (
            <option key={t} value={i}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input type="checkbox" checked={causal} onChange={(e) => setCausal(e.target.checked)} />
        Masque causal
      </label>
      <label>
        Étape de calcul
        <select value={position} onChange={(e) => setPosition(Number(e.target.value))}>
          {result.stages.map((s, i) => (
            <option key={s.name} value={i}>
              {i + 1} — {s.name}
            </option>
          ))}
        </select>
      </label>
      <h3>{result.stages[position].name}</h3>
      <p>{result.stages[position].explanation}</p>
      <p>
        Valeurs calculées de la deuxième position : [
        {result.stages[position].matrix[1].map((x) => x.toFixed(4)).join(', ')}]
      </p>
      <p>
        Chaque étape conserve une trace inspectable. Le niveau scientifique ouvre les matrices et
        les ablations. Ce bloc n’est pas un LLM local entraîné.
      </p>
    </section>
  );
}
