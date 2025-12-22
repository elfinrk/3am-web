"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { 
  Calendar, Clock, Users, User, Phone, CheckCircle2, 
  Sparkles, Coffee, MapPin, ArrowRight, Plus, Minus, 
  ShoppingBag, Leaf, Bean, ArrowLeft, ExternalLink 
} from "lucide-react";
import { motion } from "framer-motion";

// --- 1. DATA MENU LENGKAP (18 ITEM SESUAI GAMBAR) ---
const MENU_ITEMS = [
  // Kopi & Minuman
  { id: 1, name: "Midnight Black Swirl", price: 28000 },
  { id: 2, name: "Caramel Nightfall", price: 32000 },
  { id: 3, name: "Moonlit Matcha", price: 30000 },
  { id: 4, name: "Americano", price: 28000 },
  { id: 5, name: "Caffe Latte", price: 35000 },
  { id: 6, name: "Cappuccino", price: 32000 },
  { id: 7, name: "Frappe Coffee", price: 40000 },
  { id: 8, name: "Caramel Macchiato", price: 42000 },
  { id: 9, name: "Coffee Milk", price: 33000 },
  { id: 10, name: "Cookies & Cream", price: 35000 },
  { id: 11, name: "Strawberry Mix", price: 35000 },
  { id: 12, name: "Chocolate Frappe", price: 38000 },
  // Makanan
  { id: 13, name: "3AM Cheesemelt", price: 25000 },
  { id: 14, name: "Butter Croissant", price: 18000 },
  { id: 15, name: "Tomato Tart", price: 22000 },
  { id: 16, name: "Macaron", price: 15000 },
  // Dessert
  { id: 17, name: "Strawberry Cheese Cake", price: 40000 },
  { id: 18, name: "Chocolate Lava Cake", price: 40000 },
];

const MINIMUM_SPEND = 100000;

