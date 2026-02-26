import Order from "../models/order.model.js";
import { verifyReceiptOffline } from "../receipt/verify.receipt.js";
import { RECEIPT_PUBLIC_KEY } from "../config/receiptKeys.js";

export async function verifyExitController(req, res) {
  const { orderId, receipt, signature } = req.body;
  const scannerId = req.headers["x-scanner-id"];

  if (!orderId || !receipt || !signature) {
    return res.status(400).json({ status: "DENIED" });
  }

  const order = await Order.findOne({ orderId });
  if (!order) {
    return res.status(404).json({ status: "DENIED" });
  }

 
  if (order.exitStatus === "VERIFIED") {
    return res.status(409).json({ status: "ALREADY_EXITED" });
  }


  if (new Date() > new Date(receipt.expiresAt)) {
    order.exitStatus = "EXPIRED";
    await order.save();
    return res.status(410).json({ status: "EXPIRED" });
  }

  const isValid = verifyReceiptOffline({
    receipt,
    signature,
    publicKey: RECEIPT_PUBLIC_KEY
  });

  if (!isValid) {
    return res.status(401).json({ status: "DENIED" });
  }

  order.exitStatus = "VERIFIED";
  order.exitScan = {
    scannedAt: new Date(),
    scannerId
  };
  order.exitedAt = new Date();

  await order.save();

  return res.json({ status: "EXIT_ALLOWED" });
}