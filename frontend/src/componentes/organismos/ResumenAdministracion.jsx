export default function ResumenAdministracion({ productos, usuarios }) {
  const categorias = [...new Set(productos.map(function obtenerCategoria(producto) {
    return producto.categoria;
  }))];
  return (
    <section aria-labelledby="titulo-resumen-administracion">
      <h2 id="titulo-resumen-administracion">Resumen de administración</h2>
      <p>Productos: {productos.length}</p>
      <p>Usuarios: {usuarios.length}</p>
      <h3>Productos por categoría</h3>
      <div className="table-responsive">
        <table className="table table-striped" aria-label="Distribución por categoría">
          <thead>
            <tr>
              <th scope="col">Categoría</th>
              <th scope="col">Productos</th>
              <th scope="col">Proporción</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(function mostrarCategoria(categoria) {
              const cantidad = productos.filter(function seleccionarCategoria(producto) {
                return producto.categoria === categoria;
              }).length;
              const porcentaje = Math.round(cantidad / productos.length * 100);
              return (
                <tr key={categoria}>
                  <th scope="row">{categoria}</th>
                  <td>{cantidad}</td>
                  <td>{porcentaje}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {productos.length === 0 && <p>No hay productos para distribuir por categoría.</p>}
    </section>
  );
}
