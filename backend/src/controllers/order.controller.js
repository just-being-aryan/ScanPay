import Order from "../models/order.model.js";
import OrderProduct from "../models/orderProduct.model.js";

export const createOrder = async (req, res) => {
  const { orderId, items, cost, deviceId, offlineTxnId } = req.body;

  if (!orderId || !items || !items.length || !cost) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const exists = await Order.findOne({ orderId });
  if (exists) {
    return res.status(409).json({ message: "Order already exists" });
  }

  await Order.create({
    orderId,
    amount: cost.totalPaid,
    currency: "INR",
    cost,
    deviceId,
    offlineTxnId,
    paymentStatus: "CREATED",
    exitStatus: "NOT_EXITED"
  });

  const orderProducts = items.map(i => ({
    orderId,
    sku: i.sku,
    name: i.name,
    qty: i.qty,
    unitPrice: i.unitPrice,
    lineTotal: i.qty * i.unitPrice
  }));

  await OrderProduct.insertMany(orderProducts);

  res.status(201).json({ orderId });
};