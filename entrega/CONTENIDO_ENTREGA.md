# Entrega solo React — Stock & Stock Market

**Paquete creado:** `entrega/Stock-Stock-Market-Evaluacion-2.zip`.
Extraiga `Stock-Stock-Market-Evaluacion-2/` y lea `LEEME_EVALUACION_2.md`.
La única aplicación es React en `frontend/`; no se incluye la versión antigua.
Integrantes y GitHub público siguen pendientes; publicar no está autorizado.

## Integridad comprobada por el escritor

| Dato | Resultado |
| --- | --- |
| Prefijo único | `Stock-Stock-Market-Evaluacion-2/` |
| Archivos | 163 |
| Tamaño ZIP | 814915 bytes |
| SHA256 | `e1f07b69a9f6ab2e5ecf9c901c0e589e6dc9012be7331f923e5e6d46756145ef` |
| CRC `ZipFile.testzip()` | `None` |
| Inventario positivo | Exacto, sin miembros adicionales ni duplicados |
| Igualdad con disco | Los 163 miembros coinciden byte a byte con su origen |
| Rutas | Sin absolutas, `..`, symlinks ni metadatos prohibidos |
| Aplicación intacta | 78 archivos protegidos con snapshot idéntico antes/después |
| Evidencia intacta | 76 archivos del informe y tres PNG sin cambios |

Estos controles se realizaron con Python estándar, sin extracción a disco ni
instalación/ejecución de la aplicación extraída. La **verificación independiente
del ZIP queda pendiente**. Este inventario y el ZIP quedan fuera del propio
paquete, evitando hash circular. No se atribuye causa a la ausencia del ZIP previo;
los 211 miembros y su hash antiguo son históricos, no metadatos de esta entrega.

## Lista positiva y distribución

- **84 archivos de proyecto/documentación:** README y LEEME raíz;
  frontend `src/`, `pruebas/`, `public/`, `documentacion/`; y exactamente
  `.gitignore`, `README.md`, `index.html`, `package.json`, `package-lock.json`,
  `vite.config.js`, `karma.conf.cjs` de la raíz de frontend.
- **76 archivos de informe:** ocho archivos positivos de `frontend/coverage/`
  (index.html, base.css, block-navigation.js, favicon.png, prettify.css,
  prettify.js, sort-arrow-sprite.png, sorter.js) y los HTML de `coverage/src/`,
  mapeados a `evidencias/cobertura/`.
- **Tres PNG actuales:** `frontend/coverage/visual/` mapeados a
  `evidencias/capturas/`: inicio-movil 390×844, catalogo-escritorio 1366×900,
  contacto-tablet 768×1024.

Excluidos: HTML/assets/ESTRUCTURA antiguos, `.git/`, `.atl/`, `.pi/`, arnés,
ODD, gitignore raíz, node_modules, dist, cobertura en el segmento fuente,
temporales/logs, commons.js, runtime.js, configuracion.*.js y *.spec.*.js
**generados por Karma**. Las pruebas fuente de `frontend/pruebas/` sí se incluyen.
Los JS positivos de Istanbul permiten leer/ordenar el informe y no son bundles.
No se compactaron fuentes ni se generó PDF.

## Ejecutar después de extraer

Necesita Node 24 y npm 11; la instalación inicial requiere acceso a npm.
Google Chrome es necesario para Jasmine/Karma. Desde la carpeta extraída:

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

Abra la URL de Vite, no un HTML con doble clic. Para reproducir en Linux:

```bash
CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend test -- --single-run
CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend run test:coverage
npm --prefix frontend run build
```

El informe estático se abre en `evidencias/cobertura/index.html`; no ejecuta la
 tienda. Consulte frontend/README.md para preview, cuentas demo y PowerShell.

## Evidencia independiente previa al empaquetado

Tras la limpieza: test y cobertura **124/124**, 57 módulos fuente importados,
build **88 módulos**, salida 0; 162 imports y 23 enlaces Markdown comprobados.
La instalación desde lockfile de **422 paquetes** corresponde a una comprobación
anterior a la limpieza, no repetida al empaquetar. No se repitió npm en L4.

| Métrica | Cubierto / total | Porcentaje |
| --- | --- | --- |
| Sentencias | 913 / 956 | 95,50% |
| Ramas | 598 / 635 | 94,17% |
| Funciones | 210 / 213 | 98,59% |
| Líneas | 910 / 952 | 95,58% |

