import { useState } from 'react';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import Boton from '../atomos/Boton.jsx';
import { validarDestinatario } from '../../utilidades/validarCompra.js';

export default function FormularioCheckout({ destinatarioInicial, alContinuar }) {
  const [valores, establecerValores] = useState(destinatarioInicial || {
    nombre: '', correo: '', direccion: '', comuna: '', entrega: 'Despacho a domicilio'
  });
  const [errores, establecerErrores] = useState({});
  const [errorGeneral, establecerErrorGeneral] = useState('');

  function cambiarCampo(evento) {
    const nombre = evento.target.name;
    const nuevosValores = { ...valores, [nombre]: evento.target.value };
    establecerValores(nuevosValores);
    if (errores[nombre]) {
      establecerErrores({ ...errores, [nombre]: validarDestinatario(nuevosValores)[nombre] });
    }
  }
  function validarCampo(evento) {
    const nombre = evento.target.name;
    establecerErrores({ ...errores, [nombre]: validarDestinatario(valores)[nombre] });
  }
  function enviarFormulario(evento) {
    evento.preventDefault();
    const erroresActuales = validarDestinatario(valores);
    establecerErrores(erroresActuales);
    if (Object.keys(erroresActuales).length > 0) {
      establecerErrorGeneral('Revisa los datos de envío indicados.');
      return;
    }
    if (!alContinuar(valores)) {
      establecerErrorGeneral('El carrito ya no permite continuar. Vuelve al carrito y revisa los productos.');
    }
  }
  return (
    <form noValidate onSubmit={enviarFormulario} className="card p-4">
      <h2 className="h4">Datos de envío</h2>
      <p>Puedes comprar como invitado. Usa datos ficticios para esta demostración.</p>
      {errorGeneral && <p role="alert" className="alert alert-danger">{errorGeneral}</p>}
      <CampoFormulario etiqueta="Nombre" identificador="compra-nombre" nombre="nombre" valor={valores.nombre} error={errores.nombre} alCambiar={cambiarCampo} alSalir={validarCampo} autocompletar="name" longitudMaxima={100} />
      <CampoFormulario etiqueta="Correo" identificador="compra-correo" nombre="correo" tipo="email" valor={valores.correo} error={errores.correo} alCambiar={cambiarCampo} alSalir={validarCampo} autocompletar="email" longitudMaxima={100} />
      <CampoFormulario etiqueta="Dirección" identificador="compra-direccion" nombre="direccion" valor={valores.direccion} error={errores.direccion} alCambiar={cambiarCampo} alSalir={validarCampo} autocompletar="street-address" longitudMaxima={200} />
      <CampoFormulario etiqueta="Comuna" identificador="compra-comuna" nombre="comuna" valor={valores.comuna} error={errores.comuna} alCambiar={cambiarCampo} alSalir={validarCampo} longitudMaxima={100} />
      <CampoFormulario etiqueta="Método de entrega" identificador="compra-entrega" nombre="entrega" valor={valores.entrega} error={errores.entrega} alCambiar={cambiarCampo}>
        <option>Despacho a domicilio</option>
        <option>Retiro en tienda</option>
      </CampoFormulario>
      <p>La política original de cálculo aplica $2.990 bajo $25.000 y envío gratis desde $25.000, también al seleccionar retiro en este piloto.</p>
      <Boton tipo="submit">Continuar al pago</Boton>
    </form>
  );
}
