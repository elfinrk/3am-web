"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  // --- 1. DEFINISI STATE ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // --- 2. LOGIKA LOGIN TUNGGAL ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Cek kredensial utama
    if (username === "3amAdmin" && password === "elfinganteng") {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminName", "Super Admin"); 
      router.push("/admin");
    } else {
      setErrorMsg("Akses ditolak. Username atau Password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EDE2] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-[#E5DCC5] relative overflow-hidden">
        
        {/* Dekorasi Estetik */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3E2723]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 bg-[#3E2723] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">3</div>
          </div>
          <h1 className="text-3xl font-bold text-[#3E2723]">Admin Portal</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Pesan Error */}
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-[10px] p-4 rounded-xl border border-red-100 font-bold text-center uppercase tracking-wider">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase ml-4 opacity-40 tracking-widest text-[#3E2723]">Username</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#F3EDE2]/50 border border-[#E5DCC5] rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:border-[#3E2723] transition-all font-medium text-[#3E2723] placeholder:opacity-30" 
                placeholder="Username admin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase ml-4 opacity-40 tracking-widest text-[#3E2723]">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F3EDE2]/50 border border-[#E5DCC5] rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:border-[#3E2723] transition-all font-medium text-[#3E2723] placeholder:opacity-30" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-[#3E2723] text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-[#5D4037] transition-all flex justify-center items-center gap-3 active:scale-95 shadow-[#3E2723]/20"
          >
            Masuk Sekarang <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}