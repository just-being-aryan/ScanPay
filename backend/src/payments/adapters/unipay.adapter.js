import PaymentAdapter from "./base.adapter.js";
import axios from "axios";

export default class UniPayAdapter extends PaymentAdapter {
  async createPaymentIntent({ order, cost }) {
    const response = await axios.post(
      `${process.env.UNIPAY_BASE_URL}/payments/create`,
      {
        merchantOrderId: order.orderId,
        amount: cost.totalPaid,
        currency: order.currency,

        meta: {
          intentId: order.intentId,
          deviceId: order.deviceId
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.UNIPAY_API_KEY}`
        }
      }
    );

    return {
      intentId: response.data.intentId,
      paymentUrl: response.data.paymentUrl,
      providerRef: response.data.unipayTxnId,
      expiresAt: response.data.expiresAt
    };
  }

  async getPaymentStatus(providerRef) {
    const response = await axios.get(
      `${process.env.UNIPAY_BASE_URL}/payments/${providerRef}/status`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UNIPAY_API_KEY}`
        }
      }
    );

    return this.parseProviderResponse(response.data);
  }

  verifyWebhook(req) {
    // UniPay signature verification logic
    return true;
  }

  parseProviderResponse(payload) {
    return {
      status: payload.status, // SUCCESS | FAILED | PROCESSING
      providerRef: payload.unipayTxnId
    };
  }
}