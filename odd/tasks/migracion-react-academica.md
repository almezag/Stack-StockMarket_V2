# Migración académica de Stock & Stock Market

## Objetivo y decisiones
Segunda evaluación DSY1104 implementada en `frontend/`, conservando los HTML/assets de la primera evaluación. React, Bootstrap, navegación, formularios y pruebas reales Jasmine/Karma; sin Vitest. Atomic Design proporcionado a los ejemplos docentes.

Nombres propios, comentarios, tests y documentos en español; conservar APIs oficiales. Código explícito, sin abreviaturas innecesarias, funciones comprimidas ni capas empresariales. Registro/login y administración/catálogo integrados. Persistencia local demostrativa: sin backend, stock, pagos reales ni envío real de correos; no guardar tarjeta/CVV/vencimiento ni contraseñas en texto plano.

TDD activado por elección del usuario. Escritores observaron RED funcional, GREEN y triangulación/refactorización; verificadores independientes reprodujeron GREEN, no certifican los RED históricos. Un escritor por etapa, seguimiento del padre.

## Tareas completadas
- [x] T1. Base React, Bootstrap, rutas y Jasmine/Karma. Seis RED funcionales informados y seis pruebas GREEN reproducidas independientemente; build correcto. 374 líneas autoradas iniciales.
- [x] T2. Catálogo/carrito: 18 productos originales, filtros combinados, cantidades/eliminación, precios vigentes y persistencia saneada. Envío $2.990 bajo $25.000, gratis desde ese monto. RED 11/15 informado, GREEN 23/23 independiente con build/cobertura.
- [x] T3. Registro/login/logout: RUT módulo once, teléfono y 16 comunas originales, duplicados, contraseña 8–64, rol público cliente y PBKDF2 real con sal aleatoria/100000 iteraciones. Sesión derivada de usuarios saneados. RED cuatro fallos nuevos informado; GREEN 47/47 y build independientes. Aviso de escritura denegada corregido después.
- [x] T4. Compra invitada, checkout, tarjeta condicional, pago simulado, comprobante recuperable, contacto y contenido original. Campos sensibles no persistidos. RED tres fallos informado; GREEN 72/72 y build independientes. Imágenes Karma y prueba directa de doble confirmación completadas en T5.
- [x] T5. /admin y /panel-administracion separados; CRUD de productos/usuarios compartido con tienda, precios y eliminaciones reflejados en carrito. Autorización posterior a PBKDF2, contraseña anterior invalidada y protección de cuenta propia/último administrador. Usuario aprobó editar Validaciones.spec.js para sesiones administrativas válidas conservando rechazos. RED cinco rutas y límites informado; GREEN 120/120/build independientes.
- [x] T6. ERS, cobertura y guía educativa; prueba real StrictMode y corrección de guardados anteriores que cerraban nuevas ediciones. RED 121/122 informado y GREEN 123/123. Texto final del inicio corregido con RED observado. Se detectó y corrigió una prueba inestable que confundía dígitos de CVV con identificadores temporales: listas de campos y valores exactos con reloj controlado, sin debilitar minimización. Versión final 123/123, build y capturas reproducidos independientemente. ZIP final verificado byte por byte.

## Evidencia final independiente
Entorno Linux: Node 24.21.0, npm 11.19.0, Chrome 154.0.8037.97. Instalación desde lockfile: 422 paquetes, salida 0.
- `npm --prefix frontend ci --no-audit --no-fund`: correcto.
- `CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend test -- --single-run`: 123/123, salida 0.
- `CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend run test:coverage`: 123/123, salida 0.
- `npm --prefix frontend run build`: salida 0, 88 módulos transformados.

Cobertura de 57 módulos fuente importados, no del build completo: sentencias 913/956 (95,50%), ramas 598/635 (94,17%), funciones 210/213 (98,59%), líneas 910/952 (95,58%). Excluye main.jsx, CSS y dependencias. Avisos no bloqueantes de dependencias heredadas y util._extend; sin 404 de imágenes. No se reparó configuración del arnés.

Tres capturas finales inspeccionadas: inicio móvil 390×844, catálogo escritorio 1366×900 y contacto tablet 768×1024. Contenido esperado y navegación adaptable; mapa original borroso. Tres rutas directas HTTP 200 solo en preview local. No equivale a auditoría completa ni despliegue externo.

## Entrega
- ZIP: `entrega/Stock-Stock-Market-Evaluacion-2.zip`.
- 211 archivos, 2.377.311 bytes. CRC correcto, rutas seguras, requeridos presentes y todos los miembros idénticos a sus archivos actuales.
- SHA256: `878e0f8340d7f1f9a0f06b64ba3fd164b3f55f8f484d842f1ead5511199ce89e`.
- Incluye originales, React, pruebas, documentos y evidencias separadas: 76 archivos de cobertura y tres PNG. Excluye node_modules, dist, Git, metadatos del arnés, planes y temporales.
- Entrada: `LEEME_EVALUACION_2.md`; inventario externo `entrega/CONTENIDO_ENTREGA.md`; documentos en `frontend/documentacion/`.
- La pauta requiere documentos ERS/testing, sin especificar PDF. PDF opcional, no generado.

## Límites y pendientes del equipo
Completar integrantes y URL pública de GitHub; la pauta requiere repositorio público, pero el usuario pidió priorizar código/pendrive y no autorizó publicar. El pendrive no reemplaza ese entregable. Windows, teclado/contraste, demás vistas y despliegue externo siguen sin verificar. ZIP íntegro y equivalente a disco, pero no se ejecutó nuevamente desde una extracción. Sin sincronización entre pestañas, transacciones Storage ni seguridad de servidor.

Revisión nativa no disponible/no evaluable (managed_assets_outdated y selección de archivos sin seguimiento); verificación independiente aplicada, sin recibo/aprobación nativa. Git no bloquea desarrollo: rama feat/migracion-react-academica; 18 archivos preparados inicialmente, .gitignore raíz preexistente fuera del índice; commit inicial falló por identidad ausente. Ningún commit creado, sin configurar identidad, push, PR, merge ni operaciones posteriores de Git.

## Próximo paso
Código y documentación preparados para revisión/presentación. El usuario puede copiar la carpeta entrega al pendrive, extraer el ZIP e instalar con npm ci antes de presentar. No hay tareas de implementación abiertas; continuar solo ante una nueva solicitud.
