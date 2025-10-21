import React from 'react';
import './TicketSalidad.css';

const TicketSalida = ({ 
  datosTicket, 
  montoAPagar, 
  efectivoRecibido, 
  cambioADar, 
  tiempoEstacionado,
  fechaSalida,
  horaSalida,
  onCerrar,
  onImprimir 
}) => {
  
  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    if (!fecha) {
      return new Date().toLocaleDateString('es-GT');
    }
    return new Date(fecha).toLocaleDateString('es-GT');
  };

  // Función para formatear la hora
  const formatearHora = (fecha) => {
    if (!fecha) {
      return new Date().toLocaleTimeString('es-GT', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    }
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

  // Función para imprimir
  const handleImprimir = () => {
    window.print();
    if (onImprimir) onImprimir();
  };

  // Obtener valores directamente
  const placaValue = datosTicket?.placa;
  const montoValue = montoAPagar;
  const efectivoValue = efectivoRecibido;
  const cambioValue = cambioADar;

  // Formatear valores para mostrar
  const placaDisplay = placaValue || 'Sin placa';
  const montoDisplay = montoValue ? Number(montoValue).toFixed(2) : '0.00';
  const efectivoDisplay = efectivoValue ? Number(efectivoValue).toFixed(2) : '0.00';
  const cambioDisplay = cambioValue ? Number(cambioValue).toFixed(2) : '0.00';
  const codigoDisplay = datosTicket?.codigoBarras || datosTicket?.ticketId || datosTicket?.id || '43';

  return (
    <div className="ticket-overlay">
      <div className="ticket-container">
        <div className="ticket-content">
          {/* Encabezado del ticket */}
          <div className="ticket-header">
            <h1>PARQUEO</h1>
            <h2>PHOTO & SYSTEM</h2>
          </div>

          {/* Información del ticket */}
          <div className="ticket-info">
            <div className="info-row">
              <span className="label">Numero de Placa:</span>
              <span className="value">{placaDisplay}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Fecha:</span>
              <span className="value">{formatearFecha(fechaSalida)}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Hora de Entrada:</span>
              <span className="value">{formatearHora(datosTicket?.horaEntrada)}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Hora de Salida:</span>
              <span className="value">{formatearHora(horaSalida)}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Tiempo:</span>
              <span className="value">{extraerMinutos(tiempoEstacionado)} minutos</span>
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

          {/* Código de barras (simulado) */}
          <div className="barcode">
            <div className="barcode-lines">
              {codigoDisplay}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="ticket-actions">
          <button className="btn-imprimir" onClick={handleImprimir}>
            🖨️ Imprimir Ticket
          </button>
          <button className="btn-cerrar" onClick={onCerrar}>
            ❌ Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSalida;