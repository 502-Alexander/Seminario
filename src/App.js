import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './Componentes/Login/Login';
import Navbar from './Componentes/Menu/Menu';
import Vehiculos from './Componentes/Vehiculos Entrada/EntradaVehiculos'; // Ajusta si está en otra carpeta
import ProtectedRoute from './ProtectedRoute';
import TicketEntrada from './Componentes/Ticket Entrada/Ticket_Entrada'; // importa el nuevo componente


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute>
            <Navbar />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/vehiculos" 
        element={
          <ProtectedRoute>
            <Vehiculos />
          </ProtectedRoute>
        } 
      />


      <Route 
        path="/ticket" 
        element={
          <ProtectedRoute>
            <TicketEntrada />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
