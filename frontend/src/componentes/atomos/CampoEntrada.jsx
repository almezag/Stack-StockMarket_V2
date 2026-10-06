export default function CampoEntrada({ identificador, nombre, tipo = 'text', valor, alCambiar, alSalir, error, autocompletar, lista, deshabilitado = false, longitudMaxima, modoEntrada, multilinea = false, children }) {
  const propiedades = {
    id: identificador, name: nombre, value: valor, onChange: alCambiar,
    onBlur: alSalir, autoComplete: autocompletar, disabled: deshabilitado,
    'aria-invalid': Boolean(error), 'aria-describedby': error ? `${identificador}-error` : undefined
  };
  if (children) {
    return <select {...propiedades} className={`form-select ${error ? 'is-invalid' : ''}`}>{children}</select>;
  }
  if (multilinea) {
    return <textarea {...propiedades} rows={5} maxLength={longitudMaxima} className={`form-control ${error ? 'is-invalid' : ''}`} />;
  }
  return (
    <input {...propiedades} type={tipo} list={lista} maxLength={longitudMaxima}
      inputMode={modoEntrada} className={`form-control ${error ? 'is-invalid' : ''}`} />
  );
}
