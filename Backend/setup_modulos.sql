-- Script para crear las tablas de módulos y permisos
-- Ejecutar este script en tu base de datos MySQL

-- Crear tabla de módulos
CREATE TABLE IF NOT EXISTS modulos (
  id_modulo INT AUTO_INCREMENT PRIMARY KEY,
  nombre_modulo VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de permisos de usuario
CREATE TABLE IF NOT EXISTS permisos_usuario (
  id_permiso INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_modulo INT NOT NULL,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_modulo) REFERENCES modulos(id_modulo) ON DELETE CASCADE,
  UNIQUE KEY unique_permiso (id_usuario, id_modulo)
);

-- Insertar módulos predeterminados
INSERT INTO modulos (nombre_modulo, descripcion) VALUES
  ('Entradas', 'Módulo para registrar entrada de vehículos'),
  ('Salidas', 'Módulo para procesar salida de vehículos'),
  ('Reportes', 'Módulo para generar reportes y estadísticas'),
  ('Usuarios', 'Módulo para gestión de usuarios y permisos'),
  ('Configuración', 'Módulo de configuración del sistema')
ON DUPLICATE KEY UPDATE nombre_modulo = nombre_modulo;

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas creadas exitosamente' AS mensaje;
SELECT * FROM modulos;
