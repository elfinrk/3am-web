"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Coffee, Sparkles, Heart, 
  Moon, Wind, Zap, Droplets, Smile, RotateCcw, 
  Star, Flower, Cloud, ShoppingCart, Clock, Ghost, Brain, ShoppingBag,
  ChevronRight, Play, Stars, MessageCircle, Pin
} from "lucide-react";
import confetti from "canvas-confetti";

// --- DATABASE MINUMAN ---
const DRINK_DATABASE = {
  "MIDNIGHT_BLACK": { name: "Midnight Black Swirl", price: "28k", desc: "Energi ekstra buat lawan deadline. Pahitnya pas, semangatnya pol!", sticker: "⚡", bg: "#f3f4f6" },
  "CARAMEL_NIGHT": { name: "Caramel Nightfall", price: "32k", desc: "Manis karamelnya kaya pelukan hangat di jam rawan. Mood booster!", sticker: "🍯", bg: "#fff7ed" },
  "MOONLIT_MATCHA": { name: "Moonlit Matcha Waves", price: "45k", desc: "Ketenangan matcha buat kamu yang lagi overthinking. Hati adem seketika.", sticker: "🍃", bg: "#f0fdf4" },
  "AMERICANO": { name: "Americano", price: "28k", desc: "Simpel dan jujur. Gak pake drama, langsung bikin melek seharian!", sticker: "☕", bg: "#f9fafb" },
  "LATTE": { name: "Caffe Latte", price: "35k", desc: "Susu lembut buat nemenin deep talk kamu sampai pagi. Nyaman banget.", sticker: "🥛", bg: "#fffaf5" },
  "CAPPUCCINO": { name: "Cappuccino", price: "32k", desc: "Foam tebal klasik. Pas buat kamu yang pengen vibe kopi beneran kopi.", sticker: "☁️", bg: "#fafaf9" },
  "FRAPPE": { name: "Frappe Coffee", price: "40k", desc: "Dingin, manis, dan seru! Pilihan asik buat kamu yang lagi chill.", sticker: "🧊", bg: "#f5f3ff" },
  "MACCHIATO": { name: "Caramel Macchiato", price: "42k", desc: "Self-reward karena kamu sudah sehebat itu hari ini. You deserve it!", sticker: "✨", bg: "#fefce8" },
  "COFFEE_MILK": { name: "Coffee Milk", price: "33k", desc: "Rasa klasik yang selalu bikin kangen, kaya rumah sendiri.", sticker: "🏡", bg: "#fffbeb" },
  "CNC": { name: "Cookies & Cream", price: "35k", desc: "Crunchy dan manis! Kebahagiaan buat si anti-kafein.", sticker: "🍪", bg: "#f8fafc" },
  "STRAWBERRY": { name: "Strawberry Mix", price: "35k", desc: "Seger banget parah! Mood kamu pasti langsung cerah ceria seketika.", sticker: "🍓", bg: "#fff1f2" },
  "CHOCO_FRAPPE": { name: "Chocolate Frappe", price: "38k", desc: "Cokelat pekat buat nyembuhin hari yang berat. Happy drinking!", sticker: "🍫", bg: "#fdf8f6" }
};

// --- DATA NOTES DARI TIM ---
const TEAM_NOTES = {
  "MIDNIGHT_BLACK": { author: "elfin", note: "Tugas dan tanggung jawab memang tidak ada habisnya, tapi kesehatan Anda tetap yang utama. Minum kopi ini untuk menjaga fokus, namun jangan lupa beristirahat saat sudah waktunya." },
  "CARAMEL_NIGHT": { author: "sasa", note: "Hey! Capek ya? Nih, aku kasih yang manis-manis biar senyum kamu balik lagi. Kamu udah berjuang hebat hari ini, bangga banget deh! ✨" },
  "MOONLIT_MATCHA": { author: "naura", note: "Dunia mungkin lagi bising banget ya? Gak apa-apa, tenangin dulu hatinya di sini. Matcha ini buat nemenin kamu 'pulang' ke diri sendiri sebentar. Peluk jauh. 🍃" },
  "STRAWBERRY": { author: "sasa", note: "Jangan biarin hari yang mendung bikin kamu ikutan redup! Minum yang seger dulu biar semangatnya meledak lagi. Ayo, tunjukin energi kamu! 🍓" },
  "AMERICANO": { author: "elfin", note: "Realita terkadang terasa pahit, namun itulah yang mendewasakan kita. Tetaplah tegar dan konsisten dalam setiap langkah yang Anda ambil hari ini." },
  "LATTE": { author: "naura", note: "Lembutnya susu ini kaya doa-doa baik buat kamu. Semoga semua urusan kamu hari ini dipermudah dan hati kamu selalu merasa cukup ya.. 🥛" },
  "DEFAULT": { author: "naura", note: "Terima kasih sudah mampir. Apapun yang lagi kamu jalanin, semoga kopi ini bisa jadi teman yang baik buat menemani langkah kamu." }
};

