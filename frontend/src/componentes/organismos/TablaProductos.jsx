import Boton from '../atomos/Boton.jsx';

export default function TablaProductos({ productos, alEditar, alEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle" aria-label="Productos administrados">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Categoría</th>
            <th scope="col">Precio CLP</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(function mostrarProducto(producto) {
            function editarProducto() {
              alEditar(producto);
            }
            function eliminarProducto() {
              alEliminar(producto.id);
            }
            return (
              <tr key={producto.id}>
                <th scope="row">{producto.emoji} {producto.nombre}</th>
                <td>{producto.categoria}</td>
                <td>${producto.precio.toLocaleString('es-CL')}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Boton alPresionar={editarProducto} etiquetaAccesible={`Editar ${producto.nombre}`}>
                      Editar
                    </Boton>
                    <Boton
                      alPresionar={eliminarProducto}
                      clase="btn btn-outline-danger"
                      etiquetaAccesible={`Eliminar ${producto.nombre}`}
                    >
                      Eliminar
                    </Boton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {productos.length === 0 && <p>No hay productos registrados.</p>}
    </div>
  );
}
