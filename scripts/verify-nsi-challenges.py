#!/usr/bin/env python3
"""Exécute les corrigés des dix missions NSI dans un environnement Python standard."""

import contextlib
import io
import json
from pathlib import Path


def load_challenges():
    source = Path("src/content/nsiChallenges.ts").read_text(encoding="utf-8")
    declaration = "export const nsiChallenges: Record<string, NsiChallenge> = "
    if declaration not in source:
        raise AssertionError("Déclaration des missions introuvable")
    payload = source.split(declaration, 1)[1]
    challenges, _ = json.JSONDecoder().raw_decode(payload)
    return challenges


def verify():
    challenges = load_challenges()
    if len(challenges) != 10:
        raise AssertionError("Dix missions sont attendues")
    for identifiant, challenge in sorted(challenges.items()):
        if identifiant != challenge["id"]:
            raise AssertionError(f"Identifiant incohérent : {identifiant}")
        starter = challenge["starter"]
        solution = challenge["solution"]
        if "TODO" not in starter or "assert " not in starter:
            raise AssertionError(f"Mission non guidée : {identifiant}")
        compile(starter, f"{identifiant}-depart.py", "exec")
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            exec(compile(solution, f"{identifiant}-corrige.py", "exec"), {"__builtins__": __builtins__})
        if "tests réussis" not in output.getvalue():
            raise AssertionError(f"Assertions non exécutées : {identifiant}")
        print(f"OK — {identifiant}")
    print("Dix corrigés Python exécutés avec succès.")


if __name__ == "__main__":
    verify()
