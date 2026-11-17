export class SearchPage {
  constructor(page) {
    this.page = page;

    // Locators del buscador (solo existe en /products)
    this.searchInput = page.getByRole("textbox", { name: "Search Product" });
    this.searchButton = page.locator("#submit_search");

    this.searchedProductsHeading = page.getByRole("heading", {
      name: "Searched Products",
      level: 2,
    });

    this.products = page.locator(".features_items .productinfo");
    this.productNames = page.locator(".features_items .productinfo p");

    // Locators de la busqueda de productos por categoria.
    this.categoryList = page.locator("#accordian");

    this.categoryFilter = this.categoryList.getByRole("link", {
      name: "TOPS & SHIRTS",
    });

    // Panel del acordeon donde vive esa categoria (Kids).
    this.kidsCategoryPanel = this.categoryList.getByRole("link", {
      name: "Kids",
    });

    this.categoryProductsHeading = page.getByRole("heading", {
      name: "Kids - Tops & Shirts Products",
      level: 2,
    });
  }

  // Metodo para ir al catalogo, donde vive el buscador
  async goto() {
    await this.page.goto("products");
  }

  // El boton no envia un formulario, asi que lo que se espera es la
  // respuesta de esa navegacion. Se devuelve para que el test
  // pueda afirmar el codigo de estado.
  async search(term) {
    await this.searchInput.fill(term);

    const [response] = await Promise.all([
      this.page.waitForResponse((res) =>
        res.url().endsWith(`/products?search=${term}`),
      ),
      this.searchButton.click(),
    ]);

    return response;
  }

  // La categoria es un enlace comun, asi que se espera el cambio de URL.
  async filterByTopsAndShirts() {
    await this.kidsCategoryPanel.click();
    await this.categoryFilter.click();
    await this.page.waitForURL("**/category_products/5");
  }

  // Un producto por nombre, para confirmar que el filtro trajo lo esperado
  productByName(name) {
    return this.products.filter({ hasText: name });
  }
}
