import crypto from "crypto";
import Order from "../models/order.model.js";
import { RECEIPT_PUBLIC_KEY } from "../config/receiptKeys.js";

function verifySignature(payload, signature) {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest();

  return crypto.verify(
    "RSA-SHA256",
    hash,
    RECEIPT_PUBLIC_KEY,
    Buffer.from(signature, "base64")
  );
}

export async function verifyExit({ receipt, signature, scannerId }) {
  const isValid = verifySignature(receipt, signature);

  if (!isValid) {
    throw new Error("Invalid receipt signature");
  }

  const receiptHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(receipt))
    .digest("hex");

  const order = await Order.findOneAndUpdate(
    {
      orderId: receipt.orderId,
      receiptHash,
      exitStatus: "NOT_EXITED"
    },
    {
      $set: {
        exitStatus: "VERIFIED",
        exitedAt: new Date(),
        "exitScan.scannedAt": new Date(),
        "exitScan.scannerId": scannerId
      }
    },
    { new: true }
  );

  if (!order) {
    throw new Error("Order already exited or invalid");
  }

  return { success: true };
}