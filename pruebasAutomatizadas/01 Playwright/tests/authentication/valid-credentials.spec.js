import { test, expect } from "../fixtures";

test.describe("Login Tests", () => {
  test("inicio de sesion", async ({ loginPage, credentials }) => {
    await loginPage.login(credentials.username, credentials.password);
    await expect(loginPage.page).toHaveURL(/secure/);
    await expect(loginPage.secureAreaHeading).toBeVisible();
  });
});
