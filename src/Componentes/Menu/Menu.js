import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Menu/Menu.css";
import { 
  FaCar, FaComments, FaAddressBook, FaChartPie, FaFileInvoiceDollar, 
  FaUsers, FaLink, FaBoxes, FaCog, FaSignOutAlt, FaUserTie 
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
    { icon: <FaCar />, label: "Registro De Vehículos", color: "#4CAF50" },
    { icon: <FaComments />, label: "Control De Entradas Y Salidas De Vehículos", color: "#E91E63" },
    { icon: <FaAddressBook />, label: "Generación De Tickets", color: "#00BCD4" },
    { icon: <FaChartPie />, label: "Cálculo Automático De Tarifas", color: "#FF4081" },
    { icon: <FaFileInvoiceDollar />, label: "Cobros Y Facturación", color: "#FF9800" },
    { icon: <FaUsers />, label: "Gestion De Usuarios Del Sistema", color: "#009688" },
    { icon: <FaLink />, label: "Reportes Automáticos", color: "#795548" },
    { icon: <FaBoxes />, label: "Seguridad En cobro", color: "#F44336" },
    { icon: <FaCog />, label: "Ajustes", color: "#CDDC39" },
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
