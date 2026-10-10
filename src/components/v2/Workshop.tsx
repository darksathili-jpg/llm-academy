import { laboratorySheets } from '../../content/laboratorySheets';
import { useState } from 'react';
import { activities, stages, type ExperimentId } from '../../content/activities';
import { emptyInvestigation, type Investigation } from '../../core/investigation';
import { useProgress } from '../ProgressProvider';
import { PythonWorkbench } from '../science/PythonWorkbench';
import { Experiment, instruments } from './Experiments';
export function Workshop() {
  const { progress } = useProgress();
  return (
    <article>
      <div className="eyebrow">ESPACE 01 / TERMINALE NSI</div>
      <h1>
        Dix questions.
        <br />
        Des preuves à construire.
      </h1>
      <p className="lead">
        Une hypothèse, une expérience, une explication. Les listes, dictionnaires et tests Python
        servent d’appui ; les mécanismes des LLM sont des prolongements hors programme.
      </p>
      <p>
        Durées proposées, non mesurées en classe. Vos écrits restent locaux et s’exportent dans le
        carnet. Un quiz ne certifie pas la compréhension.
      </p>
      <div className="editorial-list">
        {activities.map((a, i) => (
          <a className="editorial-row" key={a.id} href={'#/activite/' + a.id}>
            <span className="row-number">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2>{a.title}</h2>
              <p>{a.goal}</p>
            </div>
            <span>
              {a.duration} min ·{' '}
              {progress.investigations[a.id]?.stage !== undefined
                ? 'étape ' + (progress.investigations[a.id].stage + 1) + '/8'
                : 'à explorer'}{' '}
              ↗
            </span>
          </a>
        ))}
      </div>
      <a href="#/references">Programmes, sources et limites →</a>
    </article>
  );
}
export function Activity({ id }: { id: string }) {
  const a = activities.find((x) => x.id === id),
    { progress, update } = useProgress();
  const [hints, setHints] = useState(0),
    [revealed, setRevealed] = useState(false),
    [checked, setChecked] = useState(false);
  if (!a)
    return (
      <article>
        <h1>Activité introuvable</h1>
        <a href="#/atelier">Revenir à l’atelier</a>
      </article>
    );
  const data = progress.investigations[id] ?? emptyInvestigation(),
    stage = data.stage;
  function change(patch: Partial<Investigation>) {
    update((p) => ({ ...p, investigations: { ...p.investigations, [id]: { ...data, ...patch } } }));
  }
  const field = (key: 'hypothesis' | 'observation' | 'explanation' | 'transfer', label: string) => (
    <label>
      {label}
      <textarea
        rows={5}
        maxLength={4000}
        value={data[key]}
        onChange={(e) => change({ [key]: e.target.value })}
      />
    </label>
  );
  return (
    <article className="investigation">
      <a href="#/atelier">← Les dix investigations</a>
      <div className="eyebrow">
        {a.duration} MIN PROPOSÉES / OBJECTIF : {a.goal}
      </div>
      <h1>{a.title}</h1>
      <nav className="stage-nav" aria-label="Étapes de l’investigation">
        {stages.map((s, i) => (
          <button
            key={s}
            className={i === stage ? 'active' : ''}
            aria-current={i === stage ? 'step' : undefined}
            onClick={() => change({ stage: i })}
          >
            {i + 1}
            <span>{s}</span>
          </button>
        ))}
      </nav>
      <section className="investigation-stage">
        <div className="eyebrow">ÉTAPE {stage + 1} / 8</div>
        <h2>{stages[stage]}</h2>
        {stage === 0 ? (
          <>
            <p className="lead">{a.question}</p>
            <p>{a.instruction}</p>
            <details>
              <summary>Public, prérequis et notions</summary>
              <p>{a.audience}</p>
              <p>{a.prerequisites}</p>
              <p>{a.notions}</p>
            </details>
          </>
        ) : stage === 1 ? (
          <>
            <p>
              Prédisez ce qui va se passer avant de lancer le calcul. Une hypothèse peut être
              corrigée après l’expérience.
            </p>
            {field('hypothesis', 'Mon hypothèse et ma justification')}
          </>
        ) : stage === 2 ? (
          <>
            <p>{a.manipulation}</p>
            <Experiment id={a.experiment} />
          </>
        ) : stage === 3 ? (
          <>
            <p>
              Relevez un résultat concret. Comparez-le à votre hypothèse, sans effacer celle-ci.
            </p>
            {field('observation', 'Mes observations : valeurs, extraits et comparaison')}
          </>
        ) : stage === 4 ? (
          <>
            <p>{a.science}</p>
            <p className="notice">Erreur fréquente : {a.errors}</p>
            {field('explanation', 'Mon explication du résultat')}
          </>
        ) : stage === 5 ? (
          <PythonWorkbench initialCode={a.python} initialInput={a.input} />
        ) : stage === 6 ? (
          <>
            <p className="lead">{a.transfer}</p>
            {field('transfer', 'Ma réponse à la situation de transfert')}
            <details>
              <summary>Approfondir</summary>
              <p>{a.deeper}</p>
            </details>
          </>
        ) : (
          <>
            <h3>{a.quiz.question}</h3>
            <fieldset>
              <legend>Conclusion à vérifier</legend>
              {a.quiz.choices.map((c, i) => (
                <label key={c}>
                  <input
                    type="radio"
                    name={'quiz-' + id}
                    value={i}
                    checked={data.answer === String(i)}
                    onChange={(e) => {
                      change({ answer: e.target.value });
                      setChecked(false);
                    }}
                  />
                  {c}
                </label>
              ))}
            </fieldset>
            <button onClick={() => setChecked(true)}>Vérifier cette conclusion</button>
            {checked && (
              <p role="status">
                {data.answer === String(a.quiz.expected)
                  ? 'Conclusion validée. Relisez aussi votre justification.'
                  : 'À reprendre : choisissez une conclusion appuyée par l’expérience.'}
              </p>
            )}
            <h3>Grille de relecture de mes écrits</h3>
            <ul>
              {a.criteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p>
              Aucune note automatique pour vos textes. Faites relire votre raisonnement par un pair
              ou l’enseignant.
            </p>
            <a
              className="button"
              href={
                activities[activities.indexOf(a) + 1]
                  ? '#/activite/' + activities[activities.indexOf(a) + 1].id
                  : '#/carnet'
              }
            >
              {activities[activities.indexOf(a) + 1]
                ? 'Investigation suivante →'
                : 'Ouvrir mon carnet →'}
            </a>
          </>
        )}
      </section>
      <div className="investigation-help">
        <button
          className="secondary"
          disabled={hints >= a.hints.length}
          onClick={() => setHints((n) => n + 1)}
        >
          Une aide supplémentaire ({hints}/{a.hints.length})
        </button>
        {a.hints.slice(0, hints).map((h) => (
          <p key={h}>{h}</p>
        ))}
        <button className="secondary" onClick={() => setRevealed((v) => !v)}>
          {revealed ? 'Masquer la correction' : 'Révéler la correction'}
        </button>
        {revealed && <p className="feedback">{a.correction}</p>}
      </div>
      <div className="lab-toolbar">
        <button
          className="secondary"
          disabled={stage === 0}
          onClick={() => change({ stage: stage - 1 })}
        >
          Étape précédente
        </button>
        <button disabled={stage === 7} onClick={() => change({ stage: stage + 1 })}>
          Étape suivante
        </button>
        <span>Écrits enregistrés localement · export dans le carnet</span>
      </div>
    </article>
  );
}
export function Laboratory({ id }: { id?: string }) {
  const [scientific, setScientific] = useState(false);
  const instrument = instruments.find((i) => i.id === id);
  return (
    <article>
      <div className="eyebrow">ESPACE 03 / LABORATOIRE SCIENTIFIQUE</div>
      <h1>{instrument ? instrument.title : 'Ouvrir les mécanismes.'}</h1>
      {instrument ? (
        <>
          <a href="#/laboratoire">← Tous les instruments</a>
          <fieldset className="level-switch">
            <legend>Niveau de lecture</legend>
            <label>
              <input
                type="radio"
                name="level"
                checked={!scientific}
                onChange={() => setScientific(false)}
              />
              Intuitif
            </label>
            <label>
              <input
                type="radio"
                name="level"
                checked={scientific}
                onChange={() => setScientific(true)}
              />
              Scientifique
            </label>
          </fieldset>
          <p>{instrument.summary}</p>
          <Experiment id={instrument.id as ExperimentId} scientific={scientific} />
          <details>
            <summary>Fiche pédagogique</summary>
            {laboratorySheets
              .filter((a) => a.experiment === instrument.id)
              .map((a) => (
                <div key={a.id}>
                  <h2>{a.title}</h2>
                  <p>{a.question}</p>
                  <p>
                    {a.audience} · {a.duration} minutes proposées.
                  </p>
                  <p>{a.prerequisites}</p>
                  <p>Objectif : {a.goal}</p>
                  <p>Notions : {a.notions}</p>
                  <p>Consigne : {a.instruction}</p>
                  <p>Manipulation : {a.manipulation}</p>
                  <p>Observation : {a.observation}</p>
                  <p>Explication : {a.science}</p>
                  <p>Erreurs : {a.errors}</p>
                  <ul>
                    {a.hints.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <p>Correction : {a.correction}</p>
                  <ul>
                    {a.criteria.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p>Transfert : {a.transfer}</p>
                  <p>Approfondissement : {a.deeper}</p>
                </div>
              ))}
          </details>
        </>
      ) : (
        <>
          <p className="lead">
            Des calculs inspectables, des modèles réduits et des limites explicites. Commencez par
            manipuler ; ouvrez ensuite les équations et les implémentations.
          </p>
          <div className="editorial-list">
            {instruments.map((x, i) => (
              <a className="editorial-row" href={'#/experience/' + x.id} key={x.id}>
                <span className="row-number">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{x.title}</h2>
                  <p>{x.summary}</p>
                </div>
                <span>Expérimenter ↗</span>
              </a>
            ))}
          </div>
          <a className="button secondary" href="#/bibliotheque">
            Consulter les neuf modules approfondis →
          </a>
        </>
      )}
    </article>
  );
}
