/* LLM Academy V4-R1 — laboratoire bigramme pédagogique.
   Modèle statistique local, PAS un LLM. Aucun appel réseau. */
export const CORPUS = `le chat regarde le jardin . le chat écoute la pluie .
le chien regarde la rue . le chien écoute le vent .
la pluie tombe sur le jardin . le vent traverse la rue .
le soleil éclaire le jardin . la lune éclaire la rue .
le chat dort dans la maison . le chien dort dans la maison .
la maison regarde le jardin . le jardin accueille la pluie .
le chat regarde la lune . le chien regarde le soleil .
le vent souffle dans le jardin . la pluie chante dans la rue .
le jardin écoute le vent . la maison écoute la pluie .
le soleil regarde la maison . la lune regarde le jardin .
le chat traverse le jardin . le chien traverse la rue .
la pluie tombe dans la maison . le soleil éclaire le chat .
la lune éclaire le chien . le vent traverse le jardin .
la maison accueille le chat . le jardin accueille le chien .
le chat écoute le vent . le chien écoute la pluie .`;
export const tokens = text => (text.toLocaleLowerCase('fr').match(/[\p{L}]+(?:['’][\p{L}]+)?|[.!?]/gu) || []);
export function train(text) {
  const words=tokens(text), counts=new Map(), starts=new Map();
  let prev='<début>';
  for(const word of words){
    if(!counts.has(prev))counts.set(prev,new Map());
    const m=counts.get(prev);m.set(word,(m.get(word)||0)+1);
    if(prev==='<début>')starts.set(word,(starts.get(word)||0)+1);
    prev=/[.!?]/.test(word)?'<début>':word;
  }
  return {words,counts,starts};
}
export function distribution(model,context,temperature=1,topK=3){
  if(!(temperature>0)||!Number.isFinite(temperature))throw new RangeError('Température positive requise');
  if(!Number.isInteger(topK)||topK<1)throw new RangeError('top-k entier positif requis');
  const m=model.counts.get(context);
  if(!m||!m.size)return [];
  const entries=[...m].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr')).slice(0,topK);
  const log=entries.map(([,n])=>Math.log(n)/temperature);
  const max=Math.max(...log),weights=log.map(x=>Math.exp(x-max)),sum=weights.reduce((a,b)=>a+b,0);
  return entries.map(([word,count],i)=>({word,count,p:weights[i]/sum}));
}
export function rng(seed){
  let state=(seed>>>0);
  return ()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296};
}
export function sample(items,random){
  if(!items.length)return null;
  const r=random();let acc=0;
  for(const item of items){acc+=item.p;if(r<acc)return item.word}
  return items[items.length-1].word;
}
export function generate(model,{seed=2026,temperature=1,topK=3,maxTokens=24,start='le'}={}){
  const random=rng(seed);let context=start.toLocaleLowerCase('fr'),output=[context],trace=[];
  for(let i=0;i<maxTokens;i++){
    const dist=distribution(model,context,temperature,topK);
    if(!dist.length)break;
    const next=sample(dist,random);
    trace.push({context,candidates:dist,next});
    output.push(next);
    if(/[.!?]/.test(next))break;
    context=next;
  }
  return {text:output.join(' ').replace(/\s+([.!?])/g,'$1'),trace};
}
