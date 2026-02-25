import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      index: true
    },

    sku: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    qty: {
      type: Number,
      required: true
    },

    unitPrice: {
      type: Number,
      required: true
    },

    lineTotal: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

orderProductSchema.index({ orderId: 1 });
orderProductSchema.index({ orderId: 1, sku: 1 });

export default mongoose.model("OrderProduct", orderProductSchema);