import CampoEntrada from '../atomos/CampoEntrada.jsx';
import MensajeError from '../atomos/MensajeError.jsx';

export default function CampoFormulario({ etiqueta, identificador, error, ...propiedadesEntrada }) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={identificador}>{etiqueta}</label>
      <CampoEntrada identificador={identificador} error={error} {...propiedadesEntrada} />
      <MensajeError identificador={`${identificador}-error`} mensaje={error} />
    </div>
  );
}
