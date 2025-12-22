"use client";

import { useState } from "react";
import { useAdmin } from "../AdminContext";
import { 
  Plus, Minus, ShoppingBag, Trash2, 
  CreditCard, Wallet, CheckCircle2, Search, X
} from "lucide-react";
import Image from "next/image";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
}

export default function OfflineOrdersPage() {
  const { products } = useAdmin();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState<"Tunai" | "QRIS">("Tunai");

  const categories = [
    { id: "all", name: "All Menu" },
    { id: "signature", name: "Signature" },
    { id: "coffee", name: "Coffee Corner" },
    { id: "non-coffee", name: "Non-Coffee" },
    { id: "food", name: "Pastry & Savory" },
    { id: "merch", name: "Merch" },
  ];

  const filteredProducts = products?.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === "all" || p.category === activeCategory;
    return matchSearch && matchCategory;
  }) || [];

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] overflow-hidden">
      
      {/* --- BAGIAN KIRI: GRID MENU --- */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-display font-bold text-[#3E2723]">Input Pesanan Kasir</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="Cari menu..." 
              className="w-full bg-white border border-[#E5DCC5] rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 ring-[#3E2723]/5"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold border transition-all whitespace-nowrap ${
                  activeCategory === cat.id 
                    ? "bg-[#3E2723] text-white border-[#3E2723]" 
                    : "bg-white text-[#3E2723]/60 border-[#E5DCC5]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 pb-10 custom-scrollbar">
          {filteredProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-white rounded-[2rem] border border-[#E5DCC5] hover:border-[#3E2723] transition-all group flex flex-col items-center p-3 text-center shadow-sm"
            >
              <div className="w-full aspect-square bg-[#F9F5E8] rounded-[1.5rem] flex items-center justify-center mb-3 p-3">
                <Image src={p.img} alt={p.name} width={120} height={120} className="object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="font-bold text-[#3E2723] text-[12px] leading-tight h-8 flex items-center px-1">{p.name}</p>
              <div className="mt-2 bg-[#F9F5E8] px-3 py-1 rounded-full">
                <p className="font-bold text-[#8D6E63] text-[10px]">Rp {p.price.toLocaleString('id-ID')}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- BAGIAN KANAN: KERANJANG KASIR (COMPACT VERSION) --- */}
      <div className="w-full lg:w-[380px] bg-white rounded-[2.5rem] border border-[#E5DCC5] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Ramping */}
        <div className="p-5 bg-[#3E2723] text-white flex justify-between items-center">
          <div className="flex items-center gap-2 font-display font-bold tracking-widest uppercase text-[12px]">
            <ShoppingBag size={18} />
            <span>KERANJANG KASIR</span>
          </div>
          <button onClick={() => setCart([])} className="text-[9px] font-black opacity-50 hover:opacity-100 uppercase">CLEAR ALL</button>
        </div>

        {/* List Item diperkecil agar muat lebih banyak */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30 custom-scrollbar">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-[1.5rem] border border-[#E5DCC5]/40 flex gap-3 shadow-sm transition-all">
              <div className="w-16 h-16 bg-[#F9F5E8] rounded-2xl flex-shrink-0 flex items-center justify-center p-2">
                <Image src={item.img} alt={item.name} width={45} height={45} className="object-contain" />
              </div>
              <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-0">
                <h4 className="font-bold text-[#3E2723] text-[13px] leading-tight truncate">{item.name}</h4>
                <p className="text-[10px] font-bold text-gray-400">Rp {item.price.toLocaleString('id-ID')}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3 border border-[#E5DCC5] px-3 py-1 rounded-xl bg-white scale-90 origin-left">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-[#3E2723]"><Minus size={12}/></button>
                    <span className="text-[12px] font-black w-3 text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="text-[#3E2723]"><Plus size={12}/></button>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-200 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10 py-10">
              <ShoppingBag size={50} />
              <p className="text-[10px] font-black mt-2 tracking-[0.3em]">EMPTY</p>
            </div>
          )}
        </div>

        {/* Ringkasan Pembayaran & Tombol Aktif */}
        <div className="p-6 bg-white border-t border-[#E5DCC5] space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>SUBTOTAL</span>
              <span className="text-[#3E2723]">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>PAJAK (10%)</span>
              <span className="text-[#3E2723]">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-lg font-display font-black text-[#3E2723]">TOTAL</span>
              <span className="text-2xl font-display font-black text-[#3E2723]">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Tombol Metode Pembayaran Aktif */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setPaymentMethod("Tunai")}
              className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-[1.5rem] border-2 transition-all ${
                paymentMethod === "Tunai" 
                  ? "bg-white border-[#3E2723] shadow-md ring-2 ring-[#3E2723]/5" 
                  : "bg-transparent border-gray-100 text-gray-200 opacity-40"
              }`}
            >
              <Wallet size={20} className={paymentMethod === "Tunai" ? "text-[#3E2723]" : "text-gray-200"} />
              <span className="text-[9px] font-black uppercase tracking-widest">TUNAI</span>
            </button>

            <button 
              onClick={() => setPaymentMethod("QRIS")}
              className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-[1.5rem] border-2 transition-all ${
                paymentMethod === "QRIS" 
                  ? "bg-white border-[#3E2723] shadow-md ring-2 ring-[#3E2723]/5" 
                  : "bg-transparent border-gray-100 text-gray-200 opacity-40"
              }`}
            >
              <CreditCard size={20} className={paymentMethod === "QRIS" ? "text-[#3E2723]" : "text-gray-200"} />
              <span className="text-[9px] font-black uppercase tracking-widest">QRIS/KARTU</span>
            </button>
          </div>

          <button 
            disabled={cart.length === 0}
            className="w-full py-4 bg-[#3E2723] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[12px] shadow-xl hover:bg-[#5D4037] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
            onClick={() => {
              alert(`Transaksi Berhasil! Metode: ${paymentMethod}`);
              setCart([]);
            }}
          >
            SELESAIKAN TRANSAKSI <CheckCircle2 size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5DCC5; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}