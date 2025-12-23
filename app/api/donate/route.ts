import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";

// 1. TERIMA DONASI (POST)
export async function POST(req: Request) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    const body = await req.json();

    const donationData = {
      donorName: body.name || "Hamba Allah",
      amount: Number(body.amount),
      message: body.message || "-",
      paymentMethod: body.method || "QRIS",
      status: "Success",
      createdAt: new Date().toISOString()
    };

    await db.collection("donations").insertOne(donationData);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Gagal simpan donasi" }, { status: 500 });
  }
}

// 2. AMBIL DATA (GET)
export async function GET() {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    const donations = await db.collection("donations").find({}).sort({ createdAt: -1 }).toArray();
    const totalBalance = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    return NextResponse.json({ balance: totalBalance, donors: donations });
  } catch (e) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// 3. HAPUS SEMUA DATA (DELETE) - BARU
export async function DELETE() {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;

    // Hapus semua dokumen di koleksi 'donations'
    await db.collection("donations").deleteMany({});

    return NextResponse.json({ success: true, message: "Semua data berhasil dihapus" });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}