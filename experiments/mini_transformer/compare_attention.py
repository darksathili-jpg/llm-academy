"""Laboratoire comparatif : poids d'attention réels avant/après entraînement.
Sortie HTML autonome ; aucun appel réseau.
"""
import argparse
import json
from pathlib import Path
import torch
from mini_transformer import MiniTransformer, make_split_data, batch, evaluate

@torch.no_grad()
def observe(model, ids):
    model.eval()
    positions=torch.arange(ids.shape[1])
    x=model.embeddings(ids)+model.positions(positions)
    _, weights=model.block.attention(model.block.ln1(x), return_attention=True)
    logits,_=model(ids)
    return {
        "heads":weights[0].tolist(),
        "probs":torch.softmax(logits[0,-1],dim=-1).tolist()
    }

def build_comparison(steps=250, seed=42, prompt="le chat ", path=None):
    if steps<1: raise ValueError("steps >= 1")
    torch.manual_seed(seed);torch.set_num_threads(1)
    training,validation,enc,dec=make_split_data()
    if not prompt or len(prompt)>32 or not set(prompt).issubset(enc):
        raise ValueError("Prompt non vide, connu et au plus 32 caractères")
    model=MiniTransformer(len(enc))
    ids=torch.tensor([[enc[c] for c in prompt]],dtype=torch.long)
    initial=observe(model,ids)
    optimizer=torch.optim.AdamW(model.parameters(),lr=.003)
    rng=torch.Generator().manual_seed(seed+1)
    for _ in range(steps):
        model.train()
        x,y=batch(training,model.context,16,rng)
        _,loss=model(x,y)
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        optimizer.step()
    final=observe(model,ids)
    result={"prompt":list(prompt),"steps":steps,"seed":seed,
            "before":initial,"after":final,
            "validation_loss":evaluate(model,validation,model.context,rng),
            "chars":[dec[i] for i in range(len(dec))]}
    if path is not None:
        template=Path(__file__).with_name("compare_attention_template.html").read_text(encoding="utf-8")
        payload=json.dumps(result,ensure_ascii=False).replace("<","\\u003c")
        Path(path).write_text(template.replace("__PAYLOAD__",payload),encoding="utf-8")
    return result

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--steps",type=int,default=250)
    parser.add_argument("--seed",type=int,default=42)
    parser.add_argument("--prompt",default="le chat ")
    args=parser.parse_args()
    output=Path(__file__).with_name("attention_avant_apres.html")
    result=build_comparison(args.steps,args.seed,args.prompt,output)
    print(f"Comparaison générée : {output}")
    print(f"Attention : 4 têtes, {len(result['prompt'])} positions ; validation {result['validation_loss']:.3f}")
