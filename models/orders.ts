// models/Order.ts
import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true }, // Contoh: ORD-8821
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String }, // Kosong jika Pickup
    type: { type: String, enum: ["Delivery", "Pickup"], required: true },
    items: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["Proses", "Selesai", "Batal"], 
      default: "Proses" 
    },
    notes: { type: String },
  },
  { timestamps: true } // Otomatis membuat createdAt dan updatedAt
);

// Mencegah error "OverwriteModelError" saat hot reload di Next.js
const Order = models.Order || model("Order", OrderSchema);

export default Order;