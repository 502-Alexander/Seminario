// src/components/TicketEntrada.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Barcode from 'react-barcode';
import './Ticket_Entrada.css';

const TicketEntrada = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vehiculo = location.state || {};

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

        <p><strong>Número de Placa:</strong> {vehiculo.placa || '---'}</p>
        <p><strong>Marca:</strong> {vehiculo.marca || '---'}</p>
        <p><strong>Color:</strong> {vehiculo.color || '---'}</p>
        <p><strong>Tipo:</strong> {vehiculo.tipo || '---'}</p>
        <p><strong>Fecha:</strong> {vehiculo.fecha || '---'}</p>
        <p><strong>Hora de Entrada:</strong> {vehiculo.hora || '---'}</p>
        <p><strong>TARIFA POR MES</strong></p>
        <hr />

        {/* Código de barras */}
        {vehiculo.codigo_barra && (
          <div className="barcode-section">
            <Barcode value={vehiculo.codigo_barra} width={2} height={60} fontSize={12} />
            <p><strong>{vehiculo.codigo_barra}</strong></p>
          </div>
        )}
        

        <p className="ticket-text">
          EL PROPIETARIO DEL VEHÍCULO SE ESTACIONA POR SU CUENTA Y RIESGO.
          ESTÁ PROHIBIDO VENDER O CEDER ESTE TICKET. EXTRAVIADO SE COBRARÁ $0.50
          Y DEBERÁ COMPROBAR PERMANENTEMENTE LA PROPIEDAD DEL VEHÍCULO.
          EL PARQUEO SE CIERRA A LAS 5:00 P.M.
        </p>
      </div>
      {/* Botón para imprimir */}
  <button 
    className="btn-imprimir"
    onClick={() => window.print()}
  >
    Imprimir Ticket
  </button>
    </div>
  );
};

export default TicketEntrada;
