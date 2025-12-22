"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  RefreshCcw, 
  Share2, 
  Coffee,
  Moon,
  CloudLightning,
  Heart,
  Briefcase,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- DATABASE NASIB (THE ORACLE) ---
const fortunes = [
  {
    id: 1,
    text: "Hari ini revisi lancar, tapi hati-hati file lupa di-save.",
    icon: <Briefcase size={40} className="text-white opacity-80" />,
    type: "Career"
  },
  {
    id: 2,
    text: "Seseorang sedang memperhatikanmu diam-diam di kedai kopi.",
    icon: <Heart size={40} className="text-pink-300 opacity-80" />,
    type: "Love"
  },
  {
    id: 3,
    text: "Hindari minuman dingin hari ini, tenggorokanmu butuh kehangatan.",
    icon: <Coffee size={40} className="text-yellow-200 opacity-80" />,
    type: "Health"
  },
  {
    id: 4,
    text: "Ide brilian akan muncul tepat jam 3 pagi nanti. Siapkan catatan!",
    icon: <Sparkles size={40} className="text-yellow-400 opacity-80" />,
    type: "Luck"
  },
  {
    id: 5,
    text: "Dompetmu menangis. Kurangi jajan, perbanyak doa.",
    icon: <AlertTriangle size={40} className="text-red-400 opacity-80" />,
    type: "Warning"
  },
  {
    id: 6,
    text: "Wi-Fi akan lemot di saat genting. Cari backup koneksi.",
    icon: <CloudLightning size={40} className="text-gray-400 opacity-80" />,
    type: "Bad Luck"
  },
  {
    id: 7,
    text: "Tidurmu akan nyenyak malam ini. Beban hidup sedang cuti.",
    icon: <Moon size={40} className="text-blue-300 opacity-80" />,
    type: "Peace"
  },
];

