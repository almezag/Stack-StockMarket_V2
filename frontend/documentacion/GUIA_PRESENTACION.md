# Presentar y explicar Stock & Stock Market

Prepare un recorrido breve y explique por qué cambia la pantalla, no solo dónde
hacer clic. La aplicación es una demostración React con datos locales: no cobra,
no envía correos y no controla stock real.

## 1. Antes de comenzar

1. Instale dependencias con `npm --prefix frontend ci` desde la raíz y ejecute
   `npm --prefix frontend run dev`. Abra la URL informada, no un HTML con doble clic.
2. Use un perfil de navegador de prueba con datos ficticios. Si conserva cambios
   previos, el catálogo y las cuentas pueden ser distintos a los iniciales.
3. Ejecute pruebas/cobertura y build con los comandos del [README](../README.md).
   Prepare el informe HTML y código fuente para mostrar evidencia.
4. Revise móvil/escritorio, teclado y la copia de entrega. Tras la limpieza se
   renovaron e inspeccionaron inicio 390×844, catálogo 1366×900 y contacto
   768×1024: navegación adaptada y mapa histórico borroso. Solo muestran sus
   viewports; el formulario de contacto está fuera del recorte. Esto no reemplaza
   la revisión del resto de vistas, teclado/contraste ni del paquete.

La verificación independiente tras la limpieza en Linux confirmó test/cobertura
124/124 y build de 88 módulos, salida 0. La instalación desde lockfile de 422
paquetes fue verificada antes de la limpieza, no al empaquetar. Windows no se ejecutó.

Cuentas iniciales de `src/datos/usuariosDemostracion.js`:

| Acceso | Correo | Contraseña pública de prueba |
| --- | --- | --- |
| Cliente, `/login` | `cliente@gmail.com` | `ClienteDemo123` |
| Administrador, `/admin` | `admin@duoc.cl` | `AdminDemo123` |

No son secretos. Si se editaron/eliminaron, las credenciales originales pueden
no funcionar. Una lista local vacía válida no repone datos automáticamente.

## 2. Recorrido que demuestra la integración

### Catálogo y compra invitada

1. Abra inicio y luego catálogo: explique que los destacados son los primeros
   cuatro productos del mismo contexto, no otro listado independiente.
2. Busque `cafe`, sin acento; combine con categoría. Limpie los filtros y agregue
   **Arroz Grado 1 1kg** dos veces. El carrito muestra dos unidades.
3. Abra carrito y cambie cantidad a 3. Con datos iniciales, subtotal **$5.670**,
   envío **$2.990**, total **$8.660**. Cantidad cero o decimal se rechaza.
4. Siga **Continuar al checkout**. Use nombre `Persona de Prueba`, correo
   `prueba@example.cl`, dirección ficticia `Calle de Prueba 123`, comuna `Santiago`
   y despacho. No necesita iniciar sesión.
5. Continúe al pago. Muestre que tarjeta agrega campos condicionales, pero elija
   **Pago en tienda** para confirmar sin escribir una tarjeta. Lea el aviso de
   simulación y pulse **Confirmar pago piloto**.
6. Muestre comprobante, artículos/precios emitidos y carrito vacío. Recargue
   `/confirmacion`: se recupera la orden si Storage permitió guardarla. Una
   edición posterior del catálogo no reescribe ese comprobante histórico.

Envío gratis desde $25.000, también en retiro en este piloto. No lo presente como
política nueva de reparto. No existen reserva/descuento de stock ni cobro real.

### Registro e ingreso público

1. Abra crear cuenta. Use nombre `Persona de Prueba`, correo `prueba@gmail.com`,
   móvil ficticio de formato `+56 9 1234 5678`, comuna `Santiago`, contraseña y
   confirmación `PruebaDemo123`.
2. RUT de ejemplo didáctico: **12.345.678-5**. No identifica a una persona de la
   presentación: se usa exclusivamente para demostrar el cálculo. El algoritmo
   multiplica desde la derecha por 2,3,4,5,6,7 y repite; la suma es 138, resto 6,
   por lo tanto 11−6 = **5**. La prueba `Validaciones.spec.js` verifica este valor.
   Dígito correcto no prueba existencia ni titularidad de un RUT.
