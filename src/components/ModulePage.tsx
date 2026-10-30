import { LabBoundary } from './LabBoundary';
import type { ComponentType } from 'react';
import type { ModuleId } from '../core/exercises';
import { useState, lazy, Suspense } from 'react';
import { modules, type Module } from '../content/modules';
import { moduleScore } from '../core/progress';
import { useProgress } from './ProgressProvider';
import { Exercises } from './Exercises';
import { ProbabilityLab } from './ProbabilityLab';
import { BpeLab } from './BpeLab';

const ModelLab = lazy(() => import('./science/ModelLab').then((m) => ({ default: m.ModelLab })));
const TrainingLab = lazy(() =>
  import('./science/TrainingLab').then((m) => ({ default: m.TrainingLab })),
);
const GenerationLab = lazy(() =>
  import('./science/GenerationLab').then((m) => ({ default: m.GenerationLab })),
);
const EmbeddingLab = lazy(() =>
  import('./science/EmbeddingLab').then((m) => ({ default: m.EmbeddingLab })),
);
const MathLab = lazy(() => import('./science/MathLab').then((m) => ({ default: m.MathLab })));
const AttentionLab = lazy(() =>
  import('./science/AttentionLab').then((m) => ({ default: m.AttentionLab })),
);
const TransformerLab = lazy(() =>
  import('./science/TransformerLab').then((m) => ({ default: m.TransformerLab })),
);

