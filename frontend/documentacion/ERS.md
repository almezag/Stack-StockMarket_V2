# ERS — Stock & Stock Market, frontend React

Use este documento para comprobar qué debe demostrar la segunda evaluación y
qué queda expresamente fuera del alcance. Describe la propuesta frontend y sus
criterios de aceptación según el código actual; no supone servicios inexistentes.

## 1. Identificación y propósito

| Campo | Valor |
| --- | --- |
| Proyecto | Stock & Stock Market — migración académica React |
| Asignatura / evaluación | DSY1104, segunda evaluación |
| Versión de aplicación | 0.1.0 (`package.json`) |
| Versión de documento | 1.0, preparada para la versión actual |
| Fecha de preparación | 2026-10-05 |
| Integrante 1 | Completar por el equipo |
| Integrante 2 | Completar por el equipo |
| Integrante 3 | Completar por el equipo |
| URL pública de GitHub | Completar por el equipo |

No se suministró una ERS de la primera evaluación. Este documento fue preparado
a partir de la implementación actual; **no se afirma haber actualizado una ERS
histórica**. React es la única aplicación; los HTML y recursos antiguos se
retiraron de la raíz. Se mantiene la procedencia de los 18 productos, las 16
comunas y la regla de envío de $2.990 bajo $25.000, sin imports del legacy.

**Objetivo:** demostrar una tienda navegable con componentes React, Bootstrap,
formularios controlados, estado compartido y pruebas Jasmine/Karma. La
administración modifica los mismos productos y usuarios que usa la tienda.

## 2. Usuarios, alcance y supuestos

| Actor | Acciones disponibles |
| --- | --- |
| Visitante | Consultar catálogo/información, usar carrito, simular compra y validar contacto |
| Cliente | Registrarse por el formulario público, ingresar y cerrar sesión; también comprar como visitante |
| Administrador | Ingresar por `/admin`, consultar resumen y gestionar productos/cuentas |
| Equipo evaluador | Ejecutar la copia, inspeccionar código, reproducir pruebas y contrastar documentos |

El visitante no necesita cuenta para checkout. No existe el rol vendedor en esta
versión. El registro público no permite seleccionar administrador. Las cuentas
creadas en el panel pueden tener el perfil de despacho completamente vacío; el
registro público exige RUT, teléfono y comuna. Editarlas conserva el perfil existente.

La aplicación requiere Node/npm para desarrollo y compilación, navegador moderno
y localhost o HTTPS para WebCrypto. La instalación inicial necesita dependencias
npm. Funciona con datos locales de ese navegador; no existe servidor de datos.

**No incluye:** control/reserva/descuento de stock, POS, pagos bancarios, envío real
de mensajes, recuperación remota de cuentas, sesiones de servidor, transacciones
Storage ni sincronización entre pestañas/equipos. La visión de integración POS
mostrada en Quiénes Somos es una intención futura, no aceptación de esta versión.

## 3. Recorridos principales

1. Inicio → catálogo → filtrar → agregar → carrito → cantidad/eliminación.
2. Carrito no vacío → checkout con datos ficticios → método de pago simulado →
   comprobante → catálogo. Cancelar pago vuelve al carrito sin emitir orden.
3. Registro público válido → enlace a login → ingreso de cliente → cerrar sesión.
4. `/admin` → ingreso de administrador → resumen/productos/usuarios → catálogo
   compartido. Una cuenta nueva puede ingresar por su acceso luego de cerrar sesión.
5. Contacto → validar mensaje local; Quiénes Somos → propuesta y valores.
6. Ruta desconocida → 404 → inicio. Acceso directo al panel sin permiso →
   explicación y enlace a `/admin`, sin destruir una sesión válida de cliente.

## 4. Requisitos funcionales y aceptación

Rutas en `src/Aplicacion.jsx`; los nombres de archivos siguientes son relativos
a `frontend/`. Las pruebas citadas están en `pruebas/`; su selección concreta y
resultados se detallan en [COBERTURA_TESTING.md](COBERTURA_TESTING.md).

