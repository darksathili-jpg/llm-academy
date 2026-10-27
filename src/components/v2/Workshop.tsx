import { learnerGuides, plainSteps } from '../../content/learnerGuides';
import { nsiChallenges } from '../../content/nsiChallenges';
import { reviewInvestigation } from '../../core/pedagogicalReview';
import { laboratorySheets } from '../../content/laboratorySheets';
import { useEffect, useRef, useState } from 'react';
import { activities, type ExperimentId } from '../../content/activities';
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
        Dix activités guidées.
        <br />
        Une question à la fois.
      </h1>
      <p className="lead">
        Lis une question, essaie une manipulation, puis explique ce que tu as vu. Tu peux commencer
        sans connaître le vocabulaire de l’IA. La partie Python est facultative.
      </p>
      <p>
        <a className="button" href="#/decouvrir">
          Première visite ? Commence par la découverte en 5 minutes →
        </a>
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
              <h2>{learnerGuides[a.id].title}</h2>
              <p>{learnerGuides[a.id].goal}</p>
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
    [checked, setChecked] = useState(false),
    [pythonMode, setPythonMode] = useState<'demo' | 'mission'>('demo');
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const currentStage = progress.investigations[id]?.stage ?? 0;
  useEffect(() => {
    stageHeading.current?.focus();
  }, [id, currentStage]);
  if (!a)
    return (
      <article>
        <h1>Activité introuvable</h1>
        <a href="#/atelier">Revenir à l’atelier</a>
      </article>
    );
  const guide = learnerGuides[id];
  const data = progress.investigations[id] ?? emptyInvestigation(),
    stage = data.stage;
  const challenge = nsiChallenges[id];
  const review = reviewInvestigation(data, String(a.quiz.expected));
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
      <a href="#/atelier">← Les dix activités</a>
      <div className="eyebrow">
        {a.duration} MIN PROPOSÉES / {guide.goal}
      </div>
      <h1>{guide.title}</h1>
      <p>
        Étape {stage + 1} sur 8 : {plainSteps[stage]}
      </p>
      <details className="stage-jump">
        <summary>Aller à une autre étape</summary>
        <nav className="stage-nav" aria-label="Étapes de l’activité">
          {plainSteps.map((s, i) => (
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
      </details>
      <section className="investigation-stage">
        <div className="eyebrow">ÉTAPE {stage + 1} / 8</div>
        <h2 ref={stageHeading} tabIndex={-1}>
          {plainSteps[stage]}
        </h2>
        {stage === 0 ? (
          <>
            <p className="lead">{guide.question}</p>
            <blockquote>{guide.example}</blockquote>
            <p>
              <strong>Ce que tu vas faire :</strong> {guide.goal}
            </p>
            <details>
              <summary>Informations pour l’enseignant</summary>
              <p>{a.audience}</p>
              <p>{a.prerequisites}</p>
              <p>{a.notions}</p>
            </details>
          </>
        ) : stage === 1 ? (
          <>
            <p>
              {guide.guess} Tu n’as pas besoin d’avoir la bonne réponse : écris ce que tu penses
              pour le comparer après l’essai.
            </p>
            {field('hypothesis', 'Ce que je pense avant l’essai, et pourquoi')}
          </>
        ) : stage === 2 ? (
          <>
            <p className="lead">
              <strong>À faire :</strong> {guide.tryIt}
            </p>
            <section className="command-vocabulary">
              <h3>Les mots des commandes</h3>
              <dl className="plain-glossary">
                {guide.glossary.map(([term, meaning]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{meaning}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <Experiment id={a.experiment} />
          </>
        ) : stage === 3 ? (
          <>
            <p>{guide.observe} Compare avec ce que tu pensais avant l’essai.</p>
            {field('observation', 'Ce que j’ai vu pendant l’essai')}
          </>
        ) : stage === 4 ? (
          <>
            <p className="lead">{guide.explain}</p>
            <details>
              <summary>Approfondir : explication scientifique</summary>
              <p>{a.science}</p>
              <p>À ne pas confondre : {a.errors}</p>
            </details>
            {field('explanation', 'Mon explication du résultat')}
          </>
        ) : stage === 5 ? (
          <>
            <p>
              Deux façons de programmer : essayer un exemple complet ou résoudre une mission de
              Terminale NSI. La programmation est facultative dans la découverte, mais proposée
              systématiquement aux élèves de NSI.
            </p>
            <div className="lab-toolbar" role="group" aria-label="Choix du travail Python">
              <button
                className="secondary"
                aria-pressed={pythonMode === 'demo'}
                onClick={() => setPythonMode('demo')}
              >
                Démonstration guidée
              </button>
              <button
                className="secondary"
                aria-pressed={pythonMode === 'mission'}
                onClick={() => setPythonMode('mission')}
              >
                Mission Python NSI : {challenge.title}
              </button>
            </div>
            {pythonMode === 'mission' && (
              <section className="notice">
                <h3>{challenge.title}</h3>
                <p><strong>Objectif :</strong> {challenge.goal}</p>
                <p><strong>Consigne :</strong> {challenge.instruction}</p>
                <p>
                  Compléter la fonction à la place de TODO, puis exécuter le programme.
                  Les assertions vérifient des résultats ; elles ne certifient pas la compréhension.
                </p>
                <p><strong>Transfert :</strong> {challenge.transfer}</p>
              </section>
            )}
            <details>
              <summary>Afficher le code Python</summary>
              <PythonWorkbench
                key={pythonMode}
                initialCode={pythonMode === 'demo' ? a.python : challenge.starter}
                initialInput={pythonMode === 'demo' ? a.input : ''}
                hints={pythonMode === 'demo' ? undefined : [
                  challenge.hint,
                  'Exécute les assertions après avoir modifié la fonction.',
                  'Si un test échoue, compare les données du test avec la valeur renvoyée.',
                ]}
              />
              {pythonMode === 'mission' && (
                <details>
                  <summary>Consulter le corrigé Python après mes essais</summary>
                  <p>Comparer les instructions, les valeurs renvoyées et les cas de test.</p>
                  <pre className="code-output">{challenge.solution}</pre>
                </details>
              )}
            </details>
            <button className="secondary" onClick={() => change({ stage: 6 })}>
              Continuer sans programmer →
            </button>
          </>
        ) : stage === 6 ? (
          <>
            <p className="lead">{guide.transfer}</p>
            {field('transfer', 'Ma réponse pour ce nouvel exemple')}
            <details>
              <summary>Approfondir</summary>
              <p>{a.deeper}</p>
            </details>
          </>
        ) : (
          <>
            <h3>{a.quiz.question}</h3>
            <details>
              <summary>Un mot du quiz te bloque ?</summary>
              <dl className="plain-glossary">
                {guide.glossary.map(([term, meaning]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{meaning}</dd>
                  </div>
                ))}
              </dl>
            </details>
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
            <section className="notice" aria-label="Bilan de mes traces">
              <h3>Bilan de mes traces</h3>
              <p role="status">
                {review.readyForReview
                  ? 'Les quatre traces sont présentes et la conclusion choisie est correcte. Ton raisonnement reste à faire relire.'
                  : 'Ce bilan n’attribue ni note ni compétence acquise.'}
              </p>
              {review.missing.length > 0 && (
                <>
                  <p>Il manque encore des traces de ton raisonnement :</p>
                  <ul>{review.missing.map((item) => <li key={item}>{item}</li>)}</ul>
                </>
              )}
              {!review.conclusionCorrect && (
                <p>Reviens à la question finale et justifie ton choix avec une observation.</p>
              )}
              <p>
                Une réponse correcte et des champs remplis ne suffisent pas pour prouver
                la compréhension. Le transfert et la justification doivent être examinés
                par l’enseignant ou un pair.
              </p>
            </section>
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
                ? 'Activité suivante →'
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
        {[guide.hint, guide.observe, guide.explain].slice(0, hints).map((h) => (
          <p key={h}>{h}</p>
        ))}
        <button className="secondary" onClick={() => setRevealed((v) => !v)}>
          {revealed ? 'Masquer la correction' : 'Voir une explication pour m’aider'}
        </button>
        {revealed && (
          <div className="feedback">
            <p>{guide.explain}</p>
            <details>
              <summary>Correction détaillée</summary>
              <p>{a.correction}</p>
            </details>
          </div>
        )}
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
          {!scientific &&
            (() => {
              const activity = activities.find((a) => a.experiment === instrument.id);
              const guide = activity && learnerGuides[activity.id];
              return guide ? (
                <section className="lab-introduction">
                  <h2>Pour commencer</h2>
                  <p>{guide.tryIt}</p>
                  <details>
                    <summary>Les mots des commandes, expliqués simplement</summary>
                    <dl className="plain-glossary">
                      {guide.glossary.map(([term, meaning]) => (
                        <div key={term}>
                          <dt>{term}</dt>
                          <dd>{meaning}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                </section>
              ) : null;
            })()}
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
