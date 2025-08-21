// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // ← Aquí importas App.js
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* ← Ahora se usan las rutas */}
    </BrowserRouter>
  </React.StrictMode>
);
