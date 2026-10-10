import { LabBoundary } from '../LabBoundary';
import { IntuitiveTraining, IntuitiveTransformer } from './IntuitiveModels';
import { useState, lazy, Suspense } from 'react';
import { filteredDistribution, seededRandom, sample } from '../../core/generation';
import { scaledAttention } from '../../core/attention';
import { cosine } from '../../core/linear';
import { chunkDocuments, retrieve } from '../../core/rag';
import { cases, localDocuments } from '../../content/cases';
import type { ExperimentId } from '../../content/activities';
import { SimpleTokens } from './SimpleTokens';
import { BpeLab } from '../BpeLab';
const AttentionLab = lazy(() =>
  import('../science/AttentionLab').then((m) => ({ default: m.AttentionLab })),
);
const GenerationLab = lazy(() =>
  import('../science/GenerationLab').then((m) => ({ default: m.GenerationLab })),
);
const TrainingLab = lazy(() =>
  import('../science/TrainingLab').then((m) => ({ default: m.TrainingLab })),
);
const EmbeddingLab = lazy(() =>
  import('../science/EmbeddingLab').then((m) => ({ default: m.EmbeddingLab })),
);
const TransformerLab = lazy(() =>
  import('../science/TransformerLab').then((m) => ({ default: m.TransformerLab })),
);
export const instruments: { id: ExperimentId; title: string; summary: string }[] = [
  {
    id: 'prediction',
    title: 'La machine qui prédit',
    summary: 'Choisir un mot pour compléter une phrase ; comparer ses chances.',
  },
  {
    id: 'tokenizer',
    title: 'Découper un texte en morceaux',
    summary: 'Découper un texte en morceaux, puis regrouper ceux qui reviennent ensemble.',
  },
  {
    id: 'generation',
    title: 'Comparer les générations',
    summary: 'Comparer des choix répétés et limiter les mots autorisés.',
  },
  {
    id: 'attention',
    title: 'Voir l’attention',
    summary: 'Voir quels morceaux précédents peuvent être utilisés pour calculer la suite.',
  },
  {
    id: 'training',
    title: 'Faire apprendre un mini-modèle',
    summary: 'Faire des essais d’apprentissage, puis vérifier les erreurs sur d’autres exemples.',
  },
  {
    id: 'detective',
    title: 'Vérifier une réponse',
    summary: 'Comparer des phrases avec leur source : confirmé, contredit ou impossible à savoir.',
  },
  {
    id: 'prompting',
    title: 'Donner une consigne claire',
    summary: 'Comparer deux réponses préparées et vérifier si elles suivent une consigne.',
  },
  {
    id: 'rag',
    title: 'Retrouver des informations dans des documents',
    summary: 'Retrouver un passage dans des documents et lire sa source.',
  },
  {
    id: 'embeddings',
    title: 'Représenter et comparer',
    summary: 'Décrire une information avec des nombres et voir ce qu’un dessin peut cacher.',
  },
  {
    id: 'transformer',
    title: 'Ouvrir un Transformer',
    summary: 'Suivre les étapes de calcul d’un modèle miniature.',
  },
];
export function ProbabilityBars({
  probabilities,
  labels,
}: {
  probabilities: number[];
  labels: string[];
}) {
  return (
    <div className="measure-bars" aria-label="Probabilités calculées">
      {probabilities.map((p, i) => (
        <div className="measure-row" key={labels[i]}>
          <span>{labels[i]}</span>
          <div className="measure-track" aria-hidden="true">
            <div style={{ width: p * 100 + '%' }} />
          </div>
          <output>{(p * 100).toFixed(1)} %</output>
        </div>
      ))}
    </div>
  );
}
interface PredictionSettings {
  context: number;
  temperature: number;
  seed: number;
  topK: number;
  topP: number;
}
const initial: PredictionSettings = { context: 0, temperature: 1, seed: 7, topK: 0, topP: 1 };
export function PredictionLab({
  generation = false,
  compact = false,
}: {
  generation?: boolean;
  compact?: boolean;
}) {
  const key = 'llm-academy.instrument.' + (generation ? 'generation' : 'prediction');
  const [settings, setSettings] = useState<PredictionSettings>(() => {
    try {
      const x = JSON.parse(localStorage.getItem(key) ?? 'null') as PredictionSettings;
      if (
        x &&
        [0, 1].includes(x.context) &&
        Number.isFinite(x.temperature) &&
        x.temperature >= 0.1 &&
        x.temperature <= 3 &&
        Number.isInteger(x.seed) &&
        x.seed >= 0 &&
        x.seed <= 4294967295 &&
        [0, 1, 2, 3].includes(x.topK) &&
        Number.isFinite(x.topP) &&
        x.topP >= 0.1 &&
        x.topP <= 1
      )
        return {
          context: x.context,
          temperature: x.temperature,
          seed: x.seed,
          topK: x.topK,
          topP: x.topP,
        };
    } catch {
      /* defaults */
    }
    return initial;
  });
  const [draws, setDraws] = useState<number[]>([]),
    [warning, setWarning] = useState('');
  const change = (patch: Partial<PredictionSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    setDraws([]);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setWarning('');
    } catch {
      setWarning('Paramètres en mémoire seulement : stockage indisponible.');
    }
  };
  const labels = ['lune', 'porte', 'mer'],
    logits = settings.context === 0 ? [2, 1, 0] : [0, 1, 2];
  const { probabilities } = filteredDistribution(logits, {
    temperature: settings.temperature,
    topK: generation ? settings.topK : 0,
    topP: generation ? settings.topP : 1,
  });
  return (
    <section
      className="instrument"
      aria-label={generation ? 'Génération reproductible' : 'Prédiction illustrée'}
    >
      <div className="eyebrow">SCORES INVENTÉS / PROBABILITÉS CALCULÉES</div>
      {!compact && (
        <label>
          Début de phrase
          <select
            value={settings.context}
            onChange={(e) => change({ context: Number(e.target.value) })}
          >
            <option value={0}>Le chat observe…</option>
            <option value={1}>Le marin observe…</option>
          </select>
        </label>
      )}
      <h2>{settings.context === 0 ? 'Le chat observe…' : 'Le marin observe…'}</h2>
      <label>
        Température : {settings.temperature.toFixed(1)}
        <input
          type="range"
          min=".1"
          max="3"
          step=".1"
          value={settings.temperature}
          onChange={(e) => change({ temperature: Number(e.target.value) })}
        />
      </label>
      {generation && (
        <div className="lab-toolbar">
          <label>
            Top-k
            <select
              value={settings.topK}
              onChange={(e) => change({ topK: Number(e.target.value) })}
            >
              {[0, 1, 2, 3].map((k) => (
                <option key={k} value={k}>
                  {k || 'Désactivé'}
                </option>
              ))}
            </select>
          </label>
          <label>
            Top-p : {settings.topP.toFixed(1)}
            <input
              type="range"
              min=".1"
              max="1"
              step=".1"
              value={settings.topP}
              onChange={(e) => change({ topP: Number(e.target.value) })}
            />
          </label>
          <label>
            Graine
            <input
              type="number"
              min="0"
              max="4294967295"
              value={settings.seed}
              onChange={(e) => {
                const seed = Number(e.target.value);
                if (Number.isInteger(seed) && seed >= 0 && seed <= 4294967295) change({ seed });
              }}
            />
          </label>
        </div>
      )}
      <ProbabilityBars probabilities={probabilities} labels={labels} />
      {generation && (
        <>
          <button
            onClick={() => {
              const r = seededRandom(settings.seed);
              setDraws(Array.from({ length: 20 }, () => sample(probabilities, r())));
            }}
          >
            Effectuer 20 tirages
          </button>
          <p className="sample-sequence" data-testid="sample-sequence">
            {draws.map((i) => labels[i]).join(' · ') || 'La trace des tirages apparaîtra ici.'}
          </p>
          <p>{labels.map((t, i) => t + ' : ' + draws.filter((x) => x === i).length).join(' / ')}</p>
        </>
      )}
      <p className="muted">
        {compact
          ? 'Une suite probable ne constitue pas une preuve.'
          : 'Les préférences de cet exemple sont préparées, pas apprises par une IA. La température rend les choix plus ou moins variés ; elle ne vérifie pas la vérité. On répète ici un seul choix de mot : on ne construit pas une phrase entière.'}
      </p>
      {warning && <p role="status">{warning}</p>}
    </section>
  );
}
export function IntuitiveAttention() {
  const [row, setRow] = useState(1),
    [causal, setCausal] = useState(true),
    [calculated, setCalculated] = useState(false);
  const q = [
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    v = [
      [1, 0],
      [0, 2],
      [3, 1],
    ];
  const result = scaledAttention(q, q, v, causal);
  return (
    <section className="instrument">
      <h2>Quelles positions sont accessibles ?</h2>
      <p>
        Choisis le mot « chat ». La case « Masque causal » empêche d’utiliser le mot situé après
        lui. Clique sur « Calculer les poids » pour voir la part attribuée à chaque mot.
      </p>
      <label>
        Position consultée
        <select
          value={row}
          onChange={(e) => {
            setRow(Number(e.target.value));
            setCalculated(false);
          }}
        >
          {['Le', 'chat', 'observe'].map((t, i) => (
            <option key={t} value={i}>
              {i + 1} — {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={causal}
          onChange={(e) => {
            setCausal(e.target.checked);
            setCalculated(false);
          }}
        />{' '}
        Masque causal
      </label>
      <button onClick={() => setCalculated(true)}>Calculer les poids</button>
      {calculated && (
        <>
          <ProbabilityBars
            probabilities={result.weights[row]}
            labels={['1 · Le', '2 · chat', '3 · observe']}
          />
          <p>Positions futures : {causal ? 'interdites (poids exactement nul)' : 'autorisées'}.</p>
          <details>
            <summary>Voir les nombres du calcul</summary>
            <p>
              Q, K et V sont inventés. Sortie pondérée : [
              {result.output[row].map((x) => x.toFixed(3)).join(', ')}].
            </p>
          </details>
        </>
      )}
      <p className="muted">
        Ces nombres décrivent ce petit calcul ; ils ne montrent pas une pensée humaine.
      </p>
    </section>
  );
}
function IntuitiveVectors() {
  const [projected, setProjected] = useState(false);
  const a = projected ? [1, 0] : [1, 0, 2],
    b = projected ? [1, 0] : [1, 0, -2];
  return (
    <section className="instrument">
      <h2>La dimension qui change tout</h2>
      <p>
        Vecteurs inventés : A = [1, 0, 2], B = [1, 0, −2]. Que perd-on en cachant la troisième
        dimension ?
      </p>
      <label>
        <input
          type="checkbox"
          checked={projected}
          onChange={(e) => setProjected(e.target.checked)}
        />{' '}
        Montrer seulement le plan XY
      </label>
      <p className="measurement">
        Cosinus : <output>{cosine(a, b)?.toFixed(2)}</output>
      </p>
      <p>
        {projected
          ? 'Ils paraissent identiques dans cette projection.'
          : 'Leurs orientations complètes sont très différentes.'}{' '}
        Une projection peut masquer une différence.
      </p>
    </section>
  );
}
export function DetectiveLab() {
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState<string[]>([]),
    [evidence, setEvidence] = useState<string[]>([]),
    [revealed, setRevealed] = useState(false);
  const c = cases[index];
  return (
    <section className="instrument">
      <h2>Comparer une réponse avec un texte</h2>
      <p>
        Lis le texte, puis vérifie chacune des trois phrases. « Étayé » signifie confirmé par le
        texte ; « contredit », que le texte dit le contraire ; « insuffisant », qu’on ne peut pas
        savoir.
      </p>
      <label>
        Discipline
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setAnswers([]);
            setEvidence([]);
            setRevealed(false);
          }}
        >
          {cases.map((c, i) => (
            <option key={c.discipline} value={i}>
              {c.discipline}
            </option>
          ))}
        </select>
      </label>
      <blockquote>{c.source}</blockquote>
      {c.claims.map((claim, i) => (
        <div className="claim-row" key={claim.text}>
          <p>
            {i + 1}. {claim.text}
          </p>
          <label>
            Classement de l’affirmation {i + 1}
            <select
              value={answers[i] ?? ''}
              onChange={(e) => {
                setAnswers((a) => Object.assign([...a], { [i]: e.target.value }));
                setRevealed(false);
              }}
            >
              <option value="">À examiner</option>
              {['étayé', 'contredit', 'insuffisant'].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Preuve pour l’affirmation {i + 1}
            <select
              value={evidence[i] ?? ''}
              onChange={(e) => {
                setEvidence((a) => Object.assign([...a], { [i]: e.target.value }));
                setRevealed(false);
              }}
            >
              <option value="">Choisir</option>
              {['S1', 'S2', 'S1+S2', 'aucune'].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          {revealed && (
            <p className="feedback">
              {answers[i] === claim.verdict && evidence[i] === claim.evidence
                ? 'Classement et référence validés.'
                : 'À reprendre.'}{' '}
              {claim.verdict} — {claim.evidence} : {claim.reason}
            </p>
          )}
        </div>
      ))}
      <button onClick={() => setRevealed(true)}>
        Vérifier les preuves et révéler la correction
      </button>
      <p className="muted">
        Le classement fermé est corrigé. Votre justification libre doit être relue : citer le
        passage, expliquer le lien, reconnaître ce qui reste incertain.
      </p>
    </section>
  );
}
export function PromptLab() {
  const [instruction, setInstruction] = useState(
      'Réponds en moins de 20 mots et cite une source du dossier.',
    ),
    [limit, setLimit] = useState(20),
    [citation, setCitation] = useState(true);
  const [responses, setResponses] = useState([
    'L’observatoire est une merveilleuse institution scientifique où les visiteurs peuvent admirer les objets célestes et profiter de multiples activités passionnantes. Il ouvre tous les jours.',
    'L’observatoire ouvre mardi à dix-huit heures [S1].',
  ]);
  return (
    <section className="instrument">
      <h2>Mesurer une réponse, pas promettre une amélioration</h2>
      <p>
        Les deux réponses sont prédéfinies et modifiables. Changer l’instruction ne génère aucun
        texte. Les critères ci-dessous ne vérifient que la forme.
      </p>
      <label>
        Instruction à examiner
        <textarea
          value={instruction}
          maxLength={1000}
          onChange={(e) => setInstruction(e.target.value)}
        />
      </label>
      <div className="lab-toolbar">
        <label>
          Maximum de mots : {limit}
          <input
            type="range"
            min="5"
            max="50"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={citation}
            onChange={(e) => setCitation(e.target.checked)}
          />{' '}
          Exiger une référence [S1], [S2] ou [S3]
        </label>
      </div>
      {responses.map((text, i) => {
        const count = text.trim().split(/\s+/u).filter(Boolean).length,
          hasCitation = /\[S[123]\]/u.test(text);
        return (
          <div className="claim-row" key={i}>
            <label>
              Réponse {i + 1}
              <textarea
                value={text}
                maxLength={2000}
                onChange={(e) =>
                  setResponses((r) => r.map((v, j) => (j === i ? e.target.value : v)))
                }
              />
            </label>
            <p>
              {count} mots : {count <= limit ? 'limite respectée' : 'limite dépassée'} ; référence :{' '}
              {!citation ? 'non exigée' : hasCitation ? 'présente' : 'absente'}.
            </p>
          </div>
        );
      })}
      <details>
        <summary>Relire le fond avec une grille</summary>
        <p>
          La source S1 du dossier fictif indique mardi à dix-huit heures. Une citation peut être
          présente mais erronée. Vérifiez exactitude, pertinence, incertitude et données
          personnelles. Ces dimensions ne sont pas notées automatiquement.
        </p>
      </details>
    </section>
  );
}
export function RagLab() {
  const [docs, setDocs] = useState(localDocuments),
    [size, setSize] = useState(30),
    [overlap, setOverlap] = useState(5),
    [query, setQuery] = useState('observatoire mardi'),
    [requested, setRequested] = useState(false);
  let error = '',
    chunks: ReturnType<typeof chunkDocuments> = [],
    result: ReturnType<typeof retrieve> | null = null;
  try {
    chunks = chunkDocuments(docs, size, overlap);
    if (requested) result = retrieve(chunks, query);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Index invalide.';
  }
  return (
    <section className="instrument">
      <h2>Construire une réponse à partir d’extraits</h2>
      <p>
        Corpus original fictif. Vecteurs lexicaux TF-IDF et cosinus ; pas d’embeddings sémantiques,
        pas de LLM. La réponse assemble des extraits, sans paraphrase générée.
      </p>
      <details>
        <summary>Modifier les trois documents locaux</summary>
        {docs.map((d, i) => (
          <label key={d.id}>
            {d.id} — {d.title}
            <textarea
              value={d.text}
              maxLength={12000}
              rows={4}
              onChange={(e) => {
                setDocs((v) => v.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)));
                setRequested(false);
              }}
            />
          </label>
        ))}
      </details>
      <div className="lab-toolbar">
        <label>
          Taille des passages : {size} mots
          <input
            type="range"
            min="10"
            max="80"
            step="5"
            value={size}
            onChange={(e) => {
              const n = Number(e.target.value);
              setSize(n);
              setOverlap((o) => Math.min(o, n - 1));
              setRequested(false);
            }}
          />
        </label>
        <label>
          Chevauchement : {overlap} mots
          <input
            type="range"
            min="0"
            max={size - 1}
            value={overlap}
            onChange={(e) => {
              setOverlap(Number(e.target.value));
              setRequested(false);
            }}
          />
        </label>
      </div>
      <p>{chunks.length} passages indexés. IDs et intervalles de mots conservés.</p>
      <label>
        Question documentaire
        <input
          value={query}
          maxLength={500}
          onChange={(e) => {
            setQuery(e.target.value);
            setRequested(false);
          }}
        />
      </label>
      <button disabled={Boolean(error)} onClick={() => setRequested(true)}>
        Retrouver les passages
      </button>
      {error && <p role="alert">{error}</p>}
      {result && (
        <div aria-live="polite">
          <p>
            Vocabulaire : {result.vocabularySize} termes ; termes connus de la question :{' '}
            {result.queryKnownTerms}.
          </p>
          {result.ranked.map(({ chunk, score }) => (
            <blockquote key={chunk.id}>
              <strong>
                {chunk.id} — {chunk.title} · mots {chunk.start + 1} à {chunk.end} · cosinus{' '}
                {score.toFixed(3)}
              </strong>
              <p>{chunk.text}</p>
            </blockquote>
          ))}
          <h3>Réponse extractive proposée</h3>
          <pre className="extractive-answer">{result.answer}</pre>
        </div>
      )}
      <details>
        <summary>Comprendre le calcul et ses limites</summary>
        <p>
          Fréquences brutes × IDF : log((1+N)/(1+df))+1 ; vecteurs normalisés L2 ; produit scalaire
          égal au cosinus. Les termes inconnus sont ignorés. Les passages avec un score positif sont
          triés, trois au maximum. Ce seuil n’est pas une garantie de pertinence. Variantes
          lexicales, négations, ambiguïtés et découpage peuvent produire de mauvais résultats. Les
          documents restent des données, jamais des instructions exécutées.
        </p>
      </details>
    </section>
  );
}
export function Experiment({ id, scientific = false }: { id: ExperimentId; scientific?: boolean }) {
  return (
    <LabBoundary>
      <Suspense fallback={<p role="status">Ouverture de l’instrument…</p>}>
        {id === 'prediction' ? (
          <PredictionLab />
        ) : id === 'tokenizer' ? (
          scientific ? (
            <BpeLab />
          ) : (
            <SimpleTokens />
          )
        ) : id === 'generation' ? (
          scientific ? (
            <GenerationLab />
          ) : (
            <PredictionLab generation />
          )
        ) : id === 'attention' ? (
          scientific ? (
            <AttentionLab />
          ) : (
            <IntuitiveAttention />
          )
        ) : id === 'training' ? (
          scientific ? (
            <TrainingLab />
          ) : (
            <IntuitiveTraining />
          )
        ) : id === 'detective' ? (
          <DetectiveLab />
        ) : id === 'prompting' ? (
          <PromptLab />
        ) : id === 'rag' ? (
          <RagLab />
        ) : id === 'embeddings' ? (
          scientific ? (
            <EmbeddingLab />
          ) : (
            <IntuitiveVectors />
          )
        ) : scientific ? (
          <TransformerLab />
        ) : (
          <IntuitiveTransformer />
        )}
      </Suspense>
    </LabBoundary>
  );
}
