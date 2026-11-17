import { test, expect } from "../fixtures";

test.describe("Busqueda de productos por texto", () => {
  test("busca shirts y devuelve resultados con 200", async ({ search }) => {
    await search.goto();

    // Se espera la respuesta de la navegacion
    const response = await search.search("shirts");
    expect(response.status()).toBe(200);

    // Se espera la respuesta y cuenta los resultados, recien entonces se cuenta, porque count() no reintenta.
    await expect(search.searchedProductsHeading).toBeVisible();

    const found = await search.products.count();
    expect(found).toBeGreaterThan(0);

    await expect(search.productByName("Men Tshirt")).toHaveCount(1);
  });
});
