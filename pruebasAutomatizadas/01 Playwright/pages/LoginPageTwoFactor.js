export class LoginPageTwoFactor {
  // El servidor expira el código de segundo factor a los 180 segundos
  static CODE_TTL_MS = 180_000;

  constructor(page) {
    this.page = page;

    // Locators
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.errorMessage = page.locator("#error");
    this.secureAreaHeading = page.getByRole("heading", {
      name: "Secure Area",
      level: 2,
    });
    this.wrongCredentialsMessage = page.getByText(
      "Your username or password is invalid!",
    );
    this.twoFactorCodeInput = page.getByRole("textbox", {
      name: "One-time code",
    });
    this.twoFactorCodeHeading = page.getByRole("heading", {
      name: "Enter Your Code",
      level: 2,
    });
    this.verifyTwoFactorButton = page.getByRole("button", { name: "Verify" });
    this.twoFactorCode = page.locator("#otp-code");
    this.timeExpiredError = page.getByText(
      "Your code has expired! Please log in again.",
    );
  }

  // Method to go to the login two factor page
  async goto() {
    await this.page.goto("two_factor");
  }

  // Method to perform login
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.nextButton.click();
  }

  // Method to read the two-factor authentication code shown on the page
  async readTwoFactorCode() {
    const code = await this.twoFactorCode.textContent();
    return code.trim();
  }

  // Method to submit a two-factor authentication code
  async submitTwoFactorCode(code) {
    await this.twoFactorCodeInput.fill(code);
    await this.verifyTwoFactorButton.click();
  }

  // Method to fill in the two-factor authentication code
  async fillTwoFactorCode() {
    const code = await this.readTwoFactorCode();
    await this.submitTwoFactorCode(code);
  }

  // Espera real: la expiración se valida en el servidor, el reloj falso del browser no aplica
  async waitForCodeToExpire() {
    await this.page.waitForTimeout(LoginPageTwoFactor.CODE_TTL_MS + 5_000);
  }
}
