import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsuarios } from '../../hooks/useUsuarios.js';
import { validarInicioSesion } from '../../utilidades/validarFormularios.js';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import Boton from '../atomos/Boton.jsx';
import MensajeError from '../atomos/MensajeError.jsx';

export default function FormularioInicioSesion({ rolEsperado = 'cliente' }) {
  const { iniciarSesion, usuarioActual, listo, errorInicializacion } = useUsuarios();
  const [valores, establecerValores] = useState({ correo: '', contrasena: '' });
  const [errores, establecerErrores] = useState({});
  const [enviando, establecerEnviando] = useState(false);
  const [mensajeError, establecerMensajeError] = useState('');

  function cambiarCampo(evento) {
    const nuevosValores = { ...valores, [evento.target.name]: evento.target.value };
    establecerValores(nuevosValores);
    establecerMensajeError('');
    if (Object.keys(errores).length > 0) {
      establecerErrores(validarInicioSesion(nuevosValores));
    }
  }

  function comprobarCampo(evento) {
    const nombre = evento.target.name;
    const erroresActuales = validarInicioSesion(valores);
    establecerErrores(function actualizarError(anteriores) {
      return { ...anteriores, [nombre]: erroresActuales[nombre] };
    });
  }

  async function enviarInicioSesion(evento) {
    evento.preventDefault();
    if (enviando) {
      return;
    }
    const erroresActuales = validarInicioSesion(valores);
    establecerErrores(erroresActuales);
    establecerMensajeError('');
    if (Object.keys(erroresActuales).length > 0) {
      return;
    }
    establecerEnviando(true);
    try {
      await iniciarSesion(valores, rolEsperado);
      establecerValores({ correo: '', contrasena: '' });
    } catch (error) {
      const erroresConocidos = [
        'Correo o contraseña incorrectos.',
        'Esta cuenta es administrativa. Ingresa desde el acceso administrativo.',
        'Esta cuenta es de cliente. No tiene acceso administrativo.'
      ];
      if (erroresConocidos.includes(error.message)) {
        establecerMensajeError(error.message);
      } else {
        establecerMensajeError('No se pudo iniciar sesión. Intenta nuevamente en localhost o HTTPS.');
      }
    } finally {
      establecerEnviando(false);
    }
  }

  if (usuarioActual) {
    if (usuarioActual.rol === 'administrador') {
      return <p role="status">Sesión administrativa iniciada. <Link to="/panel-administracion">Abrir panel administrativo</Link></p>;
    }
    return <p role="status">Sesión de cliente iniciada. Puedes seguir explorando el catálogo. Cierra sesión para utilizar otra cuenta.</p>;
  }

  return (
    <form noValidate onSubmit={enviarInicioSesion} aria-label={`Inicio de sesión de ${rolEsperado}`} aria-busy={enviando}>
      <p>La contraseña debe tener entre 8 y 64 caracteres.</p>
      {!listo && !errorInicializacion && <p role="status">Preparando cuentas locales…</p>}
      <MensajeError identificador="error-inicializacion-login" mensaje={errorInicializacion} />
      <MensajeError identificador="error-login" mensaje={mensajeError} />
      <CampoFormulario etiqueta="Correo electrónico" identificador="login-correo" nombre="correo"
        tipo="email" autocompletar="email" valor={valores.correo} error={errores.correo}
        alCambiar={cambiarCampo} alSalir={comprobarCampo} deshabilitado={enviando} />
      <CampoFormulario etiqueta="Contraseña" identificador="login-contrasena" nombre="contrasena"
        tipo="password" autocompletar="current-password" valor={valores.contrasena} error={errores.contrasena}
        alCambiar={cambiarCampo} alSalir={comprobarCampo} deshabilitado={enviando} />
      <Boton tipo="submit" deshabilitado={enviando || !listo}>
        {enviando ? 'Ingresando…' : 'Ingresar'}
      </Boton>
      {rolEsperado === 'cliente' && <p className="mt-3">¿Aún no tienes cuenta? <Link to="/registro">Crear una cuenta</Link></p>}
    </form>
  );
}
