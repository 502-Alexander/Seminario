-- Script para eliminar el módulo de "Ajustes"
-- Ejecutar en tu base de datos MySQL

USE railway;

-- Primero eliminar los permisos asociados al módulo de Ajustes
DELETE FROM permisos_usuario 
WHERE id_modulo = (SELECT id_modulo FROM modulos WHERE nombre_modulo = 'Ajustes');

-- Luego eliminar el módulo
DELETE FROM modulos 
WHERE nombre_modulo = 'Ajustes';

-- Verificar que se eliminó correctamente
SELECT * FROM modulos;

-- Mensaje de confirmación
SELECT 'Módulo de Ajustes eliminado exitosamente' AS mensaje;
