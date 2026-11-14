import { test, expect } from "../fixtures";
import clothes from "../../test-data/data-clothes.json";

const expectedTotal = clothes.reduce((sum, c) => sum + c.clothePrice, 0);

// La misma tabla se renderiza en /view_cart y en la revision del pedido de
// /checkout, asi que la verificacion se escribe una vez y se usa en los dos.
async function expectCartTable(table) {
  // Cuenta exacta de filas: sin esto, un carrito con sobrantes pasaria igual
  await expect(table.rows).toHaveCount(clothes.length);

  for (const clothe of clothes) {
    await expect(table.name(clothe.clotheId)).toHaveText(clothe.clotheName);
    await expect(table.price(clothe.clotheId)).toHaveText(
      `Rs. ${clothe.clothePrice}`,
    );
    await expect(table.quantity(clothe.clotheId)).toHaveText("1");
    await expect(table.total(clothe.clotheId)).toHaveText(
      `Rs. ${clothe.clothePrice}`,
    );
  }
}

test.describe("Compra completa", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "email fijo: no puede registrarse en paralelo",
  );

  // Red de seguridad: si el test falla a mitad de camino, la cuenta queda
  // registrada y la corrida siguiente choca con "Email Address already exist!".
  // El link "Delete Account" de la navbar es un GET a /delete_account.
  test.afterEach(async ({ page }) => {
    await page.goto("delete_account").catch(() => {});
  });

  test("compra 4 productos y confirma la orden", async ({
    signUp,
    createAccount,
    cart,
    viewCart,
    checkout,
    payment,
    shoppingAccount,
    accountFormData,
    paymentData,
  }) => {
    test.setTimeout(120_000);

    // 1. Cuenta nueva: el checkout exige sesion iniciada
    await signUp.fillSignUpForm(shoppingAccount.name, shoppingAccount.email);
    await createAccount.createAccount({
      ...accountFormData,
      name: shoppingAccount.name,
    });
    await expect(createAccount.accountCreatedHeading).toBeVisible();
    await createAccount.continueButton.click();

    // 2. Agregar los 4 productos del JSON
    await cart.goto();
    for (const clothe of clothes) {
      await cart.addToCart(clothe.clotheId);
    }

    // 3. El carrito tiene exactamente esos 4 productos, con sus importes
    await viewCart.goto();
    await expectCartTable(viewCart.table);

    // 4. Checkout: los 4 productos siguen ahi antes de confirmar nada
    await viewCart.checkoutButton.click();
    await expect(checkout.deliveryAddress).toBeVisible();
    await expect(checkout.invoiceAddress).toBeVisible();
    await expectCartTable(checkout.table);
    await expect(checkout.table.totalAmount).toHaveText(`Rs. ${expectedTotal}`);

    await checkout.placeOrder("Pedido de prueba automatizada");

    // 5. Pago y confirmacion de la orden
    await payment.pay(paymentData);
    await expect(payment.orderPlacedHeading).toBeVisible();
    await expect(payment.confirmationMessage).toBeVisible();

    // 6. Limpieza: borrar la cuenta se lleva la orden y deja el test repetible
    await createAccount.deleteAccountLink.click();
    await expect(createAccount.accountDeletedHeading).toBeVisible();
  });
});
