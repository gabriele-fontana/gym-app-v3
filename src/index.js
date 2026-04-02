import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { register as registerSW } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enable offline-first PWA behaviour in production builds
registerSW({
  onUpdate: () => {
    // Optional: show a "New version available — reload?" toast here
    console.log('[PWA] App updated. Reload to get the latest version.');
  },
});

reportWebVitals();
