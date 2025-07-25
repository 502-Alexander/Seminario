import React, { useState } from 'react';
import './Login.css';
import 'boxicons/css/boxicons.min.css';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('');
  const [recordarme, setRecordarme] = useState(false); // ✅ Línea agregada

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = {
      usuario,
      contrasena,
      rol,
      recordarme
    };

    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.mensaje);
        console.log(data);
      })
      .catch(err => {
        console.error('Error al enviar datos:', err);
      });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Nombre de usuario"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="input-box">
          <select
            required
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="input"
          >
            <option value="">Selecciona un rol</option>
            <option value="admin">Administrador</option>
            <option value="usuario">Usuario</option>
            <option value="supervisor">Supervisor</option>
          </select>
          <i className="bx bxs-user-badge"></i>
        </div>

        <div className="remember-forgot">
          <label>
            <input
              type="checkbox"
              checked={recordarme}
              onChange={() => setRecordarme(!recordarme)}
            />
            Recuérdame
          </label>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" className="btn">
          Iniciar sesión
        </button>

        <div className="register-link">
          <p>
            ¿No tienes una cuenta? <a href="#">¡Regístrate aquí!</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
