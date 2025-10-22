-- Script para actualizar los módulos del sistema
-- Ejecutar este script en tu base de datos MySQL

USE railway;

-- Limpiar módulos anteriores (opcional, solo si quieres empezar de cero)
-- DELETE FROM permisos_usuario;
-- DELETE FROM modulos;

-- Insertar o actualizar módulos del sistema
INSERT INTO modulos (nombre_modulo, descripcion) VALUES
('Gestión De Usuarios Del Sistema', 'Permite administrar usuarios y roles del sistema.'),
('Registro De Entradas y Salidas De Vehículos', 'Registro y control de vehículos dentro del parqueo.'),
('Cálculo Automático De Tarifas', 'Calcula el monto a pagar según el tiempo estacionado.'),
('Generación De Tickets', 'Crea y gestiona los tickets de ingreso.'),
('Cobros Y Facturación', 'Registra pagos, genera comprobantes y controla cobros.'),
('Reportes Automáticos', 'Muestra estadísticas y reportes del sistema.')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Verificar que los módulos se insertaron correctamente
SELECT * FROM modulos;

-- Si tienes un usuario admin, asignarle todos los módulos
-- (Reemplaza '1' con el ID de tu usuario admin si es diferente)
INSERT INTO permisos_usuario (id_usuario, id_modulo)
SELECT 1, id_modulo FROM modulos
WHERE NOT EXISTS (
  SELECT 1 FROM permisos_usuario 
  WHERE id_usuario = 1 AND permisos_usuario.id_modulo = modulos.id_modulo
);

-- Verificar permisos del admin
SELECT u.usuario, m.nombre_modulo 
FROM usuarios u
INNER JOIN permisos_usuario p ON u.id = p.id_usuario
INNER JOIN modulos m ON p.id_modulo = m.id_modulo
WHERE u.id = 1;
