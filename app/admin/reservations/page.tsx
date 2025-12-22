"use client";

import { useState } from "react";
import { useAdmin } from "../AdminContext";
import { 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminReservationsPage() {
  // Mengambil data dan fungsi dari AdminContext
  const { reservations, updateReservationStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data berdasarkan input pencarian
  const filteredRes = reservations.filter(res => 
    res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#3E2723]">Data Reservasi</h1>
          <p className="text-sm text-[#3E2723]/50 font-medium">Kelola jadwal kunjungan dan pre-order meja.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E2723]/30" size={18} />
          <input 
            type="text" 
            placeholder="Cari Nama/ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-[#E5DCC5] rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none shadow-sm w-64 transition-all focus:ring-2 ring-[#3E2723]/5"
          />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[2.5rem] border border-[#E5DCC5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F9F5E8]/30 border-b border-[#E5DCC5]">
              <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3E2723]/40">
                <th className="px-8 py-6">ID & Status</th>
                <th className="px-8 py-6">Pelanggan</th>
                <th className="px-8 py-6">Jadwal</th>
                <th className="px-8 py-6 text-center">Tamu</th>
                <th className="px-8 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {filteredRes.length > 0 ? (
                  filteredRes.map((res) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={res.id} 
                      className="hover:bg-[#F9F5E8]/20 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <p className="font-mono text-xs font-bold text-[#8D6E63]">{res.id}</p>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          res.status === "Confirmed" ? "bg-green-100 text-green-700" : 
                          res.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      
                      <td className="px-8 py-6">
                        <p className="font-bold text-sm text-[#3E2723]">{res.name}</p>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-[#3E2723]/70">
                          <Calendar size={14} /> {res.date}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-[#3E2723]/70 mt-1">
                          <Clock size={14} /> {res.time} WIB
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center font-bold text-[#3E2723]">
                        <div className="flex items-center justify-center gap-1">
                          <Users size={14} /> {res.guests}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => updateReservationStatus(res.id, "Confirmed")}
                            className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                            title="Confirm Arrival"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => updateReservationStatus(res.id, "Cancelled")}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                            title="Cancel Reservation"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Calendar size={48} className="mb-4" />
                        <p className="font-display font-bold text-xl">Belum ada data reservasi</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- INFO BOX --- */}
      <div className="bg-[#3E2723]/5 border border-[#3E2723]/10 p-6 rounded-[2rem] flex items-start gap-4">
        <AlertCircle className="text-[#3E2723] mt-1" size={20} />
        <div>
          <h4 className="font-bold text-sm text-[#3E2723]">Catatan Barista</h4>
          <p className="text-xs text-[#3E2723]/60 leading-relaxed mt-1">
            Data reservasi di atas sinkron secara otomatis dengan input pelanggan dari Website. Pastikan ketersediaan meja sebelum mengonfirmasi kedatangan.
          </p>
        </div>
      </div>
    </div>
  );
}