import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, exportToPDF } from '../../utils/reportUtils';
import './ParkingReports.css';
import { FaHome } from 'react-icons/fa';

// Función para obtener fecha local sin problemas de zona horaria
const getFechaLocal = (fecha = new Date()) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Función para formatear fecha sin problemas de zona horaria
const formatearFecha = (fechaString) => {
  const [year, month, day] = fechaString.split('-');
  return `${day}/${month}/${year}`;
};

// Función para crear Date local sin problemas de zona horaria
const crearFechaLocal = (fechaString) => {
  const [year, month, day] = fechaString.split('-');
  return new Date(year, month - 1, day); // month - 1 porque los meses en JS van de 0-11
};

const ParkingReports = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // Usar función local para evitar problemas de zona horaria
  const fechaHoy = getFechaLocal();
  console.log('📅 Fecha local inicializada:', fechaHoy);
  const [filters, setFilters] = useState({ period: 'day', date: fechaHoy });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [avgDurationHours, setAvgDurationHours] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    const obtenerRegistros = async () => {
      try {
        // Intentar diferentes rutas hasta encontrar una que funcione
        const posiblesRutas = [
          'http://localhost:3001/api/registros',
          'http://localhost:3001/api/test/vehiculos/todos',
          'http://localhost:3001/vehiculos/activos',
          'https://seminario-backend-1.onrender.com/api/registros',
          'https://seminario-backend-1.onrender.com/api/test/vehiculos/todos',
          'https://seminario-backend-1.onrender.com/vehiculos/activos'
        ];
        
        let respuesta;
        let urlExitosa = '';
        
        for (const url of posiblesRutas) {
          try {
            console.log(`🔍 Probando: ${url}`);
            respuesta = await fetch(url);
            if (respuesta.ok) {
              urlExitosa = url;
              console.log(`✅ ¡Éxito con: ${url}`);
              break;
            } else {
              console.log(`❌ Error ${respuesta.status} en: ${url}`);
            }
          } catch (error) {
            console.log(`❌ Fallo de conexión en: ${url} - ${error.message}`);
          }
        }
        
        if (!urlExitosa) {
          throw new Error('No se pudo conectar a ninguna ruta disponible');
        }
        const data = await respuesta.json();
        console.log('Respuesta completa del backend:', data);
        console.log('URL exitosa utilizada:', urlExitosa);
        
        // Manejar diferentes estructuras de respuesta
        let datosReales;
        if (data.registros) {
          // Formato: { registros: [...] } - nueva ruta /api/registros
          datosReales = data.registros;
        } else if (data.vehiculos) {
          // Formato: { vehiculos: [...] }
          datosReales = data.vehiculos;
        } else if (Array.isArray(data)) {
          // Formato: [...]
          datosReales = data;
        } else if (data.data) {
          // Formato: { data: [...] }
          datosReales = data.data;
        } else {
          // Cualquier otro formato
          datosReales = [data];
        }
        
        console.log('Datos extraídos:', datosReales);
        
        // Mapear los campos del backend a los campos que espera el componente
        const datosFormateados = datosReales.map(vehiculo => {
          // Detectar el formato de fecha - múltiples posibles nombres
          const fechaIngreso = vehiculo.hora_ingreso || vehiculo.entryDate || vehiculo.fecha_ingreso || vehiculo.fecha_entrada || vehiculo.timestamp_entrada;
          const fechaSalida = vehiculo.hora_salida || vehiculo.exitTime || vehiculo.fecha_salida || vehiculo.timestamp_salida;
          
          // Detectar el monto - múltiples posibles nombres
          const monto = vehiculo.monto_pagado || vehiculo.monto || vehiculo.amount || vehiculo.total || vehiculo.precio || vehiculo.tarifa || 0;
          
          console.log(`🔍 Procesando vehículo ID ${vehiculo.id}:`, {
            fechaIngreso,
            fechaSalida,
            monto,
            vehiculoCompleto: vehiculo
          });
          
          return {
            id: vehiculo.id,
            plate: vehiculo.placa || vehiculo.plate || vehiculo.numero_placa,
            brand: vehiculo.marca || vehiculo.brand || vehiculo.fabricante,
            color: vehiculo.color,
            tipo: vehiculo.tipo || vehiculo.type,
            estado: vehiculo.estado || vehiculo.status,
            entryDate: fechaIngreso ? fechaIngreso.split('T')[0] : '', 
            entryTime: fechaIngreso ? new Date(fechaIngreso).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }) : '',
            exitTime: fechaSalida ? new Date(fechaSalida).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }) : '',
            duration: fechaIngreso && fechaSalida ? 
              ((new Date(fechaSalida) - new Date(fechaIngreso)) / (1000 * 60 * 60)).toFixed(1) + ' hrs' : '',
            amount: monto,
            efectivoRecibido: vehiculo.efectivo_recibido || vehiculo.efectivo || 0,
            cambio: vehiculo.cambio || 0,
            // Campos adicionales para debug
            rawData: vehiculo
          };
        });
        
        console.log('Datos formateados para el componente:', datosFormateados);
        setAllData(datosFormateados);
      } catch (error) {
        console.error('❌ Error completo al obtener los datos:', error);
        console.error('Detalles del error:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        // Mostrar un mensaje más específico al usuario
        const errorMessage = error.message.includes('Failed to fetch') 
          ? 'No se puede conectar al servidor. Verifica que el backend esté corriendo en puerto 3001.'
          : `Error del servidor: ${error.message}`;
          
        alert(`${errorMessage}\n\nMostrando datos de ejemplo para que puedas probar las funciones.`);
        
        // Datos de ejemplo para desarrollo
        const datosEjemplo = [
          // Datos de hoy (2025-10-07)
          {
            id: 1,
            plate: 'ABC-123',
            brand: 'Toyota',
            entryDate: '2025-10-07',
            entryTime: '08:00',
            exitTime: '10:30',
            duration: '2.5',
            amount: 15.00
          },
          {
            id: 2,
            plate: 'XYZ-789',
            brand: 'Honda',
            entryDate: '2025-10-07',
            entryTime: '09:15',
            exitTime: '11:45',
            duration: '2.5',
            amount: 15.00
          },
          // Datos de ayer (2025-10-06)
          {
            id: 3,
            plate: 'DEF-456',
            brand: 'Nissan',
            entryDate: '2025-10-06',
            entryTime: '10:00',
            exitTime: '12:00',
            duration: '2.0',
            amount: 12.00
          },
          {
            id: 4,
            plate: 'GHI-789',
            brand: 'Mazda',
            entryDate: '2025-10-06',
            entryTime: '14:00',
            exitTime: '16:30',
            duration: '2.5',
            amount: 15.00
          },
          // Datos de hace una semana (2025-10-01)
          {
            id: 5,
            plate: 'JKL-012',
            brand: 'Ford',
            entryDate: '2025-10-01',
            entryTime: '11:00',
            exitTime: '13:00',
            duration: '2.0',
            amount: 12.00
          },
          // Datos del mes pasado (2025-09-30)
          {
            id: 6,
            plate: 'MNO-345',
            brand: 'Chevrolet',
            entryDate: '2025-09-30',
            entryTime: '15:00',
            exitTime: '17:00',
            duration: '2.0',
            amount: 12.00
          }
        ];
        setAllData(datosEjemplo);
        alert('No se pudo conectar al servidor. Mostrando datos de ejemplo.');
      }
    };
    obtenerRegistros();
  }, []);

  useEffect(() => {
    let result = [...allData];
    const filterDate = new Date(filters.date);
    
    console.log('Filtros aplicados:', filters);
    console.log('Fecha seleccionada:', filterDate);
    console.log('Datos originales:', allData);

    switch (filters.period) {
      case 'day':
        result = result.filter(record => {
          // Comparar solo la fecha, sin la hora
          const recordDate = record.entryDate || record.fechaEntrada;
          return recordDate === filters.date;
        });
        setDateRange(`Día: ${formatearFecha(filters.date)}`);
        break;
        
      case 'week': {
        // Obtener el inicio de la semana (lunes) usando fecha local
        const selectedDate = crearFechaLocal(filters.date);
        const dayOfWeek = selectedDate.getDay(); // 0 = domingo, 1 = lunes, etc.
        const diff = selectedDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        console.log('Semana - Inicio:', startOfWeek.toLocaleDateString());
        console.log('Semana - Final:', endOfWeek.toLocaleDateString());

        result = result.filter(record => {
          const recordDateStr = record.entryDate || record.fechaEntrada;
          if (!recordDateStr) return false;
          
          const recordDate = crearFechaLocal(recordDateStr);
          recordDate.setHours(0, 0, 0, 0);
          
          const isInRange = recordDate >= startOfWeek && recordDate <= endOfWeek;
          console.log(`Registro ${record.id}: ${recordDateStr} - En rango: ${isInRange}`);
          return isInRange;
        });
        
        setDateRange(`Semana: ${formatearFecha(getFechaLocal(startOfWeek))} - ${formatearFecha(getFechaLocal(endOfWeek))}`);
        break;
      }
      
      case 'month': {
        const selectedDate = crearFechaLocal(filters.date);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();

        console.log('Mes filtrado:', year, month + 1); // +1 porque getMonth() es 0-based

        result = result.filter(record => {
          const recordDateStr = record.entryDate || record.fechaEntrada;
          if (!recordDateStr) return false;
          
          const recordDate = crearFechaLocal(recordDateStr);
          const recordYear = recordDate.getFullYear();
          const recordMonth = recordDate.getMonth();
          
          const isInRange = recordYear === year && recordMonth === month;
          console.log(`Registro ${record.id}: ${recordDateStr} (${recordYear}-${recordMonth + 1}) - En rango: ${isInRange}`);
          return isInRange;
        });
        
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        setDateRange(`Mes: ${monthNames[month]} ${year}`);
        break;
      }
      
      default:
        setDateRange('');
        break;
    }

    console.log('Datos filtrados:', result);
    setFilteredData(result);
    
    const total = result.reduce((sum, record) => sum + (Number(record.amount || record.monto) || 0), 0);
    setTotalAmount(total);
    setTotalVehicles(result.length);

    // Calcular duración promedio en horas
    const durationsInHours = result.map(record => {
      // Si el registro incluye duration en horas o minutos
      if (record.duration && !isNaN(Number(record.duration))) {
        // Si la duración viene en minutos (valor grande) asumimos minutos si > 12
        const num = Number(record.duration);
        return num > 12 ? num / 60 : num; // si >12 asumimos minutos -> convertir a horas
      }

      // Si tenemos entryTime y exitTime intentamos calcular
      if (record.entryTime && record.exitTime) {
        const e = new Date(record.entryTime);
        const x = new Date(record.exitTime);
        if (!isNaN(e.getTime()) && !isNaN(x.getTime()) && x >= e) {
          const diffMs = x - e;
          return diffMs / (1000 * 60 * 60); // horas
        }
      }

      return 0;
    }).filter(h => h > 0);

    const avg = durationsInHours.length > 0 ? durationsInHours.reduce((s, v) => s + v, 0) / durationsInHours.length : 0;
    setAvgDurationHours(avg);
  }, [filters, allData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async (format) => {
    console.log('Exportando datos:', filteredData); // Para debug
    console.log('Formato:', format);
    
    if (filteredData.length === 0) {
      alert('No hay datos para exportar. Por favor selecciona un período con transacciones.');
      return;
    }

    setIsExporting(true);
    const periodText = filters.period.charAt(0).toUpperCase() + filters.period.slice(1);
    const filename = `reporte-estacionamiento-${periodText}-${filters.date}`;
    
    try {
      if (format === 'csv') {
        await exportToCSV(filteredData, filename);
      } else {
        await exportToPDF(filteredData, filename, filters.date);
      }
    } catch (error) {
      console.error('Error en exportación:', error);
      alert(`Error al exportar en formato ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="reports-container">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="reports-title">Reportes de Estacionamiento</h1>
          <p className="reports-subtitle">Visualiza y exporta los reportes de transacciones</p>
        </div>
        <div>
          <button className="back-button" onClick={() => navigate('/menu')}>
            <FaHome style={{ marginRight: 8 }} />
            Regresar al Menú
          </button>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ padding: '20px 24px 0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>Filtros del Reporte</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
              Filtra los reportes por período y fecha
            </p>
            {dateRange && (
              <span style={{ 
                padding: '4px 12px', 
                backgroundColor: '#0b79d0', 
                color: 'white', 
                borderRadius: '15px', 
                fontSize: '0.75rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}>
                {dateRange}
              </span>
            )}
          </div>
        </div>

        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Período</label>
            <select value={filters.period} onChange={(e) => handleFilterChange('period', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#fff' }}>
              <option value="day">Diario</option>
              <option value="week">Semanal</option>
              <option value="month">Mensual</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Fecha</label>
            <input type="date" value={filters.date} onChange={(e) => handleFilterChange('date', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#fff' }} />
          </div>

          <div>
            <button style={{ padding: '10px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer', transition: 'background-color 0.2s', width: 'auto' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}>Buscar</button>
          </div>
        </div>
      </div>

      <div className="reports-summary">
        <div className="report-card">
          <div className="label">Total de Vehículos</div>
          <div className="value">{totalVehicles}</div>
          <div className="sub">Vehículos estacionados</div>
        </div>

        <div className="report-card">
          <div className="label">Ingresos Totales</div>
          <div className="value">Q{totalAmount.toFixed(2)}</div>
          <div className="sub">Recaudado</div>
        </div>

        <div className="report-card">
          <div className="label">Duración Promedio</div>
          <div className="value">{avgDurationHours.toFixed(1)} hrs</div>
          <div className="sub">Por vehículo</div>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ padding: '20px 24px 0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>Transacciones de Estacionamiento</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '16px' }}>Vista detallada de los registros para el período seleccionado</p>
        </div>
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: '#f9fafb', padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>ID</th>
                  <th style={{ backgroundColor: '#f9fafb', padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Placa</th>
                  <th style={{ backgroundColor: '#f9fafb', padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Marca</th>
                  <th style={{ backgroundColor: '#f9fafb', padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Hora Ingreso</th>
                  <th style={{ backgroundColor: '#f9fafb', padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Hora Salida</th>
                  <th style={{ backgroundColor: '#f9fafb', padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Duración</th>
                  <th style={{ backgroundColor: '#f9fafb', padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Monto (Q)</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((record) => (
                    <tr key={record.id} style={{ borderBottom: '1px solid #e5e7eb' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#374151' }}>{record.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#374151' }}>{record.plate}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#374151' }}>{record.brand}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#374151' }}>{record.entryTime}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#374151' }}>{record.exitTime ?? '-'}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#374151' }}>{record.duration ?? '-'}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>Q{(Number(record.amount) || 0).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', fontSize: '0.875rem' }}>No se encontraron registros para el período seleccionado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '20px 0' }}>
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Mostrando {filteredData.length} registros</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={{ 
              padding: '8px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px', 
              backgroundColor: isExporting ? '#f3f4f6' : 'white', 
              color: '#374151', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              cursor: (filteredData.length === 0 || isExporting) ? 'not-allowed' : 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              opacity: (filteredData.length === 0 || isExporting) ? 0.5 : 1 
            }} 
            onClick={() => handleExport('csv')} 
            disabled={filteredData.length === 0 || isExporting}
            onMouseOver={(e) => { 
              if (filteredData.length > 0 && !isExporting) { 
                e.currentTarget.style.backgroundColor = '#f9fafb'; 
                e.currentTarget.style.borderColor = '#9ca3af'; 
              } 
            }} 
            onMouseOut={(e) => { 
              if (filteredData.length > 0 && !isExporting) { 
                e.currentTarget.style.backgroundColor = 'white'; 
                e.currentTarget.style.borderColor = '#d1d5db'; 
              } 
            }}
          >
            {isExporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
          <button 
            style={{ 
              padding: '8px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px', 
              backgroundColor: isExporting ? '#f3f4f6' : 'white', 
              color: '#374151', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              cursor: (filteredData.length === 0 || isExporting) ? 'not-allowed' : 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              opacity: (filteredData.length === 0 || isExporting) ? 0.5 : 1 
            }} 
            onClick={() => handleExport('pdf')} 
            disabled={filteredData.length === 0 || isExporting}
            onMouseOver={(e) => { 
              if (filteredData.length > 0 && !isExporting) { 
                e.currentTarget.style.backgroundColor = '#f9fafb'; 
                e.currentTarget.style.borderColor = '#9ca3af'; 
              } 
            }} 
            onMouseOut={(e) => { 
              if (filteredData.length > 0 && !isExporting) { 
                e.currentTarget.style.backgroundColor = 'white'; 
                e.currentTarget.style.borderColor = '#d1d5db'; 
              } 
            }}
          >
            {isExporting ? 'Generando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ParkingReports;