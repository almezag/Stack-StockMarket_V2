import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useContext } from 'react';
import { MemoryRouter } from 'react-router-dom';
import Aplicacion from '../src/Aplicacion.jsx';
import { ContextoUsuarios, ProveedorUsuarios } from '../src/contextos/ContextoUsuarios.jsx';
import { ContextoProductos, ProveedorProductos } from '../src/contextos/ContextoProductos.jsx';
import { crearUsuariosDemostracion } from '../src/datos/usuariosDemostracion.js';
import { claveUsuarios, claveSesion, claveProductos, claveCarrito } from '../src/servicios/almacenamientoLocal.js';

function mostrarAplicacion(ruta = '/admin') {
  return render(<MemoryRouter initialEntries={[ruta]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Aplicacion /></MemoryRouter>);
}
function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta, { exact: true }), { target: { value: valor } });
}
async function ingresarAdministrador() {
  await screen.findByRole('heading', { name: 'Acceso administrativo' });
  await waitFor(function esperarPreparacion() {
    if (screen.getByRole('button', { name: 'Ingresar' }).disabled) {
      throw new Error('Preparando cuentas');
    }
  });
  escribir('Correo electrónico', 'admin@duoc.cl');
  escribir('Contraseña', 'AdminDemo123');
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
  await screen.findByRole('heading', { name: 'Panel administrativo', level: 1 });
}
function abrirProductos() {
  fireEvent.click(screen.getByRole('button', { name: 'Productos', exact: true }));
}
function completarProducto(nombre = 'Pan Integral', precio = '3000') {
  escribir('Nombre del producto', nombre);
  escribir('Categoría', 'Panadería');
  escribir('Descripción', 'Pan integral de demostración.');
  escribir('Emoji', '🍞');
  escribir('Precio en CLP', precio);
}
function completarUsuario(correo = 'ana@gmail.com') {
  escribir('Nombre completo', 'Ana Pérez');
  escribir('Correo electrónico', correo);
  escribir('Rol', 'cliente');
  escribir('Contraseña', 'NuevaDemo123');
}
let contextoUsuarios;
let contextoProductos;
function ObservarUsuarios() {
  contextoUsuarios = useContext(ContextoUsuarios);
  contextoProductos = useContext(ContextoProductos);
  return <p>{contextoUsuarios.listo ? 'Cuentas preparadas' : 'Preparando'}</p>;
}
async function mostrarContextos(usuarioId = null) {
  localStorage.setItem(claveUsuarios, JSON.stringify(await crearUsuariosDemostracion()));
  localStorage.setItem(claveSesion, JSON.stringify(usuarioId ? { usuarioId } : null));
  render(<ProveedorUsuarios><ProveedorProductos><ObservarUsuarios /></ProveedorProductos></ProveedorUsuarios>);
  await screen.findByText('Cuentas preparadas');
}
function abrirUsuarios() {
  fireEvent.click(screen.getByRole('button', { name: 'Usuarios', exact: true }));
}
async function esperarIngresoDisponible() {
  await waitFor(function esperarFormulario() {
    if (screen.getByRole('button', { name: 'Ingresar' }).disabled) {
      throw new Error('El ingreso todavía está ocupado.');
    }
  });
  expect(screen.getByRole('button', { name: 'Ingresar' }).disabled).toBeFalse();
}
beforeEach(function prepararAdministracion() {
  localStorage.clear();
  contextoUsuarios = null;
  contextoProductos = null;
});
afterEach(function limpiarAdministracion() {
  localStorage.clear();
});

