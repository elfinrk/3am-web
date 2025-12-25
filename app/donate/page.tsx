"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Heart, CheckCircle2, Sparkles, CreditCard, 
  QrCode, Copy, Coffee, User, TrendingUp, Stars, Smile, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import confetti from "canvas-confetti"; 

// --- DATA ---
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2054&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1602621743603-99b82e21262e?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop"  
];

const RECENT_DONORS = [
  { name: "Hamba Allah", amount: 50000, time: "Baru saja" },
  { name: "Putri A.", amount: 100000, time: "1m lalu" },
  { name: "Rizky Billar", amount: 500000, time: "2m lalu" },
  { name: "Siti Nurhaliza", amount: 25000, time: "5m lalu" },
  { name: "Joko W.", amount: 1000000, time: "10m lalu" },
];

const PAYMENT_DATA = {
  bank: { name: "BCA", number: "7275472760", holder: "3.AM COFFEE OFFICIAL" },
  qris: "/qris.jpg"
};

const donationOptions = [20000, 50000, 100000, 200000, 500000];
const formatNumber = (num: string) => num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const containerVar = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
  }
};

const itemVar = {
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  visible: { 
    y: 0, opacity: 1, scale: 1,
    transition: { type: "spring", bounce: 0.4, duration: 0.8 }
  }
};

