import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './TicketSalidaPantalla.css';

const TicketSalidaPantalla = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const datosTicket = location.state || {};

  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return new Date().toLocaleDateString('es-GT');
    return new Date(fecha).toLocaleDateString('es-GT');
  };

  // Función para formatear la hora
  const formatearHora = (fecha) => {
    if (!fecha) return new Date().toLocaleTimeString('es-GT', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    return new Date(fecha).toLocaleTimeString('es-GT', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Función para extraer solo los minutos del tiempo estacionado
  const extraerMinutos = (tiempoTexto) => {
    if (!tiempoTexto) return '0';
    const match = tiempoTexto.match(/(\d+)\s*min/);
    return match ? match[1] : '0';
  };

  // Valores para mostrar
  const placaDisplay = datosTicket?.placa || 'Sin placa';
  const montoDisplay = datosTicket?.montoAPagar ? Number(datosTicket.montoAPagar).toFixed(2) : '0.00';
  const efectivoDisplay = datosTicket?.efectivoRecibido ? Number(datosTicket.efectivoRecibido).toFixed(2) : '0.00';
  const cambioDisplay = datosTicket?.cambioADar ? Number(datosTicket.cambioADar).toFixed(2) : '0.00';
  const codigoDisplay = datosTicket?.codigoBarras || datosTicket?.ticketId || datosTicket?.id || '43';

  return (
    <div className="ticket-salida-pantalla-container">
      <button 
        className="btn-regresar"
        onClick={() => navigate('/vehiculos/salida')}
      >
        <FaHome style={{ marginRight: 8 }} />
        Regresar a Salidas
      </button>

      <div className="ticket-salida-completo">
        {/* Encabezado del ticket */}
        <div className="ticket-header">
          <h1>PARQUEO LA</h1>
          <h2>PROSPERIDAD</h2>
        </div>

        {/* Información del ticket */}
        <div className="ticket-info">
          <div className="info-row">
            <span className="label">Numero de Placa:</span>
            <span className="value">{placaDisplay}</span>
          </div>
          
          <div className="info-row">
            <span className="label">Fecha:</span>
            <span className="value">{formatearFecha(datosTicket?.fechaSalida)}</span>
          </div>
          
          <div className="info-row">
            <span className="label">Hora de Entrada:</span>
            <span className="value">{formatearHora(datosTicket?.horaEntrada)}</span>
          </div>
          
          <div className="info-row">
            <span className="label">Hora de Salida:</span>
            <span className="value">{formatearHora(datosTicket?.horaSalida)}</span>
          </div>
          
          <div className="info-row">
            <span className="label">Tiempo:</span>
            <span className="value">{extraerMinutos(datosTicket?.tiempoEstacionado)} minutos</span>
          </div>
        </div>

        {/* Información de pago */}
        <div className="ticket-payment">
          <div className="payment-row total">
            <span className="label">Valor:</span>
            <span className="currency">Q.</span>
            <span className="amount">{montoDisplay}</span>
          </div>
          
          <div className="payment-row">
            <span className="label">Pagado:</span>
            <span className="amount">{efectivoDisplay}</span>
          </div>
          
          <div className="payment-row">
            <span className="label">Cambio:</span>
            <span className="amount">{cambioDisplay}</span>
          </div>
        </div>

        {/* Mensaje de agradecimiento */}
        <div className="ticket-footer">
          <p>Exija su Factura</p>
          <p>Es un gusto servirle</p>
        </div>
      </div>

      {/* Botón para imprimir */}
      <button 
        className="btn-imprimir"
        onClick={() => window.print()}
      >
        🖨️ Imprimir Ticket
      </button>
    </div>
  );
};

export default TicketSalidaPantalla;