import { Outlet } from 'react-router-dom';
import BarraNavegacion from '../organismos/BarraNavegacion.jsx';
import PiePagina from '../organismos/PiePagina.jsx';

export default function PlantillaTienda() {
  return (
    <div className="plantilla-tienda">
      <BarraNavegacion />
      <main className="container py-5 contenido-tienda" id="contenido-principal">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  );
}
