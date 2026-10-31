import tempfile
import unittest
from pathlib import Path
from compare_attention import build_comparison

class TestComparaison(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp=tempfile.TemporaryDirectory()
        cls.path=Path(cls.tmp.name)/"comparaison.html"
        cls.data=build_comparison(steps=3,seed=12,path=cls.path)
    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()
    def test_masque_et_normalisation(self):
        for stage in ("before","after"):
            heads=self.data[stage]["heads"]
            self.assertEqual(len(heads),4)
            for head in heads:
                for i,row in enumerate(head):
                    self.assertAlmostEqual(sum(row),1.0,places=5)
                    self.assertTrue(all(abs(w)<1e-7 for w in row[i+1:]))
    def test_distribution_et_changement(self):
        a=self.data["before"]["probs"]
        b=self.data["after"]["probs"]
        self.assertAlmostEqual(sum(a),1,places=5)
        self.assertAlmostEqual(sum(b),1,places=5)
        self.assertGreater(sum(abs(x-y) for x,y in zip(a,b)),1e-7)
    def test_html_autonome(self):
        text=self.path.read_text(encoding="utf-8")
        self.assertIn("Que change l'entraînement",text)
        self.assertNotIn("__PAYLOAD__",text)
        self.assertIn('"before"',text)
        self.assertIn('"after"',text)

if __name__=="__main__":
    unittest.main()
