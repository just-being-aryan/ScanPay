import fs from "fs";
import { verifyReceiptOffline } from "../receipt/verify.receipt.js";
// Load public key
const publicKey = fs.readFileSync(
  "backdend/config/keys/receipt_public.pem",
  "utf8"
);

// Sample receipt (use a REAL one from DB later)
const receipt = {
  orderId: "ORD_TEST_001",
  amount: 24900,
  currency: "INR",
  paidAt: "2026-02-24T10:41:21Z",
  items: [{ sku: "ART123", qty: 2 }]
};

// Signature generated earlier by backend
const signature = "PASTE_REAL_SIGNATURE_HERE";

const result = verifyReceiptOffline({
  receipt,
  signature,
  publicKey
});

console.log("Receipt valid?", result);