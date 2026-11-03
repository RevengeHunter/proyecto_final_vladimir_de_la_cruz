import { test, expect } from "../fixtures";

test.describe("Validar Usuario en Inicio de Sesion de Doble Factor", () => {
  test("usuario inválido", async ({ loginPageTwoFactor, credentials }) => {
    await loginPageTwoFactor.login("incorrectUser", credentials.password);
    await expect(loginPageTwoFactor.wrongCredentialsMessage).toBeVisible();
    await expect(loginPageTwoFactor.page).toHaveURL(/two_factor/);
  });
});
