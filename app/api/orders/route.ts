import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { ObjectId } from "mongodb";

// --- 1. GET: AMBIL SEMUA ORDER (Untuk History & Finance) ---
export async function GET() {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;

    // Kita ambil dari koleksi 'orders' (gabungan online & offline)
    const orders = await db.collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// --- 2. POST: SIMPAN ORDER BARU (Dari Web & Kasir) ---
export async function POST(req: Request) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    const body = await req.json();

    // 1. Pisahkan 'cartItems' (untuk potong stok) dari data pesanan
    const { cartItems, ...orderData } = body;

    // 2. Siapkan data pesanan
    // PERBAIKAN DI SINI: Jangan hardcode status jadi "Proses".
    // Gunakan status dari body jika ada (Kasir kirim "Selesai"), jika tidak ada baru default "Proses".
    const newOrder = {
      ...orderData,
      type: body.type || "Online",       // Default Online jika tidak ada tipe
      status: body.status || "Proses",   // Default Proses, tapi Kasir akan kirim "Selesai"
      createdAt: new Date().toISOString()
    };

    // 3. Simpan ke koleksi umum 'orders' (bukan online_orders lagi, biar gabung)
    const result = await db.collection("orders").insertOne(newOrder);

    // 4. LOGIKA PEMOTONGAN STOK
    if (cartItems && Object.keys(cartItems).length > 0) {
      for (const [id, qty] of Object.entries(cartItems)) {
        if (ObjectId.isValid(id)) {
          // Pastikan nama koleksi produk sesuai database Anda (di kode lama Anda pakai "menus")
          await db.collection("menus").updateOne(
            { _id: new ObjectId(id) }, 
            { $inc: { stock: -Number(qty) } } 
          );
        }
      }
    }

    return NextResponse.json({ success: true, _id: result.insertedId });
  } catch (e) {
    console.error("Gagal proses order:", e);
    return NextResponse.json({ error: "Gagal menyimpan pesanan" }, { status: 500 });
  }
}