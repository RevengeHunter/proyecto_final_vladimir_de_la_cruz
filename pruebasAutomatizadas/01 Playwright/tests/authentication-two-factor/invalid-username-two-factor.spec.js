import { test, expect } from "../fixtures";
import internetCredentials from "../../test-data/data-internet-credentials.json";

test.describe("Validar Usuario en Inicio de Sesion de Doble Factor", () => {
  test("usuario inválido", async ({ loginPageTwoFactor }) => {
    await loginPageTwoFactor.login(
      "incorrectUser",
      internetCredentials.password,
    );
    await expect(loginPageTwoFactor.wrongCredentialsMessage).toBeVisible();
    await expect(loginPageTwoFactor.page).toHaveURL(/two_factor/);
  });
});