export default function OraclePage() {
  const [isBrewing, setIsBrewing] = useState(false);
  const [result, setResult] = useState<typeof fortunes[0] | null>(null);
  
  // Efek Suara (Opsional: Siapkan file mp3 jika ingin digunakan)
  // const brewSound = new Audio('/sounds/brew.mp3');
  // const magicSound = new Audio('/sounds/magic.mp3');

  const handleBrewFate = () => {
    if (isBrewing) return;
    
    setIsBrewing(true);
    setResult(null);
    
    // Play sound logic here if available
    
    // Simulasi proses "Membaca"
    setTimeout(() => {
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      setResult(randomFortune);
      setIsBrewing(false);
    }, 3000); // 3 detik durasi animasi
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] font-body text-[#E5DCC5] overflow-x-hidden selection:bg-[#3E2723] selection:text-[#E5DCC5]">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Patrick+Hand&display=swap');
        .font-mystic { font-family: 'Cinzel', serif; }
        .font-hand { font-family: 'Patrick Hand', cursive; }
      `}</style>

      {/* --- NAVBAR (Versi Dark Mode) --- */}
      <nav className="sticky top-0 z-50 w-full bg-[#1a1a1a]/90 backdrop-blur-md border-b border-[#E5DCC5]/20 px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group text-[#E5DCC5] hover:text-white">
          <ArrowLeft size={20} />
          <span className="font-bold hidden sm:block">Back to Reality</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mystic font-bold text-2xl tracking-widest text-yellow-500">THE ORACLE</span>
        </div>
        <div className="w-10"></div> 
      </nav>

      <main className="container mx-auto px-6 py-10 flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 bg-[#2a2a2a] px-4 py-1 rounded-full border border-yellow-500/30 mb-4"
          >
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-xs tracking-widest uppercase text-yellow-500">Kopi Tidak Pernah Bohong</span>
            <Sparkles size={14} className="text-yellow-500" />
          </motion.div>
          <h1 className="font-mystic text-4xl md:text-6xl text-[#E5DCC5] mb-2">Seduh Nasibmu</h1>
          <p className="text-white/50 font-light">Biarkan ampas kopi menjawab pertanyaan yang tak terucap.</p>
        </div>

        {/* --- THE COFFEE CUP ORACLE --- */}
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-12">
          
          {/* Background Glow Mystical */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-yellow-900/20 rounded-full blur-[80px]"
          />

          {/* THE CUP (View from Top) */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 bg-[#E5DCC5] rounded-full shadow-2xl flex items-center justify-center border-8 border-[#d4cbb0]">
            {/* Liquid (Dark Coffee) */}
            <div className="relative w-[90%] h-[90%] bg-[#2E1C16] rounded-full overflow-hidden flex items-center justify-center shadow-inner">
              
              {/* Animation Swirl Effect (Ampas Kopi) */}
              <AnimatePresence>
                {isBrewing && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full opacity-60"
                    style={{
                      background: "radial-gradient(circle at 30% 30%, transparent 20%, #3E2723 80%), conic-gradient(from 0deg, transparent 0deg, #4E342E 180deg, transparent 360deg)"
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Bubbles/Foam Animation */}
              {isBrewing && (
                <div className="absolute inset-0">
                   <motion.div animate={{ scale: [0, 1], opacity: [1, 0], x: -20, y: -20 }} transition={{ duration: 1, repeat: Infinity }} className="absolute top-1/2 left-1/2 w-4 h-4 border border-[#E5DCC5]/30 rounded-full" />
                   <motion.div animate={{ scale: [0, 1], opacity: [1, 0], x: 20, y: 20 }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute top-1/2 left-1/2 w-6 h-6 border border-[#E5DCC5]/30 rounded-full" />
                </div>
              )}

              {/* RESULT REVEAL */}
              <AnimatePresence mode="wait">
                {!isBrewing && !result && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="text-center p-4">
                    <p className="font-mystic text-sm text-[#E5DCC5]/50 tracking-widest">TAP BUTTON TO BREW</p>
                  </motion.div>
                )}

                {!isBrewing && result && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }} 
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
                    transition={{ duration: 1 }}
                    className="relative z-10 flex flex-col items-center justify-center text-center p-6"
                  >
                    {/* Icon appears as "latte art" or shape in coffee */}
                    <div className="mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      {result.icon}
                    </div>
                    <p className="font-mystic text-xs text-yellow-500 uppercase tracking-widest mb-1">{result.type}</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
            
            {/* Cup Handle */}
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-24 border-8 border-[#E5DCC5] rounded-r-3xl z-[-1]"></div>
          </div>
        </div>

        {/* --- RESULT CARD & CONTROLS --- */}
        <div className="w-full max-w-lg text-center space-y-8 min-h-[150px]">
          <AnimatePresence mode="wait">
            {isBrewing ? (
              <motion.p 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="font-mystic text-xl text-yellow-500 animate-pulse"
              >
                Sedang mengaduk takdir... ☕
              </motion.p>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="bg-[#2a2a2a] p-6 rounded-2xl border border-yellow-500/20 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                <p className="font-hand text-2xl md:text-3xl text-[#E5DCC5] leading-relaxed">
                  "{result.text}"
                </p>
                
                {/* Share Hint */}
                <div className="mt-6 flex justify-center gap-4">
                   <button 
                     onClick={handleBrewFate}
                     className="text-xs font-bold text-white/50 hover:text-white flex items-center gap-2 transition-colors"
                   >
                     <RefreshCcw size={14}/> Coba Lagi
                   </button>
                   <button className="text-xs font-bold text-yellow-500/80 hover:text-yellow-500 flex items-center gap-2 transition-colors">
                     <Share2 size={14}/> Screenshot This!
                   </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="cta">
                <button
                  onClick={handleBrewFate}
                  className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#3E2723] to-[#5D4037] rounded-full opacity-100 group-hover:scale-105 transition-transform duration-300"></span>
                  <span className="absolute inset-0 w-full h-full border-2 border-yellow-500/30 rounded-full"></span>
                  <span className="relative flex items-center gap-3 font-mystic font-bold text-xl text-[#E5DCC5] group-hover:text-white transition-colors">
                    <Sparkles /> LIHAT NASIB SAYA
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Footer Minimalis */}
      <footer className="py-6 text-center text-white/20 text-xs font-mystic">
        <p>THE 3.AM ORACLE · FOR ENTERTAINMENT PURPOSES ONLY</p>
      </footer>

    </div>
  );
}