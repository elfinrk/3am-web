"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- INTERFACES ---
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  img: string;
  category: string;
  desc?: string;
}

interface AdminContextType {
  products: Product[];
  updateProduct: (id: number, newData: { price?: number; stock?: number }) => void;
  orders: any[];
  donationBalance: number;
  donors: any[];
  reservations: any[];
  updateStatus: (id: string, newStatus: string) => void;
  addDonation: (amount: number, donorName: string) => void;
  updateReservationStatus: (id: string, newStatus: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState([]);
  const [donationBalance, setDonationBalance] = useState(12450000); // Nilai default 3.AM Care
  const [donors, setDonors] = useState([]);
  const [reservations, setReservations] = useState([]);

  // --- AUTO-FETCH DARI MONGODB ---
  // Mengambil 24 data produk yang sudah di-seed ke database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Gagal memuat data dari database");
      }
    };
    loadProducts();
  }, []);

  // --- ACTIONS ---
  
  // Update Harga & Stok langsung ke MongoDB Atlas
  const updateProduct = async (id: number, newData: { price?: number; stock?: number }) => {
    // 1. Update UI secara lokal (Optimistic UI) agar Admin tidak lag
    setProducts((prev) => 
      prev.map((p) => (p.id === id ? { ...p, ...newData } : p))
    );

    // 2. Kirim perubahan ke API PATCH /api/products
    try {
      const response = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...newData }), // Mengirim ID numerik sesuai MongoDB
      });

      if (!response.ok) throw new Error("Gagal menyimpan ke DB");
      
      console.log(`Produk ID ${id} berhasil diperbarui di MongoDB`);
    } catch (err) {
      console.error("Gagal sinkronisasi ke MongoDB, pastikan IP sudah Whitelisted");
    }
  };

  // Fungsi tambahan (Placeholders sesuai kodingan Anda)
  const updateStatus = (id: string, newStatus: string) => {
    console.log(`Update status order ${id} ke ${newStatus}`);
  };

  const addDonation = (amount: number, donorName: string) => {
    setDonationBalance(prev => prev + amount);
    console.log(`Donasi dari ${donorName} sebesar ${amount} diterima`);
  };

  const updateReservationStatus = (id: string, newStatus: string) => {
    console.log(`Update reservasi ${id} ke ${newStatus}`);
  };

  return (
    <AdminContext.Provider 
      value={{ 
        products, 
        updateProduct,
        orders, 
        donationBalance, 
        donors, 
        reservations,
        updateStatus,
        addDonation,
        updateReservationStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
};