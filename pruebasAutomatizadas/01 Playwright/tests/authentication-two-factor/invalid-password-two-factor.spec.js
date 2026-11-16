import { test, expect } from "../fixtures";
import internetCredentials from "../../test-data/data-internet-credentials.json";

test.describe("Validar Contraseña en Inicio de Sesion de Doble Factor", () => {
  test("contraseña inválida", async ({ loginPageTwoFactor }) => {
    await loginPageTwoFactor.login(
      internetCredentials.username,
      "incorrectPassword",
    );
    await expect(loginPageTwoFactor.wrongCredentialsMessage).toBeVisible();
    await expect(loginPageTwoFactor.page).toHaveURL(/two_factor/);
  });
});
