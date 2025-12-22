import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Hubungkan ke database '3am'
    await connectDB(); 
    const { status } = await req.json();

    // 2. Definisikan model agar sinkron dengan koleksi online_orders
    const Order = mongoose.models.OnlineOrder || mongoose.model("OnlineOrder", new mongoose.Schema({}, { strict: false, collection: "online_orders" }));

    // 3. Update status menggunakan findByIdAndUpdate agar otomatis menangani ObjectId
    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Data pesanan tidak ditemukan di database 3am" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("PATCH Error:", e);
    return NextResponse.json({ error: "Gagal menyambung ke database" }, { status: 500 });
  }
}