Las tres capturas actuales fueron renovadas e inspeccionadas; muestran solo sus
viewports. Inicio ya no anuncia conservación, catálogo tiene 18 productos,
mapa histórico borroso y formulario de contacto fuera del recorte. `/`,
`/catalogo` y `/contacto` dieron HTTP 200 solo en preview local. Windows,
teclado/contraste, resto de vistas y despliegue externo siguen pendientes.
No se afirma auditoría completa, aprobación nativa ni reproducción independiente
del RED histórico. Nombres y URL pública deben completarse por el equipo;
el pendrive y ZIP no reemplazan GitHub ni cumplen toda la pauta.

## Miembros completos y origen en disco

El prefijo de todos los miembros es `Stock-Stock-Market-Evaluacion-2/`.

| Miembro relativo al prefijo | Origen relativo al proyecto |
| --- | --- |
| `LEEME_EVALUACION_2.md` | `LEEME_EVALUACION_2.md` |
| `README.md` | `README.md` |
| `evidencias/capturas/catalogo-escritorio.png` | `frontend/coverage/visual/catalogo-escritorio.png` |
| `evidencias/capturas/contacto-tablet.png` | `frontend/coverage/visual/contacto-tablet.png` |
| `evidencias/capturas/inicio-movil.png` | `frontend/coverage/visual/inicio-movil.png` |
| `evidencias/cobertura/base.css` | `frontend/coverage/base.css` |
| `evidencias/cobertura/block-navigation.js` | `frontend/coverage/block-navigation.js` |
| `evidencias/cobertura/favicon.png` | `frontend/coverage/favicon.png` |
| `evidencias/cobertura/index.html` | `frontend/coverage/index.html` |
| `evidencias/cobertura/prettify.css` | `frontend/coverage/prettify.css` |
| `evidencias/cobertura/prettify.js` | `frontend/coverage/prettify.js` |
| `evidencias/cobertura/sort-arrow-sprite.png` | `frontend/coverage/sort-arrow-sprite.png` |
| `evidencias/cobertura/sorter.js` | `frontend/coverage/sorter.js` |
| `evidencias/cobertura/src/Aplicacion.jsx.html` | `frontend/coverage/src/Aplicacion.jsx.html` |
| `evidencias/cobertura/src/componentes/atomos/Boton.jsx.html` | `frontend/coverage/src/componentes/atomos/Boton.jsx.html` |
| `evidencias/cobertura/src/componentes/atomos/CampoEntrada.jsx.html` | `frontend/coverage/src/componentes/atomos/CampoEntrada.jsx.html` |
| `evidencias/cobertura/src/componentes/atomos/MensajeError.jsx.html` | `frontend/coverage/src/componentes/atomos/MensajeError.jsx.html` |
| `evidencias/cobertura/src/componentes/atomos/index.html` | `frontend/coverage/src/componentes/atomos/index.html` |
| `evidencias/cobertura/src/componentes/moleculas/CampoFormulario.jsx.html` | `frontend/coverage/src/componentes/moleculas/CampoFormulario.jsx.html` |
| `evidencias/cobertura/src/componentes/moleculas/FilaCarrito.jsx.html` | `frontend/coverage/src/componentes/moleculas/FilaCarrito.jsx.html` |
| `evidencias/cobertura/src/componentes/moleculas/FiltrosCatalogo.jsx.html` | `frontend/coverage/src/componentes/moleculas/FiltrosCatalogo.jsx.html` |
| `evidencias/cobertura/src/componentes/moleculas/TarjetaProducto.jsx.html` | `frontend/coverage/src/componentes/moleculas/TarjetaProducto.jsx.html` |
| `evidencias/cobertura/src/componentes/moleculas/index.html` | `frontend/coverage/src/componentes/moleculas/index.html` |
| `evidencias/cobertura/src/componentes/organismos/BarraNavegacion.jsx.html` | `frontend/coverage/src/componentes/organismos/BarraNavegacion.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/FormularioCheckout.jsx.html` | `frontend/coverage/src/componentes/organismos/FormularioCheckout.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/FormularioContacto.jsx.html` | `frontend/coverage/src/componentes/organismos/FormularioContacto.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/FormularioInicioSesion.jsx.html` | `frontend/coverage/src/componentes/organismos/FormularioInicioSesion.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/FormularioPago.jsx.html` | `frontend/coverage/src/componentes/organismos/FormularioPago.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/FormularioProducto.jsx.html` | `frontend/coverage/src/componentes/organismos/FormularioProducto.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/FormularioRegistro.jsx.html` | `frontend/coverage/src/componentes/organismos/FormularioRegistro.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/FormularioUsuario.jsx.html` | `frontend/coverage/src/componentes/organismos/FormularioUsuario.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/ListaProductos.jsx.html` | `frontend/coverage/src/componentes/organismos/ListaProductos.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/PiePagina.jsx.html` | `frontend/coverage/src/componentes/organismos/PiePagina.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/ResumenAdministracion.jsx.html` | `frontend/coverage/src/componentes/organismos/ResumenAdministracion.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/ResumenCompra.jsx.html` | `frontend/coverage/src/componentes/organismos/ResumenCompra.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/TablaProductos.jsx.html` | `frontend/coverage/src/componentes/organismos/TablaProductos.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/TablaUsuarios.jsx.html` | `frontend/coverage/src/componentes/organismos/TablaUsuarios.jsx.html` |
| `evidencias/cobertura/src/componentes/organismos/index.html` | `frontend/coverage/src/componentes/organismos/index.html` |
| `evidencias/cobertura/src/componentes/plantillas/PlantillaAdministracion.jsx.html` | `frontend/coverage/src/componentes/plantillas/PlantillaAdministracion.jsx.html` |
| `evidencias/cobertura/src/componentes/plantillas/PlantillaTienda.jsx.html` | `frontend/coverage/src/componentes/plantillas/PlantillaTienda.jsx.html` |
| `evidencias/cobertura/src/componentes/plantillas/RutaAdministracion.jsx.html` | `frontend/coverage/src/componentes/plantillas/RutaAdministracion.jsx.html` |
| `evidencias/cobertura/src/componentes/plantillas/index.html` | `frontend/coverage/src/componentes/plantillas/index.html` |
| `evidencias/cobertura/src/contextos/ContextoCarrito.jsx.html` | `frontend/coverage/src/contextos/ContextoCarrito.jsx.html` |
| `evidencias/cobertura/src/contextos/ContextoCompra.jsx.html` | `frontend/coverage/src/contextos/ContextoCompra.jsx.html` |
| `evidencias/cobertura/src/contextos/ContextoProductos.jsx.html` | `frontend/coverage/src/contextos/ContextoProductos.jsx.html` |
| `evidencias/cobertura/src/contextos/ContextoUsuarios.jsx.html` | `frontend/coverage/src/contextos/ContextoUsuarios.jsx.html` |
| `evidencias/cobertura/src/contextos/index.html` | `frontend/coverage/src/contextos/index.html` |
| `evidencias/cobertura/src/datos/comunas.js.html` | `frontend/coverage/src/datos/comunas.js.html` |
| `evidencias/cobertura/src/datos/index.html` | `frontend/coverage/src/datos/index.html` |
| `evidencias/cobertura/src/datos/productosIniciales.js.html` | `frontend/coverage/src/datos/productosIniciales.js.html` |
| `evidencias/cobertura/src/datos/usuariosDemostracion.js.html` | `frontend/coverage/src/datos/usuariosDemostracion.js.html` |
| `evidencias/cobertura/src/hooks/index.html` | `frontend/coverage/src/hooks/index.html` |
| `evidencias/cobertura/src/hooks/useCarrito.js.html` | `frontend/coverage/src/hooks/useCarrito.js.html` |
| `evidencias/cobertura/src/hooks/useCompra.js.html` | `frontend/coverage/src/hooks/useCompra.js.html` |
| `evidencias/cobertura/src/hooks/useProductos.js.html` | `frontend/coverage/src/hooks/useProductos.js.html` |
| `evidencias/cobertura/src/hooks/useUsuarios.js.html` | `frontend/coverage/src/hooks/useUsuarios.js.html` |
| `evidencias/cobertura/src/index.html` | `frontend/coverage/src/index.html` |
| `evidencias/cobertura/src/paginas/PaginaAccesoAdministrativo.jsx.html` | `frontend/coverage/src/paginas/PaginaAccesoAdministrativo.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaCarrito.jsx.html` | `frontend/coverage/src/paginas/PaginaCarrito.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaCatalogo.jsx.html` | `frontend/coverage/src/paginas/PaginaCatalogo.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaCheckout.jsx.html` | `frontend/coverage/src/paginas/PaginaCheckout.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaConfirmacion.jsx.html` | `frontend/coverage/src/paginas/PaginaConfirmacion.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaContacto.jsx.html` | `frontend/coverage/src/paginas/PaginaContacto.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaInicio.jsx.html` | `frontend/coverage/src/paginas/PaginaInicio.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaInicioSesion.jsx.html` | `frontend/coverage/src/paginas/PaginaInicioSesion.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaNoEncontrada.jsx.html` | `frontend/coverage/src/paginas/PaginaNoEncontrada.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaPago.jsx.html` | `frontend/coverage/src/paginas/PaginaPago.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaPanelAdministracion.jsx.html` | `frontend/coverage/src/paginas/PaginaPanelAdministracion.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaQuienesSomos.jsx.html` | `frontend/coverage/src/paginas/PaginaQuienesSomos.jsx.html` |
| `evidencias/cobertura/src/paginas/PaginaRegistro.jsx.html` | `frontend/coverage/src/paginas/PaginaRegistro.jsx.html` |
| `evidencias/cobertura/src/paginas/index.html` | `frontend/coverage/src/paginas/index.html` |
| `evidencias/cobertura/src/servicios/almacenamientoLocal.js.html` | `frontend/coverage/src/servicios/almacenamientoLocal.js.html` |
| `evidencias/cobertura/src/servicios/index.html` | `frontend/coverage/src/servicios/index.html` |
| `evidencias/cobertura/src/servicios/seguridadContrasenas.js.html` | `frontend/coverage/src/servicios/seguridadContrasenas.js.html` |
| `evidencias/cobertura/src/utilidades/calcularTotales.js.html` | `frontend/coverage/src/utilidades/calcularTotales.js.html` |
| `evidencias/cobertura/src/utilidades/formatearMoneda.js.html` | `frontend/coverage/src/utilidades/formatearMoneda.js.html` |
| `evidencias/cobertura/src/utilidades/index.html` | `frontend/coverage/src/utilidades/index.html` |
| `evidencias/cobertura/src/utilidades/validarAdministracion.js.html` | `frontend/coverage/src/utilidades/validarAdministracion.js.html` |
| `evidencias/cobertura/src/utilidades/validarCompra.js.html` | `frontend/coverage/src/utilidades/validarCompra.js.html` |
| `evidencias/cobertura/src/utilidades/validarFormularios.js.html` | `frontend/coverage/src/utilidades/validarFormularios.js.html` |
| `evidencias/cobertura/src/utilidades/validarRut.js.html` | `frontend/coverage/src/utilidades/validarRut.js.html` |
| `frontend/.gitignore` | `frontend/.gitignore` |
| `frontend/README.md` | `frontend/README.md` |
| `frontend/documentacion/COBERTURA_TESTING.md` | `frontend/documentacion/COBERTURA_TESTING.md` |
| `frontend/documentacion/ERS.md` | `frontend/documentacion/ERS.md` |
| `frontend/documentacion/GUIA_PRESENTACION.md` | `frontend/documentacion/GUIA_PRESENTACION.md` |
| `frontend/index.html` | `frontend/index.html` |
| `frontend/karma.conf.cjs` | `frontend/karma.conf.cjs` |
| `frontend/package-lock.json` | `frontend/package-lock.json` |
| `frontend/package.json` | `frontend/package.json` |
| `frontend/pruebas/Administracion.spec.jsx` | `frontend/pruebas/Administracion.spec.jsx` |
| `frontend/pruebas/Almacenamiento.spec.js` | `frontend/pruebas/Almacenamiento.spec.js` |
| `frontend/pruebas/Aplicacion.spec.jsx` | `frontend/pruebas/Aplicacion.spec.jsx` |
| `frontend/pruebas/Autenticacion.spec.jsx` | `frontend/pruebas/Autenticacion.spec.jsx` |
| `frontend/pruebas/CatalogoCarrito.spec.jsx` | `frontend/pruebas/CatalogoCarrito.spec.jsx` |
| `frontend/pruebas/CicloVida.spec.jsx` | `frontend/pruebas/CicloVida.spec.jsx` |
| `frontend/pruebas/CompraContacto.spec.jsx` | `frontend/pruebas/CompraContacto.spec.jsx` |
| `frontend/pruebas/Validaciones.spec.js` | `frontend/pruebas/Validaciones.spec.js` |
| `frontend/pruebas/ValidacionesAdministracion.spec.js` | `frontend/pruebas/ValidacionesAdministracion.spec.js` |
| `frontend/pruebas/ValidacionesCompra.spec.js` | `frontend/pruebas/ValidacionesCompra.spec.js` |
| `frontend/pruebas/configuracion.js` | `frontend/pruebas/configuracion.js` |
| `frontend/public/imagenes/logo-stack-stock.svg` | `frontend/public/imagenes/logo-stack-stock.svg` |
| `frontend/public/imagenes/mapa.jpg` | `frontend/public/imagenes/mapa.jpg` |
| `frontend/src/Aplicacion.jsx` | `frontend/src/Aplicacion.jsx` |
| `frontend/src/componentes/atomos/Boton.jsx` | `frontend/src/componentes/atomos/Boton.jsx` |
| `frontend/src/componentes/atomos/CampoEntrada.jsx` | `frontend/src/componentes/atomos/CampoEntrada.jsx` |
| `frontend/src/componentes/atomos/MensajeError.jsx` | `frontend/src/componentes/atomos/MensajeError.jsx` |
| `frontend/src/componentes/moleculas/CampoFormulario.jsx` | `frontend/src/componentes/moleculas/CampoFormulario.jsx` |
| `frontend/src/componentes/moleculas/FilaCarrito.jsx` | `frontend/src/componentes/moleculas/FilaCarrito.jsx` |
| `frontend/src/componentes/moleculas/FiltrosCatalogo.jsx` | `frontend/src/componentes/moleculas/FiltrosCatalogo.jsx` |
| `frontend/src/componentes/moleculas/TarjetaProducto.jsx` | `frontend/src/componentes/moleculas/TarjetaProducto.jsx` |
| `frontend/src/componentes/organismos/BarraNavegacion.jsx` | `frontend/src/componentes/organismos/BarraNavegacion.jsx` |
| `frontend/src/componentes/organismos/FormularioCheckout.jsx` | `frontend/src/componentes/organismos/FormularioCheckout.jsx` |
| `frontend/src/componentes/organismos/FormularioContacto.jsx` | `frontend/src/componentes/organismos/FormularioContacto.jsx` |
| `frontend/src/componentes/organismos/FormularioInicioSesion.jsx` | `frontend/src/componentes/organismos/FormularioInicioSesion.jsx` |
| `frontend/src/componentes/organismos/FormularioPago.jsx` | `frontend/src/componentes/organismos/FormularioPago.jsx` |
| `frontend/src/componentes/organismos/FormularioProducto.jsx` | `frontend/src/componentes/organismos/FormularioProducto.jsx` |
| `frontend/src/componentes/organismos/FormularioRegistro.jsx` | `frontend/src/componentes/organismos/FormularioRegistro.jsx` |
| `frontend/src/componentes/organismos/FormularioUsuario.jsx` | `frontend/src/componentes/organismos/FormularioUsuario.jsx` |
| `frontend/src/componentes/organismos/ListaProductos.jsx` | `frontend/src/componentes/organismos/ListaProductos.jsx` |
| `frontend/src/componentes/organismos/PiePagina.jsx` | `frontend/src/componentes/organismos/PiePagina.jsx` |
| `frontend/src/componentes/organismos/ResumenAdministracion.jsx` | `frontend/src/componentes/organismos/ResumenAdministracion.jsx` |
| `frontend/src/componentes/organismos/ResumenCompra.jsx` | `frontend/src/componentes/organismos/ResumenCompra.jsx` |
| `frontend/src/componentes/organismos/TablaProductos.jsx` | `frontend/src/componentes/organismos/TablaProductos.jsx` |
| `frontend/src/componentes/organismos/TablaUsuarios.jsx` | `frontend/src/componentes/organismos/TablaUsuarios.jsx` |
| `frontend/src/componentes/plantillas/PlantillaAdministracion.jsx` | `frontend/src/componentes/plantillas/PlantillaAdministracion.jsx` |
| `frontend/src/componentes/plantillas/PlantillaTienda.jsx` | `frontend/src/componentes/plantillas/PlantillaTienda.jsx` |
| `frontend/src/componentes/plantillas/RutaAdministracion.jsx` | `frontend/src/componentes/plantillas/RutaAdministracion.jsx` |
| `frontend/src/contextos/ContextoCarrito.jsx` | `frontend/src/contextos/ContextoCarrito.jsx` |
| `frontend/src/contextos/ContextoCompra.jsx` | `frontend/src/contextos/ContextoCompra.jsx` |
| `frontend/src/contextos/ContextoProductos.jsx` | `frontend/src/contextos/ContextoProductos.jsx` |
| `frontend/src/contextos/ContextoUsuarios.jsx` | `frontend/src/contextos/ContextoUsuarios.jsx` |
| `frontend/src/datos/comunas.js` | `frontend/src/datos/comunas.js` |
| `frontend/src/datos/productosIniciales.js` | `frontend/src/datos/productosIniciales.js` |
| `frontend/src/datos/usuariosDemostracion.js` | `frontend/src/datos/usuariosDemostracion.js` |
| `frontend/src/estilos/estilos.css` | `frontend/src/estilos/estilos.css` |
| `frontend/src/hooks/useCarrito.js` | `frontend/src/hooks/useCarrito.js` |
| `frontend/src/hooks/useCompra.js` | `frontend/src/hooks/useCompra.js` |
| `frontend/src/hooks/useProductos.js` | `frontend/src/hooks/useProductos.js` |
| `frontend/src/hooks/useUsuarios.js` | `frontend/src/hooks/useUsuarios.js` |
| `frontend/src/main.jsx` | `frontend/src/main.jsx` |
| `frontend/src/paginas/PaginaAccesoAdministrativo.jsx` | `frontend/src/paginas/PaginaAccesoAdministrativo.jsx` |
| `frontend/src/paginas/PaginaCarrito.jsx` | `frontend/src/paginas/PaginaCarrito.jsx` |
| `frontend/src/paginas/PaginaCatalogo.jsx` | `frontend/src/paginas/PaginaCatalogo.jsx` |
| `frontend/src/paginas/PaginaCheckout.jsx` | `frontend/src/paginas/PaginaCheckout.jsx` |
| `frontend/src/paginas/PaginaConfirmacion.jsx` | `frontend/src/paginas/PaginaConfirmacion.jsx` |
| `frontend/src/paginas/PaginaContacto.jsx` | `frontend/src/paginas/PaginaContacto.jsx` |
| `frontend/src/paginas/PaginaInicio.jsx` | `frontend/src/paginas/PaginaInicio.jsx` |
| `frontend/src/paginas/PaginaInicioSesion.jsx` | `frontend/src/paginas/PaginaInicioSesion.jsx` |
| `frontend/src/paginas/PaginaNoEncontrada.jsx` | `frontend/src/paginas/PaginaNoEncontrada.jsx` |
| `frontend/src/paginas/PaginaPago.jsx` | `frontend/src/paginas/PaginaPago.jsx` |
| `frontend/src/paginas/PaginaPanelAdministracion.jsx` | `frontend/src/paginas/PaginaPanelAdministracion.jsx` |
| `frontend/src/paginas/PaginaQuienesSomos.jsx` | `frontend/src/paginas/PaginaQuienesSomos.jsx` |
| `frontend/src/paginas/PaginaRegistro.jsx` | `frontend/src/paginas/PaginaRegistro.jsx` |
| `frontend/src/servicios/almacenamientoLocal.js` | `frontend/src/servicios/almacenamientoLocal.js` |
| `frontend/src/servicios/seguridadContrasenas.js` | `frontend/src/servicios/seguridadContrasenas.js` |
| `frontend/src/utilidades/calcularTotales.js` | `frontend/src/utilidades/calcularTotales.js` |
| `frontend/src/utilidades/formatearMoneda.js` | `frontend/src/utilidades/formatearMoneda.js` |
| `frontend/src/utilidades/validarAdministracion.js` | `frontend/src/utilidades/validarAdministracion.js` |
| `frontend/src/utilidades/validarCompra.js` | `frontend/src/utilidades/validarCompra.js` |
| `frontend/src/utilidades/validarFormularios.js` | `frontend/src/utilidades/validarFormularios.js` |
| `frontend/src/utilidades/validarRut.js` | `frontend/src/utilidades/validarRut.js` |
| `frontend/vite.config.js` | `frontend/vite.config.js` |
