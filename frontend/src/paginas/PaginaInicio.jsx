import { Link } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos.js';
import { useCarrito } from '../hooks/useCarrito.js';
import ListaProductos from '../componentes/organismos/ListaProductos.jsx';

export default function PaginaInicio() {
  const { productos } = useProductos();
  const { agregarProducto } = useCarrito();
  return (
    <section aria-labelledby="titulo-inicio">
      <p className="text-uppercase text-secondary fw-semibold">Bienvenido a nuestra tienda</p>
      <h1 id="titulo-inicio" className="display-5 fw-bold">Stock & Stock Market</h1>
      <p className="lead">Una demostración académica implementada con React.</p>
      <p>Tu almacén de abarrotes online: productos para la despensa, el hogar y el cuidado diario.</p>
      <Link className="btn btn-primary mb-4" to="/catalogo">Explorar catálogo</Link>
      <div className="alert alert-info">
        <h2 className="h4">Funciones de la tienda</h2>
        <p>Puedes explorar el catálogo y preparar tu carrito.</p>
        <p className="mb-0">Puedes crear una cuenta e iniciar sesión localmente, completar el checkout y simular una compra sin cobros reales. La administración local permite gestionar productos y cuentas desde un acceso separado.</p>
      </div>
      <h2 className="h3 mt-4">Productos destacados</h2>
      <ListaProductos productos={productos.slice(0, 4)} alAgregar={agregarProducto} />
    </section>
  );
}
