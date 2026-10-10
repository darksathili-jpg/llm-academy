import {useState} from 'react';
import {filteredDistribution,DEFAULT_SAMPLING,sample,seededRandom,generate,type SamplingOptions,type GenerationStep} from '../../core/generation';
import {TRAIN_TEXT,VALID_TEXT,makeCorpus,initialize,trainStep,initializeAdapter,adaptStep,loss,tinyForward,effectiveProjection,type TinyModel,type Adapter} from '../../core/training';
import {MatrixEditor,MatrixView} from './Matrix';
const ADAPT_TEXT='le chat voit le chien\nle chat voit le chien\nle chien voit le chat';
function buildBase(){const corpus=makeCorpus(TRAIN_TEXT,VALID_TEXT);let model=initialize(corpus.vocabulary.length);for(let i=0;i<100;i++)model=trainStep(model,corpus.train,.8).model;return {corpus,model};}
export function GenerationLab(){
 const [logits,setLogits]=useState([[2,1,0,-1]]),[options,setOptions]=useState<SamplingOptions>(DEFAULT_SAMPLING),[seed,setSeed]=useState(7),[counts,setCounts]=useState<number[]>([]);
 const distribution=filteredDistribution(logits[0]!,options);
 const [base]=useState(buildBase),[model,setModel]=useState<TinyModel>(base.model);
 const [rank,setRank]=useState(1),[mode,setMode]=useState<'lora'|'full'>('lora'),[adapter,setAdapter]=useState<Adapter>(()=>initializeAdapter(base.model));
 const [steps,setSteps]=useState(0),[trace,setTrace]=useState<GenerationStep[]>([]),[notice,setNotice]=useState('');
 const domain=makeCorpus(TRAIN_TEXT,ADAPT_TEXT).validation,currentAdapter=mode==='lora'?adapter:undefined;
 const currentLoss=loss(model,domain,currentAdapter), baseLoss=loss(base.model,domain);
 const baseDelta=Math.max(...(['embedding','projection'] as const).flatMap(key=>model[key].flatMap((row,i)=>row.map((x,j)=>Math.abs(x-base.model[key][i]![j]!)))));
 function control(change:Partial<SamplingOptions>){setOptions(old=>({...old,...change}));setCounts([]);setTrace([])}
 function reset(nextMode=mode,nextRank=rank){setMode(nextMode);setRank(nextRank);setModel(base.model);setAdapter(initializeAdapter(base.model,nextRank));setSteps(0);setTrace([]);setNotice('Adaptation réinitialisée ; même base pré-entraînée.')}
 function adapt(){let next=model, nextAdapter=adapter;const n=Math.min(50,300-steps);for(let i=0;i<n;i++){if(mode==='lora')nextAdapter=adaptStep(next,nextAdapter,domain,1).adapter;else next=trainStep(next,domain,.4).model;}setModel(next);setAdapter(nextAdapter);setSteps(steps+n);setTrace([]);setNotice(n+' mises à jour réelles sur le corpus de domaine.')}
 const v=base.corpus.vocabulary.length;
 return <div className="lab" id="generation-lab">
 <header className="lab-header"><div><span className="eyebrow">Expérience 09 · sélectionner et adapter</span><h3>Generation & Adaptation Lab</h3></div><span className="tag">Calcul local, graine fixée</span></header>
 <p>Objectif : séparer un changement de tirage et un changement de poids. Prérequis : softmax et gradients. Première expérience sur quatre logits éditables ; seconde sur le modèle bigramme réellement pré-entraîné avec 100 mises à jour sur le corpus original du module 08.</p>
 <MatrixEditor title="Logits explicites" matrix={logits} onChange={value=>{setLogits(value);setCounts([])}}/>
 <p>Ordre des tokens de cette distribution : bleu, gris, rose, vert. Température → softmax → top-k → renormalisation → top-p → renormalisation. Les égalités sont départagées par ID croissant.</p>
 <div className="control-grid">
 <label>Température : {options.temperature}<input aria-label="Température de génération" type="range" min=".1" max="3" step=".1" value={options.temperature} onChange={e=>control({temperature:Number(e.target.value)})}/></label>
 <label>Top-k<select aria-label="Top-k" value={options.topK} onChange={e=>control({topK:Number(e.target.value)})}>{[0,1,2,3,4].map(k=><option key={k} value={k}>{k===0?'Désactivé':k}</option>)}</select></label>
 <label>Top-p : {options.topP}<input aria-label="Top-p" type="range" min=".1" max="1" step=".05" value={options.topP} onChange={e=>control({topP:Number(e.target.value)})}/></label>
 <label>Graine<select value={seed} onChange={e=>{setSeed(Number(e.target.value));setCounts([]);setTrace([])}}>{[7,11,42].map(n=><option key={n}>{n}</option>)}</select></label>
 </div>
 <div className="matrix-scroll"><table><caption>Distribution explicite, filtrage et fréquences observées</caption><thead><tr><th>Token</th><th>Après température</th><th>Après top-k</th><th>Après top-p</th><th>Tirages / 200</th></tr></thead><tbody>{['bleu','gris','rose','vert'].map((t,i)=><tr key={t}><th scope="row">{t}</th><td>{distribution.base[i]!.toFixed(6)}</td><td>{distribution.afterK[i]!.toFixed(6)}</td><td data-testid="filtered-probability">{distribution.probabilities[i]!.toFixed(6)}</td><td>{counts.length?counts[i]:'—'}</td></tr>)}</tbody></table></div>
 <p className="result" data-testid="kept-tokens">{distribution.kept.length} tokens conservés ; somme = {distribution.probabilities.reduce((s,p)=>s+p,0).toFixed(6)} ; entropie = {distribution.entropy.toFixed(6)} nats.</p>
 <button onClick={()=>{const rand=seededRandom(seed),next=[0,0,0,0];for(let i=0;i<200;i++)next[sample(distribution.probabilities,rand())]!++;setCounts(next)}}>Effectuer 200 tirages</button>
 <p className="muted">Les fréquences finies diffèrent des probabilités. Une température positive très basse se rapproche du maximum ; elle ne garantit ni vérité ni diversité. La graine est un générateur pédagogique LCG, pas le RNG de PyTorch.</p>
 <hr/><h4>Adapter des poids : LoRA ou fine-tuning complet</h4>
 <p>Base : V={v}, d=4, modèle E[id]W sans attention. Pré-entraînement : SGD 100 pas, taux 0,8, graine 7, corpus original. Domaine original d'adaptation :</p><pre className="code-output">{ADAPT_TEXT}</pre>
 <div className="transformer-controls"><label>Méthode d'adaptation<select value={mode} onChange={e=>reset(e.target.value as 'lora'|'full')}><option value="lora">LoRA · E et W gelés</option><option value="full">Fine-tuning · E et W entraînés</option></select></label><label>Rang de l'adaptateur<select disabled={mode!=='lora'} value={rank} onChange={e=>reset(mode,Number(e.target.value))}>{[1,2].map(r=><option key={r}>{r}</option>)}</select></label></div>
 <p className="formula">W_effectif = W + (α/r)AB. Ici A : 4×r, B : r×{v}, α=r, donc α/r=1. A initialisé, B nul.</p>
 <p data-testid="adapt-parameters">{mode==='lora'?rank*(4+v):8*v} paramètres entraînables ; {mode==='lora'?8*v:0} paramètres de base gelés.</p>
 <div className="training-metrics"><p><span>Pas d'adaptation</span><strong data-testid="adapt-step">{steps}</strong></p><p><span>Perte de domaine avant</span><strong>{baseLoss.toFixed(6)}</strong></p><p><span>Perte de domaine actuelle</span><strong data-testid="adapt-loss">{currentLoss.toFixed(6)}</strong></p></div>
 <p data-testid="base-weight-delta">Changement maximal des poids E/W de base : {baseDelta.toFixed(6)}</p>
 <div className="lab-toolbar"><button disabled={steps>=300} onClick={adapt}>Adapter pendant 50 pas</button><button className="secondary" onClick={()=>reset()}>Réinitialiser l'adaptation</button><button onClick={()=>setTrace(generate([base.corpus.vocabulary.indexOf('le')],12,seed,options,context=>tinyForward(model,context.at(-1)!,currentAdapter),1))}>Générer avec les poids actuels</button></div><p role="status">{notice}</p>
 <p className="generated-text" data-testid="adapted-output">{trace.length>0&&<>le <strong>{trace.map(s=>base.corpus.vocabulary[s.token]).join(' ')}</strong></>}</p>
 {trace.length>0&&<details><summary>Trace de génération du modèle adapté</summary><div className="matrix-scroll"><table><caption>Tirages conditionnés par le dernier token</caption><thead><tr><th>Pas</th><th>Dernier token</th><th>Tirage u</th><th>Token choisi</th><th>Probabilité</th></tr></thead><tbody>{trace.map((s,i)=><tr key={i}><th scope="row">{i+1}</th><td>{base.corpus.vocabulary[s.context.at(-1)!]}</td><td>{s.draw.toFixed(6)}</td><td>{base.corpus.vocabulary[s.token]}</td><td>{s.probabilities[s.token]!.toFixed(6)}</td></tr>)}</tbody></table></div></details>}
 <details><summary>Inspecter A, B et la projection effective</summary>{mode==='lora'&&<><MatrixView title="Adaptateur A" matrix={adapter.a}/><MatrixView title="Adaptateur B" matrix={adapter.b}/></>}<MatrixView title="Projection effective" matrix={effectiveProjection(model,currentAdapter)}/></details>
 <p className="lab-limit">La baisse mesurée concerne le petit corpus de domaine, pas une performance générale. LoRA est appliqué seulement à W ; le vocabulaire et E sont gelés. Le modèle voit un seul token précédent : ce n'est pas un Transformer ni un LLM moderne. Le filtrage et l'adaptation sont indépendants. Défi : comparer mêmes tokens, paramètres de sampling et graine avant/après adaptation, puis vérifier aussi la perte sur le corpus initial dans le notebook.</p>
 </div>
}
