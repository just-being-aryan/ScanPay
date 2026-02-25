// controllers/exit.controller.js
import { verifyExit } from "../services/exit/verify.service.js";

export async function verifyExitController(req, res) {
  const { receipt, signature } = req.body;

  await verifyExit({
    receipt,
    signature,
    scannerId: req.headers["x-scanner-id"]
  });

  res.json({ status: "EXIT_ALLOWED" });
}