import React from 'react';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Ticket_Entrada.css';

const TicketEntrada = () => {
  const navigate = useNavigate();

  return (
    <div className="ticket-container">
      <button 
        className="btn-regresar"
        onClick={() => navigate('/menu')}
      >
        <FaHome style={{ marginRight: 8 }} />
        Regresar al Menú
      </button>

      <div className="ticket">
        <h2>Ticket de Entrada</h2>
        <p><strong>Placa:</strong> ________</p>
        <p><strong>Marca:</strong> ________</p>
        <p><strong>Color:</strong> ________</p>
        <p><strong>Tipo:</strong> ________</p>
        <p><strong>Hora de Ingreso:</strong> ________</p>
      </div>
    </div>
  );
};

export default TicketEntrada;
