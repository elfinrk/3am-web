"use client";

import { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, Printer, DollarSign, Receipt, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";

export default function FinancePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH LANGSUNG DARI API AGAR REALTIME
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (e) { console.error("Error"); } finally { setIsLoading(false); }
    };
    fetchFinanceData();
  }, []);

  // --- LOGIKA: AMBIL SEMUA ORDER 'SELESAI' (ONLINE + OFFLINE) ---
  const completedOrders = orders.filter((o) => o.status === "Selesai");

  const totalRevenue = completedOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const estimatedCost = totalRevenue * 0.6; 
  const netProfit = totalRevenue - estimatedCost;

  const formatIDR = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  if (isLoading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2"/> Menghitung Keuangan...</div>;

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="flex justify-between items-center border-b border-[#E5DCC5] pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#3E2723]">Laporan Keuangan</h1>
          <p className="text-[#8D6E63] text-sm">Gabungan Kasir & Pesanan Online</p>
        </div>
        <button onClick={() => window.print()} className="bg-[#3E2723] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Printer size={16}/> Print</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-[#E5DCC5] shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full"><TrendingUp size={16}/><span className="text-xs font-bold">PEMASUKAN</span></div>
          <h2 className="text-3xl font-black text-[#3E2723]">{formatIDR(totalRevenue)}</h2>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-[#E5DCC5] shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-red-600 bg-red-50 w-fit px-3 py-1 rounded-full"><TrendingDown size={16}/><span className="text-xs font-bold">HPP (60%)</span></div>
          <h2 className="text-3xl font-black text-[#3E2723]">{formatIDR(estimatedCost)}</h2>
        </div>
        <div className="bg-[#3E2723] text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-4 text-white/80"><Wallet size={16}/><span className="text-xs font-bold">PROFIT BERSIH</span></div>
             <h2 className="text-3xl font-black">{formatIDR(netProfit)}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}