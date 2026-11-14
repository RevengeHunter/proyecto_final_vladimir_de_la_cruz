export class ViewCartPage {
  constructor(page) {
    this.page = page;

    this.checkoutButton = page.getByRole("link", {
      name: "Proceed To Checkout",
    });

    this.checkoutMessageHeading = page.getByRole("heading", {
      name: "Checkout",
      level: 4,
    });

    this.invalidCheckoutMessageHeading = page.getByRole("paragraph", {
      value: "Register / Login account to proceed on checkout.",
    });

    this.closeCheckoutMessageButton = page.getByRole("button", {
      name: "Continue On Cart",
    });
  }
}
