import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { LoginPageTwoFactor } from "../pages/LoginPageTwoFactor";
import { SignUpPage } from "../pages/SignUpPage";
import { CreateAccountPage } from "../pages/CreateAccountPage";
import accountData from "../test-data/data-sign-up-account.json";

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
  accountInformation: async ({}, use) => {
    await use({
      name: process.env.SIGNUP_NAME,
      email: process.env.SIGNUP_EMAIL,
    });
  },
  accountFormData: async ({ credentials }, use) => {
    // Los datos vienen de test-data/; name y password del .env para no versionarlos
    await use({
      ...accountData, // Copia las propiedades de accountData
      name: process.env.SIGNUP_NAME,
      password: credentials.password,
    });
  },
  loginPageTwoFactor: async ({ page }, use) => {
    const loginPageTwoFactor = new LoginPageTwoFactor(page);
    await loginPageTwoFactor.goto();
    await use(loginPageTwoFactor);
  },
  signUp: async ({ page }, use) => {
    const signUp = new SignUpPage(page);
    await signUp.goto();
    await use(signUp);
  },
  createAccount: async ({ page }, use) => {
    const createAccount = new CreateAccountPage(page);
    await use(createAccount);
  },
});

export { expect };