const laboratories: Record<ModuleId, ComponentType> = {
  '01': ProbabilityLab,
  '02': BpeLab,
  '03': EmbeddingLab,
  '04': MathLab,
  '05': AttentionLab,
  '06': TransformerLab,
  '07': ModelLab,
  '08': TrainingLab,
  '09': GenerationLab,
};
function Diagnostic({ module }: { module: Module }) {
  const [answer, setAnswer] = useState<number | null>(null);
  return (
    <details className="diagnostic">
      <summary>Vérifier mes prérequis · diagnostic sans note</summary>
      <p>{module.prerequisite}</p>
      <fieldset>
        <legend>{module.diagnostic.question}</legend>
        {module.diagnostic.choices.map((choice, i) => (
          <label className="radio" key={choice}>
            <input
              type="radio"
              name="diagnostic"
              checked={answer === i}
              onChange={() => setAnswer(i)}
            />
            {choice}
          </label>
        ))}
      </fieldset>
      {answer !== null && (
        <p role="status">
          <strong>
            {answer === module.diagnostic.expected
              ? 'Prérequis prêt. '
              : 'Prenez un moment pour revoir ce calcul. '}
          </strong>
          {module.diagnostic.feedback}
        </p>
      )}
    </details>
  );
}
export function ModulePage({ module }: { module: Module }) {
  const { progress, update } = useProgress();
  const score = moduleScore(progress, module.id);
  const Lab = laboratories[module.id];
  const nextModule = modules[modules.findIndex((m) => m.id === module.id) + 1];
  return (
    <article className="module-page">
      <header className="page-heading">
        <span className="eyebrow">
          Module {module.id} /{' '}
          {Number(module.id) >= 7 ? 'Construction et entraînement' : 'Fondations'} ·{' '}
          {module.duration}
        </span>
        <h1>{module.title}</h1>
        <p className="lead">{module.subtitle}</p>
        <p className="progress-label">
          {score.correct} / {score.total} exercices validés ·{' '}
          {score.correct === score.total
            ? 'Exercices vérifiés ; raisonnement à relire'
            : 'Parcours en cours'}
        </p>
      </header>
      <nav className="section-nav" aria-label="Étapes du module">
        <a href={'#/module/' + module.id + '?section=objectifs'}>Comprendre</a>
        <a href={'#/module/' + module.id + '?section=experience'}>Expérimenter</a>
        <a href={'#/module/' + module.id + '?section=evaluation'}>Évaluer</a>
        <a href={'#/module/' + module.id + '?section=transfert'}>Expliquer</a>
      </nav>
      <section className="problem">
        <span className="eyebrow">Situation-problème</span>
        <h2>Une question à résoudre</h2>
        <p>{module.problem}</p>
      </section>
      <section id="objectifs">
        <h2>Ce que vous saurez faire</h2>
        <ul className="objectives">
          {module.objectives.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <Diagnostic module={module} />
      </section>
      <section className="course">
        <h2>Comprendre le mécanisme</h2>
        {module.sections.map((s) => (
          <section className="lesson-section" key={s.title}>
            <h3>{s.title}</h3>
            {s.formula && <p className="formula">{s.formula}</p>}
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </section>
        ))}
      </section>
      <section id="experience">
        <h2>Prédire, puis expérimenter</h2>
        <p className="hypothesis">{module.hypothesis}</p>
        <LabBoundary>
          <Suspense fallback={<p role="status">Ouverture du laboratoire…</p>}>
            <Lab />
          </Suspense>
        </LabBoundary>
        {progress.track === 'developer' && (
          <details className="technical">
            <summary>Lecture développeur : moteur et invariants</summary>
            <p>
              {module.developerNote ??
                (module.id === '01'
                  ? 'Le moteur est une fonction pure : elle refuse les logits non finis et les cibles hors bornes. L’invariant est Σp = 1 à la précision numérique près. La perte est calculée par log-sum-exp, sans logarithme d’une probabilité arrondie.'
                  : 'Pseudocode : découper le corpus → compter les mots → créer l’alphabet → compter les paires pondérées → sélectionner un maximum déterministe → fusionner sans chevauchement → recommencer. L’encodage rejoue les règles dans l’ordre. Chaque état possède ses propres tableaux : revenir en arrière ne modifie aucun état précédent.')}
            </p>
            <a href="https://github.com/darksathili-jpg/llm-academy/tree/main/src/core">
              Lire les moteurs TypeScript et leurs tests dans le dépôt
            </a>
          </details>
        )}
      </section>
      <section id="evaluation">
        <h2>Mettre vos idées à l’épreuve</h2>
        <p>
          Chaque réponse est vérifiée avec un corrigé explicite. Vous pouvez recommencer ; la
          dernière réponse soumise détermine votre progression.
        </p>
        <Exercises module={module.id} />
      </section>
      <section id="transfert">
        <h2>Expliquer et transférer</h2>
        <p>{module.transfer}</p>
        <label>
          Votre réponse et vos observations
          <textarea
            rows={6}
            maxLength={10000}
            value={progress.notes[module.id]}
            onChange={(e) =>
              update((p) => ({ ...p, notes: { ...p.notes, [module.id]: e.target.value } }))
            }
          />
        </label>
        <p className="muted">
          Sauvegarde locale automatique si le stockage est disponible. Texte libre à relire : aucune
          validation sémantique automatique.
        </p>
        <details>
          <summary>Grille de relecture · justification scientifique</summary>
          <ul>
            {module.rubric.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p>
            Comparez votre explication à ces critères, puis échangez avec un enseignant ou un pair.
            Cette activité ne produit pas une certification.
          </p>
        </details>
      </section>
      <section className="synthesis">
        <h2>À retenir</h2>
        <ul>
          {module.summary.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Pour aller à la source</h2>
        <ul className="references">
          {module.references.map((r) => (
            <li key={r.url}>
              <a href={r.url}>{r.title}</a>
              <span>{r.reason}</span>
            </li>
          ))}
        </ul>
      </section>
      <a className="button" href={nextModule ? '#/module/' + nextModule.id : '#/carnet'}>
        {nextModule
          ? nextModule.id === '02'
            ? 'Continuer vers la tokenisation →'
            : 'Continuer vers ' + nextModule.title + ' →'
          : 'Retrouver mon carnet →'}
      </a>
    </article>
  );
}