3. Primero cambie el dígito a 9 o la confirmación; muestre errores asociados.
   Corrija, cree cuenta y siga el enlace a iniciar sesión.
4. Ingrese, muestre saludo y cierre sesión. La contraseña admite 8–64 caracteres
   y no se guarda nueva en texto plano; PBKDF2 local no es seguridad de servidor.

### Administración y datos compartidos

1. Ingrese por `/admin` con la cuenta administrativa. Muestre resumen de productos
   y usuarios; las proporciones por categoría son una tabla, no un gráfico externo.
2. En **Productos**, edite el precio de arroz a 2000 y guarde. Abra catálogo y
   agregue arroz: el carrito ahora usa $2.000 por unidad sin recargar.
3. En **Usuarios**, cree `Otra Persona` / `otra@gmail.com` / `OtraDemo123`, rol
   cliente. El panel no inventa RUT/datos de despacho para esta cuenta.
4. Cierre sesión e ingrese por `/login` con la cuenta nueva. Eso demuestra que
   administración y tienda comparten usuarios. No puede ingresar cliente por
   `/admin` ni administrador por el login público.
5. Explique que la contraseña vacía en edición conserva la credencial, y que
   eliminar/degradar al último administrador o a la propia cuenta está bloqueado.

Termine con contacto: **Validar mensaje** no envía correo. Muestre quiénes somos;
la integración futura POS indicada en visión no está implementada.

## 3. Distribución sugerida entre tres integrantes

La presentación tiene **60% de ponderación** y requiere comprensión individual.
No basta memorizar solo la parte asignada. Complete nombres sin inventarlos.

| Integrante | Recorrido principal | Debe poder explicar |
| --- | --- | --- |
| Completar por el equipo (1) | Navegación, catálogo y carrito | Props, eventos, filtros, estado compartido y cálculos |
| Completar por el equipo (2) | Formularios, registro y administración | Validaciones, roles locales, asincronía y persistencia |
| Completar por el equipo (3) | Compra, pruebas y documentos | Orden simulada, Jasmine/Karma/RTL y límites de cobertura |

Todos deben poder seguir un cambio desde el evento hasta el estado y el DOM,
explicar una prueba y reconocer una limitación. Ensayen preguntas cruzadas.

## 4. Atomic Design con archivos existentes

Rutas relativas a `frontend/src/`:

| Nivel | Ejemplos reales | Responsabilidad |
| --- | --- | --- |
| Átomo | `componentes/atomos/Boton.jsx`, `CampoEntrada.jsx`, `MensajeError.jsx` | Un control o mensaje básico |
| Molécula | `componentes/moleculas/CampoFormulario.jsx`, `TarjetaProducto.jsx` | Combinar etiqueta/campo/error o datos/botón |
| Organismo | `componentes/organismos/FormularioRegistro.jsx`, `ListaProductos.jsx`, `TablaUsuarios.jsx` | Una sección completa con controles relacionados |
| Plantilla | `componentes/plantillas/PlantillaTienda.jsx`, `PlantillaAdministracion.jsx` | Estructura y navegación compartidas |
| Página | `paginas/PaginaCatalogo.jsx`, `PaginaPanelAdministracion.jsx` | Coordinar datos y secciones para una ruta |

Atomic Design es una forma de ordenar responsabilidades, no cinco aplicaciones.
La reutilización evita copiar validaciones/controles entre formularios.

## 5. React: explicar antes de mostrar código

- **Props:** datos o funciones recibidos del padre. `TarjetaProducto` recibe
  `producto` y `alAgregar`; no modifica un objeto de producto por su cuenta.
- **Estado:** `useState` conserva valores de formulario o búsqueda entre renders.
  Cambiarlo provoca que React actualice la pantalla.
- **Eventos:** `onChange` actualiza valores, `onSubmit` valida y `onClick` llama una
  operación. `preventDefault` evita la navegación de envío HTML tradicional.
- **useEffect:** carga cuentas con limpieza de cancelación y persiste cambios de
  productos/carrito. No se consulta Storage en cada render para decidir la UI.
