// app/api/products/route.ts

import { connectDB } from "@/lib/db";
import Menu from "@/models/menu.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const products = await Menu.find({}).sort({ id: 1 });
    return NextResponse.json(products || [], { status: 200 });
  } catch (error: any) {
    console.error("Gagal sinkron data GET /api/products:", error.message);
    return NextResponse.json(
      { error: "Gagal mengambil data menu", message: error.message }, 
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, price, stock, isAvailable } = body;

    if (id === undefined || id === null) {
      return NextResponse.json(
        { error: "ID numerik diperlukan untuk update" }, 
        { status: 400 }
      );
    }

    const updatedProduct = await Menu.findOneAndUpdate(
      { id: id }, 
      { 
        ...(price !== undefined && { price }), 
        ...(stock !== undefined && { stock }),
        ...(isAvailable !== undefined && { isAvailable })
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: `Produk dengan ID ${id} tidak ditemukan` }, 
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error("Gagal sinkron data PATCH /api/products:", error.message);
    return NextResponse.json(
      { error: "Gagal memperbarui data menu", message: error.message }, 
      { status: 500 }
    );
  }
}