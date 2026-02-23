import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

export const checkout = async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let total = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product || !product.isActive) {
      return res.status(400).json({
        message: `Invalid product ${item.productId}`
      });
    }

    total += product.price * item.quantity;

    validatedItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });
  }

  const order = await Order.create({
    items: validatedItems,
    totalAmount: total
  });

  res.status(201).json(order);
};
