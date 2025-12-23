"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User, Phone, MapPin, ShoppingBag,
  ArrowRight, Plus, Minus,
  Bike, Store, Sparkles, ArrowLeft, Loader2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// NOMOR ADMIN WA
const ADMIN_WA = "6285180646816";

export default function OrderPage() {
  const [mounted, setMounted] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. SYNC DATA DARI ADMIN (MONGODB) ---
  useEffect(() => {
    setMounted(true);
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        // Hanya ambil menu makanan/minuman (filter merch jika perlu)
        setMenuItems(data.filter((item: any) => item.category !== "merch"));
      } catch (err) {
        console.error("Gagal sinkron data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // --- 2. LOGIKA CART DENGAN PROTEKSI STOK ---
  const updateCart = (id: string, delta: number) => {
    const item = menuItems.find(m => (m._id === id || m.id === id));
    
    // Proteksi: Cegah tambah jika stok habis
    if (delta > 0 && item && item.stock <= (cart[id] || 0)) {
      alert(`Maaf, stok ${item.name} sudah habis.`);
      return;
    }

    setCart(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: newQty };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = menuItems.find(m => m._id === id || m.id === id);
    return total + (item ? item.price * qty : 0);
  }, 0);

  // --- 3. LOGIKA CHECKOUT (DENGAN CART ITEMS) ---
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalItems === 0) return alert("Keranjang masih kosong!");

    setIsSubmitting(true);

    const itemsDetail = Object.entries(cart).map(([id, qty]) => {
      const item = menuItems.find(m => m._id === id || m.id === id);
      return `${item?.name} (${qty}x)`;
    }).join(", ");

    const orderData = {
      customer: formData.name,
      phone: formData.phone,
      address: orderType === "delivery" ? formData.address : "Pickup di Outlet",
      items: itemsDetail,
      total: totalPrice,
      type: orderType === "delivery" ? "Delivery" : "Pickup",
      notes: formData.notes,
      
      // --- WAJIB ADA: Kirim data cart agar backend bisa potong stok ---
      cartItems: cart 
    };

    try {
      // Kirim ke Backend
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      // Buka WhatsApp
      const itemsListWA = Object.entries(cart).map(([id, qty]) => {
        const item = menuItems.find(m => m._id === id || m.id === id);
        return item ? `- ${item.name} (${qty}x) : Rp ${(item.price * qty).toLocaleString('id-ID')}` : "";
      }).join("\n");

      const message = `*${orderType.toUpperCase()} ORDER*\n--------------------------------\n👤 *Nama:* ${formData.name}\n📞 *WA:* ${formData.phone}\n📍 *Alamat:* ${orderData.address}\n📝 *Catatan:* ${formData.notes || "-"}\n\n*DETAIL PESANAN:*\n${itemsListWA}\n\n--------------------------------\n💰 *TOTAL: Rp ${totalPrice.toLocaleString('id-ID')}*\n--------------------------------\nMohon diproses segera. Terima kasih!`;

      window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(message)}`, '_blank');
      setCart({});
      setFormData({ name: "", phone: "", address: "", notes: "" }); 
    } catch (err) {
      alert("Gagal koneksi ke database Admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || isLoading) return (
    <div className="min-h-screen bg-[#F3EDE2] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#3E2723]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen font-sans text-[#3E2723] bg-[#F3EDE2] relative overflow-x-hidden selection:bg-[#3E2723] selection:text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#3E2723]/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full font-bold text-sm hover:bg-white transition shadow-sm group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#3E2723] text-[#F3EDE2] rounded-full font-bold text-sm shadow-lg">
            <ShoppingBag size={16} />
            <span>{totalItems} Item</span>
            <span className="w-[1px] h-4 bg-white/20 mx-1"></span>
            <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full text-orange-800 text-xs font-bold tracking-widest uppercase mb-2">
                <Sparkles size={12} /> Easy Order
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Order Online, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8D6E63] to-[#3E2723]">Enjoy Anywhere.</span>
              </h1>
            </motion.div>

            <div className="flex bg-white/50 p-1 rounded-2xl w-fit border border-white/60">
              <button onClick={() => setOrderType("delivery")} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${orderType === "delivery" ? "bg-[#3E2723] text-white shadow-md" : "text-[#3E2723] hover:bg-white/50"}`}><Bike size={18} /> Delivery</button>
              <button onClick={() => setOrderType("pickup")} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${orderType === "pickup" ? "bg-[#3E2723] text-white shadow-md" : "text-[#3E2723] hover:bg-white/50"}`}><Store size={18} /> Pickup</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <motion.div 
                  key={item._id || item.id} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  whileInView={{ opacity: 1, scale: 1 }} 
                  viewport={{ once: true }} 
                  className={`relative bg-white/70 backdrop-blur-md p-3 rounded-[2rem] border border-white/60 transition-all flex justify-between items-center group ${item.stock <= 0 ? "opacity-60 grayscale-[0.5]" : "hover:border-[#3E2723]/20 hover:shadow-lg"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100/50 shadow-sm p-1">
                      {item.img || item.image ? (
                        <Image src={item.img || item.image} alt={item.name} fill className="object-contain group-hover:scale-105 transition-transform duration-500" />
                      ) : <div className="w-full h-full bg-gray-200" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#3E2723] text-base leading-tight group-hover:text-orange-800 transition">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500 font-medium">Rp {item.price.toLocaleString('id-ID')}</p>
                        {item.stock <= 5 && item.stock > 0 && <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 rounded">Sisa {item.stock}</span>}
                      </div>
                    </div>
                  </div>

                  {item.stock <= 0 ? (
                    <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider mr-2 border border-red-100">Habis</div>
                  ) : (
                    cart[item._id || item.id] ? (
                      <div className="flex items-center gap-2 bg-[#3E2723] text-white px-2 py-1.5 rounded-xl shadow-lg mr-2 z-20">
                        <button onClick={() => updateCart(item._id || item.id, -1)} className="hover:text-orange-200 p-1"><Minus size={16} /></button>
                        <span className="font-bold text-sm w-5 text-center">{cart[item._id || item.id]}</span>
                        <button onClick={() => updateCart(item._id || item.id, 1)} className="hover:text-orange-200 p-1"><Plus size={16} /></button>
                      </div>
                    ) : (
                      <button onClick={() => updateCart(item._id || item.id, 1)} className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-[#3E2723] hover:bg-[#3E2723] hover:text-white transition-all shadow-sm mr-2 z-20"><Plus size={20} /></button>
                    )
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="bg-[#3E2723] text-[#F3EDE2] p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 relative z-10"><ShoppingBag className="text-orange-300" /> Checkout</h2>
                <form onSubmit={handleCheckout} className="space-y-4 relative z-10">
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3 border border-white/5 focus-within:border-orange-300/50 transition">
                      <User size={18} className="text-orange-200" />
                      <input required placeholder="Nama Lengkap" className="bg-transparent w-full outline-none placeholder-white/40 text-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3 border border-white/5 focus-within:border-orange-300/50 transition">
                      <Phone size={18} className="text-orange-200" />
                      <input required type="tel" placeholder="Nomor WhatsApp" className="bg-transparent w-full outline-none placeholder-white/40 text-sm" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <AnimatePresence>
                      {orderType === "delivery" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="bg-white/10 rounded-xl p-3 flex items-start gap-3 border border-white/5 focus-within:border-orange-300/50 transition">
                            <MapPin size={18} className="text-orange-200 mt-1" />
                            <textarea required rows={3} placeholder="Alamat Lengkap Pengiriman..." className="bg-transparent w-full outline-none placeholder-white/40 text-sm resize-none" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="bg-white/10 rounded-xl p-3 border border-white/5 focus-within:border-orange-300/50 transition">
                      <input placeholder="Catatan (Opsional)" className="bg-transparent w-full outline-none placeholder-white/40 text-sm" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                    </div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl space-y-2 mt-6">
                    <div className="flex justify-between text-sm text-white/70"><span>Total Item</span><span>{totalItems} pcs</span></div>
                    <div className="flex justify-between font-bold text-lg text-white border-t border-white/10 pt-2 mt-2"><span>Total Bayar</span><span>Rp {totalPrice.toLocaleString('id-ID')}</span></div>
                  </div>
                  <button type="submit" disabled={isSubmitting || totalItems === 0} className="w-full py-4 bg-[#F3EDE2] text-[#3E2723] rounded-xl font-bold text-lg hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50">
                    {isSubmitting ? "Memproses..." : <><Sparkles size={18} /> Order Online <ArrowRight size={18} /></>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}