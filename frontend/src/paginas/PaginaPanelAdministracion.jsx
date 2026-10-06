import { useRef, useState } from 'react';
import { useProductos } from '../hooks/useProductos.js';
import { useUsuarios } from '../hooks/useUsuarios.js';
import PlantillaAdministracion from '../componentes/plantillas/PlantillaAdministracion.jsx';
import ResumenAdministracion from '../componentes/organismos/ResumenAdministracion.jsx';
import FormularioProducto from '../componentes/organismos/FormularioProducto.jsx';
import FormularioUsuario from '../componentes/organismos/FormularioUsuario.jsx';
import TablaProductos from '../componentes/organismos/TablaProductos.jsx';
import TablaUsuarios from '../componentes/organismos/TablaUsuarios.jsx';
import Boton from '../componentes/atomos/Boton.jsx';

export default function PaginaPanelAdministracion() {
  const { productos, guardarProducto, eliminarProducto, persistenciaDisponible } = useProductos();
  const { usuarios, guardarUsuario, eliminarUsuario } = useUsuarios();
  const [seccionActiva, establecerSeccionActiva] = useState('resumen');
  const [productoEditado, establecerProductoEditado] = useState(null);
  const [usuarioEditado, establecerUsuarioEditado] = useState(null);
  const [formularioProductoVisible, establecerFormularioProductoVisible] = useState(false);
  const [formularioUsuarioVisible, establecerFormularioUsuarioVisible] = useState(false);
  const [mensaje, establecerMensaje] = useState('');
  const [mensajeError, establecerMensajeError] = useState('');
  const aperturaFormularioUsuario = useRef(0);

  function cambiarSeccion(seccion) {
    aperturaFormularioUsuario.current += 1;
    establecerSeccionActiva(seccion);
    establecerFormularioProductoVisible(false);
    establecerFormularioUsuarioVisible(false);
    establecerMensaje('');
    establecerMensajeError('');
  }
  function crearProducto() {
    establecerProductoEditado(null);
    establecerFormularioProductoVisible(true);
    establecerMensaje('');
  }
  function editarProducto(producto) {
    establecerProductoEditado(producto);
    establecerFormularioProductoVisible(true);
    establecerMensaje('');
  }
  function cancelarProducto() {
    establecerFormularioProductoVisible(false);
  }
  function guardarProductoDelFormulario(valores, identificador) {
    guardarProducto(valores, identificador);
    establecerFormularioProductoVisible(false);
    establecerMensajeError('');
    establecerMensaje('Producto guardado.');
  }
  function eliminarProductoDeTabla(identificador) {
    establecerMensaje('');
    establecerMensajeError('');
    try {
      eliminarProducto(identificador);
      establecerFormularioProductoVisible(false);
      establecerMensaje('Producto eliminado.');
    } catch (error) {
      establecerMensajeError(error.message);
    }
  }
  function crearUsuario() {
    aperturaFormularioUsuario.current += 1;
    establecerUsuarioEditado(null);
    establecerFormularioUsuarioVisible(true);
    establecerMensaje('');
  }
  function editarUsuario(usuario) {
    aperturaFormularioUsuario.current += 1;
    establecerUsuarioEditado(usuario);
    establecerFormularioUsuarioVisible(true);
    establecerMensaje('');
  }
  function cancelarUsuario() {
    aperturaFormularioUsuario.current += 1;
    establecerFormularioUsuarioVisible(false);
  }
  async function guardarUsuarioDelFormulario(valores, identificador) {
    const aperturaAlGuardar = aperturaFormularioUsuario.current;
    await guardarUsuario(valores, identificador);
    // PBKDF2 puede terminar después de abrir otro formulario: no cerrar esa nueva edición.
    if (aperturaFormularioUsuario.current !== aperturaAlGuardar) {
      return;
    }
    establecerFormularioUsuarioVisible(false);
    establecerMensajeError('');
    establecerMensaje('Usuario guardado.');
  }
  function eliminarUsuarioDeTabla(identificador) {
    establecerMensaje('');
    establecerMensajeError('');
    try {
      eliminarUsuario(identificador);
      aperturaFormularioUsuario.current += 1;
      establecerFormularioUsuarioVisible(false);
      establecerMensaje('Usuario eliminado.');
    } catch (error) {
      establecerMensajeError(error.message);
    }
  }
  return (
    <PlantillaAdministracion seccionActiva={seccionActiva} alCambiarSeccion={cambiarSeccion}>
      {!persistenciaDisponible && <p role="alert">No se pueden guardar cambios de productos. Pueden perderse al recargar.</p>}
      {mensaje && <p role="status">{mensaje}</p>}
      {mensajeError && <p role="alert">{mensajeError}</p>}
      {seccionActiva === 'resumen' && <ResumenAdministracion productos={productos} usuarios={usuarios} />}
      {seccionActiva === 'productos' && (
        <section aria-labelledby="titulo-gestion-productos">
          <h2 id="titulo-gestion-productos">Gestión de productos</h2>
          <Boton alPresionar={crearProducto} clase="btn btn-primary mb-3">Nuevo producto</Boton>
          {formularioProductoVisible && <FormularioProducto key={productoEditado?.id ?? 'nuevo-producto'} producto={productoEditado} alGuardar={guardarProductoDelFormulario} alCancelar={cancelarProducto} />}
          <TablaProductos productos={productos} alEditar={editarProducto} alEliminar={eliminarProductoDeTabla} />
        </section>
      )}
      {seccionActiva === 'usuarios' && (
        <section aria-labelledby="titulo-gestion-usuarios">
          <h2 id="titulo-gestion-usuarios">Gestión de usuarios</h2>
          <Boton alPresionar={crearUsuario} clase="btn btn-primary mb-3">Nuevo usuario</Boton>
          {formularioUsuarioVisible && <FormularioUsuario key={usuarioEditado?.id ?? 'nuevo-usuario'} usuario={usuarioEditado} usuarios={usuarios} alGuardar={guardarUsuarioDelFormulario} alCancelar={cancelarUsuario} />}
          <TablaUsuarios usuarios={usuarios} alEditar={editarUsuario} alEliminar={eliminarUsuarioDeTabla} />
        </section>
      )}
    </PlantillaAdministracion>
  );
}
