import { createContext, useEffect, useRef, useState } from 'react';
import { crearUsuariosDemostracion } from '../datos/usuariosDemostracion.js';
import { crearCredencial, comprobarContrasena } from '../servicios/seguridadContrasenas.js';
import { claveUsuarios, claveSesion, leerDatos, guardarDatos, sanearUsuarios, sanearSesion } from '../servicios/almacenamientoLocal.js';
import { normalizarCorreo, validarRegistro, validarInicioSesion } from '../utilidades/validarFormularios.js';

import { validarUsuarioAdministrativo, validarCambioAdministrador } from '../utilidades/validarAdministracion.js';

export const ContextoUsuarios = createContext(null);

export function ProveedorUsuarios({ children }) {
  const [usuarios, establecerUsuarios] = useState([]);
  const [sesion, establecerSesion] = useState(null);
  const [listo, establecerListo] = useState(false);
  const [errorInicializacion, establecerErrorInicializacion] = useState('');
  const [persistenciaDisponible, establecerPersistenciaDisponible] = useState(true);
  const operacionEnCurso = useRef(false);
  const usuariosActuales = useRef([]);
  const sesionActual = useRef(null);

  function persistir(clave, datos) {
    if (!guardarDatos(clave, datos)) {
      establecerPersistenciaDisponible(false);
    }
  }

  useEffect(function cargarCuentasLocales() {
    let cancelado = false;
    async function inicializar() {
      if (cancelado) {
        return;
      }
      try {
        let usuariosGuardados = sanearUsuarios(leerDatos(claveUsuarios, null));
        if (usuariosGuardados === null) {
          usuariosGuardados = await crearUsuariosDemostracion();
        }
        if (cancelado) {
          return;
        }
        const sesionGuardada = sanearSesion(leerDatos(claveSesion, null), usuariosGuardados);
        usuariosActuales.current = usuariosGuardados;
        establecerUsuarios(usuariosGuardados);
        sesionActual.current = sesionGuardada;
        establecerSesion(sesionGuardada);
        persistir(claveUsuarios, usuariosGuardados);
        persistir(claveSesion, sesionGuardada);
        establecerListo(true);
      } catch {
        if (!cancelado) {
          establecerErrorInicializacion('No se pudieron preparar las cuentas. Necesitas WebCrypto en localhost o HTTPS. Recarga para reintentar.');
        }
      }
    }
    // La preparación asíncrona de cuentas no bloquea el primer render del catálogo.
    Promise.resolve().then(inicializar);
    return function cancelarInicializacion() {
      cancelado = true;
    };
  }, []);

  async function registrarUsuario(valores) {
    if (!listo || operacionEnCurso.current) {
      throw new Error('Espera a que termine la operación actual.');
    }
    if (Object.keys(validarRegistro(valores)).length > 0) {
      throw new Error('Revisa los campos del registro.');
    }
    const correo = normalizarCorreo(valores.correo);
    const existente = usuariosActuales.current.find(function buscarCorreo(usuario) {
      return usuario.correo === correo;
    });
    if (existente) {
      throw new Error('Ya existe una cuenta con ese correo.');
    }
    operacionEnCurso.current = true;
    try {
      const credencial = await crearCredencial(valores.contrasena);
      const usuario = {
        id: window.crypto.randomUUID(), nombre: valores.nombre.trim(), correo,
        rut: valores.rut.trim(), telefono: valores.telefono.trim(), comuna: valores.comuna,
        rol: 'cliente', credencial
      };
      const nuevosUsuarios = [...usuariosActuales.current, usuario];
      usuariosActuales.current = nuevosUsuarios;
      establecerUsuarios(nuevosUsuarios);
      persistir(claveUsuarios, nuevosUsuarios);
      return usuario;
    } finally {
      operacionEnCurso.current = false;
    }
  }

  async function iniciarSesion(valores, rolEsperado = 'cliente') {
    if (!listo || operacionEnCurso.current) {
      throw new Error('Espera a que termine la operación actual.');
    }
    if (Object.keys(validarInicioSesion(valores)).length > 0) {
      throw new Error('Revisa los campos de inicio de sesión.');
    }
    operacionEnCurso.current = true;
    try {
      const usuario = usuariosActuales.current.find(function buscarCorreo(candidato) {
        return candidato.correo === normalizarCorreo(valores.correo);
      });
      if (!usuario || !await comprobarContrasena(valores.contrasena, usuario.credencial)) {
        throw new Error('Correo o contraseña incorrectos.');
      }
      if (!['cliente', 'administrador'].includes(rolEsperado)) {
        throw new Error('El tipo de acceso no es válido.');
      }
      if (usuario.rol !== rolEsperado) {
        if (rolEsperado === 'cliente') {
          throw new Error('Esta cuenta es administrativa. Ingresa desde el acceso administrativo.');
        }
        throw new Error('Esta cuenta es de cliente. No tiene acceso administrativo.');
      }
      const nuevaSesion = { usuarioId: usuario.id };
      sesionActual.current = nuevaSesion;
      establecerSesion(nuevaSesion);
      persistir(claveSesion, nuevaSesion);
    } finally {
      operacionEnCurso.current = false;
    }
  }

  function cerrarSesion() {
    sesionActual.current = null;
    establecerSesion(null);
    persistir(claveSesion, null);
  }

  function exigirAdministrador() {
    const administrador = usuariosActuales.current.find(function buscarAdministrador(usuario) {
      return usuario.id === sesionActual.current?.usuarioId;
    });
    if (!listo || administrador?.rol !== 'administrador') {
      throw new Error('Solo un administrador puede modificar estos datos.');
    }
    if (operacionEnCurso.current) {
      throw new Error('Espera a que termine la operación actual.');
    }
    return administrador;
  }

  async function guardarUsuario(valores, identificador = null) {
    const administrador = exigirAdministrador();
    const errores = validarUsuarioAdministrativo(valores, usuariosActuales.current, identificador);
    if (Object.keys(errores).length > 0) {
      throw new Error(Object.values(errores)[0]);
    }
    const existente = usuariosActuales.current.find(function buscarExistente(usuario) {
      return usuario.id === identificador;
    });
    if (identificador) {
      const errorCambio = validarCambioAdministrador(usuariosActuales.current, administrador, existente, valores.rol);
      if (errorCambio) {
        throw new Error(errorCambio);
      }
    }
    operacionEnCurso.current = true;
    try {
      let credencial = existente?.credencial;
      if (valores.contrasena) {
        credencial = await crearCredencial(valores.contrasena);
      }
      // El cierre de sesión durante PBKDF2 cancela la autorización antes de modificar cuentas.
      const autorizado = usuariosActuales.current.find(function comprobarAutorizacion(usuario) {
        return usuario.id === sesionActual.current?.usuarioId && usuario.rol === 'administrador';
      });
      if (!autorizado) {
        throw new Error('Solo un administrador puede modificar estos datos.');
      }
      const usuarioGuardado = {
        id: identificador ?? window.crypto.randomUUID(), nombre: valores.nombre.trim(),
        correo: normalizarCorreo(valores.correo), rol: valores.rol, credencial,
        rut: existente?.rut ?? '', telefono: existente?.telefono ?? '', comuna: existente?.comuna ?? ''
      };
      let nuevosUsuarios;
      if (identificador) {
        nuevosUsuarios = usuariosActuales.current.map(function reemplazarUsuario(usuario) {
          if (usuario.id === identificador) {
            return usuarioGuardado;
          }
          return usuario;
        });
      } else {
        nuevosUsuarios = [...usuariosActuales.current, usuarioGuardado];
      }
      usuariosActuales.current = nuevosUsuarios;
      establecerUsuarios(nuevosUsuarios);
      persistir(claveUsuarios, nuevosUsuarios);
      return usuarioGuardado;
    } finally {
      operacionEnCurso.current = false;
    }
  }

  function eliminarUsuario(identificador) {
    const administrador = exigirAdministrador();
    const objetivo = usuariosActuales.current.find(function buscarObjetivo(usuario) {
      return usuario.id === identificador;
    });
    const errorCambio = validarCambioAdministrador(usuariosActuales.current, administrador, objetivo, null, true);
    if (errorCambio) {
      throw new Error(errorCambio);
    }
    const nuevosUsuarios = usuariosActuales.current.filter(function conservarUsuario(usuario) {
      return usuario.id !== identificador;
    });
    usuariosActuales.current = nuevosUsuarios;
    establecerUsuarios(nuevosUsuarios);
    persistir(claveUsuarios, nuevosUsuarios);
  }

  const usuarioActual = usuarios.find(function buscarUsuarioActual(usuario) {
    return usuario.id === sesion?.usuarioId;
  }) ?? null;

  return (
    <ContextoUsuarios.Provider value={{
      usuarios, usuarioActual, listo, errorInicializacion, persistenciaDisponible,
      registrarUsuario, iniciarSesion, cerrarSesion, guardarUsuario, eliminarUsuario, exigirAdministrador
    }}>
      {children}
    </ContextoUsuarios.Provider>
  );
}
