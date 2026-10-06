import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Aplicacion from '../src/Aplicacion.jsx';

function renderizarAplicacion(rutaInicial = '/') {
  return render(
    <MemoryRouter
      initialEntries={[rutaInicial]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Aplicacion />
    </MemoryRouter>
  );
}

function obtenerTituloPrincipal() {
  return screen.getByRole('heading', { level: 1 });
}

beforeEach(function limpiarAlmacenamiento() {
  localStorage.clear();
});
afterEach(function restaurarAlmacenamiento() {
  localStorage.clear();
});

describe('Navegación inicial de la tienda', function describirNavegacion() {
  it('presenta la identidad de la tienda en el inicio', function comprobarInicio() {
    renderizarAplicacion();

    const titulo = screen.getByRole('heading', {
      level: 1,
      name: 'Stock & Stock Market'
    });

    expect(titulo.textContent).toBe('Stock & Stock Market');
  });

  it('explica el alcance académico y las funciones disponibles', function comprobarAlcance() {
    renderizarAplicacion();

    expect(screen.getByText(/demostración académica/i).textContent)
      .toContain('demostración académica implementada con React');
    expect(screen.getByText(/La administración local permite/i).textContent)
      .toContain('simular una compra sin cobros reales');
    expect(screen.getAllByRole('button').length).toBe(4);
  });

  it('no anuncia la conservación de la primera evaluación en el inicio', function comprobarAusenciaDeVersionAnterior() {
    renderizarAplicacion();

    expect(screen.getByRole('heading', { level: 1 }).textContent)
      .toBe('Stock & Stock Market');
    expect(screen.queryByText(/primera evaluación.*conserva/i)).toBeNull();
  });

  it('ofrece solamente enlaces operativos al inicio', function comprobarEnlaces() {
    renderizarAplicacion();

    const navegacion = screen.getByRole('navigation', { name: 'Navegación principal' });
    const enlaces = within(navegacion).getAllByRole('link');

    expect(enlaces.length).toBe(9);
    expect(within(navegacion).getByRole('link', { name: 'Acceso administrativo' }).getAttribute('href')).toBe('/admin');
    expect(within(navegacion).getByRole('link', { name: 'Contacto' }).getAttribute('href')).toBe('/contacto');
    expect(within(navegacion).getByRole('link', { name: 'Quiénes Somos' }).getAttribute('href')).toBe('/quienes-somos');
    expect(within(navegacion).getByRole('link', { name: 'Ingresar' })
      .getAttribute('href')).toBe('/login');
    expect(within(navegacion).getByRole('link', { name: 'Crear cuenta' })
      .getAttribute('href')).toBe('/registro');
    expect(within(navegacion).getByRole('link', { name: 'Catálogo' })
      .getAttribute('href')).toBe('/catalogo');
    expect(within(navegacion).getByRole('link', { name: /Carrito/ })
      .getAttribute('href')).toBe('/carrito');
    expect(within(navegacion).getByRole('link', { name: 'Inicio' })
      .getAttribute('aria-current')).toBe('page');
  });

  it('mantiene el pie de página en el inicio', function comprobarPieInicio() {
    renderizarAplicacion();

    expect(screen.getByRole('contentinfo').textContent)
      .toContain('Sin compras ni cobros reales');
    expect(screen.getAllByRole('main').length).toBe(1);
  });

  it('muestra una página no encontrada con la plantilla compartida', function comprobarRutaDesconocida() {
    renderizarAplicacion('/ruta-inexistente');

    expect(obtenerTituloPrincipal().textContent).toBe('Página no encontrada');
    expect(screen.getByRole('navigation')).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Inicio' })
      .getAttribute('aria-current')).toBeNull();
  });

  it('regresa realmente al inicio desde una ruta desconocida', function comprobarRegreso() {
    renderizarAplicacion('/otra-ruta-desconocida');

    fireEvent.click(screen.getByRole('link', { name: 'Volver al inicio' }));

    expect(obtenerTituloPrincipal().textContent).toBe('Stock & Stock Market');
    expect(screen.queryByText('Página no encontrada')).toBeNull();
  });
});
