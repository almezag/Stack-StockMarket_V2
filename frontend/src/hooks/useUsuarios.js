import { useContext } from 'react';
import { ContextoUsuarios } from '../contextos/ContextoUsuarios.jsx';

export function useUsuarios() {
  const contexto = useContext(ContextoUsuarios);
  if (!contexto) {
    throw new Error('useUsuarios debe usarse dentro de ProveedorUsuarios.');
  }
  return contexto;
}
