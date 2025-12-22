import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    img: { type: String },
    desc: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Menu = mongoose.models.Menu || mongoose.model("Menu", MenuSchema);
export default Menu;