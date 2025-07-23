import React, { useState } from 'react';
import './Login.css';
import 'boxicons/css/boxicons.css';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordarme, setRecordarme] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí colocas la lógica de autenticación con fetch/axios
    console.log('Usuario:', usuario);
    console.log('Contraseña:', contrasena);
    console.log('Recordarme:', recordarme);
    // Ejemplo: redireccionar tras login exitoso
    // navigate('/dashboard');
  };

  return (
    <div className="box">
      <form onSubmit={handleSubmit} className="container">
        <div className="top-header">
          <span>Andev web</span>
          <header>Iniciar Sesión</header>
        </div>

        <div className="input-field">
          <input
            type="text"
            className="input"
            placeholder="Usuario"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <i className="bx bx-user"></i>
        </div>

        <div className="input-field">
          <input
            type="password"
            className="input"
            placeholder="Contraseña"
            required
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <i className="bx bx-lock-alt"></i>
        </div>

        <div className="input-field">
          <input type="submit" className="submit" value="Inicio" />
        </div>

        <div className="bottom">
          <div className="left">
            <input
              type="checkbox"
              id="check"
              checked={recordarme}
              onChange={() => setRecordarme(!recordarme)}
            />
            <label htmlFor="check"> Recordarme</label>
          </div>
          <div className="right">
            <label><a href="#">¿Olvidaste la contraseña?</a></label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
