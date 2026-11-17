# Suite automatizada — Playwright

Pruebas end-to-end escritas con [Playwright](https://playwright.dev/) y JavaScript, sobre dos
sitios públicos de práctica:

- **[automationexercise.com](https://www.automationexercise.com/)** — registro de cuenta, campos
  obligatorios y flujo completo de compra.
- **[the-internet.herokuapp.com](https://the-internet.herokuapp.com/)** — login y login con
  autenticación de doble factor.

Son **66 pruebas** en total: 62 pasan y 4 quedan en skip a propósito (ver
[Decisiones y límites](#decisiones-y-límites)).

## Requisitos

- Node.js 18 o superior
- `@playwright/test` ^1.64 y `dotenv` ^18 (se instalan con `npm install`)

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
npx playwright test                                   # toda la suite (~3,5 min)
npx playwright test tests/shopping --reporter=list    # una carpeta
npx playwright test --project=the-internet-chromium   # un proyecto
npx playwright test --list                            # qué spec cae en qué proyecto, sin ejecutar
npx playwright show-report                            # reporte HTML de la última corrida
```

Para depurar: `--headed` abre el navegador, `--debug` lo corre paso a paso y `--ui` abre el modo
interactivo.

El tiempo lo manda `timeout-two-factor`, que espera de verdad los 180 s que el servidor le da al
código de doble factor. Si querés una corrida rápida, saltealo:

```powershell
npx playwright test --grep-invert "expirado"
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
pages/        Page Objects: un archivo por página, solo locators y acciones
tests/        Specs agrupados por funcionalidad, más fixtures.js
test-data/    Datos de prueba en JSON (ver su propio README)
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

## Si algo falla

| Síntoma                                                           | Causa habitual                                                                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `page.goto: Invalid URL`                                          | Falta `BASE_URL` o `INTERNET_URL` en el `.env`                                                                                 |
| "Email Address already exist!"                                    | Una corrida anterior falló a mitad y dejó la cuenta viva. Se borra entrando a `/delete_account` con la sesión abierta          |
| `strict mode violation` al agregar al carrito                     | Cada producto tiene **dos** enlaces `add-to-cart` con el mismo `data-product-id`; el locator hay que acotarlo a `.productinfo` |
| Un locator por rol no encuentra un elemento que se ve en pantalla | Varios `<a>` del sitio no tienen `href`, así que no tienen rol de link: se localizan por texto                                 |
