import { useRef, useState } from 'react';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import Boton from '../atomos/Boton.jsx';
import { validarUsuarioAdministrativo } from '../../utilidades/validarAdministracion.js';

export default function FormularioUsuario({ usuario, usuarios, alGuardar, alCancelar }) {
  const [valores, establecerValores] = useState({
    nombre: usuario?.nombre ?? '', correo: usuario?.correo ?? '', rol: usuario?.rol ?? 'cliente', contrasena: ''
  });
  const [errores, establecerErrores] = useState({});
  const [mensajeError, establecerMensajeError] = useState('');
  const [enviando, establecerEnviando] = useState(false);
  const envioEnCurso = useRef(false);
  function cambiarCampo(evento) {
    const nuevosValores = { ...valores, [evento.target.name]: evento.target.value };
    establecerValores(nuevosValores);
    establecerMensajeError('');
    if (Object.keys(errores).length > 0) {
      establecerErrores(validarUsuarioAdministrativo(nuevosValores, usuarios, usuario?.id));
    }
  }
  async function guardarFormulario(evento) {
    evento.preventDefault();
    if (envioEnCurso.current) {
      return;
    }
    const erroresActuales = validarUsuarioAdministrativo(valores, usuarios, usuario?.id);
    establecerErrores(erroresActuales);
    establecerMensajeError('');
    if (Object.keys(erroresActuales).length > 0) {
      return;
    }
    envioEnCurso.current = true;
    establecerEnviando(true);
    try {
      await alGuardar(valores, usuario?.id ?? null);
    } catch (error) {
      if (error instanceof Error && /administrador|cuenta|correo|usuario|operación/i.test(error.message)) {
        establecerMensajeError(error.message);
      } else {
        establecerMensajeError('No se pudo guardar el usuario. Intenta nuevamente en localhost o HTTPS.');
      }
    } finally {
      envioEnCurso.current = false;
      establecerEnviando(false);
    }
  }
  return (
    <form onSubmit={guardarFormulario} noValidate aria-label="Formulario de usuario" aria-busy={enviando} className="border rounded p-3 mb-4">
      <h3>{usuario ? 'Editar usuario' : 'Nuevo usuario'}</h3>
      <p>Contraseña de 8–64 caracteres; al editar, deja el campo vacío para conservarla.</p>
      {mensajeError && <p role="alert">{mensajeError}</p>}
      <CampoFormulario etiqueta="Nombre completo" identificador="usuario-nombre" nombre="nombre" valor={valores.nombre} error={errores.nombre} alCambiar={cambiarCampo} deshabilitado={enviando} />
      <CampoFormulario etiqueta="Correo electrónico" identificador="usuario-correo" nombre="correo" tipo="email" valor={valores.correo} error={errores.correo} alCambiar={cambiarCampo} deshabilitado={enviando} />
      <CampoFormulario etiqueta="Rol" identificador="usuario-rol" nombre="rol" tipo="select" valor={valores.rol} error={errores.rol} alCambiar={cambiarCampo} deshabilitado={enviando}>
        <option value="cliente">Cliente</option>
        <option value="administrador">Administrador</option>
      </CampoFormulario>
      <CampoFormulario etiqueta="Contraseña" identificador="usuario-contrasena" nombre="contrasena" tipo="password" autocompletar="new-password" valor={valores.contrasena} error={errores.contrasena} alCambiar={cambiarCampo} deshabilitado={enviando} />
      <div className="d-flex gap-2">
        <Boton tipo="submit" deshabilitado={enviando}>{enviando ? 'Guardando usuario…' : 'Guardar usuario'}</Boton>
        <Boton clase="btn btn-secondary" alPresionar={alCancelar} deshabilitado={enviando}>Cancelar</Boton>
      </div>
    </form>
  );
}
