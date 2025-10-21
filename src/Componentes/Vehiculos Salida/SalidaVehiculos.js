import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaHome, FaCar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SalidaVehiculos.css';

// --- Función para obtener datos del ticket desde la API ---
const obtenerDatosTicket = async (codigo) => {
  try {
    console.log('🔍 DEBUGGING - Buscando ticket con código/ID:', codigo);
    console.log('🔍 DEBUGGING - Tipo de código:', typeof codigo);
    console.log('🔍 DEBUGGING - Longitud del código:', codigo.length);
    console.log('🔍 DEBUGGING - Código trimmed:', codigo.trim());
    
    const codigoLimpio = codigo.trim();
    
    // 🆕 BÚSQUEDA INTELIGENTE MÚLTIPLE
    let resultadoBusqueda = null;
    
    // 1️⃣ PRIMERA OPCIÓN: Buscar por ID o código de barras exacto
    try {
      const url1 = `https://seminario-backend-1.onrender.com/api/ticket/${codigoLimpio}`;
      console.log('🔍 DEBUGGING - Intento 1 - URL:', url1);
      
      const response1 = await fetch(url1);
      console.log('📡 DEBUGGING - Intento 1 - Status:', response1.status);
      
      if (response1.ok) {
        const data1 = await response1.json();
        console.log('📡 DEBUGGING - Intento 1 - Datos:', data1);
        
        if (data1.success) {
          console.log('✅ DEBUGGING - Encontrado con búsqueda directa');
          resultadoBusqueda = data1;
        }
      }
    } catch (error1) {
      console.log('⚠️ DEBUGGING - Error en búsqueda directa:', error1.message);
    }
    
    // 2️⃣ SEGUNDA OPCIÓN: Si contiene guión, extraer placa y buscar por placa
    if (!resultadoBusqueda && codigoLimpio.includes('-')) {
      const placaExtraida = codigoLimpio.split('-')[0];
      console.log('🔍 DEBUGGING - Intento 2 - Placa extraída:', placaExtraida);
      
      try {
        // Buscar por placa usando endpoint personalizado
        const url2 = `https://seminario-backend-1.onrender.com/api/vehiculo-por-placa/${placaExtraida}`;
        console.log('� DEBUGGING - Intento 2 - URL por placa:', url2);
        
        const response2 = await fetch(url2);
        console.log('📡 DEBUGGING - Intento 2 - Status:', response2.status);
        
        if (response2.ok) {
          const data2 = await response2.json();
          console.log('📡 DEBUGGING - Intento 2 - Datos:', data2);
          
          if (data2.success) {
            console.log('✅ DEBUGGING - Encontrado con búsqueda por placa');
            resultadoBusqueda = data2;
          }
        }
      } catch (error2) {
        console.log('⚠️ DEBUGGING - Error en búsqueda por placa:', error2.message);
      }
      
      // 3️⃣ TERCERA OPCIÓN: Buscar manualmente en la lista de códigos disponibles
      if (!resultadoBusqueda) {
        try {
          console.log('🔍 DEBUGGING - Intento 3 - Buscando en lista de códigos disponibles');
          const response3 = await fetch('https://seminario-backend-1.onrender.com/api/test/codigos-disponibles');
          
          if (response3.ok) {
            const data3 = await response3.json();
            console.log('📡 DEBUGGING - Intento 3 - Códigos disponibles obtenidos');
            
            // Buscar en la lista por placa
            const vehiculoEncontrado = data3.codigos.find(v => v.placa === placaExtraida);
            
            if (vehiculoEncontrado) {
              console.log('✅ DEBUGGING - Encontrado en lista de códigos:', vehiculoEncontrado);
              
              // Obtener datos completos usando el ID encontrado
              const url4 = `https://seminario-backend-1.onrender.com/api/ticket/${vehiculoEncontrado.codigo_barras}`;
              const response4 = await fetch(url4);
              
              if (response4.ok) {
                const data4 = await response4.json();
                if (data4.success) {
                  console.log('✅ DEBUGGING - Datos completos obtenidos por ID:', data4);
                  resultadoBusqueda = data4;
                }
              }
            }
          }
        } catch (error3) {
          console.log('⚠️ DEBUGGING - Error en búsqueda manual:', error3.message);
        }
      }
    }
    
    // PROCESAR RESULTADO FINAL
    if (resultadoBusqueda && resultadoBusqueda.success) {
      console.log('✅ DEBUGGING - Ticket encontrado exitosamente:', resultadoBusqueda);
      return {
        success: true,
        ticketId: resultadoBusqueda.ticketId,
        codigoBarras: resultadoBusqueda.codigoBarras || codigoLimpio, // Usar el código ingresado si no hay uno guardado
        placa: resultadoBusqueda.placa,
        horaEntrada: resultadoBusqueda.horaEntrada,
        vehiculo: resultadoBusqueda.vehiculo
      };
    } else {
      console.log('❌ DEBUGGING - Ticket no encontrado con ningún método');
      return { success: false, error: `No se encontró vehículo con código/placa: ${codigoLimpio}` };
    }
  } catch (error) {
    console.error('💥 DEBUGGING - Error completo al obtener datos del ticket:', error);
    console.error('💥 DEBUGGING - Error message:', error.message);
    console.error('💥 DEBUGGING - Error stack:', error.stack);
    return { success: false, error: error.message };
  }
};

