"use client";

import { useAdmin } from "./AdminContext";
import { 
  TrendingUp, 
  Heart, 
  ShoppingBag, 
  ArrowUpRight, 
  Plus,
  ArrowRight,
  Clock,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { orders, donationBalance, products } = useAdmin();

  // --- LOGIKA PERHITUNGAN DATA ---
  // Menghitung pendapatan dari pesanan yang statusnya "Selesai"
  const dailyRevenue = orders
    .filter(o => o.status === "Selesai")
    .reduce((acc, curr) => acc + curr.total, 0);

  // Cek produk yang stoknya menipis (di bawah 10) dari MongoDB
  const lowStockItems = products.filter(p => p.stock <= 10).length;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 p-4 lg:p-0">
      
      {/* --- SECTION 1: HEADER & REVENUE --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-black text-[#3E2723] tracking-tighter uppercase">
            Dashboard Overview
          </h1>
          <p className="text-[#3E2723]/50 font-medium">Pantau performa harian outlet 3.AM Anda.</p>
        </div>
        <div className="text-left md:text-right bg-white p-6 rounded-[2rem] border border-[#E5DCC5] shadow-sm">
          <div className="flex items-center md:justify-end gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Pendapatan Hari Ini</p>
          </div>
          <p className="text-3xl font-display font-black text-[#3E2723]">{formatIDR(dailyRevenue)}</p>
        </div>
      </div>

      {/* --- SECTION 2: SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Fitur: Penjualan */}
        <div className="bg-white p-8 rounded-[3rem] border border-[#E5DCC5] shadow-sm flex flex-col justify-between h-64 group hover:shadow-xl transition-all">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-green-50 text-green-600 rounded-3xl">
              <TrendingUp size={24} />
            </div>
            <ArrowUpRight size={20} className="text-gray-300 group-hover:text-[#3E2723] transition-colors" />
          </div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Penjualan</p>
            <h2 className="text-3xl font-display font-black text-[#3E2723]">{formatIDR(dailyRevenue)}</h2>
          </div>
        </div>

        {/* Fitur: Donasi (3.AM Care) */}
        <Link href="/admin/donations" className="bg-[#D32F2F] p-8 rounded-[3rem] shadow-2xl shadow-red-100 flex flex-col justify-between h-64 group hover:scale-[1.02] transition-all relative overflow-hidden">
          <Heart size={150} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
          <div className="flex justify-between items-start relative z-10">
            <div className="p-4 bg-white/20 text-white rounded-3xl backdrop-blur-md">
              <Heart size={24} fill="currentColor" />
            </div>
            <ArrowUpRight size={20} className="text-white/40 group-hover:text-white transition-colors" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-black text-white/60 uppercase tracking-widest mb-1">Saldo Donasi Terkumpul</p>
            <h2 className="text-3xl font-display font-black text-white">{formatIDR(donationBalance)}</h2>
          </div>
        </Link>

        {/* Fitur: Stok & Menu */}
        <Link href="/admin/stock" className="bg-white p-8 rounded-[3rem] border border-[#E5DCC5] shadow-sm flex flex-col justify-between h-64 group hover:shadow-xl transition-all">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-[#F9F5E8] text-[#3E2723] rounded-3xl">
              <ShoppingBag size={24} />
            </div>
            {lowStockItems > 0 ? (
              <div className="flex items-center gap-2 text-[9px] font-black text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase animate-bounce">
                <AlertCircle size={10} /> {lowStockItems} Item Habis
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[9px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase">
                Stok Aman
              </div>
            )}
          </div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Menu di Database</p>
            <h2 className="text-3xl font-display font-black text-[#3E2723]">{products.length} <span className="text-sm font-medium text-gray-300">Produk</span></h2>
          </div>
        </Link>
      </div>

      {/* --- SECTION 3: TABEL PESANAN & AKSES KASIR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white rounded-[3.5rem] border border-[#E5DCC5] overflow-hidden shadow-sm">
          <div className="p-10 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg text-[#3E2723]">
                <Clock size={20} />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#3E2723]">Pesanan Terbaru</h3>
            </div>
            <Link href="/admin/online-orders" className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#3E2723] transition-colors">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-6">ID</th>
                  <th className="px-10 py-6">Pelanggan</th>
                  <th className="px-10 py-6">Total</th>
                  <th className="px-10 py-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length > 0 ? (
                  orders.slice(0, 3).map((order) => (
                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-10 py-8 font-mono text-[11px] text-gray-400 tracking-tighter">{order.id}</td>
                      <td className="px-10 py-8">
                        <p className="font-display font-bold text-[#3E2723] text-lg">{order.customer}</p>
                        <p className="text-[10px] text-[#8D6E63] font-medium">{order.items}</p>
                      </td>
                      <td className="px-10 py-8 font-display font-black text-[#3E2723] text-xl">{formatIDR(order.total)}</td>
                      <td className="px-10 py-8 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                          order.status === "Selesai" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center text-gray-300 italic font-medium">Belum ada pesanan hari ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#3E2723] rounded-[3.5rem] p-10 flex flex-col justify-between shadow-2xl shadow-[#3E2723]/40 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-8 text-white">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-4xl font-display font-bold text-white mb-4">Kasir 3.AM</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-10 italic">
              "Input transaksi offline langsung untuk sinkronisasi stok otomatis."
            </p>
          </div>

          <Link 
            href="/admin/offline-orders"
            className="w-full py-6 bg-[#F9F5E8] text-[#3E2723] rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl active:scale-95 relative z-10"
          >
            BUKA KASIR <Plus size={18} strokeWidth={4} />
          </Link>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
}