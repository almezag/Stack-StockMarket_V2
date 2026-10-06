import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Aplicacion from '../src/Aplicacion.jsx';
import { crearUsuariosDemostracion } from '../src/datos/usuariosDemostracion.js';
import { claveUsuarios, claveSesion } from '../src/servicios/almacenamientoLocal.js';

function renderizarAutenticacion(ruta = '/registro') {
  return render(
    <MemoryRouter initialEntries={[ruta]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Aplicacion />
    </MemoryRouter>
  );
}

function escribirCampo(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta, { exact: true }), { target: { value: valor } });
}

async function esperarFormulario(nombreBoton) {
  await waitFor(function esperarBotonDisponible() {
    if (screen.getByRole('button', { name: nombreBoton }).disabled) {
      throw new Error('El formulario todavía está preparando las cuentas.');
    }
  });
  expect(screen.getByRole('button', { name: nombreBoton }).disabled).toBeFalse();
}

function completarRegistro(correo = '  CAMILA@gmail.com  ') {
  escribirCampo('Nombre completo', 'Camila Muñoz');
  escribirCampo('RUT', '12.345.678-5');
  escribirCampo('Correo electrónico', correo);
  escribirCampo('Teléfono', '+56 9 1234 5678');
  escribirCampo('Comuna', 'Ñuñoa');
  escribirCampo('Contraseña', 'ClaveDemo123');
  escribirCampo('Confirmar contraseña', 'ClaveDemo123');
}

beforeEach(function prepararAutenticacion() {
  localStorage.clear();
});
afterEach(function limpiarAutenticacion() {
  localStorage.clear();
});

