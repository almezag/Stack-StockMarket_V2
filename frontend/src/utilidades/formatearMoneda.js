const formatoMoneda = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

export function formatearMoneda(monto) {
  return formatoMoneda.format(monto);
}
