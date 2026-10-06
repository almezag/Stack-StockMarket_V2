import TarjetaProducto from '../moleculas/TarjetaProducto.jsx';

export default function ListaProductos({ productos, alAgregar }) {
  if (productos.length === 0) {
    return <p className="alert alert-info">No encontramos productos que coincidan con tu búsqueda.</p>;
  }

  return (
    <div className="row g-4">
      {productos.map(function presentarProducto(producto) {
        return (
          <div className="col-sm-6 col-lg-4 col-xl-3" key={producto.id}>
            <TarjetaProducto producto={producto} alAgregar={alAgregar} />
          </div>
        );
      })}
    </div>
  );
}
