import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos.js';
import { useCarrito } from '../hooks/useCarrito.js';
import FiltrosCatalogo from '../componentes/moleculas/FiltrosCatalogo.jsx';
import ListaProductos from '../componentes/organismos/ListaProductos.jsx';

function normalizarTexto(texto) {
  return texto.trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function PaginaCatalogo() {
  const { productos } = useProductos();
  const { agregarProducto } = useCarrito();
  const [busqueda, establecerBusqueda] = useState('');
  const [parametros, establecerParametros] = useSearchParams();
  const categorias = [...new Set(productos.map(function obtenerCategoria(producto) {
    return producto.categoria;
  }))].sort();
  const categoriaUrl = parametros.get('categoria');
  let categoria = 'todas';
  if (categorias.includes(categoriaUrl)) {
    categoria = categoriaUrl;
  }
  const busquedaNormalizada = normalizarTexto(busqueda);
  const productosFiltrados = productos.filter(function coincideConFiltros(producto) {
    const coincideCategoria = categoria === 'todas' || producto.categoria === categoria;
    const coincideBusqueda = normalizarTexto(producto.nombre).includes(busquedaNormalizada);
    return coincideCategoria && coincideBusqueda;
  });

  function seleccionarCategoria(categoriaSeleccionada) {
    const parametrosActualizados = new URLSearchParams(parametros);
    if (categoriaSeleccionada === 'todas') {
      parametrosActualizados.delete('categoria');
    } else {
      parametrosActualizados.set('categoria', categoriaSeleccionada);
    }
    establecerParametros(parametrosActualizados);
  }

  return (
    <section aria-labelledby="titulo-catalogo">
      <h1 id="titulo-catalogo">Catálogo de Productos</h1>
      <p className="lead">Filtra por categoría y busca el producto que necesitas.</p>
      <FiltrosCatalogo busqueda={busqueda} categoria={categoria} categorias={categorias}
        alBuscar={establecerBusqueda} alSeleccionarCategoria={seleccionarCategoria} />
      <p role="status">Productos encontrados: {productosFiltrados.length}</p>
      <ListaProductos productos={productosFiltrados} alAgregar={agregarProducto} />
    </section>
  );
}
