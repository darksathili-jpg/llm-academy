"""Tests structurels du mini-Transformer ; nécessite PyTorch.
Lancement : python -m unittest discover -s experiments/mini_transformer -p 'test_*.py'
"""
import unittest
import torch
from mini_transformer import CausalAttention, MiniTransformer, generate, make_data

class TestsMiniTransformer(unittest.TestCase):
    def setUp(self):
        torch.manual_seed(7)
        self.model=MiniTransformer(vocab=12,context=8,dim=16,heads=4).eval()

    def test_dimensions_and_loss(self):
        x=torch.tensor([[1,2,3,4],[4,3,2,1]])
        logits,loss=self.model(x,x)
        self.assertEqual(tuple(logits.shape),(2,4,12))
        self.assertTrue(torch.isfinite(loss))

    def test_future_is_masked(self):
        att=CausalAttention(16,4,8).eval()
        x=torch.randn(1,4,16)
        _,weights=att(x,True)
        self.assertTrue(torch.all(weights.masked_select(torch.triu(torch.ones(4,4,dtype=torch.bool),diagonal=1).expand(1,4,4,4))==0))
        altered=x.clone();altered[:,3,:]+=100
        y1=att(x);y2=att(altered)
        self.assertTrue(torch.allclose(y1[:,:3],y2[:,:3],atol=1e-5))

    def test_generator_reproducible(self):
        x=torch.tensor([[1,2,3]])
        a=generate(self.model,x,10,seed=123)
        b=generate(self.model,x,10,seed=123)
        self.assertTrue(torch.equal(a,b))
        self.assertEqual(tuple(a.shape),(1,13))

    def test_gradient_updates_weights(self):
        model=MiniTransformer(12,context=8,dim=16,heads=4)
        opt=torch.optim.AdamW(model.parameters(),lr=.01)
        before=model.embeddings.weight.detach().clone()
        x=torch.tensor([[1,2,3,4]])
        _,loss=model(x,x)
        loss.backward();opt.step()
        self.assertFalse(torch.equal(before,model.embeddings.weight))

    def test_no_longer_than_context(self):
        with self.assertRaises(ValueError):
            self.model(torch.ones((1,9),dtype=torch.long))

if __name__=='__main__':
    unittest.main()