export default function ReservationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // State Form & Cart
  const [formData, setFormData] = useState({ name: "", phone: "", date: "", time: "", guests: "2" });
  const [cart, setCart] = useState<{[key: number]: number}>({});

  useEffect(() => setMounted(true), []);

  // Hitung Total
  const currentTotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === parseInt(id));
    return total + (item ? item.price * qty : 0);
  }, 0);

  const remaining = Math.max(0, MINIMUM_SPEND - currentTotal);
  const progress = Math.min(100, (currentTotal / MINIMUM_SPEND) * 100);
  const isMinSpendMet = currentTotal >= MINIMUM_SPEND;

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateCart = (id: number, delta: number) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: newQty };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinSpendMet) return;
    setIsSubmitting(true);
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  // --- VISUAL ELEMENTS CONFIG ---
  const floatingElements = [
    { icon: <Coffee size={32} />, top: "15%", left: "10%", delay: 0 },
    { icon: <Bean size={28} />, top: "25%", right: "15%", delay: 2 },
    { icon: <Leaf size={36} />, bottom: "20%", left: "8%", delay: 1 },
    { icon: <Clock size={24} />, bottom: "30%", right: "25%", delay: 3 },
    { icon: <Sparkles size={20} />, top: "10%", right: "40%", delay: 1.5 },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen font-sans text-[#3E2723] relative overflow-hidden flex items-center justify-center py-12 px-4 bg-[#F3EDE2]">
      
      {/* ================= LAYER BACKGROUND ================= */}
      <div className="absolute inset-0 z-0">
         {/* Gambar Background samar */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-[0.12] grayscale hue-rotate-15"></div>
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-[#F3EDE2]/95 via-[#F3EDE2]/80 to-[#EFE5D5]"></div>
      </div>
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      {/* Orbs / Cahaya Blur */}
      <div className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-orange-300/30 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-600/20 rounded-full blur-[130px] -z-10 animate-pulse-slow delay-1000"></div>
      
      {/* Floating Icons Animation */}
      {floatingElements.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-[#3E2723]/20 z-0 pointer-events-none"
          style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl w-full relative z-10 space-y-8">
        
        {/* BUTTON KEMBALI KE HOME */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <Link 
            href="/" 
            className="group flex items-center gap-2 px-5 py-2.5 bg-white/50 backdrop-blur-md rounded-full border border-white/60 text-[#3E2723] font-bold shadow-sm hover:shadow-md hover:bg-white hover:-translate-x-1 transition-all"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* --- KOLOM KIRI: FORM RESERVASI (7 Col) --- */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3E2723]/10 rounded-full text-[#3E2723] text-xs font-bold tracking-widest uppercase mb-4 border border-[#3E2723]/20">
                <Sparkles size={14} /> Reservation
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#3E2723] mb-4 leading-tight">
                Reserve Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8D6E63] to-[#3E2723]">Moment.</span>
              </h1>
              <p className="text-[#6A4A38] text-lg max-w-md leading-relaxed">
                Amankan meja ternyaman untuk menikmati suasana dan kopi terbaik kami.
              </p>
            </motion.div>

            {/* Glassmorphism Form Container */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-[#3E2723]/10 border border-white/50 relative overflow-hidden">
              <Leaf className="absolute -top-10 -right-10 text-[#3E2723]/5 w-32 h-32 rotate-45 pointer-events-none"/>
              
              {isSuccess ? (
                 <motion.div initial={{scale:0.9}} animate={{scale:1}} className="text-center py-10 relative z-10">
                   <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-green-200/50">
                     <CheckCircle2 size={48} />
                   </div>
                   <h2 className="text-3xl font-bold mb-3">Reservasi Berhasil!</h2>
                   <p className="mb-8 text-[#6A4A38]">Pre-order senilai <strong>Rp {currentTotal.toLocaleString()}</strong> telah dikonfirmasi. Sampai jumpa!</p>
                   <button onClick={() => router.push("/")} className="px-8 py-3 bg-[#3E2723]/5 rounded-full text-[#3E2723] font-bold hover:bg-[#3E2723] hover:text-white transition-all">Kembali ke Home</button>
                 </motion.div>
              ) : (
                <form id="reservationForm" onSubmit={handleSubmit} className="space-y-6 relative z-10">
                   <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase ml-3 opacity-60 tracking-wider">Nama Lengkap</label>
                      <div className="relative group"><User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3E2723]/30 group-focus-within:text-[#3E2723] transition-colors" size={18} />
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-white/70 focus:bg-white p-4 pl-12 rounded-2xl outline-none border border-white focus:border-[#3E2723]/10 transition-all shadow-sm placeholder:text-[#3E2723]/30 font-medium" placeholder="Nama Anda" /></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase ml-3 opacity-60 tracking-wider">WhatsApp</label>
                      <div className="relative group"><Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3E2723]/30 group-focus-within:text-[#3E2723] transition-colors" size={18} />
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-white/70 focus:bg-white p-4 pl-12 rounded-2xl outline-none border border-white focus:border-[#3E2723]/10 transition-all shadow-sm placeholder:text-[#3E2723]/30 font-medium" placeholder="08..." /></div>
                    </div>
                   </div>
                   <div className="grid grid-cols-3 gap-5">
                     <div className="space-y-2 col-span-3 md:col-span-1">
                       <label className="text-xs font-bold uppercase ml-3 opacity-60 tracking-wider">Tanggal</label>
                       <div className="relative"><Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3E2723]/30 pointer-events-none" size={18} />
                       <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-white/70 focus:bg-white p-4 rounded-2xl outline-none border border-white focus:border-[#3E2723]/10 transition-all shadow-sm font-medium text-sm cursor-pointer" /></div>
                     </div>
                     <div className="space-y-2 col-span-3 md:col-span-1">
                        <label className="text-xs font-bold uppercase ml-3 opacity-60 tracking-wider">Jam</label>
                        <div className="relative"><Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3E2723]/30 pointer-events-none" size={18} />
                        <input type="time" name="time" required value={formData.time} onChange={handleChange} className="w-full bg-white/70 focus:bg-white p-4 rounded-2xl outline-none border border-white focus:border-[#3E2723]/10 transition-all shadow-sm font-medium text-sm cursor-pointer" /></div>
                     </div>
                     <div className="space-y-2 col-span-3 md:col-span-1">
                        <label className="text-xs font-bold uppercase ml-3 opacity-60 tracking-wider">Tamu</label>
                        <div className="relative"><Users className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3E2723]/30 pointer-events-none" size={18} />
                        <select name="guests" value={formData.guests} onChange={handleChange} className="w-full bg-white/70 focus:bg-white p-4 rounded-2xl outline-none border border-white focus:border-[#3E2723]/10 transition-all shadow-sm font-medium text-sm appearance-none cursor-pointer pl-5">
                          <option value="2">2 Orang</option> <option value="4">4 Orang</option> <option value="6">6+ Orang</option>
                        </select></div>
                     </div>
                   </div>
                </form>
              )}
            </div>
          </div>

          {/* --- KOLOM KANAN: PILIH MENU & TOTAL (5 Col) --- */}
          {!isSuccess && (
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
              
              {/* Sticky Total Card */}
              <motion.div 
                className={`p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-500 ${isMinSpendMet ? "bg-[#3E2723] text-[#F3EDE2] shadow-green-900/30" : "bg-[#3E2723] text-[#F3EDE2] shadow-[#3E2723]/30"}`}
                initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{delay: 0.2}}
              >
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-colors duration-500 ${isMinSpendMet ? "bg-green-500/30" : "bg-orange-500/20"}`}></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><ShoppingBag size={14}/> Pre-Order Total</p>
                      <h3 className="text-4xl font-extrabold tracking-tight">Rp {currentTotal.toLocaleString()}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-white/70 text-xs font-bold uppercase mb-1">Minimum Spend</p>
                      <p className="font-bold text-sm opacity-90">Rp {MINIMUM_SPEND.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-8 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`font-bold text-sm flex items-center gap-2 ${isMinSpendMet ? "text-green-300" : "text-orange-200"}`}>
                        {isMinSpendMet ? <><CheckCircle2 size={18}/> Syarat Terpenuhi</> : <><Sparkles size={18}/> Belum Terpenuhi</>}
                      </span>
                      {!isMinSpendMet && <span className="text-xs text-white/80">Kurang Rp {remaining.toLocaleString()}</span>}
                    </div>
                    <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
                      <motion.div className={`h-full rounded-full ${isMinSpendMet ? "bg-gradient-to-r from-green-400 to-green-300" : "bg-gradient-to-r from-orange-400 to-orange-300"}`} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{type: "spring"}} />
                    </div>
                  </div>

                  <button 
                    type="submit" form="reservationForm" disabled={!isMinSpendMet || isSubmitting}
                    className="w-full py-5 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group bg-[#F3EDE2] text-[#3E2723]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? "Memproses..." : (isMinSpendMet ? <>Konfirmasi Reservasi <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/></> : "Penuhi Minimum Order")}
                    </span>
                  </button>
                </div>
              </motion.div>

              {/* Menu List Container */}
              <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-1 border border-white/60 shadow-lg shadow-[#3E2723]/5 overflow-hidden relative">
                 <div className="bg-[#3E2723]/5 px-6 py-4 flex items-center justify-between rounded-t-[2.4rem]">
                    <div className="flex items-center gap-2">
                       <Coffee size={18} className="text-[#3E2723]"/>
                       <h3 className="font-bold text-[#3E2723] text-sm uppercase tracking-wider">Add Menu Items</h3>
                    </div>
                    
                    {/* --- TOMBOL FULL MENU (BUTTON STYLE) --- */}
                    <Link 
                      href="/menu" 
                      target="_blank" 
                      className="px-3 py-1.5 bg-[#3E2723] text-[#F3EDE2] text-xs font-bold rounded-full flex items-center gap-1 hover:bg-[#5D4037] transition-all shadow-sm"
                    >
                      Lihat Full Menu <ExternalLink size={12} />
                    </Link>
                 </div>
                 
                 <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-hide space-y-3">
                   {MENU_ITEMS.map((item) => (
                     <div key={item.id} className="bg-white/80 p-4 rounded-[1.5rem] flex justify-between items-center shadow-sm border border-transparent hover:border-[#3E2723]/10 transition-all group">
                       <div>
                         <h4 className="font-bold text-[#3E2723] leading-tight group-hover:text-orange-800 transition-colors">{item.name}</h4>
                         <p className="text-xs text-[#6A4A38]/70 font-medium">Rp {item.price.toLocaleString()}</p>
                       </div>
                       <div className="flex items-center gap-1 bg-[#F3EDE2] rounded-xl p-1.5 border border-[#3E2723]/5">
                         <button onClick={() => updateCart(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-[#3E2723] hover:bg-red-50 hover:text-red-700 disabled:opacity-50 transition-colors" disabled={!cart[item.id]}><Minus size={16} /></button>
                         <span className="font-bold w-6 text-center text-sm">{cart[item.id] || 0}</span>
                         <button onClick={() => updateCart(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-[#3E2723] text-white rounded-lg shadow-sm hover:bg-[#5D4037] transition-colors"><Plus size={16} /></button>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS untuk menyembunyikan scrollbar tapi tetap bisa di-scroll */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}