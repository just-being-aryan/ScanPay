import mongoose from "mongoose";

const costSchema = new mongoose.Schema(
  {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    rounding: { type: Number, default: 0 },

    totalPaid: { type: Number, required: true },

    providerFee: { type: Number, default: 0 },
    netSettlement: { type: Number }
  },
  { _id: false }
);

const receiptSchema = new mongoose.Schema(
  {
    receiptId: { type: String },
    signature: { type: String },
    publicKeyId: { type: String }
  },
  { _id: false }
);

const exitScanSchema = new mongoose.Schema(
  {
    scannedAt: { type: Date },
    scannerId: { type: String }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {

    orderId: {
      type: String,
      required: true,
      unique: true
    },

    intentId: {
      type: String,
      required: true,
      unique: true
    },


    paymentStatus: {
      type: String,
      enum: ["CREATED", "PROCESSING", "SUCCESS", "FAILED"],
      default: "CREATED"
    },

    exitStatus: {
      type: String,
      enum: ["NOT_EXITED", "VERIFIED", "EXPIRED"],
      default: "NOT_EXITED"
    },


    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    
    cost: costSchema,

    
    deviceId: { type: String },
    offlineTxnId: { type: String },

   
    receipt: receiptSchema,
    receiptHash: { type: String },

    exitScan: exitScanSchema,

 
    paidAt: { type: Date },
    exitedAt: { type: Date }
  },
  { timestamps: true }
);


orderSchema.index({ intentId: 1 }, { unique: true });
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ exitStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderId: 1, exitStatus: 1 });

export default mongoose.model("Order", orderSchema);