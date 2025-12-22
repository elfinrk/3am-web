"use client";

import { useState, useEffect } from "react";
import { CheckCircle, RotateCcw, Loader2, MapPin, User } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Gagal ambil data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (mongoId: string, newStatus: string) => {
    try {
      // WAJIB: Menggunakan order._id asli dari MongoDB
      const res = await fetch(`/api/orders/${mongoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        fetchOrders(); // Segarkan tabel jika sukses
      } else {
        alert(`Error: ${data.error}`); // Tampilkan pesan error spesifik
      }
    } catch (err) {
      alert("Kesalahan koneksi ke server");
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-[#3E2723] mb-4" size={40} />
      <p className="font-bold text-[#3E2723]">Sinkronisasi Database 3am...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3E2723]">Pesanan Online</h1>
        <p className="text-sm text-[#3E2723]/60 font-medium tracking-tight">Monitoring pesanan dari website (3am Collection)</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#E5DCC5] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <tr>
              <th className="px-10 py-8">STATUS & ID</th>
              <th className="px-10 py-8">PELANGGAN</th>
              <th className="px-10 py-8">LOKASI</th>
              <th className="px-10 py-8 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="group hover:bg-[#F9F5E8]/30 transition-colors">
                <td className="px-10 py-8">
                  <div className={`py-2 px-4 rounded-xl text-white text-[10px] font-black uppercase text-center inline-flex items-center gap-2 ${order.status === "Selesai" ? "bg-[#27AE60]" : "bg-[#E67E22]"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-white ${order.status !== "Selesai" && "animate-pulse"}`} />
                    {order.status || "Proses"}
                  </div>
                  <p className="font-mono text-[10px] text-gray-400 mt-2 ml-1">{order.id}</p>
                </td>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300"><User size={18} /></div>
                      <div>
                        <p className="font-bold text-sm text-[#3E2723]">{order.customer}</p>
                        <p className="text-[10px] text-gray-400">{order.phone}</p>
                      </div>
                   </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                    <MapPin size={12}/> {order.type}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[150px]">{order.address}</p>
                </td>
                <td className="px-10 py-8">
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => updateStatus(order._id, "Proses")} disabled={order.status === "Proses"} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-orange-500 border border-transparent hover:border-orange-100 transition-all disabled:opacity-20"><RotateCcw size={18}/></button>
                    <button onClick={() => updateStatus(order._id, "Selesai")} disabled={order.status === "Selesai"} className="w-10 h-10 rounded-full bg-[#27AE60] flex items-center justify-center text-white hover:scale-110 shadow-lg transition-all disabled:opacity-30"><CheckCircle size={20}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}