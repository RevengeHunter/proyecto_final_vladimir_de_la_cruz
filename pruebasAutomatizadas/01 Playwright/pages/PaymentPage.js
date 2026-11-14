export class PaymentPage {
  constructor(page) {
    this.page = page;

    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');

    this.orderPlacedHeading = page.getByRole("heading", {
      name: "ORDER PLACED!",
    });
    this.confirmationMessage = page.getByText(
      "Congratulations! Your order has been confirmed!",
    );
    this.downloadInvoiceButton = page.getByRole("link", {
      name: "Download Invoice",
    });
  }

  // Metodo para pagar con los datos de tarjeta
  async pay(paymentData) {
    await this.nameOnCardInput.fill(paymentData.name);
    await this.cardNumberInput.fill(paymentData.number);
    await this.cvcInput.fill(paymentData.cvc);
    await this.expiryMonthInput.fill(paymentData.month);
    await this.expiryYearInput.fill(paymentData.year);
    await this.payButton.click();
  }
}
