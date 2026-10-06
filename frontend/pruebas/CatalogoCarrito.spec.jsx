import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Aplicacion from '../src/Aplicacion.jsx';

const claveProductos = 'stock_react_productos_v1';
const claveCarrito = 'stock_react_carrito_v1';

function renderizarTienda(ruta = '/catalogo') {
  return render(
    <MemoryRouter initialEntries={[ruta]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Aplicacion />
    </MemoryRouter>
  );
}

function agregarArroz() {
  fireEvent.click(screen.getByRole('button', { name: 'Agregar Arroz Grado 1 1kg al carrito' }));
}

function abrirCarrito() {
  fireEvent.click(screen.getByRole('link', { name: /Carrito/ }));
}

function obtenerResumen() {
  return screen.getByRole('region', { name: 'Resumen de compra' });
}

beforeEach(function prepararAlmacenamiento() {
  localStorage.clear();
});
afterEach(function limpiarAlmacenamiento() {
  localStorage.clear();
});

describe('Catálogo y carrito compartidos', function describirTienda() {
  it('muestra los dieciocho productos originales y combina búsqueda sin acentos con categoría', function comprobarFiltros() {
    renderizarTienda();
    expect(screen.getAllByRole('article').length).toBe(18);
    fireEvent.change(screen.getByLabelText('Buscar producto'), { target: { value: ' cafe ' } });
    expect(screen.getAllByRole('article').length).toBe(1);
    expect(screen.getByRole('heading', { name: 'Café Tradicional 170g' })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Lácteos' } });
    expect(screen.queryAllByRole('article').length).toBe(0);
    expect(screen.getByText(/No encontramos productos/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Buscar producto'), { target: { value: '' } });
    expect(screen.getByRole('heading', { name: 'Leche Entera 1L' })).toBeTruthy();
  });

  it('preselecciona la categoría desde la URL y permite cambiarla', function comprobarCategoriaUrl() {
    renderizarTienda('/catalogo?categoria=Bebidas');
    expect(screen.getByLabelText('Categoría').value).toBe('Bebidas');
    expect(screen.getAllByRole('article').length).toBe(3);
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Snacks' } });
    expect(screen.getAllByRole('article').length).toBe(2);
  });

  it('incrementa duplicados, modifica cantidades, calcula totales y elimina', function comprobarOperaciones() {
    renderizarTienda();
    agregarArroz();
    agregarArroz();
    expect(screen.getByRole('link', { name: /Carrito/ }).textContent).toContain('2');
    abrirCarrito();
    const cantidad = screen.getByLabelText('Cantidad de Arroz Grado 1 1kg');
    expect(cantidad.value).toBe('2');
    expect(obtenerResumen().textContent).toContain('$3.780');
    expect(obtenerResumen().textContent).toContain('$2.990');
    expect(obtenerResumen().textContent).toContain('$6.770');
    fireEvent.change(cantidad, { target: { value: '3' } });
    expect(obtenerResumen().textContent).toContain('$5.670');
    expect(JSON.parse(localStorage.getItem(claveCarrito))).toEqual([{ id: 1, cantidad: 3 }]);
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Arroz Grado 1 1kg' }));
    expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(claveCarrito))).toEqual([]);
    expect(screen.queryByRole('button', { name: /pago/i })).toBeNull();
  });

  it('recupera el carrito al montar de nuevo sin duplicar precios ni nombres', function comprobarPersistencia() {
    const interfaz = renderizarTienda();
    agregarArroz();
    interfaz.unmount();
    renderizarTienda('/carrito');
    expect(screen.getByLabelText('Cantidad de Arroz Grado 1 1kg').value).toBe('1');
    expect(obtenerResumen().textContent).toContain('$4.880');
    expect(localStorage.getItem('ss_cart')).toBeNull();
  });

  it('usa precios de los productos compartidos y descarta identificadores desconocidos', function comprobarFuenteCompartida() {
    localStorage.setItem(claveProductos, JSON.stringify([
      { id: 1, nombre: 'Arroz actualizado', precio: 5000, categoria: 'Abarrotes', descripcion: 'Nuevo precio', emoji: '🍚' }
    ]));
    localStorage.setItem(claveCarrito, JSON.stringify([
      { id: 1, cantidad: 5, precio: 1, nombre: 'Nombre obsoleto' },
      { id: 999, cantidad: 2 }
    ]));
    renderizarTienda('/carrito');
    expect(screen.getByText('Arroz actualizado')).toBeTruthy();
    expect(screen.queryByText('Nombre obsoleto')).toBeNull();
    expect(obtenerResumen().textContent).toContain('$25.000');
    expect(obtenerResumen().textContent).toContain('Gratis');
    expect(JSON.parse(localStorage.getItem(claveCarrito))).toEqual([{ id: 1, cantidad: 5 }]);
  });

  it('rechaza cantidades no enteras o no positivas sin imponer un máximo comercial', function comprobarCantidades() {
    renderizarTienda();
    agregarArroz();
    abrirCarrito();
    const cantidad = screen.getByLabelText('Cantidad de Arroz Grado 1 1kg');
    ['', '0', '-1', '1.5'].forEach(function probarCantidadInvalida(valor) {
      fireEvent.change(cantidad, { target: { value: valor } });
      expect(cantidad.value).toBe('1');
    });
    fireEvent.change(cantidad, { target: { value: '1000' } });
    expect(cantidad.value).toBe('1000');
    expect(obtenerResumen().textContent).toContain('Gratis');
  });

  it('tolera JSON corrupto y sanea estructuras del carrito persistido', function comprobarDatosCorruptos() {
    localStorage.setItem(claveProductos, '{');
    localStorage.setItem(claveCarrito, JSON.stringify([
      null, { id: 1, cantidad: 0 }, { id: 2, cantidad: 1.5 },
      { id: 3, cantidad: '2' }, { id: 4, cantidad: 1 }, { id: 4, cantidad: 2 }
    ]));
    renderizarTienda('/carrito');
    expect(screen.getAllByRole('spinbutton').length).toBe(1);
    expect(screen.getByLabelText('Cantidad de Café Tradicional 170g').value).toBe('3');
    expect(JSON.parse(localStorage.getItem(claveProductos)).length).toBe(18);
  });

  it('permanece operativa cuando el navegador deniega el almacenamiento', function comprobarAlmacenamientoDenegado() {
    spyOn(Storage.prototype, 'getItem').and.throwError('Acceso denegado');
    spyOn(Storage.prototype, 'setItem').and.throwError('Cuota agotada');
    renderizarTienda();
    agregarArroz();
    abrirCarrito();
    expect(screen.getByLabelText('Cantidad de Arroz Grado 1 1kg').value).toBe('1');
  });

  it('ignora categorías desconocidas y permite limpiar la categoría seleccionada', function comprobarCategoriaDesconocida() {
    renderizarTienda('/catalogo?categoria=NoExiste');
    expect(screen.getByLabelText('Categoría').value).toBe('todas');
    expect(screen.getAllByRole('article').length).toBe(18);
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Snacks' } });
    expect(screen.getAllByRole('article').length).toBe(2);
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'todas' } });
    expect(screen.getAllByRole('article').length).toBe(18);
  });

  it('no repone productos cuando el catálogo persistido está vacío', function comprobarCatalogoVacio() {
    localStorage.setItem(claveProductos, '[]');
    localStorage.setItem(claveCarrito, '[{"id":1,"cantidad":2}]');
    renderizarTienda();
    expect(screen.queryAllByRole('article').length).toBe(0);
    expect(screen.getByText(/No encontramos productos/)).toBeTruthy();
    abrirCarrito();
    expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
  });

  it('no vuelve a leer Storage cuando cambian filtros o cantidades', function comprobarLecturasIniciales() {
    const lectura = spyOn(Storage.prototype, 'getItem').and.callThrough();
    renderizarTienda();
    // Productos, carrito, borrador y comprobante se leen una vez al montar.
    expect(lectura.calls.count()).toBe(4);
    fireEvent.change(screen.getByLabelText('Buscar producto'), { target: { value: 'arroz' } });
    agregarArroz();
    abrirCarrito();
    fireEvent.change(screen.getByLabelText('Cantidad de Arroz Grado 1 1kg'), { target: { value: '2' } });
    expect(lectura.calls.count()).toBe(4);
  });

  it('muestra carrito vacío y un enlace real al catálogo ante JSON inválido', function comprobarCarritoVacio() {
    localStorage.setItem(claveCarrito, '{');
    renderizarTienda('/carrito');
    expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Ir al catálogo' }));
    expect(screen.getAllByRole('article').length).toBe(18);
    expect(within(screen.getByRole('navigation')).getByRole('link', { name: 'Catálogo' }).getAttribute('aria-current')).toBe('page');
  });
});
