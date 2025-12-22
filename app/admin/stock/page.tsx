"use client";

import { useState } from "react";
import { useAdmin } from "../AdminContext";
import { Search, Save, Loader2 } from "lucide-react";
import Image from "next/image";

export default function StockPage() {
  const { products, updateProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  
  // State untuk menyimpan perubahan sementara sebelum menekan tombol simpan
  const [tempChanges, setTempChanges] = useState<Record<number, { price: number; stock: number }>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const formatRupiah = (value: number | string) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const cleanNumber = (value: string) => {
    return parseInt(value.replace(/\./g, "")) || 0;
  };

  // Fungsi untuk menangani perubahan input secara lokal tanpa langsung ke DB
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

  // Fungsi untuk mengirim data ke MongoDB saat tombol ditekan
  const handleSave = async (id: number) => {
    const changes = tempChanges[id];
    if (!changes) return;

    setLoadingId(id);
    await updateProduct(id, changes); // Fungsi dari AdminContext
    
    // Hapus dari daftar perubahan sementara setelah berhasil
    setTempChanges(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setLoadingId(null);
  };

  const filteredProducts = products.filter((p: any) =>
    p.category !== "merch" && 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#3E2723]">Manajemen Stok & Harga</h1>
          <p className="text-sm text-gray-400 font-medium">Ubah data lalu tekan simpan untuk update ke MongoDB.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Cari menu minuman/makanan..." 
            className="w-full bg-white border border-[#E5DCC5] rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 ring-[#3E2723]/5"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: any) => {
          const isChanged = !!tempChanges[product.id];
          const displayPrice = tempChanges[product.id]?.price ?? product.price;
          const displayStock = tempChanges[product.id]?.stock ?? product.stock;

          return (
            <div key={product.id} className="bg-white rounded-[2.5rem] border border-[#E5DCC5] overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
              
              <div className="aspect-square bg-[#F9F5E8] m-3 rounded-[2rem] flex items-center justify-center relative p-8">
                <Image 
                  src={product.img || "/placeholder.png"} 
                  alt={product.name} 
                  width={160} 
                  height={160} 
                  className="object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl" 
                />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase shadow-sm border ${
                  displayStock > 10 ? "bg-white text-green-600 border-green-50" : "bg-red-50 text-red-600 border-red-100"
                }`}>
                  Stock: {displayStock}
                </div>
              </div>

              <div className="px-6 pb-6 space-y-5">
                <div>
                  <p className="text-[9px] font-black text-[#8D6E63] uppercase tracking-tighter mb-1">{product.category}</p>
                  <h3 className="font-bold text-[#3E2723] text-sm leading-tight h-10 flex items-start">{product.name}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Harga (Rp)</label>
                    <input 
                      type="text" 
                      value={formatRupiah(displayPrice)}
                      onChange={(e) => handleLocalChange(product.id, "price", cleanNumber(e.target.value))}
                      className={`w-full border rounded-xl py-2 px-3 text-xs font-black outline-none transition-all ${
                        tempChanges[product.id]?.price ? "border-orange-400 bg-orange-50" : "border-[#E5DCC5] bg-[#F9F5E8]/40"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stok</label>
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

                {/* Tombol Simpan muncul hanya jika ada perubahan */}
                {isChanged && (
                  <button
                    onClick={() => handleSave(product.id)}
                    disabled={loadingId === product.id}
                    className="w-full bg-[#3E2723] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#5D4037] transition-colors shadow-lg"
                  >
                    {loadingId === product.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    Simpan Perubahan
                  </button>
                )}

                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${displayStock > 10 ? 'bg-[#3E2723]' : 'bg-red-500'}`}
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