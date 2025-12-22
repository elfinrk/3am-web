import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    const body = await req.json();

    // Pastikan status "Proses" tersimpan di MongoDB
    const orderData = {
      ...body,
      status: "Proses", 
      createdAt: new Date().toISOString()
    };

    const result = await db.collection("online_orders").insertOne(orderData);
    return NextResponse.json({ success: true, _id: result.insertedId });
  } catch (e) {
    console.error("Gagal simpan ke database:", e);
    return NextResponse.json({ error: "Gagal simpan ke database" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    // Mengambil data urut dari yang paling baru
    const orders = await db.collection("online_orders").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}