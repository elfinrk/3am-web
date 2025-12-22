"use client";

import { useEffect, useState } from "react";
import { AdminProvider } from "./AdminContext"; 
import Link from "next/link";
import { 
  LayoutDashboard, ShoppingBag, CalendarRange, 
  Box, LogOut, Heart, Package, Settings, Lock,
  PlusCircle, Search
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!loggedIn && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // --- DAFTAR MENU SIDEBAR (Rute Donasi dikembalikan ke /donations) ---
  const menuNavigation = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Pesanan Offline", href: "/admin/offline-orders", icon: <PlusCircle size={20} /> },
    { name: "Pesanan Online", href: "/admin/online-orders", icon: <ShoppingBag size={20} /> },
    { name: "Data Reservasi", href: "/admin/reservations", icon: <CalendarRange size={20} /> },
    { name: "Stok & Menu", href: "/admin/stock", icon: <Box size={20} /> },
    { name: "Stock Merch", href: "/admin/merch-stock", icon: <Package size={20} /> },
    { name: "3.AM Care (Donasi)", href: "/admin/donations", icon: <Heart size={20} /> }, // Kembali ke /donations
  ];
  if (!isAuthorized && pathname !== "/admin/login") return null;

  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-[#F9F5E8] font-sans text-[#3E2723]">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-72 bg-[#3E2723] text-[#F3EDE2] flex flex-col fixed h-full z-50 shadow-2xl">
          <div className="p-8 border-b border-white/5 text-center">
            <h1 className="font-display font-bold text-2xl tracking-tighter text-white uppercase">3.AM ADMIN</h1>
            <div className="flex items-center justify-center gap-2 mt-2 opacity-30">
               <Lock size={10} />
               <p className="text-[9px] uppercase tracking-widest font-bold">Secure Session</p>
            </div>
          </div>

          <nav className="flex-1 p-5 space-y-2 overflow-y-auto custom-scrollbar">
            {menuNavigation.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  pathname === item.href 
                    ? "bg-[#F9F5E8] text-[#3E2723] font-bold shadow-xl translate-x-2" 
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="text-sm tracking-tight">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-white/5 space-y-3">
            <Link 
              href="/admin/settings" 
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all text-xs font-medium ${
                pathname === "/admin/settings" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
              }`}
            >
               <Settings size={16} /> Settings
            </Link>
            
            <button 
              onClick={() => {
                localStorage.removeItem("isAdminLoggedIn");
                router.push("/admin/login");
              }}
              className="w-full flex items-center gap-3 px-5 py-4 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white rounded-2xl transition-all text-sm font-bold"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 ml-72 flex flex-col min-h-screen">
          <header className="h-24 sticky top-0 z-40 px-10 flex items-center justify-between bg-[#F9F5E8]/80 backdrop-blur-md">
            {/* Breadcrumb sederhana atau indikator halaman */}
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {pathname.split("/").filter(Boolean).join(" / ")}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold leading-none text-[#3E2723] opacity-80">Admin Area</p>
                <div className="flex items-center justify-end gap-1.5 mt-1.5">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                   <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest">Online</p>
                </div>
              </div>
            </div>
          </header>

          <main className="px-10 pb-10 max-w-[1600px] w-full">
            {children}
          </main>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </AdminProvider>
  );
}