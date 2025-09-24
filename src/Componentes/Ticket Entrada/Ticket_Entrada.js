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
        <h2>PARQUEO LA PROSPERIDAD</h2>
        <p><strong>Número de Placa:</strong> 095LBL</p>
        <p><strong>Fecha:</strong> 24/09/2025</p>
        <p><strong>Hora de Entrada:</strong> 10:06:35 AM</p>
        <p><strong>TARIFA POR MES</strong></p>
        <hr />
        <p>
          EL PROPIETARIO DEL VEHÍCULO SE ESTACIONA POR SU CUENTA Y RIESGO SE ESTÁ PROHIBIDO VENDER O CEDER ESTE TICKET. EXTRAVIADO SE COBRARÁ $0.50 Y DEBERÁ COMPROBAR PERMANENTEMENTE LA PROPIEDAD DEL VEHÍCULO. EL PARQUEO SE CIERRA A LAS 5:00 P.M.
        </p>
      </div>
    </div>
  );
};

export default TicketEntrada;