# Datos de prueba

- **`data-sign-up-account.json`** — datos válidos del formulario "Enter Account Information".
  `name` y `password` no están acá: salen del `.env` (`SIGNUP_NAME` y `LOGIN_PASSWORD`), para no
  versionar credenciales.

- **`data-sign-up-required-fields.json`** — los campos obligatorios que se prueban uno por uno
  en `tests/sign-up/required-fields-sign-up.spec.js`. Es un array plano de casos: cada entrada
  genera un test.

- **`data-clothes.json`** — los 4 productos que compra
  `tests/shopping/valid-shopping.spec.js`. `clotheId` es el `data-product-id` del sitio,
  y `clothePrice` el precio esperado en el carrito.

  Los precios tienen que coincidir con los del sitio: el test afirma el precio y el subtotal de
  cada producto, y el total contra la suma calculada (no hay total hardcodeado). Si el sitio
  cambia un precio, el test falla acá a propósito — corregí el JSON, no la aserción.

  Los datos de tarjeta del pago no están en este archivo: salen del `.env`
  (`CARD_NAME`, `CARD_NUMBER`, `CARD_CVC`, `CARD_MONTH`, `CARD_YEAR`).

- **`data-login-user-web-browser.json`** — un usuario por navegador (`chromium`, `firefox`,
  `webkit`) para `tests/shopping/valid-shopping.spec.js`.

  El motivo: ese test **registra** la cuenta y la usa hasta el final de la compra. Con un email
  único, el segundo navegador que llegara chocaría con "Email Address already exist!" — por eso
  antes estaba limitado a chromium. El fixture `shoppingAccount` busca la entrada cuyo
  `web_browser` coincide con el navegador que está corriendo, así que las tres cuentas conviven
  y el test corre en paralelo en los tres. Si agregás un proyecto con otro navegador, el fixture
  falla con un mensaje claro hasta que le sumes su entrada acá.

- **`data-internet-credentials.json`** — usuario y password de
  `the-internet.herokuapp.com`, que usan los 7 specs de `tests/authentication/` y
  `tests/authentication-two-factor/`.

  Están versionadas a propósito y **no** en el `.env`: el propio sitio las publica en sus
  páginas de login, así que no son un secreto, y de esta forma el proyecto corre sin configurar
  nada extra. Las credenciales de automationexercise sí siguen en el `.env`, porque esas son
  tuyas.

  Lo que sí vive en el `.env` de este sitio es la URL: `INTERNET_URL`. Cada grupo de proyectos
  de `playwright.config.js` declara su propio `baseURL`, así que estos specs corren contra
  the-internet y los demás contra automationexercise.

## Campos obligatorios que quedan fuera a propósito

Verificado contra el formulario real del sitio:

- **`email`** — es `required`, pero el input viene `disabled` y precargado con el email del
  signup. No hay forma de vaciarlo desde la UI.
- **`country`** — es `required`, pero su `<select>` no tiene opción vacía: arranca en "India".
  Nunca puede quedar sin valor.
- **`days` / `months` / `years`** — muestran asterisco pero **no** son `required` en el HTML.
  Dejarlos vacíos no bloquea el envío, así que un test que los trate como obligatorios fallaría.
