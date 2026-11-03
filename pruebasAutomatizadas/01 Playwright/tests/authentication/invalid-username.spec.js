import { test, expect } from "../fixtures";

test.describe("Validar Usuario en Inicio de Sesion Normal", () => {
  test("usuario inválido", async ({ loginPage, credentials }) => {
    await loginPage.login("incorrectUser", credentials.password);
    await expect(loginPage.usernameError).toBeVisible();
    await expect(loginPage.page).toHaveURL(/login/);
  });
});
