import { test, expect } from "../fixtures";
import internetCredentials from "../../test-data/data-internet-credentials.json";

test.describe("Validar Inicio de Sesion de Doble Factor", () => {
  test("inicio de sesion", async ({ loginPageTwoFactor }) => {
    await loginPageTwoFactor.login(
      internetCredentials.username,
      internetCredentials.password,
    );
    await expect(loginPageTwoFactor.page).toHaveURL(/code/);
    await expect(loginPageTwoFactor.twoFactorCodeHeading).toBeVisible();
    await loginPageTwoFactor.fillTwoFactorCode();
    await expect(loginPageTwoFactor.secureAreaHeading).toBeVisible();
  });
});
