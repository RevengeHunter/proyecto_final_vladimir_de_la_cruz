import { test, expect } from "../fixtures";

test.describe("Validar Contraseña en Inicio de Sesion Normal", () => {
  test("contraseña inválida", async ({ loginPage, credentials }) => {
    await loginPage.login(credentials.username, "incorrectPassword");
    await expect(loginPage.passwordError).toBeVisible();
    await expect(loginPage.page).toHaveURL(/login/);
  });
});