| ID | Requisito | Criterio de aceptación observable | Código / pruebas |
| --- | --- | --- | --- |
| RF-01 | Navegación compartida | Inicio, catálogo, autenticación, contacto y quiénes somos tienen enlaces reales; 404 permite volver al inicio | `Aplicacion.jsx`, `PlantillaTienda.jsx`; `Aplicacion.spec.jsx` |
| RF-02 | Catálogo compartido y filtros | Con datos iniciales muestra 18 productos; búsqueda ignora acentos/mayúsculas y combina categoría; URL puede preseleccionarla | `PaginaCatalogo.jsx`, `ContextoProductos.jsx`; `CatalogoCarrito.spec.jsx` |
| RF-03 | Carrito editable | Agregar repetido incrementa; cantidades enteras positivas se aceptan, inválidas no alteran estado; eliminar retira la línea; vacío ofrece catálogo sin resumen | `ContextoCarrito.jsx`, `FilaCarrito.jsx`; `CatalogoCarrito.spec.jsx` |
| RF-04 | Cálculos vigentes CLP | Nombres/precios vienen del catálogo actual; subtotal suma precio por cantidad; envío $2.990 bajo $25.000 y cero desde ese monto, también en retiro | `calcularTotales.js`, `ResumenCompra.jsx`; `Almacenamiento.spec.js`, `CompraContacto.spec.jsx` |
| RF-05 | Registro validado de cliente | Valida nombre completo hasta 60 caracteres, RUT módulo once, móvil chileno, una de 16 comunas, correo permitido y confirmación; crea solo cliente y rechaza correo duplicado normalizado | `FormularioRegistro.jsx`, `validarFormularios.js`, `validarRut.js`; `Autenticacion.spec.jsx`, `Validaciones.spec.js` |
| RF-06 | Ingreso y salida por rol | Login público acepta cliente y rechaza administrador; `/admin` acepta administrador y rechaza cliente; cerrar sesión guarda null; una sesión restaurada usa solo el identificador de cuenta vigente | `ContextoUsuarios.jsx`, `FormularioInicioSesion.jsx`; `Autenticacion.spec.jsx`, `Administracion.spec.jsx` |
| RF-07 | Checkout invitado | Valida nombre, correo, dirección, comuna y entrega; no exige login; bloquea carrito vacío/importes inválidos; crea borrador saneado | `PaginaCheckout.jsx`, `FormularioCheckout.jsx`, `ContextoCompra.jsx`; `CompraContacto.spec.jsx`, `ValidacionesCompra.spec.js` |
| RF-08 | Pago explícitamente simulado | Exige método conocido; tarjeta requiere 16 dígitos, MM/AA vigente hasta fin de mes y CVV 3–4; cambiar método limpia campos; cambio de carrito/precios exige revisar checkout | `FormularioPago.jsx`, `validarCompra.js`; `CompraContacto.spec.jsx`, `ValidacionesCompra.spec.js` |
| RF-09 | Comprobante y confirmación única | Emite artículos/precios actuales, fecha, operación y totales; dos llamadas inmediatas producen una orden; limpia carrito/borrador en memoria; restaura última orden válida y reconoce borrador consumido si fue guardado | `ContextoCompra.jsx`, `PaginaConfirmacion.jsx`; `CompraContacto.spec.jsx` |
| RF-10 | Contacto e información honestos | Valida nombre 3–100, correo permitido, móvil, asunto conocido y mensaje 10–500; informa que no se envió correo ni guarda mensaje; muestra misión/visión/valores y mapa local | `FormularioContacto.jsx`, `PaginaQuienesSomos.jsx`, `PaginaContacto.jsx`; `CompraContacto.spec.jsx`, `ValidacionesCompra.spec.js` |
| RF-11 | Acceso y resumen administrativo | Espera cuentas listas; niega invitado/cliente; muestra conteos y proporciones reales, incluso catálogo vacío sin NaN | `RutaAdministracion.jsx`, `ResumenAdministracion.jsx`; `Administracion.spec.jsx` |
| RF-12 | CRUD de productos integrado | Crear/editar valida cinco campos y precio CLP entero positivo seguro; eliminar/editar actualiza catálogo y carrito sin recarga; vacío persistido no repone eliminados | `FormularioProducto.jsx`, `TablaProductos.jsx`, `ContextoProductos.jsx`; `Administracion.spec.jsx`, `ValidacionesAdministracion.spec.js` |
| RF-13 | CRUD de cuentas integrado | Crea cliente/administrador con correo único; contraseña 8–64 obligatoria al crear y opcional al editar; cambio invalida anterior; cuenta nueva ingresa; eliminar impide login; protege cuenta propia y último administrador | `FormularioUsuario.jsx`, `TablaUsuarios.jsx`, `ContextoUsuarios.jsx`; `Administracion.spec.jsx`, `ValidacionesAdministracion.spec.js` |
| RF-14 | Guardado asíncrono coherente | Bloquea mutaciones de cuentas simultáneas; comprueba rol después de PBKDF2; cerrar sesión cancela permiso; terminar una edición vieja no cierra ni reemplaza mensajes de una nueva apertura | `ContextoUsuarios.jsx`, `PaginaPanelAdministracion.jsx`; `Administracion.spec.jsx` |

