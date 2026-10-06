import { calcularTotales } from './calcularTotales.js';
import { validarCorreo } from './validarFormularios.js';

export const metodosPago = ['Tarjeta de crédito/débito', 'Transferencia bancaria', 'Pago en tienda'];
export const metodosEntrega = ['Despacho a domicilio', 'Retiro en tienda'];
export const asuntosContacto = ['Consulta por producto', 'Despacho', 'Postventa', 'Otro'];

function textoValido(valor, minimo, maximo) {
  return typeof valor === 'string' && valor.trim().length >= minimo && valor.trim().length <= maximo;
}

export function validarDestinatario(valores) {
  const errores = {};
  if (!textoValido(valores.nombre, 2, 100)) {
    errores.nombre = 'Ingresa tu nombre (entre 2 y 100 caracteres).';
  }
  // Checkout original acepta cualquier dominio; contacto conserva los dominios originales.
  if (!textoValido(valores.correo, 3, 100) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.correo.trim())) {
    errores.correo = 'Ingresa un correo válido.';
  }
  if (!textoValido(valores.direccion, 3, 200)) {
    errores.direccion = 'Ingresa una dirección (entre 3 y 200 caracteres).';
  }
  if (!textoValido(valores.comuna, 2, 100)) {
    errores.comuna = 'Ingresa la comuna.';
  }
  if (!metodosEntrega.includes(valores.entrega)) {
    errores.entrega = 'Selecciona un método de entrega válido.';
  }
  return errores;
}

export function sanearDestinatario(datos) {
  if (!datos || Object.keys(validarDestinatario(datos)).length > 0) {
    return null;
  }
  return {
    nombre: datos.nombre.trim(), correo: datos.correo.trim().toLowerCase(),
    direccion: datos.direccion.trim(), comuna: datos.comuna.trim(), entrega: datos.entrega
  };
}

export function validarPago(valores, fechaActual = new Date()) {
  const errores = {};
  if (!metodosPago.includes(valores.metodo)) {
    errores.metodo = 'Selecciona un método de pago.';
    return errores;
  }
  if (valores.metodo !== metodosPago[0]) {
    return errores;
  }
  if (typeof valores.numeroTarjeta !== 'string' || !/^\d{16}$/.test(valores.numeroTarjeta.replace(/\s/g, ''))) {
    errores.numeroTarjeta = 'El número de tarjeta debe tener 16 dígitos.';
  }
  const vencimiento = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(valores.vencimiento || '');
  if (!vencimiento) {
    errores.vencimiento = 'Usa el formato MM/AA.';
  } else {
    const mes = Number(vencimiento[1]);
    const anio = 2000 + Number(vencimiento[2]);
    // La tarjeta vence al finalizar el mes indicado, no el primer día.
    if (anio < fechaActual.getFullYear() || (anio === fechaActual.getFullYear() && mes < fechaActual.getMonth() + 1)) {
      errores.vencimiento = 'La tarjeta está vencida.';
    }
  }
  if (!/^\d{3,4}$/.test(valores.cvv || '')) {
    errores.cvv = 'El CVV debe tener 3 o 4 dígitos.';
  }
  return errores;
}

export function formatearNumeroTarjeta(valor) {
  return valor.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatearVencimiento(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4);
  if (digitos.length <= 2) {
    return digitos;
  }
  return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
}

export function validarContacto(valores) {
  const errores = {};
  if (!textoValido(valores.nombre, 3, 100)) {
    errores.nombre = 'Ingresa tu nombre (entre 3 y 100 caracteres).';
  }
  if (!textoValido(valores.correo, 3, 100) || !validarCorreo(valores.correo)) {
    errores.correo = 'Ingresa un correo de gmail.com, duoc.cl o profesor.duoc.cl.';
  }
  if (typeof valores.telefono !== 'string' || !/^(\+?56)?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/.test(valores.telefono.trim())) {
    errores.telefono = 'Ejemplo válido: +56 9 1234 5678.';
  }
  if (!asuntosContacto.includes(valores.asunto)) {
    errores.asunto = 'Selecciona un asunto.';
  }
  if (!textoValido(valores.mensaje, 10, 500)) {
    errores.mensaje = 'Cuéntanos un poco más (entre 10 y 500 caracteres).';
  }
  return errores;
}

