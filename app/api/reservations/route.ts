import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { ObjectId } from "mongodb";

// --- 1. POST: SIMPAN RESERVASI BARU & POTONG STOK ---
export async function POST(req: Request) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    const body = await req.json();

    // Pisahkan item cart untuk logika potong stok
    const { cartItems, ...reservationData } = body;

    // Tambahkan timestamp & status default
    const newReservation = {
      ...reservationData,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    // Simpan ke database 'reservations'
    await db.collection("reservations").insertOne(newReservation);

    // LOGIKA POTONG STOK (Looping cart)
    // Pastikan nama koleksi di sini sesuai dengan database Anda ('menus' atau 'products')
    // Default kita gunakan 'menus' agar konsisten dengan fitur lain.
    if (cartItems && Object.keys(cartItems).length > 0) {
      for (const [id, qty] of Object.entries(cartItems)) {
        if (ObjectId.isValid(id)) {
          const quantityToReduce = Number(qty);
          await db.collection("menus").updateOne(
            { _id: new ObjectId(id) }, 
            { $inc: { stock: -quantityToReduce } } 
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Gagal Reservasi:", e);
    return NextResponse.json({ error: "Gagal menyimpan reservasi" }, { status: 500 });
  }
}

// --- 2. GET: AMBIL DATA RESERVASI ---
export async function GET() {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;

    const reservations = await db.collection("reservations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reservations);
  } catch (e) {
    console.error("GET Error:", e);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// --- 3. PATCH: UPDATE STATUS ---
export async function PATCH(req: Request) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    const { id, status } = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    await db.collection("reservations").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH Error:", e);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}

// --- 4. DELETE: HAPUS RESERVASI ---
export async function DELETE(req: Request) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    
    // Kita baca body request untuk mendapatkan ID yang dikirim frontend
    const body = await req.json();

    // Validasi ID sebelum menghapus
    if (!body.id || !ObjectId.isValid(body.id)) {
        return NextResponse.json({ error: "ID valid diperlukan" }, { status: 400 });
    }

    const result = await db.collection("reservations").deleteOne({ _id: new ObjectId(body.id) });

    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Data tidak ditemukan atau sudah dihapus" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE Error:", e);
    return NextResponse.json({ error: "Gagal hapus data" }, { status: 500 });
  }
}