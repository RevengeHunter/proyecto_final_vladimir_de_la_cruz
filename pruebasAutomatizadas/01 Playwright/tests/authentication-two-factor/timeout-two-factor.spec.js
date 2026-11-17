import { test, expect } from "../fixtures";
import internetCredentials from "../../test-data/data-internet-credentials.json";

test.describe("Validar Tiempo de espera del Código de Inicio de Sesion de Doble Factor", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "espera real de 3 min: solo chromium",
  );

  test("código expirado", async ({ loginPageTwoFactor }) => {
    test.setTimeout(240_000);

    await loginPageTwoFactor.login(
      internetCredentials.username,
      internetCredentials.password,
    );
    await expect(loginPageTwoFactor.page).toHaveURL(/code/);
    await expect(loginPageTwoFactor.twoFactorCodeHeading).toBeVisible();

    const code = await loginPageTwoFactor.readTwoFactorCode();
    await loginPageTwoFactor.waitForCodeToExpire();
    await loginPageTwoFactor.submitTwoFactorCode(code);

    await expect(loginPageTwoFactor.timeExpiredError).toBeVisible();
    await expect(loginPageTwoFactor.page).toHaveURL(/two_factor$/);
  });
});
