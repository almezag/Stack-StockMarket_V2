import { carritoComprable, formatearNumeroTarjeta, formatearVencimiento, obtenerHuellaCarrito, sanearBorrador, sanearDestinatario, sanearOrden, validarContacto, validarDestinatario, validarPago } from '../src/utilidades/validarCompra.js';

function destinatarioValido() {
  return { nombre: ' Ana Pérez ', correo: 'ANA@example.cl', direccion: ' Calle Uno 123 ', comuna: 'Santiago', entrega: 'Despacho a domicilio' };
}
function ordenValida() {
  return {
    id: 'SSM-123456-1', borradorId: 'BOR-123456-1', fecha: '2026-10-05T12:00:00.000Z', simulada: true,
    metodo: 'Pago en tienda', destinatario: destinatarioValido(),
    elementos: [{ id: 1, nombre: 'Arroz', precio: 1890, cantidad: 2 }]
  };
}
function lineasValidas() { return [{ producto: { id: 1, nombre: 'Arroz', precio: 1890 }, cantidad: 2 }]; }

describe('Validaciones de compra y persistencia mínima', function describirValidaciones() {
  it('valida todos los datos de envío y sanea solamente sus campos permitidos', function comprobarDestinatario() {
    expect(Object.keys(validarDestinatario({})).sort()).toEqual(['comuna', 'correo', 'direccion', 'entrega', 'nombre']);
    const datos = { ...destinatarioValido(), numeroTarjeta: '4111111111111111', cvv: '123', extra: true };
    expect(sanearDestinatario(datos)).toEqual({ nombre: 'Ana Pérez', correo: 'ana@example.cl', direccion: 'Calle Uno 123', comuna: 'Santiago', entrega: 'Despacho a domicilio' });
    expect(sanearDestinatario({ ...datos, entrega: 'Entrega inventada' })).toBeNull();
    expect(sanearDestinatario(null)).toBeNull();
    expect(validarDestinatario({ ...datos, nombre: 'a'.repeat(101), direccion: 'a'.repeat(201), comuna: '' }).nombre).toBeTruthy();
  });

  it('exige método conocido y tarjeta solo para ese método', function comprobarMetodos() {
    expect(validarPago({ metodo: '' }).metodo).toBeTruthy();
    expect(validarPago({ metodo: 'Proveedor inventado' }).metodo).toBeTruthy();
    expect(validarPago({ metodo: 'Transferencia bancaria' })).toEqual({});
    expect(validarPago({ metodo: 'Pago en tienda', cvv: 'invalido' })).toEqual({});
    expect(Object.keys(validarPago({ metodo: 'Tarjeta de crédito/débito' })).sort()).toEqual(['cvv', 'numeroTarjeta', 'vencimiento']);
  });

  it('comprueba expiración al fin de mes, meses imposibles y CVV de tres o cuatro dígitos', function comprobarExpiracion() {
    const fecha = new Date(2026, 9, 5);
    const tarjeta = { metodo: 'Tarjeta de crédito/débito', numeroTarjeta: '4111 1111 1111 1111', vencimiento: '10/26', cvv: '123' };
    expect(validarPago(tarjeta, fecha)).toEqual({});
    expect(validarPago({ ...tarjeta, cvv: '1234', vencimiento: '01/27' }, fecha)).toEqual({});
    expect(validarPago({ ...tarjeta, vencimiento: '09/26' }, fecha).vencimiento).toContain('vencida');
    expect(validarPago({ ...tarjeta, vencimiento: '12/25' }, fecha).vencimiento).toContain('vencida');
    ['00/27', '13/27', '1/27', '12/2027'].forEach(function probarFormato(vencimiento) {
      expect(validarPago({ ...tarjeta, vencimiento }, fecha).vencimiento).toBeTruthy();
    });
    ['12', '12345', 'abc'].forEach(function probarCvv(cvv) {
      expect(validarPago({ ...tarjeta, cvv }, fecha).cvv).toBeTruthy();
    });
    expect(validarPago({ ...tarjeta, numeroTarjeta: '4111a111111111111' }, fecha).numeroTarjeta).toBeTruthy();
  });

  it('formatea tarjeta y vencimiento sin aceptar letras ni dígitos excedentes', function comprobarFormato() {
    expect(formatearNumeroTarjeta('4111a111111111111999')).toBe('4111 1111 1111 1111');
    expect(formatearVencimiento('a1')).toBe('1');
    expect(formatearVencimiento('12/2999')).toBe('12/29');
  });

  it('valida los cinco campos de contacto según reglas originales y límites', function comprobarContacto() {
    const contacto = { nombre: 'Ana Pérez', correo: 'ana@gmail.com', telefono: '+56 9 1234 5678', asunto: 'Despacho', mensaje: 'Quisiera consultar por el despacho.' };
    expect(validarContacto(contacto)).toEqual({});
    expect(Object.keys(validarContacto({})).sort()).toEqual(['asunto', 'correo', 'mensaje', 'nombre', 'telefono']);
    expect(validarContacto({ ...contacto, correo: 'ana@example.cl' }).correo).toBeTruthy();
    expect(validarContacto({ ...contacto, mensaje: 'corto' }).mensaje).toBeTruthy();
    expect(validarContacto({ ...contacto, mensaje: 'a'.repeat(501) }).mensaje).toBeTruthy();
    expect(validarContacto({ ...contacto, nombre: 'a'.repeat(101) }).nombre).toBeTruthy();
    expect(validarContacto({ ...contacto, asunto: 'Inventado' }).asunto).toBeTruthy();
  });

  it('descarta JSON/estructuras inválidas de borrador y elimina campos extra', function comprobarBorrador() {
    const datos = { id: 'BOR-123456-1', destinatario: destinatarioValido(), huellaCarrito: obtenerHuellaCarrito(lineasValidas()), cvv: '123' };
    expect(Object.keys(sanearBorrador(datos)).sort()).toEqual(['destinatario', 'huellaCarrito', 'id']);
    [null, {}, { ...datos, id: '' }, { ...datos, huellaCarrito: '{' }, { ...datos, huellaCarrito: '[]' }, { ...datos, huellaCarrito: 'null' }, { ...datos, huellaCarrito: '[null]' }, { ...datos, destinatario: {} }].forEach(function probarBorradorInvalido(borrador) {
      expect(sanearBorrador(borrador)).toBeNull();
    });
    expect(carritoComprable([])).toBeFalse();
    expect(carritoComprable([{ producto: { precio: Number.MAX_VALUE }, cantidad: 100 }])).toBeFalse();
    expect(obtenerHuellaCarrito(lineasValidas())).toContain('1890');
  });

  it('restaura una orden histórica mediante lista permitida y recalcula totales, nunca tarjeta', function comprobarOrden() {
    const datos = { ...ordenValida(), numeroTarjeta: '4111111111111111', cvv: '123', vencimiento: '12/99', totales: { total: 1 } };
    const orden = sanearOrden(datos);
    expect(orden.totales).toEqual({ subtotal: 3780, envio: 2990, total: 6770 });
    expect(orden.numeroTarjeta).toBeUndefined();
    expect(orden.cvv).toBeUndefined();
    expect(orden.vencimiento).toBeUndefined();
    expect(orden.destinatario.correo).toBe('ana@example.cl');
    const invalidados = [null, {}, { ...datos, simulada: false }, { ...datos, fecha: 'ayer' }, { ...datos, id: 'venta falsa' }, { ...datos, borradorId: 'otro' }, { ...datos, metodo: 'Inventado' }, { ...datos, elementos: [] }, { ...datos, elementos: [null] }, { ...datos, elementos: [{ id: 1, nombre: 'Arroz', precio: -1, cantidad: 1 }] }, { ...datos, destinatario: null }, { ...datos, elementos: [...datos.elementos, ...datos.elementos] }];
    invalidados.forEach(function probarOrdenInvalida(ordenInvalida) { expect(sanearOrden(ordenInvalida)).toBeNull(); });
  });
});
