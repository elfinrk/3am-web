"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Heart, 
  Gift, 
  BookOpen, 
  Smile, 
  Coffee,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti"; // Pastikan install: npm install canvas-confetti @types/canvas-confetti

// --- DATA PILIHAN DONASI ---
const donationTiers = [
  {
    amount: 25000,
    label: "Traktir Jajan",
    desc: "Setara dengan paket makan siang sehat untuk satu anak.",
    icon: <Coffee size={32} className="text-[#3E2723]" />,
    emoji: "🍱"
  },
  {
    amount: 50000,
    label: "Paket Belajar",
    desc: "Membantu membeli buku tulis dan alat tulis baru.",
    icon: <BookOpen size={32} className="text-[#3E2723]" />,
    emoji: "📚"
  },
  {
    amount: 100000,
    label: "Seragam Baru",
    desc: "Patungan untuk membelikan seragam sekolah yang layak.",
    icon: <Gift size={32} className="text-[#3E2723]" />,
    emoji: "👕"
  },
  {
    amount: 250000,
    label: "Full Senyum",
    desc: "Support biaya operasional panti asuhan selama sehari.",
    icon: <Smile size={32} className="text-[#3E2723]" />,
    emoji: "💖"
  }
];

export default function DonatePage() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isDonated, setIsDonated] = useState(false);

  // Fungsi saat tombol donasi ditekan
  const handleDonate = () => {
    // Panggil efek confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    setIsDonated(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F5E8] font-body text-[#3E2723] overflow-x-hidden selection:bg-[#FFD700] selection:text-[#3E2723]">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
        .font-doodle { font-family: 'Patrick Hand', cursive; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-[#F9F5E8]/90 backdrop-blur-md border-b border-[#E5DCC5] px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-full bg-white border border-[#E5DCC5] group-hover:bg-[#3E2723] group-hover:text-white transition-all">
             <ArrowLeft size={20} />
          </div>
          <span className="font-bold text-[#3E2723] hidden sm:block">Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <Image src="/Logo.png" alt="Logo" width={40} height={40} />
          <span className="font-display font-bold text-xl tracking-tight">Share <span className="text-red-500 italic">Kindness</span></span>
        </div>
        <div className="w-10"></div> 
      </nav>

      <main className="container mx-auto px-6 py-12">
        
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT SIDE: EMOTIONAL HOOK & IMAGE */}
          <div className="w-full lg:w-1/2 sticky top-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <span className="inline-block bg-[#FFE4B5] px-4 py-1 rounded-full border border-[#3E2723] font-bold text-sm mb-4 transform -rotate-2">
                🤝 #3AMBerbagi
              </span>
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Satu Cangkir Kopi, <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3E2723] to-[#8D6E63]">Sejuta Senyuman.</span>
              </h1>
              
              {/* IMAGE FRAME WITH DOODLES */}
              <div className="relative mt-8 group">
                <motion.div 
                  animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full blur-xl opacity-50"
                ></motion.div>
                
                <div className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-[#3E2723] shadow-[10px_10px_0px_#3E2723] transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform">
                  {/* Gunakan gambar anak-anak dari file Anda (image_b0339f.png) */}
                  <Image src="/kids.jpeg" alt="Anak-anak tersenyum" fill className="object-cover" />
                  
                  {/* Overlay Text */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                    <p className="text-white font-doodle text-xl">"Terima kasih Kakak baik!" - Adik Asuh 3.AM</p>
                  </div>
                </div>

                {/* Floating Heart Icon */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-red-500 text-white p-4 rounded-full border-2 border-[#F9F5E8] shadow-lg"
                >
                  <Heart fill="currentColor" size={24} />
                </motion.div>
              </div>

              <p className="mt-8 text-lg text-[#6A4A38] leading-relaxed">
                Satu kebaikan, menjangkau lebih dari satu tempat. Melalui program donasi 3.AM, setiap bantuan yang terkumpul akan disalurkan ke beberapa panti asuhan di Bandung dan sekitarnya. 
                <span className="font-bold"> 100% donasi Anda</span> Distribusi dilakukan secara bertahap dan menyesuaikan kebutuhan masing-masing panti.
                Kami percaya, kebaikan tidak harus berhenti di satu tempat.
                Satu cangkir kopi bisa ikut menghangatkan banyak cerita.
              </p>
            </motion.div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE DONATION WIDGET */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 border-2 border-[#E5DCC5] shadow-xl relative overflow-hidden"
            >
              {!isDonated ? (
                <>
                  <div className="mb-8 text-center">
                    <h2 className="font-display text-3xl font-bold text-[#3E2723]">Pilih Paket Kebaikan</h2>
                    <p className="text-[#6A4A38] text-sm">Pilih nominal atau masukkan jumlah sendiri.</p>
                  </div>

                  {/* GRID PILIHAN DONASI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {donationTiers.map((tier, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedTier(tier.amount); setCustomAmount(""); }}
                        className={`relative p-4 rounded-2xl border-2 text-left transition-all ${selectedTier === tier.amount ? "border-[#3E2723] bg-[#F9F5E8]" : "border-[#E5DCC5] bg-white hover:border-[#3E2723]/50"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="p-2 bg-white rounded-full shadow-sm border border-[#E5DCC5]">{tier.icon}</div>
                          {selectedTier === tier.amount && <CheckCircle2 className="text-green-500" size={20}/>}
                        </div>
                        <h3 className="font-bold text-lg text-[#3E2723]">Rp {tier.amount.toLocaleString()}</h3>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">{tier.label}</p>
                        <p className="text-xs text-[#6A4A38] leading-tight">{tier.desc}</p>
                      </motion.button>
                    ))}
                  </div>

                  {/* CUSTOM AMOUNT INPUT */}
                  <div className="relative mb-8">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#3E2723] mb-2 block">Atau Masukkan Nominal Lain</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#3E2723]">Rp</span>
                      <input 
                        type="number" 
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setSelectedTier(null); }}
                        placeholder="0"
                        className="w-full bg-[#F9F5E8] border-2 border-[#E5DCC5] rounded-xl py-4 pl-12 pr-4 font-bold text-xl text-[#3E2723] focus:outline-none focus:border-[#3E2723] transition-colors placeholder:text-[#3E2723]/20"
                      />
                    </div>
                  </div>

                  {/* IMPACT PREVIEW (Dinamic Text) */}
                  <AnimatePresence mode="wait">
                    {(selectedTier || customAmount) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="bg-[#3E2723] text-[#F9F5E8] p-4 rounded-xl mb-8 flex items-center gap-4"
                      >
                        <div className="text-4xl">
                          {selectedTier ? donationTiers.find(t => t.amount === selectedTier)?.emoji : "🌟"}
                        </div>
                        <div>
                          <p className="text-xs opacity-70 uppercase tracking-wide">Dampak Donasi Kamu:</p>
                          <p className="font-bold font-doodle text-lg">
                            {selectedTier 
                              ? `Wow! Kamu baru saja menyumbang "${donationTiers.find(t => t.amount === selectedTier)?.label}"` 
                              : "Setiap Rupiah sangat berarti untuk masa depan mereka!"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* DONATE BUTTON */}
                  <button 
                    onClick={handleDonate}
                    disabled={!selectedTier && !customAmount}
                    className="w-full bg-[#3E2723] text-white py-4 rounded-2xl font-bold text-xl shadow-[4px_4px_0px_#8D6E63] hover:shadow-[2px_2px_0px_#8D6E63] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Heart fill="white" className="animate-pulse" /> Kirim Kebaikan Sekarang
                  </button>
                  
                  <p className="text-center text-xs text-[#6A4A38]/60 mt-4 flex items-center justify-center gap-1">
                    <LockIcon size={12}/> Pembayaran aman & terenkripsi
                  </p>
                </>
              ) : (
                // SUCCESS STATE (Tampilan setelah donasi)
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-10"
                >
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl shadow-inner"
                  >
                    🎉
                  </motion.div>
                  <h2 className="font-display text-4xl font-bold text-[#3E2723] mb-4">Terima Kasih, Orang Baik!</h2>
                  <p className="text-lg text-[#6A4A38] font-doodle mb-8">
                    "Kebaikanmu sudah kami terima. Semoga rezekimu diganti berlipat ganda seperti foam di Cappuccino kami!"
                  </p>
                  
                  <div className="bg-[#F9F5E8] p-6 rounded-2xl border border-dashed border-[#3E2723] mb-8 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#3E2723]/10 rounded-full blur-sm"></div>
                    <p className="text-xs uppercase tracking-widest text-[#3E2723]/60 mb-2">Bukti Kebaikan Digital</p>
                    <h3 className="font-bold text-3xl text-[#3E2723]">Rp {(selectedTier || Number(customAmount)).toLocaleString()}</h3>
                    <p className="text-sm text-[#3E2723] mt-1">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  <button 
                    onClick={() => setIsDonated(false)}
                    className="text-[#3E2723] font-bold hover:underline flex items-center justify-center gap-2 mx-auto"
                  >
                    <ArrowLeft size={16}/> Kembali Donasi Lagi
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>

        </div>

        {/* --- SOCIAL PROOF TICKER --- */}
        <div className="mt-20 border-t border-[#E5DCC5] pt-10 overflow-hidden relative">
           <p className="text-center font-bold text-[#3E2723] mb-6 uppercase tracking-widest text-sm">Donatur Terbaru Hari Ini</p>
           <div className="flex gap-8 whitespace-nowrap opacity-60">
             <motion.div 
               animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
               className="flex gap-8"
             >
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#E5DCC5]">
                    <div className="w-6 h-6 bg-[#3E2723] rounded-full text-white text-xs flex items-center justify-center">?</div>
                    <span className="font-doodle">Hamba Allah - Rp {Math.floor(Math.random() * 100) + 10}.000</span>
                  </div>
                ))}
             </motion.div>
           </div>
           {/* Fade edges */}
           <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#F9F5E8] to-transparent pointer-events-none"></div>
           <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#F9F5E8] to-transparent pointer-events-none"></div>
        </div>

      </main>

      <footer className="bg-[#2E1C16] py-10 text-center text-[#F9F5E8] relative z-10 mt-10">
        <p className="font-doodle text-xl mb-2">"Sharing is Caring."</p>
        <p className="text-xs opacity-50">© 2025 3.AM Coffee Charity Initiative.</p>
      </footer>

    </div>
  );
}

// Icon komponen kecil
const LockIcon = ({size}:{size:number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)