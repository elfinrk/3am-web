"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// --- INTERFACES ---
interface Product {
  id: number | string; 
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
  type: string; 
  items: string;
  createdAt: string;
}

// 👇👇👇 BAGIAN PENTING: JANGAN DIHAPUS 👇👇👇
interface AdminContextType {
  products: Product[];
  orders: Order[];
  reservations: any[];
  donationBalance: number;
  isLoading: boolean;
  
  // Definisi Fungsi refreshData WAJIB ADA DISINI
  refreshData: () => Promise<void>; 
  
  updateProduct: (id: number | string, newData: { price?: number; stock?: number }) => void;
}
// 👆👆👆 PASTIKAN BAGIAN INI ADA 👆👆👆

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState([]);
  const [donationBalance, setDonationBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- FUNGSI FETCH SEMUA DATA ---
  const fetchAllData = useCallback(async () => {
    try {
      const resProducts = await fetch("/api/products");
      const dataProducts = await resProducts.json();
      if (Array.isArray(dataProducts)) setProducts(dataProducts);

      const resOrders = await fetch("/api/orders");
      const dataOrders = await resOrders.json();
      if (Array.isArray(dataOrders)) setOrders(dataOrders);

      const resDonasi = await fetch("/api/donate");
      const dataDonasi = await resDonasi.json();
      setDonationBalance(dataDonasi.balance || 0);

      const resReservasi = await fetch("/api/reservations");
      const dataReservasi = await resReservasi.json();
      if (Array.isArray(dataReservasi)) setReservations(dataReservasi);

    } catch (err) {
      console.error("Gagal sinkronisasi data AdminContext:", err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchAllData();
      setIsLoading(false);
    };
    init();

    const interval = setInterval(() => {
        fetchAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  // --- ACTION: REFRESH MANUAL ---
  const refreshData = async () => {
    await fetchAllData();
  };

  // --- ACTION: UPDATE PRODUK ---
  const updateProduct = async (id: number | string, newData: { price?: number; stock?: number }) => {
    setProducts((prev) => 
      prev.map((p) => {
        const match = p._id === id || p.id === id;
        return match ? { ...p, ...newData } : p;
      })
    );

    try {
      await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...newData }),
      });
      refreshData(); 
    } catch (err) {
      console.error("Gagal update produk ke database");
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
        refreshData, // <--- WAJIB DI-EXPORT DISINI
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