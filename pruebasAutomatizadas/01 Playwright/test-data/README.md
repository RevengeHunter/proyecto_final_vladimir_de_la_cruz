# Datos de prueba

- **`data-sign-up-account.json`** — datos válidos del formulario "Enter Account Information".
  `name` y `password` no están acá: salen del `.env` (`SIGNUP_NAME` y `LOGIN_PASSWORD`), para no
  versionar credenciales.

- **`data-sign-up-required-fields.json`** — los campos obligatorios que se prueban uno por uno
  en `tests/sign-up/required-fields-sign-up.spec.js`. Es un array plano de casos: cada entrada
  genera un test.

## Campos obligatorios que quedan fuera a propósito

Verificado contra el formulario real del sitio:

- **`email`** — es `required`, pero el input viene `disabled` y precargado con el email del
  signup. No hay forma de vaciarlo desde la UI.
- **`country`** — es `required`, pero su `<select>` no tiene opción vacía: arranca en "India".
  Nunca puede quedar sin valor.
- **`days` / `months` / `years`** — muestran asterisco pero **no** son `required` en el HTML.
  Dejarlos vacíos no bloquea el envío, así que un test que los trate como obligatorios fallaría.
