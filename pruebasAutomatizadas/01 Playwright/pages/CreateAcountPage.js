export class CreateAccountPage {
  constructor(page) {
    this.page = page;

    // Locators for the account information fields
    this.genderInputForm = page.getByRole("radio", { name: "Mr." });
    this.nameInputForm = page.getByRole("textbox", { name: "Name *" });
    this.emailInputForm = page.getByRole("textbox", { name: "Email *" });
    this.passwordInputForm = page.getByRole("textbox", { name: "Password *" });
    this.dayBirthInputForm = page.getByRole("combobox", { name: "days" });
    this.monthBirthInputForm = page.getByRole("combobox", { name: "months" });
    this.yearBirthInputForm = page.getByRole("combobox", { name: "years" });

    // Locators for the address information fields
    this.firstNameInputForm = page.getByRole("textbox", {
      name: "First name *",
    });
    this.lastNameInputForm = page.getByRole("textbox", { name: "Last name *" });
    this.addressInputForm = page.getByRole("textbox", {
      name: "Address * (Street address, P.O. Box, Company name, etc.)",
    });
    this.countryInputForm = page.getByRole("combobox", { name: "Country *" });
    this.stateInputForm = page.getByRole("textbox", { name: "State *" });
    this.cityInputForm = page.getByRole("textbox", { name: "City *" });
    this.zipCodeInputForm = page.getByRole("textbox", { name: "Zipcode *" });
    this.mobileNumberInputForm = page.getByRole("textbox", {
      name: "Mobile Number *",
    });
    this.createAccountButton = page.getByRole("button", {
      name: "Create Account",
    });

    this.errorMessage = page.locator("#error");
    this.successMessage = page.getByText("Signup successful!");
  }

  // Method to go to the signup page
  async goto() {
    await this.page.goto("signup");
  }

  // Method to perform signup
  async createAccount(
    password,
    day,
    month,
    year,
    firstName,
    lastName,
    address,
    country,
    state,
    city,
    zipCode,
    mobileNumber,
  ) {
    await this.genderInputForm.check();
    await this.passwordInputForm.fill(password);
    await this.dayBirthInputForm.selectOption(day);
    await this.monthBirthInputForm.selectOption(month);
    await this.yearBirthInputForm.selectOption(year);
    await this.firstNameInputForm.fill(firstName);
    await this.lastNameInputForm.fill(lastName);
    await this.addressInputForm.fill(address);
    await this.countryInputForm.selectOption(country);
    await this.stateInputForm.fill(state);
    await this.cityInputForm.fill(city);
    await this.zipCodeInputForm.fill(zipCode);
    await this.mobileNumberInputForm.fill(mobileNumber);
    await this.createAccountButton.click();
  }
}
