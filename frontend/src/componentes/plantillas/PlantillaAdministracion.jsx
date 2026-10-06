import Boton from '../atomos/Boton.jsx';

export default function PlantillaAdministracion({ seccionActiva, alCambiarSeccion, children }) {
  function mostrarResumen() {
    alCambiarSeccion('resumen');
  }
  function mostrarProductos() {
    alCambiarSeccion('productos');
  }
  function mostrarUsuarios() {
    alCambiarSeccion('usuarios');
  }
  return (
    <section aria-labelledby="titulo-panel-administracion">
      <h1 id="titulo-panel-administracion">Panel administrativo</h1>
      <p className="alert alert-warning">Demostración local: localStorage es manipulable y estos controles de rol no reemplazan autorización de servidor.</p>
      <nav aria-label="Secciones administrativas" className="d-flex flex-wrap gap-2 mb-4">
        <Boton alPresionar={mostrarResumen} clase="btn btn-outline-primary" presionado={seccionActiva === 'resumen'}>Resumen</Boton>
        <Boton alPresionar={mostrarProductos} clase="btn btn-outline-primary" presionado={seccionActiva === 'productos'}>Productos</Boton>
        <Boton alPresionar={mostrarUsuarios} clase="btn btn-outline-primary" presionado={seccionActiva === 'usuarios'}>Usuarios</Boton>
      </nav>
      {children}
    </section>
  );
}
