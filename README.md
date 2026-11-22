# Proyecto Final — QA Testing

Proyecto final del curso de QA Testing (TECSUP). Tiene dos partes: la **documentación de
calidad** del caso de estudio (`docs/`) y una **suite de pruebas automatizadas** con Playwright
(`pruebasAutomatizadas/01 Playwright/`).

## Estructura del repositorio

| Carpeta                               | Contenido                                    |
| ------------------------------------- | -------------------------------------------- |
| `docs/01 Alcance de Calidad`          | Documento de alcance de calidad              |
| `docs/02 Clase de Equivalencias`      | Clases de equivalencia e informe             |
| `docs/03 Casos Pruebas Manuales`      | Casos de prueba manuales                     |
| `docs/04 Sesión Exploratoria`         | Notas de la sesión exploratoria              |
| `docs/05 Plan de Pruebas`             | Plan de pruebas                              |
| `docs/06 Matriz de Trazabilidad`      | Matriz de trazabilidad                       |
| `docs/07 Tabla de Decision`           | Tabla de decisión                            |
| `docs/08 Reporte de Defectos`         | Reporte de defectos                          |
| `evidencias/`                         | Evidencias de ejecución                      |
| `pruebasAutomatizadas/01 Playwright/` | Suite automatizada (Playwright + JavaScript) |

## Pruebas automatizadas

La suite vive en `pruebasAutomatizadas/01 Playwright/` y corre con Playwright sobre dos sitios
publicos de practica:

- **[automationexercise.com](https://www.automationexercise.com/)** - registro de cuenta, campos
  obligatorios y flujo completo de compra.
- **[the-internet.herokuapp.com](https://the-internet.herokuapp.com/)** - login y login con
  autenticacion de doble factor.

Son 60 pruebas (56 pasan, 4 en skip a proposito) repartidas en 6 proyectos: chromium, firefox y
webkit por cada sitio.

Para instalarla, configurar el `.env` y correrla, ver su propio README:
[`pruebasAutomatizadas/01 Playwright/README.md`](pruebasAutomatizadas/01%20Playwright/README.md).
