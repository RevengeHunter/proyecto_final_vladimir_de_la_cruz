import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Login Tests", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("inicio de sesion", async () => {
    await loginPage.login(
      process.env.LOGIN_USERNAME,
      process.env.LOGIN_PASSWORD,
    );
    await expect(loginPage.page).toHaveURL(/secure/);
    await expect(loginPage.secureAreaHeading).toBeVisible();
  });
});
