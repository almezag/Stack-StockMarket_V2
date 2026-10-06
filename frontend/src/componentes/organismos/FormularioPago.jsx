import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Boton from '../atomos/Boton.jsx';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import { formatearNumeroTarjeta, formatearVencimiento, metodosPago, validarPago } from '../../utilidades/validarCompra.js';

export default function FormularioPago({ alConfirmar }) {
  // Estos datos solo existen mientras este formulario está montado, nunca en Storage.
  const [valores, establecerValores] = useState({ metodo: '', numeroTarjeta: '', vencimiento: '', cvv: '' });
  const [errores, establecerErrores] = useState({});
  const [errorGeneral, establecerErrorGeneral] = useState('');
  const [confirmando, establecerConfirmando] = useState(false);
  const envioEnCurso = useRef(false);

  function elegirMetodo(evento) {
    establecerValores({ metodo: evento.target.value, numeroTarjeta: '', vencimiento: '', cvv: '' });
    establecerErrores({});
    establecerErrorGeneral('');
  }
  function cambiarTarjeta(evento) {
    const nombre = evento.target.name;
    let valor = evento.target.value;
    if (nombre === 'numeroTarjeta') {
      valor = formatearNumeroTarjeta(valor);
    } else if (nombre === 'vencimiento') {
      valor = formatearVencimiento(valor);
    } else if (nombre === 'cvv') {
      valor = valor.replace(/\D/g, '').slice(0, 4);
    }
    const nuevosValores = { ...valores, [nombre]: valor };
    establecerValores(nuevosValores);
    if (errores[nombre]) {
      establecerErrores({ ...errores, [nombre]: validarPago(nuevosValores)[nombre] });
    }
  }
  function validarCampo(evento) {
    const nombre = evento.target.name;
    establecerErrores({ ...errores, [nombre]: validarPago(valores)[nombre] });
  }
  function confirmarPago(evento) {
    evento.preventDefault();
    if (envioEnCurso.current) {
      return;
    }
    const erroresActuales = validarPago(valores);
    establecerErrores(erroresActuales);
    if (Object.keys(erroresActuales).length > 0) {
      establecerErrorGeneral('Revisa el método y los campos indicados antes de confirmar.');
      return;
    }
    envioEnCurso.current = true;
    establecerConfirmando(true);
    if (!alConfirmar(valores)) {
      envioEnCurso.current = false;
      establecerConfirmando(false);
      establecerErrorGeneral('No se pudo confirmar. Revisa el carrito y vuelve al checkout.');
    }
  }
  return (
    <form noValidate onSubmit={confirmarPago} className="card p-4">
      <h2 className="h4">Selecciona un método</h2>
      <p className="alert alert-info">Simulación académica: no procesa dinero real ni contacta proveedores de pago. No uses tarjetas reales.</p>
      {errorGeneral && <p role="alert" className="alert alert-danger">{errorGeneral}</p>}
      <fieldset aria-describedby={errores.metodo ? 'metodo-error' : undefined}>
        <legend className="h5">Método de pago</legend>
        {metodosPago.map(function presentarMetodo(metodo, indice) {
          return (
            <div className="form-check mb-3" key={metodo}>
              <input className="form-check-input" type="radio" name="metodo" id={`metodo-${indice}`} value={metodo} checked={valores.metodo === metodo} onChange={elegirMetodo} disabled={confirmando} aria-invalid={Boolean(errores.metodo)} />
              <label className="form-check-label" htmlFor={`metodo-${indice}`}>{metodo}</label>
            </div>
          );
        })}
        {errores.metodo && <p role="alert" id="metodo-error" className="text-danger">{errores.metodo}</p>}
      </fieldset>
      {valores.metodo === metodosPago[0] && (
        <fieldset>
          <legend className="h5">Tarjeta ficticia</legend>
          <CampoFormulario etiqueta="Número de tarjeta" identificador="pago-numero" nombre="numeroTarjeta" valor={valores.numeroTarjeta} error={errores.numeroTarjeta} alCambiar={cambiarTarjeta} alSalir={validarCampo} modoEntrada="numeric" longitudMaxima={19} autocompletar="off" />
          <CampoFormulario etiqueta="Vencimiento (MM/AA)" identificador="pago-vencimiento" nombre="vencimiento" valor={valores.vencimiento} error={errores.vencimiento} alCambiar={cambiarTarjeta} alSalir={validarCampo} modoEntrada="numeric" longitudMaxima={5} autocompletar="off" />
          <CampoFormulario etiqueta="CVV" identificador="pago-cvv" nombre="cvv" tipo="password" valor={valores.cvv} error={errores.cvv} alCambiar={cambiarTarjeta} alSalir={validarCampo} modoEntrada="numeric" longitudMaxima={4} autocompletar="off" />
        </fieldset>
      )}
      <div className="d-flex flex-wrap gap-3">
        <Link className="btn btn-outline-danger" to="/carrito">Cancelar pago y volver al carrito</Link>
        <Boton tipo="submit" deshabilitado={confirmando}>Confirmar pago piloto</Boton>
      </div>
    </form>
  );
}
