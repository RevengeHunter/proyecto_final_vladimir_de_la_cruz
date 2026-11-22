import { CartTable } from "./CartTable";

export class ViewCartPage {
  constructor(page) {
    this.page = page;

    this.table = new CartTable(page);

    // Es un <a> SIN href: no tiene rol de link, se localiza por texto.
    this.checkoutButton = page.getByText("Proceed To Checkout", {
      exact: true,
    });

    // Modal del checkout.
    this.checkoutModal = page.locator("#checkoutModal");

    // Todo lo de adentro se acota al modal
    this.checkoutMessageHeading = this.checkoutModal.getByRole("heading", {
      name: "Checkout",
      level: 4,
    });

    this.checkoutLoginMessage = this.checkoutModal.getByText(
      "Register / Login account to proceed on checkout.",
    );

    this.registerLoginLink = this.checkoutModal.getByRole("link", {
      name: "Register / Login",
    });

    this.closeCheckoutMessageButton = this.checkoutModal.getByRole("button", {
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