Correos de registro/login/administración/contacto: `gmail.com`, `duoc.cl` y
`profesor.duoc.cl`, normalizados sin espacios exteriores ni mayúsculas. Checkout
acepta otros dominios con formato válido. No se confunde ese control con verificar
que una casilla exista. Contraseñas no se recortan y siempre usan política 8–64.
RUT válido solo significa dígito verificador correcto, no identidad certificada.

## 5. Requisitos no funcionales y aceptación

| ID | Requisito | Criterio y estado de comprobación |
| --- | --- | --- |
| RNF-01 | Componentes explicables | Atomic Design con átomos, moléculas, organismos, plantillas y páginas; props, eventos y estados específicos; inspección de código y ejemplos en guía |
| RNF-02 | Presentación responsiva | Bootstrap local con columnas adaptables y tablas `table-responsive`, CSS propio para foco/tamaño; tres capturas actuales renovadas e inspeccionadas tras la limpieza (solo sus viewports, formulario de contacto fuera del recorte): inicio 390×844, catálogo 1366×900 y contacto 768×1024, contenido esperado y navegación en varias líneas en móvil/tablet; mapa original borroso; no certifica todas las vistas |
| RNF-03 | Formularios comprensibles | React controla `value`/`onChange` y `noValidate`; etiquetas enlazadas y errores `aria-invalid`/`aria-describedby`; pruebas DOM existentes; teclado/contraste y auditoría formal no certificados |
| RNF-04 | Persistencia defensiva | Claves `stock_react_*` independientes del original, JSON inválido saneado y campos permitidos; fallos no rompen flujo en memoria; avisos describen pérdida posible y registros antiguos; pruebas Storage |
| RNF-05 | Minimización de datos | No persistir contraseña nueva en claro, tarjeta/vencimiento/CVV ni mensajes; PBKDF2-SHA-256 con 100000 iteraciones, sal 16 bytes, resumen 32; pruebas reales y listas de campos permitidos |
| RNF-06 | Pruebas reproducibles | Jasmine/Karma/Chrome y React Testing Library; fixtures aisladas, orden no aleatorio; verificación independiente tras la limpieza en Linux: test y cobertura 124/124, salida 0; instalación previa independiente desde lockfile de 422 paquetes, no repetida al empaquetar; denominadores explícitos; Windows no ejecutado |
| RNF-07 | Ciclo de vida React | `main.jsx` usa StrictMode; limpieza de inicialización evita aplicar efecto cancelado; prueba real de doble efecto con proveedor, dos demos y registro/login sin duplicados; inspeccionada independientemente |
| RNF-08 | Ejecución documentada | `npm ci`, dev, build y preview definidos; build tras la limpieza verificado independientemente en Linux (88 módulos, salida 0); servidor debe devolver index para rutas BrowserRouter; tres rutas directas HTTP 200 en preview local; acceso directo en despliegue externo pendiente |
| RNF-09 | React autocontenido y almacenamiento independiente | Fuentes y recursos de la aplicación en frontend, logo/mapa en public/imagenes; sin dependencia de archivos legacy ni lectura/sobrescritura de claves ss_* originales |

