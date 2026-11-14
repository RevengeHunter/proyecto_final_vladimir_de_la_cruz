import { CartTable } from "./CartTable";

export class CheckoutPage {
  constructor(page) {
    this.page = page;

    // La revision del pedido usa la misma tabla que el carrito
    this.table = new CartTable(page);

    this.deliveryAddress = page.locator("#address_delivery");
    this.invoiceAddress = page.locator("#address_invoice");

    this.commentInput = page.locator('textarea[name="message"]');
    this.placeOrderLink = page.getByRole("link", { name: "Place Order" });
  }

  // Metodo para dejar un comentario y confirmar el pedido
  async placeOrder(comment) {
    await this.commentInput.fill(comment);
    await this.placeOrderLink.click();
  }
}
