import { comunas } from '../datos/comunas.js';
import { validarRut } from './validarRut.js';

export function normalizarCorreo(correo) {
  if (typeof correo !== 'string') {
    return '';
  }
  return correo.trim().toLowerCase();
}

export function validarCorreo(correo) {
  return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(normalizarCorreo(correo));
}

export function validarContrasena(contrasena) {
  return typeof contrasena === 'string' && contrasena.length >= 8 && contrasena.length <= 64;
}

export function validarInicioSesion(valores) {
  const errores = {};
  if (!validarCorreo(valores.correo)) {
    errores.correo = 'Ingresa un correo válido de gmail.com, duoc.cl o profesor.duoc.cl.';
  }
  if (!validarContrasena(valores.contrasena)) {
    errores.contrasena = 'La contraseña debe tener entre 8 y 64 caracteres.';
  }
  return errores;
}

export function validarPerfilUsuario(valores) {
  const errores = {};
  if (!validarCorreo(valores.correo)) {
    errores.correo = 'Ingresa un correo válido de gmail.com, duoc.cl o profesor.duoc.cl.';
  }
  if (typeof valores.nombre !== 'string' || !/^[\p{L}]+(?:[ '-][\p{L}]+)+$/u.test(valores.nombre.trim()) ||
      valores.nombre.trim().length < 2 || valores.nombre.trim().length > 60) {
    errores.nombre = 'Ingresa tu nombre completo, con letras y espacios (máximo 60 caracteres).';
  }
  if (!validarRut(valores.rut)) {
    errores.rut = 'Ingresa un RUT chileno válido, por ejemplo 12.345.678-5.';
  }
  if (typeof valores.telefono !== 'string' || !/^(\+?56)?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/.test(valores.telefono.trim())) {
    errores.telefono = 'Ingresa un teléfono chileno válido, por ejemplo +56 9 1234 5678.';
  }
  if (!comunas.includes(valores.comuna)) {
    errores.comuna = 'Selecciona una comuna de la lista de sugerencias.';
  }
  return errores;
}

export function validarRegistro(valores) {
  const errores = { ...validarPerfilUsuario(valores), ...validarInicioSesion(valores) };
  if (!valores.confirmacion || valores.confirmacion !== valores.contrasena) {
    errores.confirmacion = 'Las contraseñas no coinciden.';
  }
  return errores;
}
