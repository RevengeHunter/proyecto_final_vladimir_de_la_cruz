import { test, expect } from "../fixtures";
import internetCredentials from "../../test-data/data-internet-credentials.json";

test.describe("Login Tests", () => {
  test("inicio de sesion", async ({ loginPage }) => {
    await loginPage.login(
      internetCredentials.username,
      internetCredentials.password,
    );
    await expect(loginPage.page).toHaveURL(/secure/);
    await expect(loginPage.secureAreaHeading).toBeVisible();
  });
});
