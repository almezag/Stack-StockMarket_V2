# Ejecutar Stock & Stock Market en React

Esta es la migración del mismo proyecto para la segunda evaluación DSY1104,
versión de paquete **0.1.0**. Conserva los 18 productos iniciales y el contenido
de la tienda, y agrega una interfaz React con administración integrada. Los
HTML, scripts y recursos de la aplicación anterior se retiraron de la raíz;
`frontend/` es la única aplicación. La procedencia histórica de los datos se
mantiene, sin importar código antiguo ni depender de sus archivos.

## 1. Instalar y abrir

Entorno comprobado el **2026-10-05**: Node.js **24.21.0**, npm **11.19.0**,
Google Chrome **154.0.8037.97**, en Linux. El build usó Vite **6.4.3** y las
pruebas Karma **6.4.4**. Son versiones observadas, no una certificación de todos
los sistemas. Use Node 24 y npm 11 para reproducir ese entorno. Windows queda
pendiente de ejecución; los comandos PowerShell siguientes son instrucciones.

Desde la raíz del repositorio, con Node/npm instalados:

```bash
node --version
npm --version
npm --prefix frontend ci
npm --prefix frontend run dev
```

La instalación nueva con `npm ci` desde `package-lock.json` fue verificada
independientemente en Linux antes de la limpieza: **422 paquetes**, salida **0**.
No se repitió la instalación al empaquetar. Necesita Internet
para descargarlas si no están en caché. Abra la URL que informa Vite, normalmente
`http://localhost:5173`. Detenga el servidor con Ctrl+C. También puede ejecutar
los scripts desde `frontend/`, sin `--prefix frontend`.

**No funciona abriendo un HTML con doble clic.** Necesita Node/npm y servidor.
WebCrypto requiere localhost o HTTPS para preparar las cuentas. Bootstrap 5 se
instala localmente, sin CDN. Vite sirve y compila React: **Vite no es Vitest** y
este proyecto no usa Vitest.

## 2. Compilar y consultar la compilación

```bash
npm --prefix frontend run build
npm --prefix frontend run preview
```

Abra la URL de preview que informa Vite, normalmente `http://localhost:4173`.
`dist/` es el resultado del build; preview sirve para revisarlo localmente, no
para reemplazar un servidor de producción. Al desplegar en un servidor web,
configure el retorno de `index.html` para rutas React como `/catalogo` o
`/panel-administracion`: `BrowserRouter` necesita ese fallback en accesos directos
y recargas. Tres rutas directas respondieron HTTP 200 en preview local; eso no verifica
la configuración de un despliegue externo, todavía pendiente.

## 3. Ejecutar las pruebas

Instale Google Chrome. Jasmine define casos, `expect` y spies; Karma los ejecuta
en Chrome Headless. React Testing Library renderiza componentes y ofrece consultas
del DOM, `fireEvent`, `act` y esperas. No reemplaza a Jasmine ni al navegador.

### Linux

Desde la raíz, si Chrome está instalado en esa ruta:

```bash
CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend test -- --single-run
CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend run test:coverage
```

Si Chrome está en otra ubicación, use su ejecutable en `CHROME_BIN`. Para mantener
Karma observando cambios, ejecute `test` sin `--single-run`.

### Windows PowerShell

Busque una instalación habitual de Chrome y ejecute ambos comandos:

```powershell
$rutasChrome = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$chromeEncontrado = $rutasChrome |
    Where-Object { Test-Path -LiteralPath $_ } |
    Select-Object -First 1
if (-not $chromeEncontrado) {
    throw "No se encontró Chrome. Instálelo o indique su ruta en CHROME_BIN."
}
$env:CHROME_BIN = $chromeEncontrado
npm --prefix frontend test -- --single-run
npm --prefix frontend run test:coverage
```

Alternativa manual para una instalación en Program Files:

```powershell
$env:CHROME_BIN = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
Test-Path -LiteralPath $env:CHROME_BIN
npm --prefix frontend test -- --single-run
npm --prefix frontend run test:coverage
```

Si `Test-Path` devuelve `False`, indique la ubicación real antes de ejecutar.
No copie una ruta privada de otro computador.

Verificación independiente tras la limpieza en Linux: **124/124 pruebas correctas**
tanto en test como en cobertura de **57 módulos fuente importados**; build correcto
con **88 módulos transformados**. Los tres comandos terminaron con salida **0**.
La previa fue 123/123. Informe HTML generado en
`coverage/index.html`; detalles y denominadores en
[COBERTURA_TESTING.md](documentacion/COBERTURA_TESTING.md).
No incluye `main.jsx`, CSS ni dependencias y no significa «100% de la app».

