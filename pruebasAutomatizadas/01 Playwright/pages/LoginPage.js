import { expect } from "@playwright/test";

export class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.username = page.getByRole("textbox", { name: "Username" });
    this.password = page.getByRole("textbox", { name: "Password" });
    this.submitButton = page.getByRole("button", { name: " Login" });
    this.errorMessage = page.locator("#error");
    this.secureAreaHeading = page.getByRole("heading", {
      name: "Secure Area",
      level: 2,
    });
    this.usernameError = page.getByText("Your username is invalid!");
    this.passwordError = page.getByText("Your password is invalid!");
  }

  // Method to go to the login page
  async goto() {
    await this.page.goto("login");
  }

  // Method to perform login
  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submitButton.click();
  }

  // Method to check username error message
  async isUsernameErrorVisible() {
    await expect(this.usernameError).toBeVisible();
    await expect(this.page).toHaveURL(/login/);
  }

  // Method to check password error message
  async isPasswordErrorVisible() {
    await expect(this.passwordError).toBeVisible();
    await expect(this.page).toHaveURL(/login/);
  }
}
