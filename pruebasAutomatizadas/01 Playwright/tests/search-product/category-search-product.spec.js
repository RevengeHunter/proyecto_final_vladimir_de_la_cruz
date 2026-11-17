import { test, expect } from "../fixtures";

test.describe("Busqueda de productos por categoria", () => {
  test("filtra por la categoria Kids - Tops & Shirts", async ({ search }) => {
    await search.goto();

    // Abre el acordeon, clickea la categoria y espera el cambio de URL
    await search.filterByTopsAndShirts();

    await expect(search.page).toHaveURL(/category_products\/5$/);

    // El heading va antes del count(): waitForURL resuelve con el cambio de URL.
    await expect(search.categoryProductsHeading).toBeVisible();

    const found = await search.products.count();
    expect(found).toBeGreaterThan(0);

    await expect(search.productByName("Frozen Tops For Kids")).toHaveCount(1);
  });
});
