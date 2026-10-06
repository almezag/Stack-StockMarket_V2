import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useContext } from 'react';
import { ProveedorProductos } from '../src/contextos/ContextoProductos.jsx';
import { ProveedorCarrito, ContextoCarrito } from '../src/contextos/ContextoCarrito.jsx';
import { ProveedorCompra, ContextoCompra } from '../src/contextos/ContextoCompra.jsx';
import { claveBorradorCompra, claveUltimaOrden, claveCarrito, claveProductos } from '../src/servicios/almacenamientoLocal.js';
import Aplicacion from '../src/Aplicacion.jsx';

function renderizarCompra(ruta = '/catalogo') {
  return render(<MemoryRouter initialEntries={[ruta]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Aplicacion /></MemoryRouter>);
}
function escribirCampo(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}
function completarDestinatario() {
  escribirCampo('Nombre', 'Ana Pérez');
  escribirCampo('Correo', 'ana@example.cl');
  escribirCampo('Dirección', 'Calle Uno 123');
  escribirCampo('Comuna', 'Santiago');
}
function llegarAlPago() {
  iniciarCheckout();
  completarDestinatario();
  fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }));
}
function iniciarCheckout() {
  fireEvent.click(screen.getByRole('button', { name: 'Agregar Arroz Grado 1 1kg al carrito' }));
  fireEvent.click(screen.getByRole('link', { name: /Carrito/ }));
  fireEvent.click(screen.getByRole('link', { name: 'Continuar al checkout' }));
}
beforeEach(function prepararCompra() { localStorage.clear(); });
afterEach(function limpiarCompra() { localStorage.clear(); });