describe('Cuentas locales de clientes', function describirCuentas() {
  it('advierte fallos de escritura sin afirmar que desaparecieron las cuentas ya guardadas', async function comprobarDenegacionSoloEscritura() {
    const usuarios = await crearUsuariosDemostracion();
    localStorage.setItem(claveUsuarios, JSON.stringify(usuarios));
    const registroAnterior = localStorage.getItem(claveUsuarios);
    spyOn(Storage.prototype, 'setItem').and.throwError('Solo escritura denegada');
    renderizarAutenticacion('/login');
    await esperarFormulario('Ingresar');
    await screen.findByText(/No se pueden guardar nuevos cambios/);
    expect(localStorage.getItem(claveUsuarios)).toBe(registroAnterior);
    expect(screen.queryByText(/se perderán al recargar/)).toBeNull();
    escribirCampo('Correo electrónico', 'cliente@gmail.com');
    escribirCampo('Contraseña', 'ClienteDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Hola, Cliente Demo');
    expect(localStorage.getItem(claveUsuarios)).toBe(registroAnterior);
  });
  it('crea una cuenta y permite ingresar y cerrar la sesión realmente', async function comprobarCicloCompleto() {
    renderizarAutenticacion();
    completarRegistro();
    await esperarFormulario('Crear cuenta');
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByRole('button', { name: 'Creando cuenta…' }).disabled).toBeTrue();
    await screen.findByText(/Cuenta creada/);
    const usuariosGuardados = JSON.parse(localStorage.getItem(claveUsuarios));
    const cuenta = usuariosGuardados.find(function buscarCuenta(usuario) {
      return usuario.correo === 'camila@gmail.com';
    });
    expect(cuenta.rol).toBe('cliente');
    expect(cuenta.credencial.algoritmo).toBe('PBKDF2-SHA-256');
    expect(JSON.stringify(usuariosGuardados)).not.toContain('ClaveDemo123');
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar sesión ahora' }));
    escribirCampo('Correo electrónico', 'camila@gmail.com');
    escribirCampo('Contraseña', 'ClaveDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Hola, Camila Muñoz');
    expect(JSON.parse(localStorage.getItem(claveSesion))).toEqual({ usuarioId: cuenta.id });
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(screen.queryByText('Hola, Camila Muñoz')).toBeNull();
    expect(localStorage.getItem('stock_react_sesion_v1')).toBe('null');
  });

  it('rechaza un RUT inválido y confirmación diferente con errores asociados', async function comprobarErrores() {
    renderizarAutenticacion();
    completarRegistro();
    escribirCampo('RUT', '12.345.678-9');
    escribirCampo('Confirmar contraseña', 'OtraClave123');
    await esperarFormulario('Crear cuenta');
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    const campoRut = screen.getByLabelText('RUT');
    expect(campoRut.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById(campoRut.getAttribute('aria-describedby')).textContent).toContain('RUT');
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeTruthy();
  });

  it('rechaza credenciales incorrectas sin crear sesión', async function comprobarCredenciales() {
    renderizarAutenticacion('/login');
    escribirCampo('Correo electrónico', 'cliente@gmail.com');
    escribirCampo('Contraseña', 'Incorrecta123');
    await esperarFormulario('Ingresar');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Correo o contraseña incorrectos.');
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).toBeNull();
  });

  it('bloquea contraseñas cortas y largas en registro y permite corregirlas', async function comprobarLimitesRegistro() {
    renderizarAutenticacion();
    await esperarFormulario('Crear cuenta');
    completarRegistro();
    escribirCampo('Contraseña', 'corta');
    escribirCampo('Confirmar contraseña', 'corta');
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByLabelText('Contraseña', { exact: true }).getAttribute('aria-invalid')).toBe('true');
    escribirCampo('Contraseña', 'a'.repeat(65));
    escribirCampo('Confirmar contraseña', 'a'.repeat(65));
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.queryByText(/Cuenta creada/)).toBeNull();
    escribirCampo('Contraseña', 'a'.repeat(64));
    escribirCampo('Confirmar contraseña', 'a'.repeat(64));
    expect(screen.getByLabelText('Contraseña', { exact: true }).getAttribute('aria-invalid')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await screen.findByText(/Cuenta creada/);
  });

  it('muestra validaciones controladas de correo y contraseña al ingresar', async function comprobarLimitesIngreso() {
    renderizarAutenticacion('/login');
    await esperarFormulario('Ingresar');
    escribirCampo('Correo electrónico', 'sin-correo');
    escribirCampo('Contraseña', 'corta');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByLabelText('Correo electrónico').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByLabelText('Contraseña').getAttribute('aria-invalid')).toBe('true');
    escribirCampo('Correo electrónico', 'cliente@gmail.com');
    escribirCampo('Contraseña', 'a'.repeat(65));
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByLabelText('Contraseña').getAttribute('aria-invalid')).toBe('true');
    escribirCampo('Contraseña', 'ClienteDemo123');
    fireEvent.blur(screen.getByLabelText('Contraseña'));
    expect(screen.getByLabelText('Contraseña').getAttribute('aria-invalid')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Hola, Cliente Demo');
  });

  it('rechaza correos duplicados sin distinguir espacios ni mayúsculas', async function comprobarDuplicados() {
    renderizarAutenticacion();
    completarRegistro(' CLIENTE@gmail.com ');
    await esperarFormulario('Crear cuenta');
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await screen.findAllByText('Ya existe una cuenta con ese correo.');
    expect(screen.getByLabelText('Correo electrónico').getAttribute('aria-invalid')).toBe('true');
    expect(screen.queryByText(/Cuenta creada/)).toBeNull();
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).length).toBe(2);
  });

  it('rechaza al administrador en el acceso público aunque la contraseña coincida', async function comprobarRolAdministrativo() {
    renderizarAutenticacion('/login');
    await esperarFormulario('Ingresar');
    escribirCampo('Correo electrónico', 'admin@duoc.cl');
    escribirCampo('Contraseña', 'AdminDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByRole('button', { name: 'Ingresando…' }).disabled).toBeTrue();
    await screen.findByText(/Esta cuenta es administrativa/);
    expect(JSON.parse(localStorage.getItem(claveSesion))).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).toBeNull();
  });

  it('recupera una sesión por identificador y toma el nombre del usuario, no de la sesión', async function comprobarSesionPersistida() {
    const usuarios = await crearUsuariosDemostracion();
    localStorage.setItem(claveUsuarios, JSON.stringify(usuarios));
    localStorage.setItem(claveSesion, JSON.stringify({ usuarioId: 'cliente-demo', nombre: 'Nombre falso', rol: 'administrador' }));
    renderizarAutenticacion('/login');
    await screen.findByText('Hola, Cliente Demo');
    expect(screen.queryByText('Nombre falso')).toBeNull();
    expect(JSON.parse(localStorage.getItem(claveSesion))).toEqual({ usuarioId: 'cliente-demo' });
  });

  it('descarta sesiones con identificadores desconocidos y no altera las cuentas', async function comprobarSesionDesconocida() {
    const usuarios = await crearUsuariosDemostracion();
    localStorage.setItem(claveUsuarios, JSON.stringify(usuarios));
    localStorage.setItem(claveSesion, JSON.stringify({ usuarioId: 'inexistente', rol: 'administrador' }));
    renderizarAutenticacion('/login');
    await esperarFormulario('Ingresar');
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).toBeNull();
    expect(JSON.parse(localStorage.getItem(claveSesion))).toBeNull();
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).length).toBe(2);
  });

  it('descarta usuarios con rol desconocido y su sesión', async function comprobarRolDesconocido() {
    const usuarios = await crearUsuariosDemostracion();
    usuarios[0].rol = 'superusuario';
    localStorage.setItem(claveUsuarios, JSON.stringify(usuarios));
    localStorage.setItem(claveSesion, JSON.stringify({ usuarioId: 'cliente-demo' }));
    renderizarAutenticacion('/login');
    await esperarFormulario('Ingresar');
    escribirCampo('Correo electrónico', 'cliente@gmail.com');
    escribirCampo('Contraseña', 'ClienteDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Correo o contraseña incorrectos.');
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).length).toBe(1);
    expect(JSON.parse(localStorage.getItem(claveSesion))).toBeNull();
  });

  it('reemplaza JSON corrupto con demostraciones y no recupera una sesión inválida', async function comprobarDatosCorruptos() {
    localStorage.setItem(claveUsuarios, '{');
    localStorage.setItem(claveSesion, '[]');
    renderizarAutenticacion('/login');
    await esperarFormulario('Ingresar');
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).length).toBe(2);
    expect(JSON.parse(localStorage.getItem(claveSesion))).toBeNull();
  });

  it('avisa que opera solo en memoria cuando Storage está denegado', async function comprobarMemoria() {
    spyOn(Storage.prototype, 'getItem').and.throwError('Acceso denegado');
    spyOn(Storage.prototype, 'setItem').and.throwError('Acceso denegado');
    renderizarAutenticacion();
    await esperarFormulario('Crear cuenta');
    await screen.findByText(/No se pueden guardar nuevos cambios de cuentas o sesión/);
    completarRegistro();
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await screen.findByText(/Cuenta creada/);
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar sesión ahora' }));
    escribirCampo('Correo electrónico', 'camila@gmail.com');
    escribirCampo('Contraseña', 'ClaveDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Hola, Camila Muñoz');
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(screen.queryByText('Hola, Camila Muñoz')).toBeNull();
  });

  it('no informa éxito si WebCrypto falla durante el registro', async function comprobarFalloRegistro() {
    renderizarAutenticacion();
    await esperarFormulario('Crear cuenta');
    spyOn(window.crypto.subtle, 'deriveBits').and.callFake(function rechazarDerivacion() {
      return Promise.reject(new Error('Criptografía no disponible'));
    });
    completarRegistro();
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await screen.findByText(/No se pudo crear la cuenta/);
    expect(screen.queryByText(/Cuenta creada/)).toBeNull();
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).length).toBe(2);
    expect(screen.getByRole('button', { name: 'Crear cuenta' }).disabled).toBeFalse();
  });

  it('explica el fallo de inicialización sin habilitar el ingreso', async function comprobarFalloInicializacion() {
    spyOn(window.crypto.subtle, 'importKey').and.callFake(function rechazarImportacion() {
      return Promise.reject(new Error('Criptografía no disponible'));
    });
    renderizarAutenticacion('/login');
    await screen.findByText(/No se pudieron preparar las cuentas/);
    expect(screen.getByRole('button', { name: 'Ingresar' }).disabled).toBeTrue();
    expect(localStorage.getItem(claveUsuarios)).toBeNull();
  });

  it('ofrece enlaces públicos y un acceso administrativo operativo', function comprobarEnlacesPublicos() {
    renderizarAutenticacion('/login');
    const navegacion = within(screen.getByRole('navigation'));
    expect(navegacion.getByRole('link', { name: 'Crear cuenta' }).getAttribute('href')).toBe('/registro');
    expect(navegacion.getByRole('link', { name: 'Ingresar' }).getAttribute('aria-current')).toBe('page');
    expect(navegacion.getByRole('link', { name: 'Acceso administrativo' }).getAttribute('href')).toBe('/admin');
  });
});
