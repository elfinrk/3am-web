"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowDown, Coffee, Zap, Heart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function OurStoryCinematicFun() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- PARALLAX ANIMATIONS ---
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]); 
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);
  const contentY = useTransform(scrollYProgress, [0.1, 1], ["0%", "-5%"]);

  return (
    <div ref={containerRef} className="relative bg-[#1A100C] font-body text-[#F3EDE2] selection:bg-[#F3EDE2] selection:text-[#1A100C]">
      
      {/* --- GOOGLE FONTS (Tetap menggunakan font elegan untuk kontras yang unik) --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&family=Reenie+Beanie&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .font-handwriting { font-family: 'Reenie Beanie', cursive; }
        
        .film-grain {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 50;
          opacity: 0.03; 
          background-image: url("https://www.transparenttextures.com/patterns/noise.png");
        }
        
        .text-glow {
           text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
      `}</style>

      {/* FILM GRAIN OVERLAY */}
      <div className="film-grain"></div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 z-50 w-full px-8 py-6 flex justify-between items-center text-[#F3EDE2] bg-gradient-to-b from-black/40 to-transparent">
        <Link href="/" className="group flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="border-2 border-[#F3EDE2] rounded-full p-2 group-hover:bg-[#F3EDE2] group-hover:text-black transition-colors">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </div>
          <span className="font-montserrat text-xs tracking-[0.2em] uppercase font-bold drop-shadow-sm">Back to Home</span>
        </Link>
        <Image src="/Logo.png" alt="Logo" width={40} height={40} className="opacity-100 invert drop-shadow-md" />
      </nav>

      {/* ================= SECTION 1: FIXED HERO (FOTO BERTIGA) ================= */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative w-full h-full">
          <Image 
            src="/Bertiga.jpg" 
            alt="The Founders" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#1A100C]"></div>
          
          {/* Hero Text: GANTI KATA-KATA */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
            <motion.span 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
              className="font-handwriting text-4xl md:text-5xl text-[#E5DCC5] mb-6 rotate-[-3deg] drop-shadow-md"
            >
              Halo, Warga 3.AM! 👋
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 1.2 }}
              className="font-cormorant font-medium text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-none text-glow text-white"
            >
              Kenalan <br/> <i className="font-serif">Yuk?</i>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 drop-shadow-md"
          >
            <span className="font-montserrat text-[11px] font-semibold tracking-widest uppercase opacity-90">Scroll Buat Kepoin Kita</span>
            <ArrowDown size={24} strokeWidth={2.5} className="animate-bounce opacity-90" />
          </motion.div>
        </motion.div>
      </div>

      {/* ================= SECTION 2: SCROLLABLE CONTENT ================= */}
      <div className="h-[85vh]"></div>

      <motion.div style={{ y: contentY }} className="relative z-10 bg-[#1A100C] rounded-t-[3rem] shadow-[0_-50px_100px_rgba(0,0,0,0.8)] border-t border-[#F3EDE2]/20 pb-32">
        
        {/* --- INTRO NARRATIVE: GANTI JADI SANTAI --- */}
        <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl text-center">
          <div className="w-[2px] h-24 bg-gradient-to-b from-transparent via-[#F3EDE2]/70 to-transparent mx-auto mb-12"></div>
          
          <p className="font-cormorant font-medium text-3xl md:text-4xl leading-relaxed text-[#F3EDE2] mb-12">
            "Jujur aja, ini bukan kisah inspiratif tentang biji kopi pilihan. <br/>
            Ini cuma kisah tiga orang yang <span className="italic text-[#D7CCC8] font-semibold">butuh tempat nongkrong</span> tapi nggak nemu yang pas."
          </p>
          
          <div className="font-montserrat text-base font-normal text-[#F3EDE2]/80 leading-loose space-y-6 text-justify md:text-center max-w-xl mx-auto">
            <p>
              Coba liat foto di atas. Muka-muka kurang tidur kan? 😂 Itu Elfin, Naura, sama Sahwa pas lagi pusing mikirin tugas kuliah jam 3 pagi.
            </p>
            <p>
              Singkat cerita, kami capek diusir dari cafe karena cuma pesen satu es teh tapi duduknya 5 jam. Jadi yaudah, kami bikin 3.AM! Tempat di mana kamu boleh overthinking, nugas, atau sekadar bengong tanpa takut dijudesin barista.
            </p>
          </div>
        </div>

        {/* --- THE FOUNDERS: DESKRIPSI LEBIH FUN --- */}
        <div className="py-24 border-y border-[#F3EDE2]/10 bg-[#231510]">
          <div className="container mx-auto px-6">
            <h2 className="font-montserrat text-sm tracking-[0.4em] uppercase font-bold text-center mb-20 text-[#F3EDE2]/70">Tersangka Utamanya</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
              {/* FOUNDER 1 */}
              <div className="group relative pl-8 border-l-2 border-[#F3EDE2]/20 hover:border-[#D7CCC8] transition-colors">
                <div>
                  <h3 className="font-cormorant font-semibold text-5xl mb-1 text-[#F3EDE2]">Elfin</h3>
                  <span className="font-handwriting text-3xl text-[#D7CCC8] block mb-6 drop-shadow-sm">- Si Paling Kopi -</span>
                  <p className="font-montserrat text-base font-normal text-[#F3EDE2]/80 leading-relaxed">
                    "Tugas utamaku memastikan kopimu enak. Kalau nggak enak, bilang aja. Tapi pelan-pelan ya, hatiku selembut foam cappuccino." ☕
                  </p>
                </div>
              </div>

              {/* FOUNDER 2 */}
              <div className="group relative pl-8 border-l-2 border-[#F3EDE2]/20 hover:border-[#D7CCC8] transition-colors">
                <div>
                  <h3 className="font-cormorant font-semibold text-5xl mb-1 text-[#F3EDE2]">Naura</h3>
                  <span className="font-handwriting text-3xl text-[#D7CCC8] block mb-6 drop-shadow-sm">- Si Paling Vibe -</span>
                  <p className="font-montserrat text-base font-normal text-[#F3EDE2]/80 leading-relaxed">
                    "Yang ngatur playlist galau tapi enak didenger? Itu aku. Yang masang lampu estetik buat story IG kamu? Aku juga." ✨
                  </p>
                </div>
              </div>

              {/* FOUNDER 3 */}
              <div className="group relative pl-8 border-l-2 border-[#F3EDE2]/20 hover:border-[#D7CCC8] transition-colors">
                <div>
                  <h3 className="font-cormorant font-semibold text-5xl mb-1 text-[#F3EDE2]">Sahwa</h3>
                  <span className="font-handwriting text-3xl text-[#D7CCC8] block mb-6 drop-shadow-sm">- Si Paling Ngemil -</span>
                  <p className="font-montserrat text-base font-normal text-[#F3EDE2]/80 leading-relaxed">
                    "Prinsip hidupku simpel: Perut kenyang = Masalah hilang. Makanya porsi Cheesemelt di sini nggak pelit." 🧀
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PHILOSOPHY: GANTI JADI POIN SANTUY --- */}
        <div className="container mx-auto px-6 py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-cormorant font-medium text-6xl leading-none mb-8 text-[#F3EDE2]">
                Markas <br/> <span className="italic text-[#D7CCC8] font-semibold">Anti Ribet.</span>
              </h2>
              <p className="font-montserrat font-normal text-[#F3EDE2]/90 text-lg leading-loose mb-10">
                Di sini aturannya gampang: Datang, pesen, cari tempat pewe, kelar. Mau curhat sama barista? Boleh. Mau numpang WiFi doang? Yaudah gapapa (asal pesen minum ya hehe).
              </p>
              <Link href="/menu">
                <button className="px-10 py-5 bg-[#F3EDE2] text-[#1A100C] rounded-full font-montserrat text-sm font-bold tracking-widest hover:bg-[#D7CCC8] transition-all duration-300 shadow-lg shadow-[#D7CCC8]/20">
                  GASKEUN PESEN! 🚀
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               {/* ICON LEBIH CASUAL */}
               <div className="aspect-square bg-[#231510] rounded-3xl flex flex-col items-center justify-center border-2 border-[#F3EDE2]/10 hover:border-[#F3EDE2]/40 transition-all p-4 text-center group">
                  <Heart size={36} strokeWidth={2} className="text-[#D7CCC8] mb-4 group-hover:scale-110 transition-transform"/>
                  <span className="font-cormorant font-semibold text-2xl text-[#F3EDE2]">Curhatable</span>
               </div>
               <div className="aspect-square bg-[#231510] rounded-3xl flex flex-col items-center justify-center border-2 border-[#F3EDE2]/10 hover:border-[#F3EDE2]/40 transition-all p-4 text-center mt-12 group">
                  <Coffee size={36} strokeWidth={2} className="text-[#D7CCC8] mb-4 group-hover:scale-110 transition-transform"/>
                  <span className="font-cormorant font-semibold text-2xl text-[#F3EDE2]">Kopi Enak</span>
               </div>
               <div className="aspect-square bg-[#231510] rounded-3xl flex flex-col items-center justify-center border-2 border-[#F3EDE2]/10 hover:border-[#F3EDE2]/40 transition-all p-4 text-center -mt-12 group">
                  <Zap size={36} strokeWidth={2} className="text-[#D7CCC8] mb-4 group-hover:scale-110 transition-transform"/>
                  <span className="font-cormorant font-semibold text-2xl text-[#F3EDE2]">WiFi Kenceng</span>
               </div>
               <div className="aspect-square bg-[#231510] rounded-3xl flex flex-col items-center justify-center border-2 border-[#F3EDE2]/10 hover:border-[#F3EDE2]/40 transition-all p-4 text-center group">
                  <ArrowDown size={36} strokeWidth={2} className="text-[#D7CCC8] mb-4 rotate-[-45deg] group-hover:translate-y-1 transition-transform"/>
                  <span className="font-cormorant font-semibold text-2xl text-[#F3EDE2]">Rumah Kedua</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER QUOTE --- */}
        <div className="text-center pt-24 pb-12 px-6 border-t border-[#F3EDE2]/10">
          <p className="font-handwriting text-4xl md:text-6xl text-[#E5DCC5] mb-10 rotate-1 drop-shadow-md">
            "Ditunggu kedatangannya ya, Bestie!"
          </p>
          <div className="font-montserrat text-xs font-bold uppercase tracking-[0.3em] opacity-60">
            3.AM Coffee © 2025. Bandung.
          </div>
        </div>

      </motion.div>
    </div>
  );
} 