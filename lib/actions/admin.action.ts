"use server";

import { redirect } from "next/navigation";

export async function adminLogin(formData: FormData) {
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    redirect("/admin/dashboard");
  }

  throw new Error("Login gagal");
}
