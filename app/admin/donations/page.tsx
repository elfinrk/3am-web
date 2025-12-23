"use client";

import { useState, useEffect } from "react";
import { Heart, Users, Calendar, ArrowUpRight, Loader2, Trash2, RefreshCw } from "lucide-react";

export default function DonationsPage() {
  const [balance, setBalance] = useState(0);
  const [donors, setDonors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // State untuk loading hapus

  const fetchDonations = async () => {
    try {
      const res = await fetch("/api/donate");
      if (!res.ok) throw new Error("Gagal fetch");
      const data = await res.json();
      setBalance(data.balance || 0);
      setDonors(data.donors || []);
    } catch (err) {
      console.error("Gagal load data donasi");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNGSI HAPUS DATA ---
  const handleResetData = async () => {
    // 1. Konfirmasi Keamanan
    if (!confirm("⚠️ PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA data donasi? Tindakan ini tidak bisa dibatalkan!")) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/donate", { method: "DELETE" });
      if (res.ok) {
        alert("Semua data donasi berhasil dihapus.");
        fetchDonations(); // Refresh data agar jadi 0
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return (
    <div className="flex justify-center items-center h-64 text-[#3E2723]">
      <Loader2 className="animate-spin mr-2" /> Menghubungkan Database...
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER ACTIONS */}
      <div className="flex justify-end gap-3">
        <button 
            onClick={fetchDonations} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5DCC5] rounded-xl text-sm font-bold text-[#3E2723] hover:bg-gray-50 transition-colors"
        >
            <RefreshCw size={16} /> Refresh
        </button>
        <button 
            onClick={handleResetData} 
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-xl text-sm font-bold text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
        >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} 
            Hapus Semua Data
        </button>
      </div>

      {/* Saldo Banner */}
      <div className="relative bg-[#D32F2F] rounded-[3rem] p-12 overflow-hidden shadow-2xl shadow-red-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 space-y-4 text-white">
          <div className="flex items-center gap-2 text-white/80">
            <Heart size={18} className="fill-white animate-pulse" />
            <p className="text-xs font-black uppercase tracking-widest">Saldo Donasi Terkumpul</p>
          </div>
          <h2 className="text-6xl font-display font-black tracking-tight">
            Rp {balance.toLocaleString('id-ID')}
          </h2>
          <p className="text-xs opacity-60">*Total akumulasi dari program #3AMBerbagi</p>
        </div>
      </div>

      {/* List Donatur */}
      <div className="bg-white rounded-[3rem] border border-[#E5DCC5] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <Users size={20} className="text-[#3E2723]" />
            <h3 className="font-black text-[#3E2723] uppercase tracking-widest text-sm">Riwayat Masuk ({donors.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
          {donors.length === 0 ? (
            <div className="p-10 text-center text-gray-400 italic">Data donasi kosong (Telah direset).</div>
          ) : (
            donors.map((donor) => (
              <div key={donor._id} className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#F9F5E8]/30 transition-colors gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-display font-bold text-[#3E2723] text-lg">{donor.donorName}</h4>
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-md uppercase">Sukses</span>
                  </div>
                  <p className="text-sm text-gray-500 italic">"{donor.message}"</p>
                  <p className="text-[10px] font-bold text-gray-300 uppercase mt-1 flex items-center gap-1">
                    <Calendar size={10} /> 
                    {new Date(donor.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="text-2xl font-display font-black text-green-600 flex items-center gap-1">
                  <ArrowUpRight size={18} /> Rp {donor.amount?.toLocaleString('id-ID')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}