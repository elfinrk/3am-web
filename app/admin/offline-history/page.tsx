"use client";

import { useState, useEffect } from "react";
import { Loader2, Calendar, Search, CreditCard, Wallet, Trash2 } from "lucide-react";

export default function OfflineHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // --- FETCH DATA ---
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      
      // FILTER: Hanya ambil data Kasir (Offline)
      // Data online tidak akan muncul disini
      const offlineOnly = data.filter((order: any) => order.type === "Offline");
      
      setOrders(offlineOnly.reverse()); 
    } catch (err) {
      console.error("Gagal mengambil data riwayat kasir");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- FUNGSI HAPUS ---
  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Apakah Anda yakin ingin menghapus riwayat ini?")) return;

    setProcessingId(id);
    try {
      // Panggil API DELETE yang baru dibuat di folder [id]
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Hapus dari tampilan instan
        setOrders((prev) => prev.filter((o) => o._id !== id));
      } else {
        // Jika gagal, coba baca pesan error dari server
        const errorData = await res.json().catch(() => ({}));
        alert(`Gagal menghapus: ${errorData.error || "Terjadi kesalahan server"}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setProcessingId(null);
    }
  };

  // --- FILTER PENCARIAN ---
  const filteredOrders = orders.filter((o) => 
    o.id?.toLowerCase().includes(search.toLowerCase()) || 
    o.customer?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#3E2723] mb-4" size={40} />
        <p className="font-bold text-[#3E2723]">Memuat Riwayat...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h1 className="text-3xl font-black text-[#3E2723]">Riwayat Kasir</h1>
            <p className="text-gray-500 text-sm">Rekap transaksi manual (Dine-in / Takeaway Offline)</p>
        </div>
        <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            <input 
                type="text" 
                placeholder="Cari ID Transaksi..." 
                className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] transition-all"
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-[#E5DCC5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#3E2723]/5 text-[10px] font-black uppercase tracking-widest text-[#3E2723]">
              <tr>
                <th className="px-6 py-4">ID & Waktu</th>
                <th className="px-6 py-4">Metode Pembayaran</th>
                <th className="px-6 py-4">Detail Menu</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400 italic">
                      {search ? "Transaksi tidak ditemukan." : "Belum ada riwayat transaksi kasir."}
                    </td>
                  </tr>
              ) : (
                  filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 align-top">
                              <span className="font-mono font-bold text-[#3E2723] block mb-1">
                                {order.id}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                  <Calendar size={12} /> 
                                  {new Date(order.createdAt).toLocaleString('id-ID', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                              </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                order.paymentMethod === "QRIS" 
                                  ? "bg-blue-50 text-blue-700 border-blue-100" 
                                  : "bg-green-50 text-green-700 border-green-100"
                              }`}>
                                {order.paymentMethod === "QRIS" ? <CreditCard size={12}/> : <Wallet size={12}/>}
                                {order.paymentMethod || "Tunai"}
                              </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                              <p className="text-gray-600 text-xs leading-relaxed max-w-sm">
                                {order.items}
                              </p>
                          </td>
                          <td className="px-6 py-4 align-top text-right">
                              <span className="font-black text-[#3E2723] text-lg block">
                                Rp {order.total?.toLocaleString('id-ID')}
                              </span>
                              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                LUNAS
                              </span>
                          </td>
                          <td className="px-6 py-4 align-top text-center">
                              <button 
                                onClick={() => handleDelete(order._id)}
                                disabled={processingId === order._id}
                                className="p-2 bg-white border border-gray-200 text-red-300 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                                title="Hapus Data"
                              >
                                {processingId === order._id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                              </button>
                          </td>
                      </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}