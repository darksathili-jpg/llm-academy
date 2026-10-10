import { useEffect, useState } from 'react';
import { Experience01 } from './components/Experience01';
import { useProgress } from './components/ProgressProvider';
import type { Theme } from './core/progress';
const experiences = [
  ['Choisir le mot suivant', 'Pourquoi ce mot plutôt qu’un autre ?'],
  ['Découper une phrase', 'Quels morceaux la machine utilise-t-elle ?'],
  ['Faire varier les choix', 'Pourquoi deux réponses peuvent-elles être différentes ?'],
  ['Changer le début de la phrase', 'Que change ce qui a déjà été écrit ?'],
  ['Faire apprendre une machine', 'Que change le fait de lui montrer des exemples ?'],
  ['Vérifier une réponse', 'Comment savoir si ce qui est écrit est juste ?'],
];
function routeFromHash() {
  return location.hash.startsWith('#/') ? location.hash.slice(2) : '';
}
function Home() {
  return (
    <article className="home-sheet">
      <p className="folio">SIX EXPÉRIENCES / UN MÊME PARCOURS</p>
      <h1>
        Comment une IA
        <br />
        choisit ses mots<span className="question-mark">?</span>
      </h1>
      <p className="home-intro">
        Une question. Un essai. Une idée qui devient plus claire.
        <br />
        Pour les élèves et les enseignants, avec les mêmes expériences.
      </p>
      <ol className="experience-index">
        {experiences.map(([title, description], i) => (
          <li key={title}>
            <span className="index-number">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
              {i === 0 && (
                <a className="primary-link" href="#/experience/01">
                  Essayer la première expérience <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="scope-note">
        Ce démonstrateur ouvre uniquement la première expérience. Les cinq suivantes attendront une
        validation humaine.
      </p>
      <a className="design-link" href="#/maquettes">
        Voir les trois propositions graphiques
      </a>
    </article>
  );
}
function Mockups() {
  return (
    <article className="mockup-index">
      <p className="folio">CHOIX GRAPHIQUE / TROIS PROPOSITIONS</p>
      <h1>
        Trois façons
        <br />
        de mettre l’essai au centre.
      </h1>
      <p>
        Des maquettes statiques de l’accueil et de la manipulation. Seul le démonstrateur calcule
        réellement les tirages.
      </p>
      <ol>
        {[
          [
            '01-paillasse',
            'La Paillasse',
            'Une feuille d’expérience, une règle de hasard, des marges utiles. Direction retenue provisoirement pour le démonstrateur.',
          ],
          [
            '02-revue',
            'La Revue',
            'Une double page de revue scientifique, composée en colonnes avec des annotations.',
          ],
          [
            '03-scene',
            'La Scène',
            'Une phrase immense, des mots en lumière, une conduite collective de séance.',
          ],
        ].map(([id, title, detail]) => (
          <li key={id}>
            <h2>
              <a href={import.meta.env.BASE_URL + 'maquettes/' + id + '.html'}>{title} →</a>
            </h2>
            <p>{detail}</p>
          </li>
        ))}
      </ol>
      <a href="#/">Revenir aux expériences</a>
    </article>
  );
}
export default function App() {
  const [route, setRoute] = useState(routeFromHash),
    [projection, setProjection] = useState(false);
  const { progress, update, warning } = useProgress();
  useEffect(() => {
    const change = () => {
      if (!location.hash.startsWith('#/')) return;
      setRoute(routeFromHash());
      setProjection(false);
      requestAnimationFrame(() => document.getElementById('content')?.focus());
      scrollTo(0, 0);
    };
    addEventListener('hashchange', change);
    return () => removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = projection ? 'projector' : progress.theme;
  }, [projection, progress.theme]);
  useEffect(() => {
    document.title =
      'LLM Academy — ' +
      (route === 'experience/01' ? 'Le mot d’après' : 'Expérimenter pour comprendre');
  }, [route]);
  useEffect(() => {
    if (import.meta.env.PROD && 'serviceWorker' in navigator)
      void navigator.serviceWorker
        .register(import.meta.env.BASE_URL + 'sw.js', { scope: import.meta.env.BASE_URL })
        .catch(() => {});
  }, []);
  const main =
    route === 'experience/01' ? (
      <Experience01 projection={projection} onProjection={setProjection} />
    ) : route === 'maquettes' ? (
      <Mockups />
    ) : !route ? (
      <Home />
    ) : (
      <article>
        <h1>Cette expérience n’est pas ouverte.</h1>
        <p>Seule la première est construite pour ce démonstrateur.</p>
        <a href="#/">Revenir aux expériences</a>
      </article>
    );
  return (
    <div className={'academy-simple' + (projection ? ' is-projecting' : '')}>
      <a className="skip-link" href="#content">
        Aller au contenu
      </a>
      {!projection && (
        <header className="simple-header">
          <a className="wordmark" href="#/" aria-label="LLM Academy — Accueil">
            LLM<span>ACADEMY</span>
          </a>
          <p>Expérimenter pour comprendre.</p>
          <fieldset className="view-options">
            <legend className="sr-only">Affichage</legend>
            {(
              [
                ['light', 'Clair'],
                ['dark', 'Sombre'],
                ['projector', 'Projection'],
              ] as [Theme, string][]
            ).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="theme"
                  checked={progress.theme === value}
                  onChange={() => update((p) => ({ ...p, theme: value }))}
                />
                {label}
              </label>
            ))}
          </fieldset>
        </header>
      )}
      {warning && (
        <p role="alert" className="notice">
          {warning}
        </p>
      )}
      <main id="content" tabIndex={-1}>
        {main}
      </main>
      {!projection && (
        <footer className="simple-footer">
          <a href="#/">Les six expériences</a>
          <span>Un seul parcours · aucun compte</span>
        </footer>
      )}
    </div>
  );
}