- **useContext:** `useProductos`, `useCarrito`, `useUsuarios` y `useCompra` consumen
  proveedores comunes. El catálogo y el panel ven la misma fuente de productos.
- **useRef:** bloquea confirmaciones inmediatas o recuerda una apertura sin exigir
  render. El panel no cierra una edición nueva cuando termina PBKDF2 anterior.
- **Rutas:** `BrowserRouter` en ejecución y `MemoryRouter` en pruebas. Se usan
  `useNavigate` y `useSearchParams`; **no está implementado useParams** ni hay una
  página de detalle `/producto/:id`. No lo anuncie como función del proyecto.

### Props y evento: fragmento real de TarjetaProducto.jsx

```jsx
export default function TarjetaProducto({ producto, alAgregar }) {
  function agregarProductoSeleccionado() {
    alAgregar(producto.id);
  }
```

Este es un fragmento, no un archivo completo. El botón del componente recibe
`agregarProductoSeleccionado`; el padre proporciona la operación del carrito.
Se pasa una función, no el resultado de ejecutarla durante el render.

### Formulario controlado: fragmento real de FormularioProducto.jsx

```jsx
function cambiarCampo(evento) {
  const nuevosValores = { ...valores, [evento.target.name]: evento.target.value };
  establecerValores(nuevosValores);
  establecerMensajeError('');
  if (Object.keys(errores).length > 0) {
    establecerErrores(validarProducto(nuevosValores));
  }
}
```

`CampoFormulario` recibe `valor={valores.nombre}` y `alCambiar={cambiarCampo}`.
React conserva el valor y la función pura `validarProducto` devuelve mensajes por
campo. El formulario usa `noValidate`: la aplicación controla sus mensajes, no
los avisos automáticos del navegador. Etiqueta/error se enlazan en la molécula.

### Efecto y helper reutilizable: ContextoProductos.jsx

```jsx
useEffect(function persistirProductos() {
  if (!guardarDatos(claveProductos, productos)) {
    establecerPersistenciaDisponible(false);
  }
}, [productos]);
```

El efecto responde a cambios de productos. `guardarDatos` encapsula JSON/Storage
y devuelve false ante fallos; no convierte Storage en una transacción.
`formatearMoneda` usa Intl con moneda CLP, `calcularTotales` concentra la regla de
envío, y los validadores puros se reutilizan en formularios y contextos.

### Bootstrap y CSS propio

`className="row g-4"` o `className="btn btn-primary"` utiliza clases Bootstrap
importadas en `main.jsx`; JSX usa `className`, no `class`. `estilos/estilos.css`
contiene reglas propias como `.tarjeta-producto`, `.logo-tienda`, foco visible y
adaptación de navegación. `table-responsive` permite desplazamiento horizontal
cuando una tabla no cabe; no sustituye revisar visualmente el diseño.

## 6. Explicar una prueba: preparar, actuar, comprobar

Fragmento real de `pruebas/CatalogoCarrito.spec.jsx`:

```jsx
renderizarTienda('/catalogo?categoria=Bebidas');
expect(screen.getByLabelText('Categoría').value).toBe('Bebidas');
expect(screen.getAllByRole('article').length).toBe(3);
fireEvent.change(screen.getByLabelText('Categoría'), {
  target: { value: 'Snacks' }
});
expect(screen.getAllByRole('article').length).toBe(2);
```

**Arrange:** preparar la ruta/catálogo; **Act:** cambiar la categoría;
**Assert:** comprobar que el DOM muestra dos productos. `screen` y `fireEvent`
son herramientas RTL; `expect(...).toBe(...)` es Jasmine; Karma ejecuta el caso
en Chrome. No es Vitest.

Un spy observa o sustituye un método. `spyOn(Storage.prototype, 'setItem')` permite
contar escrituras o provocar «sin espacio». Un mock es un reemplazo controlado,
como Storage inyectado con `jasmine.createSpyObj`. Se usan para errores difíciles
de provocar manualmente y Jasmine restaura sus spies al terminar cada prueba.
Las pruebas criptográficas usan PBKDF2 real; solo consumidores concretos simulan
fallos o demoran la derivación. No se debe anunciar una criptografía simulada
como prueba del algoritmo real.

