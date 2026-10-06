import Boton from '../atomos/Boton.jsx';
import { formatearMoneda } from '../../utilidades/formatearMoneda.js';

export default function TarjetaProducto({ producto, alAgregar }) {
  function agregarProductoSeleccionado() {
    alAgregar(producto.id);
  }

  return (
    <article className="card h-100 tarjeta-producto">
      <div className="ilustracion-producto text-center" aria-hidden="true">{producto.emoji}</div>
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-light align-self-start mb-2">{producto.categoria}</span>
        <h3 className="h5 card-title">{producto.nombre}</h3>
        <p className="card-text text-secondary">{producto.descripcion}</p>
        <div className="mt-auto d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <strong>{formatearMoneda(producto.precio)}</strong>
          <Boton alPresionar={agregarProductoSeleccionado} etiquetaAccesible={`Agregar ${producto.nombre} al carrito`}>
            Agregar
          </Boton>
        </div>
      </div>
    </article>
  );
}