## 4. Probar la aplicación

| Ruta | Función |
| --- | --- |
| `/` | Identidad y primeros cuatro productos destacados |
| `/catalogo` | Búsqueda por nombre sin acentos y filtro combinado por categoría |
| `/carrito` | Agregar, incrementar repetidos, cambiar cantidades y eliminar |
| `/registro`, `/login` | Crear cuentas de cliente e ingresar/salir localmente |
| `/admin`, `/panel-administracion` | Acceso separado y CRUD compartido de productos/usuarios |
| `/checkout`, `/pago`, `/confirmacion` | Compra invitada y comprobante simulado |
| `/contacto`, `/quienes-somos` | Validación local de mensaje y contenido informativo |
| Otra ruta | Página 404 con regreso al inicio |

Puede preseleccionar `/catalogo?categoria=Bebidas`. El carrito acepta cantidades
enteras positivas representables con seguridad por JavaScript; no impone un
máximo de stock. Usa precios actuales del catálogo compartido. Envío: **$2.990
bajo $25.000; gratis desde $25.000**, también para retiro en este piloto. Se
mantiene la regla de cálculo original, no el umbral distinto de algunos banners
heredados. El carrito vacío no presenta resumen ni cobra envío.

### Cuentas públicas de demostración

| Rol y acceso | Correo | Contraseña de prueba |
| --- | --- | --- |
| Cliente: `/login` | `cliente@gmail.com` | `ClienteDemo123` |
| Administrador: `/admin` | `admin@duoc.cl` | `AdminDemo123` |

Son datos públicos de `src/datos/usuariosDemostracion.js`, no secretos ni cuentas
reales. Se preparan cuando no existe un registro local válido. Si se editaron o
eliminaron esas cuentas, las credenciales iniciales pueden dejar de funcionar.
Use un perfil de navegador de prueba limpio si necesita la demostración inicial.
Una lista vacía válida no repone cuentas o productos eliminados.

El registro público siempre crea `cliente`. Exige nombre completo, RUT módulo
once, móvil chileno, una de las 16 comunas originales y correo de `gmail.com`,
`duoc.cl` o `profesor.duoc.cl`. Registro, login y administración comparten política
de contraseña **8–64 caracteres**, sin recortarla. No se importan hashes antiguos.

En administración, cree o edite productos con nombre, categoría, descripción,
emoji y precio entero positivo CLP. El catálogo y carrito reflejan esos cambios
sin recarga; una eliminación retira sus líneas del carrito. El resumen muestra
conteos y proporciones por categoría, sin librería de gráficos. Las cuentas del
panel comparten el ingreso público o administrativo según el rol; no necesitan
RUT ni datos de despacho inventados. La contraseña es obligatoria al crear y
opcional al editar. Vacía conserva la anterior; una nueva la reemplaza. Se
protegen la cuenta propia y el último administrador. Si termina un guardado
asíncrono después de abrir otra edición, no cierra el formulario nuevo.

Para comprar, agregue productos, revise cantidades y siga checkout → pago →
comprobante usando datos ficticios. No necesita sesión. El pago ofrece tarjeta
ficticia, transferencia o pago en tienda. Solo tarjeta exige 16 dígitos, MM/AA
no vencido y CVV de 3–4 dígitos. Son controles de formato, no validación bancaria.
Cambiar el método borra los campos temporales; **no se guardan tarjeta, vencimiento
ni CVV**. Cancelar vuelve al carrito sin orden. Si cambian los importes después
del checkout, debe revisarlo otra vez. El comprobante conserva artículos y precios
emitidos; modificar el catálogo después no cambia la orden histórica.

Contacto valida cinco campos y declara que **no se envió un correo real**; no
guarda mensajes. Misión/visión describen la propuesta original; el backend POS
mencionado allí es futuro, no una función implementada.

## 5. Entender el código y sus límites

`main.jsx` instala `StrictMode` y `BrowserRouter`. `Aplicacion.jsx` define rutas
y proveedores. Las pruebas usan `MemoryRouter`. Atomic Design organiza átomos,
moléculas, organismos, plantillas y páginas; ejemplos explicados en la
[guía de presentación](documentacion/GUIA_PRESENTACION.md).

