import { createContext, useRef, useState } from 'react';
import { useCarrito } from '../hooks/useCarrito.js';
import { claveBorradorCompra, claveUltimaOrden, guardarDatos, leerDatos } from '../servicios/almacenamientoLocal.js';
import { carritoComprable, obtenerHuellaCarrito, sanearBorrador, sanearDestinatario, sanearOrden, validarPago } from '../utilidades/validarCompra.js';

export const ContextoCompra = createContext(null);

export function ProveedorCompra({ children }) {
  const { lineasCarrito, vaciarCarrito } = useCarrito();
  const [borrador, establecerBorrador] = useState(function cargarBorrador() {
    return sanearBorrador(leerDatos(claveBorradorCompra, null));
  });
  const [ultimaOrden, establecerUltimaOrden] = useState(function cargarOrden() {
    return sanearOrden(leerDatos(claveUltimaOrden, null));
  });
  const [avisoPersistencia, establecerAviso] = useState('');
  const operacionConfirmada = useRef(false);
  const secuencia = useRef(0);
  const carritoValido = carritoComprable(lineasCarrito);
  let motivoBloqueo = '';
  if (!carritoValido) {
    motivoBloqueo = 'No puedes continuar: necesitas un carrito no vacío con importes válidos.';
  } else if (!borrador) {
    motivoBloqueo = 'No puedes continuar: completa primero los datos de envío en el checkout.';
  } else if (ultimaOrden && ultimaOrden.borradorId === borrador.id) {
    motivoBloqueo = 'No puedes continuar: este borrador ya fue confirmado. Prepara una nueva compra.';
  } else if (borrador.huellaCarrito !== obtenerHuellaCarrito(lineasCarrito)) {
    motivoBloqueo = 'No puedes continuar: el carrito o sus precios cambiaron. Revisa nuevamente el checkout.';
  }

  function prepararCompra(valores) {
    const destinatario = sanearDestinatario(valores);
    if (!destinatario || !carritoValido) {
      return false;
    }
    secuencia.current += 1;
    const nuevoBorrador = {
      id: `BOR-${Date.now()}-${secuencia.current}`, destinatario,
      huellaCarrito: obtenerHuellaCarrito(lineasCarrito)
    };
    establecerBorrador(nuevoBorrador);
    operacionConfirmada.current = false;
    const guardado = guardarDatos(claveBorradorCompra, nuevoBorrador);
    if (!guardado) {
      establecerAviso('No se pudo guardar el borrador. Continúa solo en esta sesión; al recargar pueden reaparecer datos anteriores.');
    } else {
      establecerAviso('');
    }
    return true;
  }

  function confirmarCompra(valoresPago) {
    if (operacionConfirmada.current || motivoBloqueo || Object.keys(validarPago(valoresPago)).length > 0) {
      return false;
    }
    // El bloqueo se activa antes de escribir o navegar, incluso ante dos clics inmediatos.
    operacionConfirmada.current = true;
    const fecha = new Date();
    const elementos = lineasCarrito.map(function emitirArticulo(linea) {
      return {
        id: linea.producto.id, nombre: linea.producto.nombre,
        precio: linea.producto.precio, cantidad: linea.cantidad
      };
    });
    // Lista explícita: nunca copiar el formulario de pago ni sus campos de tarjeta.
    const orden = sanearOrden({
      id: `SSM-${fecha.getTime()}-${secuencia.current}`, borradorId: borrador.id,
      fecha: fecha.toISOString(), simulada: true, metodo: valoresPago.metodo,
      destinatario: borrador.destinatario, elementos
    });
    if (!orden) {
      operacionConfirmada.current = false;
      return false;
    }
    establecerUltimaOrden(orden);
    establecerBorrador(null);
    // Storage no ofrece transacciones: se comprueba cada escritura por separado.
    const ordenGuardada = guardarDatos(claveUltimaOrden, orden);
    const borradorLimpiado = guardarDatos(claveBorradorCompra, null);
    const carritoLimpiado = vaciarCarrito();
    if (!ordenGuardada || !borradorLimpiado || !carritoLimpiado) {
      establecerAviso('La compra fue simulada en esta sesión, pero no se pudieron guardar todos los cambios. El comprobante puede no recuperarse y pueden reaparecer registros anteriores al recargar; no se garantiza su limpieza.');
    } else {
      establecerAviso('');
    }
    return true;
  }

  return (
    <ContextoCompra.Provider value={{ borrador, ultimaOrden, carritoValido, motivoBloqueo, avisoPersistencia, prepararCompra, confirmarCompra }}>
      {children}
    </ContextoCompra.Provider>
  );
}
