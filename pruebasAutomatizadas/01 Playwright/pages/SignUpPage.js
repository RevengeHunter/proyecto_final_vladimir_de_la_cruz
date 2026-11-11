export class SignUpPage {
  constructor(page) {
    this.page = page;

    this.nameInput = page.locator('[data-qa="signup-name"]');
    this.emailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');

    this.emailAlreadyExistsError = page.getByText(
      "Email Address already exist!",
    );
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
