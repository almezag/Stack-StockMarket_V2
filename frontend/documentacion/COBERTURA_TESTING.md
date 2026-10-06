# Reproducir las pruebas y leer la cobertura

La verificación independiente tras la limpieza reprodujo **124/124 pruebas
correctas** en test y cobertura, y build de **88 módulos**, con salida **0** en
Linux. La instalación desde lockfile de 422 paquetes fue verificada antes de la
limpieza; no se repitió al empaquetar. Las tres capturas actuales se renovaron e
inspeccionaron. El ZIP solo React tiene controles del escritor; su verificación
independiente queda pendiente. Windows, teclado/contraste y despliegue externo
siguen pendientes.

## 1. Preparar y ejecutar

Instale Node/npm y Google Chrome. El entorno observado fue Linux, Node 24.21.0,
npm 11.19.0 y Chrome 154.0.8037.97. Desde la raíz del repositorio:

```bash
npm --prefix frontend ci
CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend test -- --single-run
CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend run test:coverage
npm --prefix frontend run build
```

La instalación desde lockfile con `npm ci` (422 paquetes) fue verificada antes
de la limpieza. Escritor y verificador independiente ejecutaron test, cobertura
y build después de la limpieza, no npm ci durante el empaquetado.
Ajuste CHROME_BIN si Chrome tiene otra ubicación. Para
PowerShell, consulte la [detección automática y ejemplo manual del README](../README.md#3-ejecutar-las-pruebas).

`test` sin `--single-run` observa cambios; `test:coverage` ya incluye single-run.
El aviso `util._extend` de una dependencia fue no bloqueante: las ejecuciones
finales salieron con código **0**. No se reparó configuración ni se cambió runner.

| Herramienta | Responsabilidad real |
| --- | --- |
| Jasmine | `describe`, `it`, `expect`, `expectAsync`, spies y resultados de casos |
| Karma + Chrome Headless | Servir pruebas y ejecutarlas en un navegador real sin ventana |
| React Testing Library | Render, consultas por rol/etiqueta/texto, eventos DOM, `act` y esperas |
| Webpack + Babel | Preparar módulos de pruebas; instrumentación Istanbul de fuentes |
| Karma Coverage / Istanbul | Contar código ejercitado y generar HTML/resumen |
| Vite | Servir desarrollo y construir producción; no es Vitest ni ejecuta esta suite |

Son pruebas unitarias y de integración de componentes/contextos en DOM de Chrome.
No son una suite E2E navegando el servidor Vite desplegado ni una auditoría visual.

## 2. Resultados finales observados

Fuente: ejecución independiente tras la limpieza de `test:coverage` y su informe
**`coverage/index.html`**. Los denominadores finales reproducidos son los siguientes;
no se atribuye al informe nuevo la fecha de una ejecución anterior.

| Métrica | Cubierto / total instrumentado | Porcentaje |
| --- | --- | --- |
| Sentencias | 913 / 956 | 95,50% |
| Ramas | 598 / 635 | 94,17% |
| Funciones | 210 / 213 | 98,59% |
| Líneas | 910 / 952 | 95,58% |

El informe incluye **57 módulos `.js`/`.jsx` fuente importados por las pruebas**.
`main.jsx` no se importa en ellas. CSS, imágenes, configuraciones, las propias
pruebas y dependencias no forman parte de esos denominadores. No representa
«100% de la app», seguridad ni funcionalidad futura. Los **88 módulos** transformados
por Vite pertenecen al build (incluye dependencias); no son 88 fuentes cubiertas.

### Distribución real de cobertura

Estas fracciones provienen del índice HTML. Los porcentajes globales se calculan
sumando denominadores, no promediando porcentajes de carpetas.

| Grupo fuente | Módulos | Sentencias | Ramas | Funciones | Líneas |
| --- | ---: | --- | --- | --- | --- |
| `src/` (Aplicacion) | 1 | 1/1 | 0/0 | 1/1 | 1/1 |
| `componentes/atomos` | 3 | 10/10 | 20/20 | 3/3 | 10/10 |
| `componentes/moleculas` | 4 | 11/11 | 0/0 | 10/10 | 11/11 |
| `componentes/organismos` | 14 | 216/232 | 129/141 | 48/50 | 216/232 |
| `componentes/plantillas` | 3 | 13/13 | 6/6 | 6/6 | 13/13 |
| `contextos` | 4 | 245/262 | 116/133 | 55/55 | 245/262 |
| `datos` | 3 | 8/8 | 0/0 | 1/1 | 8/8 |
| `hooks` | 4 | 8/10 | 2/4 | 4/4 | 8/10 |
| `paginas` | 13 | 124/127 | 48/50 | 33/33 | 124/127 |
| `servicios` | 2 | 91/91 | 71/71 | 17/17 | 91/91 |
| `utilidades` | 6 | 186/191 | 206/210 | 32/33 | 183/187 |

Una carpeta con ramas 0/0 no demostró decisiones: no había ramas instrumentadas.
Abra un archivo dentro del HTML para encontrar bloques rojos, contadores y ramas
faltantes. Incluso 100% solo indica ejecución; una aserción podría ser insuficiente.

## 3. Archivos de pruebas y comportamientos

Los conteos incluyen casos creados con `forEach`, no solo líneas con `it`.

| Archivo en `pruebas/` | Casos | Grupo de comportamiento |
| --- | ---: | --- |
| `Aplicacion.spec.jsx` | 7 | Identidad, ausencia de promesa de conservación, enlaces operativos, plantilla y 404 |
| `CatalogoCarrito.spec.jsx` | 12 | Filtros/URL, cantidades, duplicados, persistencia y precios compartidos |
| `Almacenamiento.spec.js` | 5 | Storage inyectado, JSON, saneamiento y umbral de envío |
| `Autenticacion.spec.jsx` | 16 | Registro/login/logout, errores asociados, roles, sesiones y fallos |
| `Validaciones.spec.js` | 9 | RUT, perfil, límites 7/8/64/65, PBKDF2 real y saneamiento |
| `CompraContacto.spec.jsx` | 18 | Flujo invitado DOM, comprobante, tarjeta, cambios de carrito y errores Storage/contacto |
| `ValidacionesCompra.spec.js` | 7 | Destinatario, métodos, expiración, formatos y campos permitidos |
| `Administracion.spec.jsx` | 31 | CRUD compartido, roles, protección administrativa, concurrencia y dos aperturas de formulario |
| `ValidacionesAdministracion.spec.js` | 18 | Precio, campos, duplicados, contraseña, roles y protección de administradores |
| `CicloVida.spec.jsx` | 1 | Proveedor real bajo StrictMode: doble efecto, registro/login y cuentas no duplicadas |
| **Total** | **124** | **123 previos conservados y un nuevo guard DOM de limpieza** |

### Casos representativos vinculados a la ERS

La tabla permite localizar más de diez pruebas de comportamiento de aplicación,
no pruebas triviales de existencia de un componente.

| Caso real (nombre identificable en la fuente) | Acción y resultado verificado | Requisito |
| --- | --- | --- |
| «regresa realmente al inicio desde una ruta desconocida» | Clic en enlace cambia título y elimina 404 | RF-01 |
| «muestra los dieciocho productos originales y combina búsqueda sin acentos con categoría» | Escribir cafe y elegir Lácteos muestra resultados compatibles o vacío | RF-02 |
| «incrementa duplicados, modifica cantidades, calcula totales y elimina» | Dos agregados, cantidad 3, importes y eliminación con Storage mínimo | RF-03/04 |
| «usa precios de los productos compartidos y descarta identificadores desconocidos» | No acepta precio/nombre obsoletos del carrito, calcula $25.000 | RF-04 |
| «crea una cuenta y permite ingresar y cerrar la sesión realmente» | Registro → login → saludo → logout; sin contraseña en Storage | RF-05/06, RNF-05 |
| «rechaza un RUT inválido y confirmación diferente con errores asociados» | DOM aria-invalid y mensaje vinculado, sin éxito falso | RF-05, RNF-03 |
| «rechaza al administrador en el acceso público aunque la contraseña coincida» | Mensaje de rol y sesión null | RF-06 |
| «recorre catálogo, carrito, checkout, pago y comprobante sin exigir cuenta» | Clics/campos reales, total $4.880 y carrito limpio | RF-07/08/09 |
| «valida método y tarjeta condicional, formatea dígitos y nunca persiste sus datos» | Muestra campos condicionales, permite simulación y verifica claves sin tarjeta/CVV | RF-08, RNF-05 |
| «rechaza dos confirmaciones inmediatas desde el contexto antes de desmontar o navegar» | Dos llamadas en un act: true/false y una escritura de orden | RF-09 |
| «conserva y advierte registros antiguos ante limpieza parcial» | Escrituras parciales denegadas, aviso y borrador ya confirmado al remontar | RF-09, RNF-04 |
| «valida contacto sin fingir envío de correo» | Errores iniciales y status explícito, sin persistir mensaje | RF-10 |
| «crea, edita y elimina en el catálogo compartido y actualiza el carrito inmediatamente» | CRUD DOM, nuevo precio visible y línea retirada | RF-12 |
| «crea un cliente con credencial derivada y permite su ingreso público tras cerrar sesión» | Cuenta del panel ingresa en tienda con PBKDF2 real | RF-13 |
| «actualiza la contraseña y rechaza la anterior incluso después de recargar» | Clave antigua falla; nueva produce saludo | RF-13 |
| «cancela el permiso de una alta en curso si se cierra sesión antes de terminar PBKDF2» | Sin mutación tras perder el rol activo | RF-14 |
| «conserva la nueva edición de … mientras termina una edición anterior» (dos casos) | Derivación demorada, otra apertura conservada con texto escrito y sin éxito viejo | RF-14 |
| «inicializa cuentas una vez efectiva y conserva el registro e ingreso tras el doble efecto» | StrictMode hace dos efectos y una limpieza; dos demos, una escritura inicial, cuenta nueva única y sesión vigente | RNF-07 |

## 4. Fixtures, mocks y esperas

`karma.conf.cjs` fija `client.jasmine.random: false`. Esto desactiva el orden
aleatorio; no fija valores de sales, UUID o reloj. Los casos limpian localStorage
con `beforeEach`/`afterEach`, y `pruebas/configuracion.js` llama `cleanup()` después
de cada caso para desmontar React. No usan credenciales ni datos privados.

Fixtures son datos ficticios preparados para un caso: catálogo, destinatario o
cuentas de demostración. Fechas fijas se pasan a la validación pura de expiración.
La suite real ejecuta PBKDF2, compara claves correctas/incorrectas, sales distintas
y cambio de contraseña. No reemplaza globalmente el servicio criptográfico.

| Sustitución puntual | Justificación y restauración |
| --- | --- |
| Storage inyectado con `jasmine.createSpyObj` | Provocar lectura/escritura fallida sin depender del estado del navegador; objeto exclusivo del caso |
| `spyOn(Storage.prototype, 'getItem'/'setItem')` | Simular permisos/cuota o contar escrituras; casos parciales delegan otras claves al método original |
| Spies de `importKey`/`deriveBits` rechazados | Probar consumidores ante fallo WebCrypto, no probar criptografía ficticia |
| `deriveBits` demorado por Promise | Reproducir apertura de otro formulario mientras PBKDF2 está pendiente; al liberar ejecuta el método original real |
| Spy de `console.log` | Verificar que el flujo de tarjeta no registra esos datos |

Jasmine restaura sus spies al terminar cada prueba. El caso de reintento cambia
`and.callFake` a `and.callThrough` antes del segundo envío. La demora se libera
dentro del caso; no quedan mocks compartidos entre pruebas.

Use `findByRole`/`findByText` para esperar DOM asíncrono. Dentro de `waitFor`, lance
un error cuando la condición no se cumple: **las aserciones Jasmine registran el
fallo, pero no necesariamente lanzan una excepción que provoque el reintento**.
Las pruebas esperan un botón habilitado o una escritura observada antes de
comprobar el resultado. `act` coordina actualizaciones React; no sustituye esperar
la finalización real de PBKDF2.

Karma sirve `public/` sin incluir sus imágenes como scripts y redirige `/imagenes/`
a `/base/public/imagenes/`. Así las rutas del DOM pueden cargar logo/mapa; no se
instrumentan esas imágenes. Esto no comprueba tamaño, legibilidad o apariencia.

## 5. Evidencia de desarrollo y límites

### Limpieza de la aplicación anterior

El nuevo caso «no anuncia la conservación de la primera evaluación en el inicio»
renderiza la aplicación, verifica el título real y exige ausencia del mensaje en
el DOM. RED observado antes de cambiar la UI: **123 correctas / 1 fallida** de
124, salida 1; Jasmine encontró el párrafo que debía ser null. Tras retirar solo
ese párrafo: GREEN **124/124**, salida 0. Cobertura **124/124** y build de 88
módulos, salida 0. Los casos de alcance, enlaces, destacados y 404 siguen pasando.
No se modificaron roles, pagos ni estado compartido. Esta evidencia es del
escritor; el verificador independiente reprodujo GREEN, cobertura y build,
no el RED histórico. También comprobó 162 imports y 23 enlaces Markdown.

### Correcciones anteriores

El escritor informó un RED funcional de desarrollo: suite **121 correctas / 1 fallida** de
122, salida 1. El guardado de Cliente Demo finalizaba y desaparecía el formulario
de Administración Demo abierto después. La corrección agregó un contador de
aperturas en la página; solo la apertura que inició el guardado puede cerrarse o
mostrar su mensaje. GREEN: **122/122**, salida 0. Triangulación: reapertura del
mismo usuario tras cambiar de sección; suite final **123/123**, salida 0.

La prueba StrictMode ya pasó en esa ejecución RED: es una protección adicional
del comportamiento existente, no una corrección a ContextoUsuarios. Observa la
cancelación del primer efecto antes de su preparación y una sola escritura
inicial efectiva. No afirma explorar todos los órdenes posibles de cancelación
en mitad de operaciones asíncronas.

Los RED históricos, incluido el de esta corrección de UI, fueron informados
por sus escritores; **no fueron reproducidos independientemente**. La verificación
final independiente reprodujo instalación, test, cobertura y build, e inspeccionó
StrictMode real y la protección de aperturas asíncronas del panel. Esa inspección
no certifica el RED histórico ni constituye aprobación nativa de revisión.

### Comprobación visual limitada y preview local

El padre inspeccionó tres PNG: inicio **390×844**, catálogo **1366×900** y contacto
**768×1024**. Muestran el contenido esperado y la navegación se acomoda en varias
líneas en móvil/tablet. El mapa de contacto se ve borroso por el recurso original.
Tres rutas directas respondieron **HTTP 200 en preview local**; no es evidencia de
un despliegue externo ni de navegación con teclado o contraste.

Las tres capturas actuales se renovaron e inspeccionaron tras la limpieza.
Inicio no anuncia conservación y catálogo tiene 18 productos. Solo se verifican
las porciones visibles: el formulario de contacto queda fuera del recorte.
Las rutas `/`, `/catalogo` y `/contacto` dieron HTTP 200 en preview local.
El verificador comprobó un snapshot de 84 archivos sin cambios antes/después
del navegador. El empaquetado reutiliza esta evidencia sin modificarla.

El caso de tarjeta comprueba esquemas y valores permitidos de borrador, orden,
destinatario, artículos y totales, además de la limpieza posterior. No busca una
secuencia arbitraria de dígitos en todo el JSON: el reloj fijo produce identificadores
legítimos que contienen `9876`, también usado como CVV ficticio. Eso no es una fuga
ni demuestra por sí solo unicidad de identificadores frente a colisiones.

### Comprobaciones aún pendientes

- [ ] Ejecución en Windows (Linux e instalación desde lockfile ya verificados).
- [x] Guard DOM de limpieza, RED/GREEN, cobertura y build observados por el escritor.
- [x] Verificación independiente de test, cobertura y build tras la limpieza.
- [x] Tres capturas renovadas e inspeccionadas, solo porciones visibles.
- [x] ZIP solo React y controles del escritor en inventario externo.
- [ ] Verificación independiente del ZIP.
- [ ] Revisión visual del resto de vistas, tablas y campos largos.
- [ ] Recorrido solo con teclado, foco, lectura de errores y contraste.
- [ ] Despliegue real con recarga/acceso directo de rutas BrowserRouter.
- [ ] Integrantes y URL pública completados por el equipo. GitHub no está publicado
  ni su publicación autorizada; no se afirma cumplimiento de toda la pauta.

La pauta (páginas 3–4) exige documentos de ERS y testing/cobertura, no formato PDF.
Exportar a PDF es opcional si se desea o lo pide el docente; no hay PDF generado.
Ruta del paquete portable desde la raíz:
`entrega/Stock-Stock-Market-Evaluacion-2.zip`: incluye solo React, guías, 76
archivos del informe en `evidencias/cobertura/` y tres PNG actuales en
`evidencias/capturas/`, sin bundles de Karma/Webpack ni aplicación anterior.
`entrega/CONTENIDO_ENTREGA.md` registra tamaño, SHA256 y controles propios del
escritor, fuera del ZIP. La verificación independiente del paquete queda
pendiente; no se probó la aplicación extraída ni se repitió npm al empaquetar.

Quedan ramas no ejecutadas, especialmente defensas de contextos, errores de hooks
sin proveedor y algunas rutas de formularios. Los fallos de métodos Storage están
probados, pero no se simuló directamente un getter de `window.localStorage` que
lance. No hay auditoría formal de accesibilidad o seguridad, pruebas entre pestañas,
pagos reales ni backend. Esos límites deben acompañar los porcentajes al presentar.
