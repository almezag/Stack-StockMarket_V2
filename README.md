# Stock & Stock Market — React

La única aplicación del proyecto está en **[frontend/](frontend/README.md)**:
una tienda académica React con catálogo, carrito, cuentas locales, administración
y compras simuladas. No realiza cobros ni envía correos reales.

## Inicio rápido

Con Node.js y npm instalados, desde la raíz:

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

Abra la URL informada por Vite; no abra un HTML con doble clic. La instalación
inicial necesita acceso a npm. Para probar, instale Google Chrome:

```bash
CHROME_BIN=/usr/bin/google-chrome npm --prefix frontend test -- --single-run
npm --prefix frontend run build
```

## Documentación y entrega

- [Guía de evaluación](LEEME_EVALUACION_2.md).
- [Instalación, cuentas de demostración y límites](frontend/README.md).
- [ERS](frontend/documentacion/ERS.md).
- [Testing y cobertura](frontend/documentacion/COBERTURA_TESTING.md).
- [Guía de presentación](frontend/documentacion/GUIA_PRESENTACION.md).

Se retiraron los HTML y recursos de la aplicación anterior de la raíz. React
conserva la procedencia histórica de sus datos y tiene logo/mapa propios en
`frontend/public/imagenes/`, sin depender del directorio antiguo.

**Paquete solo React:** `entrega/Stock-Stock-Market-Evaluacion-2.zip` incluye
fuentes, guías, informe de cobertura y tres capturas actuales, sin la aplicación
anterior. Extraiga `Stock-Stock-Market-Evaluacion-2/` y use los comandos anteriores.
El inventario, tamaño, SHA256 y controles del escritor están en
`entrega/CONTENIDO_ENTREGA.md`, fuera del ZIP; su verificación independiente queda
pendiente. Integrantes y GitHub público siguen por completar.
