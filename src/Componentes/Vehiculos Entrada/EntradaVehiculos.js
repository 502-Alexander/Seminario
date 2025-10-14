// src/components/Vehiculos.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import './EntradaVehiculos.css';

const Vehiculos = () => {
  const navigate = useNavigate();

  const [vehiculo, setVehiculo] = useState({
    placa: '',
    marca: '',
    color: '',
    tipo: '',
  });

  const [vehiculosActivos, setVehiculosActivos] = useState([]);
  const [ultimoCodigo, setUltimoCodigo] = useState('');

  const handleChange = (e) => {
    setVehiculo({
      ...vehiculo,
      [e.target.name]: e.target.value,
    });
  };

  const fetchVehiculos = async () => {
    try {
      const response = await fetch('http://localhost:3001/vehiculos/activos');
      if (!response.ok) throw new Error('Error al obtener vehículos');
      const data = await response.json();
      setVehiculosActivos(data);
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
    }
  };

  // ...
const handleSubmit = async (e) => {
  e.preventDefault();

  // Generar código único
  const codigoBarra = `${vehiculo.placa}-${Date.now()}`;

  try {
    const response = await fetch('http://localhost:3001/vehiculos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...vehiculo, codigo_barra: codigoBarra }),
    });

    if (!response.ok) throw new Error('Error al registrar vehículo');

    // Obtener la hora actual
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();

    // Redirigir al ticket con la información
    navigate('/ticket', {
      state: {
        ...vehiculo,
        codigo_barra: codigoBarra,
        fecha,
        hora,
      },
    });
  } catch (error) {
    console.error('Error al registrar vehículo:', error);
  }
};
// ...


  useEffect(() => {
    fetchVehiculos();
  }, []);

  return (
    <div className="vehiculos-container">
      
      {/* Botones */}
      <div className="navigation-buttons">
        <button className="btn-regresar" onClick={() => navigate('/menu')}>
          <FaHome style={{ marginRight: 8 }} /> Regresar al Menú
        </button>
        
        <button className="btn-salida" onClick={() => navigate('/vehiculos/salida')}>
          <FaSignOutAlt style={{ marginRight: 8 }} /> Ir a Salida
        </button>
      </div>

      <h2 className="vehiculos-title">Ingreso de Vehículos</h2>
      
      <form className="vehiculos-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="placa">Placa</label>
          <input
            type="text"
            id="placa"
            name="placa"
            value={vehiculo.placa}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="marca">Marca</label>
          <input
            type="text"
            id="marca"
            name="marca"
            value={vehiculo.marca}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={vehiculo.color}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="tipo">Tipo</label>
          <select
            id="tipo"
            name="tipo"
            value={vehiculo.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">Registrar Vehículo</button>
      </form>

      {/* Mostrar el código de barras recién generado */}
      {ultimoCodigo && (
        <div className="barcode-section">
          <h3>Código de Barras del Vehículo</h3>
          <Barcode value={ultimoCodigo} width={2} height={80} fontSize={14} />
          <p><strong>{ultimoCodigo}</strong></p>
        </div>
      )}

      <h3 className="vehiculos-subtitle">Vehículos Activos</h3>

      <div className="table-container">
        <DataGrid
          rows={vehiculosActivos}
          columns={[
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'placa', headerName: 'Placa', width: 130 },
            { field: 'marca', headerName: 'Marca', width: 130 },
            { field: 'color', headerName: 'Color', width: 130 },
            { field: 'tipo', headerName: 'Tipo', width: 100 },
            { field: 'hora_ingreso', headerName: 'Hora de Ingreso', width: 180 },
            { field: 'codigo_barra', headerName: 'Código de Barras', width: 250 },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
};

export default Vehiculos;
