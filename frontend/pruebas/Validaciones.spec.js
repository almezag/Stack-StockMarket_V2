import { validarRut } from '../src/utilidades/validarRut.js';
import { validarRegistro, validarInicioSesion, normalizarCorreo } from '../src/utilidades/validarFormularios.js';
import { crearCredencial, comprobarContrasena, validarCredencialGuardada } from '../src/servicios/seguridadContrasenas.js';
import { crearUsuariosDemostracion } from '../src/datos/usuariosDemostracion.js';
import { sanearUsuarios, sanearSesion } from '../src/servicios/almacenamientoLocal.js';

function crearRegistroValido() {
  return {
    nombre: 'María José Muñoz', rut: '12.345.678-5', correo: 'persona@gmail.com',
    telefono: '+56 9 1234 5678', comuna: 'Ñuñoa', contrasena: 'ClaveDemo123', confirmacion: 'ClaveDemo123'
  };
}

describe('Validaciones puras de las cuentas', function describirValidaciones() {
  it('comprueba módulo once sin aceptar letras ajenas ni cuerpos vacíos', function comprobarRut() {
    expect(validarRut('12.345.678-5')).toBeTrue();
    expect(validarRut('123456785')).toBeTrue();
    expect(validarRut('11.111.111-1')).toBeTrue();
    expect(validarRut('12.345.678-9')).toBeFalse();
    expect(validarRut('texto12.345.678-5')).toBeFalse();
    expect(validarRut('00000000-0')).toBeFalse();
    expect(validarRut('K')).toBeFalse();
    expect(validarRut(null)).toBeFalse();
  });

  it('acepta nombres con acentos y las sugerencias originales', function comprobarPerfilValido() {
    expect(validarRegistro(crearRegistroValido())).toEqual({});
    expect(normalizarCorreo('  PERSONA@GMAIL.COM  ')).toBe('persona@gmail.com');
    expect(normalizarCorreo(null)).toBe('');
  });

  it('identifica cada campo de perfil inválido', function comprobarPerfilInvalido() {
    const errores = validarRegistro({
      ...crearRegistroValido(), nombre: '123', rut: 'incorrecto', correo: 'persona@otro.cl',
      telefono: '1234', comuna: 'Comuna inexistente', confirmacion: ''
    });
    expect(Object.keys(errores).sort()).toEqual(['comuna', 'confirmacion', 'correo', 'nombre', 'rut', 'telefono']);
  });

  [7, 8, 64, 65].forEach(function definirPruebaLongitud(longitud) {
    it(`aplica la misma regla de ${longitud} caracteres en registro e ingreso`, function comprobarLimite() {
      const contrasena = 'a'.repeat(longitud);
      const valores = { ...crearRegistroValido(), contrasena, confirmacion: contrasena };
      const esValida = longitud >= 8 && longitud <= 64;
      expect(Boolean(validarRegistro(valores).contrasena)).toBe(!esValida);
      expect(Boolean(validarInicioSesion(valores).contrasena)).toBe(!esValida);
    });
  });
});

describe('Credenciales criptográficas y saneamiento', function describirCredenciales() {
  it('deriva credenciales con sales diferentes y verifica realmente la contraseña', async function comprobarPbkdf2() {
    const primera = await crearCredencial('ClaveDemo123');
    const segunda = await crearCredencial('ClaveDemo123');
    expect(primera.sal).not.toBe(segunda.sal);
    expect(primera.resumen).not.toBe(segunda.resumen);
    expect(primera.iteraciones).toBe(100000);
    expect(await comprobarContrasena('ClaveDemo123', primera)).toBeTrue();
    expect(await comprobarContrasena('OtraClave123', primera)).toBeFalse();
    expect(await comprobarContrasena('ClaveDemo123', null)).toBeFalse();
    expect(validarCredencialGuardada({ ...primera, iteraciones: 1 })).toBeFalse();
    expect(validarCredencialGuardada({ ...primera, sal: 'no es hexadecimal' })).toBeFalse();
    expect(validarCredencialGuardada({ ...primera, resumen: 'incorrecto' })).toBeFalse();
  });

  it('elimina usuarios inválidos, duplicados y datos extra sin guardar contraseñas', async function comprobarSaneamiento() {
    const usuarios = await crearUsuariosDemostracion();
    const cliente = usuarios[0];
    const datos = [
      { ...cliente, correo: ' CLIENTE@GMAIL.COM ', contrasena: 'NoGuardar', permiso: 'total' },
      cliente, { ...cliente, id: 'duplicado' }, null,
      { ...cliente, id: 'rol-invalido', rol: 'superusuario' },
      { ...cliente, id: 'perfil-invalido', correo: 'otro@gmail.com', telefono: '' },
      { ...cliente, id: 'credencial-invalida', correo: 'tercero@gmail.com', credencial: {} },
      usuarios[1]
    ];
    const saneados = sanearUsuarios(datos);
    expect(saneados.length).toBe(2);
    expect(saneados[0].correo).toBe('cliente@gmail.com');
    expect(saneados[0].contrasena).toBeUndefined();
    expect(saneados[0].permiso).toBeUndefined();
    expect(sanearUsuarios({})).toBeNull();
    expect(sanearUsuarios([])).toEqual([]);
    expect(sanearSesion({ usuarioId: 'cliente-demo', rol: 'administrador' }, saneados)).toEqual({ usuarioId: 'cliente-demo' });
    // T5 comparte una sesión mínima para ambos accesos; el rol proviene de las cuentas saneadas.
    expect(sanearSesion({ usuarioId: 'administrador-demo', rol: 'cliente', nombre: 'Nombre falso' }, saneados))
      .toEqual({ usuarioId: 'administrador-demo' });
    expect(sanearSesion({ usuarioId: 'rol-invalido', rol: 'administrador' }, saneados)).toBeNull();
    expect(sanearSesion({ usuarioId: 'administrador-demo' }, [saneados[0]])).toBeNull();
    expect(sanearSesion({ usuarioId: 'desconocido' }, saneados)).toBeNull();
    expect(sanearSesion([], saneados)).toBeNull();
    expect(sanearSesion(null, saneados)).toBeNull();
  });
});
