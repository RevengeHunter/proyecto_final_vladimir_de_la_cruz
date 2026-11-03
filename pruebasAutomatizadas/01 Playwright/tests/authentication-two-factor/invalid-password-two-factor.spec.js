import { test, expect } from "../fixtures";

test.describe("Validar Contraseña en Inicio de Sesion de Doble Factor", () => {
  test("contraseña inválida", async ({ loginPageTwoFactor, credentials }) => {
    await loginPageTwoFactor.login(credentials.username, "incorrectPassword");
    await expect(loginPageTwoFactor.wrongCredentialsMessage).toBeVisible();
    await expect(loginPageTwoFactor.page).toHaveURL(/two_factor/);
  });
});
