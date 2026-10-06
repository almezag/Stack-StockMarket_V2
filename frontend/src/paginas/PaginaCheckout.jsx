import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../hooks/useCarrito.js';
import { useCompra } from '../hooks/useCompra.js';
import FormularioCheckout from '../componentes/organismos/FormularioCheckout.jsx';
import ResumenCompra from '../componentes/organismos/ResumenCompra.jsx';

export default function PaginaCheckout() {
  const { lineasCarrito } = useCarrito();
  const { borrador, carritoValido, prepararCompra, avisoPersistencia } = useCompra();
  const navegar = useNavigate();

  function continuarAlPago(valores) {
    if (!prepararCompra(valores)) {
      return false;
    }
    navegar('/pago');
    return true;
  }
  if (!carritoValido) {
    return (
      <section>
        <h1>Checkout</h1>
        <p role="alert">No puedes continuar: necesitas productos con importes válidos en el carrito.</p>
        <Link to="/catalogo">Ir al catálogo</Link>
        <p><Link to="/carrito">Volver al carrito</Link></p>
      </section>
    );
  }
  return (
    <section>
      <h1>Checkout</h1>
      <p>Información para preparar la orden simulada.</p>
      {avisoPersistencia && <p role="status" className="alert alert-warning">{avisoPersistencia}</p>}
      <div className="row g-4">
        <div className="col-lg-8"><FormularioCheckout destinatarioInicial={borrador?.destinatario} alContinuar={continuarAlPago} /></div>
        <div className="col-lg-4"><ResumenCompra lineasCarrito={lineasCarrito} /></div>
      </div>
      <Link className="d-inline-block mt-3" to="/carrito">Volver al carrito</Link>
    </section>
  );
}
