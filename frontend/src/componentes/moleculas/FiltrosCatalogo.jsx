export default function FiltrosCatalogo({ busqueda, categoria, categorias, alBuscar, alSeleccionarCategoria }) {
  function cambiarBusqueda(evento) {
    alBuscar(evento.target.value);
  }

  function cambiarCategoria(evento) {
    alSeleccionarCategoria(evento.target.value);
  }

  return (
    <section aria-label="Filtros de búsqueda" className="row g-3 mb-4">
      <div className="col-md-8">
        <label htmlFor="busqueda-productos" className="form-label">Buscar producto</label>
        <input id="busqueda-productos" type="search" className="form-control" value={busqueda} onChange={cambiarBusqueda} />
      </div>
      <div className="col-md-4">
        <label htmlFor="categoria-productos" className="form-label">Categoría</label>
        <select id="categoria-productos" className="form-select" value={categoria} onChange={cambiarCategoria}>
          <option value="todas">Todas las categorías</option>
          {categorias.map(function presentarCategoria(categoriaDisponible) {
            return <option key={categoriaDisponible} value={categoriaDisponible}>{categoriaDisponible}</option>;
          })}
        </select>
      </div>
    </section>
  );
}
