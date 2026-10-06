export default function MensajeError({ identificador, mensaje }) {
  if (!mensaje) {
    return null;
  }
  return <p id={identificador} className="text-danger mt-1 mb-0" role="alert">{mensaje}</p>;
}
