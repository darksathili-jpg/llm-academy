import { createRoot } from 'react-dom/client';
import App from './App';
import { ProgressProvider } from './components/ProgressProvider';
import './style.css';
createRoot(document.getElementById('root')!).render(
  <ProgressProvider>
    <App />
  </ProgressProvider>,
);
