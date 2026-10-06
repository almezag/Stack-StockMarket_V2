import { useState } from 'react';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import Boton from '../atomos/Boton.jsx';
import { validarProducto } from '../../utilidades/validarAdministracion.js';

export default function FormularioProducto({ producto, alGuardar, alCancelar }) {
  const [valores, establecerValores] = useState({
    nombre: producto?.nombre ?? '', categoria: producto?.categoria ?? '',
    descripcion: producto?.descripcion ?? '', emoji: producto?.emoji ?? '📦', precio: producto?.precio ?? ''
  });
  const [errores, establecerErrores] = useState({});
  const [mensajeError, establecerMensajeError] = useState('');
  function cambiarCampo(evento) {
    const nuevosValores = { ...valores, [evento.target.name]: evento.target.value };
    establecerValores(nuevosValores);
    establecerMensajeError('');
    if (Object.keys(errores).length > 0) {
      establecerErrores(validarProducto(nuevosValores));
    }
  }
  function guardarFormulario(evento) {
    evento.preventDefault();
    const erroresActuales = validarProducto(valores);
    establecerErrores(erroresActuales);
    if (Object.keys(erroresActuales).length > 0) {
      return;
    }
    try {
      alGuardar(valores, producto?.id ?? null);
    } catch (error) {
      establecerMensajeError(error.message);
    }
  }
  return (
    <form onSubmit={guardarFormulario} noValidate aria-label="Formulario de producto" className="border rounded p-3 mb-4">
      <h3>{producto ? 'Editar producto' : 'Nuevo producto'}</h3>
      {mensajeError && <p role="alert">{mensajeError}</p>}
      <CampoFormulario etiqueta="Nombre del producto" identificador="producto-nombre" nombre="nombre" valor={valores.nombre} error={errores.nombre} alCambiar={cambiarCampo} />
      <CampoFormulario etiqueta="Categoría" identificador="producto-categoria" nombre="categoria" valor={valores.categoria} error={errores.categoria} alCambiar={cambiarCampo} />
      <CampoFormulario etiqueta="Descripción" identificador="producto-descripcion" nombre="descripcion" multilinea valor={valores.descripcion} error={errores.descripcion} alCambiar={cambiarCampo} />
      <CampoFormulario etiqueta="Emoji" identificador="producto-emoji" nombre="emoji" valor={valores.emoji} error={errores.emoji} alCambiar={cambiarCampo} />
      <CampoFormulario etiqueta="Precio en CLP" identificador="producto-precio" nombre="precio" tipo="number" valor={valores.precio} error={errores.precio} alCambiar={cambiarCampo} />
      <div className="d-flex gap-2">
        <Boton tipo="submit">Guardar producto</Boton>
        <Boton clase="btn btn-secondary" alPresionar={alCancelar}>Cancelar</Boton>
      </div>
    </form>
  );
}
