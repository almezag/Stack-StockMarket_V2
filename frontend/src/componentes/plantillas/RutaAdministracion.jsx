import { Link, Outlet } from 'react-router-dom';
import { useUsuarios } from '../../hooks/useUsuarios.js';

export default function RutaAdministracion() {
  const { listo, usuarioActual, errorInicializacion } = useUsuarios();
  if (errorInicializacion) {
    return <p role="alert">{errorInicializacion}</p>;
  }
  if (!listo) {
    return <p role="status">Preparando cuentas locales…</p>;
  }
  if (usuarioActual?.rol !== 'administrador') {
    return (
      <section aria-labelledby="titulo-acceso-denegado">
        <h1 id="titulo-acceso-denegado">Acceso restringido</h1>
        <p>Necesitas una sesión de administrador para acceder al panel.</p>
        <Link to="/admin">Ir al acceso administrativo</Link>
      </section>
    );
  }
  return <Outlet />;
}