const QUESTIONS = [
  { title: "Kondisi nyawa lo sekarang gimana?", options: [{ text: "Tinggal 1%, butuh strum!", value: "MIDNIGHT_BLACK", icon: <Zap size={18} /> }, { text: "Nanggung, butuh mood booster", value: "CARAMEL_NIGHT", icon: <Sparkles size={18} /> }, { text: "Aman, cuma pengen chill aja", value: "MOONLIT_MATCHA", icon: <Wind size={18} /> }, { text: "Gak pengen kena kafein", value: "STRAWBERRY", icon: <Ghost size={18} /> }] },
  { title: "Lidah lo lagi nagih rasa apa?", options: [{ text: "Pahit se-pahit realita", value: "AMERICANO", icon: <Coffee size={18} /> }, { text: "Manis-manis manja", value: "MACCHIATO", icon: <Heart size={18} /> }, { text: "Rasa rumput (Matcha)", value: "MOONLIT_MATCHA", icon: <Brain size={18} /> }, { text: "Seger dingin buah", value: "STRAWBERRY", icon: <Droplets size={18} /> }] },
  { title: "Jujur, dompet lagi sehat gak?", options: [{ text: "Sultan mah bebas, gas!", value: "MOONLIT_MATCHA", icon: <Stars size={18} /> }, { text: "Standar, yang penting enak", value: "FRAPPE", icon: <ShoppingBag size={18} /> }, { text: "Lagi hemat, cari yang basic", value: "LATTE", icon: <Coffee size={18} /> }, { text: "Ada promo gak? Hahaha", value: "COFFEE_MILK", icon: <Smile size={18} /> }] },
  { title: "Lagi dihantuin apa lo jam segini?", options: [{ text: "Deadline melambai-lambai", value: "MIDNIGHT_BLACK", icon: <Clock size={18} /> }, { text: "Kenangan mantan gak kelar", value: "CHOCO_FRAPPE", icon: <Ghost size={18} /> }, { text: "Overthinking masa depan", value: "MOONLIT_MATCHA", icon: <Brain size={18} /> }, { text: "Gak ada, cuma gabut aja", value: "CNC", icon: <Smile size={18} /> }] },
  { title: "Pilih vibe lo saat ini:", options: [{ text: "Produktif ampe pagi", value: "AMERICANO", icon: <Zap size={18} /> }, { text: "Deep talk ampe nangis", value: "LATTE", icon: <Heart size={18} /> }, { text: "Hening denger lagu galau", value: "MOONLIT_MATCHA", icon: <Moon size={18} /> }, { text: "Seru-seruan bareng circle", value: "CAPPUCCINO", icon: <Smile size={18} /> }] }
];

