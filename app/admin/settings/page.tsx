"use client";

import { useState, useRef } from "react";
import { 
  CreditCard, Percent, Store, ImageIcon, Save, 
  Upload, X, Plus, Trash2, TicketPercent
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("Pembayaran");
  
  // --- STATE DATA ---
  const [qrisPreview, setQrisPreview] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState({
    bankName: "BCA",
    accountNumber: "7275472760",
    accountHolder: "3.AM COFFEE OFFICIAL"
  });

  // State Diskon dengan ID dinamis agar bisa dihapus/tambah
  const [discounts, setDiscounts] = useState([
    { id: Date.now(), name: "Promo Opening", value: 15000, code: "WELCOME3AM" },
  ]);

  const [taxInfo, setTaxInfo] = useState({
    pajak: "10",
    service: "5",
    kemasan: 2000,
    minReservasi: 100000
  });

  // --- FORMATTER LOGIC (100.000) ---
  const formatNumber = (val: number | string) => {
    if (!val && val !== 0) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const cleanNumber = (val: string) => {
    return parseInt(val.replace(/\./g, "")) || 0;
  };

  // --- HANDLERS DISKON (Fungsional) ---
  const addNewDiscount = () => {
    const newDisc = {
      id: Date.now(),
      name: "Promo Baru",
      value: 0,
      code: "NEWPROMO"
    };
    setDiscounts([...discounts, newDisc]); // Fungsi Tambah
  };

  const removeDiscount = (id: number) => {
    setDiscounts(discounts.filter(d => d.id !== id)); // Fungsi Hapus
  };

  const updateDiscount = (id: number, field: string, val: any) => {
    setDiscounts(discounts.map(d => d.id === id ? { ...d, [field]: val } : d));
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 pb-20 p-6">
      
      {/* HEADER & CLOSE BUTTON */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-black text-[#3E2723] tracking-tighter uppercase">Pengaturan Toko</h1>
          <p className="text-[#3E2723]/50 font-medium">Kelola metode pembayaran, diskon, dan biaya operasional.</p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="p-4 bg-white border border-[#E5DCC5] rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm active:scale-95"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR TABS */}
        <div className="w-full lg:w-[320px] space-y-3">
          {[
            { id: "Pembayaran", icon: <CreditCard size={18} /> },
            { id: "Diskon", icon: <TicketPercent size={18} /> },
            { id: "Biaya & Pajak", icon: <Percent size={18} /> },
            { id: "Operasional", icon: <Store size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? "bg-[#3E2723] text-white shadow-2xl shadow-[#3E2723]/20 translate-x-2" 
                : "bg-white text-[#3E2723]/30 border border-[#E5DCC5] hover:border-[#3E2723]"
              }`}
            >
              {tab.icon} {tab.id}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-white rounded-[3.5rem] border border-[#E5DCC5] shadow-sm flex flex-col min-h-[700px] relative">
          
          <div className="p-12 flex-1">
            
            {/* TAB: PEMBAYARAN */}
            {activeTab === "Pembayaran" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-8">
                  <h3 className="text-2xl font-display font-black text-[#3E2723]">Info Transfer</h3>
                  <div className="space-y-6">
                    <input type="text" value={paymentInfo.bankName} placeholder="Nama Bank" className="w-full bg-[#F9F5E8]/30 border-b-2 border-[#E5DCC5] rounded-2xl py-5 px-7 font-bold text-[#3E2723] outline-none" onChange={(e) => setPaymentInfo({...paymentInfo, bankName: e.target.value})} />
                    <input type="text" value={paymentInfo.accountNumber} placeholder="Nomor Rekening" className="w-full bg-[#F9F5E8]/30 border-b-2 border-[#E5DCC5] rounded-2xl py-5 px-7 font-bold text-[#3E2723] outline-none" onChange={(e) => setPaymentInfo({...paymentInfo, accountNumber: e.target.value})} />
                    <input type="text" value={paymentInfo.accountHolder} placeholder="Atas Nama" className="w-full bg-[#F9F5E8]/30 border-b-2 border-[#E5DCC5] rounded-2xl py-5 px-7 font-bold text-[#3E2723] outline-none" onChange={(e) => setPaymentInfo({...paymentInfo, accountHolder: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-8">
                  <h3 className="text-2xl font-display font-black text-[#3E2723]">QRIS Code</h3>
                  <div onClick={() => fileInputRef.current?.click()} className="aspect-square w-full max-w-[300px] border-4 border-dashed border-[#F9F5E8] rounded-[3.5rem] flex items-center justify-center cursor-pointer hover:border-[#3E2723] relative overflow-hidden">
                    {qrisPreview ? <Image src={qrisPreview} alt="QRIS" fill className="object-contain p-8" /> : <Upload size={32} className="text-gray-300" />}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setQrisPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DISKON (Fungsional Tambah & Hapus) */}
            {activeTab === "Diskon" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-display font-black text-[#3E2723]">Pengaturan Diskon & Promo</h3>
                  <button 
                    onClick={addNewDiscount}
                    className="w-12 h-12 bg-[#3E2723] text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {discounts.map((discount) => (
                    <div key={discount.id} className="bg-[#F9F5E8]/30 border border-[#E5DCC5] rounded-[3rem] p-10 space-y-6 relative group transition-all hover:bg-white hover:shadow-2xl">
                      <input 
                        type="text" 
                        value={discount.name} 
                        onChange={(e) => updateDiscount(discount.id, 'name', e.target.value)}
                        className="w-full bg-transparent font-display font-black text-2xl text-[#3E2723] outline-none" 
                      />
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#3E2723] text-xl">Rp</span>
                        <input 
                          type="text" 
                          value={formatNumber(discount.value)} 
                          onChange={(e) => updateDiscount(discount.id, 'value', cleanNumber(e.target.value))}
                          className="w-full bg-transparent font-display font-black text-5xl text-[#3E2723] outline-none" 
                        />
                      </div>
                      <div className="flex justify-between items-center pt-6 border-t border-[#E5DCC5]/50">
                        <input 
                          type="text" 
                          value={discount.code} 
                          onChange={(e) => updateDiscount(discount.id, 'code', e.target.value.toUpperCase())}
                          className="bg-white border border-[#E5DCC5] rounded-xl px-4 py-2 text-[10px] font-black text-[#3E2723] outline-none w-32"
                        />
                        <button 
                          onClick={() => removeDiscount(discount.id)}
                          className="text-red-300 hover:text-red-600 transition-colors p-2"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BIAYA & PAJAK (image_c29b5f.png) */}
            {activeTab === "Biaya & Pajak" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Pajak Resto (PB1) %</label>
                  <input type="text" value={taxInfo.pajak} className="w-full bg-[#F9F5E8]/40 border-2 border-[#E5DCC5]/30 rounded-[1.5rem] py-5 px-8 font-black text-[#3E2723]" onChange={(e) => setTaxInfo({...taxInfo, pajak: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Biaya Kemasan (Format Titik)</label>
                  <input type="text" value={formatNumber(taxInfo.kemasan)} className="w-full bg-[#F9F5E8]/40 border-2 border-[#E5DCC5]/30 rounded-[1.5rem] py-5 px-8 font-black text-[#3E2723]" onChange={(e) => setTaxInfo({...taxInfo, kemasan: cleanNumber(e.target.value)})} />
                </div>
              </div>
            )}
          </div>

          {/* FOOTER ACTION */}
          <div className="p-10 border-t border-gray-50 flex justify-end bg-gray-50/20">
            <button 
              onClick={() => alert("Pengaturan Berhasil Disimpan!")}
              className="bg-[#3E2723] text-white px-14 py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 shadow-2xl hover:bg-[#5D4037] active:scale-95 transition-all"
            >
              SIMPAN PERUBAHAN <Save size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}