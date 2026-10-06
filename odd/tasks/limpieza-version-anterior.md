# Limpieza de la versión anterior

## Objetivo autorizado
El usuario pidió explícitamente eliminar la versión antigua y dejar solo la aplicación React. Esta decisión reemplaza la conservación física de los archivos de la primera evaluación acordada durante la migración; no cambia el contenido funcional ni la procedencia histórica de productos/comunas.

## Alcance y límites
Eliminar únicamente los doce HTML antiguos de la raíz (`admin`, `carrito`, `catalogo`, `checkout`, `confirmacion`, `contacto`, `index`, `login`, `pago`, `panelAdmin`, `quienes-somos`, `registro`), `assets/` y `ESTRUCTURA.txt`. Reemplazar `README.md` raíz por una entrada breve a React. Mantener `frontend/`, guías nuevas y `entrega/`.

Preservar `.git/`, `.atl/`, `.gitignore` preexistente y artefactos ODD internos. No configurar identidad, operar Git, publicar ni instalar nuevas dependencias. No comprimir/abreviar el código. Escritura delegada a un único worker, con superficies concretas. Pruebas Jasmine/Karma, TDD activado por decisión previa del usuario.

## Tareas
- [x] L1. Comprobar independencia de React.
  - Mapeo de solo lectura: imports de frontend internos/npm, Vite sin dependencia del legacy, Karma sirve public, logo/mapa propios y tarjetas con emojis. No se encontró dependencia funcional de los recursos antiguos.
- [x] L2. Eliminar legacy y actualizar referencias.
  - Los doce HTML, assets/ y ESTRUCTURA.txt eliminados por el padre mediante borrado mecánico acotado, después de comprobar directorio y copias SHA256 del logo/mapa React. El worker prohíbe borrados; documentación/UI delegadas sin cambiar esa política.
  - README raíz reemplazado por guía React; cinco guías actualizadas y promesa de conservación retirada del inicio. Referencias históricas pertinentes conservadas, sin dependencia funcional.
  - Escritor observó RED 123 correctas/una fallida del nuevo guard DOM, luego GREEN 124/124. Cobertura y build correctos (88 módulos). Métricas iguales: 913/956 sentencias, 598/635 ramas, 210/213 funciones y 910/952 líneas. Ausencia de legacy, recursos React y enlaces de seis documentos comprobados.
  - El ZIP anterior no se encontró en la verificación posterior: entrega/ contiene únicamente CONTENIDO_ENTREGA.md. Su causa no está determinada; no se atribuye a ningún actor. La operación de borrado del padre no incluía entrega/. Las advertencias documentales desactualizadas fueron corregidas al crear el paquete nuevo.
- [x] L3. Verificar aplicación limpia.
  - Verificador independiente reprodujo suite y cobertura 124/124, build 88 módulos y métricas del escritor; no certificó RED histórico. 162 imports y 23 enlaces Markdown correctos, sin dependencia funcional del legacy.
  - Fuentes protegidas sin cambios durante comandos; snapshot ampliado de 84 archivos igual antes/después del navegador. Tres PNG renovados e inspeccionados (390×844, 1366×900, 768×1024); HTTP 200 en /, /catalogo y /contacto. Servidor propio y perfiles temporales limpiados.
  - Capturas muestran solo sus viewports: navegación adaptada, inicio sin promesa anterior, catálogo con 18 productos y mapa original borroso; formulario de contacto fuera del recorte. No auditoría completa.
- [x] L4. Regenerar entrega solo React.
  - ZIP creado en modo exclusivo y seis guías corregidas: 163 miembros (84 proyecto, 76 reporte y tres PNG), 814.915 bytes. SHA256 e1f07b69a9f6ab2e5ecf9c901c0e589e6dc9012be7331f923e5e6d46756145ef. Inventario externo completo; hash no incluido en el ZIP para evitar circularidad.
  - Reporte real tomado de coverage/ mediante lista positiva de ocho recursos y src/**/*.html; lcov-report/ no existe. Bundles de Karma excluidos, junto con legacy, metadatos, ODD, dependencias y dist. Sin cambios en 78 archivos de app/config/pruebas ni 79 evidencias.
  - Comprobación independiente correcta: salida 0 del script de solo lectura, CRC sin errores, exactamente 163 miembros sin extras/omisiones, nombres seguros y archivos ordinarios, igualdad 163/163 a sus orígenes, PNG/dimensiones e inventario externo coherentes. Los 23 enlaces también resuelven dentro del ZIP. Archivos de app/evidencia/paquete sin cambios durante la inspección. Sin extracción ni ejecución desde el ZIP; sin bloqueadores.

## Comprobaciones
Desde raíz:
- `CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend test -- --single-run`.
- `CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend run test:coverage`.
- `npm --prefix frontend run build`.
Capturas con Chrome y servidor preview propio, con limpieza de procesos. No certificar Windows, contraste/teclado o despliegue externo por estos resultados.

Revisión nativa no disponible; assessment actual no evaluable por archivos sin seguimiento sin declaración explícita. Plan fail-closed exige verificador independiente y se aplicó; sin reparar el arnés ni inventar aprobación. No crear commits por esta limpieza. Cambio de entrega: actualizar el ZIP previo en su ruta conocida; no PR ni publicación.

## Estado y siguiente paso
La aplicación actual tenía 123 pruebas/build correctos antes de esta limpieza. ZIP anterior: 211 miembros, 2.377.311 bytes, SHA256 878e0f8340d7f1f9a0f06b64ba3fd164b3f55f8f484d842f1ead5511199ce89e. Datos históricos, no afirmar que corresponden a la futura entrega limpia.

L1–L4 completadas: aplicación React única, 124 pruebas/build y ZIP limpio verificados independientemente. Los integrantes/URL pública de GitHub siguen por completar y publicar no está autorizado. No hay tareas de limpieza abiertas; continuar solo ante una nueva solicitud.
