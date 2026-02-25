import Order from "../models/order.model.js";
import { getPaymentAdapter } from "./payment.factory.js";

export async function createPayment({ orderId, provider }) {
  const order = await Order.findOne({ orderId });

  if (!order) throw new Error("Order not found");

  if (order.paymentStatus !== "CREATED") {
    throw new Error("Payment already initiated");
  }

  const adapter = getPaymentAdapter(provider);

  const result = await adapter.createPaymentIntent({
    order,
    cost: order.cost
  });

  order.intentId = result.intentId;
  order.paymentStatus = "PROCESSING";

  await order.save();

  return {
    intentId: result.intentId,
    paymentUrl: result.paymentUrl,
    expiresAt: result.expiresAt
  };
}