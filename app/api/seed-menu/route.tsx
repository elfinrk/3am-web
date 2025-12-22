import { connectDB } from "@/lib/db";
import Menu from "@/models/menu.model"; // Tanpa 'lib' karena folder models di root
import { NextResponse } from "next/server";

const initialMenu = [
  // --- SIGNATURE DRINKS ---
  { id: 1, category: "Signature Drinks", name: "3.AM Midnight Black Swirl", price: 28000, stock: 50, img: "/3.AM Midnight Black Swirl.png" },
  { id: 2, category: "Signature Drinks", name: "3.AM Caramel Nightfall", price: 32000, stock: 50, img: "/3.AM Caramel Nightfall.png" },
  { id: 3, category: "Signature Drinks", name: "3.AM Moonlit Matcha Waves", price: 30000, stock: 50, img: "/3.AM Moonlit Matcha Waves.png" },

  // --- COFFEE ---
  { id: 4, category: "Coffee", name: "Americano", price: 28000, stock: 99, img: "/Americano.png" },
  { id: 5, category: "Coffee", name: "Caffe Latte", price: 35000, stock: 99, img: "/caffe-latte.png" },
  { id: 6, category: "Coffee", name: "Cappuccino", price: 32000, stock: 99, img: "/Capucino.png" },
  { id: 7, category: "Coffee", name: "Frappe Coffee", price: 40000, stock: 99, img: "/Frappe-Coffe.png" },
  { id: 8, category: "Coffee", name: "Caramel Macchiato", price: 42000, stock: 99, img: "/Machiato.png" },
  { id: 9, category: "Coffee", name: "Coffee Milk", price: 33000, stock: 99, img: "/coffe-milk.png" },

  // --- NON-COFFEE ---
  { id: 10, category: "Non-Coffee", name: "Cookies & Cream", price: 35000, stock: 50, img: "/cnc.png" },
  { id: 11, category: "Non-Coffee", name: "Strawberry Mix", price: 35000, stock: 50, img: "/test.png" },
  { id: 12, category: "Non-Coffee", name: "Chocolate Frappe", price: 38000, stock: 50, img: "/coklat.png" },

  // --- FOOD & DESSERT ---
  { id: 13, category: "food", name: "3AM Cheesemelt", price: 25000, stock: 20, img: "/cheese.png" },
  { id: 14, category: "food", name: "Butter Croissant", price: 18000, stock: 20, img: "/Croissant.png" },
  { id: 15, category: "food", name: "Tomato Tart", price: 22000, stock: 20, img: "/tomato.png" },
  { id: 16, category: "dessert", name: "Macaron", price: 15000, stock: 50, img: "/macaron.png" },
  { id: 17, category: "dessert", name: "Strawberry Cheese Cake", price: 40000, stock: 15, img: "/cake-berry.png" },
  { id: 18, category: "dessert", name: "Chocolate Lava Cake", price: 40000, stock: 15, img: "/coklat-cake.png" },

  // --- MERCHANDISE ---
  { id: 999, category: "merch", name: "3AM Coffee Cup", price: 5000, stock: 100, img: "/BAGGG.png" },
  { id: 201, category: "merch", name: "Midnight Drip Tumbler", price: 100000, stock: 25, img: "/tumblr.png" },
  { id: 202, category: "merch", name: "Noir Cup", price: 75000, stock: 40, img: "/Minicup.png" },
  { id: 203, category: "merch", name: "Nightfall Tote Bag", price: 115000, stock: 15, img: "/Thitam.png" },
  { id: 204, category: "merch", name: "Daylight Tote Bag", price: 115000, stock: 20, img: "/Tputih.png" },
  { id: 205, category: "merch", name: "Duskwear Tee", price: 149000, stock: 10, img: "/Baju.png" },
];

export async function GET() {
  try {
    await connectDB();
    console.log("Database terhubung, mulai membersihkan data..."); // Log untuk debug di terminal
    await Menu.deleteMany({}); 
    await Menu.insertMany(initialMenu);
    return NextResponse.json({ message: "Database 3.AM Berhasil Diisi!" });
  } catch (error: any) {
    console.error("Error Seeding:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}