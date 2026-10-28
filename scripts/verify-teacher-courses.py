#!/usr/bin/env python3
"""Vérifier les programmes Python de référence dans les quatre cours enseignants V5.

Ces contrôles exécutent les exercices Python complets dans les fichiers du dépôt.
Ils ne remplacent pas les tests de compréhension ni la relecture pédagogique.
"""

from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
MODULES = (
    "MODULE_01_MODELES_LANGAGE.md",
    "MODULE_02_TOKENISATION_GENERATION.md",
    "MODULE_03_APPRENTISSAGE_EVALUATION.md",
    "MODULE_04_FIABILITE_SOURCES_RAG.md",
)

count = 0
for filename in MODULES:
    path = ROOT / "docs" / "formation-enseignant" / filename
    content = path.read_text(encoding="utf-8")
    blocks = re.findall(r"```python\s*\n([\s\S]*?)\n```", content)
    runnable = [block for block in blocks if re.search(r"(?m)^def\s+\w+\s*\(", block) and "assert " in block]
    if len(runnable) != 1:
        raise SystemExit(
            f"{filename} : attendu exactement un corrigé Python exécutable, trouvé {len(runnable)}"
        )
    for block in runnable:
        result = subprocess.run(
            [sys.executable, "-I", "-c", block],
            capture_output=True,
            text=True,
            encoding="utf-8",
            timeout=8,
            check=False,
        )
        if result.returncode != 0:
            raise SystemExit(
                f"{filename} : échec du corrigé Python.\n"
                + result.stdout + "\n" + result.stderr
            )
        count += 1
        print(f"{filename} : corrigé Python et assertions exécutés.")

print(f"{count} corrigés enseignants V5 vérifiés, sur {len(MODULES)} modules.")
print("Ces tests ne certifient ni la qualité du français ni les acquis des participants.")
