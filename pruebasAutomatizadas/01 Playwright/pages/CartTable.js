// /view_cart y /checkout usan esta clase en vez de duplicar los locators.
export class CartTable {
  constructor(page) {
    this.page = page;

    this.container = page.locator("#cart_info");
    this.rows = this.container.locator('tr[id^="product-"]');
    // Nota: la fila "Total Amount" solo existe en /checkout.
    this.totalAmount = this.container.locator(".cart_total_price").last();
  }

  // Fila de un producto, por su id en el sitio
  row(clotheId) {
    return this.container.locator(`#product-${clotheId}`);
  }

  name(clotheId) {
    return this.row(clotheId).locator(".cart_description h4 a");
  }

  price(clotheId) {
    return this.row(clotheId).locator(".cart_price p");
  }

  quantity(clotheId) {
    return this.row(clotheId).locator(".cart_quantity button");
  }

  total(clotheId) {
    return this.row(clotheId).locator(".cart_total .cart_total_price");
  }

  deleteLink(clotheId) {
    return this.row(clotheId).locator(".cart_quantity_delete");
  }
}
