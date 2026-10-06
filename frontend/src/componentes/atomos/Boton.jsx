export default function Boton({ children, alPresionar, etiquetaAccesible, clase = 'btn btn-primary', tipo = 'button', deshabilitado = false, presionado }) {
  return (
    <button type={tipo} disabled={deshabilitado} className={clase} onClick={alPresionar} aria-label={etiquetaAccesible} aria-pressed={presionado}>
      {children}
    </button>
  );
}
