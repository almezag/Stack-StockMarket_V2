import FormularioInicioSesion from '../componentes/organismos/FormularioInicioSesion.jsx';

export default function PaginaInicioSesion() {
  return (
    <section className="col-lg-5 mx-auto" aria-labelledby="titulo-login">
      <h1 id="titulo-login">Ingresa a tu cuenta</h1>
      <p>Acceso local de clientes. No es autenticación de servidor.</p>
      <FormularioInicioSesion />
    </section>
  );
}
