import { test, expect } from "@playwright/test";

test("inicio de sesion", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/login");

  const locatorList = page.getByRole("heading", { name: "Login Page" });
  await expect(locatorList).toHaveText("Login Page");

  const locatorUsername = page.getByRole("textbox", { name: "Username" });
  await locatorUsername.fill("tomsmith");
  await expect(locatorUsername).toHaveValue("tomsmith");

  const locatorPassword = page.getByRole("textbox", { name: "Password" });
  await locatorPassword.fill("SuperSecretPassword!");
  await expect(locatorPassword).toHaveValue("SuperSecretPassword!");

  await page.getByRole("button", { name: " Login" }).click();
  await expect(page).toHaveURL("https://the-internet.herokuapp.com/secure");

  await expect(
    page.getByRole("heading", {
      name: "Welcome to the Secure Area. When you are done click logout below.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();
});

test("usuario inválido", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/login");
  await page.getByLabel("Username").fill("incorrectUser");
  await page.getByLabel("Password").fill("SuperSecretPassword!");
  await page.getByRole("button", { name: " Login" }).click(); // This line is correct
  //await page.getByRole("button", { name: "Loging" }).click(); // This line is incorrect
  await expect(page.getByText("Your username is invalid!")).toBeVisible();
  await expect(page).toHaveURL(/login/);
});

test("contraseña inválida", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/login");
  await page.getByLabel("Username").fill("tomsmith");
  await page.getByLabel("Password").fill("incorrectPassword");
  await page.getByRole("button", { name: " Login" }).click(); // This line is correct
  //await page.getByRole("button", { name: "Loging" }).click(); // This line is incorrect
  await expect(page.getByText("Your password is invalid!")).toBeVisible();
  await expect(page.getByText("Your username is invalid!")).not.toBeVisible();
});
