import { Link } from 'react-router-dom';

export default function PaginaNoEncontrada() {
  return (
    <section aria-labelledby="titulo-no-encontrada">
      <p className="text-secondary fw-semibold">Error 404</p>
      <h1 id="titulo-no-encontrada">Página no encontrada</h1>
      <p>La dirección solicitada no existe en esta versión de la tienda.</p>
      <Link className="btn btn-primary" to="/">Volver al inicio</Link>
    </section>
  );
}
