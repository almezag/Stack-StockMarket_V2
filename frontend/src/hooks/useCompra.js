import { useContext } from 'react';
import { ContextoCompra } from '../contextos/ContextoCompra.jsx';

export function useCompra() {
  const compra = useContext(ContextoCompra);
  if (!compra) {
    throw new Error('useCompra requiere ProveedorCompra.');
  }
  return compra;
}
