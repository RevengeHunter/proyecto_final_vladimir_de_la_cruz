export class CreateAccountPage {
  constructor(page) {
    this.page = page;

    // Esta página no es navegable por URL: solo se renderiza como respuesta
    // al POST del formulario de signup, así que no hay goto() aquí.
    this.signUpHeading = page.getByRole("heading", {
      name: "ENTER ACCOUNT INFORMATION",
      level: 2,
    });

    // Locators para los campos del formulario de registro de cuenta
    this.genderInputForm = page.locator("#id_gender1");
    this.nameInputForm = page.locator('[data-qa="name"]');
    this.emailInputForm = page.locator('[data-qa="email"]');
    this.passwordInputForm = page.locator('[data-qa="password"]');
    this.dayBirthInputForm = page.locator('[data-qa="days"]');
    this.monthBirthInputForm = page.locator('[data-qa="months"]');
    this.yearBirthInputForm = page.locator('[data-qa="years"]');

    // Locators para los campos de información de la dirección
    this.firstNameInputForm = page.locator('[data-qa="first_name"]');
    this.lastNameInputForm = page.locator('[data-qa="last_name"]');
    this.addressInputForm = page.locator('[data-qa="address"]');
    this.countryInputForm = page.locator('[data-qa="country"]');
    this.stateInputForm = page.locator('[data-qa="state"]');
    this.cityInputForm = page.locator('[data-qa="city"]');
    this.zipCodeInputForm = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInputForm = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');

    // Locators para el flujo posterior al registro
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
    this.deleteAccountLink = page.getByRole("link", { name: "Delete Account" });
    this.accountDeletedHeading = page.locator('[data-qa="account-deleted"]');

    // Mapa nombre -> locator, para poder direccionar un campo por su nombre
    this.fields = {
      name: this.nameInputForm,
      password: this.passwordInputForm,
      first_name: this.firstNameInputForm,
      last_name: this.lastNameInputForm,
      address: this.addressInputForm,
      state: this.stateInputForm,
      city: this.cityInputForm,
      zipcode: this.zipCodeInputForm,
      mobile_number: this.mobileNumberInputForm,
    };
  }

  // Metodo para llenar el formulario de registro de cuenta sin guardar
  async fillAccountForm(data) {
    await this.genderInputForm.check();
    await this.dayBirthInputForm.selectOption(data.day);
    await this.monthBirthInputForm.selectOption(data.month);
    await this.yearBirthInputForm.selectOption(data.year);
    await this.countryInputForm.selectOption(data.country);

    for (const [field, locator] of Object.entries(this.fields)) {
      if (data[field] !== undefined) {
        await locator.fill(data[field]);
      }
    }
  }

  // Metodo para enviar el formulario de registro de cuenta
  async submit() {
    await this.createAccountButton.click();
  }

  // Metodo para realizar el registro
  async createAccount(data) {
    await this.fillAccountForm(data);
    await this.submit();
  }

  // Metodo para vaciar un campo, para verificar que es requerido
  async clearField(field) {
    await this.fields[field].fill("");
  }

  // Bandera estándar de la validación HTML5: required y vacío. A diferencia del
  // mensaje nativo, es idéntica en los tres navegadores.
  async valueMissing(field) {
    return this.fields[field].evaluate((el) => el.validity.valueMissing);
  }

  // Metodo para eliminar la cuenta, para que la prueba pueda ser ejecutada nuevamente con el mismo correo electrónico
  async deleteAccount() {
    await this.continueButton.click();
    await this.deleteAccountLink.click();
  }
}
