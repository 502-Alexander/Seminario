import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Menu/Menu.css";
import { 
  FaReceipt, FaCalculator, FaCar, FaChartPie, FaFileInvoiceDollar, 
  FaUsers, FaCog, FaSignOutAlt, FaUserTie 
} from "react-icons/fa";

//credenciales 
//usuario: Prueba1
//contraseña: 1234
//rol: admin

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rol = location.state?.rol || 'Usuario';

  const handleLogout = () => {
    navigate("/");
  };

  const getRolNombre = (rol) => {
    switch(rol) {
      case 'admin':
        return 'Administrador';
      case 'usuario':
        return 'Usuario';
      case 'supervisor':
        return 'Supervisor';
      default:
        return 'Usuario';
    }
  };

  const items = [
    { icon: <FaUsers />, label: "Gestion De Usuarios Del Sistema", color: "#66d4ff" },
    { icon: <FaCar />, label: "Registro De Entradas y Salidas De Vehículos", color: "#66d4ff" },
    { icon: <FaCalculator />, label: "Cálculo Automático De Tarifas", color: "#66d4ff" },
    { icon: <FaReceipt />, label: "Generación De Tickets", color: "#66d4ff" },
    { icon: <FaFileInvoiceDollar />, label: "Cobros Y Facturación", color: "#66d4ff" },
    { icon: <FaChartPie />, label: "Reportes Automáticos", color: "#66d4ff" },
    { icon: <FaCog />, label: "Ajustes", color: "#66d4ff" },
  ];

  return (
    <div>
      {/* Bienvenida */}
      <div className="welcome-floating">
        <FaUserTie className="welcome-icon" size={16}/>
        Bienvenido, {getRolNombre(rol)}
      </div>

      {/* Contenedor del menú */}
      <div className="menu-container">
        <div className="menu-header">
          <h1 className="menu-title">Gestión de Estacionamiento</h1>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Salir</span>
          </button>
        </div>
        <div className="menu-grid">
          {items.map((item, index) => (
            <div key={index} className="menu-card" style={{ backgroundColor: item.color }}>
              <div className="menu-icon">{item.icon}</div>
              <p className="menu-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
