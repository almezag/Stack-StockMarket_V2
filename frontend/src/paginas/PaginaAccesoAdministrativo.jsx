import { Navigate } from 'react-router-dom';
import { useUsuarios } from '../hooks/useUsuarios.js';
import FormularioInicioSesion from '../componentes/organismos/FormularioInicioSesion.jsx';

export default function PaginaAccesoAdministrativo() {
  const { usuarioActual } = useUsuarios();
  if (usuarioActual?.rol === 'administrador') {
    return <Navigate to="/panel-administracion" replace />;
  }
  return (
    <section aria-labelledby="titulo-acceso-administrativo">
      <h1 id="titulo-acceso-administrativo">Acceso administrativo</h1>
      <p>Utiliza una cuenta con rol administrador. El ingreso público sigue siendo exclusivo para clientes.</p>
      <p className="alert alert-warning">Demo local: este acceso no proporciona seguridad de servidor.</p>
      <FormularioInicioSesion rolEsperado="administrador" />
    </section>
  );
}
