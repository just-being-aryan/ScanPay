import crypto from "crypto";
import Order from "../models/order.model.js";
import { RECEIPT_PRIVATE_KEY } from "../config/receiptKeys.js";

function buildReceiptPayload(order, items) {
  return {
    orderId: order.orderId,
    intentId: order.intentId,
    amount: order.amount,
    currency: order.currency,

    items: items.map(i => ({
      sku: i.sku,
      qty: i.qty,
      unitPrice: i.unitPrice,
      lineTotal: i.lineTotal
    })),

    paidAt: order.paidAt.toISOString()
  };
}


function hashReceipt(payload) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}


function signReceipt(hash) {
  const privateKey = process.env.RECEIPT_PRIVATE_KEY;

  const signature = crypto.sign(
    "RSA-SHA256",
    Buffer.from(hash),
    privateKey
  );

  return signature.toString("base64");
}

function buildReceiptPayload(order, items) {
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + 10 * 60 * 1000); // 10 min

  return {
    orderId: order.orderId,
    intentId: order.intentId,
    amount: order.amount,
    currency: order.currency,

    items: items.map(i => ({
      sku: i.sku,
      qty: i.qty,
      unitPrice: i.unitPrice,
      lineTotal: i.lineTotal
    })),

    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString()
  };
}

export async function generateReceipt({ orderId, items }) {
  const order = await Order.findOne({ orderId });

  if (!order) throw new Error("Order not found");

  if (order.paymentStatus !== "SUCCESS") {
    throw new Error("Cannot generate receipt before payment success");
  }

  if (order.receipt) {
   
    return order.receipt;
  }

  const payload = buildReceiptPayload(order, items);
  const receiptHash = hashReceipt(payload);
  const signature = signReceipt(receiptHash);

  order.receipt = {
    receiptId: `rcpt_${crypto.randomUUID()}`,
    signature,
    publicKeyId: "key_v1"
  };

  order.receiptHash = receiptHash;

  await order.save();

  return {
    receipt: payload,
    signature
  };
}