React es la autoridad del estado. Productos, carrito, usuarios y compra se
comparten mediante contextos y hooks específicos. No hay un catálogo paralelo
para administración. El carrito guarda solo `{ id, cantidad }`; nombre y precio
se consultan en productos. `useEffect` persiste productos/carrito; usuarios se
preparan asíncronamente con limpieza del efecto y persisten sus operaciones.

Claves locales propias (sin leer o sobrescribir las `ss_*` heredadas):

- `stock_react_productos_v1`, `stock_react_carrito_v1`.
- `stock_react_usuarios_v1`, `stock_react_sesion_v1`.
- `stock_react_borrador_compra_v1`, `stock_react_ultima_orden_v1`.

El lector tolera JSON corrupto y sanea estructuras; se conservan únicamente
campos permitidos. La sesión contiene `{ usuarioId }`; nombre y rol provienen
de la cuenta vigente, no del objeto de sesión. Los formularios controlados
asocian etiquetas y errores mediante `htmlFor`, `aria-invalid` y
`aria-describedby`. Eso no equivale a una auditoría formal de accesibilidad.

WebCrypto usa PBKDF2-SHA-256, 100000 iteraciones, sal aleatoria de 16 bytes y
resumen de 32 bytes. No almacena contraseñas nuevas en claro ni las registra en
consola. **No es autenticación ni autorización de servidor**: quien controle el
navegador puede modificar código/localStorage; PBKDF2 no protege roles locales
frente a esa manipulación o XSS. No ingrese información personal ni claves reales.

Storage puede fallar por permisos o espacio. React sigue en memoria; los avisos
no prometen recuperar cambios ni borrar registros anteriores. No hay transacciones
ni sincronización entre pestañas. La confirmación bloquea dos llamadas inmediatas;
si la limpieza persistente falla, la orden guardada reconoce el borrador consumido.
Si también falla el guardado de la orden, esa protección no se garantiza al recargar.

**Fuera del alcance:** stock/reservas, backend, pagos reales, envío de correos,
seguridad productiva y sincronización entre equipos. Bootstrap y CSS propio
ofrecen diseño responsivo. Se inspeccionaron tres capturas: inicio **390×844**,
catálogo **1366×900** y contacto **768×1024**, con contenido esperado; la navegación
se acomoda en varias líneas en móvil/tablet. El mapa de contacto aparece borroso
por el recurso original. Es una revisión limitada, no una auditoría visual completa.
Teclado/contraste y despliegue externo siguen pendientes. La instalación limpia
en Linux está verificada; Windows no se ejecutó. Las tres capturas se renovaron
y se inspeccionaron tras la limpieza. Solo muestran sus viewports; el formulario
de contacto está fuera del recorte. No certifican toda la interfaz.

## Documentación y entrega

- [ERS de esta versión](documentacion/ERS.md): no se recibió una ERS histórica;
  no se presenta como actualización de un documento original desconocido.
- [Testing y cobertura](documentacion/COBERTURA_TESTING.md): resultados observados,
  casos, mocks y comprobaciones pendientes.
- [Guía para presentar](documentacion/GUIA_PRESENTACION.md): recorrido y preguntas.

Complete integrantes y URL pública de GitHub. La pauta (páginas 3–4) exige
frontend comprimido y documentos de ERS/testing, **no formato PDF**. La
exportación a PDF es opcional y útil si se desea o si la pide el docente; no hay
PDF generado. La publicación de GitHub no está autorizada.

**Paquete solo React:** `entrega/Stock-Stock-Market-Evaluacion-2.zip` desde la raíz
del proyecto. Extraiga `Stock-Stock-Market-Evaluacion-2/` y lea
`LEEME_EVALUACION_2.md`. Incluye fuentes, `public/`, pruebas, configuraciones,
`index.html` de frontend, manifiestos npm, README y documentación. Logo y mapa
son locales en `public/imagenes/`, sin depender de archivos fuera de frontend.

El informe actual está en `evidencias/cobertura/` y las tres capturas actuales en
`evidencias/capturas/`. Se excluyen la aplicación antigua, `node_modules/`,
`dist/`, bundles de Karma/Webpack, metadatos Git/arnés, ODD y temporales.
El inventario, tamaño, SHA256 y controles del escritor quedan fuera del ZIP en
`entrega/CONTENIDO_ENTREGA.md`; la verificación independiente del paquete está
pendiente. No se ejecutó la aplicación extraída durante el empaquetado.
Integrantes y GitHub público siguen pendientes; la publicación no está autorizada.
Un pendrive solo transporta la copia y no cumple toda la pauta.
