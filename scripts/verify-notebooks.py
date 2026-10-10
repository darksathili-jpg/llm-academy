"""Execute the original notebooks on CPU; assertions are part of the artifacts."""
import ast
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
for path in sorted((ROOT / "public" / "notebooks").glob("*.ipynb")):
    notebook = json.loads(path.read_text(encoding="utf-8"))
    assert notebook["nbformat"] == 4
    namespace = {"__name__": "__main__"}
    for index, cell in enumerate(notebook["cells"]):
        if cell["cell_type"] != "code":
            continue
        source = "".join(cell["source"])
        ast.parse(source)
        exec(compile(source, f"{path.name}:cell{index}", "exec"), namespace)
    print(path.name, ": toutes les cellules exécutées et assertions réussies")
