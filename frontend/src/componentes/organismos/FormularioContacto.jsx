import { useState } from 'react';
import Boton from '../atomos/Boton.jsx';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import { asuntosContacto, validarContacto } from '../../utilidades/validarCompra.js';

export default function FormularioContacto() {
  const valoresIniciales = { nombre: '', correo: '', telefono: '', asunto: '', mensaje: '' };
  const [valores, establecerValores] = useState(valoresIniciales);
  const [errores, establecerErrores] = useState({});
  const [confirmacion, establecerConfirmacion] = useState(false);
  const [errorGeneral, establecerErrorGeneral] = useState('');

  function cambiarCampo(evento) {
    const nombre = evento.target.name;
    const nuevosValores = { ...valores, [nombre]: evento.target.value };
    establecerValores(nuevosValores);
    establecerConfirmacion(false);
    if (errores[nombre]) {
      establecerErrores({ ...errores, [nombre]: validarContacto(nuevosValores)[nombre] });
    }
  }
  function validarCampo(evento) {
    const nombre = evento.target.name;
    establecerErrores({ ...errores, [nombre]: validarContacto(valores)[nombre] });
  }
  function validarMensaje(evento) {
    evento.preventDefault();
    const erroresActuales = validarContacto(valores);
    establecerErrores(erroresActuales);
    establecerConfirmacion(false);
    if (Object.keys(erroresActuales).length > 0) {
      establecerErrorGeneral('Revisa los campos indicados.');
      return;
    }
    establecerErrorGeneral('');
    establecerConfirmacion(true);
    establecerValores(valoresIniciales);
  }
  return (
    <form noValidate onSubmit={validarMensaje} className="card p-4">
      <h2 className="h4">Escríbenos</h2>
      <p>Validación local demostrativa. El mensaje no se guarda ni se envía a un servidor.</p>
      {errorGeneral && <p role="alert" className="alert alert-danger">{errorGeneral}</p>}
      {confirmacion && <p role="status" className="alert alert-success">Mensaje validado en esta simulación; no se ha enviado un correo real.</p>}
      <CampoFormulario etiqueta="Nombre completo" identificador="contacto-nombre" nombre="nombre" valor={valores.nombre} error={errores.nombre} alCambiar={cambiarCampo} alSalir={validarCampo} autocompletar="name" longitudMaxima={100} />
      <CampoFormulario etiqueta="Correo" identificador="contacto-correo" nombre="correo" tipo="email" valor={valores.correo} error={errores.correo} alCambiar={cambiarCampo} alSalir={validarCampo} autocompletar="email" longitudMaxima={100} />
      <CampoFormulario etiqueta="Teléfono" identificador="contacto-telefono" nombre="telefono" tipo="tel" valor={valores.telefono} error={errores.telefono} alCambiar={cambiarCampo} alSalir={validarCampo} autocompletar="tel" />
      <CampoFormulario etiqueta="Asunto" identificador="contacto-asunto" nombre="asunto" valor={valores.asunto} error={errores.asunto} alCambiar={cambiarCampo} alSalir={validarCampo}>
        <option value="">Selecciona una opción</option>
        {asuntosContacto.map(function presentarAsunto(asunto) { return <option key={asunto}>{asunto}</option>; })}
      </CampoFormulario>
      <CampoFormulario etiqueta="Mensaje" identificador="contacto-mensaje" nombre="mensaje" valor={valores.mensaje} error={errores.mensaje} alCambiar={cambiarCampo} alSalir={validarCampo} multilinea longitudMaxima={500} />
      <Boton tipo="submit">Validar mensaje</Boton>
    </form>
  );
}
