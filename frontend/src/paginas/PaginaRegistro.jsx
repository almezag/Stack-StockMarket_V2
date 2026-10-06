import FormularioRegistro from '../componentes/organismos/FormularioRegistro.jsx';

export default function PaginaRegistro() {
  return (
    <section className="col-lg-7 mx-auto" aria-labelledby="titulo-registro">
      <h1 id="titulo-registro">Crear una cuenta</h1>
      <p>Registro local de clientes para esta demostración académica.</p>
      <FormularioRegistro />
    </section>
  );
}
