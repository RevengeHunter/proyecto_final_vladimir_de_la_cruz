import { test, expect } from "../fixtures";

test.describe("Validar Tiempo de espera del Código de Inicio de Sesion de Doble Factor", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "espera real de 3 min: solo chromium",
  );

  test("código expirado", async ({ loginPageTwoFactor, credentials }) => {
    test.setTimeout(240_000);

    await loginPageTwoFactor.login(credentials.username, credentials.password);
    await expect(loginPageTwoFactor.page).toHaveURL(/code/);
    await expect(loginPageTwoFactor.twoFactorCodeHeading).toBeVisible();

    const code = await loginPageTwoFactor.readTwoFactorCode();
    await loginPageTwoFactor.waitForCodeToExpire();
    await loginPageTwoFactor.submitTwoFactorCode(code);

    await expect(loginPageTwoFactor.timeExpiredError).toBeVisible();
    await expect(loginPageTwoFactor.page).toHaveURL(/two_factor$/);
  });
});
