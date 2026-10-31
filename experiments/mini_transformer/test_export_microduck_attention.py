import tempfile
import unittest
from pathlib import Path
from export_microduck_attention import check, export

class TestExportMicroduck(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.path, cls.data = export(steps=3, seed=12,
                                    output=Path(cls.temp.name) / "index.html")
    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()
    def test_invariants_reels(self):
        check(self.data)
    def test_pas_de_donnees_fictives_dans_la_page(self):
        html = self.path.read_text(encoding="utf-8")
        self.assertNotIn("__PAYLOAD__", html)
        self.assertIn('"before"', html)
        self.assertIn('"after"', html)
        self.assertIn("Microduck explore une vraie matrice", html)
    def test_protection_contre_masque_invalide(self):
        import copy
        data = copy.deepcopy(self.data)
        data["before"]["heads"][0][0][-1] = 0.15
        with self.assertRaises(ValueError):
            check(data)

if __name__ == "__main__":
    unittest.main()
