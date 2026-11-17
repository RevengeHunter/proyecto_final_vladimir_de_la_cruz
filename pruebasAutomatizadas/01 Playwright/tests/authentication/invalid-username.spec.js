import { test, expect } from "../fixtures";
import internetCredentials from "../../test-data/data-internet-credentials.json";

test.describe("Validar Usuario en Inicio de Sesion Normal", () => {
  test("usuario inválido", async ({ loginPage }) => {
    await loginPage.login("incorrectUser", internetCredentials.password);
    await expect(loginPage.usernameError).toBeVisible();
    await expect(loginPage.page).toHaveURL(/login/);
  });
});
