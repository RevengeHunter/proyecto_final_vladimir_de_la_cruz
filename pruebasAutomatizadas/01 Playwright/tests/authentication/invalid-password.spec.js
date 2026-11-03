import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Login Tests", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("contraseña inválida", async () => {
    await loginPage.login(process.env.LOGIN_USERNAME, "incorrectPassword");
    await expect(loginPage.passwordError).toBeVisible();
  });
});