## 6. Datos y límites de aceptación

- Productos: id, nombre, categoría, descripción, emoji y precio. No stock.
- Carrito: solo id/cantidad; resuelve producto vigente. Orden histórica no cambia
  al editar posteriormente el catálogo.
- Usuario: id, perfil, rol y parámetros de credencial; sesión: solo usuarioId.
- Borrador: id, destinatario y huella de artículos para detectar cambios, no firma
  criptográfica ni garantía de autorización.
- Última orden: operación, borrador consumido, fecha, método, destinatario,
  artículos emitidos, totales reconstruidos y marca de simulación.

Storage no ofrece transacciones. Guardar orden y limpiar borrador/carrito pueden
fallar por separado. Si la orden queda guardada, reconoce ese borrador; si tampoco
se guarda, tras recargar no se garantiza reconocer una simulación previa. No hay
idempotencia de servidor ni coordinación entre pestañas.

PBKDF2 evita almacenar claves nuevas en claro, pero **no transforma este frontend
en un sistema seguro**. Usuarios/roles/código pueden ser manipulados localmente.
La aceptación es educativa, no productiva. Use datos ficticios exclusivamente.

## 7. Entrega y comprobaciones pendientes

La pauta (páginas 3–4) incluye repositorio **público** de GitHub, frontend
comprimido, ERS y documento de testing/cobertura; **no especifica formato PDF**.
Puede exportarse a PDF si se desea o si lo solicita el docente; no hay PDF generado.
Completar por el equipo nombres y URL. La publicación no está autorizada.
El pendrive es transporte, no cumplimiento por sí solo.

Paquete solo React: `entrega/Stock-Stock-Market-Evaluacion-2.zip`, con guías,
informe actual en `evidencias/cobertura/` y tres PNG en `evidencias/capturas/`.
El inventario e integridad del escritor están en `entrega/CONTENIDO_ENTREGA.md`,
fuera del ZIP. La verificación independiente del paquete queda pendiente.
Código completado y verificado no significa cumplimiento de todos los entregables.

- [x] Verificación independiente tras la limpieza en Linux: test y cobertura
  124/124, 57 módulos fuente importados; build de 88 módulos; salida 0.
- [ ] Verificación independiente del ZIP.
- [x] Instalación previa a la limpieza desde lockfile mediante npm ci:
  422 paquetes, salida 0; no repetida durante el empaquetado.
- [x] Inspección independiente de StrictMode real y corrección de aperturas
  asíncronas del panel (RF-14); no certifica el RED histórico.
- [ ] Ejecución en Windows.
- [x] Inspección limitada de tres capturas: inicio móvil, catálogo escritorio y
  contacto tablet; contenido esperado, navegación adaptable y mapa original borroso.
- [x] Capturas renovadas e inspeccionadas tras la limpieza, solo porciones visibles.
- [x] ZIP solo React creado y controles propios registrados en inventario externo.
- [ ] Revisión del resto de vistas (no certificada).
- [ ] Recorrido manual de teclado y contraste.
- [ ] Despliegue y recargas de rutas directas con fallback.
- [ ] Completar integrantes y GitHub público (publicación no autorizada).

No se atribuye aprobación de revisión nativa ni certificación formal de seguridad
o accesibilidad. Consulte resultados y casos en el documento de testing.
