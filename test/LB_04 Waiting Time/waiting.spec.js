import { test, expect } from "@playwright/test";

test("waiting for elements test", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");

  const byTestId = page.getByPlaceholder("Search");
  await byTestId.fill("loop_opal_loose");

  const button = page.getByRole("button", { name: "Search" });
  await button.click();

  //Espera de manera explicita
  await page.waitForTimeout(2000);
  await expect(page.getByText("There are no products found.")).toBeVisible();

  //Espera de manera implicita
  expect(await page.getByText("There are no products found.").isVisible()).toBe(
    true,
  );
});
