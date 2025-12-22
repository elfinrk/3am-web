// models/Donation.ts
import mongoose, { Schema, model, models } from "mongoose";

const DonationSchema = new Schema(
  {
    name: { type: String, required: true }, // "Hamba Allah" jika anonim
    amount: { type: Number, required: true },
    message: { type: String },
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Donation = models.Donation || model("Donation", DonationSchema);

export default Donation;