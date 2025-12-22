"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, ShoppingBag, X, Plus, Minus, Trash2, 
  Copy, CheckCircle, QrCode, ShoppingCart, Eye
} from "lucide-react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  AnimatePresence 
} from "framer-motion";

// --- DATA PEMBAYARAN ---
const PAYMENT_INFO = {
  bankName: "BCA",
  accountNumber: "7275472760", 
  accountName: "3.AM COFFEE OFFICIAL",
  qrisImage: "/qris.jpg" 
};

// --- STYLE LOOKUP (Agar Data DB tetap memiliki UI/UX asli Anda) ---
const merchStyleLookup: Record<string, any> = {
  "Midnight Drip Tumbler": { bg: "bg-gradient-to-br from-[#1a1a1a] to-[#333333]", sticker: "NEW DROP", rotation: 2, textColor: "text-white" },
  "Noir Cup": { bg: "bg-gradient-to-br from-[#3E2723] to-[#5D4037]", sticker: "DAILY USE", rotation: -2, textColor: "text-[#F9F5E8]" },
  "Nightfall Tote Bag": { bg: "bg-gradient-to-br from-[#212121] to-[#424242]", sticker: "HOT ITEM", rotation: 1, textColor: "text-white" },
  "Daylight Tote Bag": { bg: "bg-gradient-to-br from-[#D7CCC8] to-[#EFEBE9]", sticker: "AESTHETIC", rotation: -3, textColor: "text-[#3E2723]" },
  "Duskwear Tee": { bg: "bg-gradient-to-br from-[#5D4037] to-[#8D6E63]", sticker: "PREMIUM", rotation: 2, textColor: "text-[#F9F5E8]" },
  "3AM Coffe Cup": { bg: "bg-gradient-to-br from-[#3E2723] to-[#2B1B17]", sticker: "ESSENTIAL", rotation: 0, textColor: "text-white" }
};

