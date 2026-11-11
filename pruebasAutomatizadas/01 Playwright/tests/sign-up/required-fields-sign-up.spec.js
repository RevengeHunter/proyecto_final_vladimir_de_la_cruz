import { test, expect } from "../fixtures";
import sign_up_required_fields from "../../test-data/data-sign-up-required-fields.json";

test.describe("Campos obligatorios al crear cuenta", () => {
  for (const required_field of sign_up_required_fields) {
    test(`no permite crear la cuenta sin ${required_field.field}`, async ({
      signUp,
      createAccount,
      accountInformation,
      accountFormData,
    }) => {
      // Solo para llegar al formulario de signup: no se valida nada del login
      await signUp.fillSignUpForm(
        accountInformation.name,
        accountInformation.email,
      );
      await expect(createAccount.signUpHeading).toBeVisible();

      await createAccount.fillAccountForm(accountFormData);
      await createAccount.clearField(required_field.field);
      await createAccount.submit();

      // El navegador identifica ese campo como el que falta y bloquea el envío
      expect(await createAccount.valueMissing(required_field.field)).toBe(true);
      await expect(createAccount.signUpHeading).toBeVisible();
      await expect(createAccount.page).toHaveURL(/signup/);
      await expect(createAccount.accountCreatedHeading).toHaveCount(0);
    });
  }
});
