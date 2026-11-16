import { test, expect } from "../fixtures";
import internetCredentials from "../../test-data/data-internet-credentials.json";

test.describe("Validar Contraseña en Inicio de Sesion Normal", () => {
  test("contraseña inválida", async ({ loginPage }) => {
    await loginPage.login(internetCredentials.username, "incorrectPassword");
    await expect(loginPage.passwordError).toBeVisible();
    await expect(loginPage.page).toHaveURL(/login/);
  });
});
