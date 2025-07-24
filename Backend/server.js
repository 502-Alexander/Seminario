const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'srv1009.hstgr.io', // o el host real
  user: 'u158333685_parqueo',  // O el que corresponda
  password: 'Nuevasparqueo12',
  database: 'u158333685_parqueadero', // igual que user, o el nombre de la base
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('✅ Conexión exitosa a la base de datos de Hostinger');
});