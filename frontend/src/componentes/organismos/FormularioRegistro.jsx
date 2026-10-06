import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsuarios } from '../../hooks/useUsuarios.js';
import { comunas } from '../../datos/comunas.js';
import { validarRegistro } from '../../utilidades/validarFormularios.js';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import Boton from '../atomos/Boton.jsx';
import MensajeError from '../atomos/MensajeError.jsx';

const valoresIniciales = {
  nombre: '', rut: '', correo: '', telefono: '', comuna: '', contrasena: '', confirmacion: ''
};
const camposRegistro = [
  { nombre: 'nombre', etiqueta: 'Nombre completo', autocompletar: 'name' },
  { nombre: 'rut', etiqueta: 'RUT', autocompletar: 'off' },
  { nombre: 'correo', etiqueta: 'Correo electrónico', tipo: 'email', autocompletar: 'email' },
  { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', autocompletar: 'tel' },
  { nombre: 'comuna', etiqueta: 'Comuna', autocompletar: 'address-level2', lista: 'comunas-registro' },
  { nombre: 'contrasena', etiqueta: 'Contraseña', tipo: 'password', autocompletar: 'new-password' },
  { nombre: 'confirmacion', etiqueta: 'Confirmar contraseña', tipo: 'password', autocompletar: 'new-password' }
];

export default function FormularioRegistro() {
  const { registrarUsuario, listo, errorInicializacion } = useUsuarios();
  const [valores, establecerValores] = useState(valoresIniciales);
  const [errores, establecerErrores] = useState({});
  const [enviando, establecerEnviando] = useState(false);
  const [mensajeError, establecerMensajeError] = useState('');
  const [cuentaCreada, establecerCuentaCreada] = useState(false);

  function cambiarCampo(evento) {
    const nuevosValores = { ...valores, [evento.target.name]: evento.target.value };
    establecerValores(nuevosValores);
    establecerCuentaCreada(false);
    establecerMensajeError('');
    // Después de un error, la corrección se comprueba mientras se escribe.
    if (Object.keys(errores).length > 0) {
      establecerErrores(validarRegistro(nuevosValores));
    }
  }

  function comprobarCampo(evento) {
    const nombre = evento.target.name;
    const erroresActuales = validarRegistro(valores);
    establecerErrores(function actualizarError(anteriores) {
      return { ...anteriores, [nombre]: erroresActuales[nombre] };
    });
  }

  async function enviarRegistro(evento) {
    evento.preventDefault();
    if (enviando) {
      return;
    }
    const erroresActuales = validarRegistro(valores);
    establecerErrores(erroresActuales);
    establecerMensajeError('');
    establecerCuentaCreada(false);
    if (Object.keys(erroresActuales).length > 0) {
      return;
    }
    establecerEnviando(true);
    try {
      await registrarUsuario(valores);
      establecerCuentaCreada(true);
      establecerValores(valoresIniciales);
    } catch (error) {
      let mensaje = 'No se pudo crear la cuenta. Intenta nuevamente en localhost o HTTPS.';
      if (error.message === 'Ya existe una cuenta con ese correo.') {
        mensaje = error.message;
        establecerErrores({ correo: mensaje });
      }
      establecerMensajeError(mensaje);
    } finally {
      establecerEnviando(false);
    }
  }

  return (
    <form noValidate onSubmit={enviarRegistro} aria-label="Registro de cliente" aria-busy={enviando}>
      <p>La contraseña debe tener entre 8 y 64 caracteres. No uses datos personales reales.</p>
      {!listo && !errorInicializacion && <p role="status">Preparando cuentas locales…</p>}
      <MensajeError identificador="error-inicializacion-registro" mensaje={errorInicializacion} />
      <MensajeError identificador="error-registro" mensaje={mensajeError} />
      {cuentaCreada && (
        <div role="status" className="alert alert-success">
          Cuenta creada. Puedes ingresar con tu correo y contraseña. <Link to="/login">Iniciar sesión ahora</Link>
        </div>
      )}
      {camposRegistro.map(function presentarCampo(campo) {
        return (
          <CampoFormulario key={campo.nombre} {...campo} identificador={`registro-${campo.nombre}`}
            valor={valores[campo.nombre]} error={errores[campo.nombre]}
            alCambiar={cambiarCampo} alSalir={comprobarCampo} deshabilitado={enviando} />
        );
      })}
      <datalist id="comunas-registro">
        {comunas.map(function presentarComuna(comuna) {
          return <option key={comuna} value={comuna} />;
        })}
      </datalist>
      <Boton tipo="submit" deshabilitado={enviando || !listo}>
        {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
      </Boton>
      <p className="mt-3">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
    </form>
  );
}
