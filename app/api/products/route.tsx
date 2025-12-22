import { connectDB } from "@/lib/db";
import Menu from "@/models/menu.model"; // Pastikan path benar
import { NextResponse } from "next/server";

// Ambil semua data dari MongoDB untuk ditampilkan di web
export async function GET() {
  try {
    await connectDB();
    const products = await Menu.find({}).sort({ id: 1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// Update harga/stok dari Admin Panel ke MongoDB
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, price, stock } = await req.json();
    
    // Cari berdasarkan 'id' numerik (1, 2, 999, dll)
    const updatedProduct = await Menu.findOneAndUpdate(
      { id: id }, 
      { price, stock },
      { new: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}