describe('Compra invitada y contacto', function describirCompra() {
  it('rechaza dos confirmaciones inmediatas desde el contexto antes de desmontar o navegar', function comprobarBloqueoDirecto() {
    let compraActual;
    let carritoActual;
    function ObservarCompra() {
      compraActual = useContext(ContextoCompra);
      carritoActual = useContext(ContextoCarrito);
      return <p>{compraActual.ultimaOrden ? 'Orden emitida' : 'Sin orden'}</p>;
    }
    render(<ProveedorProductos><ProveedorCarrito><ProveedorCompra><ObservarCompra /></ProveedorCompra></ProveedorCarrito></ProveedorProductos>);
    act(function agregarArticulo() {
      carritoActual.agregarProducto(1);
    });
    act(function prepararBorrador() {
      expect(compraActual.prepararCompra({ nombre: 'Ana Pérez', correo: 'ana@example.cl', direccion: 'Calle Uno 123', comuna: 'Santiago', entrega: 'Despacho a domicilio' })).toBeTrue();
    });
    const confirmarCompra = compraActual.confirmarCompra;
    const escritura = spyOn(Storage.prototype, 'setItem').and.callThrough();
    let primeraConfirmacion;
    let segundaConfirmacion;
    act(function confirmarDosVecesSinRenderIntermedio() {
      primeraConfirmacion = confirmarCompra({ metodo: 'Pago en tienda' });
      segundaConfirmacion = confirmarCompra({ metodo: 'Pago en tienda' });
    });
    expect(primeraConfirmacion).toBeTrue();
    expect(segundaConfirmacion).toBeFalse();
    const escriturasOrden = escritura.calls.allArgs().filter(function seleccionarOrden(argumentos) {
      return argumentos[0] === claveUltimaOrden;
    });
    expect(escriturasOrden.length).toBe(1);
    expect(screen.getByText('Orden emitida')).toBeTruthy();
    expect(compraActual.ultimaOrden.id).toBe(JSON.parse(localStorage.getItem(claveUltimaOrden)).id);
    expect(carritoActual.lineasCarrito).toEqual([]);
  });
  it('recorre catálogo, carrito, checkout, pago y comprobante sin exigir cuenta', function comprobarFlujoCompleto() {
    renderizarCompra();
    iniciarCheckout();
    completarDestinatario();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }));
    expect(screen.getByRole('heading', { name: 'Pago simulado', level: 1 })).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Pago en tienda'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
    expect(screen.getByRole('heading', { name: 'Compra simulada confirmada' })).toBeTruthy();
    expect(screen.getByText('Ana Pérez')).toBeTruthy();
    expect(screen.getByText(/1 × Arroz Grado 1 1kg/)).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Resumen de compra' }).textContent).toContain('$4.880');
    expect(JSON.parse(localStorage.getItem('stock_react_carrito_v1'))).toEqual([]);
  });
  it('explica los accesos sin carrito y ofrece regreso real', function comprobarGuardas() {
    renderizarCompra('/pago');
    expect(screen.getByText(/No puedes continuar/)).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Ir al catálogo' }));
    expect(screen.getAllByRole('article').length).toBe(18);
  });
  it('recupera el comprobante al remontar y bloquea volver a pagar', function comprobarRecarga() {
    const interfaz = renderizarCompra();
    llegarAlPago();
    fireEvent.click(screen.getByLabelText('Transferencia bancaria'));
    const boton = screen.getByRole('button', { name: 'Confirmar pago piloto' });
    const escritura = spyOn(Storage.prototype, 'setItem').and.callThrough();
    fireEvent.click(boton);
    const orden = JSON.parse(localStorage.getItem(claveUltimaOrden));
    expect(orden.metodo).toBe('Transferencia bancaria');
    expect(orden.simulada).toBeTrue();
    expect(orden.totales).toEqual({ subtotal: 1890, envio: 2990, total: 4880 });
    expect(orden.id).toMatch(/^SSM-\d+-\d+$/);
    expect(Number.isFinite(Date.parse(orden.fecha))).toBeTrue();
    const escriturasOrden = escritura.calls.allArgs().filter(function buscarEscritura(argumentos) { return argumentos[0] === claveUltimaOrden; });
    expect(escriturasOrden.length).toBe(1);
    expect(localStorage.getItem(claveBorradorCompra)).toBe('null');
    interfaz.unmount();
    const confirmacion = renderizarCompra('/confirmacion');
    expect(screen.getByText(orden.id)).toBeTruthy();
    expect(screen.getByText('Ana Pérez')).toBeTruthy();
    confirmacion.unmount();
    renderizarCompra('/pago');
    expect(screen.getByText(/No puedes continuar/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar pago piloto' })).toBeNull();
    expect(JSON.parse(localStorage.getItem(claveUltimaOrden)).id).toBe(orden.id);
  });

  it('valida método y tarjeta condicional, formatea dígitos y nunca persiste sus datos', function comprobarTarjeta() {
    const instanteCompra = 1791251398760;
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(instanteCompra));
    try {
      spyOn(Date, 'now').and.returnValue(instanteCompra);
      const consola = spyOn(console, 'log');
      renderizarCompra();
      llegarAlPago();
      expect(screen.queryByLabelText('Número de tarjeta')).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
      expect(screen.getByText('Selecciona un método de pago.')).toBeTruthy();
      expect(localStorage.getItem(claveUltimaOrden)).toBeNull();
      fireEvent.click(screen.getByLabelText('Tarjeta de crédito/débito'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
      expect(screen.getByLabelText('Número de tarjeta').getAttribute('aria-invalid')).toBe('true');
      expect(screen.getByLabelText('Número de tarjeta').getAttribute('aria-describedby')).toBe('pago-numero-error');
      escribirCampo('Número de tarjeta', '4111111111111111');
      escribirCampo('Vencimiento (MM/AA)', '1299');
      escribirCampo('CVV', '9876');
      expect(screen.getByLabelText('Número de tarjeta').value).toBe('4111 1111 1111 1111');
      expect(screen.getByLabelText('Vencimiento (MM/AA)').value).toBe('12/99');
      const destinatarioEsperado = {
        nombre: 'Ana Pérez', correo: 'ana@example.cl', direccion: 'Calle Uno 123',
        comuna: 'Santiago', entrega: 'Despacho a domicilio'
      };
      const elementosEsperados = [{ id: 1, nombre: 'Arroz Grado 1 1kg', precio: 1890, cantidad: 1 }];
      const borrador = JSON.parse(localStorage.getItem(claveBorradorCompra));
      expect(Object.keys(borrador).sort()).toEqual(['destinatario', 'huellaCarrito', 'id']);
      expect(borrador.id).toBe('BOR-1791251398760-1');
      expect(Object.keys(borrador.destinatario).sort()).toEqual(['comuna', 'correo', 'direccion', 'entrega', 'nombre']);
      expect(borrador.destinatario).toEqual(destinatarioEsperado);
      const elementosBorrador = JSON.parse(borrador.huellaCarrito);
      elementosBorrador.forEach(function comprobarCamposDelBorrador(elemento) {
        expect(Object.keys(elemento).sort()).toEqual(['cantidad', 'id', 'nombre', 'precio']);
      });
      expect(elementosBorrador).toEqual(elementosEsperados);
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
      expect(screen.getByRole('heading', { name: 'Compra simulada confirmada' })).toBeTruthy();
      const orden = JSON.parse(localStorage.getItem(claveUltimaOrden));
      expect(Object.keys(orden).sort()).toEqual(['borradorId', 'destinatario', 'elementos', 'fecha', 'id', 'metodo', 'simulada', 'totales']);
      expect(orden.id).toBe('SSM-1791251398760-1');
      expect(orden.borradorId).toBe(borrador.id);
      expect(orden.fecha).toBe(new Date(instanteCompra).toISOString());
      expect(orden.metodo).toBe('Tarjeta de crédito/débito');
      expect(orden.simulada).toBeTrue();
      expect(Object.keys(orden.destinatario).sort()).toEqual(['comuna', 'correo', 'direccion', 'entrega', 'nombre']);
      expect(orden.destinatario).toEqual(destinatarioEsperado);
      orden.elementos.forEach(function comprobarCamposDeLaOrden(elemento) {
        expect(Object.keys(elemento).sort()).toEqual(['cantidad', 'id', 'nombre', 'precio']);
      });
      expect(orden.elementos).toEqual(elementosEsperados);
      expect(Object.keys(orden.totales).sort()).toEqual(['envio', 'subtotal', 'total']);
      expect(orden.totales).toEqual({ subtotal: 1890, envio: 2990, total: 4880 });
      expect(JSON.parse(localStorage.getItem(claveBorradorCompra))).toBeNull();
      expect(JSON.parse(localStorage.getItem(claveCarrito))).toEqual([]);
      expect(consola).not.toHaveBeenCalled();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('rechaza tarjeta vencida o incompleta en el formulario sin emitir una orden', function comprobarTarjetaVencida() {
    renderizarCompra();
    llegarAlPago();
    fireEvent.click(screen.getByLabelText('Tarjeta de crédito/débito'));
    escribirCampo('Número de tarjeta', '12345678');
    escribirCampo('Vencimiento (MM/AA)', '0100');
    escribirCampo('CVV', '12');
    fireEvent.blur(screen.getByLabelText('Vencimiento (MM/AA)'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
    expect(screen.getByText('La tarjeta está vencida.')).toBeTruthy();
    expect(screen.getByLabelText('CVV').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByLabelText('Número de tarjeta').getAttribute('aria-invalid')).toBe('true');
    expect(localStorage.getItem(claveUltimaOrden)).toBeNull();
    fireEvent.click(screen.getByLabelText('Transferencia bancaria'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
    expect(screen.getByRole('heading', { name: 'Compra simulada confirmada' })).toBeTruthy();
  });

  it('borra campos temporales al cambiar a otro método y permite cancelar sin emitir orden', function comprobarCambioMetodo() {
    renderizarCompra();
    llegarAlPago();
    fireEvent.click(screen.getByLabelText('Tarjeta de crédito/débito'));
    escribirCampo('Número de tarjeta', '4111111111111111');
    fireEvent.click(screen.getByLabelText('Pago en tienda'));
    expect(screen.queryByLabelText('Número de tarjeta')).toBeNull();
    fireEvent.click(screen.getByLabelText('Tarjeta de crédito/débito'));
    expect(screen.getByLabelText('Número de tarjeta').value).toBe('');
    fireEvent.click(screen.getByRole('link', { name: 'Cancelar pago y volver al carrito' }));
    expect(screen.getByLabelText('Cantidad de Arroz Grado 1 1kg').value).toBe('1');
    expect(localStorage.getItem(claveUltimaOrden)).toBeNull();
  });

  it('muestra errores de checkout y no crea un borrador inválido', function comprobarCheckoutInvalido() {
    renderizarCompra();
    iniciarCheckout();
    fireEvent.blur(screen.getByLabelText('Nombre'));
    expect(screen.getByLabelText('Nombre').getAttribute('aria-invalid')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }));
    expect(screen.getByLabelText('Dirección').getAttribute('aria-invalid')).toBe('true');
    expect(localStorage.getItem(claveBorradorCompra)).toBeNull();
    completarDestinatario();
    escribirCampo('Correo', 'correo inválido');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }));
    expect(screen.getByLabelText('Correo').getAttribute('aria-invalid')).toBe('true');
    escribirCampo('Correo', '  ANA@example.cl  ');
    escribirCampo('Método de entrega', 'Retiro en tienda');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }));
    expect(JSON.parse(localStorage.getItem(claveBorradorCompra)).destinatario.correo).toBe('ana@example.cl');
    expect(screen.getByText(/Entrega: Retiro en tienda/)).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Resumen de compra' }).textContent).toContain('$4.880');
  });

  it('restaura borrador saneado pero exige revisión si cambian cantidades o precios', function comprobarCambioCarrito() {
    const interfaz = renderizarCompra();
    llegarAlPago();
    interfaz.unmount();
    const pagoRestaurado = renderizarCompra('/pago');
    expect(screen.getByText(/Destinatario: Ana Pérez/)).toBeTruthy();
    pagoRestaurado.unmount();
    localStorage.setItem(claveCarrito, '[{"id":1,"cantidad":2}]');
    const pagoCambiado = renderizarCompra('/pago');
    expect(screen.getByText(/el carrito o sus precios cambiaron/)).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Revisar checkout' }));
    expect(screen.getByLabelText('Nombre').value).toBe('Ana Pérez');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }));
    expect(screen.getByRole('region', { name: 'Resumen de compra' }).textContent).toContain('$6.770');
    pagoCambiado.unmount();
    const productos = JSON.parse(localStorage.getItem(claveProductos));
    productos[0].precio = 5000;
    localStorage.setItem(claveProductos, JSON.stringify(productos));
    renderizarCompra('/pago');
    expect(screen.getByText(/el carrito o sus precios cambiaron/)).toBeTruthy();
    expect(localStorage.getItem(claveUltimaOrden)).toBeNull();
  });

  it('emite cantidades y precios del catálogo actual con envío gratis en el umbral', function comprobarPrecioVigente() {
    const interfaz = renderizarCompra();
    iniciarCheckout();
    completarDestinatario();
    interfaz.unmount();
    const productos = JSON.parse(localStorage.getItem(claveProductos));
    productos[0].precio = 5000;
    localStorage.setItem(claveProductos, JSON.stringify(productos));
    localStorage.setItem(claveCarrito, '[{"id":1,"cantidad":5,"precio":1}]');
    renderizarCompra('/checkout');
    completarDestinatario();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }));
    fireEvent.click(screen.getByLabelText('Pago en tienda'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
    const orden = JSON.parse(localStorage.getItem(claveUltimaOrden));
    expect(orden.elementos[0].cantidad).toBe(5);
    expect(orden.elementos[0].precio).toBe(5000);
    expect(orden.totales).toEqual({ subtotal: 25000, envio: 0, total: 25000 });
    expect(screen.getByRole('region', { name: 'Resumen de compra' }).textContent).toContain('Gratis');
  });

  it('avisa al fallar solo la escritura del comprobante sin fingir recuperación', function comprobarFalloOrden() {
    renderizarCompra();
    llegarAlPago();
    const guardarOriginal = Storage.prototype.setItem;
    spyOn(Storage.prototype, 'setItem').and.callFake(function denegarComprobante(clave, contenido) {
      if (clave === claveUltimaOrden) { throw new Error('Sin espacio para comprobante'); }
      return guardarOriginal.call(this, clave, contenido);
    });
    fireEvent.click(screen.getByLabelText('Pago en tienda'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
    expect(screen.getByRole('heading', { name: 'Compra simulada confirmada' })).toBeTruthy();
    expect(screen.getByText(/no se pudieron guardar todos los cambios/)).toBeTruthy();
    expect(localStorage.getItem(claveUltimaOrden)).toBeNull();
    expect(JSON.parse(localStorage.getItem(claveCarrito))).toEqual([]);
  });

  it('conserva y advierte registros antiguos ante limpieza parcial, sin pagar otra vez al restaurar', function comprobarLimpiezaParcial() {
    const interfaz = renderizarCompra();
    llegarAlPago();
    const borradorAnterior = localStorage.getItem(claveBorradorCompra);
    const guardarOriginal = Storage.prototype.setItem;
    spyOn(Storage.prototype, 'setItem').and.callFake(function denegarLimpieza(clave, contenido) {
      if ((clave === claveBorradorCompra && contenido === 'null') || (clave === claveCarrito && contenido === '[]')) {
        throw new Error('Limpieza denegada');
      }
      return guardarOriginal.call(this, clave, contenido);
    });
    fireEvent.click(screen.getByLabelText('Pago en tienda'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
    expect(localStorage.getItem(claveBorradorCompra)).toBe(borradorAnterior);
    expect(JSON.parse(localStorage.getItem(claveCarrito)).length).toBe(1);
    expect(screen.getByText(/no se garantiza su limpieza/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Carrito/ }).textContent).toContain('0');
    interfaz.unmount();
    renderizarCompra('/pago');
    expect(screen.getByText(/este borrador ya fue confirmado/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Confirmar pago piloto' })).toBeNull();
  });

  it('mantiene el flujo en memoria con Storage totalmente denegado y explica sus límites', function comprobarCompraMemoria() {
    spyOn(Storage.prototype, 'getItem').and.throwError('Lectura denegada');
    spyOn(Storage.prototype, 'setItem').and.throwError('Escritura denegada');
    renderizarCompra();
    llegarAlPago();
    expect(screen.getByText(/No se pudo guardar el borrador/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Pago en tienda'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago piloto' }));
    expect(screen.getByText('Ana Pérez')).toBeTruthy();
    expect(screen.getByText(/pueden reaparecer registros anteriores/)).toBeTruthy();
  });

  it('explica confirmación ausente y checkout vacío sin inventar una venta', function comprobarAusencia() {
    const interfaz = renderizarCompra('/confirmacion');
    expect(screen.getByText(/No existe una compra simulada reciente válida/)).toBeTruthy();
    interfaz.unmount();
    renderizarCompra('/checkout');
    expect(screen.getByText(/No puedes continuar/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Continuar al pago' })).toBeNull();
  });

  it('rechaza borradores y comprobantes corruptos o productos retirados', function comprobarRegistrosInvalidos() {
    localStorage.setItem(claveBorradorCompra, '{');
    localStorage.setItem(claveUltimaOrden, '{"simulada":true,"elementos":[]}');
    localStorage.setItem(claveCarrito, '[{"id":9999,"cantidad":1}]');
    const interfaz = renderizarCompra('/pago');
    expect(screen.getByText(/No puedes continuar/)).toBeTruthy();
    interfaz.unmount();
    renderizarCompra('/confirmacion');
    expect(screen.getByText(/No existe una compra simulada reciente válida/)).toBeTruthy();
  });

  it('requiere borrador aun con carrito válido y vuelve al checkout mediante enlace', function comprobarBorradorAusente() {
    localStorage.setItem(claveCarrito, '[{"id":1,"cantidad":1}]');
    renderizarCompra('/pago');
    expect(screen.getByText(/completa primero los datos de envío/)).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Revisar checkout' }));
    expect(screen.getByLabelText('Dirección')).toBeTruthy();
  });

  it('navega a quiénes somos conservando misión, visión y valores', function comprobarInformacion() {
    renderizarCompra('/quienes-somos');
    expect(screen.getByRole('heading', { name: 'Misión' })).toBeTruthy();
    expect(screen.getByText('Integrar e-commerce e inventario POS en una sola operación.')).toBeTruthy();
    expect(screen.getByText('Confianza, simplicidad, disponibilidad y servicio.')).toBeTruthy();
    const navegacion = screen.getByRole('navigation');
    expect(within(navegacion).getByRole('link', { name: 'Quiénes Somos' }).getAttribute('aria-current')).toBe('page');
    fireEvent.click(within(navegacion).getByRole('link', { name: 'Contacto' }));
    expect(within(navegacion).getByRole('link', { name: 'Contacto' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('img', { name: /Mapa de ubicación/ }).getAttribute('src')).toBe('/imagenes/mapa.jpg');
  });

  it('valida contacto sin fingir envío de correo', function comprobarContacto() {
    renderizarCompra('/contacto');
    fireEvent.click(screen.getByRole('button', { name: 'Validar mensaje' }));
    expect(screen.getByLabelText('Nombre completo').getAttribute('aria-invalid')).toBe('true');
    escribirCampo('Nombre completo', 'Ana Pérez');
    escribirCampo('Correo', 'ana@gmail.com');
    escribirCampo('Teléfono', '+56 9 1234 5678');
    escribirCampo('Asunto', 'Despacho');
    escribirCampo('Mensaje', 'Quisiera consultar por el despacho.');
    fireEvent.click(screen.getByRole('button', { name: 'Validar mensaje' }));
    expect(screen.getByRole('status').textContent).toContain('no se ha enviado un correo real');
    expect(screen.getByLabelText('Mensaje').value).toBe('');
    expect(localStorage.getItem('stock_react_contacto_v1')).toBeNull();
    escribirCampo('Nombre completo', 'Ana');
    expect(screen.queryByText(/no se ha enviado un correo real/)).toBeNull();
    fireEvent.blur(screen.getByLabelText('Mensaje'));
    expect(screen.getByLabelText('Mensaje').getAttribute('aria-describedby')).toBe('contacto-mensaje-error');
  });
});
