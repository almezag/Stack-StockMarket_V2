import { createContext, useEffect, useState } from 'react';
import { useProductos } from '../hooks/useProductos.js';
import { claveCarrito, guardarDatos, leerDatos, sanearCarrito } from '../servicios/almacenamientoLocal.js';

export const ContextoCarrito = createContext(null);

export function ProveedorCarrito({ children }) {
  const { productos } = useProductos();
  const [elementos, establecerElementos] = useState(function cargarCarrito() {
    return sanearCarrito(leerDatos(claveCarrito, []), productos);
  });

  // Los nombres y precios siempre provienen del catálogo compartido, no del carrito guardado.
  const elementosDisponibles = sanearCarrito(elementos, productos);
  const lineasCarrito = elementosDisponibles.map(function completarElemento(elemento) {
    const producto = productos.find(function buscarProducto(productoDisponible) {
      return productoDisponible.id === elemento.id;
    });
    return { producto, cantidad: elemento.cantidad };
  });
  const totalUnidades = elementosDisponibles.reduce(function sumarUnidades(total, elemento) {
    return total + elemento.cantidad;
  }, 0);

  useEffect(function persistirCarrito() {
    guardarDatos(claveCarrito, sanearCarrito(elementos, productos));
  }, [elementos, productos]);

  function agregarProducto(identificador) {
    const producto = productos.find(function buscarProducto(productoDisponible) {
      return productoDisponible.id === identificador;
    });
    if (!producto) {
      return;
    }
    establecerElementos(function incrementarCarrito(elementosActuales) {
      const carritoDisponible = sanearCarrito(elementosActuales, productos);
      const elementoExistente = carritoDisponible.find(function buscarElemento(elemento) {
        return elemento.id === identificador;
      });
      if (!elementoExistente) {
        return [...carritoDisponible, { id: identificador, cantidad: 1 }];
      }
      return carritoDisponible.map(function incrementarElemento(elemento) {
        if (elemento.id === identificador && Number.isSafeInteger(elemento.cantidad + 1)) {
          return { id: identificador, cantidad: elemento.cantidad + 1 };
        }
        return elemento;
      });
    });
  }

  function cambiarCantidad(identificador, cantidad) {
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
      return;
    }
    establecerElementos(function actualizarCantidad(elementosActuales) {
      return elementosActuales.map(function actualizarElemento(elemento) {
        if (elemento.id === identificador) {
          return { id: identificador, cantidad };
        }
        return elemento;
      });
    });
  }

  function eliminarProducto(identificador) {
    establecerElementos(function quitarElemento(elementosActuales) {
      return elementosActuales.filter(function conservarElemento(elemento) {
        return elemento.id !== identificador;
      });
    });
  }

  function vaciarCarrito() {
    establecerElementos([]);
    // Informar el resultado de escritura permite avisar sobre una limpieza parcial.
    return guardarDatos(claveCarrito, []);
  }

  return (
    <ContextoCarrito.Provider value={{ lineasCarrito, totalUnidades, agregarProducto, cambiarCantidad, eliminarProducto, vaciarCarrito }}>
      {children}
    </ContextoCarrito.Provider>
  );
}
