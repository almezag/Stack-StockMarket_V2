export default function PaginaQuienesSomos() {
  return (
    <section>
      <h1>Quiénes Somos</h1>
      <p className="lead">Tecnología sencilla para el almacén de siempre.</p>
      <h2>Stack & Stock Market</h2>
      <p>Nace como una propuesta de comercio electrónico para un almacén de abarrotes que busca unir la venta online con la operación real de un punto de venta.</p>
      <p>En esta primera etapa el foco está en la experiencia frontend. En futuras iteraciones, productos, stock, categorías y ventas serán administrados por un backend POS.</p>
      <div className="row g-4 mt-2">
        <div className="col-md-4"><article className="card p-4 h-100"><h3 className="h5">Misión</h3><p>Facilitar compras cotidianas con una experiencia clara, cercana y moderna.</p></article></div>
        <div className="col-md-4"><article className="card p-4 h-100"><h3 className="h5">Visión</h3><p>Integrar e-commerce e inventario POS en una sola operación.</p></article></div>
        <div className="col-md-4"><article className="card p-4 h-100"><h3 className="h5">Valores</h3><p>Confianza, simplicidad, disponibilidad y servicio.</p></article></div>
      </div>
    </section>
  );
}
