import { Link } from 'react-router-dom';
import { useCarrito } from '../hooks/useCarrito.js';
import FilaCarrito from '../componentes/moleculas/FilaCarrito.jsx';
import ResumenCompra from '../componentes/organismos/ResumenCompra.jsx';

export default function PaginaCarrito() {
  const { lineasCarrito, cambiarCantidad, eliminarProducto } = useCarrito();
  if (lineasCarrito.length === 0) {
    return (
      <section aria-labelledby="titulo-carrito">
        <h1 id="titulo-carrito">Carrito de Compras</h1>
        <h2 className="h4 mt-4">Tu carrito está vacío</h2>
        <Link className="btn btn-primary" to="/catalogo">Ir al catálogo</Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="titulo-carrito">
      <h1 id="titulo-carrito">Carrito de Compras</h1>
      <p>Revisa cantidades antes de continuar. Solo se aceptan cantidades enteras mayores que cero.</p>
      <div className="table-responsive">
        <table className="table align-middle">
          <caption className="visually-hidden">Productos del carrito</caption>
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Precio</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Subtotal</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lineasCarrito.map(function presentarLinea(linea) {
              return (
                <FilaCarrito key={linea.producto.id} linea={linea}
                  alCambiarCantidad={cambiarCantidad} alEliminar={eliminarProducto} />
              );
            })}
          </tbody>
        </table>
      </div>
      <Link className="btn btn-outline-dark" to="/catalogo">Seguir comprando</Link>
      <ResumenCompra lineasCarrito={lineasCarrito} />
      <Link className="btn btn-primary mt-3" to="/checkout">Continuar al checkout</Link>
    </section>
  );
}
