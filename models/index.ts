import mongoose, { Schema, model, models } from "mongoose";

// --- 1. MENU SCHEMA (Sesuai kode Anda) ---
const MenuSchema = new Schema(
  {
    name: String,
    price: Number,
    category: String,
    isAvailable: { type: Boolean, default: true },
    // Saya tambahkan image opsional agar tampilan tidak rusak jika nanti mau pakai gambar
    image: { type: String, required: false }, 
  },
  { timestamps: true }
);

export const Menu = models.Menu || model("Menu", MenuSchema);

// --- 2. ORDER SCHEMA ---
const OrderSchema = new Schema({
  customer: { type: String, required: true },
  items: [
    {
      name: String,
      qty: Number,
      price: Number
    }
  ],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Preparing", "Ready", "Completed", "Cancelled"],
    default: "Pending" 
  },
}, { timestamps: true });

export const Order = models.Order || model("Order", OrderSchema);

// --- 3. DONATION SCHEMA ---
const DonationSchema = new Schema({
  name: { type: String, default: "Anonim" },
  amount: { type: Number, required: true },
  message: { type: String },
  method: { type: String, default: "QRIS" },
}, { timestamps: true });

export const Donation = models.Donation || model("Donation", DonationSchema);