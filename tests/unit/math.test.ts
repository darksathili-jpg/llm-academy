import { describe, expect, it } from 'vitest';
import { softmax, crossEntropy, sequenceProbability } from '../../src/core/math';
describe('Probabilités et perte',()=>{
 it('donne un tiers avec des logits égaux',()=>{for(const p of softmax([0,0,0]))expect(p).toBeCloseTo(1/3,14);expect(crossEntropy([0,0,0],2)).toBeCloseTo(Math.log(3),14);});
 it('calcule la distribution de référence 2/10,3/10,5/10',()=>{const p=softmax([Math.log(2),Math.log(3),Math.log(5)]);[.2,.3,.5].forEach((x,i)=>expect(p[i]).toBeCloseTo(x,14));});
 it('est stable pour de grands logits',()=>{const p=softmax([10000,9999,9998]);expect(p.every(Number.isFinite)).toBe(true);expect(p.reduce((a,b)=>a+b,0)).toBeCloseTo(1,14);expect(p[0]).toBeCloseTo(.6652409557748218,14);});
 it('est invariant par translation',()=>{const p=softmax([1,-2,3]);const q=softmax([1001,998,1003]);p.forEach((x,i)=>expect(q[i]).toBeCloseTo(x,14));});
 it('calcule une perte finie malgré un underflow de probabilité',()=>{expect(softmax([1000,-1000])[1]).toBe(0);expect(crossEntropy([1000,-1000],1)).toBe(2000);});
 it('calcule la perte cible de référence',()=>{expect(crossEntropy([Math.log(2),Math.log(3),Math.log(5)],2)).toBeCloseTo(Math.log(2),14);});
 it.each([[],[NaN],[Infinity],[-Infinity]].map(values=>({values})))('rejette les scores invalides $values',({values})=>expect(()=>softmax(values)).toThrow());
 it.each([-1,1.5,3])('refuse une cible invalide %s',v=>expect(()=>crossEntropy([0,1,2],v)).toThrow());
 it('calcule la règle de chaîne',()=>{expect(sequenceProbability([.4,.3])).toBeCloseTo(.12,14);expect(sequenceProbability([1,0])).toBe(0);expect(sequenceProbability([])).toBe(1);});
 it.each([[-.1],[1.1],[NaN]].map(values=>({values})))('refuse des probabilités invalides $values',({values})=>expect(()=>sequenceProbability(values)).toThrow());
});

