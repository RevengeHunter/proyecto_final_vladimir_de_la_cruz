import { test, expect } from "../fixtures";

test.describe("Validar Inicio de Sesion de Doble Factor", () => {
  test("inicio de sesion", async ({ loginPageTwoFactor, credentials }) => {
    await loginPageTwoFactor.login(credentials.username, credentials.password);
    await expect(loginPageTwoFactor.page).toHaveURL(/code/);
    await expect(loginPageTwoFactor.twoFactorCodeHeading).toBeVisible();
    await loginPageTwoFactor.fillTwoFactorCode();
    await expect(loginPageTwoFactor.secureAreaHeading).toBeVisible();
  });
});
