"""Exporter une inspection HTML hors ligne du vrai mécanisme d'attention.
Exécuter depuis la racine du dépôt:
  python experiments/mini_transformer/inspect_attention.py
"""
from __future__ import annotations
import html
import json
from pathlib import Path
import torch
from mini_transformer import MiniTransformer, make_split_data

def export_trace(out_path: Path, seed=42, prompt="le chat "):
    torch.manual_seed(seed)
    _, _, enc, dec = make_split_data()
    if not set(prompt).issubset(enc):
        raise ValueError("Caractère inconnu dans le prompt")
    model = MiniTransformer(len(enc)).eval()
    ids = torch.tensor([[enc[c] for c in prompt]], dtype=torch.long)
    with torch.no_grad():
        x = model.embeddings(ids) + model.positions(torch.arange(ids.shape[1]))
        qkv_input = model.block.ln1(x)
        _, weights = model.block.attention(qkv_input, return_attention=True)
        logits, _ = model(ids)
        probs = torch.softmax(logits[0, -1], -1)
    data = {
        "tokens": list(prompt),
        "weights": weights[0, 0].tolist(),
        "predictions": sorted(
            [{"token": dec[i], "p": round(p.item(), 6)} for i, p in enumerate(probs)],
            key=lambda entry: entry["p"], reverse=True
        )[:8],
        "seed": seed,
        "trained": False,
    }
    payload = json.dumps(data, ensure_ascii=False).replace("<", "\\u003c")
    page = """<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mini-Transformer — Inspection des poids d'attention</title>
<style>body{font:16px system-ui;background:#101c2d;color:#f6f8fb;max-width:980px;margin:auto;padding:24px}
table{border-collapse:collapse;margin:20px 0}td,th{padding:9px;border:1px solid #718298;text-align:center}
td{color:#08131c;font-weight:bold}.scroll{overflow:auto}p{line-height:1.6}
.bar{background:#70d6be;color:#08131c;padding:5px;margin:5px 0;border-radius:4px;min-width:3em}
</style></head><body><h1>Une attention réellement calculée</h1>
<p>Visualisation issue des matrices Q, K et V d'un mini-Transformer PyTorch.
<strong>Attention : modèle à poids initialisés aléatoirement, non entraîné.</strong>
Les poids d'attention ne sont ni une explication causale de la réponse ni les probabilités du prochain caractère.</p>
<div class="scroll"><table id="heatmap"><caption>Première tête d'attention · lignes : positions courantes ; colonnes : positions consultées</caption></table></div>
<h2>Distribution sur le prochain caractère</h2><div id="predictions"></div>
<p>Les cases futures sont masquées ; leur poids est exactement nul. Les autres poids d'une ligne somment à 1.</p>
<script type="application/json" id="payload">__DATA__</script>
<script>const d=JSON.parse(document.getElementById('payload').textContent);
const t=document.getElementById('heatmap');const head=document.createElement('tr');
for(const label of ['Position',...d.tokens.map((x,i)=>i+' : '+x)]){const e=document.createElement('th');e.textContent=label;head.append(e)}t.append(head);
for(let i=0;i<d.tokens.length;i++){const tr=document.createElement('tr'),th=document.createElement('th');th.textContent=i+' : '+d.tokens[i];tr.append(th);for(let j=0;j<d.tokens.length;j++){const td=document.createElement('td'),v=d.weights[i][j];td.textContent=v.toFixed(3);td.style.background=j>i?'#cad1d9':`rgba(112,214,190,${Math.max(.12,v)})`;td.title=j>i?'Futur masqué':'Poids '+v.toFixed(6);tr.append(td)}t.append(tr)}
const box=document.getElementById('predictions');
for(const o of d.predictions){const p=document.createElement('p');p.textContent=JSON.stringify(o.token)+' : '+(100*o.p).toFixed(2)+' %';box.append(p)}
</script></body></html>""".replace("__DATA__", payload)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(page, encoding="utf-8")
    return data

if __name__ == "__main__":
    destination = Path(__file__).with_name("attention_trace.html")
    data = export_trace(destination)
    print(f"Inspection exportée : {destination}")
    print(f"Première tête : {len(data['weights'])} positions ; 8 prédictions maximum")