// --- KOMPONEN KARTU 3D TILT ---
const TiltCard = ({ item, onClick }: { item: any, onClick: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const style = merchStyleLookup[item.name] || { bg: "bg-stone-800", sticker: "MERCH", rotation: 0, textColor: "text-white" };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      className={`relative group w-full h-[550px] rounded-[2.5rem] p-8 cursor-pointer shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${style.bg}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full z-0" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-tr-full z-0" />
      
      <div style={{ transform: "translateZ(50px)" }} className="relative h-full flex flex-col justify-between z-10">
        {/* Sticker */}
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 bg-white text-[#3E2723] font-bold text-xs tracking-widest px-4 py-2 rounded-full border border-[#3E2723]/10 shadow-lg rotate-6 z-20"
        >
          {style.sticker}
        </motion.div>

        {/* Product Image */}
        <div className="flex-grow flex items-center justify-center w-full relative">
           <div className="absolute w-40 h-40 bg-white/10 blur-[50px] rounded-full pointer-events-none" />
           <motion.div style={{ transform: "translateZ(80px)" }} className="relative w-56 h-56 md:w-72 md:h-72 drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]" whileHover={{ scale: 1.1, rotate: style.rotation * 3 }}>
            <Image src={item.img} alt={item.name} fill className="object-contain" />
          </motion.div>
        </div>

        {/* Product Info Card */}
        <div style={{ transform: "translateZ(60px)" }} className={`w-full ${item.name.includes("Daylight") ? "bg-black/5 border-black/10" : "bg-white/10 border-white/20"} backdrop-blur-md border p-6 rounded-3xl mt-4 relative overflow-hidden group-hover:bg-white/20 transition-colors`}>
          <div>
            <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-2 opacity-80 ${style.textColor}`}>{item.category}</p>
            <h3 className={`text-2xl md:text-3xl font-display font-bold leading-none ${style.textColor}`}>{item.name}</h3>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <span className={`font-bold text-lg ${style.textColor === "text-white" ? "bg-white/20" : "bg-black/10"} px-4 py-2 rounded-xl backdrop-blur-sm`}>
              Rp {item.price.toLocaleString('id-ID')}
            </span>
            <button className={`flex items-center gap-2 text-xs font-bold px-4 py-3 rounded-full transition-all ${item.name.includes("Daylight") ? "bg-[#3E2723] text-white" : "bg-[#F9F5E8] text-[#3E2723]"}`}>
               <Eye size={16} /> Detail
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAY STOK HABIS (DENGAN TRANSLATE-Z TERINGGI AGAR DI DEPAN FOTO) */}
      {item.stock <= 0 && (
        <div style={{ transform: "translateZ(150px)" }} className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px] rounded-[2.5rem]" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-[110] bg-red-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(220,38,38,0.8)] border-2 border-white/30"
          >
            Stock Habis
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default function MerchPageComplete() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [qrisError, setQrisError] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  // --- AMBIL DATA DARI ADMIN (MONGODB) ---
  useEffect(() => {
    const fetchMerch = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.filter((p: any) => p.category === "merch")); // Filter khusus merch
      } catch (err) {
        console.error("Gagal ambil data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMerch();
  }, []);

  const addToCart = (item: any) => {
    if (item.stock <= 0) return showToast("Stok Habis!");
    setCart((prev) => {
      const existing = prev.find((i: any) => i.id === item.id);
      if (existing) return prev.map((i: any) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setSelectedItem(null);
    showToast(`${item.name} ditambahkan`);
    setIsCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Nomor disalin");
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#F9F5E8] font-body text-[#3E2723] overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Karla:wght@400;500;700&display=swap');
        .font-display { font-family: 'DM Serif Display', serif; }
        .font-body { font-family: 'Karla', sans-serif; }
        .bg-pattern { background-image: radial-gradient(#3E2723 1px, transparent 1px); background-size: 30px 30px; opacity: 0.03; }
      `}</style>

      <div className="fixed inset-0 bg-pattern pointer-events-none z-0"></div>

      <nav className="sticky top-0 z-50 w-full bg-[#F9F5E8]/90 backdrop-blur-md border-b border-[#E5DCC5] px-6 h-24 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-3 font-bold text-[#3E2723] group">
          <div className="p-2 border border-[#E5DCC5] rounded-full bg-white group-hover:bg-[#3E2723] group-hover:text-white transition-colors">
             <ArrowLeft size={20} />
          </div>
          <span>Kembali</span>
        </Link>
        <div className="flex items-center gap-2">
          <Image src="/Logo.png" alt="Logo" width={40} height={40} />
          <span className="font-display font-bold text-2xl text-[#3E2723]">3.AM Store</span>
        </div>
        <motion.div onClick={() => setIsCartOpen(true)} whileHover={{ scale: 1.05 }} className="p-3 bg-[#3E2723] text-white rounded-full shadow-lg relative cursor-pointer">
          <ShoppingCart size={22} />
          {totalItems > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D32F2F] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#F9F5E8]">{totalItems}</span>}
        </motion.div>
      </nav>

      <main className="pb-32 relative z-10 px-6">
        <section className="pt-20 pb-24 text-center">
            <span className="text-[#8D6E63] font-bold tracking-[0.3em] text-xs uppercase mb-6 block">Official Merchandise</span>
            <h1 className="font-display text-6xl md:text-8xl font-bold text-[#3E2723] leading-none mb-8">Merch <br/> <span className="italic text-[#5D4037]">3.AM.</span></h1>
        </section>
        <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {products.map((item) => (
            <div key={item.id} className="perspective-1000"><TiltCard item={item} onClick={() => setSelectedItem(item)} /></div>
          ))}
        </section>
      </main>

      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-5xl ${merchStyleLookup[selectedItem.name]?.bg || 'bg-stone-800'} rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row text-white`}>
              <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 z-30"><X size={24} /></button>
              <div className="w-full md:w-1/2 p-12 flex items-center justify-center relative"><Image src={selectedItem.img} alt={selectedItem.name} fill className="object-contain drop-shadow-2xl p-10" /></div>
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-black/20 backdrop-blur-lg">
                <span className="inline-block self-start px-4 py-1 rounded-full text-xs font-bold mb-6 border border-white/20">{selectedItem.category}</span>
                <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">{selectedItem.name}</h2>
                <p className="text-3xl mb-8 font-body">Rp {selectedItem.price.toLocaleString('id-ID')}</p>
                <p className="text-lg opacity-80 mb-10 leading-relaxed">"{selectedItem.desc || 'Produk Eksklusif 3.AM'}"</p>
                <button onClick={() => addToCart(selectedItem)} className="w-full py-5 rounded-2xl font-bold text-lg bg-[#F9F5E8] text-[#3E2723] hover:bg-white shadow-lg transition-all"><ShoppingBag size={20} /> Masukkan Keranjang</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F9F5E8] z-[80] shadow-2xl flex flex-col border-l border-[#E5DCC5]">
                <div className="p-6 border-b border-[#E5DCC5] flex justify-between items-center bg-white"><h2 className="font-display text-xl font-bold text-[#3E2723]">Keranjang Belanja</h2><button onClick={() => setIsCartOpen(false)}><X size={20} /></button></div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? <div className="text-center mt-20 opacity-40 font-bold">Keranjang kosong</div> : cart.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border shadow-sm">
                      <div className="w-20 h-20 bg-[#F9F5E8] rounded-xl relative flex-shrink-0 border"><Image src={item.img} alt={item.name} fill className="object-contain p-2" /></div>
                      <div className="flex-1">
                        <h4 className="font-display font-bold text-[#3E2723] text-sm mb-1">{item.name}</h4>
                        <p className="text-xs text-[#8D6E63] font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center bg-[#F9F5E8] rounded-lg border px-2 py-1"><button onClick={() => updateQty(item.id, -1)} className="px-3 py-1"><Minus size={12}/></button><span className="w-8 text-center text-xs font-bold">{item.qty}</span><button onClick={() => updateQty(item.id, 1)} className="px-3 py-1"><Plus size={12}/></button></div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && <div className="p-6 bg-white border-t"><div className="flex justify-between mb-4 font-bold"><span>Total</span><span>Rp {totalPrice.toLocaleString('id-ID')}</span></div><button onClick={() => { setIsCartOpen(false); setShowPayment(true); }} className="w-full bg-[#3E2723] text-white py-4 rounded-xl font-bold uppercase">Checkout</button></div>}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Modal with QRIS */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-sm" onClick={() => setShowPayment(false)}>
           <div className="bg-[#F9F5E8] w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative border border-[#E5DCC5]" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-[#3E2723] mb-6 text-center">Info Pembayaran</h2>
              <div className="bg-[#3E2723] text-white rounded-xl p-4 mb-6 text-center"><p className="text-xs opacity-70 mb-1 tracking-widest uppercase">Total Tagihan</p><p className="text-2xl font-bold font-display">Rp {totalPrice.toLocaleString('id-ID')}</p></div>
              <div className="bg-white p-4 rounded-xl border mb-6 relative"><p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Bank Transfer</p><p className="font-bold text-[#3E2723]">{PAYMENT_INFO.bankName}</p><p className="font-mono text-lg tracking-wider text-[#5D4037]">{PAYMENT_INFO.accountNumber}</p><button onClick={() => copyToClipboard(PAYMENT_INFO.accountNumber)} className="absolute right-4 bottom-4 bg-gray-50 p-2 rounded-lg border shadow-sm"><Copy size={16}/></button></div>
              <div className="bg-white p-4 rounded-xl border text-center mb-6"><p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Scan QRIS</p>
                <div className="w-40 h-40 mx-auto rounded-lg border flex items-center justify-center relative shadow-inner">
                  {!qrisError ? <Image src={PAYMENT_INFO.qrisImage} alt="QRIS" fill className="object-contain p-2" onError={() => setQrisError(true)} /> : <QrCode size={48} className="text-gray-200" />}
                </div>
              </div>
              <button onClick={() => { setShowPayment(false); setShowSuccess(true); }} className="w-full bg-[#3E2723] text-white py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-[#5D4037]">Konfirmasi Bayar</button>
           </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3E2723]/70 backdrop-blur-md">
           <div className="bg-[#F9F5E8] w-full max-w-sm p-8 text-center rounded-[2.5rem] shadow-2xl border border-[#E5DCC5]">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce"><CheckCircle size={40} /></div>
              <h2 className="font-display text-2xl font-bold mb-2">Pesanan Diterima!</h2>
              <button onClick={() => { setCart([]); setShowSuccess(false); }} className="w-full bg-[#3E2723] text-white py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg">Belanja Lagi</button>
           </div>
        </div>
      )}

      <footer className="bg-[#2E1C16] py-12 text-center text-[#F9F5E8] mt-20 relative z-10"><p className="font-display text-xl mb-2">3.AM Store</p><p className="opacity-60 text-sm">© 2025 Official Merchandise.</p></footer>
    </div>
  );
}