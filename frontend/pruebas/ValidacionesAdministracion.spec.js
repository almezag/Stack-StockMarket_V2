import { validarProducto, validarUsuarioAdministrativo, validarCambioAdministrador } from '../src/utilidades/validarAdministracion.js';
import { sanearSesion, sanearUsuarios } from '../src/servicios/almacenamientoLocal.js';
import { crearUsuariosDemostracion } from '../src/datos/usuariosDemostracion.js';

function productoValido() {
  return { nombre: 'Pan Integral', categoria: 'Panadería', descripcion: 'Pan de prueba.', emoji: '🍞', precio: '3000' };
}
function usuarioValido() {
  return { nombre: 'Ana Pérez', correo: 'ana@gmail.com', rol: 'cliente', contrasena: 'NuevaDemo123' };
}

describe('Validaciones de administración', function describirValidaciones() {
  it('acepta campos completos y un precio CLP entero positivo sin imponer un techo comercial', function comprobarProductoValido() {
    expect(validarProducto(productoValido())).toEqual({});
    expect(validarProducto({ ...productoValido(), precio: Number.MAX_SAFE_INTEGER })).toEqual({});
  });
  it('asocia mensajes a todos los campos vacíos del producto', function comprobarCamposProducto() {
    const errores = validarProducto({ nombre: ' ', categoria: '', descripcion: '', emoji: ' ', precio: '' });
    expect(Object.keys(errores).sort()).toEqual(['categoria', 'descripcion', 'emoji', 'nombre', 'precio']);
  });
  [0, -1, 1.5, Infinity, NaN, 'texto', Number.MAX_SAFE_INTEGER + 1, true].forEach(function definirPrecioInvalido(precio) {
    it(`rechaza el precio no válido ${String(precio)}`, function comprobarPrecio() {
      expect(validarProducto({ ...productoValido(), precio }).precio).toBeTruthy();
    });
  });
  it('rechaza nombre, dominio, rol desconocido y contraseña inválidos sin aceptar campos faltantes', function comprobarUsuarioInvalido() {
    const errores = validarUsuarioAdministrativo({ nombre: '123', correo: 'ana@otro.cl', rol: 'vendedor', contrasena: 'corta' });
    expect(Object.keys(errores).sort()).toEqual(['contrasena', 'correo', 'nombre', 'rol']);
    expect(Object.keys(validarUsuarioAdministrativo({})).sort()).toEqual(['contrasena', 'correo', 'nombre', 'rol']);
  });
  it('compara duplicados sin mayúsculas ni espacios y permite conservar el correo propio al editar', function comprobarDuplicados() {
    const existentes = [{ id: 'ana', correo: 'ANA@gmail.com' }];
    expect(validarUsuarioAdministrativo({ ...usuarioValido(), correo: ' ANA@gmail.com ' }, existentes).correo).toBeTruthy();
    expect(validarUsuarioAdministrativo({ ...usuarioValido(), contrasena: '' }, existentes, 'ana')).toEqual({});
  });
  [7, 8, 64, 65].forEach(function definirLongitud(longitud) {
    it(`aplica 8–64 caracteres también al crear o cambiar una contraseña de ${longitud}`, function comprobarContrasena() {
      const valores = { ...usuarioValido(), contrasena: 'a'.repeat(longitud) };
      const invalida = longitud < 8 || longitud > 64;
      expect(Boolean(validarUsuarioAdministrativo(valores).contrasena)).toBe(invalida);
      expect(Boolean(validarUsuarioAdministrativo(valores, [], 'ana').contrasena)).toBe(invalida);
    });
  });
  it('protege el último administrador y la cuenta activa incluso si hay otro administrador', function comprobarProtecciones() {
    const administrador = { id: 'administrador', rol: 'administrador' };
    const otroAdministrador = { id: 'otro', rol: 'administrador' };
    expect(validarCambioAdministrador([administrador], administrador, administrador, 'cliente')).toContain('último administrador');
    expect(validarCambioAdministrador([administrador], administrador, administrador, null, true)).toContain('último administrador');
    expect(validarCambioAdministrador([administrador, otroAdministrador], administrador, administrador, 'cliente')).toContain('propia cuenta');
    expect(validarCambioAdministrador([administrador, otroAdministrador], administrador, administrador, null, true)).toContain('propia cuenta');
    expect(validarCambioAdministrador([administrador, otroAdministrador], administrador, otroAdministrador, 'cliente')).toBe('');
    expect(validarCambioAdministrador([], { rol: 'cliente' }, administrador, 'cliente')).toContain('Solo un administrador');
    expect(validarCambioAdministrador([administrador], administrador, null, 'cliente')).toContain('ya no existe');
  });
  it('restaura solo usuarios vigentes con rol reconocido e ignora el rol declarado en la sesión', async function comprobarSesionVigente() {
    const demostraciones = await crearUsuariosDemostracion();
    const saneados = sanearUsuarios(demostraciones);
    expect(sanearSesion({ usuarioId: 'administrador-demo', rol: 'cliente' }, saneados)).toEqual({ usuarioId: 'administrador-demo' });
    const rolInvalido = [{ ...demostraciones[1], rol: 'superusuario' }];
    expect(sanearSesion({ usuarioId: 'administrador-demo', rol: 'administrador' }, rolInvalido)).toBeNull();
    expect(sanearSesion({ usuarioId: 'administrador-demo' }, sanearUsuarios(rolInvalido))).toBeNull();
    expect(sanearSesion({ usuarioId: 'cliente-demo' }, [saneados[1]])).toBeNull();
    expect(sanearSesion({ usuarioId: 'desconocido', rol: 'administrador' }, saneados)).toBeNull();
  });
});
