export interface LossPoint {step:number;train:number;validation:number}
export function LossCurve({points}:{points:LossPoint[]}){
  const max=Math.max(1,...points.flatMap(p=>[p.train,p.validation])),last=Math.max(1,points.at(-1)!.step);
  const path=(key:'train'|'validation')=>points.map(p=>(30+440*p.step/last).toFixed(2)+','+(170-140*p[key]/max).toFixed(2)).join(' ');
  return <><svg className="loss-plot" viewBox="0 0 500 205" role="img" aria-label="Pertes mesurées selon les mises à jour. Les valeurs exactes sont dans le tableau."><line x1="30" y1="170" x2="470" y2="170"/><line x1="30" y1="30" x2="30" y2="170"/><polyline className="training-line" fill="none" points={path('train')}/><polyline className="validation-line" fill="none" points={path('validation')}/><text x="32" y="20">Perte en nats · maximum {max.toFixed(2)}</text><text x="30" y="195">0</text><text x="330" y="195">{last} mises à jour</text></svg><p className="curve-legend"><span>— Entraînement</span><span>⋯ Validation</span></p></>
}
