import { useEffect, useRef, useState } from 'react';
import { modules, upcoming } from './content/modules';
import { exercises, isModuleId } from './core/exercises';
import { moduleScore, type Theme } from './core/progress';
import { useProgress } from './components/ProgressProvider';
import { ModulePage } from './components/ModulePage';
import { Notebook } from './components/Notebook';
import { Workshop, Activity, Laboratory } from './components/v2/Workshop';
import { Studio, Animation, Backstage } from './components/v2/Studio';
import { FirstSteps, StarterPreview } from './components/v2/FirstSteps';
import { TeacherGuide } from './components/v2/TeacherGuide';
import { TeacherSequencePage } from './components/v2/TeacherSequencePage';
function readRoute() {
  return location.hash.startsWith('#/') ? location.hash.slice(2).split('?')[0] || 'home' : 'home';
}
function Home() {
  return (
    <>
      <section className="editorial-hero">
        <div>
          <div className="eyebrow">LYCÉE WATTEAU · DÉCOUVRIR LES MODÈLES DE LANGAGE</div>
          <h1>
            Une machine
            <br />
            peut écrire.
            <br />
            <em>Comment fait-elle ?</em>
          </h1>
          <p className="lead">
            Comment une IA choisit-elle les mots d’une réponse ? Partons d’une phrase simple,
            faisons un essai, puis expliquons ce qui se passe.
          </p>
          <a className="button" href="#/decouvrir">
            Commencer en 5 minutes, sans code →
          </a>
          <p className="hero-note">Aucune connaissance préalable · sans compte</p>
        </div>
        <StarterPreview />
      </section>
      <section className="space-entrances" aria-label="Les trois espaces">
        <a className="editorial-row" href="#/atelier">
          <span className="row-number">01</span>
          <div>
            <h2>Atelier Terminale NSI</h2>
            <p>Dix activités guidées. À chaque fois : une question, un essai, une explication.</p>
          </div>
          <span>Entrer dans l’atelier ↗</span>
        </a>
        <a className="editorial-row" href="#/studio">
          <span className="row-number">02</span>
          <div>
            <h2>Studio formateur</h2>
            <p>Des séances de 1, 2, 3 et 6 heures, pensées pour être animées.</p>
          </div>
          <span>Préparer une séance ↗</span>
        </a>
        <a className="editorial-row" href="#/laboratoire">
          <span className="row-number">03</span>
          <div>
            <h2>Laboratoire scientifique</h2>
            <p>Pour aller plus loin : observer les calculs et comprendre leurs limites.</p>
          </div>
          <span>Explorer les instruments ↗</span>
        </a>
      </section>
      <section className="editorial-callout">
        <div className="eyebrow">POUR VOTRE PROCHAIN STAGE</div>
        <h2>
          Deux heures pour comprendre,
          <br />
          et apprendre à vérifier.
        </h2>
        <p>Un déroulement, des questions orales, des expériences et une console de projection.</p>
        <a href="#/studio/120">Ouvrir la séance de deux heures →</a>
        <p>
          <a href="#/enseignant">Préparer mes activités de NSI avec le dossier enseignant →</a>
        </p>
      </section>
      <p>
        <a href="#/bibliotheque">Les neuf modules approfondis →</a> ·{' '}
        <a href="#/module/01">Entrer dans le premier module →</a>
      </p>
    </>
  );
}
function Library() {
  const { progress, update } = useProgress();
  return (
    <article>
      <div className="eyebrow">BIBLIOTHÈQUE / APPROFONDIR</div>
      <h1>Des fondations à l’entraînement.</h1>
      <p>
        Neuf modules approfondis et leurs calculs. Les investigations et le studio sont accessibles
        depuis les trois espaces.
      </p>
      <fieldset className="track-options">
        <legend>Choisir mon parcours de lecture</legend>
        <label>
          <input
            type="radio"
            checked={progress.track === 'discovery'}
            onChange={() => update((p) => ({ ...p, track: 'discovery' }))}
          />
          Découverte guidée
        </label>
        <label>
          <input
            type="radio"
            checked={progress.track === 'developer'}
            onChange={() => update((p) => ({ ...p, track: 'developer' }))}
          />
          Parcours développeur
        </label>
      </fieldset>
      <div className="editorial-list">
        {modules.map((m) => (
          <a className="editorial-row" key={m.id} href={'#/module/' + m.id}>
            <span className="row-number">{m.id}</span>
            <div>
              <h2>{m.title}</h2>
              <p>{m.subtitle}</p>
            </div>
            <span>
              {moduleScore(progress, m.id).correct}/{moduleScore(progress, m.id).total} calculs
              vérifiés ↗
            </span>
          </a>
        ))}
      </div>
      <p>
        {upcoming.length} modules de la collection initiale restent à construire ; le mini-RAG et le
        prompting sont déjà accessibles comme expériences V2.
      </p>
    </article>
  );
}
function References() {
  const refs = Array.from(
    new Map(modules.flatMap((m) => m.references).map((r) => [r.url, r])).values(),
  );
  return (
    <article>
      <header className="page-heading">
        <span className="eyebrow">Méthode & références</span>
        <h1>Des mécanismes vérifiables</h1>
        <p className="lead">
          Des explications originales, des sources scientifiques et des limites explicites.
        </p>
      </header>
      <section>
        <h2>Programmes et usage en classe</h2>
        <p>
          Sources officielles consultées le 10 octobre 2026. Les mécanismes des LLM sont des
          prolongements hors programme NSI ; aucun compte ni donnée personnelle n’est nécessaire
          dans ces activités.
        </p>
        <ul>
          <li>
            <a href="https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g">
              Éduscol : programmes NSI en vigueur
            </a>
          </li>
          <li>
            <a href="https://www.education.gouv.fr/cadre-d-usage-de-l-ia-en-education-450647">
              Cadre d’usage de l’IA en éducation
            </a>
          </li>
          <li>
            <a href="https://www.cnil.fr/fr/enseignant-usage-systeme-ia">
              CNIL : enseignants et systèmes d’IA
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/WCAG22/">WCAG 2.2 : exigences d’accessibilité</a>
          </li>
        </ul>
        <h2>Références scientifiques des modules</h2>
        <ul className="references">
          {refs.map((r) => (
            <li key={r.url}>
              <a href={r.url}>{r.title}</a>
              <span>{r.reason}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Une formation qui se construit</h2>
        <p>
          Les ouvrages de Sebastian Raschka (Build a Large Language Model From Scratch), Jay Alammar
          et Maarten Grootendorst (Hands-On Large Language Models) et Chip Huyen (AI Engineering)
          sont des références de progression. Les textes, exercices, corpus et figures de cette
          plateforme sont originaux ; aucun chapitre n’est reproduit.
        </p>
        <p>
          Les expériences actuelles sont des modèles pédagogiques réduits. Le laboratoire de
          probabilités ne contient aucun réseau entraîné. Le laboratoire BPE emploie des caractères,
          pas des octets. Ces limites sont affichées au lieu de présenter une animation comme un
          calcul scientifique.
        </p>
        <a href="https://github.com/darksathili-jpg/llm-academy/tree/refonte/atelier-v2/docs">
          Documentation, roadmap et protocoles de test →
        </a>
      </section>
    </article>
  );
}

export default function App() {
  const [route, setRoute] = useState(readRoute),
    main = useRef<HTMLElement>(null),
    navigated = useRef(false);
  const { progress, warning, update } = useProgress();
  const [offlineMessage, setOfflineMessage] = useState(''),
    [online, setOnline] = useState(navigator.onLine);
  const [kind, id] = route.split('/'),
    projected = kind === 'projection' || kind === 'animation';
  useEffect(() => {
    document.documentElement.dataset.theme = projected ? 'projector' : progress.theme;
  }, [progress.theme, projected]);
  useEffect(() => {
    const changed = () => {
      if (location.hash.startsWith('#/')) {
        setRoute(readRoute());
        requestAnimationFrame(() => {
          const section = new URLSearchParams(location.hash.split('?')[1] ?? '').get('section');
          if (section) document.getElementById(section)?.scrollIntoView();
        });
      }
    };
    addEventListener('hashchange', changed);
    return () => removeEventListener('hashchange', changed);
  }, []);
  useEffect(() => {
    document.title = 'LLM / ' + (kind === 'home' ? 'Atelier des machines à langage' : kind);
    if (navigated.current) main.current?.focus();
    navigated.current = true;
    const section = new URLSearchParams(location.hash.split('?')[1] ?? '').get('section');
    if (section) document.getElementById(section)?.scrollIntoView();
    else scrollTo(0, 0);
  }, [route, kind]);
  useEffect(() => {
    const refresh = () => setOnline(navigator.onLine);
    addEventListener('online', refresh);
    addEventListener('offline', refresh);
    return () => {
      removeEventListener('online', refresh);
      removeEventListener('offline', refresh);
    };
  }, []);
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
    let disposed = false;
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + 'sw.js', { scope: import.meta.env.BASE_URL })
      .then((reg) => {
        if (disposed) return;
        setOfflineMessage(
          navigator.serviceWorker.controller
            ? 'Ressources locales disponibles hors ligne.'
            : 'Préparation du cache hors ligne…',
        );
        function observe(worker: ServiceWorker | null) {
          worker?.addEventListener('statechange', () => {
            if (disposed) return;
            if (worker.state === 'activated')
              setOfflineMessage('Ressources locales disponibles hors ligne.');
            if (worker.state === 'installed')
              setOfflineMessage(
                reg.waiting
                  ? 'Une mise à jour sera appliquée après fermeture des onglets.'
                  : 'Cache installé. Prochaine visite disponible hors ligne.',
              );
            if (worker.state === 'redundant' && !navigator.serviceWorker.controller)
              setOfflineMessage(
                'Cache indisponible : rechargez avec une connexion pour réessayer.',
              );
          });
        }
        observe(reg.installing);
        reg.addEventListener('updatefound', () => observe(reg.installing));
      })
      .catch(() => {
        if (!disposed) setOfflineMessage('Cache indisponible : le site nécessite une connexion.');
      });
    return () => {
      disposed = true;
    };
  }, []);

  if (kind === 'coulisses') return <Backstage />;
  if (projected && ['60', '120', '180', '360'].includes(id))
    return (
      <div className="academy-v2 console-shell">
        <a className="skip-link" href="#main">
          Aller au contenu
        </a>
        <Animation key={route} duration={Number(id)} projection={kind === 'projection'} />
        <p className="network-status" role="status">
          {online ? 'Réseau connecté' : 'Hors ligne'} · {offlineMessage}
        </p>
      </div>
    );
  let content;
  if (kind === 'home') content = <Home />;
  else if (kind === 'decouvrir') content = <FirstSteps />;
  else if (kind === 'atelier') content = <Workshop />;
  else if (kind === 'enseignant') content = <TeacherGuide />;
  else if (kind === 'seance' || kind === 'fiche')
    content = (
      <TeacherSequencePage
        key={route}
        id={id}
        audience={kind === 'fiche' ? 'student' : 'teacher'}
      />
    );
  else if (kind === 'activite') content = <Activity key={id} id={id} />;
  else if (kind === 'studio' && (!id || ['60', '120', '180', '360'].includes(id)))
    content = <Studio duration={id ? Number(id) : undefined} />;
  else if (kind === 'laboratoire' || kind === 'experience')
    content = <Laboratory key={id ?? kind} id={id} />;
  else if (kind === 'bibliotheque') content = <Library />;
  else if (kind === 'carnet') content = <Notebook />;
  else if (kind === 'references') content = <References />;
  else if (kind === 'module' && isModuleId(id))
    content = <ModulePage key={id} module={modules.find((m) => m.id === id)!} />;
  else
    content = (
      <article>
        <h1>Cette page n’existe pas</h1>
        <a href="#/">Revenir à l’atelier</a>
      </article>
    );
  return (
    <div className="academy-v2">
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <header className="academy-header">
        <a
          className="editorial-brand"
          href="#/"
          aria-label="Accueil de LLM Academy — Lycée Watteau, Valenciennes"
        >
          <img
            className="academy-logo"
            src={import.meta.env.BASE_URL + 'llm-academy-watteau.webp'}
            alt=""
            width="160"
            height="160"
            decoding="async"
          />
          <span className="academy-wordmark">
            <strong>LLM Academy</strong>
            <span>Lycée Watteau · Valenciennes</span>
          </span>
        </a>
        <span className="brand-caption">COMPRENDRE · EXPÉRIMENTER · VÉRIFIER</span>
        <a href="#/carnet">Carnet d’apprentissage</a>
      </header>
      <div className="academy-navigation">
        <nav aria-label="Navigation principale">
          {[
            ['decouvrir', 'Commencer'],
            ['atelier', '01 Atelier NSI'],
            ['studio', '02 Studio formateur'],
            ['enseignant', 'Dossier enseignant'],
            ['laboratoire', '03 Laboratoire'],
            ['bibliotheque', 'Modules approfondis'],
          ].map(([r, label]) => (
            <a key={r} href={'#/' + r} aria-current={kind === r ? 'page' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <fieldset className="theme-switch">
          <legend className="sr-only">Mode d’affichage</legend>
          {(
            [
              ['light', 'Clair'],
              ['dark', 'Sombre'],
              ['projector', 'Projection'],
            ] as [Theme, string][]
          ).map(([theme, label]) => (
            <label key={theme} className={progress.theme === theme ? 'active' : ''}>
              <input
                type="radio"
                name="theme"
                checked={progress.theme === theme}
                onChange={() => update((p) => ({ ...p, theme }))}
              />
              {label}
            </label>
          ))}
        </fieldset>
      </div>
      {warning && (
        <div className="storage-warning" role="alert">
          {warning}
        </div>
      )}
      <main id="main" ref={main} tabIndex={-1} className="academy-content">
        {content}
      </main>
      <footer className="academy-footer">
        <span>LLM / comprendre en expérimentant</span>
        <span role="status">
          {online ? 'Réseau connecté' : 'Hors ligne'} · {offlineMessage}
        </span>
        <span className="mini-progress">
          Calculs vérifiés{' '}
          <strong>
            {modules.reduce((s, m) => s + moduleScore(progress, m.id).correct, 0)} /{' '}
            {exercises.length}
          </strong>
        </span>
        <a href="#/references">Sources & limites</a>
      </footer>
    </div>
  );
}
