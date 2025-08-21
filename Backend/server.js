const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'srv1009.hstgr.io',
  user: 'u158333685_parqueo',
  password: 'Nuevasguate12',
  database: 'u158333685_parqueadero',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('✅ Conexión exitosa a la base de datos');
});

// Ruta para login
app.post('/api/login', (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  if (!usuario || !contrasena || !rol) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  const query = `
    SELECT * FROM usuarios
    WHERE usuario = ? AND contrasena = ? AND rol = ?
    LIMIT 1
  `;

  connection.query(query, [usuario, contrasena, rol], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }

    if (results.length > 0) {
  res.json({ mensaje: 'Inicio de sesión exitoso', exito: true, usuario: results[0] });
} else {
  res.status(401).json({ mensaje: 'Credenciales incorrectas', exito: false });
}

  });
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
