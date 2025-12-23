"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, ShoppingBag, Plus, Minus, X, Trash2, 
  ArrowRight, CheckCircle, CreditCard, Copy, QrCode 
} from "lucide-react";

const PAYMENT_INFO = {
  bankName: "BCA",
  accountNumber: "7275472760",
  accountName: "3.AM COFFEE OFFICIAL",
  qrisImage: "/qris.jpg" 
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. FETCH DATA ---
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Gagal ambil data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. LOGIKA HIGHLIGHT ITEM (PERBAIKAN AGAR TIDAK HILANG) ---
  // Prioritas 1: Cari item dengan nama persis "3AM Coffee Cup"
  // Prioritas 2: Cari item apapun yang kategorinya "merch"
  // Prioritas 3: Ambil item pertama di database sebagai default
  const highlightItem = products.find(p => p.name === "3AM Coffee Cup") 
                        || products.find(p => p.category === "merch") 
                        || products[0]; 

  const foodAndDrinks = products.filter(item => item.category !== "merch"); 
  
  const filteredItems = activeCategory === "all" 
    ? foodAndDrinks 
    : foodAndDrinks.filter(item => item.category === activeCategory);

  // --- STATE CART & MODAL ---
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ""});
  const [showPayment, setShowPayment] = useState(false); 
  const [showSuccess, setShowSuccess] = useState(false); 
  const [qrisError, setQrisError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HELPER TOAST ---
  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  // --- ACTIONS (VALIDASI STOK KETAT) ---
  const addToCart = (item: any) => {
    if (item.stock <= 0) return showToast("Stok Habis!");

    const existingItem = cart.find((i) => i.id === item.id);
    const currentQty = existingItem ? existingItem.qty : 0;

    if (currentQty + 1 > item.stock) return showToast(`Stok tersisa ${item.stock}!`);

    setCart((prev) => {
      if (existingItem) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`${item.name} ditambahkan!`);
  };

  const updateQty = (id: number, delta: number) => {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(i => i.id === id);

    if (!product || !cartItem) return;

    const newQty = cartItem.qty + delta;
    if (newQty < 1) return;

    if (delta > 0 && newQty > product.stock) return showToast(`Maksimal stok: ${product.stock}`);

    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: newQty } : i));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // --- CHECKOUT ---
  const handleCheckout = () => { 
      if (cart.length === 0) return; 
      setIsCartOpen(false); 
      setShowPayment(true); 
  };

  const confirmPayment = async () => {
      setIsSubmitting(true);
      const cartItemsForBackend: { [key: string]: number } = {};
      cart.forEach(item => {
          const itemId = item._id || item.id; 
          cartItemsForBackend[itemId] = item.qty;
      });

      const orderData = {
          customer: "Guest (Menu Page)",
          phone: "-",
          address: "Dine-in / Takeaway",
          items: cart.map(i => `${i.name} (${i.qty}x)`).join(", "),
          total: totalPrice,
          type: "Dine-in",
          cartItems: cartItemsForBackend
      };

      try {
          await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData)
          });
          await fetchProducts(); // Refresh stok
          setCart([]);
          setShowPayment(false);
          setShowSuccess(true);
      } catch (error) {
          showToast("Gagal memproses pesanan");
      } finally {
          setIsSubmitting(false);
      }
  };

  const closeSuccessModal = () => { setShowSuccess(false); };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Nomor disalin!");
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#F9F5E8] font-body text-[#3E2723] overflow-x-hidden relative pb-32">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 w-full bg-[#F9F5E8]/95 backdrop-blur-md border-b border-[#E5DCC5] px-4 md:px-6 h-20 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-full bg-white border border-[#E5DCC5] group-hover:bg-[#3E2723] group-hover:text-white transition-all">
             <ArrowLeft size={20} />
          </div>
          <span className="font-bold hidden sm:block">Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <Image src="/Logo.png" alt="Logo" width={32} height={32} />
          <span className="font-display font-bold text-xl md:text-2xl">Full Menu</span>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="p-2.5 rounded-full bg-[#3E2723] text-white relative">
          <ShoppingBag size={20} />
          {totalItems > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#F9F5E8] flex items-center justify-center text-[10px] font-bold">{totalItems}</span>}
        </button>
      </nav>

      {/* TOAST */}
      <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[110] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-[#3E2723] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-bold border border-white/10">
            <CheckCircle size={18} className="text-green-400"/> {toast.msg}
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-6 py-8">
        
        {/* HERO HIGHLIGHT (Banner 3AM Coffee Cup) */}
        {highlightItem && (
          <section className="mb-12">
            <div className="relative bg-[#2E1C16] rounded-[2rem] p-6 md:p-10 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8 text-[#F9F5E8]">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
              
              {/* Gambar Produk */}
              <div className="w-full md:w-1/2 flex justify-center relative z-10 order-2 md:order-1">
                <div className="relative w-72 h-72 md:w-[28rem] md:h-[28rem] animate-float">
                  <Image src={highlightItem.img} alt="Highlight" fill className="object-contain drop-shadow-2xl" />
                </div>
              </div>

              {/* Teks Deskripsi */}
              <div className="w-full md:w-1/2 space-y-4 relative z-10 text-center md:text-left order-1 md:order-2">
                <div className="inline-block bg-[#E5DCC5] text-[#3E2723] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">Featured Item</div>
                <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">{highlightItem.name}</h1>
                <p className="text-[#F9F5E8]/80 text-sm md:text-base leading-relaxed">{highlightItem.desc || "Nikmati kopi terbaik dengan gaya elegan."}</p>
                <div className="pt-4 flex items-center gap-4 justify-center md:justify-start">
                  <span className="font-bold text-3xl">Rp {highlightItem.price.toLocaleString('id-ID')}</span>
                  {highlightItem.stock > 0 ? (
                      <button onClick={() => addToCart(highlightItem)} className="bg-[#E5DCC5] text-[#3E2723] px-8 py-3 rounded-xl font-bold hover:bg-white hover:scale-105 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                        <ShoppingBag size={18} /> Add to Order
                      </button>
                  ) : (
                      <div className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold cursor-not-allowed opacity-80">SOLD OUT</div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TABS KATEGORI */}
        <div className="sticky top-20 z-30 mb-8 bg-[#F9F5E8]/95 backdrop-blur py-2">
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">
            {[
              { id: "all", name: "All Menu" },
              { id: "Signature Drinks", name: "Signature" },
              { id: "Coffee", name: "Coffee Corner" },
              { id: "Non-Coffee", name: "Non-Coffee" },
              { id: "food", name: "Pastry & Savory" },
              { id: "dessert", name: "Dessert" },
            ].map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${activeCategory === cat.id ? "bg-[#3E2723] text-white" : "bg-white text-[#6A4A38]"}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* GRID MENU */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map((item) => {
            const isSoldOut = item.stock <= 0;
            return (
              <div key={item.id} className={`group bg-white rounded-3xl p-4 border border-[#E5DCC5] transition-all flex flex-col h-full relative overflow-hidden ${isSoldOut ? '' : 'hover:border-[#3E2723]'}`}>
                <div className="relative w-full aspect-square bg-[#F6F1E7] rounded-2xl mb-3 flex items-center justify-center overflow-hidden">
                  <div className={`relative w-full h-full transition-all duration-500 ${isSoldOut ? 'opacity-50 blur-[1px]' : 'group-hover:scale-110'}`}>
                     <Image src={item.img} alt={item.name} fill className="object-contain p-4" />
                  </div>
                  {isSoldOut && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div className="bg-[#D32F2F] text-white px-5 py-2 rounded-full font-black uppercase tracking-[0.15em] text-[10px] md:text-xs shadow-[0_0_20px_rgba(220,38,38,0.6)] border border-white/20 animate-pulse">
                            STOCK HABIS
                        </div>
                    </div>
                  )}
                  {!isSoldOut && (
                    <button onClick={() => addToCart(item)} className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-[#3E2723] hover:bg-[#3E2723] hover:text-white transition-all z-20"><Plus size={20} /></button>
                  )}
                </div>
                <h3 className={`font-bold text-sm md:text-lg mb-1 ${isSoldOut ? 'text-gray-400' : 'text-[#3E2723]'}`}>{item.name}</h3>
                <p className="text-[#8C6B52] text-[10px] mb-3 line-clamp-2">{item.desc}</p>
                <div className="mt-auto border-t border-dashed border-[#E5DCC5] pt-2 flex justify-between items-center">
                    <span className={`font-bold ${isSoldOut ? 'text-gray-400' : 'text-[#3E2723]'}`}>Rp {item.price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FLOATING CART BAR */}
      <div className={`fixed bottom-0 left-0 w-full p-4 z-40 transition-transform duration-300 ${totalItems > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-4xl mx-auto bg-[#3E2723] text-white rounded-2xl p-4 shadow-2xl flex justify-between items-center cursor-pointer hover:bg-[#2A1D15]" onClick={() => setIsCartOpen(true)}>
             <div className="flex flex-col">
                <span className="text-xs text-white/70">{totalItems} Item di Keranjang</span>
                <span className="font-bold text-lg">Rp {totalPrice.toLocaleString('id-ID')}</span>
             </div>
             <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl font-bold text-sm">Lihat Pesanan <ShoppingBag size={16} /></div>
        </div>
      </div>

      {/* SIDEBAR CART */}
      <div className={`fixed inset-0 z-[60] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-5 border-b flex justify-between items-center bg-[#3E2723] text-white">
            <div className="flex items-center gap-2"><ShoppingBag size={20} /><h2 className="font-bold">Keranjang</h2></div>
            <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white p-3 rounded-2xl shadow-sm border">
                <div className="w-16 h-16 relative bg-[#F6F1E7] rounded-xl"><Image src={item.img} alt={item.name} fill className="object-contain p-1" /></div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                      <button onClick={() => updateQty(item.id, -1)}><Minus size={12} /></button><span className="text-xs font-bold">{item.qty}</span><button onClick={() => updateQty(item.id, 1)}><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="p-6 border-t">
              <div className="flex justify-between mb-4 font-bold"><span>Total</span><span>Rp {totalPrice.toLocaleString('id-ID')}</span></div>
              <button onClick={handleCheckout} className="w-full py-4 bg-[#3E2723] text-white rounded-xl font-bold flex justify-center items-center gap-2">Checkout <ArrowRight /></button>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowPayment(false)} />
          <div className="relative bg-white rounded-[2rem] p-6 w-full max-w-sm text-center shadow-2xl border border-[#E5DCC5]">
            <h2 className="text-xl font-bold text-[#3E2723] mb-4 flex items-center justify-center gap-2"><CreditCard size={20} /> Pembayaran</h2>
            <div className="bg-[#3E2723] text-white rounded-xl p-3 mb-6"><p className="text-xs opacity-70">Total Tagihan</p><p className="text-2xl font-bold">Rp {totalPrice.toLocaleString('id-ID')}</p></div>
            <div className="space-y-4 mb-8 text-left">
              <div className="bg-gray-50 p-4 rounded-xl border relative"><p className="text-xs font-bold text-gray-500 uppercase">{PAYMENT_INFO.bankName}</p><p className="font-mono text-gray-600">{PAYMENT_INFO.accountNumber}</p><button onClick={() => copyToClipboard(PAYMENT_INFO.accountNumber)} className="absolute right-4 bottom-4 bg-white p-2 rounded-lg border shadow-sm"><Copy size={16} /></button></div>
              <div className="bg-gray-50 p-4 rounded-xl border text-center"><p className="text-xs font-bold text-gray-500 mb-2 uppercase">Scan QRIS</p><div className="w-40 h-40 bg-white mx-auto rounded-lg flex items-center justify-center border relative">{!qrisError ? <Image src={PAYMENT_INFO.qrisImage} alt="QRIS" fill className="object-contain p-2" onError={() => setQrisError(true)} /> : <QrCode size={48} className="text-gray-300" />}</div></div>
            </div>
            <button onClick={confirmPayment} disabled={isSubmitting} className="w-full py-3 bg-[#3E2723] text-white rounded-xl font-bold disabled:opacity-50">{isSubmitting ? "Memproses..." : "Saya Sudah Bayar"}</button>
            <button onClick={() => setShowPayment(false)} className="mt-3 text-sm text-gray-500">Batal</button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <div className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-sm text-center shadow-2xl">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} /></div>
             <h2 className="text-2xl font-bold text-[#3E2723] mb-2">Pesanan Diterima!</h2>
             <p className="text-[#8C6B52] mb-6 text-sm">Terima kasih, barista kami segera menyiapkan pesanan Anda.</p>
             <button onClick={closeSuccessModal} className="w-full py-3 bg-[#3E2723] text-white rounded-xl font-bold">Pesan Lagi</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}