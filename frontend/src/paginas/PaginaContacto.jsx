import FormularioContacto from '../componentes/organismos/FormularioContacto.jsx';

export default function PaginaContacto() {
  return (
    <section>
      <h1>Contacto</h1>
      <p className="lead">¿Tienes una consulta? Escríbenos.</p>
      <div className="row g-4">
        <div className="col-lg-5">
          <h2 className="h4">Hablemos</h2>
          <p>Santiago, Chile</p>
          <img className="img-fluid rounded mapa-tienda" src="/imagenes/mapa.jpg" alt="Mapa de ubicación de la tienda en Santiago, Chile" />
          <p className="mt-3">Atención: Lun–Sáb 09:00 a 20:00</p>
          <p>contacto@stackstockmarket.cl</p>
        </div>
        <div className="col-lg-7"><FormularioContacto /></div>
      </div>
    </section>
  );
}