export function carritoComprable(lineasCarrito) {
  const totales = calcularTotales(lineasCarrito);
  return lineasCarrito.length > 0 && Number.isFinite(totales.total) && totales.total >= 0 &&
    totales.total <= Number.MAX_SAFE_INTEGER;
}

export function obtenerHuellaCarrito(lineasCarrito) {
  const elementos = lineasCarrito.map(function describirLinea(linea) {
    return { id: linea.producto.id, cantidad: linea.cantidad, precio: linea.producto.precio, nombre: linea.producto.nombre };
  });
  elementos.sort(function ordenarElementos(primero, segundo) { return primero.id - segundo.id; });
  return JSON.stringify(elementos);
}

export function sanearBorrador(datos) {
  if (!datos || typeof datos.id !== 'string' || !/^BOR-\d+-\d+$/.test(datos.id) ||
      typeof datos.huellaCarrito !== 'string') {
    return null;
  }
  const destinatario = sanearDestinatario(datos.destinatario);
  if (!destinatario) {
    return null;
  }
  try {
    const elementos = JSON.parse(datos.huellaCarrito);
    if (!Array.isArray(elementos) || elementos.length === 0) {
      return null;
    }
    const lineas = elementos.map(function reconstruirLinea(elemento) {
      return { producto: { id: elemento.id, precio: elemento.precio, nombre: elemento.nombre }, cantidad: elemento.cantidad };
    });
    if (!elementos.every(validarElementoOrden) || !carritoComprable(lineas) ||
        obtenerHuellaCarrito(lineas) !== datos.huellaCarrito) {
      return null;
    }
    return { id: datos.id, destinatario, huellaCarrito: obtenerHuellaCarrito(lineas) };
  } catch {
    return null;
  }
}

function validarElementoOrden(elemento) {
  return elemento && Number.isSafeInteger(elemento.id) && elemento.id > 0 &&
    Number.isSafeInteger(elemento.cantidad) && elemento.cantidad > 0 &&
    Number.isFinite(elemento.precio) && elemento.precio >= 0 && textoValido(elemento.nombre, 1, 200);
}

export function sanearOrden(datos) {
  if (!datos || datos.simulada !== true || typeof datos.id !== 'string' || !/^SSM-\d+-\d+$/.test(datos.id) ||
      typeof datos.borradorId !== 'string' || !/^BOR-\d+-\d+$/.test(datos.borradorId) ||
      typeof datos.fecha !== 'string' || !Number.isFinite(Date.parse(datos.fecha)) ||
      !metodosPago.includes(datos.metodo) || !Array.isArray(datos.elementos) ||
      datos.elementos.length === 0 || !datos.elementos.every(validarElementoOrden)) {
    return null;
  }
  const destinatario = sanearDestinatario(datos.destinatario);
  const identificadores = new Set(datos.elementos.map(function obtenerId(elemento) { return elemento.id; }));
  if (!destinatario || identificadores.size !== datos.elementos.length) {
    return null;
  }
  const elementos = datos.elementos.map(function conservarDatosPermitidos(elemento) {
    return { id: elemento.id, nombre: elemento.nombre.trim(), precio: elemento.precio, cantidad: elemento.cantidad };
  });
  const lineas = elementos.map(function obtenerLinea(elemento) { return { producto: elemento, cantidad: elemento.cantidad }; });
  if (!carritoComprable(lineas)) {
    return null;
  }
  // El comprobante es histórico; sus totales se reconstruyen de los artículos emitidos.
  return {
    id: datos.id, borradorId: datos.borradorId, fecha: new Date(datos.fecha).toISOString(),
    simulada: true, metodo: datos.metodo, destinatario, elementos, totales: calcularTotales(lineas)
  };
}
