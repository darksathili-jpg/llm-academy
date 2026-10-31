"""Tests des données disjointes et de l'export visuel ; PyTorch requis."""
import tempfile
import unittest
from pathlib import Path
import torch
from mini_transformer import TRAIN_SENTENCES, VAL_SENTENCES, make_split_data, MiniTransformer
from inspect_attention import export_trace

class TestsInspection(unittest.TestCase):
    def test_phrases_disjointes_avant_repetition(self):
        self.assertFalse(set(TRAIN_SENTENCES) & set(VAL_SENTENCES))
        train, val, enc, dec = make_split_data(repeats=2)
        self.assertGreater(len(train), len(val))
        self.assertEqual(len(enc), len(dec))
        self.assertGreater(len(val), 33)

    def test_visualisation_poids_attention(self):
        with tempfile.TemporaryDirectory() as d:
            out=Path(d)/"trace.html"
            trace=export_trace(out)
            self.assertTrue(out.exists())
            n=len(trace["tokens"])
            self.assertEqual(len(trace["weights"]),n)
            for i,row in enumerate(trace["weights"]):
                self.assertAlmostEqual(sum(row),1.0,places=5)
                self.assertTrue(all(abs(v)<1e-7 for v in row[i+1:]))
            self.assertIn("modèle à poids initialisés aléatoirement",out.read_text(encoding="utf-8"))

if __name__=="__main__":
    unittest.main()