En código asíncrono use consultas `findBy...` y `act`; dentro de `waitFor`, lance
error si todavía no se cumple la condición. Un `expect` Jasmine aislado puede
registrar fallo sin provocar reintento. La prueba nueva de StrictMode observa dos
montajes del efecto, una limpieza, dos cuentas iniciales y una cuenta registrada
que logra ingresar, sin duplicados ni escritura de la inicialización cancelada.

## 7. Diez preguntas probables

1. **¿Por qué React y no manipular el HTML directamente?** Los componentes
   representan el estado; eventos cambian ese estado y React actualiza el DOM.
   No se ejecutan los scripts heredados para controlar estos formularios.
2. **¿Qué diferencia hay entre props y estado?** Props vienen del padre; estado
   pertenece al componente/proveedor y cambia mediante su función actualizadora.
3. **¿Cómo comparte datos el administrador con la tienda?** Ambos están dentro
   de los mismos proveedores; no existe una lista administrativa paralela.
4. **¿Por qué no guardar precio en el carrito?** Así usa el precio vigente del
   catálogo; la orden emitida sí conserva una copia histórica de artículos/precios.
5. **¿Cómo valida el registro?** Funciones puras comprueban campos, módulo once,
   dominios/comunas, confirmación y contraseña 8–64; muestran errores asociados.
6. **¿PBKDF2 hace seguro el panel?** No. Evita claves nuevas en claro, pero el
   navegador y los roles locales son manipulables; falta autorización de servidor.
7. **¿Qué pasa si localStorage falla?** Sigue en memoria y avisa. Recargar puede
   perder cambios o recuperar registros antiguos; no hay transacciones.
8. **¿Qué impide pagar dos veces?** Un ref bloquea llamadas inmediatas y una orden
   guardada reconoce el borrador consumido. No es idempotencia bancaria ni garantía
   entre pestañas o recargas cuando tampoco se guardó la orden.
9. **¿Cuál es la diferencia entre Jasmine, Karma, RTL y Vite?** Jasmine afirma y
   organiza; Karma ejecuta en Chrome; RTL interactúa con componentes/DOM; Vite sirve
   y compila la app. Ninguno implica que aquí se use Vitest.
10. **¿Qué demuestra 95,58% de líneas?** Que se ejecutaron 910/952 líneas
    instrumentadas de 57 módulos importados. No prueba apariencia, despliegue,
    CSS, main, seguridad ni funciones que no existen.

## 8. Cerrar con evidencia, no promesas

Muestre [ERS](ERS.md) y [testing](COBERTURA_TESTING.md). La verificación
independiente tras la limpieza confirmó test/cobertura 124/124, 57 módulos
importados y build de 88 módulos, salida 0. La instalación de 422 paquetes fue
verificada previamente. El empaquetado no vuelve a ejecutar npm ni la aplicación
extraída. StrictMode y la protección de aperturas asíncronas fueron inspeccionados
independientemente; los RED históricos no fueron reproducidos por el verificador.

Las tres capturas actuales renovadas muestran solo sus viewports, no toda la
interfaz; el mapa histórico es borroso y el formulario de contacto no aparece en
el recorte. Las rutas `/`, `/catalogo` y `/contacto` dieron HTTP 200 en preview
local, no en despliegue público. Windows, teclado/contraste y despliegue externo
siguen pendientes. No afirme auditoría formal ni aprobación nativa.

Paquete solo React: `entrega/Stock-Stock-Market-Evaluacion-2.zip`. Extraiga su
carpeta interna y lea `LEEME_EVALUACION_2.md`. Muestre el informe en
`evidencias/cobertura/index.html` y los PNG en `evidencias/capturas/`.
La aplicación anterior no se incluye. El inventario y los controles del escritor
están en `entrega/CONTENIDO_ENTREGA.md`, fuera del ZIP; su verificación independiente
queda pendiente.

Complete nombres y URL pública de GitHub; publicar no está autorizado. La pauta
exige ERS y testing/cobertura, no PDF; exportar es opcional y no se realizó.
El pendrive y el ZIP no reemplazan GitHub ni completan toda la pauta.
