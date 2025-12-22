"use client";

import { useState } from "react";
import { useAdmin } from "../AdminContext";
import { Search, Save, Loader2, Tag, Box, Edit3, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function MerchStockPage() {
  const { products, updateProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  
  // State untuk menyimpan perubahan sementara sebelum disimpan ke MongoDB
  const [tempChanges, setTempChanges] = useState<Record<number, { price: number; stock: number }>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const formatRupiah = (value: number | string) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const cleanNumber = (value: string) => {
    return parseInt(value.replace(/\./g, "")) || 0;
  };

  // Fungsi mencatat perubahan lokal agar tombol save bisa muncul
  const handleLocalChange = (id: number, field: "price" | "stock", value: number) => {
    const currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    setTempChanges(prev => ({
      ...prev,
      [id]: {
        price: prev[id]?.price ?? currentProduct.price,
        stock: prev[id]?.stock ?? currentProduct.stock,
        [field]: value
      }
    }));
  };

  // Fungsi mengirim data final ke MongoDB Atlas
  const handleSave = async (id: number) => {
    const changes = tempChanges[id];
    if (!changes) return;

    setLoadingId(id);
    await updateProduct(id, changes); 
    
    // Reset state lokal setelah sukses
    setTempChanges(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setLoadingId(null);
  };

  // Filter KHUSUS kategori merch sesuai database Anda
  const merchProducts = products.filter((p: any) => 
    p.category === "merch" &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#3E2723]">Koleksi Merchandise</h1>
          <p className="text-sm text-gray-400 font-medium">Ubah harga atau stok merch, lalu tekan simpan.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Cari item merch..." 
            className="w-full bg-white border border-[#E5DCC5] rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 ring-[#3E2723]/5 shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {merchProducts.map((product: any) => {
          const isChanged = !!tempChanges[product.id];
          const displayPrice = tempChanges[product.id]?.price ?? product.price;
          const displayStock = tempChanges[product.id]?.stock ?? product.stock;

          return (
            <div key={product.id} className="bg-white rounded-[2.5rem] border border-[#E5DCC5] overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
              
              {/* Image Section dengan Status Stok */}
              <div className="aspect-square bg-[#F9F5E8] m-3 rounded-[2rem] flex items-center justify-center relative p-8">
                <Image 
                  src={product.img || "/placeholder.png"} 
                  alt={product.name} 
                  width={160} 
                  height={160} 
                  className="object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl" 
                />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase shadow-sm border ${
                  displayStock > 5 ? "bg-white text-green-600 border-green-50" : "bg-red-50 text-red-600 border-red-100"
                }`}>
                  {displayStock > 5 ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                  Stok: {displayStock}
                </div>
              </div>

              {/* Data Section */}
              <div className="px-6 pb-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-[#8D6E63]" />
                  <h3 className="font-bold text-[#3E2723] text-sm leading-tight h-10 flex items-center line-clamp-2">{product.name}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1"><Edit3 size={10}/> Harga</label>
                    <input 
                      type="text" 
                      value={formatRupiah(displayPrice)}
                      onChange={(e) => handleLocalChange(product.id, "price", cleanNumber(e.target.value))}
                      className={`w-full border rounded-xl py-2 px-3 text-xs font-black outline-none transition-all ${
                        tempChanges[product.id]?.price ? "border-orange-400 bg-orange-50" : "border-[#E5DCC5] bg-[#F9F5E8]/40"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1"><Box size={10}/> Stok</label>
                    <input 
                      type="number" 
                      value={displayStock}
                      onChange={(e) => handleLocalChange(product.id, "stock", parseInt(e.target.value) || 0)}
                      className={`w-full border rounded-xl py-2 px-3 text-xs font-black outline-none transition-all ${
                        tempChanges[product.id]?.stock ? "border-orange-400 bg-orange-50" : "border-[#E5DCC5] bg-[#F9F5E8]/40"
                      }`}
                    />
                  </div>
                </div>

                {/* TOMBOL SAVE: Hanya muncul saat ada perubahan */}
                {isChanged && (
                  <button
                    onClick={() => handleSave(product.id)}
                    disabled={loadingId === product.id}
                    className="w-full bg-[#3E2723] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#5D4037] transition-all shadow-xl active:scale-95"
                  >
                    {loadingId === product.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Save size={14} />
                    )}
                    Simpan Perubahan
                  </button>
                )}

                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${displayStock > 5 ? 'bg-[#3E2723]' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(displayStock * 2, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}