import { Route, Routes } from 'react-router-dom';
import PlantillaTienda from './componentes/plantillas/PlantillaTienda.jsx';
import PaginaInicio from './paginas/PaginaInicio.jsx';
import PaginaNoEncontrada from './paginas/PaginaNoEncontrada.jsx';
import PaginaCatalogo from './paginas/PaginaCatalogo.jsx';
import PaginaCarrito from './paginas/PaginaCarrito.jsx';
import PaginaRegistro from './paginas/PaginaRegistro.jsx';
import PaginaInicioSesion from './paginas/PaginaInicioSesion.jsx';
import PaginaCheckout from './paginas/PaginaCheckout.jsx';
import PaginaPago from './paginas/PaginaPago.jsx';
import PaginaConfirmacion from './paginas/PaginaConfirmacion.jsx';
import PaginaContacto from './paginas/PaginaContacto.jsx';
import PaginaQuienesSomos from './paginas/PaginaQuienesSomos.jsx';
import { ProveedorProductos } from './contextos/ContextoProductos.jsx';
import { ProveedorCarrito } from './contextos/ContextoCarrito.jsx';
import { ProveedorUsuarios } from './contextos/ContextoUsuarios.jsx';
import { ProveedorCompra } from './contextos/ContextoCompra.jsx';
import PaginaAccesoAdministrativo from './paginas/PaginaAccesoAdministrativo.jsx';
import PaginaPanelAdministracion from './paginas/PaginaPanelAdministracion.jsx';
import RutaAdministracion from './componentes/plantillas/RutaAdministracion.jsx';

export default function Aplicacion() {
  return (
    <ProveedorUsuarios>
      <ProveedorProductos>
        <ProveedorCarrito>
          <ProveedorCompra>
            <Routes>
              <Route element={<PlantillaTienda />}>
                <Route path="/" element={<PaginaInicio />} />
                <Route path="/catalogo" element={<PaginaCatalogo />} />
                <Route path="/carrito" element={<PaginaCarrito />} />
                <Route path="/registro" element={<PaginaRegistro />} />
                <Route path="/login" element={<PaginaInicioSesion />} />
                <Route path="/admin" element={<PaginaAccesoAdministrativo />} />
                <Route element={<RutaAdministracion />}>
                  <Route path="/panel-administracion" element={<PaginaPanelAdministracion />} />
                </Route>
                <Route path="/checkout" element={<PaginaCheckout />} />
                <Route path="/pago" element={<PaginaPago />} />
                <Route path="/confirmacion" element={<PaginaConfirmacion />} />
                <Route path="/contacto" element={<PaginaContacto />} />
                <Route path="/quienes-somos" element={<PaginaQuienesSomos />} />
                <Route path="*" element={<PaginaNoEncontrada />} />
              </Route>
            </Routes>
          </ProveedorCompra>
        </ProveedorCarrito>
      </ProveedorProductos>
    </ProveedorUsuarios>
  );
}
