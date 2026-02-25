export default class PaymentAdapter {
  async createPaymentIntent({ order, cost }) {
    throw new Error("createPaymentIntent not implemented");
  }

  async getPaymentStatus(providerRef) {
    throw new Error("getPaymentStatus not implemented");
  }

  async verifyWebhook(req) {
    throw new Error("verifyWebhook not implemented");
  }

  parseProviderResponse(payload) {
    throw new Error("parseProviderResponse not implemented");
  }
}