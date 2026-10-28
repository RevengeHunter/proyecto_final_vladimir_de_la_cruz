import { test, expect } from "@playwright/test";

test("reproducir Strict Mode Violation", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");

  // Hay varios items con la misma clase.
  const byClass = page.locator(".card-title");
  await expect(byClass.first()).toBeVisible();

  // Hay varios items y filtro por texto.
  const item1 = byClass.filter({ hasText: "Bolt Cutters" }).first();
  await expect(item1).toBeVisible();
});
