import { describe, expect, it } from 'vitest';
import { exercises, isCorrect } from '../../src/core/exercises';
import { emptyProgress, parseProgress, moduleScore, loadProgress, saveProgress } from '../../src/core/progress';
describe('Évaluation et persistance',()=>{
 it('accepte virgule et point, refuse un résultat vide',()=>{const e=exercises[0]!;expect(isCorrect(e,'0,5')).toBe(true);expect(isCorrect(e,'0.5')).toBe(true);expect(isCorrect(e,'')).toBe(false);expect(isCorrect(e,'0,5abc')).toBe(false);expect(isCorrect(e,'Infinity')).toBe(false);});
 it('vérifie les réponses de référence de tous les exercices',()=>{for(const e of exercises){expect(isCorrect(e,String(e.expected))).toBe(true);expect(isCorrect(e,'aucune réponse valide')).toBe(false);}});
 it('a une progression initiale nulle',()=>expect(moduleScore(emptyProgress(),'01')).toEqual({correct:0,total:4}));
 it('recalcule la réussite et ignore une assertion de score importée',()=>{const p=emptyProgress();p.answers['m01-proba']='0.5';const parsed=parseProgress(JSON.stringify({...p,completed:true,score:100}));expect(moduleScore(parsed,'01')).toEqual({correct:1,total:4});expect(parsed).not.toHaveProperty('score');});
 it('n’accorde pas de compétence à une réponse incorrecte ou une note libre',()=>{const p=emptyProgress();p.notes['01']='Je connais tout.';p.answers['m01-proba']='1';expect(moduleScore(p,'01').correct).toBe(0);});
 it('exporte et importe sans perte',()=>{const p=emptyProgress();p.notes['02']='Hypothèse vérifiée : é 😀';p.theme='dark';p.answers['m02-frequency']='3';expect(parseProgress(JSON.stringify(p))).toEqual(p);});
 it.each([null,[],{}, {...emptyProgress(),version:2},{...emptyProgress(),theme:'fake'},{...emptyProgress(),answers:[]},{...emptyProgress(),answers:{evil:'x'}},{...emptyProgress(),answers:{'m01-proba':5}},{...emptyProgress(),notes:{'01':'x'}},{...emptyProgress(),notes:{'01':false,'02':''}}])('refuse les structures incorrectes %j',v=>expect(()=>parseProgress(JSON.stringify(v))).toThrow());
 it('refuse les données trop grandes',()=>expect(()=>parseProgress(' '.repeat(100001))).toThrow());
 it('conserve un carnet valide dans le stockage',()=>{let raw='';const storage={setItem:(_k:string,value:string)=>{raw=value;},getItem:()=>raw};const p=emptyProgress();p.answers['m02-budget']='6';expect(saveProgress(storage,p)).toBe(true);expect(loadProgress(storage).progress).toEqual(p);});
 it('signale un stockage défaillant',()=>{expect(saveProgress({setItem:()=>{throw new Error('quota');}},emptyProgress())).toBe(false);expect(loadProgress({getItem:()=>{throw new Error('blocked');}}).warning).not.toBe('');});
 it('refuse la corruption avec une alerte sans écraser le fichier',()=>{const result=loadProgress({getItem:()=>'{broken'});expect(result.progress).toEqual(emptyProgress());expect(result.warning).not.toBe('');});
});

