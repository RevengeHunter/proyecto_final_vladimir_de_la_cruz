import { test, expect } from "@playwright/test";

test("reproducir no result test", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");

  const byTestId = page.getByPlaceholder("Search");
  await byTestId.fill("loop_opal_loose");

  const button = page.getByRole("button", { name: "Search" });
  await button.click();

  const byClass = page.locator(".card-title");
  //await expect(byClass.first()).toBeVisible();
  await expect(byClass).toHaveCount(0);
});
