import { test, expect } from "../fixtures";

test.describe("Registrar Cuenta", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "email fijo: no puede registrarse en paralelo",
  );

  test("Registrar y crear cuenta", async ({
    signUp,
    createAccount,
    accountInformation,
    accountFormData,
  }) => {
    await signUp.fillSignUpForm(
      accountInformation.name,
      accountInformation.email,
    );
    await expect(signUp.page).toHaveURL(/signup/);
    await expect(createAccount.signUpHeading).toBeVisible();

    // Los datos del formulario de login deben llegar precargados al de signup
    await expect(createAccount.nameInputForm).toHaveValue(
      accountInformation.name,
    );
    await expect(createAccount.emailInputForm).toHaveValue(
      accountInformation.email,
    );

    await createAccount.createAccount(accountFormData);
    await expect(createAccount.accountCreatedHeading).toBeVisible();

    await createAccount.deleteAccount();
    await expect(createAccount.accountDeletedHeading).toBeVisible();
  });
});
