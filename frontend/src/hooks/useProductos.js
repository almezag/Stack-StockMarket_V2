import { useContext } from 'react';
import { ContextoProductos } from '../contextos/ContextoProductos.jsx';

export function useProductos() {
  return useContext(ContextoProductos);
}
