import {useState} from 'react';
import {TRAIN_TEXT,VALID_TEXT,makeCorpus,initialize,trainStep,loss,gradients,tinyForward,type TinyModel} from '../../core/training';
import {softmax} from '../../core/math';
import {MatrixView} from './Matrix';
import {LossCurve,type LossPoint} from './LossCurve';
import {PythonWorkbench} from './PythonWorkbench';
const initialCorpus=makeCorpus(TRAIN_TEXT,VALID_TEXT);
function measure(model:TinyModel,step:number,corpus:typeof initialCorpus):LossPoint{return {step,train:loss(model,corpus.train),validation:loss(model,corpus.validation)}}
export function TrainingLab(){
 const [trainText,setTrainText]=useState(TRAIN_TEXT),[validationText,setValidationText]=useState(VALID_TEXT);
 const [corpus,setCorpus]=useState(initialCorpus),[model,setModel]=useState(()=>initialize(initialCorpus.vocabulary.length));
 const [history,setHistory]=useState<LossPoint[]>(()=>[measure(initialize(initialCorpus.vocabulary.length),0,initialCorpus)]);
 const [rate,setRate]=useState(.8),[decay,setDecay]=useState(0),[error,setError]=useState(''),[notice,setNotice]=useState(''),[selected,setSelected]=useState(2);
 const last=history.at(-1)!,g=gradients(model,corpus.train,decay);
 const [applied,setApplied]=useState({train:TRAIN_TEXT,validation:VALID_TEXT});
 const pending=trainText!==applied.train||validationText!==applied.validation;
 function apply(){
  try{const next=makeCorpus(trainText,validationText),fresh=initialize(next.vocabulary.length);setCorpus(next);setModel(fresh);setHistory([measure(fresh,0,next)]);setSelected(2);setApplied({train:trainText,validation:validationText});setError('');setNotice('Corpus appliqués. Poids et historique réinitialisés.');}catch(e){setError(e instanceof Error?e.message:'Corpus invalide.')}
 }
 function step(count:number){
  try{let next=model;const points:LossPoint[]=[];let clipped=0;
   for(let i=0;i<Math.min(count,400-last.step);i++){const result=trainStep(next,corpus.train,rate,decay);next=result.model;clipped+=Number(result.clipped);points.push(measure(next,last.step+i+1,corpus));}
   setModel(next);setHistory(old=>[...old,...points]);setError('');setNotice(points.length+' mises à jour ; '+clipped+' gradients écrêtés à la norme 5.');}catch(e){setError(e instanceof Error?e.message:'Calcul impossible.')}
 }
 function reset(){const fresh=initialize(corpus.vocabulary.length);setModel(fresh);setHistory([measure(fresh,0,corpus)]);setNotice('Retour aux mêmes poids initiaux, graine 7.')}
 const probability=softmax(tinyForward(model,selected));
 return <div className="lab" id="training-lab">
 <header className="lab-header"><div><span className="eyebrow">Expérience 08 · apprendre et mesurer</span><h3>Training Lab</h3></div><span className="tag">Modèle neuronal bigramme</span></header>
 <p>Objectif : modifier de vrais poids et comparer les pertes d'entraînement et de validation. Prérequis : produits matriciels, softmax et perte. Modèle volontairement réduit : ID → E[id] → E[id]W → distribution. Il ne regarde que le token précédent, sans attention.</p>
 <div className="corpus-editors"><label>Corpus d'entraînement · une phrase par ligne<textarea rows={5} maxLength={2000} value={trainText} onChange={e=>setTrainText(e.target.value)}/></label><label>Corpus de validation · jamais utilisé pour les gradients<textarea rows={5} maxLength={2000} value={validationText} onChange={e=>setValidationText(e.target.value)}/></label></div>
 <button className="secondary" onClick={apply}>Appliquer les corpus et réinitialiser</button>
 {pending&&<p className="notice">Modifications en attente : appliquez les corpus avant d'entraîner.</p>}
 <p className="muted">{corpus.train.length} paires d'entraînement ; {corpus.validation.length} de validation ; V={corpus.vocabulary.length}, d=4 ; {corpus.vocabulary.length*8} paramètres. Chaque ligne possède ses marqueurs début/fin ; aucune paire ne traverse deux documents.</p>
 <div className="control-grid"><label>Taux d'apprentissage : {rate}<input aria-label="Taux d'apprentissage" type="range" min=".05" max="4" step=".05" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label><label>Pénalité L2 λ : {decay}<input aria-label="Pénalité L2" type="range" min="0" max=".1" step=".01" value={decay} onChange={e=>setDecay(Number(e.target.value))}/></label></div>
 <div className="lab-toolbar">{[1,20,100].map(n=><button key={n} disabled={pending||last.step>=400} onClick={()=>step(n)}>{n===1?'Une mise à jour':n+' mises à jour'}</button>)}<button className="secondary" onClick={reset}>Réinitialiser les poids</button></div>
 <p role="status">{notice}</p>{error&&<p role="alert" className="notice">{error}</p>}
 <div className="training-metrics"><p><span>Mises à jour</span><strong data-testid="training-step">{last.step}</strong></p><p><span>Perte entraînement</span><strong data-testid="train-loss">{last.train.toFixed(6)}</strong></p><p><span>Perte validation</span><strong data-testid="validation-loss">{last.validation.toFixed(6)}</strong></p></div>
 <LossCurve points={history}/>
 <details><summary>Valeurs mesurées · les 30 dernières mises à jour</summary><div className="matrix-scroll"><table><caption>Historique des pertes sans pénalité L2</caption><thead><tr><th>Étape</th><th>Entraînement</th><th>Validation</th></tr></thead><tbody>{history.slice(-30).map(p=><tr key={p.step}><th scope="row">{p.step}</th><td>{p.train.toFixed(6)}</td><td>{p.validation.toFixed(6)}</td></tr>)}</tbody></table></div></details>
 <details><summary>Ouvrir la rétropropagation et les poids actuels</summary><p className="formula">z = E[id]W ; ∂L/∂z = (softmax(z) − one_hot(cible)) / N ; ∂L/∂W = Eᵀ∂L/∂z ; ∂L/∂E = ∂L/∂z Wᵀ.</p><p>La pénalité est λ/2 × somme des poids². Objectif actuel avec pénalité : {g.objective.toFixed(6)}. Les courbes montrent la perte de prédiction seule. SGD plein lot, sans momentum ; clipping global de norme 5, avant mise à jour.</p><MatrixView title="Embeddings E appris" matrix={model.embedding}/><MatrixView title="Projection W apprise" matrix={model.projection}/><MatrixView title="Gradient moyen de W avec L2" matrix={g.projection}/></details>
 <h4>Prédire avec les poids actuels</h4><label>Token précédent<select value={selected} onChange={e=>setSelected(Number(e.target.value))}>{corpus.vocabulary.map((t,i)=><option key={t} value={i}>{t}</option>)}</select></label>
 <div className="bars">{probability.map((p,i)=><div className="bar-row" key={i}><span>{corpus.vocabulary[i]}</span><div className="bar-track"><div className="bar-fill" style={{width:p*100+'%'}}/></div><output>{(p*100).toFixed(2)} %</output></div>)}</div>
 <p className="lab-limit">Défi : utilisez une seule phrase répétée à l'entraînement et des continuations différentes en validation. Relevez les deux pertes, sans promettre que la validation va baisser. Un mot nouveau en validation est refusé : le vocabulaire doit rester fixé. Pas de score factuel, ni d'entraînement d'un LLM moderne. Les poids de cette expérience se réinitialisent à la sortie du module.</p>
 <PythonWorkbench/>
 </div>
}
