import { validarCredencialGuardada } from './seguridadContrasenas.js';
import { normalizarCorreo, validarPerfilUsuario } from '../utilidades/validarFormularios.js';

export const claveUsuarios = 'stock_react_usuarios_v1';
export const claveSesion = 'stock_react_sesion_v1';
export const claveProductos = 'stock_react_productos_v1';
export const claveCarrito = 'stock_react_carrito_v1';
export const claveBorradorCompra = 'stock_react_borrador_compra_v1';
export const claveUltimaOrden = 'stock_react_ultima_orden_v1';

// Acceder a window.localStorage también puede lanzar una excepción del navegador.
export function leerDatos(clave, valorInicial, almacenamiento) {
  try {
    const almacenamientoDisponible = almacenamiento ?? window.localStorage;
    const contenido = almacenamientoDisponible.getItem(clave);
    if (contenido === null) {
      return valorInicial;
    }
    return JSON.parse(contenido);
  } catch {
    return valorInicial;
  }
}

export function guardarDatos(clave, datos, almacenamiento) {
  try {
    const almacenamientoDisponible = almacenamiento ?? window.localStorage;
    almacenamientoDisponible.setItem(clave, JSON.stringify(datos));
    return true;
  } catch {
    // La sesión sigue funcionando en memoria si no hay permiso o espacio.
    return false;
  }
}

export function sanearUsuarios(datos) {
  if (!Array.isArray(datos)) {
    return null;
  }
  const usuarios = [];
  const identificadores = new Set();
  const correos = new Set();
  for (const usuario of datos) {
    if (!usuario || typeof usuario.id !== 'string' || !usuario.id.trim() ||
        !['cliente', 'administrador'].includes(usuario.rol) ||
        !validarCredencialGuardada(usuario.credencial)) {
      continue;
    }
    const correo = normalizarCorreo(usuario.correo);
    const errores = validarPerfilUsuario({ ...usuario, correo });
    // Las cuentas creadas en el panel no requieren un perfil de despacho; el registro público sí.
    const sinPerfilDespacho = usuario.rut === '' && usuario.telefono === '' && usuario.comuna === '';
    if (sinPerfilDespacho) {
      delete errores.rut;
      delete errores.telefono;
      delete errores.comuna;
    }
    if (Object.keys(errores).length > 0 || identificadores.has(usuario.id) || correos.has(correo)) {
      continue;
    }
    identificadores.add(usuario.id);
    correos.add(correo);
    usuarios.push({
      id: usuario.id, nombre: usuario.nombre.trim(), correo, rol: usuario.rol,
      rut: usuario.rut.trim(), telefono: usuario.telefono.trim(), comuna: usuario.comuna,
      credencial: {
        algoritmo: usuario.credencial.algoritmo, iteraciones: usuario.credencial.iteraciones,
        sal: usuario.credencial.sal, resumen: usuario.credencial.resumen
      }
    });
  }
  return usuarios;
}

export function sanearSesion(datos, usuarios) {
  if (!datos || typeof datos.usuarioId !== 'string') {
    return null;
  }
  const usuario = usuarios.find(function buscarUsuario(candidato) {
    return candidato.id === datos.usuarioId && ['cliente', 'administrador'].includes(candidato.rol);
  });
  if (!usuario) {
    return null;
  }
  // El rol y el nombre vienen del registro de usuarios, nunca de la sesión guardada.
  return { usuarioId: usuario.id };
}

export function sanearProductos(datos, productosDeRespaldo) {
  if (!Array.isArray(datos)) {
    return productosDeRespaldo;
  }
  const identificadores = new Set();
  const productosValidos = [];
  for (const producto of datos) {
    if (!producto || !Number.isSafeInteger(producto.id) || producto.id <= 0 ||
        identificadores.has(producto.id) ||
        typeof producto.nombre !== 'string' || !producto.nombre.trim() ||
        !Number.isFinite(producto.precio) || producto.precio < 0 ||
        typeof producto.categoria !== 'string' || !producto.categoria.trim() ||
        typeof producto.descripcion !== 'string' || typeof producto.emoji !== 'string') {
      return productosDeRespaldo;
    }
    identificadores.add(producto.id);
    productosValidos.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      emoji: producto.emoji
    });
  }
  // Una lista vacía válida no repone automáticamente productos eliminados.
  return productosValidos;
}

export function sanearCarrito(datos, productos) {
  if (!Array.isArray(datos)) {
    return [];
  }
  const elementosValidos = [];
  for (const elemento of datos) {
    if (!elemento || !Number.isSafeInteger(elemento.cantidad) || elemento.cantidad <= 0) {
      continue;
    }
    const producto = productos.find(function buscarProducto(productoDisponible) {
      return productoDisponible.id === elemento.id;
    });
    if (!producto) {
      continue;
    }
    const elementoExistente = elementosValidos.find(function buscarElemento(elementoValido) {
      return elementoValido.id === elemento.id;
    });
    if (elementoExistente) {
      const cantidadTotal = elementoExistente.cantidad + elemento.cantidad;
      if (Number.isSafeInteger(cantidadTotal)) {
        elementoExistente.cantidad = cantidadTotal;
      }
    } else {
      elementosValidos.push({ id: elemento.id, cantidad: elemento.cantidad });
    }
  }
  return elementosValidos;
}
