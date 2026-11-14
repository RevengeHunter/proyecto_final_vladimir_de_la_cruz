import { test, expect } from "../fixtures";
import clothes from "../../test-data/data-clothes.json";

const deletedClothe = clothes[1];
const remainingClothes = clothes.filter((clothe) => clothe !== deletedClothe);

test.describe("Borrar productos del carrito", () => {
  test("quita un producto y deja los demas intactos", async ({
    cart,
    viewCart,
  }) => {
    test.setTimeout(60_000);

    // 1. Carrito con los 4 productos.
    await cart.goto();
    for (const clothe of clothes) {
      await cart.addToCart(clothe.clotheId);
    }

    await viewCart.goto();
    await expect(viewCart.table.rows).toHaveCount(clothes.length);

    // 2. El producto a borrar esta en el carrito.
    await expect(viewCart.table.name(deletedClothe.clotheId)).toHaveText(
      deletedClothe.clotheName,
    );

    // 3. Borrarlo
    await viewCart.deleteRow(deletedClothe.clotheId);

    // 4. Ya no esta, y los otros tres quedaron igual
    await expectRowDeleted(viewCart.table);

    // 5. El borrado es real
    await viewCart.goto();
    await expectRowDeleted(viewCart.table);
  });
});

// Estado esperado del carrito despues del borrado
async function expectRowDeleted(table) {
  await expect(table.row(deletedClothe.clotheId)).toHaveCount(0);
  await expect(table.rows).toHaveCount(remainingClothes.length);

  for (const clothe of remainingClothes) {
    await expect(table.name(clothe.clotheId)).toHaveText(clothe.clotheName);
    await expect(table.price(clothe.clotheId)).toHaveText(
      `Rs. ${clothe.clothePrice}`,
    );
  }
}
