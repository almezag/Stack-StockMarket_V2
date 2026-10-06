# Ejecutar la segunda evaluación de Stock & Stock Market

La versión React del mismo proyecto está en **[frontend/](frontend/README.md)**.
Es la única aplicación: los HTML y recursos antiguos se retiraron de la raíz.
El [README raíz](README.md) ahora presenta React. Para evaluar, use esta guía.

## Inicio rápido

Instale Node.js y npm; para las pruebas, también Google Chrome. Abra una terminal
en la raíz de la copia del proyecto:

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

Abra la URL que muestra Vite. **No abra `index.html` con doble clic**: esta
aplicación necesita un servidor. La instalación inicial requiere acceso al
registro npm; copiarla a un pendrive no instala Node ni las dependencias.

## Qué leer y entregar

| Archivo | Para qué sirve |
| --- | --- |
| [frontend/README.md](frontend/README.md) | Instalación, comandos Linux/Windows, cuentas de prueba y límites |
| [ERS](frontend/documentacion/ERS.md) | Requisitos de la versión implementada y criterios de aceptación |
| [Cobertura y testing](frontend/documentacion/COBERTURA_TESTING.md) | Casos reales, resultados reproducibles y aspectos pendientes |
| [Guía de presentación](frontend/documentacion/GUIA_PRESENTACION.md) | Recorrido y explicación del código para el equipo |

La pauta (páginas 3–4) requiere **repositorio público de GitHub, frontend
comprimido, ERS y documento de testing/cobertura**, pero **no exige formato PDF**.
Exportar a PDF puede ser útil o hacerse si lo pide el docente; no hay PDF generado.
El equipo debe completar nombres y URL pública. La publicación no está autorizada.

**Paquete solo React:** `entrega/Stock-Stock-Market-Evaluacion-2.zip`.
Extraiga `Stock-Stock-Market-Evaluacion-2/` y ejecute los comandos anteriores
desde esa carpeta. Incluye frontend, guías, informe en `evidencias/cobertura/`
y tres PNG en `evidencias/capturas/`; no incluye la aplicación anterior,
dependencias instaladas ni `dist/`. El inventario y los controles del escritor
están en `entrega/CONTENIDO_ENTREGA.md`, fuera del ZIP. La verificación
independiente del paquete queda pendiente. Un pendrive no reemplaza GitHub.

Verificación independiente tras la limpieza en Linux: **124/124** en test y
cobertura de **57 módulos fuente importados**, build de **88 módulos**, salida 0.
La instalación desde lockfile de 422 paquetes fue verificada antes de la limpieza,
no durante el empaquetado. Consulte [testing](frontend/documentacion/COBERTURA_TESTING.md).
Las tres capturas actuales fueron renovadas e inspeccionadas: inicio móvil,
catálogo escritorio y contacto tablet. Solo muestran sus porciones visibles;
el mapa histórico es borroso y el formulario de contacto queda fuera del recorte.
Las rutas `/`, `/catalogo` y `/contacto` dieron HTTP 200 en preview local, no en
un despliegue público. Windows, teclado/contraste y despliegue externo pendientes.
No se afirma aprobación nativa ni cumplimiento de todos los entregables.
