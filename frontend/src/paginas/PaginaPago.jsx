import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../hooks/useCarrito.js';
import { useCompra } from '../hooks/useCompra.js';
import FormularioPago from '../componentes/organismos/FormularioPago.jsx';
import ResumenCompra from '../componentes/organismos/ResumenCompra.jsx';

export default function PaginaPago() {
  const { lineasCarrito } = useCarrito();
  const { borrador, motivoBloqueo, avisoPersistencia, confirmarCompra } = useCompra();
  const navegar = useNavigate();

  function confirmarPago(valores) {
    if (!confirmarCompra(valores)) {
      return false;
    }
    navegar('/confirmacion', { replace: true });
    return true;
  }
  if (motivoBloqueo) {
    return (
      <section>
        <h1>Pago simulado</h1>
        <p role="alert">{motivoBloqueo}</p>
        <Link to="/catalogo">Ir al catálogo</Link>
        <p><Link to="/carrito">Volver al carrito</Link></p>
        <p><Link to="/checkout">Revisar checkout</Link></p>
      </section>
    );
  }
  return (
    <section>
      <h1>Pago simulado</h1>
      {avisoPersistencia && <p role="status" className="alert alert-warning">{avisoPersistencia}</p>}
      <p>Destinatario: {borrador.destinatario.nombre}. Entrega: {borrador.destinatario.entrega}.</p>
      <p>Revisa los importes actuales antes de confirmar. No se descuenta stock real.</p>
      <div className="row g-4">
        <div className="col-lg-4"><ResumenCompra lineasCarrito={lineasCarrito} /></div>
        <div className="col-lg-8"><FormularioPago alConfirmar={confirmarPago} /></div>
      </div>
      <Link className="d-inline-block mt-3" to="/checkout">Revisar checkout</Link>
    </section>
  );
}