export default function DonatePageMaximalist() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [displayCustomAmount, setDisplayCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "transfer">("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generatedParticles = [...Array(20)].map(() => ({
      width: Math.random() * 10 + 5,
      height: Math.random() * 10 + 5,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      xMove: Math.random() * 100 - 50
    }));
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const rawVal = Number(val.replace(/\D/g, "")); 
    setDisplayCustomAmount(formatNumber(val));
    if (donationOptions.includes(rawVal)) setSelectedAmount(rawVal);
    else setSelectedAmount(null);
  };

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setDisplayCustomAmount(formatNumber(amount.toString()));
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#AB886D', '#FFF', '#FFA500'] });
      confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#AB886D', '#FFF', '#FFA500'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  // --- LOGIKA CONNECT DATABASE (FIXED) ---
  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ambil nominal murni untuk kalkulasi DB
    const rawAmount = Number(displayCustomAmount.replace(/\./g, ""));
    
    if (!rawAmount || rawAmount < 10000) return alert("Minimal Donasi Rp 10.000");
    
    setIsSubmitting(true);

    try {
        // 1. Kirim data ke API donasi agar muncul di Dashboard Admin
        const response = await fetch("/api/donate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: rawAmount,
                name: formData.name || "Hamba Allah",
                message: formData.message,
            }),
        });

        if (response.ok) {
            // 2. Jika sukses di database, jalankan selebrasi
            triggerConfetti();
            setShowSuccess(true);
            
            // Reset form
            setDisplayCustomAmount("");
            setFormData({ name: "", message: "" });
            setSelectedAmount(null);
        } else {
            const errData = await response.json();
            alert(`Gagal: ${errData.message || "Terjadi kesalahan sistem"}`);
        }
    } catch (error) {
        console.error("Database connection error:", error);
        alert("Gagal terhubung ke server database.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Tersalin!");
  };

  const handleFinalReturn = () => {
    setShowSuccess(false);
    router.push("/"); 
  };

  return (
    <div className="min-h-screen bg-[#2E1C16] font-sans text-[#4A332A] overflow-hidden relative flex items-center justify-center py-20 lg:py-0 selection:bg-orange-500 selection:text-white">
      
      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
            <motion.div
                key={currentBg}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0"
            >
                <Image 
                    src={BACKGROUND_IMAGES[currentBg]} 
                    alt="Happy Children" 
                    fill 
                    className="object-cover" 
                    priority 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E1C16] via-[#2E1C16]/80 to-[#2E1C16]/40" />
                <div className="absolute inset-0 bg-[#4A332A]/30 mix-blend-multiply" />
            </motion.div>
        </AnimatePresence>
      </div>

      {/* PARTICLES */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((particle, i) => (
            <motion.div
                key={i}
                className="absolute bg-orange-400/30 rounded-full blur-sm"
                style={{
                    width: particle.width,
                    height: particle.height,
                    left: `${particle.left}%`,
                }}
                animate={{
                    y: [1000, -100],
                    x: [0, particle.xMove],
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: particle.delay
                }}
            />
        ))}
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
        <Link href="/" className="pointer-events-auto flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 hover:scale-105 active:scale-95 duration-300">
          <ArrowLeft size={18} /> <span className="font-bold text-sm">Kembali</span>
        </Link>
      </nav>

      {/* TICKER */}
      <div className="fixed top-24 lg:top-10 left-0 w-full z-10 opacity-80 pointer-events-none">
         <motion.div 
            className="flex gap-10 w-max"
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
         >
            {[...RECENT_DONORS, ...RECENT_DONORS, ...RECENT_DONORS].map((donor, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                    <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                        {donor.name} <span className="text-orange-300">+{formatNumber(donor.amount.toString())}</span>
                    </span>
                </div>
            ))}
         </motion.div>
      </div>

      {/* MAIN CARD */}
      <motion.div variants={containerVar} initial="hidden" animate="visible" className="relative z-30 w-full max-w-[520px] mx-4">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.5)] p-8 lg:p-10 relative overflow-hidden group">
           <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none" />
           <div className="relative z-10 space-y-8">
                <motion.div variants={itemVar} className="text-center space-y-3">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="inline-flex items-center gap-2 text-orange-200 font-bold uppercase tracking-widest text-[10px] bg-black/30 px-4 py-1.5 rounded-full border border-white/10">
                        <Smile size={14} className="text-yellow-400" /> Senyum Mereka, Bahagia Kita
                    </motion.div>
                    <h1 className="text-4xl font-serif font-bold text-white leading-tight drop-shadow-lg">Berbagi Harapan <br/> <span className="text-orange-300 italic">Untuk Masa Depan</span></h1>
                </motion.div>
                <form onSubmit={handleDonate} className="space-y-6">
                    {/* NOMINAL SELECTION */}
                    <motion.div variants={itemVar} className="space-y-3">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-2 flex items-center gap-2"><Sparkles size={12} /> Pilih Nominal Kebaikan</label>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <LayoutGroup>
                                {donationOptions.map((amount) => {
                                    const isSelected = selectedAmount === amount;
                                    return (
                                        <motion.button key={amount} type="button" onClick={() => handleSelectAmount(amount)} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className={`relative py-3 px-5 rounded-2xl text-sm font-bold font-mono transition-all overflow-hidden ${isSelected ? 'text-[#4A332A] shadow-[0_0_20px_rgba(255,165,0,0.5)]' : 'text-white bg-black/20 hover:bg-black/40 border border-white/10'}`}>
                                            {isSelected && <motion.div layoutId="active-pill" className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-400 z-0" transition={{ type: "spring", stiffness: 300, damping: 25 }} />}
                                            <span className="relative z-10">{(amount / 1000)}k</span>
                                        </motion.button>
                                    );
                                })}
                            </LayoutGroup>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} className="relative group mt-4">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none"><span className={`text-2xl font-bold transition-colors ${displayCustomAmount ? 'text-orange-400' : 'text-white/30'}`}>Rp</span></div>
                            <input type="text" value={displayCustomAmount} onChange={handleCustomAmountChange} className="block w-full pl-16 pr-6 py-6 bg-black/30 border-2 border-white/10 rounded-3xl text-3xl font-bold text-white placeholder:text-white/20 focus:border-orange-400/50 focus:bg-black/50 outline-none transition-all shadow-inner backdrop-blur-sm" placeholder="0" />
                            {displayCustomAmount && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-6 top-1/2 -translate-y-1/2 text-green-400"><CheckCircle2 size={24} fill="rgba(0,255,0,0.2)" /></motion.div>}
                        </motion.div>
                    </motion.div>

                    {/* USER DETAILS */}
                    <motion.div variants={itemVar} className="bg-black/20 rounded-3xl p-1 border border-white/5"><div className="grid gap-1"><input type="text" placeholder="Nama Orang Baik (Opsional)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-transparent px-5 py-3 text-white placeholder:text-white/30 outline-none text-sm font-medium focus:bg-white/5 rounded-t-2xl transition-colors" /><div className="h-[1px] bg-white/10 mx-4"/><input type="text" placeholder="Pesan / Doa (Opsional)" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="bg-transparent px-5 py-3 text-white placeholder:text-white/30 outline-none text-sm font-medium focus:bg-white/5 rounded-b-2xl transition-colors" /></div></motion.div>
                    
                    {/* PAYMENT METHOD */}
                    <motion.div variants={itemVar}><div className="bg-black/40 p-1.5 rounded-2xl flex relative mb-4 border border-white/10">{['qris', 'transfer'].map((method) => { const isActive = paymentMethod === method; return ( <button key={method} type="button" onClick={() => setPaymentMethod(method as any)} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative z-10 ${isActive ? 'text-[#4A332A]' : 'text-white/50 hover:text-white'}`}> {isActive && ( <motion.div layoutId="payment-tab" className="absolute inset-0 bg-[#FDFBF7] rounded-xl shadow-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} /> )} <span className="relative z-20 flex items-center gap-2"> {method === 'qris' ? <QrCode size={16}/> : <CreditCard size={16}/>} {method} </span> </button> ) })}</div><div className="bg-[#FDFBF7] text-[#4A332A] rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-10"><Coffee size={80} /></div><AnimatePresence mode="wait"><motion.div key={paymentMethod} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }} className="relative z-10">{paymentMethod === "qris" ? ( <div className="flex flex-col items-center gap-3"> <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-inner"> <Image src={PAYMENT_DATA.qris} alt="QRIS" width={150} height={150} className="rounded-lg" /> </div> <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scan Instant via E-Wallet</p> </div> ) : ( <div className="py-4"> <h3 className="text-2xl font-black text-[#0060AF] italic tracking-tighter mb-2">BCA</h3> <div onClick={() => copyToClipboard(PAYMENT_DATA.bank.number)} className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer px-6 py-3 rounded-xl inline-flex items-center gap-3 border border-gray-200" > <span className="text-xl font-mono font-bold">{PAYMENT_DATA.bank.number}</span> <Copy size={16} className="text-gray-400" /> </div> <p className="mt-3 text-xs font-bold text-gray-400">{PAYMENT_DATA.bank.holder}</p> </div> )}</motion.div></AnimatePresence></div></motion.div>
                    
                    {/* SUBMIT */}
                    <motion.button variants={itemVar} type="submit" disabled={isSubmitting || !displayCustomAmount} className="w-full relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-600 text-white py-5 rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(255,165,0,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group" >
                        {isSubmitting ? <Sparkles className="animate-spin" size={24} /> : <> <Heart className="fill-white group-hover:animate-pulse" size={20} /> <span>Salurkan Kebaikan</span> </>}
                    </motion.button>
                </form>
           </div>
        </div>
      </motion.div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" >
            <motion.div initial={{ scale: 0.5, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="bg-[#FDFBF7] w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden" >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.5, delay: 0.2 }} className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/40" >
                  <CheckCircle2 size={48} strokeWidth={4} />
              </motion.div>
              <h2 className="text-3xl font-serif font-bold text-[#4A332A] mb-2">Terima Kasih!</h2>
              <p className="text-gray-500 mb-8 font-medium">Satu kebaikan kecil dari Anda, sejuta harapan bagi mereka.</p>
              <button onClick={handleFinalReturn} className="w-full py-4 bg-[#4A332A] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#36231c] transition-all relative z-50 pointer-events-auto">Kembali</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}