import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  credentials: async ({}, use) => {
    await use({
      username: process.env.LOGIN_USERNAME,
      password: process.env.LOGIN_PASSWORD,
    });
  },
});

export { expect };
