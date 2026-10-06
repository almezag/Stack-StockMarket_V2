import { useContext } from 'react';
import { ContextoCarrito } from '../contextos/ContextoCarrito.jsx';

export function useCarrito() {
  return useContext(ContextoCarrito);
}
