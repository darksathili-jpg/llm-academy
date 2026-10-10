import { useEffect, useState, type CSSProperties } from 'react';
import { scenarios, type Scenario } from '../../content/scenarios';
import { Experiment } from './Experiments';
import {
  elapsed,
  toggle,
  freshSession,
  parseSession,
  SESSION_KEY,
  PRIVATE_KEY,
  type Session,
} from '../../core/session';
function readSession(duration: Session['duration']): Session {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const s = parseSession(raw);
      const scenario = scenarios.find((x) => x.duration === duration)!;
      if (s.duration === duration && s.step < scenario.steps.length) return s;
    }
  } catch {
    /* use fresh session */
  }
  return freshSession(duration);
}
const time = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return (
    String(Math.floor(s / 3600)).padStart(2, '0') +
    ':' +
    String(Math.floor(s / 60) % 60).padStart(2, '0') +
    ':' +
    String(s % 60).padStart(2, '0')
  );
};
const escape = (s: string) =>
  s.replace(/[&<>"]/gu, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
function exportSheet(scenario: Scenario, trainer: boolean) {
  const rows = scenario.steps
    .map(
      (s, i) =>
        '<tr><td>' +
        (i + 1) +
        '</td><td>' +
        s.minutes +
        ' min</td><td><h2>' +
        escape(s.title) +
        '</h2><p>' +
        escape(s.instruction) +
        '</p><p>' +
        escape(s.mode) +
        ' — ' +
        escape(s.output) +
        '</p>' +
        (trainer
          ? '<p>Question : ' +
            escape(s.question) +
            '</p><p>Réponse attendue : ' +
            escape(s.expected) +
            '</p><p>Vigilance : ' +
            escape(s.vigilance) +
            '</p>'
          : '') +
        '</td></tr>',
    )
    .join('');
  const html =
    '<!doctype html><html lang="fr"><meta charset="utf-8"><title>LLM / Fiche ' +
    scenario.duration +
    '</title><style>body{font:16px/1.5 system-ui;max-width:1000px;margin:30px auto;color:black;background:white}table{border-collapse:collapse;width:100%}td{border-bottom:1px solid black;padding:12px;vertical-align:top}h2{font-size:20px}@media print{tr{break-inside:avoid}}</style><h1>LLM / ' +
    (trainer ? 'Conduite formateur' : 'Fiche participant') +
    ' — ' +
    scenario.duration +
    ' minutes</h1><p>' +
    escape(scenario.audience) +
    '</p><p>' +
    escape(scenario.prerequisites) +
    '</p><h2>Objectifs</h2><ul>' +
    scenario.goals.map((x) => '<li>' + escape(x) + '</li>').join('') +
    '</ul>' +
    (trainer
      ? '<h2>Préparation et matériel</h2><ul>' +
        [...scenario.materials, ...scenario.preparation]
          .map((x) => '<li>' + escape(x) + '</li>')
          .join('') +
        '</ul>'
      : '') +
    '<table>' +
    rows +
    '</table><h2>Synthèse</h2><p>' +
    escape(scenario.synthesis) +
    '</p><h2>Ressources</h2><ul>' +
    scenario.resources.map((x) => '<li>' + escape(x) + '</li>').join('') +
    '</ul><p>Site : https://darksathili-jpg.github.io/llm-academy/ · Sources : Éduscol, cadre d’usage IA et CNIL via la page Références. Durées proposées, pas mesurées en classe.</p></html>';
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' })),
    a = document.createElement('a');
  a.href = url;
  a.download = 'llm-' + (trainer ? 'conduite' : 'participant') + '-' + scenario.duration + '.html';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Studio({ duration }: { duration?: number }) {
  const scenario = scenarios.find((s) => s.duration === duration);
  useEffect(() => {
    const initial = new Map<HTMLDetailsElement, boolean>();
    const before = () => {
      document
        .querySelectorAll<HTMLDetailsElement>('.session-plan details, .studio-preparation')
        .forEach((d) => {
          if (!initial.has(d)) initial.set(d, d.open);
          d.open = true;
        });
    };
    const after = () => {
      for (const [d, open] of initial) d.open = open;
      initial.clear();
    };
    addEventListener('beforeprint', before);
    addEventListener('afterprint', after);
    return () => {
      removeEventListener('beforeprint', before);
      removeEventListener('afterprint', after);
      after();
    };
  }, [scenario]);
  return (
    <article>
      <div className="eyebrow">ESPACE 02 / STUDIO FORMATEUR</div>
      <h1>{scenario ? scenario.title : 'Une séance prête à animer.'}</h1>
      <p className="lead">
        Comprendre les mécanismes et exercer un jugement critique, avec des enseignants de toutes
        disciplines. Les durées constituent des propositions de conduite.
      </p>
      {!scenario ? (
        <div className="editorial-list">
          {scenarios.map((s) => (
            <a className="editorial-row" key={s.duration} href={'#/studio/' + s.duration}>
              <span className="row-number">{s.duration / 60} h</span>
              <div>
                <h2>{s.title}</h2>
                <p>{s.steps.length} étapes · individuel, binômes et collectif</p>
              </div>
              <span>Préparer ↗</span>
            </a>
          ))}
        </div>
      ) : (
        <>
          <a href="#/studio">← Les quatre formats</a>
          <p>{scenario.audience}</p>
          <h2>Objectifs et préparation</h2>
          <ul>
            {scenario.goals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <p>{scenario.prerequisites}</p>
          <details className="studio-preparation">
            <summary>Matériel et vérifications avant le stage</summary>
            <ul>
              {[...scenario.materials, ...scenario.preparation].map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </details>
          <div className="lab-toolbar">
            <a className="button" href={'#/animation/' + scenario.duration}>
              Ouvrir la console · reprendre la séance →
            </a>
            <button className="secondary" onClick={() => exportSheet(scenario, true)}>
              Exporter la fiche de conduite
            </button>
            <button className="secondary" onClick={() => exportSheet(scenario, false)}>
              Exporter la fiche participant
            </button>
            <button className="secondary" onClick={() => window.print()}>
              Imprimer ce déroulement
            </button>
          </div>
          <div className="session-plan">
            {scenario.steps.map((s, i) => (
              <details key={s.id}>
                <summary>
                  {String(i + 1).padStart(2, '0')} · {s.minutes} min · {s.title} · {s.mode}
                </summary>
                <p>{s.instruction}</p>
                <p>Production : {s.output}</p>
                <p>Question orale : {s.question}</p>
                <details>
                  <summary>Afficher la réponse attendue</summary>
                  <p>{s.expected}</p>
                </details>
                <p>Vigilance : {s.vigilance}</p>
              </details>
            ))}
          </div>
          <h2>Synthèse</h2>
          <p>{scenario.synthesis}</p>
          <h2>Ressources à remettre</h2>
          <ul>
            {scenario.resources.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
export function Animation({
  duration,
  projection = false,
}: {
  duration: number;
  projection?: boolean;
}) {
  const scenario = scenarios.find((s) => s.duration === duration) ?? scenarios[1];
  const [session, setSession] = useState(() => readSession(scenario.duration)),
    [now, setNow] = useState(Date.now),
    [warning, setWarning] = useState(''),
    [showDemo, setShowDemo] = useState(false),
    [visited, setVisited] = useState<string[]>([]);
  const step = scenario.steps[session.step];
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setWarning('');
    } catch {
      setWarning('Sauvegarde séance indisponible ; gardez cet onglet ouvert.');
    }
  }, [session]);
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key !== SESSION_KEY || !e.newValue) return;
      try {
        const s = parseSession(e.newValue);
        if (s.duration === scenario.duration && s.step < scenario.steps.length)
          setSession((prev) => (JSON.stringify(prev) === JSON.stringify(s) ? prev : s));
      } catch {
        setWarning('Mise à jour de séance invalide, ignorée.');
      }
    };
    addEventListener('storage', listener);
    return () => removeEventListener('storage', listener);
  }, [scenario]);
  function move(index: number) {
    if (index < 0 || index >= scenario.steps.length) return;
    setSession((s) => ({
      ...s,
      step: index,
      revealed: false,
      revealLevel: 0,
      activityClock: { elapsed: 0, started: s.activityClock.started === null ? null : Date.now() },
    }));
    setShowDemo(false);
  }
  function pause() {
    setSession((s) => {
      const next = toggle(s.sessionClock);
      return {
        ...s,
        sessionClock: next,
        activityClock:
          next.started === null
            ? s.activityClock.started === null
              ? s.activityClock
              : toggle(s.activityClock)
            : s.activityClock.started === null
              ? toggle(s.activityClock)
              : s.activityClock,
      };
    });
  }
  function reveal() {
    setSession((s) => {
      const revealLevel = s.revealLevel < 2 ? s.revealLevel + 1 : 0;
      return { ...s, revealed: revealLevel > 0, revealLevel };
    });
  }
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.matches('input,textarea,select') || e.target.isContentEditable)
      )
        return;
      if (
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        (e.key === ' ' && e.target instanceof HTMLElement && e.target.closest('button,a'))
      )
        return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        move(session.step + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        move(session.step - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        pause();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        reveal();
      }
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  });
  function openDemo() {
    if (step.experiment) {
      setVisited((v) => (v.includes(step.experiment!) ? v : [...v, step.experiment!]));
      setShowDemo((v) => !v);
    }
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setWarning('Plein écran indisponible : utilisez le raccourci plein écran du navigateur.');
    }
  }
  function popup(hash: string) {
    const opened = window.open(hash, '_blank', 'noopener,noreferrer');
    if (!opened)
      setWarning(
        'Si le navigateur bloque la fenêtre, ouvrez le lien de projection dans un autre onglet.',
      );
  }
  return (
    <section
      className="animation-console"
      style={{ '--session-scale': session.zoom / 100 } as CSSProperties}
    >
      <header className="console-toolbar">
        <a href={'#/studio/' + scenario.duration}>← Studio {scenario.duration / 60} h</a>
        <span className="clock-label">
          Séance{' '}
          <output data-testid="session-clock">{time(elapsed(session.sessionClock, now))}</output>
        </span>
        <span className="clock-label">
          Activité{' '}
          <output data-testid="activity-clock">{time(elapsed(session.activityClock, now))}</output>{' '}
          / {step.minutes} min
        </span>
        <button onClick={pause}>
          {session.sessionClock.started === null ? 'Démarrer / reprendre' : 'Mettre en pause'}
        </button>
        <button
          className="secondary"
          onClick={() => setSession((s) => ({ ...s, activityClock: toggle(s.activityClock) }))}
        >
          Pause / reprise activité
        </button>
        <button className="secondary" onClick={fullscreen}>
          Plein écran
        </button>
        <label className="zoom-control">
          Taille
          <select
            value={session.zoom}
            onChange={(e) => setSession((s) => ({ ...s, zoom: Number(e.target.value) }))}
          >
            {[100, 125, 150].map((x) => (
              <option key={x} value={x}>
                {x} %
              </option>
            ))}
          </select>
        </label>
        {!projection && (
          <>
            <button
              className="secondary"
              onClick={() => popup('#/projection/' + scenario.duration)}
            >
              Ouvrir l’écran de projection
            </button>
            <a href={'#/projection/' + scenario.duration} target="_blank" rel="noreferrer">
              Lien de projection ↗
            </a>
            <a href="#/coulisses" target="_blank" rel="noreferrer">
              Coulisses privées ↗
            </a>
          </>
        )}
      </header>
      <nav className="console-steps" aria-label="Étapes de la séance">
        {scenario.steps.map((s, i) => (
          <button
            aria-current={i === session.step ? 'step' : undefined}
            className={i === session.step ? 'active' : ''}
            key={s.id}
            onClick={() => move(i)}
            aria-label={'Étape ' + (i + 1) + ' : ' + s.title}
          >
            {i + 1}
          </button>
        ))}
      </nav>
      <main id="main" tabIndex={-1} className="projection-main">
        <div className="eyebrow">
          ÉTAPE {session.step + 1}/{scenario.steps.length} · {step.minutes} MIN · {step.mode}
        </div>
        <h1>{step.title}</h1>
        <p className="projected-instruction">{step.instruction}</p>
        <p className="oral-question">À discuter : {step.question}</p>
        {session.revealed && (
          <div className="projected-answer">
            <h2>Piste de correction</h2>
            <p>
              {session.revealLevel === 1 ? step.expected.split(/(?<=[.!?])\s+/u)[0] : step.expected}
            </p>
          </div>
        )}
        {step.experiment && (
          <button className="secondary" onClick={openDemo}>
            {showDemo ? 'Revenir à la consigne' : 'Ouvrir la démonstration'}
          </button>
        )}
        {visited.map((id) => (
          <div key={id} hidden={!showDemo || step.experiment !== id}>
            <Experiment id={id as NonNullable<typeof step.experiment>} />
          </div>
        ))}
      </main>
      <footer className="console-footer">
        <button
          className="secondary"
          disabled={session.step === 0}
          onClick={() => move(session.step - 1)}
        >
          Précédent
        </button>
        <button className="secondary" onClick={reveal}>
          {session.revealLevel === 0
            ? 'Révéler la réponse'
            : session.revealLevel === 1
              ? 'Compléter la réponse'
              : 'Masquer la réponse'}
        </button>
        <button
          disabled={session.step === scenario.steps.length - 1}
          onClick={() => move(session.step + 1)}
        >
          Suivant
        </button>
        <button
          className="secondary"
          onClick={() => {
            setSession(freshSession(scenario.duration));
            setShowDemo(false);
            setVisited([]);
          }}
        >
          Nouvelle séance
        </button>
        <button className="secondary" onClick={() => exportSheet(scenario, true)}>
          Fiche de conduite
        </button>
        <span>← → étapes · Espace chrono · R réponse · notes absentes de cette vue</span>
      </footer>
      {warning && <p role="status">{warning}</p>}
    </section>
  );
}
export function Backstage() {
  const [notes, setNotes] = useState(() => {
      try {
        const raw = localStorage.getItem(PRIVATE_KEY);
        return raw && raw.length <= 6000 ? raw : '';
      } catch {
        return '';
      }
    }),
    [message, setMessage] = useState('');
  return (
    <main id="main" className="private-backstage">
      <div className="eyebrow">COULISSES / FENÊTRE PRIVÉE DU FORMATEUR</div>
      <h1>Vos notes, hors projection.</h1>
      <p>
        Gardez cette fenêtre hors de l’écran partagé. Le navigateur ne peut pas détecter un partage
        de votre écran complet. La console et la vue de projection ne lisent jamais ces notes.
      </p>
      <label>
        Notes privées
        <textarea
          rows={16}
          value={notes}
          maxLength={6000}
          onChange={(e) => {
            setNotes(e.target.value);
            try {
              localStorage.setItem(PRIVATE_KEY, e.target.value);
              setMessage(
                'Notes enregistrées localement ; jamais incluses dans les fiches ou le carnet.',
              );
            } catch {
              setMessage('Stockage indisponible : notes en mémoire seulement.');
            }
          }}
        />
      </label>
      <p role="status">{message}</p>
      <a href="#/studio">Revenir au studio dans cette fenêtre</a>
    </main>
  );
}
