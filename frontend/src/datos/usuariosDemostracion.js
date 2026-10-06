import { crearCredencial } from '../servicios/seguridadContrasenas.js';

// Credenciales públicas de prueba, no secretos ni cuentas reales. No se migran hashes antiguos.
export const cuentasDemostracion = [
  { id: 'cliente-demo', nombre: 'Cliente Demo', correo: 'cliente@gmail.com', rol: 'cliente', contrasena: 'ClienteDemo123' },
  { id: 'administrador-demo', nombre: 'Administración Demo', correo: 'admin@duoc.cl', rol: 'administrador', contrasena: 'AdminDemo123' }
];

export async function crearUsuariosDemostracion() {
  const usuarios = [];
  for (const cuenta of cuentasDemostracion) {
    const credencial = await crearCredencial(cuenta.contrasena);
    usuarios.push({
      id: cuenta.id, nombre: cuenta.nombre, correo: cuenta.correo, rol: cuenta.rol,
      rut: '12.345.678-5', telefono: '+56 9 1234 5678', comuna: 'Santiago', credencial
    });
  }
  return usuarios;
}
