import Boton from '../atomos/Boton.jsx';
import { formatearMoneda } from '../../utilidades/formatearMoneda.js';

export default function FilaCarrito({ linea, alCambiarCantidad, alEliminar }) {
  const { producto, cantidad } = linea;

  function cambiarCantidad(evento) {
    alCambiarCantidad(producto.id, Number(evento.target.value));
  }

  function eliminarProductoSeleccionado() {
    alEliminar(producto.id);
  }

  return (
    <tr>
      <th scope="row">{producto.nombre}</th>
      <td>{formatearMoneda(producto.precio)}</td>
      <td>
        <label htmlFor={`cantidad-${producto.id}`} className="visually-hidden">Cantidad de {producto.nombre}</label>
        <input id={`cantidad-${producto.id}`} type="number" min="1" step="1" value={cantidad}
          onChange={cambiarCantidad} className="form-control cantidad-carrito" />
      </td>
      <td>{formatearMoneda(producto.precio * cantidad)}</td>
      <td>
        <Boton clase="btn btn-outline-danger" alPresionar={eliminarProductoSeleccionado}
          etiquetaAccesible={`Eliminar ${producto.nombre}`}>
          Eliminar
        </Boton>
      </td>
    </tr>
  );
}
