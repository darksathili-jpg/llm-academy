"""Produit la mission Microduck avec de VRAIES valeurs exportées du Mini-Transformer.

Commande : python experiments/mini_transformer/export_microduck_attention.py
Pré-requis : PyTorch ; aucune donnée fictive ou requête réseau.
"""
import argparse
import json
import math
from pathlib import Path
from compare_attention import build_comparison

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE = Path(__file__).with_name("microduck_attention_real_template.html")
OUTPUT = ROOT / "public/pilotes/microduck-attention-reelle-r1/index.html"

def check(data):
    n = len(data["prompt"])
    if n < 3:
        raise ValueError("La mission requiert au moins 3 caractères")
    if len(data["before"]["heads"]) != 4 or len(data["after"]["heads"]) != 4:
        raise ValueError("Il faut quatre têtes")
    for state in ("before", "after"):
        for head in data[state]["heads"]:
            if len(head) != n:
                raise ValueError("Lignes incohérentes")
            for i, row in enumerate(head):
                if len(row) != n or not all(math.isfinite(x) for x in row):
                    raise ValueError("Poids invalides")
                if abs(sum(row) - 1) > 1e-5:
                    raise ValueError("Softmax non normalisée")
                if any(abs(v) > 1e-7 for v in row[i + 1:]):
                    raise ValueError("Masque causal violé")
        distribution = data[state]["probs"]
        if len(distribution) != len(data["chars"]) or not all(math.isfinite(p) and p >= 0 for p in distribution):
            raise ValueError("Distribution incohérente")
        if abs(sum(distribution) - 1) > 1e-5:
            raise ValueError("Probabilités non normalisées")

def export(steps=250, seed=42, prompt="le chat ", output=OUTPUT):
    data = build_comparison(steps=steps, seed=seed, prompt=prompt)
    check(data)
    template = TEMPLATE.read_text(encoding="utf-8")
    if template.count("__PAYLOAD__") != 1:
        raise ValueError("Emplacement JSON du gabarit incorrect")
    payload = json.dumps(data, ensure_ascii=False, allow_nan=False).replace("<", "\\u003c")
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(template.replace("__PAYLOAD__", payload), encoding="utf-8")
    return output, data

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--steps", type=int, default=250)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--prompt", default="le chat ")
    args = parser.parse_args()
    output, data = export(args.steps, args.seed, args.prompt)
    print(f"Mission créée : {output}")
    print(f"{len(data['prompt'])} positions · {data['steps']} étapes · validation {data['validation_loss']:.4f}")
