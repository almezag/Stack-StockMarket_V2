export function validarRut(valor) {
  if (typeof valor !== 'string' || !/^[0-9.kK-]+$/.test(valor.trim())) {
    return false;
  }
  const rut = valor.trim().replace(/[.-]/g, '').toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(rut)) {
    return false;
  }
  const cuerpo = rut.slice(0, -1);
  if (Number(cuerpo) === 0) {
    return false;
  }
  let suma = 0;
  let multiplicador = 2;
  for (let indice = cuerpo.length - 1; indice >= 0; indice -= 1) {
    suma += Number(cuerpo[indice]) * multiplicador;
    multiplicador += 1;
    if (multiplicador > 7) {
      multiplicador = 2;
    }
  }
  const resultado = 11 - (suma % 11);
  let digitoEsperado = String(resultado);
  if (resultado === 11) {
    digitoEsperado = '0';
  } else if (resultado === 10) {
    digitoEsperado = 'K';
  }
  return rut.slice(-1) === digitoEsperado;
}
