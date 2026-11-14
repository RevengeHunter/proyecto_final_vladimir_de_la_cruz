import { CartTable } from "./CartTable";

export class ViewCartPage {
  constructor(page) {
    this.page = page;

    this.table = new CartTable(page);

    // Es un <a> SIN href, asi que no tiene rol de link y getByRole("link") no
    // lo encuentra. Se localiza por texto.
    this.checkoutButton = page.getByText("Proceed To Checkout", {
      exact: true,
    });

    // Modal que el sitio muestra al usuario anonimo al intentar el checkout
    this.checkoutMessageHeading = page.getByRole("heading", {
      name: "Checkout",
      level: 4,
    });

    this.closeCheckoutMessageButton = page.getByRole("button", {
      name: "Continue On Cart",
    });
  }

  // Metodo para ir al carrito
  async goto() {
    await this.page.goto("view_cart");
  }

  // Metodo para quitar un producto del carrito
  async deleteRow(clotheId) {
    await this.table.deleteLink(clotheId).click();
  }
}
