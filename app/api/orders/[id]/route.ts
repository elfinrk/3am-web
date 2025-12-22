import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { status } = await req.json();

    const { id } = await params;

    const Order =
      mongoose.models.OnlineOrder ||
      mongoose.model(
        "OnlineOrder",
        new mongoose.Schema({}, { strict: false, collection: "online_orders" })
      );

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Data pesanan tidak ditemukan di database 3am" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("PATCH Error:", e);
    return NextResponse.json(
      { error: "Gagal menyambung ke database" },
      { status: 500 }
    );
  }
}
