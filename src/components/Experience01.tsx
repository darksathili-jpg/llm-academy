import { useEffect, useRef, useState } from 'react';
import {
  CHANCES,
  counts,
  chooseWord,
  DEMO_KEY,
  freshDemo,
  parseDemo,
  PYTHON_DEMO,
  randomDraw,
  STEPS,
  WORDS,
  type DemoSession,
} from '../core/demo';
import { useProgress } from './ProgressProvider';
import { PythonWorkbench } from './science/PythonWorkbench';
function read() {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    return { data: raw ? parseDemo(raw) : freshDemo(), blocked: false, warning: '' };
  } catch {
    return {
      data: freshDemo(),
      blocked: true,
      warning:
        'Les notes déjà enregistrées restent conservées. Cet essai restera en mémoire ; tu peux le télécharger à la fin.',
    };
  }
}
function Ruler({ draw, hidden }: { draw?: number; hidden: boolean }) {
  return (
    <figure className="chance-diagram">
      <figcaption>Les chances préparées pour cet exemple</figcaption>
      <div className="chance-labels">
        {WORDS.map((word, i) => (
          <div key={word}>
            <strong>
              {!hidden && <span className={'legend-key zone-' + i} aria-hidden="true" />}
              {word}
            </strong>
            <span>{hidden ? '—' : Math.round(CHANCES[i]! * 100) + ' %'}</span>
          </div>
        ))}
      </div>
      {!hidden && (
        <div
          className="chance-ruler"
          role="img"
          aria-label="Une règle partagée en trois zones : canapé 60 %, tapis 30 %, bureau 10 %"
        >
          {CHANCES.map((p, i) => (
            <span key={i} className={'zone zone-' + i} style={{ width: p * 100 + '%' }} />
          ))}
          {draw !== undefined && (
            <span className="draw-pointer" style={{ left: draw * 100 + '%' }} aria-hidden="true" />
          )}
        </div>
      )}
      {!hidden && (
        <p>
          Le repère indique le dernier tirage : la zone touchée donne le mot. 60 %, c’est six
          chances sur dix à chaque essai. Cela n’impose pas six résultats identiques dans chaque
          groupe de dix.
        </p>
      )}
    </figure>
  );
}
export function Experience01({
  projection,
  onProjection,
}: {
  projection: boolean;
  onProjection: (value: boolean) => void;
}) {
  const [initial] = useState(read),
    [session, setSession] = useState(initial.data),
    [warning, setWarning] = useState(initial.warning),
    [trainer, setTrainer] = useState(false),
    [hidden, setHidden] = useState(false),
    [revealed, setRevealed] = useState(0),
    [notice, setNotice] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const { progress } = useProgress();
  const step = session.step,
    last = session.attempts.at(-1),
    totals = counts(session.attempts);
  function commit(patch: Partial<DemoSession>) {
    const next = { ...session, ...patch };
    setSession(next);
    if (initial.blocked) return;
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(next));
      setWarning('');
    } catch {
      setWarning('Tes notes restent en mémoire. Télécharge-les avant de fermer cette page.');
    }
  }
  const canNext =
    step === 0 ||
    (step === 1 && (Boolean(session.hypothesis.trim()) || session.oral)) ||
    (step === 2 && session.attempts.length > 0) ||
    (step === 3 && (Boolean(session.observation.trim()) || session.oral));
  function move(delta: number) {
    if (delta > 0 && !canNext) return;
    commit({ step: Math.max(0, Math.min(4, step + delta)) });
    setRevealed(0);
  }
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  function draw(n: number) {
    const remaining = Math.min(n, 100 - session.attempts.length);
    commit({
      attempts: [
        ...session.attempts,
        ...Array.from({ length: remaining }, () => chooseWord(randomDraw())),
      ],
    });
  }
  async function project() {
    setTrainer(true);
    commit({ oral: true });
    onProjection(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      setNotice('L’affichage de projection est actif. Le plein écran n’est pas disponible ici.');
    }
  }
  function exitProjection() {
    onProjection(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }
  useEffect(() => {
    const changed = () => {
      if (!document.fullscreenElement) onProjection(false);
    };
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, [onProjection]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        (event.target as HTMLElement)?.closest(
          'input,textarea,select,button,a,[contenteditable=true]',
        ) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
      }
      if (trainer && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        setRevealed((v) => Math.min(3, v + 1));
      }
      if (trainer && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        setHidden((v) => !v);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
  function download() {
    const data = {
      format: 'llm-academy-demonstrateur',
      version: 1,
      experience: session,
      carnetAnterieur: progress,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'llm-academy-mes-notes.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const explanations = [
    [
      'Plus de chances ne veut pas dire toujours choisi.',
      'La machine de cet exercice choisit au hasard, en respectant les chances annoncées. « Canapé » est favorisé, mais « tapis » et « bureau » peuvent aussi sortir. Quelques essais peuvent donner des proportions différentes de 60 / 30 / 10.',
    ],
    [
      'Choisir un mot ne prouve pas qu’une phrase est vraie.',
      'Le résultat ne nous dit pas où dort un chat réel. Le programme ne vérifie aucun fait : il choisit parmi trois suites possibles. Pour vérifier une affirmation, il faut chercher des informations fiables.',
    ],
    [
      'Dans un modèle de langage, on parle de « token ».',
      'Un token est un morceau de texte traité par le modèle : parfois un mot entier, parfois une partie de mot. Ici, nous avons choisi trois mots entiers. Dans un vrai modèle, les chances sont calculées à partir du texte et de paramètres appris. Ici, elles ont été préparées par nous.',
    ],
  ];
  return (
    <article className="experience-sheet">
      <header className="experience-heading">
        <p className="folio">EXPÉRIENCE / 01</p>
        <h1>Le mot d’après.</h1>
        <p>Comment une machine choisit-elle la suite d’un texte ?</p>
      </header>
      {projection && (
        <button className="exit-projection" onClick={exitProjection}>
          Quitter la projection
        </button>
      )}
      <ol className="step-titles" aria-label="Les cinq étapes">
        {STEPS.map((name, i) => (
          <li key={name} aria-current={i === step ? 'step' : undefined}>
            <span>{i + 1}</span>
            {name}
          </li>
        ))}
      </ol>
      <section className="experiment-stage">
        <div className="stage-label">
          <span>{String(step + 1).padStart(2, '0')}</span>
          <h2 ref={heading} tabIndex={-1}>
            {STEPS[step]}
          </h2>
        </div>
        {step === 0 ? (
          <>
            <p className="instruction">Quel mot pourrait venir après cette phrase ?</p>
            <div className="sentence-strip">
              Le chat dort sur le<span className="unfinished">…</span>
            </div>
            <p className="word-candidates">
              Trois mots possibles : <strong>canapé</strong>, <strong>tapis</strong>,{' '}
              <strong>bureau</strong>.
            </p>
            <p>
              Tu vas proposer une réponse, faire quelques essais, puis comparer ce qui se passe avec
              ce que tu pensais.
            </p>
            <p className="source-note">
              C’est un petit exemple préparé, pas une IA entraînée. Aucun compte ni connaissance en
              programmation n’est nécessaire.
            </p>
          </>
        ) : step === 1 ? (
          <>
            <p className="instruction">À ton avis, quel mot sortira le plus souvent ? Pourquoi ?</p>
            <div className="sentence-strip">
              Le chat dort sur le<span className="unfinished">…</span>
            </div>
            <label className="writing-field">
              Ma proposition avant l’essai
              <textarea
                maxLength={2000}
                rows={3}
                value={session.hypothesis}
                placeholder="Je pense que… parce que…"
                onChange={(e) => commit({ hypothesis: e.target.value })}
              />
            </label>
            <p>
              Cette proposition s’appelle une hypothèse. Elle peut être fausse : c’est justement ce
              que l’essai permet d’examiner.
            </p>
            {trainer && (
              <button className="quiet-button" onClick={() => commit({ oral: true })}>
                Proposer notre hypothèse à l’oral
              </button>
            )}
          </>
        ) : step === 2 ? (
          <>
            <p className="instruction">
              Clique sur « Tirer un mot ». Recommence pour voir si le résultat change.
            </p>
            <div className="sentence-strip" aria-live="polite">
              Le chat dort sur le{' '}
              <strong className="chosen-word">
                {hidden ? '…' : last ? WORDS[last.token] : '…'}
              </strong>
            </div>
            <Ruler hidden={hidden} draw={last?.draw} />
            <div className="draw-actions">
              <button disabled={session.attempts.length >= 100} onClick={() => draw(1)}>
                Tirer un mot
              </button>
              <button
                className="quiet-button"
                disabled={session.attempts.length >= 100}
                onClick={() => draw(20)}
              >
                Faire 20 essais
              </button>
            </div>
            {!hidden && session.attempts.length > 0 && (
              <p role="status" className="draw-status">
                {session.attempts.length} essais réalisés :{' '}
                {WORDS.map((w, i) => w + ' ' + totals[i]).join(' · ')}.
              </p>
            )}
            {hidden && (
              <p className="masked-note">Résultats masqués pour laisser le groupe chercher.</p>
            )}
            <p className="source-note">
              Les chances 60 / 30 / 10 sont préparées pour cette démonstration. Le tirage est
              réellement calculé. Chaque essai repart de la même phrase ; on ne fabrique pas un
              texte entier.
            </p>
            {session.attempts.length >= 100 && (
              <p>100 essais réalisés. Passe maintenant à tes observations.</p>
            )}
          </>
        ) : step === 3 ? (
          <>
            <p className="instruction">Compare les essais avec ta proposition de départ.</p>
            {!hidden ? (
              <>
                <blockquote className="hypothesis-recap">
                  Ta proposition : {session.hypothesis || 'discutée à l’oral'}
                </blockquote>
                <dl className="observed-counts">
                  {WORDS.map((w, i) => (
                    <div key={w}>
                      <dt>{w}</dt>
                      <dd>
                        {totals[i]} <small>fois</small>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p>
                  Ce sont les résultats de {session.attempts.length} essais, pas les chances de
                  départ.
                </p>
              </>
            ) : (
              <p className="masked-note">Proposition et résultats masqués.</p>
            )}
            <label className="writing-field">
              Ce que j’ai observé
              <textarea
                maxLength={2000}
                rows={3}
                value={session.observation}
                placeholder="J’ai vu… Cela confirme ou change mon idée parce que…"
                onChange={(e) => commit({ observation: e.target.value })}
              />
            </label>
            <p>
              Quel mot est sorti le plus souvent ? Est-il sorti à tous les essais ? Un seul tirage
              suffit-il à conclure ?
            </p>
            {trainer && (
              <button className="quiet-button" onClick={() => commit({ oral: true })}>
                Discuter nos observations à l’oral
              </button>
            )}
          </>
        ) : (
          <>
            <p className="instruction">
              Retenir ce que cet essai montre — et ce qu’il ne montre pas.
            </p>
            {trainer && revealed === 0 && (
              <p className="masked-note">
                L’explication attend la discussion. Utilise « Révéler l’explication suivante » ou la
                touche R.
              </p>
            )}
            <div className="explanation">
              {explanations.slice(0, trainer ? revealed : 3).map(([title, text], i) => (
                <section key={title}>
                  <span className="explanation-number">{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </section>
              ))}
            </div>
            {(!trainer || revealed === 3) && (
              <div className="ending">
                <p>
                  L’expérience est terminée. Essaie de l’expliquer avec tes mots à une autre
                  personne.
                </p>
                <button className="quiet-button" onClick={download}>
                  Télécharger mes notes
                </button>
                <p className="source-note">
                  Le fichier conserve aussi le carnet antérieur. Les notes privées du formateur n’y
                  sont pas incluses.
                </p>
              </div>
            )}
          </>
        )}
        <nav className="step-actions" aria-label="Avancer dans l’expérience">
          <button className="quiet-button" disabled={step === 0} onClick={() => move(-1)}>
            Précédent
          </button>
          {step < 4 && (
            <button disabled={!canNext} onClick={() => move(1)}>
              {step === 0
                ? 'Faire ma proposition'
                : step === 1
                  ? 'Passer à l’essai'
                  : step === 2
                    ? 'Noter ce que j’observe'
                    : 'Lire l’explication'}
            </button>
          )}
          <span>{step + 1} / 5</span>
        </nav>
      </section>
      {!projection && (
        <div className="extensions" aria-label="Prolongements facultatifs">
          <p>Pour prolonger cette même expérience, si tu le souhaites.</p>
          <details className="python-extension">
            <summary>Explorer avec Python</summary>
            <p>
              Refais le même choix de mot avec un petit programme. Les chances restent les mêmes ;
              les résultats précis peuvent différer du navigateur.
            </p>
            <p>
              Le premier lancement télécharge Python et nécessite Internet. Le fichier peut aussi
              être téléchargé pour travailler ailleurs.
            </p>
            <PythonWorkbench
              initialCode={PYTHON_DEMO}
              hints={[
                'Additionne les trois préférences, puis divise chacune par le total.',
                'Le nombre au hasard doit tomber dans une des trois zones.',
                'Change les préférences et vérifie que la somme des chances reste 1.',
              ]}
            />
          </details>
          <details
            className="trainer-extension"
            onToggle={(e) => {
              if (e.currentTarget.open) {
                setTrainer(true);
                setRevealed(0);
              }
            }}
          >
            <summary>Animer cette expérience</summary>
            <p>
              Le groupe suit les mêmes cinq étapes. Demande une proposition avant le premier tirage,
              puis fais comparer plusieurs essais. Recueille les observations avant de montrer
              l’explication.
            </p>
            <div className="trainer-commands">
              <button
                className="quiet-button"
                onClick={() => {
                  setHidden(true);
                  setRevealed(0);
                }}
              >
                Masquer les réponses
              </button>
              <button className="quiet-button" onClick={() => setHidden(false)}>
                Montrer les résultats
              </button>
              <button
                disabled={step !== 4 || revealed >= 3}
                onClick={() => setRevealed((v) => Math.min(3, v + 1))}
              >
                Révéler l’explication suivante
              </button>
              <button className="quiet-button" onClick={project}>
                Projeter l’expérience
              </button>
              <button
                className="quiet-button"
                onClick={() => {
                  setTrainer(false);
                  setHidden(false);
                }}
              >
                Lire l’explication complète
              </button>
            </div>
            <p>
              Flèches : changer d’étape. M : masquer/montrer les résultats. R : révéler une partie
              de l’explication. Les raccourcis restent inactifs pendant une saisie.
            </p>
            <p>
              La projection conserve la même expérience ; les commandes et le code sont rangés hors
              de l’écran projeté. Aucune fenêtre privée n’est lue.
            </p>
          </details>
        </div>
      )}
      {warning && (
        <p role="alert" className="notice">
          {warning}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
    </article>
  );
}
