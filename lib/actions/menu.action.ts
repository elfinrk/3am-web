"use server";

import { connectDB } from "@/lib/db";
import { Menu } from "@/models/menu.model";
import { revalidatePath } from "next/cache";

// PUBLIC (/menu)
export async function getPublicMenus() {
  await connectDB();
  return await Menu.find({ isAvailable: true }).sort({ createdAt: -1 }).lean();
}

// ADMIN (/admin/menu)
export async function getAdminMenus() {
  await connectDB();
  return await Menu.find().sort({ createdAt: -1 }).lean();
}

export async function createMenu(formData: FormData) {
  await connectDB();

  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = Number(formData.get("price") || 0);
  const isAvailable = formData.get("isAvailable") === "on";

  if (!name || !category || !price) {
    throw new Error("Name, category, price wajib diisi");
  }

  await Menu.create({ name, category, price, isAvailable });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

export async function toggleMenu(id: string) {
  await connectDB();

  const menu = await Menu.findById(id);
  if (!menu) throw new Error("Menu not found");

  menu.isAvailable = !menu.isAvailable;
  await menu.save();

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

export async function deleteMenu(id: string) {
  await connectDB();
  await Menu.findByIdAndDelete(id);

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}
