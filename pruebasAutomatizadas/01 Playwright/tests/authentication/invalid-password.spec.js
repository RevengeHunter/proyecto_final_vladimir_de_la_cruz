import { test, expect } from "../fixtures";

test.describe("Login Tests", () => {
  test("contraseña inválida", async ({ loginPage, credentials }) => {
    await loginPage.login(credentials.username, "incorrectPassword");
    await expect(loginPage.passwordError).toBeVisible();
    await expect(loginPage.page).toHaveURL(/login/);
  });
});
