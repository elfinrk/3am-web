"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, CheckCircle, Sparkles, CreditCard, QrCode, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti"; 

const PAYMENT_DATA = {
  bank: { name: "BCA", number: "7275472760", holder: "3.AM COFFEE OFFICIAL" },
  qris: "/qris.jpg" 
};

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [displayCustomAmount, setDisplayCustomAmount] = useState("");
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "transfer">("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- SLIDER CERITA ---
  const stories = [
    { img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000", title: "Berbagi Senyuman", text: "Donasi Anda adalah alasan mereka tersenyum hari ini." },
    { img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1000", title: "Mewujudkan Mimpi", text: "Membantu pendidikan anak-anak untuk masa depan yang lebih cerah." },
    { img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000", title: "Hangatnya Berbagi", text: "Kepedulian Anda menghangatkan hati yang membutuhkan." }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % stories.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // --- OPSI NOMINAL ---
  const donationOptions = [
    20000, 50000, 75000, 
    100000, 250000, 500000
  ];

  // --- LOGIC FORMATTER ---
  const formatNumber = (num: string) => num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // 1. Logic saat mengetik manual
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const rawVal = Number(val.replace(/\D/g, "")); // Hapus titik untuk cek angka murni
    
    // Format tampilan dengan titik
    setDisplayCustomAmount(formatNumber(val));

    // Cek apakah angka yang diketik cocok dengan salah satu kotak?
    if (donationOptions.includes(rawVal)) {
        setSelectedAmount(rawVal); // Nyalakan kotak
    } else {
        setSelectedAmount(null); // Matikan kotak
    }
  };

  // 2. Logic saat kotak diklik (Sinkronisasi ke Input)
  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount); // Highlight kotak
    setDisplayCustomAmount(formatNumber(amount.toString())); // Isi Input text otomatis
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#D32F2F', '#FFA000', '#FFFFFF'] });
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ambil nilai dari displayCustomAmount (karena input text adalah sumber utama sekarang)
    const rawCustomAmount = Number(displayCustomAmount.replaceAll(".", ""));
    
    if (!rawCustomAmount || rawCustomAmount < 10000) return alert("Mohon masukkan nominal minimal Rp 10.000");

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: rawCustomAmount,
          name: formData.name,
          message: formData.message,
          method: paymentMethod
        })
      });

      if (res.ok) {
        triggerConfetti();
        setShowSuccess(true);
        setFormData({ name: "", message: "" });
        setSelectedAmount(null);
        setDisplayCustomAmount("");
      } else {
        alert("Gagal memproses, silakan coba lagi.");
      }
    } catch (err) {
      alert("Gagal koneksi ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nomor rekening disalin!");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#3E2723] selection:bg-[#3E2723] selection:text-white overflow-x-hidden">
      
      <nav className="absolute top-0 w-full p-6 z-30 flex justify-between items-center pointer-events-none">
        <Link href="/" className="pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm hover:bg-white transition-all text-sm font-bold border border-white/50">
          <ArrowLeft size={18} /> Kembali
        </Link>
      </nav>

      <div className="grid lg:grid-cols-12 min-h-screen">
        
        {/* --- KIRI: VISUAL STORYTELLING --- */}
        <div className="lg:col-span-5 relative bg-[#2E1C16] text-[#F3EDE2] flex flex-col justify-end p-10 lg:p-16 overflow-hidden min-h-[40vh] lg:min-h-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 0.6, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
              className="absolute inset-0 z-0"
            >
               <Image src={stories[currentSlide].img} alt="Story" fill className="object-cover grayscale mix-blend-overlay" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2E1C16] via-[#2E1C16]/50 to-transparent z-0" />
          
          <div className="relative z-10 space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold tracking-widest uppercase">
                <Heart size={12} className="fill-red-500 text-red-500 animate-pulse" /> #3AMBerbagi
            </div>
            <h1 className="text-3xl lg:text-5xl font-serif font-bold leading-tight">{stories[currentSlide].title}</h1>
            <p className="text-sm lg:text-lg opacity-80 font-light">{stories[currentSlide].text}</p>
            
            <div className="flex gap-2 pt-2">
              {stories.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? "w-8 bg-orange-400" : "w-2 bg-white/30"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* --- KANAN: FORM DONASI --- */}
        <div className="lg:col-span-7 bg-white flex flex-col justify-center p-6 lg:p-20 relative shadow-2xl lg:rounded-l-[3rem] lg:-ml-10 z-20">
          <div className="max-w-xl mx-auto w-full space-y-8">
            
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-[#3E2723] mb-1">Pilih Nominal Donasi</h2>
                <p className="text-gray-500 text-sm">Berapapun nominalnya, sangat berarti bagi mereka.</p>
            </div>

            <form onSubmit={handleDonate} className="space-y-8">
              
              {/* --- GRID NOMINAL --- */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {donationOptions.map((amount) => (
                  <motion.div 
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectAmount(amount)}
                    className={`cursor-pointer rounded-2xl py-6 px-2 text-center border-2 transition-all duration-200 relative overflow-hidden group ${
                        selectedAmount === amount 
                        ? "border-[#3E2723] bg-[#3E2723] text-white shadow-xl shadow-[#3E2723]/30" 
                        : "border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/50"
                    }`}
                  >
                    <span className={`text-xs font-bold uppercase tracking-widest block mb-1 ${selectedAmount === amount ? "text-white/60" : "text-gray-400"}`}>Rp</span>
                    <span className="text-xl md:text-2xl font-black tracking-tight">{(amount / 1000)}k</span>
                    
                    {/* Centang Muncul */}
                    {selectedAmount === amount && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 bg-white text-[#3E2723] rounded-full p-0.5">
                            <CheckCircle size={14} className="fill-[#3E2723] text-white"/>
                        </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* --- INPUT NOMINAL (TERISI OTOMATIS) --- */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <span className="text-[#3E2723] font-bold text-lg">Rp</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Nominal Lainnya..."
                  value={displayCustomAmount}
                  onChange={handleCustomAmountChange}
                  className={`w-full bg-gray-50 pl-14 pr-4 py-5 rounded-2xl border-2 outline-none font-bold text-2xl text-[#3E2723] placeholder:text-gray-300 placeholder:font-bold transition-all focus:bg-white focus:border-[#3E2723] ${displayCustomAmount ? 'border-[#3E2723] bg-white' : 'border-transparent'}`}
                />
              </div>

              {/* Form Data Diri */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl space-y-4 shadow-sm">
                 <div className="grid grid-cols-1 gap-4">
                    <input 
                        type="text" placeholder="Nama (Hamba Allah)" 
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className="w-full bg-gray-50 border border-transparent focus:border-[#3E2723] rounded-xl px-4 py-3 outline-none transition-all font-medium text-[#3E2723] text-sm"
                    />
                    <textarea 
                        placeholder="Tulis doa atau pesan semangat..." rows={2}
                        value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} 
                        className="w-full bg-gray-50 border border-transparent focus:border-[#3E2723] rounded-xl px-4 py-3 outline-none transition-all font-medium text-[#3E2723] text-sm resize-none"
                    />
                 </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Metode Pembayaran</p>
                  
                  <div className="flex gap-3">
                     <button type="button" onClick={() => setPaymentMethod("qris")} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all ${paymentMethod === 'qris' ? 'border-[#3E2723] bg-[#3E2723]/5 text-[#3E2723]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                        <QrCode size={18} /> QRIS
                     </button>
                     <button type="button" onClick={() => setPaymentMethod("transfer")} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all ${paymentMethod === 'transfer' ? 'border-[#3E2723] bg-[#3E2723]/5 text-[#3E2723]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                        <CreditCard size={18} /> Transfer
                     </button>
                  </div>

                  {/* Konten Pembayaran */}
                  <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                     {paymentMethod === "qris" ? (
                        <div className="flex flex-col items-center gap-3">
                           <div className="bg-white p-2 rounded-xl border shadow-sm">
                              {/* Pastikan file /qris.jpg ada di public */}
                              <Image src={PAYMENT_DATA.qris} alt="QRIS" width={180} height={180} className="object-contain" />
                           </div>
                           <p className="text-xs text-gray-500">Scan untuk donasi instan</p>
                        </div>
                     ) : (
                        <div className="flex flex-col items-center gap-2">
                           <h3 className="text-2xl font-black text-[#0060AF] tracking-tighter italic">BCA</h3>
                           <p className="text-xl font-mono font-bold text-[#3E2723]">{PAYMENT_DATA.bank.number}</p>
                           <p className="text-xs font-bold text-gray-500">{PAYMENT_DATA.bank.holder}</p>
                           <button type="button" onClick={() => copyToClipboard(PAYMENT_DATA.bank.number)} className="mt-2 text-xs font-bold text-[#3E2723] underline flex items-center gap-1"><Copy size={12} /> Salin</button>
                        </div>
                     )}
                  </div>
              </div>

              {/* Submit Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={isSubmitting}
                className="w-full bg-[#3E2723] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#2E1C16] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <Sparkles className="animate-spin" /> : <><Heart className="fill-white" /> Konfirmasi Donasi</>}
              </motion.button>

            </form>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} /></div>
              <h2 className="text-2xl font-bold text-[#3E2723] mb-2">Terima Kasih!</h2>
              <p className="text-gray-500 text-sm mb-6">Donasi Anda telah diterima. Semoga menjadi berkah.</p>
              <button onClick={() => setShowSuccess(false)} className="w-full py-3 bg-[#3E2723] text-white rounded-xl font-bold">Kembali</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}