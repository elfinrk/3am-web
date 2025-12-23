"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// --- INTERFACES ---
interface Product {
  id: number | string; // Support number (seed) & string (MongoDB _id)
  _id?: string;
  name: string;
  price: number;
  stock: number;
  img: string;
  category: string;
  desc?: string;
}

interface Order {
  _id: string;
  id: string;
  customer: string;
  total: number;
  status: string;
  type: string; // "Online" | "Offline"
  items: string;
  createdAt: string;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  reservations: any[];
  donationBalance: number;
  isLoading: boolean;
  
  // Actions
  refreshData: () => Promise<void>; // Fungsi PENTING untuk refresh manual
  updateProduct: (id: number | string, newData: { price?: number; stock?: number }) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // --- STATE DATA ---
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState([]);
  const [donationBalance, setDonationBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- FUNGSI FETCH SEMUA DATA (CENTRALIZED) ---
  const fetchAllData = useCallback(async () => {
    // Jangan set isLoading(true) disini agar tidak flickering saat auto-refresh background
    try {
      // 1. Fetch Produk
      const resProducts = await fetch("/api/products");
      const dataProducts = await resProducts.json();
      if (Array.isArray(dataProducts)) setProducts(dataProducts);

      // 2. Fetch Orders (Online + Offline)
      const resOrders = await fetch("/api/orders");
      const dataOrders = await resOrders.json();
      if (Array.isArray(dataOrders)) setOrders(dataOrders);

      // 3. Fetch Donasi
      const resDonasi = await fetch("/api/donate");
      const dataDonasi = await resDonasi.json();
      setDonationBalance(dataDonasi.balance || 0);

      // 4. Fetch Reservasi
      const resReservasi = await fetch("/api/reservations");
      const dataReservasi = await resReservasi.json();
      if (Array.isArray(dataReservasi)) setReservations(dataReservasi);

    } catch (err) {
      console.error("Gagal sinkronisasi data AdminContext:", err);
    }
  }, []);

  // --- INITIAL LOAD & AUTO REFRESH ---
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchAllData();
      setIsLoading(false);
    };
    init();

    // Auto refresh setiap 30 detik agar data selalu sinkron
    const interval = setInterval(() => {
        fetchAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  // --- ACTION: REFRESH MANUAL ---
  // Dipanggil oleh Kasir setelah transaksi sukses agar Dashboard langsung update
  const refreshData = async () => {
    await fetchAllData();
  };

  // --- ACTION: UPDATE PRODUK ---
  const updateProduct = async (id: number | string, newData: { price?: number; stock?: number }) => {
    // 1. Optimistic UI Update (Biar cepat di mata user)
    setProducts((prev) => 
      prev.map((p) => {
        // Cek kecocokan ID (bisa _id string atau id number)
        const match = p._id === id || p.id === id;
        return match ? { ...p, ...newData } : p;
      })
    );

    // 2. Kirim ke Database
    try {
      await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...newData }),
      });
      // Refresh data asli dari DB untuk memastikan konsistensi
      refreshData(); 
    } catch (err) {
      console.error("Gagal update produk ke database");
      // Revert changes jika perlu (opsional, disini kita skip untuk simplifikasi)
    }
  };

  return (
    <AdminContext.Provider 
      value={{ 
        products, 
        orders, 
        reservations,
        donationBalance,
        isLoading,
        refreshData,
        updateProduct
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