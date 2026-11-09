export class SignUpPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.nameInput = page.getByRole("textbox", { name: "Name" });
    this.emailInput = page.getByRole("textbox", { name: "Email Address" });
    this.signupButton = page.getByRole("button", { name: "Signup" });

    this.signUpHeading = page.getByRole("heading", {
      name: "ENTER ACCOUNT INFORMATION",
      level: 2,
    });

    this.errorMessage = page.locator("#error");
    this.successMessage = page.getByText("Signup successful!");
  }

  // Method to go to the login page
  async goto() {
    await this.page.goto("login");
  }

  // Method to fill the sign-up form
  async fillSignUpForm(name, email) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.signupButton.click();
  }
}