// --- Componente Principal ---
const SalidaVehiculos = () => {
  const navigate = useNavigate();
  
  // Estados para manejar los datos del formulario y la lógica
  const [codigoBarras, setCodigoBarras] = useState('');
  const [datosTicket, setDatosTicket] = useState(null);
  const [ticketEncontrado, setTicketEncontrado] = useState(false);
  const [tiempoEstacionado, setTiempoEstacionado] = useState(null);
  const [montoAPagar, setMontoAPagar] = useState(0);
  const [efectivoRecibido, setEfectivoRecibido] = useState('');
  const [cambioADar, setCambioADar] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(null);
  const [infoTarifa, setInfoTarifa] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  
  // Ref para mantener referencia del intervalo
  const intervaloRef = useRef(null);
  const datosTicketRef = useRef(null);

  // Función para calcular tarifa dinámica según tiempo
  const calcularTarifaDinamica = (minutos) => {
    let tarifa = 0;
    let descripcion = "";
    
    if (minutos <= 30) {
      tarifa = 6.00;
      descripcion = "Tarifa por media hora (0-30 min)";
    } else if (minutos <= 60) {
      tarifa = 12.00;
      descripcion = "Tarifa por una hora (31-60 min)";
    } else {
      // Para más de una hora, cobramos por horas adicionales completas
      const horasAdicionales = Math.ceil((minutos - 60) / 60);
      tarifa = 12.00 + (horasAdicionales * 12.00);
      descripcion = `Tarifa por ${Math.ceil(minutos / 60)} hora(s)`;
    }
    
    return {
      monto: parseFloat(tarifa.toFixed(2)),
      descripcion: descripcion,
      desglose: obtenerDesgloseTarifa(minutos)
    };
  };

  // Función para mostrar desglose detallado
  const obtenerDesgloseTarifa = (minutos) => {
    if (minutos <= 30) {
      return "Media hora: Q6.00";
    } else if (minutos <= 60) {
      return "Una hora: Q12.00";
    } else {
      const horasCompletas = Math.ceil(minutos / 60);
      return `${horasCompletas} hora(s) × Q12.00 cada una`;
    }
  };

  // Función para resetear el formulario
  const resetFormulario = useCallback(() => {
    setCodigoBarras('');
    setDatosTicket(null);
    setTicketEncontrado(false);
    setTiempoEstacionado(null);
    setMontoAPagar(0);
    setEfectivoRecibido('');
    setCambioADar(0);
    setInfoTarifa(null);
    setUltimaActualizacion(null);
    
    // Limpiar referencias
    datosTicketRef.current = null;
    
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    
    if (autoRefresh) {
      clearInterval(autoRefresh);
      setAutoRefresh(null);
    }
  }, [autoRefresh]);

  // Función para recalcular tiempo en tiempo real (CORREGIDA - SIN ZONA HORARIA)
  const recalcularTiempo = useCallback((ticketData = null) => {
    const ticket = ticketData || datosTicketRef.current;
    
    if (!ticket) {
      console.log('❌ No hay datos del ticket para recalcular');
      return;
    }
    
    console.log('🔄 Recalculando con ticket:', ticket.ticketId);
    
    // Usar fechas directamente sin conversiones complicadas
    const horaSalida = new Date(); // Hora actual
    const horaEntrada = new Date(ticket.horaEntrada); // Hora de entrada desde BD
    
    console.log('🕐 DEBUG - Hora de entrada desde BD:', ticket.horaEntrada);
    console.log('🕐 DEBUG - Hora actual:', horaSalida.toISOString());
    console.log('🕐 DEBUG - Hora entrada parseada:', horaEntrada.toISOString());
    
    // Verificar si las fechas son válidas
    if (isNaN(horaEntrada.getTime())) {
      console.error('❌ Fecha de entrada inválida:', ticket.horaEntrada);
      setTiempoEstacionado('Error: Fecha inválida');
      return;
    }
    
    // Calcular diferencia directamente
    const diferenciaMs = horaSalida.getTime() - horaEntrada.getTime();
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
    console.log('⏱️ DEBUG - Diferencia en ms:', diferenciaMs);
    console.log('⏱️ DEBUG - Diferencia en horas:', diferenciaHoras.toFixed(2));
    
    let minutosReales = Math.floor(diferenciaMs / (1000 * 60));
    let segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

    console.log('📊 DEBUG - Minutos reales calculados:', minutosReales);
    console.log('📊 DEBUG - Segundos calculados:', segundos);

    // Asegurar que no sea menor a 0
    minutosReales = Math.max(0, minutosReales);
    segundos = Math.max(0, segundos);

    let minutosParaCobro = Math.max(minutosReales, 1); // Mínimo 1 minuto para cobro

    // Mostrar tiempo real
    let tiempoMostrar;
    if (minutosReales < 1) {
      tiempoMostrar = `0h 0m ${segundos}s (Tiempo real) 🔄`;
    } else {
      const horas = Math.floor(minutosReales / 60);
      const minRestantes = minutosReales % 60;
      tiempoMostrar = `${horas}h ${minRestantes}m (${minutosReales} min total) 🔄`;
    }
    
    console.log('💬 DEBUG - Tiempo a mostrar:', tiempoMostrar);
    setTiempoEstacionado(tiempoMostrar);

    // Calcular tarifa
    const tarifaInfo = calcularTarifaDinamica(minutosParaCobro);
    setMontoAPagar(tarifaInfo.monto.toFixed(2));
    setInfoTarifa(tarifaInfo);
    setUltimaActualizacion(new Date().toLocaleTimeString());
    
    console.log('✅ Recálculo completado - tiempo corregido');
  }, []);

  // Efecto principal para búsqueda de tickets
  useEffect(() => {
    const buscarTicket = async () => {
      console.log('🎯 DEBUGGING - useEffect ejecutándose');
      console.log('🎯 DEBUGGING - Valor de codigoBarras:', `"${codigoBarras}"`);
      console.log('🎯 DEBUGGING - Longitud codigoBarras:', codigoBarras.length);
      console.log('🎯 DEBUGGING - codigoBarras trimmed:', `"${codigoBarras.trim()}"`);
      console.log('🎯 DEBUGGING - Condición (length > 0):', codigoBarras.trim().length > 0);
      
      if (codigoBarras.trim().length > 0) {
        console.log('🎯 DEBUGGING - Iniciando búsqueda para código:', codigoBarras);
        
        const ticket = await obtenerDatosTicket(codigoBarras.trim());
        console.log('🎯 DEBUGGING - Resultado de búsqueda:', ticket);

        if (ticket.success) {
          console.log('✅ DEBUGGING - Procesando ticket exitoso');
          
          // Solo limpiar campos de pago si es un ticket diferente al actual
          const esMismoTicket = datosTicket && datosTicket.ticketId === ticket.ticketId;
          console.log('🔄 DEBUGGING - Es mismo ticket?', esMismoTicket);
          
          setDatosTicket(ticket);
          setTicketEncontrado(true);
          
          // Guardar datos en ref para el auto-refresh
          datosTicketRef.current = ticket;
          
          // Limpiar campos de pago solo si es un ticket nuevo/diferente
          if (!esMismoTicket) {
            setEfectivoRecibido('');
            setCambioADar(0);
          }
          
          // Recalcular tiempo inmediatamente con los datos
          setTimeout(() => recalcularTiempo(ticket), 100);
          
          // Limpiar auto-refresh anterior si existe
          if (intervaloRef.current) {
            console.log('🛑 DEBUGGING - Limpiando auto-refresh anterior');
            clearInterval(intervaloRef.current);
          }
          
          // Iniciar auto-refresh
          console.log('🚀 DEBUGGING - Iniciando auto-refresh cada 2 segundos');
          const interval = setInterval(() => {
            console.log('🔄 Auto-refresh ejecutándose...', new Date().toLocaleTimeString());
            recalcularTiempo(); // Ya no necesitamos pasar parámetros, usa la ref
          }, 2000);
          
          intervaloRef.current = interval;
          setAutoRefresh(interval);
          
        } else {
          console.log('❌ DEBUGGING - Ticket no encontrado. Error:', ticket.error);
          setDatosTicket(null);
          setTicketEncontrado(false);
          datosTicketRef.current = null;
          setTiempoEstacionado(`Ticket no encontrado: ${ticket.error || 'Código de barras inválido'}`);
          setMontoAPagar(0);
          setInfoTarifa(null);
          setUltimaActualizacion(null);
        }
      } else {
        console.log('🎯 DEBUGGING - Código vacío, reseteando formulario');
        resetFormulario();
      }
    };

    const timeoutId = setTimeout(buscarTicket, 500);
    return () => clearTimeout(timeoutId);
  }, [codigoBarras, recalcularTiempo, resetFormulario]); // Incluye resetFormulario como dependencia

  // Limpiar auto-refresh al desmontar
  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
      if (autoRefresh) {
        clearInterval(autoRefresh);
      }
    };
  }, [autoRefresh]);

  // Lógica de cálculo del cambio
  useEffect(() => {
    const monto = parseFloat(montoAPagar);
    const efectivo = parseFloat(efectivoRecibido) || 0;

    if (efectivo >= monto) {
      const cambio = efectivo - monto;
      setCambioADar(cambio.toFixed(2));
    } else {
      setCambioADar(0);
    }
  }, [montoAPagar, efectivoRecibido]);

  // Manejadores de eventos
  const handlePagoChange = (e) => {
    const valor = e.target.value.replace(/[^0-9.]/g, '');
    setEfectivoRecibido(valor);
  };

  const handleProcesarPago = async () => {
    // Validaciones mejoradas
    if (!datosTicket) {
      alert('❌ Por favor, escanee un código de barras válido primero.');
      return;
    }
    
    if (!efectivoRecibido || parseFloat(efectivoRecibido) <= 0) {
      alert('❌ Por favor, ingrese el efectivo recibido.');
      return;
    }
    
    if (parseFloat(efectivoRecibido) < parseFloat(montoAPagar)) {
      alert(`❌ Error: El efectivo recibido (Q${efectivoRecibido}) es insuficiente.\nMonto a pagar: Q${montoAPagar}`);
      return;
    }
    
    // Confirmar antes de procesar
    const confirmar = window.confirm(
      `¿Confirmar pago?\n\n` +
      `🚗 Placa: ${datosTicket.placa}\n` +
      `💰 Monto a pagar: Q${montoAPagar}\n` +
      `💵 Efectivo recibido: Q${efectivoRecibido}\n` +
      `💱 Cambio: Q${cambioADar}`
    );
    
    if (!confirmar) {
      return;
    }
    
    try {
      console.log('🔄 Procesando pago para ticket:', datosTicket.ticketId);
      
      const response = await fetch('https://seminario-backend-1.onrender.com/api/vehiculos/salida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: datosTicket.ticketId,
          montoAPagar: parseFloat(montoAPagar),
          efectivoRecibido: parseFloat(efectivoRecibido),
          cambio: parseFloat(cambioADar)
        }),
      });

      console.log('📡 Respuesta del servidor:', response.status);
      const data = await response.json();
      console.log('📊 Datos de respuesta:', data);

      if (response.ok && data.exito) {
        alert(
          `✅ ¡PAGO PROCESADO EXITOSAMENTE!\n\n` +
          `🚗 Placa: ${datosTicket.placa}\n` +
          `💰 Monto pagado: Q${montoAPagar}\n` +
          `💱 Cambio entregado: Q${cambioADar}\n\n` +
          `¡Que tenga buen día! 🚀`
        );
        
        // Limpiar auto-refresh antes de resetear
        if (intervaloRef.current) {
          clearInterval(intervaloRef.current);
          intervaloRef.current = null;
        }
        
        resetFormulario();
        console.log('✅ Pago completado y formulario reseteado');
      } else {
        alert(`❌ Error al procesar pago:\n${data.mensaje || 'Error desconocido'}`);
        console.error('❌ Error del servidor:', data);
      }
    } catch (error) {
      console.error('💥 Error al procesar pago:', error);
      alert(`❌ Error de conexión:\n${error.message}\n\nVerifique que el servidor esté funcionando.`);
    }
  };

  return (
    <div className="salida-vehiculos-container">
      {/* Navegación */}
      <div className="navigation-buttons">
        <button className="btn-regresar" onClick={() => navigate('/menu')}>
          <FaHome style={{ marginRight: 8 }} />
          Regresar al Menú
        </button>
        
        <button className="btn-entrada" onClick={() => navigate('/vehiculos/entrada')}>
          <FaCar style={{ marginRight: 8 }} />
          Ir a Entrada
        </button>
      </div>

      <h2 className="salida-title">🚗 Salidas de vehículos</h2>
      
      <div className="salida-card">
        {/* Campo de Código de Barras */}
        <div className="campo-grupo">
          <label htmlFor="codigoBarras" className="label">
            **Escanear Código de Barras o ID:**
          </label>
          <input
            id="codigoBarras"
            type="text"
            placeholder="ID (ej: 30, 47) o Código de Barras (ej: 789BFG-1234567890)"
            value={codigoBarras}
            onChange={(e) => setCodigoBarras(e.target.value)}
            className="input codigo-barras-campo"
            autoFocus
          />
        </div>

        {/* Código de Barras Escaneado */}
        {datosTicket && (
          <div className="campo-grupo">
            <label className="label">**Código de Barras:**</label>
            <input
              type="text"
              value={datosTicket.codigoBarras || 'No disponible'}
              readOnly
              className="input auto-campo"
            />
          </div>
        )}

        {/* Placa del vehículo */}
        {datosTicket && (
          <div className="campo-grupo">
            <label className="label">**Placa del Vehículo:**</label>
            <input
              type="text"
              value={datosTicket.placa}
              readOnly
              className="input auto-campo"
            />
          </div>
        )}
        
        {/* Tiempo Estacionado */}
        <div className="campo-grupo">
          <label className="label">Tiempo Estacionado:</label>
          <input
            type="text"
            value={tiempoEstacionado || 'Esperando código de barras...'}
            readOnly
            className={`input ${tiempoEstacionado && tiempoEstacionado.includes('no encontrado') ? 'error-campo' : 'auto-campo'}`}
          />
        </div>

        {/* Monto a Pagar */}
        <div className="campo-grupo">
          <label className="label-pago">**Monto a Pagar:**</label>
          <input
            type="text"
            value={`Q${montoAPagar}`}
            readOnly
            className="input monto-campo"
          />
        </div>

        {/* Información de tarifa */}
        {infoTarifa && (
          <div className="campo-grupo">
            <label className="label">Tipo de Tarifa:</label>
            <input
              type="text"
              value={infoTarifa.descripcion}
              readOnly
              className="input auto-campo"
              style={{ fontSize: '0.9em' }}
            />
          </div>
        )}

        {/* Desglose de tarifa */}
        {infoTarifa && (
          <div className="campo-grupo">
            <label className="label">Desglose:</label>
            <input
              type="text"
              value={infoTarifa.desglose}
              readOnly
              className="input auto-campo"
              style={{ fontSize: '0.9em', color: '#666' }}
            />
          </div>
        )}

        {/* Última actualización */}
        {ultimaActualizacion && (
          <div className="campo-grupo">
            <label className="label" style={{ fontSize: '0.8em', color: '#888' }}>
              Última actualización:
            </label>
            <input
              type="text"
              value={`${ultimaActualizacion} (Auto-refresh cada 2s)`}
              readOnly
              className="input"
              style={{ 
                fontSize: '0.8em', 
                color: '#666', 
                backgroundColor: '#f0f8ff',
                border: '1px dashed #007bff'
              }}
            />
          </div>
        )}

        <hr className="separador" />

        {/* Efectivo Recibido */}
        <div className="campo-grupo">
          <label htmlFor="efectivoRecibido" className="label-pago">
            **Efectivo Recibido:**
          </label>
          <input
            id="efectivoRecibido"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={efectivoRecibido}
            onChange={handlePagoChange}
            className="input efectivo-campo"
          />
        </div>

        {/* Cambio a Dar */}
        <div className="campo-grupo">
          <label className="label-pago">**Cambio a Dar:**</label>
          <input
            type="text"
            value={`Q${cambioADar}`}
            readOnly
            className="input cambio-campo"
          />
        </div>

        {/* Botones */}
        <div className="botones">
          <button onClick={handleProcesarPago} className="boton-pagar">
            Procesar Pago
          </button>
          <button onClick={resetFormulario} className="boton-cancelar">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalidaVehiculos;