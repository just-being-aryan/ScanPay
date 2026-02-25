import { processUniPayWebhook } from "../services/webhooks/unipay.webhook.js";

export async function handleWebhook(req, res) {
  try {
    await processUniPayWebhook(req);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
}