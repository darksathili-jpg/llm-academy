import { useState, type ChangeEvent } from 'react';
import { exercises, isCorrect } from '../core/exercises';
import { modules } from '../content/modules';
import { moduleScore, parseProgress } from '../core/progress';
import { useProgress } from './ProgressProvider';
export function Notebook() {
 const { progress, update } = useProgress();
 const [message, setMessage] = useState('');
 const [candidate, setCandidate] = useState<ReturnType<typeof parseProgress> | null>(null);
 function download() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(progress,null,2)], { type:'application/json' }));
  const a = document.createElement('a'); a.href=url; a.download='llm-academy-carnet.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); setMessage('Carnet exporté. Conservez ce fichier pour le réimporter.');
 }
 async function prepareImport(event: ChangeEvent<HTMLInputElement>) {
  setCandidate(null);
  const file=event.target.files?.[0]; if (!file) return;
  try { if (file.size>100000) throw new Error('Fichier trop volumineux (100 Ko maximum).'); const p=parseProgress(await file.text()); setCandidate(p); setMessage('Fichier valide. Les compétences seront recalculées depuis les réponses.'); }
  catch(e) { setMessage(e instanceof Error ? e.message : 'Import impossible.'); }
  event.target.value='';
 }
 return <article><header className="page-heading"><span className="eyebrow">Votre trace d’apprentissage · privée et locale</span><h1>Carnet de laboratoire</h1><p className="lead">Ce que vous avez testé, compris et expliqué.</p></header>
  <div className="notice"><strong>Vos données restent dans ce navigateur.</strong><p>Aucun compte, aucun suivi distant. Une suppression des données du navigateur efface le carnet ; exportez-le pour le conserver. Les notes ne sont pas envoyées à une IA.</p></div>
  <div className="notebook-tools"><button onClick={download}>Exporter mon carnet</button><label className="file-label">Choisir un carnet JSON<input type="file" accept=".json,application/json" onChange={prepareImport} /></label></div>
  <p role="status">{message}</p>
  {candidate && <div className="notice"><p>Import : {Object.keys(candidate.answers).length} réponses et {candidate.notes['01'].length+candidate.notes['02'].length} caractères de notes. Votre carnet actuel sera remplacé.</p><button onClick={() => { update(() => candidate); setCandidate(null); setMessage('Carnet importé. Progression recalculée.'); }}>Remplacer par ce carnet</button><button className="secondary" onClick={() => {setCandidate(null);setMessage('Import annulé.');}}>Annuler</button></div>}
  {modules.map(module => { const score=moduleScore(progress,module.id);return <section className="notebook-module" key={module.id}><span className="eyebrow">Module {module.id}</span><h2>{module.title}</h2><p>{score.correct}/{score.total} exercices validés · {score.correct===score.total?'Compétences évaluées acquises':'À approfondir'}</p><progress aria-label={'Progression module '+module.id} max={score.total} value={score.correct} />
   <ul>{exercises.filter(e=>e.module===module.id).map(e=><li key={e.id}><span>{progress.answers[e.id] === undefined ? 'Non tenté' : isCorrect(e,progress.answers[e.id]!) ? 'Validé' : 'À reprendre'}</span> — {e.level} : {e.prompt}</li>)}</ul>
   <label>Observations / module {module.id}<textarea rows={4} maxLength={10000} value={progress.notes[module.id]} onChange={e=>update(p=>({...p,notes:{...p.notes,[module.id]:e.target.value}}))} /></label><a href={'#/module/'+module.id}>Revenir aux expériences et corrections →</a></section>;})}
 </article>;
}

