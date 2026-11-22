# Suite automatizada — Playwright

Pruebas end-to-end escritas con [Playwright](https://playwright.dev/) y JavaScript, sobre dos
sitios públicos de práctica:

- **[automationexercise.com](https://www.automationexercise.com/)** — registro de cuenta, campos
  obligatorios y flujo completo de compra.
- **[the-internet.herokuapp.com](https://the-internet.herokuapp.com/)** — login y login con
  autenticación de doble factor.

Las cifras de la última corrida —cantidad de pruebas, tiempos y reparto por proyecto— están en
[Métricas](#métricas). Los skips son a propósito y se explican en
[Decisiones y límites](#decisiones-y-límites).

## Requisitos

- Node.js 18 o superior
- `@playwright/test` ^1.64 y `dotenv` ^18 (se instalan con `npm install`)
- `allure-playwright` ^3.14 y `allure-commandline` ^2.46 para el informe (idem)
- **Un JDK en el PATH**: `allure` es una herramienta Java. Sin eso las pruebas corren igual, pero
  `npm run report` no genera nada

## Puesta en marcha

```powershell
npm install
npx playwright install          # descarga chromium, firefox y webkit
Copy-Item .env.example .env     # en bash: cp .env.example .env
```

Después completá el `.env` con tus valores. **El `.env` no se versiona** (está en el
`.gitignore`): no lo subas al repositorio.

| Variable                                                          | Para qué                                         |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| `BASE_URL`                                                        | URL de automationexercise                        |
| `INTERNET_URL`                                                    | URL de the-internet                              |
| `LOGIN_USERNAME`, `LOGIN_PASSWORD`                                | Credenciales de tu cuenta de automationexercise  |
| `SIGNUP_NAME`, `SIGNUP_EMAIL`                                     | Nombre y email con los que se registra la cuenta |
| `CARD_NAME`, `CARD_NUMBER`, `CARD_CVC`, `CARD_MONTH`, `CARD_YEAR` | Datos de tarjeta **ficticios** para el pago      |

Las credenciales de the-internet (`tomsmith` / `SuperSecretPassword!`) **no** van acá: el propio
sitio las publica en sus páginas de login, así que viven versionadas en `test-data/`. El detalle
de cada archivo de datos está en [`test-data/README.md`](test-data/README.md).

## Cómo correr

```powershell
npm test                                              # toda la suite (~3,5 min)
npm run test:compras                                  # los 3 navegadores de automationexercise
npm run test:auth                                     # los 3 navegadores de the-internet
npx playwright test tests/shopping                    # una carpeta
npx playwright test --project=the-internet-chromium   # un proyecto
npx playwright test --project="automationexercise-*"  # el flag acepta globs
npx playwright test --list                            # qué spec cae en qué proyecto, sin ejecutar
```

Los dos scripts por sistema son ese glob y nada más: `test:compras` es
`--project="automationexercise-*"` y `test:auth` es `--project="the-internet-*"`.

**No pases `--reporter=...` en la línea de comandos**: reemplaza la lista completa del config y deja
a Allure afuera, así que la corrida no produce informe.

Para depurar: `--headed` abre el navegador, `--debug` lo corre paso a paso y `--ui` abre el modo
interactivo.

El tiempo lo manda `timeout-two-factor`, que espera de verdad los 180 s que el servidor le da al
código de doble factor. Si querés una corrida rápida, saltealo:

```powershell
npx playwright test --grep-invert "expirado"
```

## Reportes

Cada corrida deja estas salidas, todas fuera del repositorio (están en el `.gitignore`):

| Salida                     | Qué es                                                 |
| -------------------------- | ------------------------------------------------------ |
| `allure-results/`          | Resultados crudos; es la **entrada** del informe       |
| `allure-report/`           | El informe navegable, generado a partir de lo anterior |
| `reportes/resultados.json` | La misma corrida en JSON, para leerla con un script    |
| `evidences/`               | Captura, video y traza de los tests que fallaron       |

Generar el informe son **dos pasos**, y a propósito: en npm un `&&` corta si el comando anterior
falla, y un test rojo es justo cuando más se quiere el informe.

| Qué querés                          | Comandos                                          |
| ----------------------------------- | ------------------------------------------------- |
| Informe de toda la suite            | `npm test` y después `npm run report`             |
| Informe solo del sistema de compras | `npm run test:compras` y después `npm run report` |
| Informe solo de autenticación       | `npm run test:auth` y después `npm run report`    |
| Abrir el informe ya generado        | `npm run report:open`                             |
| Verlo sin generar carpeta           | `npm run report:serve`                            |
| Borrar resultados e informe         | `npm run report:clean`                            |

### Cada corrida arranca de cero

Allure **no** limpia `allure-results`: su writer solo crea la carpeta, nunca borra. Dos corridas
seguidas se sumarían, así que el informe "de un sistema" saldría con los tests del otro adentro y
con los fallos de la corrida anterior revividos. Por eso el config declara:

```js
globalSetup: "./clean-allure-results.js",
```

que vacía la carpeta antes de cada corrida. La contrapartida: **el informe de toda la suite sale de
una corrida de toda la suite**, no de dos corridas parciales encadenadas.

Un detalle que confunde: `--list` también escribe resultados (lista los tests y los marca como
omitidos) y **no** pasa por el `globalSetup`. Si generás el informe justo después de un `--list`,
aparecen pruebas fantasma; se arregla corriendo la suite de nuevo.

### Dónde se ve la separación de los dos sistemas

| Pestaña        | Cómo queda agrupado                                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Behaviors**  | Dos _epics_: "Sistema de compras - automationexercise" y "Autenticacion - the-internet", y dentro un _feature_ por carpeta de specs |
| **Suites**     | Los 6 proyectos de Playwright (`automationexercise-chromium`, `the-internet-webkit`, ...)                                           |
| **Categories** | Los fallos por causa: cuenta duplicada, locator ambiguo, espera agotada, sitio caído o red                                          |

El _epic_ y el _feature_ los pone un fixture `auto` en `tests/fixtures.js`: mira
`testInfo.project.name` para saber el sistema, y el nombre de la carpeta del spec para el feature.
Al ser `auto` alcanza a los 14 specs sin que ninguno tenga que pedirlo, y el `parentSuite` con el
nombre del proyecto ya lo pone el reporter solo.

**Environment** muestra las dos URLs, la versión de Node y el sistema operativo. **Del `.env` no
llega nada más que esas dos URLs públicas**: las credenciales no se publican en el informe.

## Métricas

<!-- metricas:inicio -->

> Corrida del 2026-11-22 00:05 · **66 pruebas** en **5 min 38 s** · 62 pasan · 0 fallan · 4 en skip

| Proyecto                      | Pruebas | Pasan  | Fallan | Skip  | Suma de duraciones |
| ----------------------------- | ------- | ------ | ------ | ----- | ------------------ |
| `automationexercise-chromium` | 15      | 15     | 0      | 0     | 2 min 20 s         |
| `automationexercise-firefox`  | 15      | 14     | 0      | 1     | 2 min 29 s         |
| `automationexercise-webkit`   | 15      | 14     | 0      | 1     | 3 min 07 s         |
| `the-internet-chromium`       | 7       | 7      | 0      | 0     | 3 min 42 s         |
| `the-internet-firefox`        | 7       | 6      | 0      | 1     | 51 s               |
| `the-internet-webkit`         | 7       | 6      | 0      | 1     | 35 s               |
| **Total**                     | **66**  | **62** | **0**  | **4** | **5 min 38 s**     |

<!-- metricas:fin -->

La tabla la arma `metrics.js` leyendo `reportes/resultados.json`, que escribe cada corrida. Para
actualizarla:

```powershell
npm test                 # la suite completa: con un solo sistema los números mienten
npm run metrics          # imprime la tabla, no toca nada
npm run metrics:write    # la deja acá arriba, entre los marcadores
```

`metrics:write` **se niega a escribir si la última corrida fue parcial** (menos de los 6
proyectos), para que no terminen en el README los números de medio sistema haciéndose pasar por
los de la suite.

Dos aclaraciones sobre los tiempos, porque `fullyParallel` está activo:

- **El total es tiempo de reloj** (`stats.duration`): lo que tardó la corrida de punta a punta.
- **Las filas son la suma de las duraciones** de las pruebas de ese proyecto. Esa suma da más que
  el total, y está bien: los proyectos corren a la vez.

Para contar las pruebas sin ejecutar nada:

```powershell
npx playwright test --list --reporter=list
```

## Un `baseURL` por sitio

`playwright.config.js` define **6 proyectos**: tres navegadores por cada sitio. El reparto de
specs lo hace un glob sobre la ruta del archivo:

```js
const theInternetTests = "**/authentication*/**";
```

Los proyectos `the-internet-*` lo usan como `testMatch` y los `automationexercise-*` como
`testIgnore`, y cada grupo declara su propio `baseURL`. Consecuencias prácticas:

- **El sitio de un spec lo decide la carpeta donde está el archivo**, no algo escrito dentro del
  spec. En `tests/authentication*/` corre contra the-internet; en cualquier otra carpeta de
  `tests/`, contra automationexercise.
- `baseURL` **no** está en el `use` global, así que ningún spec hereda un sitio por descuido.
- Los page objects navegan siempre relativo (`page.goto("products")`). No hay ninguna URL
  absoluta en `tests/` ni en `pages/`.
- Los `test.skip` por `browserName` siguen funcionando igual: `browserName` es el navegador del
  proyecto (`chromium` / `firefox` / `webkit`), no su nombre.

## Qué cubre cada spec

### `tests/authentication/` — login en the-internet

| Spec                        | Qué valida                                           |
| --------------------------- | ---------------------------------------------------- |
| `valid-credentials.spec.js` | Login correcto: llega a `/secure` y ve "Secure Area" |
| `invalid-username.spec.js`  | Usuario inválido: "Your username is invalid!"        |
| `invalid-password.spec.js`  | Contraseña inválida: "Your password is invalid!"     |

### `tests/authentication-two-factor/` — doble factor en the-internet

| Spec                                  | Qué valida                                                      |
| ------------------------------------- | --------------------------------------------------------------- |
| `valid-login-two-factor.spec.js`      | Login + código vigente: entra al área segura                    |
| `invalid-username-two-factor.spec.js` | Usuario inválido: no llega a pedir el código                    |
| `invalid-password-two-factor.spec.js` | Contraseña inválida: no llega a pedir el código                 |
| `timeout-two-factor.spec.js`          | Código expirado tras 180 s: vuelve a `/two_factor` con el error |

### `tests/sign-up/` — registro en automationexercise

| Spec                              | Qué valida                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `valid-sign-up.spec.js`           | Registro completo, datos precargados del login al signup, y borrado de la cuenta |
| `required-fields-sign-up.spec.js` | 9 pruebas, una por campo obligatorio vaciado: el envío queda bloqueado           |

### `tests/shopping/` — carrito y compra en automationexercise

| Spec                                 | Qué valida                                                               |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `valid-shopping.spec.js`             | Compra de 4 productos: carrito, revisión del pedido, pago y confirmación |
| `delete-product-checkout.spec.js`    | Borra un producto y comprueba, recargando, que el borrado es real        |
| `request-login-for-checkout.spec.js` | Usuario anónimo: el checkout exige iniciar sesión primero                |

### `tests/search-product/` — búsqueda en automationexercise

| Spec                              | Qué valida                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `text-search-product.spec.js`     | Busca "shirts" esperando la respuesta de la navegación: 200 y trae productos       |
| `category-search-product.spec.js` | Filtra por Kids - Tops & Shirts esperando el cambio de URL a `category_products/5` |

## Organización del código

```
pages/                     Page Objects: un archivo por página, solo locators y acciones
tests/                     Specs agrupados por funcionalidad, más fixtures.js
test-data/                 Datos de prueba en JSON (ver su propio README)
clean-allure-results.js    globalSetup: vacía allure-results antes de cada corrida
metrics.js                 Arma la tabla de métricas desde reportes/resultados.json
```

Convenciones que conviene respetar al agregar pruebas:

- **Los page objects no llevan aserciones.** Exponen locators y métodos; el `expect` vive en el
  spec. `CartTable.js` es la tabla que comparten `/view_cart` y `/checkout`, usada por
  composición (`this.table = new CartTable(page)`), no por herencia.
- **Los fixtures de carrito y checkout no navegan.** Si dos fixtures navegaran, ganaría el último
  en ejecutarse; la navegación la hace el test, explícita.
- **Los datos van en `test-data/`**, no incrustados en el spec. Los valores esperados se derivan
  del JSON: por ejemplo, el total de la compra se calcula con `reduce` en vez de estar
  hardcodeado, así no puede desincronizarse de los precios.
- **Un `for` que llama a `test()`** genera una prueba independiente por caso; es lo que hace
  `required-fields-sign-up.spec.js` con los 9 campos obligatorios.

## Decisiones y límites

- **`valid-shopping` corre en los 3 navegadores** porque cada uno registra su propia cuenta: los
  emails salen de `test-data/data-login-user-web-browser.json`, indexados por navegador. Con un
  email único, el segundo proyecto en llegar chocaría con "Email Address already exist!".
- **Ese test coloca órdenes reales** en el sitio de práctica (3 por corrida completa). Borra la
  cuenta al final, y eso se lleva también la orden.
- **`valid-sign-up` está limitado a chromium** (`test.skip`): todavía usa el `SIGNUP_EMAIL` fijo
  del `.env`, así que no puede registrarse en paralelo. Son 2 de los 4 skips; los otros 2 son
  `timeout-two-factor` en firefox y webkit.
- **La expiración del doble factor se valida en el servidor** (180 s). El reloj falso de
  Playwright (`page.clock`) solo afecta al navegador, así que no sirve acá: hay que esperar de
  verdad, y por eso ese test corre en un solo navegador con `setTimeout(240_000)`.
- **Defecto detectado en automationexercise:** el checkout solo valida la sesión del lado del
  cliente. El modal "Register / Login account to proceed on checkout" lo muestra JavaScript, pero
  un `GET /checkout` sin sesión devuelve **200**. La prueba cubre el comportamiento por la UI.
- **La búsqueda no distingue por código de estado.** Un término sin resultados responde igual
  **200**, con la lista vacía y el mismo heading, y la API (`POST /api/searchProduct`) devuelve
  siempre HTTP 200 con el código real dentro del JSON. No hay ningún 204 que probar, así que el
  spec de búsqueda cubre el caso con datos.
- **La publicidad del sitio se bloquea durante las pruebas.** El intersticial de Google
  (`#google_vignette`) le pone `aria-hidden="true"` al `<body>`: mientras está arriba ningún
  `getByRole` encuentra nada y nada es clickeable, así que la prueba espera hasta agotar el
  timeout. Cerrarlo no es opción: su botón `Close ad` vive dentro de un iframe de doubleclick y los
  locators de Playwright no atraviesan iframes. El fixture `blockAds` de `tests/fixtures.js` aborta
  las peticiones a los dominios de anuncios, así que el anuncio no llega a existir. **Lo que se
  pierde:** las pruebas ya no ven la página exactamente como la ve un usuario real.
- **Un reintento en local** (`retries: 1`, y 2 en CI). El sitio de práctica devuelve Cloudflare
  **520** cada tanto y tumba pruebas que están bien escritas. Con el reintento esa corrida se
  recupera sola y la prueba queda marcada **flaky** en el reporte, que es información honesta:
  distingue "falló el sitio" de "la prueba está mal".

## Si algo falla

| Síntoma                                                           | Causa habitual                                                                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `page.goto: Invalid URL`                                          | Falta `BASE_URL` o `INTERNET_URL` en el `.env`                                                                                 |
| "Email Address already exist!"                                    | Una corrida anterior falló a mitad y dejó la cuenta viva. Se borra entrando a `/delete_account` con la sesión abierta          |
| `strict mode violation` al agregar al carrito                     | Cada producto tiene **dos** enlaces `add-to-cart` con el mismo `data-product-id`; el locator hay que acotarlo a `.productinfo` |
| Un locator por rol no encuentra un elemento que se ve en pantalla | Varios `<a>` del sitio no tienen `href`, así que no tienen rol de link: se localizan por texto                                 |
| `npm run report` no genera nada, o se queja de Java               | `allure-commandline` corre sobre la JVM: hace falta un JDK en el PATH                                                          |
| El informe trae pruebas que no se corrieron                       | Un `--list` previo dejó resultados y no pasa por el `globalSetup`: `npm run report:clean` y correr de nuevo                    |
| El informe sale vacío                                             | Se corrió con `--reporter=...` en la línea de comandos, que reemplaza la lista del config y deja a Allure afuera               |
| Una prueba se cuelga hasta el timeout en una página ya cargada    | Un anuncio intersticial tapó la página y la dejó con `aria-hidden="true"`: lo corta el fixture `blockAds`                      |
| `Error code 520` de Cloudflare en la captura del fallo            | El sitio de práctica caído, no la prueba. Allure los junta en la categoría "Sitio caido o red" y el reintento suele salvarla   |
