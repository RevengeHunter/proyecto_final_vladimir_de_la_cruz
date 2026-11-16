export class CartPage {
  constructor(page) {
    this.page = page;

    this.searchInput = page.getByRole("textbox", { name: "Search Product" });
    this.searchButton = page.locator('[id="submit_search"]');

    this.proceedToCartView = page.getByRole("link", { name: "Cart" });

    this.productAddMessage = page.getByRole("heading", {
      name: "Added!",
      level: 4,
    });
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
  }

  // Metodo para ir al catalogo de productos
  async goto() {
    await this.page.goto("products");
  }

  // Cada producto tiene DOS enlaces add-to-cart con el mismo data-product-id.
  addToCartLink(clotheId) {
    return this.page.locator(
      `.productinfo a.add-to-cart[data-product-id="${clotheId}"]`,
    );
  }

  // Metodo para agregar un producto al carrito y cerrar el modal de confirmacion
  async addToCart(clotheId) {
    await this.addToCartLink(clotheId).click();
    await this.continueShoppingButton.click();
  }

  async goToViewCart() {
    await this.proceedToCartView.click();
  }
}
