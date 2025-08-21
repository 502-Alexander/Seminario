// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Componentes/Login/Login';
import Navbar from './Componentes/Menu/Menu'; // Tu menú

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/menu" element={<Navbar />} />
    </Routes>
  );
}

export default App;
