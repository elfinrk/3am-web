"use client";

import { useAdmin } from "../AdminContext";
import { Heart, Users, Calendar, ArrowUpRight } from "lucide-react";

// Ensure you use 'export default' so Next.js can recognize the page
export default function DonationsPage() {
  const { donationBalance, donors } = useAdmin();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Saldo Donasi Banner */}
      <div className="relative bg-[#D32F2F] rounded-[3rem] p-12 overflow-hidden shadow-2xl shadow-red-200">
        <div className="relative z-10 space-y-4 text-white">
          <p className="text-xs font-black uppercase tracking-widest opacity-80">Saldo Donasi Terkumpul</p>
          <h2 className="text-6xl font-display font-black">
            Rp {donationBalance?.toLocaleString('id-ID') || "0"}
          </h2>
          <p className="text-xs opacity-60">*Total akumulasi dari program #3AMBerbagi</p>
        </div>
      </div>

      {/* Donatur Terbaru List */}
      <div className="bg-white rounded-[3rem] border border-[#E5DCC5] overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <Users size={20} className="text-[#3E2723]" />
          <h3 className="font-black text-[#3E2723] uppercase tracking-widest text-sm">Donatur Terbaru</h3>
        </div>
        
        <div className="divide-y divide-gray-50">
          {donors?.map((donor) => (
            <div key={donor.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h4 className="font-display font-black text-[#3E2723] text-xl">{donor.name}</h4>
                <p className="text-sm italic text-gray-400">"{donor.message}"</p>
                <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase">{donor.date}</p>
              </div>
              <div className="text-2xl font-display font-black text-green-600">
                + Rp {donor.amount?.toLocaleString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}