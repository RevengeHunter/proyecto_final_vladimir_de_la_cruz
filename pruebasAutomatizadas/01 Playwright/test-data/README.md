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
  (`CARD_NAME`, `CARD_NUMBER`, `CARD_CVC`, `CARD_MONTH`, `CARD_YEAR`), igual que
  `SHOPPING_EMAIL`, que es el email con el que ese test registra su cuenta.

## Campos obligatorios que quedan fuera a propósito

Verificado contra el formulario real del sitio:

- **`email`** — es `required`, pero el input viene `disabled` y precargado con el email del
  signup. No hay forma de vaciarlo desde la UI.
- **`country`** — es `required`, pero su `<select>` no tiene opción vacía: arranca en "India".
  Nunca puede quedar sin valor.
- **`days` / `months` / `years`** — muestran asterisco pero **no** son `required` en el HTML.
  Dejarlos vacíos no bloquea el envío, así que un test que los trate como obligatorios fallaría.
