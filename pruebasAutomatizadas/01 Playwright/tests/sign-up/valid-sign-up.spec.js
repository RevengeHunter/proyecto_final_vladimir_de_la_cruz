import { test, expect } from "../fixtures";

test.describe("Registrar Cuenta", () => {
  test("Registrar cuenta", async ({ signUp, accountInformation }) => {
    await signUp.fillSignUpForm(
      accountInformation.name,
      accountInformation.email,
    );
    await expect(signUp.page).toHaveURL(/signup/);
    await expect(signUp.signUpHeading).toBeVisible();
  });

  test("Crear cuenta", async ({
    createAccount,
    accountInformation,
    credentials,
  }) => {
    await expect(createAccount.nameInputForm).toHaveValue(
      accountInformation.name,
    );
    await expect(createAccount.emailInputForm).toHaveValue(
      accountInformation.email,
    );
    await createAccount.createAccount(
      credentials.password,
      "1",
      "January",
      "2000",
      "John",
      "Doe",
      "123 Main St",
      "United States",
      "California",
      "Los Angeles",
      "90210",
      "555-1234",
    );
    await createAccount.createAccount();
    await expect(loginPageTwoFactor.secureAreaHeading).toBeVisible();
  });
});
