import UniPayAdapter from "./adapters/unipay.adapter.js";

export function getPaymentAdapter() {
  return new UniPayAdapter();
}