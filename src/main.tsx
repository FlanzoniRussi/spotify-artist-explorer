import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initWebVitals } from './lib/web-vitals';
import './index.css';
import App from './App.tsx';

/**
 * Initialize Web Vitals monitoring to track Core Web Vitals metrics
 */
initWebVitals();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
