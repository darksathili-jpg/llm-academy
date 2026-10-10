import { useState } from 'react';
import { crossEntropy, softmax } from '../core/math';
const tokens = ['bleu', 'gris', 'rose'];
export function ProbabilityLab() {
  const [logits, setLogits] = useState([2, 1, 0]);
  const [target, setTarget] = useState(0);
  const probabilities = softmax(logits);
  return <div className="lab" id="probability-lab">
    <header className="lab-header"><div><span className="eyebrow">Expérience 01 · calcul local</span><h3>Quel token vient ensuite ?</h3></div><span className="tag">Modèle simplifié</span></header>
    <p>Contexte fictif : « Le ciel est… ». Avant de toucher aux scores, prédisez la continuation la plus probable.</p>
    <div className="lab-grid"><div><h4>1. Modifier les logits</h4><p>Ces scores sont saisis par vous, pas produits par un réseau entraîné.</p>
      {tokens.map((token, i) => <label className="slider" key={token}>Logit « {token} » <output>{logits[i]!.toFixed(1)}</output><input aria-label={'Logit ' + token} type="range" min="-6" max="6" step="0.5" value={logits[i]} onChange={e => setLogits(v => v.map((x,j) => i === j ? Number(e.target.value) : x))} /></label>)}
      <button className="secondary" onClick={() => setLogits([0,0,0])}>Comparer des scores égaux</button>
    </div><div><h4>2. Observer la distribution</h4><div className="bars" aria-label="Probabilités calculées">{tokens.map((token,i) => <div className="bar-row" key={token}><span>{token}</span><div className="bar-track"><div className="bar-fill" style={{ width: probabilities[i]! * 100 + '%' }} /></div><output>{(probabilities[i]! * 100).toFixed(2)} %</output></div>)}</div>
      <p className="formula">pᵢ = exp(zᵢ − max(z)) / Σⱼ exp(zⱼ − max(z))</p>
      <label>Token cible<select value={target} onChange={e => setTarget(Number(e.target.value))}>{tokens.map((t,i) => <option value={i} key={t}>{t}</option>)}</select></label>
      <p className="result">Perte pour « {tokens[target]} » : <strong>{crossEntropy(logits,target).toFixed(4)}</strong> nats</p>
      <p>−ln(p cible). Une cible jugée peu probable entraîne une perte élevée. Le logarithme naturel fixe l’unité « nat ».</p>
    </div></div>
    <details><summary>Expliquer et tester une hypothèse</summary><p>Ajoutez mentalement la même constante aux trois logits : la distribution ne change pas. Avec trois scores égaux, chaque token reçoit 1/3 et la perte vaut ln(3) ≈ 1,0986. La soustraction du maximum évite de calculer des exponentielles trop grandes.</p></details>
    <p className="lab-limit">Prérequis : fractions et notion de probabilité. Données : trois scores fictifs. Limite : aucun contexte encodé, aucune attention et aucun apprentissage. La couleur du ciel n’est pas vérifiée par cette expérience.</p>
  </div>;
}

