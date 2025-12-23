"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Clock, Users, MessageSquare, Phone, 
  Check, X, RefreshCw, Loader2, AlertCircle, Trash2 
} from "lucide-react";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // --- 1. FETCH DATA ---
  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Gagal load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 30000); 
    return () => clearInterval(interval);
  }, []);

  // --- 2. UPDATE STATUS (TERIMA / TOLAK) ---
  const handleStatus = async (id: string, newStatus: "Approved" | "Rejected") => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        setReservations(prev => prev.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        ));
      } else {
          alert("Gagal update status");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setProcessingId(null);
    }
  };

  // --- 3. HAPUS DATA (DELETE) ---
  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Apakah Anda yakin ingin menghapus data reservasi ini?")) return;
    
    setProcessingId(id);
    try {
        const res = await fetch("/api/reservations", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        if (res.ok) {
            // Hapus dari state lokal
            setReservations(prev => prev.filter(item => item._id !== id));
            alert("Data berhasil dihapus");
        } else {
            const errorData = await res.json();
            alert(`Gagal menghapus data: ${errorData.error || "Unknown error"}`);
        }
    } catch (e) {
        alert("Terjadi kesalahan koneksi server.");
    } finally {
        setProcessingId(null);
    }
  };

  // --- 4. GENERATE LINK WA ---
  const getWALink = (res: any) => {
    const phone = res.phone?.replace(/^0/, '62').replace(/\D/g, ''); 
    let message = "";

    if (res.status === "Approved") {
        message = `Halo Kak ${res.name}, reservasi di 3.AM Coffee untuk tgl ${res.date} jam ${res.time} (${res.pax} orang) sudah kami KONFIRMASI. Ditunggu kedatangannya!`;
    } else if (res.status === "Rejected") {
        message = `Halo Kak ${res.name}, mohon maaf reservasi di 3.AM Coffee untuk tgl ${res.date} belum bisa kami terima karena slot penuh/tutup. Terima kasih.`;
    } else {
        message = `Halo Kak ${res.name}, terkait reservasi di 3.AM Coffee untuk tgl ${res.date}...`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  if (isLoading) return <div className="p-10 text-center flex justify-center"><Loader2 className="animate-spin text-[#3E2723]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-[#E5DCC5] shadow-sm">
        <div>
            <h1 className="text-3xl font-black text-[#3E2723]">Data Reservasi</h1>
            <p className="text-gray-500 text-sm">Pantau dan konfirmasi booking pelanggan</p>
        </div>
        <button onClick={fetchReservations} className="flex items-center gap-2 bg-[#F9F5E8] px-4 py-2 rounded-xl text-sm font-bold text-[#3E2723] hover:bg-[#E5DCC5] transition">
            <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* LIST RESERVASI */}
      <div className="grid gap-4">
        {reservations.length === 0 ? (
            <div className="text-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-300 text-gray-400">
                Belum ada reservasi masuk.
            </div>
        ) : (
            reservations.map((res) => {
                const isApproved = res.status === "Approved";
                const isRejected = res.status === "Rejected";
                
                return (
                <div key={res._id} className={`p-6 rounded-3xl border shadow-sm transition-all flex flex-col md:flex-row gap-6 ${isRejected ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-white border-[#E5DCC5] hover:shadow-md'}`}>
                    
                    {/* BAGIAN KIRI: INFO UTAMA */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-[#3E2723]">{res.name}</h3>
                            {isApproved && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Check size={12}/> Confirmed</span>}
                            {isRejected && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><X size={12}/> Ditolak</span>}
                            {(!res.status || res.status === "Pending") && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><AlertCircle size={12}/> Pending</span>}
                        </div>

                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 text-sm text-gray-600">
                            <div className="bg-[#F9F5E8] px-3 py-1.5 rounded-lg flex items-center gap-2"><Calendar size={14}/> {res.date}</div>
                            <div className="bg-[#F9F5E8] px-3 py-1.5 rounded-lg flex items-center gap-2"><Clock size={14}/> {res.time}</div>
                            <div className="bg-[#F9F5E8] px-3 py-1.5 rounded-lg flex items-center gap-2"><Users size={14}/> {res.pax} Org</div>
                        </div>

                        {res.orderedMenu && res.orderedMenu !== "Tidak ada pre-order" && (
                            <div className="text-xs bg-orange-50 p-3 rounded-xl border border-orange-100 text-[#3E2723]">
                                <span className="font-bold block mb-1">Pre-Order Menu:</span>
                                {res.orderedMenu}
                            </div>
                        )}

                        {res.notes && res.notes !== "-" && (
                            <div className="flex gap-2 text-xs text-gray-500 italic">
                                <MessageSquare size={14} className="mt-0.5 shrink-0"/> "{res.notes}"
                            </div>
                        )}
                    </div>
                    
                    {/* BAGIAN KANAN: AKSI */}
                    <div className="flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                        
                        {/* Tombol Terima / Tolak */}
                        {(!res.status || res.status === "Pending") && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleStatus(res._id, "Rejected")}
                                    disabled={processingId === res._id}
                                    className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition flex justify-center items-center gap-1"
                                >
                                    <X size={14} /> Tolak
                                </button>
                                <button 
                                    onClick={() => handleStatus(res._id, "Approved")}
                                    disabled={processingId === res._id}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition flex justify-center items-center gap-1 shadow-sm"
                                >
                                    <Check size={14} /> Terima
                                </button>
                            </div>
                        )}

                        {/* Tombol WA */}
                        <a 
                            href={getWALink(res)} 
                            target="_blank" 
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                isRejected 
                                ? "bg-gray-100 text-gray-400 hover:bg-gray-200" 
                                : "bg-[#25D366] text-white hover:bg-[#20bd5a]"
                            }`}
                        >
                            <Phone size={14} /> 
                            {isRejected ? "Info Penolakan" : (isApproved ? "Kirim Konfirmasi" : "Hubungi WA")}
                        </a>

                        {/* Tombol Hapus (Baru) */}
                        <button 
                            onClick={() => handleDelete(res._id)} 
                            disabled={processingId === res._id}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-red-400 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            {processingId === res._id ? <Loader2 className="animate-spin" size={14}/> : <Trash2 size={14} />} 
                            Hapus Data
                        </button>
                    </div>
                </div>
                );
            })
        )}
      </div>
    </div>
  );
}