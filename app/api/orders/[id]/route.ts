import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { ObjectId } from "mongodb";

// --- 1. PATCH: UPDATE STATUS (Proses -> Selesai) ---
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db; // Menggunakan native driver agar lebih cepat & konsisten
    const { status } = await req.json();
    const { id } = await params;

    // Validasi ID MongoDB
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // UPDATE di koleksi 'orders' (Gabungan Online & Offline)
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Data pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH Error:", e);
    return NextResponse.json(
      { error: "Gagal menyambung ke database" },
      { status: 500 }
    );
  }
}

// --- 2. DELETE: HAPUS PESANAN (Untuk Fitur Tombol Sampah) ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    const { id } = await params;

    // Validasi ID MongoDB
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // HAPUS dari koleksi 'orders'
    // (Perbaikan: Kode lama Anda cari di 'online_orders', makanya data kasir tidak ketemu)
    const result = await db.collection("orders").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan atau sudah dihapus" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Pesanan berhasil dihapus permanen" 
    });

  } catch (e) {
    console.error("DELETE Error:", e);
    return NextResponse.json(
      { error: "Gagal menghapus data dari database" },
      { status: 500 }
    );
  }
}