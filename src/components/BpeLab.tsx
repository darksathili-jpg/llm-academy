import { useMemo, useState } from 'react';
import { DEFAULT_CORPUS, encodeBpe, tokenCount, trainBpe } from '../core/bpe';
export function BpeLab() {
  const [draft, setDraft] = useState(DEFAULT_CORPUS);
  const [corpus, setCorpus] = useState(DEFAULT_CORPUS);
  const [step, setStep] = useState(0);
  const [text, setText] = useState('lama lac');
  const [error, setError] = useState('');
  const history = useMemo(() => trainBpe(corpus, 12), [corpus]);
  const snapshot = history[Math.min(step, history.length - 1)]!;
  const encoded = encodeBpe(text, snapshot);
  const count = encoded.filter(t => t.id !== null).length;
  const best = snapshot.pairs[0];
  function train() {
    try { trainBpe(draft, 0); setCorpus(draft); setStep(0); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Corpus invalide.'); }
  }
  return <div className="lab" id="bpe-lab">
    <header className="lab-header"><div><span className="eyebrow">Expérience 02 · algorithme visible</span><h3>Token Lab / BPE</h3></div><span className="tag">Unicode · miniature</span></header>
    <p>Hypothèse : apprendre une fusion fréquente réduit-il toujours le nombre de tokens du texte de test ? Modifiez le corpus pour le vérifier.</p>
    <label>Corpus d’apprentissage<textarea rows={2} value={draft} maxLength={2000} onChange={e => setDraft(e.target.value)} /></label>
    <button onClick={train}>Appliquer le corpus et réinitialiser</button>
    {draft !== corpus && <p role="status">Le corpus saisi n’est pas encore appliqué.</p>}
    {error && <p role="alert">{error}</p>}
    <div className="lab-toolbar"><button className="secondary" disabled={step === 0} onClick={() => setStep(s => s-1)}>Étape précédente</button><strong aria-live="polite">Étape {step} / {history.length-1}</strong><button disabled={step >= history.length-1} onClick={() => setStep(s => s+1)}>Fusion suivante</button><button className="secondary" disabled={step === 0} onClick={() => setStep(0)}>Retour à l’alphabet</button></div>
    <div className="lab-grid"><div><h4>1. Compter les paires adjacentes</h4>
      <div className="table-scroll"><table><caption>Fréquences à l’étape {step}</caption><thead><tr><th scope="col">Paire</th><th scope="col">Occurrences</th></tr></thead><tbody>{snapshot.pairs.slice(0,10).map(p => <tr key={JSON.stringify(p.pair)}><td><code>{p.pair[0]} + {p.pair[1]}</code></td><td>{p.count}</td></tr>)}</tbody></table></div>
      {!best && <p>Aucune paire restante. Corpus vide ou mots réduits à un symbole.</p>}
      {snapshot.pairs.length > 10 && <p>10 premières paires affichées sur {snapshot.pairs.length} ; le moteur compte toutes les paires.</p>}
      {best && <p className="result">Prochaine fusion : <strong>{best.pair.join(' + ')} → {best.pair.join('')}</strong> ({best.count} occurrences).</p>}
      <p>En cas d’égalité : ordre lexicographique des clés JSON des paires (UTF-16). Les occurrences chevauchantes sont comptées, puis fusionnées sans chevauchement de gauche à droite.</p>
    </div><div><h4>2. Observer le corpus transformé</h4><div className="word-list">{snapshot.words.slice(0,25).map(w => <div key={w.text}><span>{w.text} × {w.frequency}</span><div className="tokens">{w.tokens.map((t,i) => <span className={'token tone-' + i%4} key={i}>{t}</span>)}</div></div>)}</div>
      {snapshot.words.length > 25 && <p>25 mots distincts affichés sur {snapshot.words.length} ; tous sont pris en compte.</p>}
      <div className="metrics"><div><strong>{tokenCount(snapshot)}</strong><span>tokens dans le corpus</span></div><div><strong>{snapshot.vocabulary.length + 1}</strong><span>entrées avec [UNK]</span></div></div>
      {step > 0 && <p>Cette fusion a remplacé {snapshot.replacements} paires effectivement (les chevauchements ne fusionnent qu’une fois).</p>}
    </div></div>
    <details><summary>Historique des règles apprises et vocabulaire</summary><ol>{snapshot.merges.map((pair,i) => <li key={i}><code>{pair.join(' + ')} → {pair.join('')}</code></li>)}</ol>{!snapshot.merges.length && <p>Aucune règle apprise : seulement l’alphabet initial.</p>}<p className="vocab">ID 0 : [UNK] ; {snapshot.vocabulary.map((t,i) => (i+1)+': '+t).join(' · ')}</p></details>
    <h4>3. Encoder avec les règles actuelles</h4><label>Texte de test<input value={text} maxLength={2000} onChange={e => { if (!/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(e.target.value)) setText(e.target.value); }} /></label>
    <div className="tokens encoded" aria-label="Tokens du texte de test">{encoded.map((t,i) => t.id === null ? <span className="space" key={i} title="Espace conservé hors vocabulaire">␠</span> : <span className={'token tone-' + i%4 + (t.unknown?' unknown':'')} key={i} title={t.unknown?'Caractère absent : '+t.original:'ID local '+t.id}>{t.text}<small>ID {t.id}</small></span>)}</div>
    <p aria-live="polite"><strong>{count} tokens</strong> · {encoded.filter(t => t.unknown).length} inconnus · {Array.from(text).length} points de code Unicode.</p>
    <p className="lab-limit">Prérequis : identifier des caractères et compter. Données : votre corpus local (2 000 caractères maximum, 12 fusions). Aucun envoi réseau. Les frontières de mots empêchent les fusions entre mots ; espaces conservés hors du budget. Les ID sont propres à ce corpus. Ce tokenizer sur caractères n’est pas le BPE sur octets de GPT ; il ne prédit pas le coût d’une API.</p>
  </div>;
}

