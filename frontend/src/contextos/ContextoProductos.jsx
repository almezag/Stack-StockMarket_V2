import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { productosIniciales } from '../datos/productosIniciales.js';
import { claveProductos, guardarDatos, leerDatos, sanearProductos } from '../servicios/almacenamientoLocal.js';
import { ContextoUsuarios } from './ContextoUsuarios.jsx';
import { validarProducto } from '../utilidades/validarAdministracion.js';

export const ContextoProductos = createContext(null);

export function ProveedorProductos({ children }) {
  const cuentas = useContext(ContextoUsuarios);
  const [productos, establecerProductos] = useState(function cargarProductos() {
    const datos = leerDatos(claveProductos, productosIniciales);
    return sanearProductos(datos, productosIniciales);
  });
  const [persistenciaDisponible, establecerPersistenciaDisponible] = useState(true);
  const ultimoIdentificador = useRef(productos.reduce(function obtenerMayorIdentificador(mayor, producto) {
    return Math.max(mayor, producto.id);
  }, 0));

  useEffect(function persistirProductos() {
    if (!guardarDatos(claveProductos, productos)) {
      establecerPersistenciaDisponible(false);
    }
  }, [productos]);

  function guardarProducto(valores, identificador = null) {
    if (!cuentas) {
      throw new Error('Solo un administrador puede modificar estos datos.');
    }
    cuentas.exigirAdministrador();
    const errores = validarProducto(valores);
    if (Object.keys(errores).length > 0) {
      throw new Error(Object.values(errores)[0]);
    }
    if (identificador && !productos.some(function comprobarExistencia(producto) {
      return producto.id === identificador;
    })) {
      throw new Error('El producto ya no existe.');
    }
    let identificadorGuardado = identificador;
    if (!identificadorGuardado) {
      ultimoIdentificador.current += 1;
      identificadorGuardado = ultimoIdentificador.current;
    }
    if (!Number.isSafeInteger(identificadorGuardado)) {
      throw new Error('No se puede asignar un identificador de producto válido.');
    }
    const productoGuardado = {
      id: identificadorGuardado, nombre: valores.nombre.trim(), categoria: valores.categoria.trim(),
      descripcion: valores.descripcion.trim(), emoji: valores.emoji.trim(), precio: Number(valores.precio)
    };
    establecerProductos(function actualizarProductos(actuales) {
      if (!identificador) {
        return [...actuales, productoGuardado];
      }
      return actuales.map(function reemplazarProducto(producto) {
        if (producto.id === identificador) {
          return productoGuardado;
        }
        return producto;
      });
    });
    return productoGuardado;
  }

  function eliminarProducto(identificador) {
    if (!cuentas) {
      throw new Error('Solo un administrador puede modificar estos datos.');
    }
    cuentas.exigirAdministrador();
    establecerProductos(function quitarProducto(actuales) {
      return actuales.filter(function conservarProducto(producto) {
        return producto.id !== identificador;
      });
    });
  }

  return (
    <ContextoProductos.Provider value={{ productos, guardarProducto, eliminarProducto, persistenciaDisponible }}>
      {children}
    </ContextoProductos.Provider>
  );
}
