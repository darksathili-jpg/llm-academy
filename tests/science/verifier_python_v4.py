"""V4-Q3 — Exécuter les 15 programmes Python originaux du pilote.

Usage : python tests/science/verifier_python_v4.py
Exécution hors navigateur sur du code extrait de l'artefact local.
Aucun modèle distant, aucune dépendance externe.
"""
from __future__ import annotations

import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[2]
HTML = ROOT / "public" / "pilotes" / "formation-v4" / "index.html"

def extraire_programmes(html: str) -> list[str]:
    # Six premiers chapitres : littéraux template JS, terminés par pyExplain.
    initiaux = re.findall(
        r"\bpython:\s*`([\s\S]*?)`,\s*pyExplain:",
        html,
    )
    # Neuf chapitres suivants : propriétés JSON échappées.
    quotes = re.findall(r'"python"\s*:\s*("(?:\\.|[^"\\])*")', html)
    suivants = [json.loads(q) for q in quotes]
    if len(initiaux) != 6 or len(suivants) != 9:
        raise ValueError(
            f"Structure inattendue : {len(initiaux)} littéraux JS et "
            f"{len(suivants)} propriétés JSON, attendus 6 et 9"
        )
    return initiaux + suivants

def main() -> int:
    programmes = extraire_programmes(HTML.read_text(encoding="utf-8"))
    echecs = 0
    with tempfile.TemporaryDirectory(prefix="v4-q3-") as dossier:
        for numero, source in enumerate(programmes, start=1):
            fichier = Path(dossier) / f"chapitre_{numero:02d}.py"
            fichier.write_text(source, encoding="utf-8")
            try:
                p = subprocess.run(
                    [sys.executable, "-I", str(fichier)],
                    capture_output=True, text=True, encoding="utf-8",
                    errors="replace", timeout=8, cwd=dossier,
                    check=False,
                )
                if p.returncode == 0:
                    print(f"OK    {numero:02d} : assertions et exécution")
                else:
                    echecs += 1
                    print(f"ECHEC {numero:02d} : code {p.returncode}\n{p.stderr}")
            except subprocess.TimeoutExpired:
                echecs += 1
                print(f"ECHEC {numero:02d} : délai de 8 s dépassé")
    print(f"Bilan : {15 - echecs}/15 programmes exécutés sans erreur")
    return 1 if echecs else 0

if __name__ == "__main__":
    sys.exit(main())
