import { normalizarCorreo, validarContrasena, validarPerfilUsuario } from './validarFormularios.js';

export function validarProducto(valores) {
  const errores = {};
  if (typeof valores.nombre !== 'string' || !valores.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.';
  }
  if (typeof valores.categoria !== 'string' || !valores.categoria.trim()) {
    errores.categoria = 'La categoría es obligatoria.';
  }
  if (typeof valores.descripcion !== 'string' || !valores.descripcion.trim()) {
    errores.descripcion = 'La descripción es obligatoria.';
  }
  if (typeof valores.emoji !== 'string' || !valores.emoji.trim()) {
    errores.emoji = 'El emoji es obligatorio.';
  }
  const precio = Number(valores.precio);
  const tipoPrecioValido = typeof valores.precio === 'string' || typeof valores.precio === 'number';
  if (!tipoPrecioValido || String(valores.precio).trim() === '' || !Number.isSafeInteger(precio) || precio <= 0) {
    errores.precio = 'Ingresa un precio entero positivo en pesos chilenos.';
  }
  return errores;
}

export function validarUsuarioAdministrativo(valores, usuarios = [], identificador = null) {
  // Reutilizamos nombre y correo del registro, sin exigir datos de despacho para una cuenta administrativa.
  const erroresPerfil = validarPerfilUsuario(valores);
  const errores = {};
  if (erroresPerfil.nombre) {
    errores.nombre = erroresPerfil.nombre;
  }
  if (erroresPerfil.correo) {
    errores.correo = erroresPerfil.correo;
  }
  if (!['cliente', 'administrador'].includes(valores.rol)) {
    errores.rol = 'Selecciona cliente o administrador.';
  }
  if ((!identificador || valores.contrasena !== '') && !validarContrasena(valores.contrasena)) {
    errores.contrasena = 'La contraseña debe tener entre 8 y 64 caracteres.';
  }
  const correo = normalizarCorreo(valores.correo);
  const duplicado = usuarios.some(function buscarDuplicado(usuario) {
    return usuario.id !== identificador && normalizarCorreo(usuario.correo) === correo;
  });
  if (duplicado) {
    errores.correo = 'Ya existe una cuenta con ese correo.';
  }
  return errores;
}

export function validarCambioAdministrador(usuarios, usuarioActual, usuarioObjetivo, nuevoRol, eliminando = false) {
  if (!usuarioActual || usuarioActual.rol !== 'administrador') {
    return 'Solo un administrador puede modificar estos datos.';
  }
  if (!usuarioObjetivo) {
    return 'El usuario ya no existe.';
  }
  const pierdeAcceso = eliminando || nuevoRol !== 'administrador';
  const administradores = usuarios.filter(function contarAdministradores(usuario) {
    return usuario.rol === 'administrador';
  });
  if (usuarioObjetivo.rol === 'administrador' && pierdeAcceso && administradores.length <= 1) {
    return 'No puedes eliminar ni cambiar el rol del último administrador.';
  }
  if (usuarioObjetivo.id === usuarioActual.id && pierdeAcceso) {
    return 'No puedes eliminar tu propia cuenta ni quitarte el rol de administrador.';
  }
  return '';
}
