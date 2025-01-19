// Path: codeSage.fe/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';  // Make sure this path is correct
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();