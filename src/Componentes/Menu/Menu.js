import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Menu/Menu.css";
import { 
  FaReceipt, FaCalculator, FaCar, FaChartPie, FaFileInvoiceDollar, 
  FaUsers, FaCog, FaSignOutAlt, FaUserTie, FaClock
} from "react-icons/fa";

const Menu = () => {
  const navigate = useNavigate();
  const [modulosUsuario, setModulosUsuario] = useState([]);

  // 🔹 Instrucción para Validar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Esta instrucción redirige al login si no hay token
    }
  }, [navigate]);

  const rol = localStorage.getItem("rol") || "usuario";
  const usuario = localStorage.getItem("usuario") || "Usuario";
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Esta instrucción borra el token al cerrar sesión
    localStorage.removeItem("rol");
    navigate("/");
  };

  // 🔹 Cargar módulos del usuario desde localStorage
  useEffect(() => {
    const modulosGuardados = localStorage.getItem("modulos");
    if (modulosGuardados) {
      try {
        const modulos = JSON.parse(modulosGuardados);
        // 🔹 Filtrar para excluir módulos no deseados
        const modulosExcluidos = ['Ajustes', 'Cobros Y Facturación', 'Cálculo Automático De Tarifas'];
        const modulosFiltrados = modulos.filter(modulo => !modulosExcluidos.includes(modulo.nombre_modulo));
        setModulosUsuario(modulosFiltrados);
      } catch (error) {
        console.error("Error al parsear módulos:", error);
        setModulosUsuario([]);
      }
    }
  }, []);

  // 🔹 Mapeo de iconos según el nombre del icono en la BD
  const getIconComponent = (iconName) => {
    const iconMap = {
      'FaUsers': <FaUsers />,
      'FaCar': <FaCar />,
      'FaCalculator': <FaCalculator />,
      'FaReceipt': <FaReceipt />,
      'FaFileInvoiceDollar': <FaFileInvoiceDollar />,
      'FaChartPie': <FaChartPie />,
      'FaCog': <FaCog />
    };
    return iconMap[iconName] || <FaCog />;
  };

  // 🔹 Convertir módulos del usuario a formato de items para el menú
  const items = modulosUsuario.map(modulo => ({
    icon: getIconComponent(modulo.icono),
    label: modulo.nombre_modulo,
    color: modulo.color || "#66d4ff",
    route: modulo.ruta
  }));

  return (
    <div>
      {/* Mensaje de Bienvenida */}
      <div className="welcome-floating">
        <FaUserTie className="welcome-icon" size={16}/>
        Bienvenido | {usuario}
      </div>

      {/* Mostrar Fecha y Hora */}
      <div className="datetime-floating">
        <div className="mini-clock">
          <div className="hand hour" style={{ transform: `rotate(${dateTime.getHours() * 30 + dateTime.getMinutes()/2}deg)` }} />
          <div className="hand minute" style={{ transform: `rotate(${dateTime.getMinutes() * 6}deg)` }} />
          <div className="hand second" style={{ transform: `rotate(${dateTime.getSeconds() * 6}deg)` }} />
        </div>
        {dateTime.toLocaleTimeString().toUpperCase()}
      </div>

      {/* Título principal arriba del contenedor */}
      <div className="main-header">
        <h1 className="main-title">Gestión de Estacionamiento.</h1>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Salir</span>
        </button>
      </div>

      {/* Contenedor del menú */}
      <div className="menu-container">
        <div className="menu-grid">
  {items.map((item, index) => (
    <div
      key={index}
      className="menu-card"
      style={{ backgroundColor: item.color, cursor: item.route ? 'pointer' : 'default' }}
      onClick={() => item.route && navigate(item.route)}
    >
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
