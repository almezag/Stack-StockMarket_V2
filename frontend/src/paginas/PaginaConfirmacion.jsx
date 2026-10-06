import { Link } from 'react-router-dom';
import { useCompra } from '../hooks/useCompra.js';
import { formatearMoneda } from '../utilidades/formatearMoneda.js';
import ResumenCompra from '../componentes/organismos/ResumenCompra.jsx';

export default function PaginaConfirmacion() {
  const { ultimaOrden, avisoPersistencia } = useCompra();
  if (!ultimaOrden) {
    return (
      <section>
        <h1>Confirmación de compra</h1>
        <p>No existe una compra simulada reciente válida para mostrar.</p>
        <Link to="/catalogo">Ir al catálogo</Link>
      </section>
    );
  }
  const destinatario = ultimaOrden.destinatario;
  const lineasEmitidas = ultimaOrden.elementos.map(function reconstruirLinea(elemento) {
    return { producto: elemento, cantidad: elemento.cantidad };
  });
  return (
    <section className="comprobante-compra">
      <h1>Compra simulada confirmada</h1>
      <p className="alert alert-info">Venta ficticia: no se ha cobrado dinero ni reservado o descontado stock real.</p>
      {avisoPersistencia && <p role="status" className="alert alert-warning">{avisoPersistencia}</p>}
      <h2 className="h4">Comprobante de simulación</h2>
      <dl>
        <dt>Número de operación</dt><dd>{ultimaOrden.id}</dd>
        <dt>Fecha</dt><dd><time dateTime={ultimaOrden.fecha}>{new Date(ultimaOrden.fecha).toLocaleString('es-CL')}</time></dd>
        <dt>Método elegido (sin cobro)</dt><dd>{ultimaOrden.metodo}</dd>
        <dt>Destinatario</dt><dd>{destinatario.nombre}</dd>
        <dt>Correo</dt><dd>{destinatario.correo}</dd>
        <dt>Dirección y comuna</dt><dd>{destinatario.direccion}, {destinatario.comuna}</dd>
        <dt>Entrega</dt><dd>{destinatario.entrega}</dd>
      </dl>
      <h2 className="h4">Productos emitidos</h2>
      <ul className="list-group">
        {ultimaOrden.elementos.map(function presentarArticulo(elemento) {
          return <li className="list-group-item" key={elemento.id}>{elemento.cantidad} × {elemento.nombre} — precio unitario {formatearMoneda(elemento.precio)} — importe {formatearMoneda(elemento.precio * elemento.cantidad)}</li>;
        })}
      </ul>
      <ResumenCompra lineasCarrito={lineasEmitidas} />
      <p className="mt-3">Se muestra la última orden local válida, no una confirmación bancaria. No ingreses información personal real.</p>
      <Link className="btn btn-primary" to="/catalogo">Seguir comprando</Link>
    </section>
  );
}
