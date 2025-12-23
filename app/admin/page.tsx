"use client";

import { useAdmin } from "./AdminContext";
import { useState, useEffect } from "react";
import { 
  Heart, 
  ShoppingBag, 
  ArrowUpRight, 
  Plus,
  Clock,
  AlertCircle,
  Wallet,
  Calendar,
  Loader2,
  MapPin,
  Smartphone
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { products } = useAdmin(); // Kita hanya ambil produk dari context
  
  // --- STATE DATA REAL-TIME ---
  const [dashboardOrders, setDashboardOrders] = useState<any[]>([]); // Data Order Khusus Dashboard
  const [donationTotal, setDonationTotal] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. FETCH SEMUA DATA (Orders, Donasi, Reservasi) ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // A. AMBIL DATA PESANAN TERBARU (PENTING AGAR PROFIT UPDATE)
        const resOrders = await fetch("/api/orders");
        const dataOrders = await resOrders.json();
        setDashboardOrders(dataOrders);

        // B. Ambil Data Donasi
        const resDonasi = await fetch("/api/donate");
        const dataDonasi = await resDonasi.json();
        setDonationTotal(dataDonasi.balance || 0);
        
        // C. Ambil Data Reservasi
        const resReservasi = await fetch("/api/reservations");
        const dataReservasi = await resReservasi.json();
        
        // Hitung Reservasi
        const pendingCount = dataReservasi.filter((r: any) => r.status === "Pending").length;
        const activeCount = dataReservasi.filter((r: any) => r.status === "Pending" || r.status === "Approved").length;

        setPendingReservations(pendingCount);
        setReservationCount(activeCount);

      } catch (error) {
        console.error("Gagal sinkronisasi data dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
    
    // Opsional: Auto refresh setiap 30 detik agar dashboard selalu live
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);

  }, []);

  // --- 2. KALKULASI KEUANGAN (DARI DATA YANG BARU DI-FETCH) ---
  
  // Filter hanya order yang statusnya "Selesai"
  const completedOrders = dashboardOrders.filter(o => o.status === "Selesai");

  // Hitung Omset (Total Revenue)
  const totalRevenue = completedOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);

  // Estimasi Profit Bersih (40% Margin)
  const estimatedProfit = totalRevenue * 0.4; 

  // Total Transaksi Berhasil
  const totalTransactions = completedOrders.length;

  // Cek Stok Kritis (Dibawah 5 item)
  const criticalStock = products.filter(p => p.stock <= 5);

  // Formatter Rupiah
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  const today = new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen text-[#3E2723] gap-2">
      <Loader2 className="animate-spin" /> Menghitung Profit...
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 p-4 lg:p-0">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> Live Dashboard
          </div>
          <h1 className="text-4xl font-display font-black text-[#3E2723] tracking-tight">
            Ringkasan Bisnis
          </h1>
          <p className="text-[#3E2723]/60 font-medium mt-1">{today}</p>
        </div>
        
        {/* Quick Stats Banner */}
        <div className="flex gap-4">
            <div className="text-right px-6 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm hidden md:block">
                <p className="text-[10px] font-black text-gray-400 uppercase">Total Transaksi Selesai</p>
                <p className="text-xl font-black text-[#3E2723]">{totalTransactions}</p>
            </div>
        </div>
      </div>

      {/* --- STATS CARDS (4 KOLOM) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. KARTU PROFIT (Updated Real-time) */}
        <div className="bg-[#3E2723] p-6 rounded-[2.5rem] shadow-xl shadow-[#3E2723]/20 flex flex-col justify-between h-52 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-white/10 text-[#F3EDE2] rounded-2xl backdrop-blur-md">
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded-full">+40% Margin</span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Profit Bersih</p>
            <h2 className="text-3xl font-display font-black text-white">{formatIDR(estimatedProfit)}</h2>
          </div>
        </div>

        {/* 2. KARTU OMSET */}
        <Link href="/admin/finance" className="bg-white p-6 rounded-[2.5rem] border border-[#E5DCC5] shadow-sm flex flex-col justify-between h-52 group hover:shadow-lg transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <ShoppingBag size={20} />
            </div>
            <ArrowUpRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors"/>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Omset</p>
            <h2 className="text-3xl font-display font-black text-[#3E2723]">{formatIDR(totalRevenue)}</h2>
            <p className="text-[10px] text-gray-400 mt-1">Gabungan Online & Offline</p>
          </div>
        </Link>

        {/* 3. KARTU DONASI */}
        <Link href="/admin/donations" className="bg-[#D32F2F] p-6 rounded-[2.5rem] shadow-xl shadow-red-100 flex flex-col justify-between h-52 group hover:scale-[1.02] transition-all relative overflow-hidden">
          <Heart size={100} className="absolute -right-5 -bottom-5 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-white/20 text-white rounded-2xl backdrop-blur-md">
              <Heart size={20} fill="currentColor" />
            </div>
            <ArrowUpRight size={18} className="text-white/40 group-hover:text-white transition-colors" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Dana Terkumpul</p>
            <h2 className="text-2xl font-display font-black text-white">{formatIDR(donationTotal)}</h2>
            <p className="text-[10px] text-white/70 mt-1">Program #3AMBerbagi</p>
          </div>
        </Link>

        {/* 4. KARTU RESERVASI */}
        <Link href="/admin/reservations" className="bg-white p-6 rounded-[2.5rem] border border-[#E5DCC5] shadow-sm flex flex-col justify-between h-52 group hover:shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <Calendar size={20} />
            </div>
            {pendingReservations > 0 && (
                <span className="text-[9px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse">{pendingReservations} Perlu Cek</span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reservasi Aktif</p>
            <h2 className="text-3xl font-display font-black text-[#3E2723]">{reservationCount} <span className="text-sm text-gray-300 font-medium">Booking</span></h2>
            <p className="text-[10px] text-gray-400 mt-1">Total Kedatangan</p>
          </div>
        </Link>
      </div>

      {/* --- SECTION BAWAH: DATA DETAIL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. TABLE PESANAN TERBARU */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-[#E5DCC5] overflow-hidden shadow-sm flex flex-col">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-display font-bold text-xl text-[#3E2723] flex items-center gap-2">
                <Clock size={20} className="text-gray-400"/> Transaksi Terakhir
            </h3>
            <div className="flex gap-2">
                <Link href="/admin/offline-history" className="text-xs font-bold text-[#3E2723] bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all">History Kasir</Link>
                <Link href="/admin/online-orders" className="text-xs font-bold text-white bg-[#3E2723] px-3 py-1.5 rounded-lg hover:bg-[#5D4037] transition-all">Order Online</Link>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Tipe & ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Total</th>
                  <th className="px-8 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {dashboardOrders.length > 0 ? (
                  dashboardOrders.slice(0, 5).map((order) => (
                    <tr key={order._id || order.id} className="group hover:bg-[#F9F5E8]/30 transition-colors">
                      <td className="px-8 py-5">
                         {order.type === "Offline" ? (
                             <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase mb-1 border border-gray-200">
                                <MapPin size={8} /> Offline
                             </span>
                         ) : (
                             <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase mb-1 border border-blue-100">
                                <Smartphone size={8} /> Online
                             </span>
                         )}
                         <div className="font-mono text-gray-500 text-xs">{order.id}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-[#3E2723] block">{order.customer}</span>
                        <span className="text-xs text-gray-400 truncate max-w-[150px] block">{order.items}</span>
                      </td>
                      <td className="px-8 py-5 font-bold text-[#3E2723]">{formatIDR(order.total)}</td>
                      <td className="px-8 py-5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "Selesai" ? "bg-green-100 text-green-700" : 
                          order.status === "Diproses" || order.status === "Proses" ? "bg-blue-100 text-blue-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400 italic">Belum ada transaksi hari ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. SIDEBAR ACTION */}
        <div className="space-y-6">
            <div className="bg-[#3E2723] rounded-[3rem] p-8 relative overflow-hidden group shadow-xl">
                <div className="relative z-10 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                        <Plus size={24} />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-2">Kasir Offline</h3>
                    <p className="text-white/60 text-xs mb-6">Input pesanan dine-in manual.</p>
                    <Link href="/admin/offline-orders" className="block w-full py-4 bg-white text-[#3E2723] rounded-2xl text-center text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
                        Buka POS System
                    </Link>
                </div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl pointer-events-none" />
            </div>

            <div className="bg-white rounded-[3rem] p-8 border border-[#E5DCC5] shadow-sm h-fit">
                <h3 className="font-bold text-[#3E2723] flex items-center gap-2 mb-4">
                    <AlertCircle size={18} className="text-orange-500"/> Stok Menipis
                </h3>
                {criticalStock.length > 0 ? (
                    <div className="space-y-3">
                        {criticalStock.slice(0, 3).map((item: any) => (
                            <div key={item._id} className="flex justify-between items-center bg-red-50 p-3 rounded-2xl border border-red-100">
                                <span className="text-xs font-bold text-[#3E2723]">{item.name}</span>
                                <span className="text-[10px] font-black text-red-600 bg-white px-2 py-1 rounded-lg">Sisa {item.stock}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        Stok aman.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}