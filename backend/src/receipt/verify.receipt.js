import crypto from "crypto";

export function verifyReceiptOffline({
  receipt,
  signature,
  publicKey
}) {
  if (!receipt || !signature || !publicKey) {
    throw new Error("Missing receipt verification data");
  }

  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(receipt))
    .digest();


  const isValid = crypto.verify(
    "RSA-SHA256",
    hash,
    publicKey,
    Buffer.from(signature, "base64")
  );

  return isValid;
}