import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: Number,
    status: {
      type: String,
      enum: ['CREATED', 'PAID', 'CANCELLED'],
      default: 'CREATED'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
