export function calcularTotales(lineasCarrito) {
  const subtotal = lineasCarrito.reduce(function sumarSubtotal(total, linea) {
    return total + linea.producto.precio * linea.cantidad;
  }, 0);
  // Regla original de app.js: envío gratis desde $25.000; de lo contrario $2.990.
  let envio = 2990;
  if (subtotal >= 25000) {
    envio = 0;
  }
  return { subtotal, envio, total: subtotal + envio };
}
