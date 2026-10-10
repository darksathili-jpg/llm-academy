import { crossEntropy,softmax } from './math';
import {matmul,shape, type Matrix} from './linear';
import {seededRandom} from './generation';
export const TRAIN_TEXT='le chat voit la lune\nle chien voit la lune\nle chat voit la lune\nle chien voit le chat';
export const VALID_TEXT='le chat voit le chien\nle chien voit la lune';
export interface Pair {input:number;target:number;document:number;position:number}
export interface Corpus {vocabulary:string[];train:Pair[];validation:Pair[];documents:number[][];eos:number}
export function words(text:string):string[][] {
  if(text.length>2000)throw new Error('Corpus limité à 2 000 caractères.');
  const docs=text.normalize('NFC').toLowerCase().split(/\r?\n/u).map(line=>line.trim().split(/\s+/u).filter(Boolean)).filter(line=>line.length);
  const tokens=docs.flat();
  if(!tokens.length||tokens.length>160||docs.length>20)throw new Error('Il faut 1 à 160 mots, répartis sur 20 lignes maximum.');
  if(tokens.some(t=>t.length>40||t==='<début>'||t==='<fin>'))throw new Error('Mot trop long ou marqueur réservé.');
  return docs;
}
export function makeCorpus(trainText:string,validationText:string):Corpus{
  const docs=words(trainText), vocabulary=['<début>','<fin>',...new Set(docs.flat())];
  if(vocabulary.length<3||vocabulary.length>24)throw new Error('Vocabulaire de 1 à 22 mots requis.');
  const encode=(documents:string[][])=>documents.map(line=>[0,...line.map(t=>{const id=vocabulary.indexOf(t);if(id<0)throw new Error('Mot de validation inconnu : '+t+'. Le vocabulaire est construit sur l’entraînement seul.');return id;}),1]);
  const documents=encode(docs), val=encode(words(validationText));
  const pairs=(input:number[][]):Pair[]=>input.flatMap((line,document)=>line.slice(0,-1).map((id,position)=>({input:id,target:line[position+1]!,document,position})));
  return {vocabulary,train:pairs(documents),validation:pairs(val),documents,eos:1};
}
export function shiftedWindow(ids:readonly number[],start:number,length:number){
  if(!Number.isInteger(start)||start<0||!Number.isInteger(length)||length<1||start+length>=ids.length||ids.some(x=>!Number.isInteger(x)||x<0))throw new Error('Fenêtre et cible hors séquence.');
  return {inputs:ids.slice(start,start+length),targets:ids.slice(start+1,start+length+1)};
}
export interface TinyModel {embedding:Matrix;projection:Matrix}
export interface Adapter {a:Matrix;b:Matrix;scale:number}
const zeros=(r:number,c:number):Matrix=>Array.from({length:r},()=>Array(c).fill(0) as number[]);
export function initialize(vocabularySize:number,width=4,seed=7):TinyModel{
  if(!Number.isInteger(vocabularySize)||vocabularySize<2||vocabularySize>24||![2,4,8].includes(width))throw new Error('Dimensions du modèle invalides.');
  const rand=seededRandom(seed);
  const weights=(r:number,c:number)=>Array.from({length:r},()=>Array.from({length:c},()=> (rand()-.5)*.4));
  return {embedding:weights(vocabularySize,width),projection:weights(width,vocabularySize)};
}
export function checkModel(model:TinyModel){
  const [v,d]=shape(model.embedding),[other,output]=shape(model.projection);
  if(v<2||v>24||d!==other||v!==output)throw new Error('E doit être V×d et W d×V.');
  return {v,d};
}
export function initializeAdapter(model:TinyModel,rank=1,seed=11):Adapter{
  const {v,d}=checkModel(model);
  if(!Number.isInteger(rank)||rank<1||rank>d)throw new Error('Rang invalide.');
  const random=seededRandom(seed);
  return {a:Array.from({length:d},()=>Array.from({length:rank},()=> (random()-.5)*.4)),b:zeros(rank,v),scale:1};
}
export function effectiveProjection(model:TinyModel,adapter?:Adapter):Matrix{
  checkModel(model); if(!adapter)return model.projection;
  const delta=matmul(adapter.a,adapter.b);
  const {v,d}=checkModel(model);
  if(delta.length!==d||delta[0]!.length!==v||!Number.isFinite(adapter.scale)||adapter.scale<=0)throw new Error('Adaptateur incompatible.');
  return delta.map((row,i)=>row.map((x,j)=>model.projection[i]![j]!+adapter.scale*x));
}
export function tinyForward(model:TinyModel,id:number,adapter?:Adapter):number[]{
  const {v}=checkModel(model);
  if(!Number.isInteger(id)||id<0||id>=v)throw new Error('ID inconnu.');
  return matmul([model.embedding[id]!],effectiveProjection(model,adapter))[0]!;
}
function checkPairs(pairs:readonly Pair[],v:number){
  if(!pairs.length||pairs.length>200||pairs.some(p=>![p.input,p.target].every(x=>Number.isInteger(x)&&x>=0&&x<v)))throw new Error('Paires de tokens invalides.');
}
export function loss(model:TinyModel,pairs:readonly Pair[],adapter?:Adapter):number{
  const {v}=checkModel(model);checkPairs(pairs,v);
  return pairs.reduce((s,p)=>s+crossEntropy(tinyForward(model,p.input,adapter),p.target),0)/pairs.length;
}
export function gradients(model:TinyModel,pairs:readonly Pair[],decay=0){
  const {v,d}=checkModel(model);checkPairs(pairs,v);
  if(!Number.isFinite(decay)||decay<0||decay>1)throw new Error('Régularisation invalide.');
  const embedding=zeros(v,d),projection=zeros(d,v);
  for(const pair of pairs){
    const p=softmax(tinyForward(model,pair.input));
    const dz=p.map((x,i)=>(x-(i===pair.target?1:0))/pairs.length);
    for(let k=0;k<d;k++)for(let j=0;j<v;j++){
      embedding[pair.input]![k]!+=dz[j]!*model.projection[k]![j]!;
      projection[k]![j]!+=model.embedding[pair.input]![k]!*dz[j]!;
    }
  }
  let penalty=0;
  for(const key of ['embedding','projection'] as const)model[key].forEach((row,i)=>row.forEach((x,j)=>{penalty+=decay*x*x/2; ({embedding,projection})[key][i]![j]!+=decay*x;}));
  return {embedding,projection,objective:loss(model,pairs)+penalty};
}
function update(weights:Matrix,gradient:Matrix,rate:number,clipScale:number):Matrix{
  return weights.map((row,i)=>row.map((x,j)=>{const next=x-rate*clipScale*gradient[i]![j]!;if(!Number.isFinite(next))throw new Error('Mise à jour hors capacité numérique.');return next;}));
}
function scaleGrad(matrices:Matrix[],rate:number){
  if(!Number.isFinite(rate)||rate<=0||rate>10)throw new Error('Taux entre 0 et 10 requis.');
  const norm=Math.hypot(...matrices.flat(2));return {norm,scale:Math.min(1,5/(norm||1))};
}
export function trainStep(model:TinyModel,pairs:readonly Pair[],rate:number,decay=0){
  const g=gradients(model,pairs,decay),{norm,scale}=scaleGrad([g.embedding,g.projection],rate);
  return {model:{embedding:update(model.embedding,g.embedding,rate,scale),projection:update(model.projection,g.projection,rate,scale)},gradientNorm:norm,clipped:scale<1,objective:g.objective};
}
export function adapterGradients(model:TinyModel,adapter:Adapter,pairs:readonly Pair[]){
  const {v,d}=checkModel(model);checkPairs(pairs,v);effectiveProjection(model,adapter);
  const rank=adapter.a[0]!.length,a=zeros(d,rank),b=zeros(rank,v);
  for(const pair of pairs){
    const e=model.embedding[pair.input]!,p=softmax(tinyForward(model,pair.input,adapter));
    const dz=p.map((x,j)=>(x-(j===pair.target?1:0))/pairs.length);
    for(let r=0;r<rank;r++){
      const ea=e.reduce((s,x,k)=>s+x*adapter.a[k]![r]!,0);
      for(let j=0;j<v;j++)b[r]![j]!+=adapter.scale*ea*dz[j]!;
      const db=dz.reduce((s,x,j)=>s+x*adapter.b[r]![j]!,0);
      for(let k=0;k<d;k++)a[k]![r]!+=adapter.scale*e[k]!*db;
    }
  }
  return {a,b};
}
export function adaptStep(model:TinyModel,adapter:Adapter,pairs:readonly Pair[],rate:number){
  const g=adapterGradients(model,adapter,pairs),{norm,scale}=scaleGrad([g.a,g.b],rate);
  return {adapter:{a:update(adapter.a,g.a,rate,scale),b:update(adapter.b,g.b,rate,scale),scale:adapter.scale},gradientNorm:norm,clipped:scale<1};
}
