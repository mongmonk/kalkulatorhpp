
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register Service Worker for PWA functionality
console.log('Checking if Service Worker is supported...');
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported, registering on load...');
  window.addEventListener('load', () => {
    console.log('Window loaded, attempting to register Service Worker...');
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('Service Worker registered successfully', reg);
        console.log('Service Worker scope:', reg.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed', err);
        console.error('Service Worker error details:', err.message, err.stack);
      });
  });
} else {
  console.log('Service Worker is not supported in this browser');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
