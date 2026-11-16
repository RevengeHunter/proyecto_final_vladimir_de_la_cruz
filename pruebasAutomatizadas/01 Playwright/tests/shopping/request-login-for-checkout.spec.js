import { test, expect } from "../fixtures";
import clothes from "../../test-data/data-clothes.json";

test.describe("Checkout sin iniciar sesion", () => {
  test("pide iniciar sesion antes de dejar comprar", async ({
    cart,
    viewCart,
    signUp,
  }) => {
    test.setTimeout(60_000);

    // 1. Carrito como usuario anonimo. El carrito vive en la cookie de sesion
    //    y Playwright da un contexto nuevo por test, asi que arranca vacio.
    await cart.goto();
    for (const clothe of clothes) {
      await cart.addToCart(clothe.clotheId);
    }

    await viewCart.goto();
    await expect(viewCart.table.rows).toHaveCount(clothes.length);

    // 2. Punto de partida: el modal todavia no esta abierto. Sin esto, el
    //    paso 4 podria pasar con un modal que ya estaba visible de antes.
    await expect(viewCart.checkoutModal).toBeHidden();

    // 3. Intento de compra
    await viewCart.checkoutButton.click();

    // 4. No se puede proceder: el sitio pide sesion en vez de avanzar
    await expect(viewCart.checkoutModal).toBeVisible();
    await expect(viewCart.checkoutMessageHeading).toBeVisible();
    await expect(viewCart.checkoutLoginMessage).toBeVisible();
    await expect(viewCart.registerLoginLink).toBeVisible();

    // 5. Seguimos en el carrito, nunca se llego a /checkout, no se toco los productos
    await expect(viewCart.page).toHaveURL(/view_cart/);
    await expect(viewCart.table.rows).toHaveCount(clothes.length);

    // 6. El unico camino que ofrece el modal es iniciar sesion
    await viewCart.registerLoginLink.click();
    await expect(viewCart.page).toHaveURL(/login/);
    await expect(signUp.loginHeading).toBeVisible();
  });
});
