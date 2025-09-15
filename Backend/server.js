const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Instrucción para cargar las variables de entorno

const SECRET_KEY = process.env.SECRET_KEY;
//const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

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

// Ruta para el login
app.post('/api/login', (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  if (!usuario || !contrasena || !rol) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  // Se agrego Binary para que la comparación sea sensible a mayúsculas y minúsculas
  const query = `
    SELECT * FROM usuarios
    WHERE BINARY usuario = ? AND contrasena = ? AND rol = ?
    LIMIT 1
  `;

  connection.query(query, [usuario, contrasena, rol], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }

    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign(
        { id: user.id, usuario: user.usuario, rol: user.rol },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({ 
        mensaje: 'Inicio de sesión exitoso', 
        exito: true, 
        usuario: user,
        token 
      });
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
