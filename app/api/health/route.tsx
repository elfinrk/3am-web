import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ ok: true, db: "connected" });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "DB error" },
      { status: 500 }
    );
  }
}
