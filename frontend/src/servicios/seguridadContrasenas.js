export const iteracionesContrasena = 100000;

function convertirHexadecimal(bytes) {
  return Array.from(bytes, function convertirByte(byte) {
    return byte.toString(16).padStart(2, '0');
  }).join('');
}

function convertirBytes(hexadecimal) {
  const parejas = hexadecimal.match(/.{2}/g);
  return Uint8Array.from(parejas, function convertirPareja(pareja) {
    return parseInt(pareja, 16);
  });
}

async function derivarResumen(contrasena, sal) {
  const clave = await window.crypto.subtle.importKey(
    'raw', new TextEncoder().encode(contrasena), 'PBKDF2', false, ['deriveBits']
  );
  const resumen = await window.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: sal, iterations: iteracionesContrasena, hash: 'SHA-256' }, clave, 256
  );
  return convertirHexadecimal(new Uint8Array(resumen));
}

export function validarCredencialGuardada(credencial) {
  return Boolean(credencial && credencial.algoritmo === 'PBKDF2-SHA-256' &&
    credencial.iteraciones === iteracionesContrasena &&
    typeof credencial.sal === 'string' && /^[a-f0-9]{32}$/.test(credencial.sal) &&
    typeof credencial.resumen === 'string' && /^[a-f0-9]{64}$/.test(credencial.resumen));
}

export async function crearCredencial(contrasena) {
  // Sal aleatoria de 128 bits y derivación de 256 bits: nunca se guarda la contraseña.
  const sal = window.crypto.getRandomValues(new Uint8Array(16));
  const resumen = await derivarResumen(contrasena, sal);
  return {
    algoritmo: 'PBKDF2-SHA-256', iteraciones: iteracionesContrasena,
    sal: convertirHexadecimal(sal), resumen
  };
}

export async function comprobarContrasena(contrasena, credencial) {
  if (!validarCredencialGuardada(credencial)) {
    return false;
  }
  const resumen = await derivarResumen(contrasena, convertirBytes(credencial.sal));
  return resumen === credencial.resumen;
}
