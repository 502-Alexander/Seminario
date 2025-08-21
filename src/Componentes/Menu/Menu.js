import React, { useState } from 'react';
import '../Menu/Menu.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="logo">🌟 MiSitio</div>
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <a href="#inicio">Inicio</a>
        <a href="#servicios">Servicios</a>
        <a href="#portafolio">Portafolio</a>
        <a href="#contacto">Contacto</a>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
};

export default Navbar;
