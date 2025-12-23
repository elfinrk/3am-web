"use client";

import { useState, useEffect } from "react";
import { CheckCircle, RotateCcw, Loader2, MapPin, User, Trash2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      // FILTER: HANYA TAMPILKAN ORDER ONLINE (Type bukan 'Offline')
      const onlineOnly = data.filter((order: any) => order.type !== "Offline");
      setOrders(onlineOnly);
    } catch (err) {
      console.error("Gagal ambil data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); 
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (mongoId: string, newStatus: string) => {
    setProcessingId(mongoId);
    try {
      await fetch(`/api/orders/${mongoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
    } catch (err) { alert("Gagal koneksi"); } finally { setProcessingId(null); }
  };

  const deleteOrder = async (mongoId: string) => {
    if (!confirm("Hapus pesanan ini?")) return;
    setProcessingId(mongoId);
    try {
      await fetch(`/api/orders/${mongoId}`, { method: "DELETE" });
      setOrders(prev => prev.filter(o => o._id !== mongoId));
    } catch (err) { alert("Error"); } finally { setProcessingId(null); }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#3E2723]" /></div>;

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold text-[#3E2723]">Pesanan Online</h1>
        <p className="text-sm text-[#3E2723]/60">Pesanan masuk dari Website</p>
      </div>
      <div className="bg-white rounded-[2.5rem] border border-[#E5DCC5] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <tr>
              <th className="px-10 py-6">Status & ID</th>
              <th className="px-10 py-6">Pelanggan</th>
              <th className="px-10 py-6">Total</th>
              <th className="px-10 py-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-400">Belum ada pesanan online.</td></tr>
            ) : (
                orders.map((order) => (
                <tr key={order._id} className="hover:bg-[#F9F5E8]/30">
                    <td className="px-10 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === "Selesai" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{order.status}</span>
                        <p className="text-[10px] text-gray-400 mt-2 font-mono">{order.id}</p>
                    </td>
                    <td className="px-10 py-6">
                        <p className="font-bold text-[#3E2723]">{order.customer}</p>
                        <p className="text-[10px] text-gray-400">{order.type} • {order.items}</p>
                    </td>
                    <td className="px-10 py-6 font-bold text-[#3E2723]">Rp {order.total.toLocaleString()}</td>
                    <td className="px-10 py-6 text-center flex justify-center gap-2">
                        <button onClick={() => updateStatus(order._id, "Proses")} disabled={processingId === order._id} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 text-gray-500 hover:text-orange-600"><RotateCcw size={14}/></button>
                        <button onClick={() => updateStatus(order._id, "Selesai")} disabled={processingId === order._id} className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200"><CheckCircle size={14}/></button>
                        <button onClick={() => deleteOrder(order._id)} disabled={processingId === order._id} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100"><Trash2 size={14}/></button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}