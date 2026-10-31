"""Mini-Transformer autorégressif pédagogique — modèle neuronal réel (PyTorch).

Lancement :
  python -m pip install torch
  python mini_transformer.py --steps 250 --seed 42
Le corpus d'exemple est réduit : génération expérimentale, pas LLM généraliste.
"""
from __future__ import annotations
import argparse
import math
import random
import torch
from torch import nn
from torch.nn import functional as F

TEXT = ("""le chat regarde la lune.
le chien regarde le jardin.
la pluie tombe sur la ville.
le soleil brille sur la ville.
la lune éclaire le jardin.
le chat dort dans la maison.
le chien joue dans le jardin.
le vent souffle dans la ville.
""" * 50)

def make_data(text: str):
    chars = sorted(set(text))
    encode = {char: i for i, char in enumerate(chars)}
    decode = {i: char for char, i in encode.items()}
    data = torch.tensor([encode[c] for c in text], dtype=torch.long)
    cut = int(0.9 * len(data))
    return data[:cut], data[cut:], encode, decode

class CausalAttention(nn.Module):
    def __init__(self, dim: int, heads: int, context: int):
        super().__init__()
        assert dim % heads == 0
        self.heads, self.head_dim = heads, dim // heads
        self.qkv = nn.Linear(dim, 3 * dim)
        self.out = nn.Linear(dim, dim)
        self.register_buffer("mask", torch.tril(torch.ones(context, context, dtype=torch.bool)))
    def forward(self, x, return_attention=False):
        batch, steps, dim = x.shape
        q, k, v = self.qkv(x).chunk(3, dim=-1)
        def split(t):
            return t.reshape(batch, steps, self.heads, self.head_dim).transpose(1, 2)
        q, k, v = split(q), split(k), split(v)
        scores = q @ k.transpose(-2, -1) / math.sqrt(self.head_dim)
        scores = scores.masked_fill(~self.mask[:steps, :steps], float("-inf"))
        weights = torch.softmax(scores, dim=-1)
        values = weights @ v
        values = values.transpose(1, 2).contiguous().reshape(batch, steps, dim)
        output = self.out(values)
        return (output, weights) if return_attention else output

class Block(nn.Module):
    def __init__(self, dim: int, heads: int, context: int):
        super().__init__()
        self.ln1 = nn.LayerNorm(dim)
        self.attention = CausalAttention(dim, heads, context)
        self.ln2 = nn.LayerNorm(dim)
        self.ff = nn.Sequential(nn.Linear(dim, 4*dim), nn.GELU(), nn.Linear(4*dim, dim))
    def forward(self, x):
        x = x + self.attention(self.ln1(x))
        return x + self.ff(self.ln2(x))

class MiniTransformer(nn.Module):
    def __init__(self, vocab: int, context=32, dim=48, heads=4):
        super().__init__()
        self.context = context
        self.embeddings = nn.Embedding(vocab, dim)
        self.positions = nn.Embedding(context, dim)
        self.block = Block(dim, heads, context)
        self.norm = nn.LayerNorm(dim)
        self.lm_head = nn.Linear(dim, vocab)
    def forward(self, ids, targets=None):
        batch, steps = ids.shape
        if steps > self.context:
            raise ValueError("Séquence plus longue que la fenêtre de contexte")
        pos = torch.arange(steps, device=ids.device)
        x = self.embeddings(ids) + self.positions(pos)
        logits = self.lm_head(self.norm(self.block(x)))
        loss = None
        if targets is not None:
            loss = F.cross_entropy(logits.reshape(-1, logits.size(-1)), targets.reshape(-1))
        return logits, loss

@torch.no_grad()
def generate(model, prompt, count, temperature=1., top_k=5, seed=42):
    if temperature <= 0 or not math.isfinite(temperature):
        raise ValueError("température strictement positive")
    if top_k < 1:
        raise ValueError("top_k >= 1")
    gen = torch.Generator(device=prompt.device).manual_seed(seed)
    ids = prompt.clone()
    model.eval()
    for _ in range(count):
        logits, _ = model(ids[:, -model.context:])
        next_logits = logits[:, -1, :] / temperature
        values, idx = next_logits.topk(min(top_k, next_logits.shape[-1]), dim=-1)
        probs = F.softmax(values, dim=-1)
        chosen = torch.multinomial(probs, 1, generator=gen)
        ids = torch.cat((ids, idx.gather(-1, chosen)), dim=1)
    return ids

def batch(data, context, batch_size, generator):
    limit = len(data) - context - 1
    if limit <= 0:
        raise ValueError("Corpus trop court pour la fenêtre de contexte")
    starts = torch.randint(limit, (batch_size,), generator=generator)
    x = torch.stack([data[i:i+context] for i in starts])
    y = torch.stack([data[i+1:i+context+1] for i in starts])
    return x, y

@torch.no_grad()
def evaluate(model, data, context, generator):
    model.eval()
    losses=[]
    for _ in range(8):
        x, y = batch(data, context, 12, generator)
        _, loss = model(x, y)
        losses.append(loss.item())
    return sum(losses)/len(losses)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--steps", type=int, default=250)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--prompt", default="le chat ")
    args=parser.parse_args()
    torch.set_num_threads(1)
    random.seed(args.seed)
    torch.manual_seed(args.seed)
    train, val, enc, dec = make_data(TEXT)
    model=MiniTransformer(len(enc))
    opt=torch.optim.AdamW(model.parameters(), lr=0.003)
    sampler=torch.Generator().manual_seed(args.seed + 1)
    for step in range(args.steps+1):
        if step % max(1,args.steps//5)==0:
            train_loss=evaluate(model,train,model.context,sampler)
            val_loss=evaluate(model,val,model.context,sampler)
            print(f"pas={step:4d} perte_train={train_loss:.3f} perte_val={val_loss:.3f} perplexité_val={math.exp(val_loss):.2f}")
        if step==args.steps: break
        model.train()
        x,y=batch(train,model.context,16,sampler)
        _,loss=model(x,y)
        opt.zero_grad(set_to_none=True)
        loss.backward()
        opt.step()
    unknown=set(args.prompt)-set(enc)
    if unknown: raise ValueError(f"Caractères absents du corpus : {sorted(unknown)}")
    prompt=torch.tensor([[enc[c] for c in args.prompt]],dtype=torch.long)
    out=generate(model,prompt,120,seed=args.seed)
    print("\nGÉNÉRATION :\n"+''.join(dec[i] for i in out[0].tolist()))
    print("\nModèle de démonstration : apprentissage sur petit corpus, aucune compréhension garantie.")

if __name__=="__main__":
    main()
