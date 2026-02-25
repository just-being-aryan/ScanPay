import Order from "../../models/order.model.js";
import OrderProduct from "../../models/orderProduct.model.js";
import { generateReceipt } from "../../payments/receipt.service.js";

export async function processUniPayWebhook(req) {
  if (!verifyUniPaySignature(req)) {
    throw new Error("Invalid signature");
  }

  const { intentId, status } = req.body;

  if (!intentId || !status) {
    throw new Error("Invalid payload");
  }

  const order = await Order.findOne({ intentId });
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "SUCCESS") {
    return;
  }

  order.paymentStatus = status;
  order.paidAt = status === "SUCCESS" ? new Date() : null;
  await order.save();

  if (status === "SUCCESS") {
    const items = await OrderProduct.find({ orderId: order.orderId });
    await generateReceipt({ orderId: order.orderId, items });
  }
}

function verifyUniPaySignature(req) {
  return true;
}