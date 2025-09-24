// src/components/GestionUsuarios.js
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./GestionUsuarios.css";


const GestionUsuarios = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    usuario: "",
    contrasena: "",
    rol: "",
  });

  const [usuarios, setUsuarios] = useState([]);

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

// 🔹 Obtener usuarios desde el backend
const fetchUsuarios = async () => {
  try {
    const response = await fetch("https://seminario-backend-1.onrender.com/api/usuarios");
    if (!response.ok) throw new Error("Error al obtener usuarios");
    const data = await response.json();
    setUsuarios(data);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};

// 🔹 Registrar un nuevo usuario
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("https://seminario-backend-1.onrender.com/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error("Error al registrar usuario");
    setUsuario({ usuario: "", contrasena: "", rol: "" });
    fetchUsuarios();
  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
};


  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="usuarios-container">
      {/* Botón regresar */}
      <button className="btn-regresar" onClick={() => navigate("/menu")}>
        <FaHome style={{ marginRight: 8 }} />
        Regresar al Menú
      </button>

      <h2 className="usuarios-title">Gestión de Usuarios</h2>

      <form className="usuarios-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="usuario">Usuario</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={usuario.usuario}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            value={usuario.contrasena}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="rol">Rol</label>
          <select
            id="rol"
            name="rol"
            value={usuario.rol}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="admin">Administrador</option>
            <option value="usuario">Usuario</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">
          Registrar Usuario
        </button>
      </form>

      <h3 className="usuarios-subtitle">Usuarios Registrados</h3>

      <div className="table-container">
        <DataGrid
          rows={usuarios}
          columns={[
            { field: "id", headerName: "ID", width: 70 },
            { field: "usuario", headerName: "Usuario", width: 200 },
            { field: "rol", headerName: "Rol", width: 150 },
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

export default GestionUsuarios;