describe('Administración integrada', function describirAdministracion() {
  it('niega el panel anónimo con un acceso administrativo real', async function comprobarInvitado() {
    mostrarAplicacion('/panel-administracion');
    await screen.findByText('Necesitas una sesión de administrador para acceder al panel.');
    expect(screen.queryByRole('button', { name: 'Productos' })).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: 'Ir al acceso administrativo' }));
    expect(screen.getByRole('heading', { name: 'Acceso administrativo' })).toBeTruthy();
  });
  it('niega el panel al cliente sin destruir su sesión', async function comprobarCliente() {
    localStorage.setItem(claveUsuarios, JSON.stringify(await crearUsuariosDemostracion()));
    localStorage.setItem(claveSesion, JSON.stringify({ usuarioId: 'cliente-demo' }));
    mostrarAplicacion('/panel-administracion');
    await screen.findByText('Necesitas una sesión de administrador para acceder al panel.');
    expect(screen.getByText('Hola, Cliente Demo')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(claveSesion))).toEqual({ usuarioId: 'cliente-demo' });
  });
  ['desconocido', 'eliminado', 'rol-invalido'].forEach(function definirSesionInvalida(motivo) {
    it(`descarta la sesión administrativa ${motivo} sin confiar en el rol almacenado`, async function comprobarSesionInvalida() {
      let usuarios = await crearUsuariosDemostracion();
      let usuarioId = 'administrador-demo';
      if (motivo === 'desconocido') {
        usuarioId = 'desconocido';
      }
      if (motivo === 'eliminado') {
        usuarios = [usuarios[0]];
      }
      if (motivo === 'rol-invalido') {
        usuarios[1].rol = 'superusuario';
      }
      localStorage.setItem(claveUsuarios, JSON.stringify(usuarios));
      localStorage.setItem(claveSesion, JSON.stringify({ usuarioId, rol: 'administrador' }));
      mostrarAplicacion('/panel-administracion');
      await screen.findByText('Necesitas una sesión de administrador para acceder al panel.');
      expect(JSON.parse(localStorage.getItem(claveSesion))).toBeNull();
      expect(screen.queryByRole('button', { name: 'Usuarios', exact: true })).toBeNull();
    });
  });
  it('presenta resumen vacío sin porcentajes inventados ni reposición de productos eliminados', async function comprobarResumenVacio() {
    localStorage.setItem(claveUsuarios, JSON.stringify(await crearUsuariosDemostracion()));
    localStorage.setItem(claveSesion, JSON.stringify({ usuarioId: 'administrador-demo' }));
    localStorage.setItem(claveProductos, '[]');
    mostrarAplicacion('/panel-administracion');
    await screen.findByText('Productos: 0');
    expect(screen.getByText('Usuarios: 2')).toBeTruthy();
    expect(screen.getByText('No hay productos para distribuir por categoría.')).toBeTruthy();
    expect(screen.queryByText(/NaN/)).toBeNull();
    abrirProductos();
    expect(screen.getByText('No hay productos registrados.')).toBeTruthy();
  });
  it('ingresa realmente, muestra conteos actuales y conserva la sesión al recargar', async function comprobarAcceso() {
    const interfaz = mostrarAplicacion();
    await ingresarAdministrador();
    expect(screen.getByText('Productos: 18')).toBeTruthy();
    expect(screen.getByText('Usuarios: 2')).toBeTruthy();
    expect(screen.getByRole('table', { name: 'Distribución por categoría' })).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(claveSesion))).toEqual({ usuarioId: 'administrador-demo' });
    interfaz.unmount();
    mostrarAplicacion('/panel-administracion');
    await screen.findByText('Productos: 18');
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    await screen.findByText('Necesitas una sesión de administrador para acceder al panel.');
    expect(localStorage.getItem(claveSesion)).toBe('null');
  });
  it('crea, edita y elimina en el catálogo compartido y actualiza el carrito inmediatamente', async function comprobarProductosCompartidos() {
    const interfaz = mostrarAplicacion();
    await ingresarAdministrador();
    abrirProductos();
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo producto' }));
    completarProducto();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    await screen.findByText('Producto guardado.');
    const producto = JSON.parse(localStorage.getItem(claveProductos)).find(function buscarPan(candidato) {
      return candidato.nombre === 'Pan Integral';
    });
    expect(producto.id).toBeGreaterThan(18);
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Pan Integral al carrito' }));
    fireEvent.click(screen.getByRole('link', { name: 'Panel administrativo' }));
    abrirProductos();
    fireEvent.click(screen.getByRole('button', { name: 'Editar Pan Integral' }));
    escribir('Precio en CLP', '5000');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    await screen.findByText('Producto guardado.');
    expect(JSON.parse(localStorage.getItem(claveProductos)).find(function buscarProducto(candidato) {
      return candidato.id === producto.id;
    }).precio).toBe(5000);
    fireEvent.click(screen.getByRole('link', { name: /Carrito/ }));
    expect(screen.getByRole('region', { name: 'Resumen de compra' }).textContent).toContain('$7.990');
    fireEvent.click(screen.getByRole('link', { name: 'Panel administrativo' }));
    abrirProductos();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Pan Integral' }));
    await screen.findByText('Producto eliminado.');
    fireEvent.click(screen.getByRole('link', { name: /Carrito/ }));
    expect(screen.queryByLabelText('Cantidad de Pan Integral')).toBeNull();
    expect(JSON.parse(localStorage.getItem(claveCarrito))).toEqual([]);
    interfaz.unmount();
    mostrarAplicacion('/catalogo');
    await screen.findByText('Hola, Administración Demo');
    expect(screen.queryByRole('button', { name: 'Agregar Pan Integral al carrito' })).toBeNull();
  });
  it('muestra la eliminación en el catálogo público sin recargar y conserva la edición al remontar', async function comprobarCatalogoVigente() {
    const interfaz = mostrarAplicacion();
    await ingresarAdministrador();
    abrirProductos();
    fireEvent.click(screen.getByRole('button', { name: 'Editar Arroz Grado 1 1kg' }));
    escribir('Nombre del producto', 'Arroz actualizado');
    escribir('Precio en CLP', '7000');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    await screen.findByText('Producto guardado.');
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo', exact: true }));
    expect(screen.getByRole('button', { name: 'Agregar Arroz actualizado al carrito' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Agregar Arroz actualizado al carrito' }).closest('article').textContent).toContain('$7.000');
    interfaz.unmount();
    mostrarAplicacion('/panel-administracion');
    await screen.findByText('Productos: 18');
    abrirProductos();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Arroz actualizado' }));
    await screen.findByText('Producto eliminado.');
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo', exact: true }));
    expect(screen.queryByRole('button', { name: 'Agregar Arroz actualizado al carrito' })).toBeNull();
    expect(screen.getAllByRole('article').length).toBe(17);
  });
  it('rechaza campos y precio inválidos y permite cancelar o corregir el formulario de producto', async function comprobarErroresProducto() {
    mostrarAplicacion();
    await ingresarAdministrador();
    abrirProductos();
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo producto' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByLabelText('Nombre del producto').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByLabelText('Descripción').getAttribute('aria-describedby')).toBe('producto-descripcion-error');
    completarProducto('Pan Integral', '0');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByText('Ingresa un precio entero positivo en pesos chilenos.')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(claveProductos)).length).toBe(18);
    escribir('Precio en CLP', '3000');
    expect(screen.getByLabelText('Precio en CLP').getAttribute('aria-invalid')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('form', { name: 'Formulario de producto' })).toBeNull();
  });
  it('rechaza credenciales de cliente en el acceso administrativo sin crear una sesión', async function comprobarAccesoCliente() {
    mostrarAplicacion();
    await esperarIngresoDisponible();
    escribir('Correo electrónico', 'cliente@gmail.com');
    escribir('Contraseña', 'ClienteDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Esta cuenta es de cliente. No tiene acceso administrativo.');
    expect(JSON.parse(localStorage.getItem(claveSesion))).toBeNull();
    expect(screen.queryByRole('button', { name: 'Productos' })).toBeNull();
  });
  it('crea un cliente con credencial derivada y permite su ingreso público tras cerrar sesión', async function comprobarUsuarioCreado() {
    mostrarAplicacion();
    await ingresarAdministrador();
    fireEvent.click(screen.getByRole('button', { name: 'Usuarios', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo usuario' }));
    completarUsuario();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    await screen.findByText('Usuario guardado.');
    const contenido = localStorage.getItem(claveUsuarios);
    expect(contenido).not.toContain('NuevaDemo123');
    expect(screen.queryByText(/PBKDF2|resumen|sal:/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    fireEvent.click(screen.getByRole('link', { name: 'Ingresar', exact: true }));
    escribir('Correo electrónico', 'ana@gmail.com');
    escribir('Contraseña', 'NuevaDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Hola, Ana Pérez');
  });
  it('rechaza duplicados y contraseña corta en el formulario sin persistir una cuenta', async function comprobarErroresUsuario() {
    mostrarAplicacion();
    await ingresarAdministrador();
    abrirUsuarios();
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo usuario' }));
    completarUsuario(' CLIENTE@gmail.com ');
    escribir('Contraseña', 'corta');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(screen.getByText('Ya existe una cuenta con ese correo.')).toBeTruthy();
    expect(screen.getByLabelText('Correo electrónico').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByLabelText('Contraseña').getAttribute('aria-invalid')).toBe('true');
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).length).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('form', { name: 'Formulario de usuario' })).toBeNull();
  });
  it('protege al último administrador desde botones y formulario con mensajes visibles', async function comprobarUltimoAdministrador() {
    mostrarAplicacion();
    await ingresarAdministrador();
    abrirUsuarios();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Administración Demo' }));
    await screen.findByText('No puedes eliminar ni cambiar el rol del último administrador.');
    fireEvent.click(screen.getByRole('button', { name: 'Editar Administración Demo' }));
    escribir('Rol', 'cliente');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    const formulario = screen.getByRole('form', { name: 'Formulario de usuario' });
    await within(formulario).findByText('No puedes eliminar ni cambiar el rol del último administrador.');
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).find(function buscarAdministrador(usuario) {
      return usuario.id === 'administrador-demo';
    }).rol).toBe('administrador');
  });
  it('actualiza la contraseña y rechaza la anterior incluso después de recargar', async function comprobarCambioContrasena() {
    const interfaz = mostrarAplicacion();
    await ingresarAdministrador();
    abrirUsuarios();
    fireEvent.click(screen.getByRole('button', { name: 'Editar Cliente Demo' }));
    escribir('Contraseña', 'CambioDemo456');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    await screen.findByText('Usuario guardado.');
    expect(localStorage.getItem(claveUsuarios)).not.toContain('CambioDemo456');
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    interfaz.unmount();
    mostrarAplicacion('/login');
    await esperarIngresoDisponible();
    escribir('Correo electrónico', 'cliente@gmail.com');
    escribir('Contraseña', 'ClienteDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Correo o contraseña incorrectos.');
    escribir('Contraseña', 'CambioDemo456');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Hola, Cliente Demo');
  });
  it('elimina un cliente de la fuente compartida e impide volver a ingresar con sus credenciales', async function comprobarEliminacionUsuario() {
    mostrarAplicacion();
    await ingresarAdministrador();
    abrirUsuarios();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Cliente Demo' }));
    await screen.findByText('Usuario eliminado.');
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).length).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    fireEvent.click(screen.getByRole('link', { name: 'Ingresar', exact: true }));
    escribir('Correo electrónico', 'cliente@gmail.com');
    escribir('Contraseña', 'ClienteDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Correo o contraseña incorrectos.');
    expect(JSON.parse(localStorage.getItem(claveSesion))).toBeNull();
  });
  it('mantiene la credencial al editar sin contraseña y deriva la identidad de los usuarios actualizados', async function comprobarIdentidadActualizada() {
    await mostrarContextos('administrador-demo');
    const credencialAnterior = contextoUsuarios.usuarioActual.credencial;
    await act(async function editarAdministradorActual() {
      await contextoUsuarios.guardarUsuario({ nombre: 'Administradora Actualizada', correo: 'actualizada@duoc.cl', rol: 'administrador', contrasena: '' }, 'administrador-demo');
    });
    expect(contextoUsuarios.usuarioActual.nombre).toBe('Administradora Actualizada');
    expect(contextoUsuarios.usuarioActual.correo).toBe('actualizada@duoc.cl');
    expect(contextoUsuarios.usuarioActual.credencial).toEqual(credencialAnterior);
    expect(JSON.parse(localStorage.getItem(claveSesion))).toEqual({ usuarioId: 'administrador-demo' });
  });
  ['cliente-demo', null].forEach(function definirSesionSinPermiso(usuarioId) {
    it(`rechaza mutaciones directas de ambos contextos con sesión ${String(usuarioId)}`, async function comprobarAutorizacionDirecta() {
      await mostrarContextos(usuarioId);
      const valoresUsuario = { nombre: 'Ana Pérez', correo: 'ana@gmail.com', rol: 'cliente', contrasena: 'NuevaDemo123' };
      await expectAsync(contextoUsuarios.guardarUsuario(valoresUsuario)).toBeRejectedWithError('Solo un administrador puede modificar estos datos.');
      expect(function intentarEliminarCuenta() {
        contextoUsuarios.eliminarUsuario('cliente-demo');
      }).toThrowError('Solo un administrador puede modificar estos datos.');
      expect(function intentarGuardarProducto() {
        contextoProductos.guardarProducto({ nombre: 'Pan', categoria: 'Panadería', descripcion: 'Pan de prueba.', emoji: '🍞', precio: 3000 });
      }).toThrowError('Solo un administrador puede modificar estos datos.');
      expect(function intentarEliminarProducto() {
        contextoProductos.eliminarProducto(1);
      }).toThrowError('Solo un administrador puede modificar estos datos.');
      expect(contextoUsuarios.usuarios.length).toBe(2);
      expect(contextoProductos.productos.length).toBe(18);
    });
  });
  it('rechaza rol inventado y duplicado directamente en el contexto, no solo en los campos', async function comprobarValidacionDirecta() {
    await mostrarContextos('administrador-demo');
    const valores = { nombre: 'Ana Pérez', correo: 'ana@gmail.com', rol: 'superusuario', contrasena: 'NuevaDemo123' };
    await expectAsync(contextoUsuarios.guardarUsuario(valores)).toBeRejectedWithError('Selecciona cliente o administrador.');
    await expectAsync(contextoUsuarios.guardarUsuario({ ...valores, rol: 'cliente', correo: ' CLIENTE@gmail.com ' })).toBeRejectedWithError('Ya existe una cuenta con ese correo.');
    expect(contextoUsuarios.usuarios.length).toBe(2);
  });
  it('evita autoeliminación y autodegradación con otro administrador disponible', async function comprobarProteccionPropia() {
    await mostrarContextos('administrador-demo');
    await act(async function crearSegundoAdministrador() {
      await contextoUsuarios.guardarUsuario({ nombre: 'Otra Administradora', correo: 'otra@duoc.cl', rol: 'administrador', contrasena: 'OtraDemo123' });
    });
    expect(function intentarAutoeliminacion() {
      contextoUsuarios.eliminarUsuario('administrador-demo');
    }).toThrowError('No puedes eliminar tu propia cuenta ni quitarte el rol de administrador.');
    await expectAsync(contextoUsuarios.guardarUsuario({ nombre: 'Administración Demo', correo: 'admin@duoc.cl', rol: 'cliente', contrasena: '' }, 'administrador-demo'))
      .toBeRejectedWithError('No puedes eliminar tu propia cuenta ni quitarte el rol de administrador.');
    const otraCuenta = contextoUsuarios.usuarios.find(function buscarOtraCuenta(usuario) {
      return usuario.correo === 'otra@duoc.cl';
    });
    await act(async function degradarOtraCuenta() {
      await contextoUsuarios.guardarUsuario({ nombre: otraCuenta.nombre, correo: otraCuenta.correo, rol: 'cliente', contrasena: '' }, otraCuenta.id);
    });
    expect(contextoUsuarios.usuarioActual.rol).toBe('administrador');
    expect(contextoUsuarios.usuarios.find(function buscarCuentaDegradada(usuario) {
      return usuario.id === otraCuenta.id;
    }).rol).toBe('cliente');
  });
  it('rechaza mutaciones de usuarios ausentes y conserva el estado', async function comprobarAusenciaUsuario() {
    await mostrarContextos('administrador-demo');
    await expectAsync(contextoUsuarios.guardarUsuario({ nombre: 'Ana Pérez', correo: 'ana@gmail.com', rol: 'cliente', contrasena: '' }, 'ausente')).toBeRejectedWithError('El usuario ya no existe.');
    expect(function intentarEliminarAusente() {
      contextoUsuarios.eliminarUsuario('ausente');
    }).toThrowError('El usuario ya no existe.');
    expect(contextoUsuarios.usuarios.length).toBe(2);
  });
  it('asigna identificadores distintos y conserva dos altas inmediatas de productos', async function comprobarAltasSinCierreObsoleto() {
    await mostrarContextos('administrador-demo');
    let primerProducto;
    let segundoProducto;
    act(function crearProductosSinRenderIntermedio() {
      primerProducto = contextoProductos.guardarProducto({ nombre: 'Pan Integral', categoria: 'Panadería', descripcion: 'Pan integral.', emoji: '🍞', precio: 3000 });
      segundoProducto = contextoProductos.guardarProducto({ nombre: 'Pan Blanco', categoria: 'Panadería', descripcion: 'Pan blanco.', emoji: '🍞', precio: 2000 });
    });
    expect(primerProducto.id).not.toBe(segundoProducto.id);
    expect(contextoProductos.productos.length).toBe(20);
    expect(JSON.parse(localStorage.getItem(claveProductos)).length).toBe(20);
  });
  it('bloquea una segunda alta o eliminación mientras deriva una credencial', async function comprobarOperacionesSimultaneas() {
    await mostrarContextos('administrador-demo');
    const valores = { nombre: 'Ana Pérez', correo: 'ana@gmail.com', rol: 'cliente', contrasena: 'NuevaDemo123' };
    await act(async function crearSinDuplicar() {
      const primeraOperacion = contextoUsuarios.guardarUsuario(valores);
      await expectAsync(contextoUsuarios.guardarUsuario(valores)).toBeRejectedWithError('Espera a que termine la operación actual.');
      expect(function eliminarDuranteAlta() {
        contextoUsuarios.eliminarUsuario('cliente-demo');
      }).toThrowError('Espera a que termine la operación actual.');
      await primeraOperacion;
    });
    expect(contextoUsuarios.usuarios.length).toBe(3);
    const cuentasCreadas = contextoUsuarios.usuarios.filter(function buscarCorreo(usuario) {
      return usuario.correo === 'ana@gmail.com';
    });
    expect(cuentasCreadas.length).toBe(1);
  });
  it('cancela el permiso de una alta en curso si se cierra sesión antes de terminar PBKDF2', async function comprobarCierreDuranteAlta() {
    await mostrarContextos('administrador-demo');
    await act(async function cerrarAntesDeDerivar() {
      const operacion = contextoUsuarios.guardarUsuario({ nombre: 'Ana Pérez', correo: 'ana@gmail.com', rol: 'cliente', contrasena: 'NuevaDemo123' });
      contextoUsuarios.cerrarSesion();
      await expectAsync(operacion).toBeRejectedWithError('Solo un administrador puede modificar estos datos.');
    });
    expect(contextoUsuarios.usuarioActual).toBeNull();
    expect(contextoUsuarios.usuarios.length).toBe(2);
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).length).toBe(2);
  });
  it('restaura una cuenta creada en el panel sin exigir RUT o despacho inventados', async function comprobarCuentaSinDespacho() {
    const interfaz = mostrarAplicacion();
    await ingresarAdministrador();
    abrirUsuarios();
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo usuario' }));
    completarUsuario();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    await screen.findByText('Usuario guardado.');
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    interfaz.unmount();
    mostrarAplicacion('/login');
    await esperarIngresoDisponible();
    escribir('Correo electrónico', 'ana@gmail.com');
    escribir('Contraseña', 'NuevaDemo123');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await screen.findByText('Hola, Ana Pérez');
    const cuentaGuardada = JSON.parse(localStorage.getItem(claveUsuarios)).find(function buscarCuenta(usuario) {
      return usuario.correo === 'ana@gmail.com';
    });
    expect(cuentaGuardada.rut).toBe('');
    expect(cuentaGuardada.telefono).toBe('');
    expect(cuentaGuardada.comuna).toBe('');
  });
  it('explica el fallo de inicialización del panel sin mostrar funciones administrativas', async function comprobarPanelSinWebCrypto() {
    spyOn(window.crypto.subtle, 'importKey').and.callFake(function rechazarPreparacion() {
      return Promise.reject(new Error('WebCrypto no disponible'));
    });
    mostrarAplicacion('/panel-administracion');
    await screen.findByText(/No se pudieron preparar las cuentas/);
    expect(screen.queryByRole('button', { name: 'Productos', exact: true })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Panel administrativo' })).toBeNull();
  });
  it('avisa el fallo de escritura de productos y mantiene los cambios visibles en memoria', async function comprobarProductoSinPersistencia() {
    mostrarAplicacion();
    await ingresarAdministrador();
    abrirProductos();
    const escrituraOriginal = Storage.prototype.setItem;
    spyOn(Storage.prototype, 'setItem').and.callFake(function denegarSoloProductos(clave, contenido) {
      if (clave === claveProductos) {
        throw new Error('Sin espacio para productos');
      }
      return escrituraOriginal.call(this, clave, contenido);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo producto' }));
    completarProducto();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    await screen.findByText('No se pueden guardar cambios de productos. Pueden perderse al recargar.');
    expect(JSON.parse(localStorage.getItem(claveProductos)).length).toBe(18);
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo', exact: true }));
    expect(screen.getByRole('button', { name: 'Agregar Pan Integral al carrito' })).toBeTruthy();
  });
  [
    { nombre: 'Administración Demo', correo: 'admin@duoc.cl' },
    { nombre: 'Cliente Demo', correo: 'cliente@gmail.com' }
  ].forEach(function definirFormularioReabierto(usuarioReabierto) {
  it(`conserva la nueva edición de ${usuarioReabierto.nombre} mientras termina una edición anterior`, async function comprobarFormularioDuranteDerivacion() {
    mostrarAplicacion();
    await ingresarAdministrador();
    abrirUsuarios();
    fireEvent.click(screen.getByRole('button', { name: 'Editar Cliente Demo' }));
    escribir('Contraseña', 'CambioDemo456');
    const resumenAnterior = JSON.parse(localStorage.getItem(claveUsuarios))[0].credencial.resumen;
    const derivarOriginal = window.crypto.subtle.deriveBits.bind(window.crypto.subtle);
    let continuarDerivacion;
    const esperaDerivacion = new Promise(function prepararEspera(resolver) {
      continuarDerivacion = resolver;
    });
    const derivacion = spyOn(window.crypto.subtle, 'deriveBits').and.callFake(async function demorarDerivacion(...argumentos) {
      await esperaDerivacion;
      return derivarOriginal(...argumentos);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    await waitFor(function esperarDerivacionEnCurso() {
      if (derivacion.calls.count() !== 1) {
        throw new Error('La derivación todavía no comenzó.');
      }
    });
    // Para el mismo usuario, desmontar permite comprobar una apertura nueva.
    if (usuarioReabierto.nombre === 'Cliente Demo') {
      fireEvent.click(screen.getByRole('button', { name: 'Resumen', exact: true }));
      abrirUsuarios();
    }
    fireEvent.click(screen.getByRole('button', { name: `Editar ${usuarioReabierto.nombre}` }));
    escribir('Nombre completo', 'Persona Actualizada');
    await act(async function finalizarEdicionAnterior() {
      continuarDerivacion();
      await esperaDerivacion;
    });
    await waitFor(function esperarUsuarioGuardado() {
      const usuarios = JSON.parse(localStorage.getItem(claveUsuarios));
      const cliente = usuarios.find(function buscarCliente(usuario) {
        return usuario.id === 'cliente-demo';
      });
      if (cliente.credencial.resumen === resumenAnterior) {
        throw new Error('La edición anterior todavía no fue guardada.');
      }
      // El formulario nuevo debe seguir montado después del resultado anterior.
      const formulario = screen.getByRole('form', { name: 'Formulario de usuario' });
      if (within(formulario).getByLabelText('Nombre completo').value !== 'Persona Actualizada') {
        throw new Error('Se perdieron los cambios del formulario nuevo.');
      }
      if (screen.queryByRole('button', { name: 'Guardando usuario…' })) {
        throw new Error('La operación anterior sigue pendiente.');
      }
    });
    expect(screen.getByLabelText('Correo electrónico').value).toBe(usuarioReabierto.correo);
    expect(screen.getByLabelText('Nombre completo').value).toBe('Persona Actualizada');
    expect(screen.queryByText('Usuario guardado.')).toBeNull();
  });
  });
  it('no informa éxito cuando falla PBKDF2 y permite reintentar el formulario', async function comprobarFalloCriptografico() {
    mostrarAplicacion();
    await ingresarAdministrador();
    abrirUsuarios();
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo usuario' }));
    completarUsuario();
    const derivacion = spyOn(window.crypto.subtle, 'deriveBits').and.callFake(function rechazarDerivacion() {
      return Promise.reject(new Error('Criptografía no disponible'));
    });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    await screen.findByText('No se pudo guardar el usuario. Intenta nuevamente en localhost o HTTPS.');
    expect(screen.getByRole('button', { name: 'Guardar usuario' }).disabled).toBeFalse();
    expect(JSON.parse(localStorage.getItem(claveUsuarios)).length).toBe(2);
    derivacion.and.callThrough();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    await screen.findByText('Usuario guardado.');
  });
});
