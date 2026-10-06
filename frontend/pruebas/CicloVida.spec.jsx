import { StrictMode, useEffect } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ProveedorUsuarios } from '../src/contextos/ContextoUsuarios.jsx';
import { useUsuarios } from '../src/hooks/useUsuarios.js';
import { claveUsuarios, claveSesion } from '../src/servicios/almacenamientoLocal.js';

let cuentasActuales;
let montajesDelEfecto;
let limpiezasDelEfecto;

function ObservarCuentas() {
  cuentasActuales = useUsuarios();
  useEffect(function observarCicloDeVida() {
    montajesDelEfecto += 1;
    return function limpiarEfecto() {
      limpiezasDelEfecto += 1;
    };
  }, []);
  return <p>{cuentasActuales.listo ? `Usuarios preparados: ${cuentasActuales.usuarios.length}` : 'Preparando cuentas'}</p>;
}

beforeEach(function prepararCicloDeVida() {
  localStorage.clear();
  cuentasActuales = null;
  montajesDelEfecto = 0;
  limpiezasDelEfecto = 0;
});
afterEach(function limpiarCicloDeVida() {
  localStorage.clear();
});

describe('Ciclo de vida con StrictMode', function describirCicloDeVida() {
  it('inicializa cuentas una vez efectiva y conserva el registro e ingreso tras el doble efecto', async function comprobarDobleEfecto() {
    const escritura = spyOn(Storage.prototype, 'setItem').and.callThrough();
    render(
      <StrictMode>
        <ProveedorUsuarios>
          <ObservarCuentas />
        </ProveedorUsuarios>
      </StrictMode>
    );
    await screen.findByText('Usuarios preparados: 2');
    expect(montajesDelEfecto).toBe(2);
    expect(limpiezasDelEfecto).toBe(1);
    const escriturasIniciales = escritura.calls.allArgs().filter(function buscarEscrituraUsuarios(argumentos) {
      return argumentos[0] === claveUsuarios;
    });
    expect(escriturasIniciales.length).toBe(1);
    expect(cuentasActuales.usuarios.map(function obtenerIdentificador(usuario) {
      return usuario.id;
    })).toEqual(['cliente-demo', 'administrador-demo']);

    await act(async function registrarCuentaNueva() {
      await cuentasActuales.registrarUsuario({
        nombre: 'Persona de Prueba', rut: '12.345.678-5', correo: 'prueba@gmail.com',
        telefono: '+56 9 1234 5678', comuna: 'Santiago',
        contrasena: 'PruebaDemo123', confirmacion: 'PruebaDemo123'
      });
    });
    await screen.findByText('Usuarios preparados: 3');
    await act(async function ingresarConCuentaNueva() {
      await cuentasActuales.iniciarSesion({ correo: 'prueba@gmail.com', contrasena: 'PruebaDemo123' });
    });
    await waitFor(function esperarSesionVigente() {
      if (cuentasActuales.usuarioActual?.correo !== 'prueba@gmail.com') {
        throw new Error('La cuenta nueva todavía no inició sesión.');
      }
    });
    const usuariosGuardados = JSON.parse(localStorage.getItem(claveUsuarios));
    expect(usuariosGuardados.length).toBe(3);
    expect(usuariosGuardados.filter(function buscarCuentaNueva(usuario) {
      return usuario.correo === 'prueba@gmail.com';
    }).length).toBe(1);
    expect(JSON.parse(localStorage.getItem(claveSesion))).toEqual({ usuarioId: cuentasActuales.usuarioActual.id });
    expect(cuentasActuales.usuarios.length).toBe(3);
    expect(montajesDelEfecto).toBe(2);
  });
});