export default function MoodBarista() {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [teamNote, setTeamNote] = useState<any>(null);

  const handleSelect = (val: string) => {
    const newScores = { ...scores, [val]: (scores[val] || 0) + 1 };
    setScores(newScores);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const winner = Object.keys(newScores).reduce((a, b) => (newScores[a] > newScores[b] ? a : b));
      setResult(DRINK_DATABASE[winner as keyof typeof DRINK_DATABASE]);
      const note = TEAM_NOTES[winner as keyof typeof TEAM_NOTES] || TEAM_NOTES["DEFAULT"];
      setTeamNote(note);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#FF8A65", "#4E342E"] });
    }
  };

  const reset = () => {
    setHasStarted(false);
    setStep(0);
    setScores({});
    setResult(null);
    setTeamNote(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-[#4E342E] flex flex-col items-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -top-20 -left-20 opacity-10">
          <Star size={300} fill="#FFD54F" />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/2 -right-10 opacity-10">
          <Flower size={200} fill="#AED581" />
        </motion.div>
      </div>

      {/* Nav */}
      <nav className="w-full max-w-xl flex justify-between items-center z-50 mb-10">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.back()} className="bg-white p-4 rounded-3xl border-2 border-[#4E342E] shadow-[4px_4px_0px_#4E342E]">
          <ArrowLeft size={20} />
        </motion.button>
        <div className="bg-[#4E342E] px-6 py-2 rounded-2xl shadow-xl">
          <span className="font-black text-[10px] text-[#FFD54F] uppercase tracking-[0.3em]">3.AM Mood Barista ✨</span>
        </div>
      </nav>

      <div className="w-full max-w-lg z-10 flex flex-col items-center flex-grow justify-center relative">
        <AnimatePresence mode="wait">
          
          {!hasStarted ? (
            <motion.div key="welcome" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-8" >
              <div className="relative inline-block">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="bg-white p-10 rounded-[4rem] border-4 border-[#4E342E] shadow-[12px_12px_0px_#4E342E]">
                  <Coffee size={80} className="text-[#FF8A65] mx-auto" strokeWidth={1.5} />
                </motion.div>
                <div className="absolute -top-4 -right-4 bg-[#FFD54F] p-3 rounded-full border-2 border-[#4E342E] animate-bounce">
                  <Stars size={24} />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Lagi bingung<br/>pilih kopi apa?</h1>
                <p className="text-lg font-medium opacity-60 italic leading-snug">
                  Biar Barista 3.AM yang scan mood kamu<br/>dan kasih racikan yang paling pas!
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHasStarted(true)}
                className="group relative inline-flex items-center gap-3 bg-[#FF8A65] text-white px-10 py-5 rounded-3xl border-4 border-[#4E342E] shadow-[8px_8px_0px_#4E342E] font-black text-lg tracking-widest uppercase hover:bg-[#FF7043] transition-all"
              >
                Cek Mood Gue! <Play size={20} fill="currentColor" />
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div key="quiz" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full">
                  <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] border-[3px] border-[#4E342E] shadow-[12px_12px_0px_#4E342E] relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex gap-1.5">
                        {QUESTIONS.map((_, i) => (
                          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'w-6 bg-[#FF8A65]' : 'w-2 bg-[#4E342E]/10'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold uppercase opacity-40">Step {step + 1}/5</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black mb-8 leading-tight tracking-tight">{QUESTIONS[step].title}</h1>
                    <div className="grid gap-4">
                      {QUESTIONS[step].options.map((opt, i) => (
                        <motion.button key={i} whileHover={{ x: 10, backgroundColor: "#FFFBF0" }} whileTap={{ scale: 0.98 }} onClick={() => handleSelect(opt.value)} className="group p-5 bg-white border-2 border-[#4E342E] rounded-2xl flex items-center justify-between transition-all text-left" >
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#F5F5F5] rounded-xl group-hover:bg-[#FFD54F] transition-colors">{opt.icon}</div>
                            <span className="font-bold text-lg">{opt.text}</span>
                          </div>
                          <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all text-[#FF8A65]" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full relative flex flex-col items-center">
                  
                  {/* --- STICKY NOTE DARI TIM (DITARUH DI ATAS / OVERLAY) --- */}
                  <motion.div 
                    initial={{ opacity: 0, y: -50, rotate: -5, scale: 0.8 }} 
                    animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }} 
                    transition={{ delay: 0.6, type: "spring" }}
                    className="absolute -top-16 left-4 md:-left-8 z-30 bg-[#FFD54F] p-5 rounded-2xl border-4 border-[#4E342E] shadow-[8px_8px_0px_#4E342E] max-w-[240px]"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#4E342E]">
                      <Pin size={24} fill="currentColor" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <p className="text-[13px] font-bold italic leading-tight text-[#4E342E]">
                        "{teamNote?.note}"
                      </p>
                      <p className="text-right font-black text-[12px] text-[#4E342E]/70 tracking-tighter">
                        - {teamNote?.author}
                      </p>
                    </div>
                  </motion.div>

                  {/* --- HASIL UTAMA --- */}
                  <motion.div initial={{ opacity: 0, rotate: 2, scale: 0.9 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} className="w-full relative">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-12 -right-4 z-20 bg-white p-5 rounded-full border-4 border-[#4E342E] text-5xl shadow-2xl rotate-12" >
                      {result.sticker}
                    </motion.div>
                    
                    <div className="bg-white rounded-[3.5rem] border-[4px] border-[#4E342E] shadow-[20px_20px_0px_rgba(78,52,46,1)] p-12 pt-16 text-center relative overflow-hidden" style={{ backgroundColor: result.bg }}>
                      <div className="space-y-2 mb-8 mt-4">
                        <p className="font-black text-[11px] uppercase text-[#FF8A65] tracking-[0.4em]">Recommendation for you</p>
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{result.name}</h2>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2.5rem] border-2 border-[#4E342E] relative mb-10">
                        <p className="text-xl font-bold leading-relaxed italic text-[#4E342E]">"{result.desc}"</p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/online")} className="w-full py-5 bg-[#4E342E] text-[#FFD54F] rounded-3xl font-black text-sm tracking-widest shadow-xl flex items-center justify-center gap-3">
                          <ShoppingCart size={20} /> PESAN SEKARANG — {result.price}
                        </motion.button>
                        <button onClick={reset} className="py-4 text-[#4E342E]/40 hover:text-[#4E342E] transition-all text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 font-mono">
                          <RotateCcw size={14} /> Re-Calculate Mood
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          )}

        </AnimatePresence>
      </div>

      <footer className="fixed bottom-6 w-full text-center opacity-20 z-0">
        <p className="text-[9px] font-black uppercase tracking-[1em]">3.AM Specialty Coffee</p>
      </footer>
    </div>
  );
}