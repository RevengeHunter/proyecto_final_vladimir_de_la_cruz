import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Login Tests", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("usuario inválido", async () => {
    await loginPage.login("incorrectUser", process.env.LOGIN_PASSWORD);
    await expect(loginPage.usernameError).toBeVisible();
  });
});
