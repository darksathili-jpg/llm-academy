import { exercises, isModuleId, type ModuleId } from './core/exercises';
import { useEffect, useRef, useState } from 'react';
import { modules, upcoming } from './content/modules';
import { moduleScore, type Theme } from './core/progress';
import { useProgress } from './components/ProgressProvider';
import { ModulePage } from './components/ModulePage';
import { Notebook } from './components/Notebook';
type Route = ModuleId | 'home' | 'carnet' | 'references' | 'missing';
function readRoute(): Route {
  const hash = window.location.hash.split('?')[0];
  if (!hash || hash === '#/' || hash === '#') return 'home';
  const moduleId = hash?.split('/')[2] ?? '';
  if (hash?.startsWith('#/module/') && isModuleId(moduleId)) return moduleId;
  if (hash === '#/carnet') return 'carnet';
  if (hash === '#/references') return 'references';
  return 'missing';
}
function ProcessDiagram() {
  return (
    <div
      className="process-diagram"
      aria-label="Le texte est découpé en tokens, puis transformé en une distribution de continuations. Illustration conceptuelle, pas un calcul de Transformer."
    >
      <div className="diagram-label">UNE QUESTION, DES MÉCANISMES</div>
      <div className="diagram-text">« Comment apprend une machine ? »</div>
      <div className="diagram-arrow">↓ découper</div>
      <div className="diagram-tokens">
        <span>Comment</span>
        <span>apprend</span>
        <span>une</span>
        <span>machine</span>
        <span>?</span>
      </div>
      <div className="diagram-arrow">↓ représenter & transformer</div>
      <div className="matrix-art" aria-hidden="true">
        {Array.from({ length: 48 }, (_, i) => (
          <i key={i} className={'cell-' + ((i * 7) % 5)} />
        ))}
      </div>
      <div className="diagram-arrow">↓ prédire</div>
      <div className="diagram-output">
        <span>un prochain token</span>
        <span>p(token | contexte)</span>
      </div>
      <small>Schéma conceptuel · les calculs sont dans les laboratoires</small>
    </div>
  );
}
function Home() {
  const { progress, update } = useProgress();
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">
            <span className="live-dot" /> L’atelier francophone des modèles de langage
          </span>
          <h1>
            Comprendre.
            <br />
            Expérimenter.
            <br />
            <em>Construire.</em>
          </h1>
          <p className="lead">
            Ouvrez la boîte noire des LLM. Des premières probabilités aux applications fiables,
            apprenez en manipulant les mécanismes.
          </p>
          <a className="button" href="#/module/01">
            Entrer dans le premier module <span>↗</span>
          </a>
          <p className="hero-note">Sans compte · calculs locaux · progression personnelle</p>
        </div>
        <ProcessDiagram />
      </section>
      <section className="learning-path">
        <div>
          <span className="eyebrow">Votre façon d’explorer</span>
          <h2>Un socle commun, deux chemins</h2>
          <p>Les mêmes compétences, avec un accès adapté à votre expérience.</p>
        </div>
        <fieldset className="track-options">
          <legend className="sr-only">Choisir mon parcours</legend>
          <label className={progress.track === 'discovery' ? 'track selected' : 'track'}>
            <input
              type="radio"
              name="track"
              checked={progress.track === 'discovery'}
              onChange={() => update((p) => ({ ...p, track: 'discovery' }))}
            />
            <strong>Découverte guidée</strong>
            <span>Prédire, manipuler, puis expliquer.</span>
          </label>
          <label className={progress.track === 'developer' ? 'track selected' : 'track'}>
            <input
              type="radio"
              name="track"
              checked={progress.track === 'developer'}
              onChange={() => update((p) => ({ ...p, track: 'developer' }))}
            />
            <strong>Parcours développeur</strong>
            <span>Explorer aussi les moteurs et invariants.</span>
          </label>
        </fieldset>
      </section>
      <section className="available">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Le parcours / livraison 03</span>
            <h2>Des fondations à l’entraînement</h2>
          </div>
          <span className="tag">{modules.length} modules disponibles / 12 prévus</span>
        </div>
        <div className="module-cards">
          {modules.map((m) => {
            const s = moduleScore(progress, m.id);
            return (
              <a className="module-card" key={m.id} href={'#/module/' + m.id}>
                <span className="module-number">{m.id}</span>
                <div>
                  <span className="eyebrow">{Number(m.id)>=7 ? "Construction et entraînement" : "Fondations"} · disponible</span>
                  <h3>{m.title}</h3>
                  <p>{m.subtitle}</p>
                  <span className="module-meta">
                    {s.correct}/{s.total} exercices validés <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
      <section className="experiments">
        <span className="eyebrow">L’expérimentation au centre</span>
        <h2>Une hypothèse. Un calcul. Une observation.</h2>
        <div className="experiment-links">
          <a href="#/module/01">
            <span className="lab-index">EX / 01</span>
            <h3>Probabilités</h3>
            <p>Modifiez des logits. Comparez une distribution et la perte d’une cible.</p>
            <span>Ouvrir le module et son laboratoire →</span>
          </a>
          <a href="#/module/02">
            <span className="lab-index">EX / 02</span>
            <h3>Token Lab</h3>
            <p>Comptez les paires. Apprenez un vocabulaire, fusion après fusion.</p>
            <span>Ouvrir le module et son laboratoire →</span>
          </a>
          <a href="#/module/03?section=experience">
            <span className="lab-index">EX / 03</span>
            <h3>Embedding Explorer</h3>
            <p>Manipulez les coordonnées et comparez une projection à la géométrie réelle.</p>
            <span>Ouvrir le laboratoire →</span>
          </a>
          <a href="#/module/04?section=experience">
            <span className="lab-index">EX / 04</span>
            <h3>Math Lab</h3>
            <p>Calculez un produit matriciel et suivez une descente de gradient mesurée.</p>
            <span>Ouvrir le laboratoire →</span>
          </a>
          <a href="#/module/05?section=experience">
            <span className="lab-index">EX / 05</span>
            <h3>Attention Studio</h3>
            <p>Modifiez Q, K et V. Observez le masque et les sorties par tête.</p>
            <span>Ouvrir le laboratoire →</span>
          </a>
          <a href="#/module/06?section=experience">
            <span className="lab-index">EX / 06</span>
            <h3>Transformer Explorer</h3>
            <p>Suivez les formes et les valeurs d’un passage avant complet.</p>
            <span>Ouvrir le laboratoire →</span>
          </a>
<a href="#/module/07?section=experience"><span className="lab-index">EX / 07</span><h3>Mini-model Builder</h3><p>Décalez les cibles puis tracez une génération autorégressive.</p><span>Ouvrir le laboratoire →</span></a>
<a href="#/module/08?section=experience"><span className="lab-index">EX / 08</span><h3>Training Lab</h3><p>Entraînez de vrais poids et comparez deux pertes mesurées.</p><span>Ouvrir le laboratoire →</span></a>
<a href="#/module/09?section=experience"><span className="lab-index">EX / 09</span><h3>Generation & Adaptation</h3><p>Filtrez une distribution, puis adaptez des poids avec LoRA.</p><span>Ouvrir le laboratoire →</span></a>
        </div>
      </section>
      <section className="future">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Le programme complet</span>
            <h2>La suite du parcours</h2>
          </div>
          <span className="tag">En préparation · aucun cours accessible</span>
        </div>
        <ol start={modules.length+1}>
          {upcoming.map((title, i) => (
            <li key={title}>
              <span>{String(i + modules.length + 1).padStart(2, '0')}</span>
              <strong>{title}</strong>
              <small>À venir</small>
            </li>
          ))}
        </ol>
        <p>
          Nous publions des expériences vérifiées, module par module. Les éléments annoncés ne
          contribuent pas à votre progression.
        </p>
      </section>
    </>
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
        <h2>Références des premiers modules</h2>
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
        <a href="https://github.com/darksathili-jpg/llm-academy/tree/main/docs">
          Documentation, roadmap et protocoles de test →
        </a>
      </section>
    </article>
  );
}
export default function App() {
  const [route, setRoute] = useState<Route>(readRoute);
  const main = useRef<HTMLElement>(null);
  const hasNavigated = useRef(false);
  const { progress, warning, update } = useProgress();
  const [offlineMessage, setOfflineMessage] = useState('');
  useEffect(() => {
    function changed() {
      if (location.hash.startsWith('#/')) {
        setRoute(readRoute());
        requestAnimationFrame(() => {
          const id = new URLSearchParams(location.hash.split('?')[1] ?? '').get('section');
          if (id) document.getElementById(id)?.scrollIntoView();
        });
      }
    }
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = progress.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', progress.theme === 'dark' ? '#152021' : '#f5f3ec');
  }, [progress.theme]);
  useEffect(() => {
    document.title =
      (isModuleId(route)
        ? modules.find((m) => m.id === route)!.title
        : route === 'carnet'
          ? 'Carnet'
          : route === 'references'
            ? 'Références'
            : 'Comprendre en expérimentant') + ' — LLM Academy';
    if (hasNavigated.current) main.current?.focus();
    hasNavigated.current = true;
    const id = new URLSearchParams(location.hash.split('?')[1] ?? '').get('section');
    if (id) document.getElementById(id)?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [route]);
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
  const active = (r: Route) => (route === r ? 'page' : undefined);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <aside className="sidebar">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden="true">
            L<span>∴</span>
          </span>
          <span>
            LLM<span>ACADEMY</span>
          </span>
        </a>
        <p className="sidebar-kicker">LE LABORATOIRE D’APPRENTISSAGE</p>
        <nav aria-label="Navigation principale">
          <a aria-current={active('home')} href="#/">
            <span aria-hidden="true">⌂</span>Vue d’ensemble
          </a>
          <span className="nav-label">LE PARCOURS</span>
          {modules.map((module) => (
            <a key={module.id} aria-current={active(module.id)} href={'#/module/' + module.id}>
              <span>{module.id}</span>
              {module.title}
            </a>
          ))}
          <span className="nav-label">MES RESSOURCES</span>
          <a aria-current={active('carnet')} href="#/carnet">
            <span aria-hidden="true">▤</span>Carnet d’apprentissage
          </a>
          <a aria-current={active('references')} href="#/references">
            <span aria-hidden="true">↗</span>Méthode & références
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-progress">
            <span>MES COMPÉTENCES ÉVALUÉES</span>
            <strong>
              {modules.reduce((sum, m) => sum + moduleScore(progress, m.id).correct, 0)} /{' '}
              {exercises.length}
            </strong>
          </div>
          <p>
            Lire ne suffit pas.
            <br />
            Faites l’expérience.
          </p>
          <a href="https://github.com/darksathili-jpg/llm-academy">Le projet sur GitHub ↗</a>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span>
            LLM ACADEMY <span className="topbar-divider">/</span>{' '}
            {isModuleId(route) ? 'MODULE ' + route : route === 'carnet' ? 'CARNET' : 'EXPLORATION'}
          </span>
          <fieldset className="theme-switch">
            <legend className="sr-only">Mode d’affichage</legend>
            {(
              [
                ['light', 'Clair'],
                ['dark', 'Sombre'],
                ['projector', 'Projection'],
              ] as [Theme, string][]
            ).map(([theme, label]) => (
              <label className={progress.theme === theme ? 'active' : ''} key={theme}>
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
        </header>
        {warning && (
          <div className="storage-warning" role="alert">
            {warning}
          </div>
        )}
        <main id="main" ref={main} tabIndex={-1}>
          {route === 'home' ? (
            <Home />
          ) : route === 'carnet' ? (
            <Notebook />
          ) : route === 'references' ? (
            <References />
          ) : isModuleId(route) ? (
            <ModulePage key={route} module={modules.find((m) => m.id === route)!} />
          ) : (
            <article>
              <h1>Cette page n’existe pas</h1>
              <a href="#/">Revenir au parcours</a>
            </article>
          )}
        </main>
        <footer>
          <span>LLM Academy · comprendre en expérimentant</span>
          <span role="status">{offlineMessage}</span>
          <a href="#/references">Sources & limites</a>
        </footer>
      </div>
    </div>
  );
}
