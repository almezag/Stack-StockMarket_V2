import { Link, NavLink } from 'react-router-dom';
import { useCarrito } from '../../hooks/useCarrito.js';
import { useUsuarios } from '../../hooks/useUsuarios.js';
import Boton from '../atomos/Boton.jsx';

export default function BarraNavegacion() {
  const { totalUnidades } = useCarrito();
  const { usuarioActual, cerrarSesion, persistenciaDisponible } = useUsuarios();
  return (
    <header>
      <nav className="navbar navbar-dark bg-dark" aria-label="Navegación principal">
        <div className="container gap-2">
          <Link className="navbar-brand marca-tienda" to="/" aria-label="Stock & Stock Market">
            <img className="logo-tienda" src="/imagenes/logo-stack-stock.svg" alt="Stack & Stock Market" />
          </Link>
          <NavLink className="nav-link text-white" to="/" end>
            Inicio
          </NavLink>
          <NavLink className="nav-link text-white" to="/catalogo">Catálogo</NavLink>
          <NavLink className="nav-link text-white" to="/quienes-somos">Quiénes Somos</NavLink>
          <NavLink className="nav-link text-white" to="/contacto">Contacto</NavLink>
          <NavLink className="nav-link text-white" to="/carrito">
            Carrito <span className="badge text-bg-light">{totalUnidades}</span>
          </NavLink>
          {usuarioActual?.rol === 'administrador' ? (
            <NavLink className="nav-link text-white" to="/panel-administracion">Panel administrativo</NavLink>
          ) : (
            <NavLink className="nav-link text-white" to="/admin">Acceso administrativo</NavLink>
          )}
          {usuarioActual ? (
            <>
              <span className="text-white">Hola, {usuarioActual.nombre}</span>
              <Boton clase="btn btn-outline-light" alPresionar={cerrarSesion}>Cerrar sesión</Boton>
            </>
          ) : (
            <>
              <NavLink className="nav-link text-white" to="/login">Ingresar</NavLink>
              <NavLink className="nav-link text-white" to="/registro">Crear cuenta</NavLink>
            </>
          )}
        </div>
      </nav>
      {!persistenciaDisponible && (
        <p role="status" className="alert alert-warning mb-0">
          No se pueden guardar nuevos cambios de cuentas o sesión: los cambios de esta sesión pueden perderse al recargar. Los registros anteriores no necesariamente se han eliminado.
        </p>
      )}
    </header>
  );
}
