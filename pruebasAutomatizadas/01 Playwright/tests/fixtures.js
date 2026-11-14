import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { LoginPageTwoFactor } from "../pages/LoginPageTwoFactor";
import { SignUpPage } from "../pages/SignUpPage";
import { CreateAccountPage } from "../pages/CreateAccountPage";
import { CartPage } from "../pages/CartPage";
import { ViewCartPage } from "../pages/ViewCartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";
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
  shoppingAccount: async ({}, use) => {
    await use({
      name: process.env.SIGNUP_NAME,
      email: process.env.SHOPPING_EMAIL,
    });
  },
  paymentData: async ({}, use) => {
    await use({
      name: process.env.CARD_NAME,
      number: process.env.CARD_NUMBER,
      cvc: process.env.CARD_CVC,
      month: process.env.CARD_MONTH,
      year: process.env.CARD_YEAR,
    });
  },
  // fixtures de carrito y checkout
  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  viewCart: async ({ page }, use) => {
    await use(new ViewCartPage(page));
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  payment: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
});

export { expect };
