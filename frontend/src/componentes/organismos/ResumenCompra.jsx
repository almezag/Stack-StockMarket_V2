import { calcularTotales } from '../../utilidades/calcularTotales.js';
import { formatearMoneda } from '../../utilidades/formatearMoneda.js';

export default function ResumenCompra({ lineasCarrito }) {
  const totales = calcularTotales(lineasCarrito);
  let textoEnvio = formatearMoneda(totales.envio);
  if (totales.envio === 0) {
    textoEnvio = 'Gratis';
  }

  return (
    <section aria-labelledby="titulo-resumen" className="card p-4 mt-4">
      <h2 id="titulo-resumen" className="h4">Resumen de compra</h2>
      <dl>
        <div className="d-flex justify-content-between"><dt>Subtotal</dt><dd>{formatearMoneda(totales.subtotal)}</dd></div>
        <div className="d-flex justify-content-between"><dt>Envío</dt><dd>{textoEnvio}</dd></div>
        <div className="d-flex justify-content-between"><dt>Total</dt><dd>{formatearMoneda(totales.total)}</dd></div>
      </dl>
      <p>Envío gratis desde $25.000; en pedidos menores, $2.990.</p>
      <p className="mb-0 text-secondary">El pago es una simulación académica. No se realizan compras ni cobros reales.</p>
    </section>
  );
}
