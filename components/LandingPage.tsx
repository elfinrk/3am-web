"use client";

import Image from "next/image";
import Link from "next/link"; // Import Link untuk navigasi
import { Facebook, Instagram, Twitter, ArrowRight } from "lucide-react"; 

// --- Data Dummy ---
const signatureDrinks = [
  {
    name: "3.AM Caramel Nightfall",
    desc: "Iced caramel latte with smooth foam and mellow roasted sweetness.",
    img: "/3.AM Caramel Nightfall.png" 
  },
  {
    name: "3.AM Moonlit Matcha Waves",
    desc: "Iced matcha latte with silky swirls and a clean earthy taste.",
    img: "/3.AM Moonlit Matcha Waves.png"
  },
  {
    name: "3.AM Midnight Black Swirl",
    desc: "Iced strong coffee with smooth cream and bold midnight swirls.",
    img: "/3.AM Midnight Black Swirl.png"
  },
];

const feedbacks = [
  { quote: "Ambience-nya enak banget buat nugas sampe pagi", name: "Bob Alrafi", role: "Mahasiswa", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" },
  { quote: "Kalo lagi mepet deadline, ini tempat penyelamat.", name: "Fidya Sahwa", role: "Software Engineer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
  { quote: "Tempatnya cozy abis, enak buat nongkrong.", name: "Natan Pratama", role: "Mahasiswa", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
];

// --- Konfigurasi Link Navigasi ---
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Full Menu", href: "/menu" },
  { name: "Our Story", href: "/story" }, // Pindah ke halaman Story
  { name: "3.AM Merch", href: "/merch" }, // Pindah ke halaman Merch
  { name: "Donate", href: "/donate" },   // Pindah ke halaman Donate
];

export default function LandingPage() {
  return (
    <div className="w-full bg-paper overflow-x-hidden font-body text-[#1A1A1A]">
      
      {/* GLOBAL STYLES UNTUK ANIMASI */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>

      {/* ================= 1. NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full bg-[#F3EDE2]/95 backdrop-blur-sm border-b border-[#E5DCC5]">
        <div className="container mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/Logo.png" alt="3AM Logo" width={100} height={100} className="w-20 h-20 md:w-24 md:h-24 object-contain" />
          </Link>
          
          {/* NAVIGASI: Semua item menggunakan Link */}
          <nav className="hidden md:flex items-center gap-2 text-sm md:text-base font-medium text-[#52392C]">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#361509] hover:text-white relative group"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Tombol Order Online -> Ke Menu */}
            <Link href="/online" className="hidden md:block px-6 py-2.5 bg-[#361509] text-white text-sm font-bold rounded-lg hover:bg-[#2a1007] transition shadow-md text-center">
              Order Online
            </Link>
            {/* Tombol Reservation -> Ke Halaman Reservation */}
            <Link href="/reservation" className="hidden md:block px-6 py-2.5 bg-transparent text-[#52392C] border-2 border-[#52392C] text-sm font-bold rounded-full hover:bg-[#52392C] hover:text-white transition text-center">
              Reservation
            </Link>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section id="home" className="relative bg-paper bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] overflow-hidden min-h-[85vh] flex items-start pt-8 md:pt-4">
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none leading-none">
          <Image src="/beans.png" alt="Beans" width={1920} height={300} className="w-full h-auto object-cover" />
        </div>
        
        <div className="container mx-auto px-6 relative z-30 flex flex-col md:flex-row pb-20">
          <div className="w-full md:w-1/2 z-30 relative flex flex-col items-start md:pl-12">
            <p className="font-body font-bold text-lg md:text-xl text-[#6A4A38] mb-4 tracking-wide uppercase">Open 9am - 3am Everyday</p>
            <h1 className="font-display font-bold text-5xl md:text-7xl text-[#2B1F18] leading-tight mb-8 tracking-tight drop-shadow-sm">
              FOR THE <br/>SLEEPLESS<br /><span className="text-[#6F4E37] italic">AND DREAMERS</span>
            </h1>
            {/* Tombol Order Ahead -> Ke Menu */}
            <Link href="/menu" className="px-8 py-3.5 bg-[#361509] text-white text-base md:text-lg font-bold rounded-lg hover:bg-[#2a1007] transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2 group">
               Order Ahead <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-center relative mt-12 md:mt-0 z-30 md:-ml-16">
            <div className="absolute -top-32 -left-20 md:-top-40 md:-left-40 w-[500px] h-[500px] md:w-[850px] md:h-[850px] opacity-10 z-0 pointer-events-none">
              <Image src="/Logo.png" alt="Watermark" fill className="object-contain" />
            </div>
            <div className="absolute bottom-0 md:-bottom-4 right-0 md:right-10 w-[200px] h-[40px] md:w-[400px] md:h-[80px] bg-black/20 blur-2xl rounded-[100%] z-0"></div>
            <Image src="/coffeecup-1.png" alt="Coffee Cup" width={550} height={400} className="relative z-10 w-[75%] md:w-[90%] max-w-[550px] object-contain drop-shadow-xl cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:-rotate-6 hover:drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]" priority />
          </div>
        </div>
      </section>

      {/* ================= 3. SIGNATURE DRINKS ================= */}
      <section id="full-menu" className="py-24 bg-[#2E1C16] relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none text-[#F3EDE2] opacity-[0.07]">
          <svg width="100%" height="100%">
            <defs>
                <pattern id="coffee-bean-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                    <path d="M50 15 C 30 15, 15 35, 15 55 C 15 75, 30 95, 50 95 C 70 95, 85 75, 85 55 C 85 35, 70 15, 50 15 Z M 50 25 C 65 25, 75 40, 75 55 C 75 70, 65 85, 50 85 C 35 85, 25 70, 25 55 C 25 40, 35 25, 50 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 50 25 Q 40 55 50 85" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#coffee-bean-pattern)"></rect>
          </svg>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-display font-bold text-5xl mb-16 tracking-wide text-[#F3EDE2]">Signature Drinks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {signatureDrinks.map((drink, idx) => (
              <Link href="/menu" key={idx} className="group relative h-[480px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#F6E6D0] block">
                {/* Layer Gambar */}
                <div className="absolute inset-0 flex items-center justify-center p-6 transition-all duration-700 group-hover:scale-90 group-hover:opacity-40">
                   <div className="relative w-full h-full">
                     <Image 
                        src={drink.img} 
                        alt={drink.name} 
                        fill 
                        className="object-contain drop-shadow-md transition-transform duration-700 group-hover:scale-110" 
                     />
                   </div>
                </div>
                {/* Layer Overlay */}
                <div className="absolute inset-0 bg-[#2E1C16]/85 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center z-20">
                   <h3 className="font-display font-bold text-3xl text-white drop-shadow-md mb-4 translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-100">{drink.name}</h3>
                   <p className="text-white/95 text-lg leading-relaxed font-medium mb-2 translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-200 line-clamp-4 drop-shadow-sm">{drink.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. CHEESEMELT SECTION ================= */}
      <section className="py-24 bg-[#F9F5E8] relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] bg-repeat"
          style={{ backgroundImage: "url('/bread-pattern.jpeg')", backgroundSize: "400px" }}
        ></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full md:w-1/2 space-y-8 text-left md:pl-12 lg:pl-24">
            <span className="text-[#361509] font-bold tracking-widest uppercase text-sm md:text-base">Pastries & Savory Bites</span>
            <h2 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-[#361509] leading-tight">3AM Cheesemelt</h2>
            <p className="text-[#361509] leading-relaxed text-xl md:text-2xl font-medium max-w-2xl">
              A comforting late-night treat made with crisp artisan bread and a smooth layer of slow-melted cheese. Finished with a gentle touch of garlic butter, it delivers a warm, velvety richness perfect on its own or paired with your favorite brew.
            </p>
            <div className="pt-8">
              {/* TOMBOL ORDER NOW -> PINDAH KE MENU */}
              <Link href="/menu" className="inline-block px-10 py-5 bg-[#361509] text-white font-bold text-xl rounded-2xl hover:bg-[#2c1b18] transition-all shadow-md hover:shadow-xl hover:-translate-y-1">
                Rp25.000 | Order Now →
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center mt-16 md:mt-0">
             <div className="relative w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] group perspective-1000">
               {/* Efek Cahaya Belakang */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#E5DCC5] rounded-full blur-[60px] opacity-60 animate-glow z-0"></div>
               {/* Gambar dengan Animasi */}
               <div className="relative w-full h-full animate-float z-10 transition-transform duration-700 ease-in-out hover:rotate-2 hover:scale-105">
                 <Image src="/cheese.png" alt="3AM Cheesemelt Toast" fill className="object-contain drop-shadow-2xl" />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ================= 5. OUR STORY ================= */}
      <section id="our-story" className="py-32 bg-[#3F2C22] text-[#F3EDE2] relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 lg:gap-24 relative z-10">
          
          <div className="w-full md:w-1/2">
            <div className="relative w-full aspect-square md:aspect-[5/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#52392C]">
              <Image src="/Store.png" alt="03:00AM Storefront" fill className="object-cover" />
            </div>
          </div>

          <div className="w-full md:w-1/2 text-left">
            <h2 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-8 text-[#F3EDE2]">
              Where the night feels alive,<br/> and every cup holds a story.
            </h2>
            <p className="text-[#F3EDE2]/80 text-xl leading-relaxed mb-10 font-light max-w-xl">
              Every corner of 03:00AM is designed to feel gentle and inviting — the dim glow, 
              the fresh scent of coffee, the soft music, and a seat that feels like it’s saying, 
              "hey, take your time here."
            </p>
            
            {/* TOMBOL READ OUR STORY -> PINDAH KE HALAMAN STORY */}
            <Link href="/story" className="inline-block px-10 py-4 bg-[#F3EDE2] text-[#3F2C22] font-bold text-lg rounded-xl hover:bg-white transition shadow-lg hover:-translate-y-1">
              Read Our Story →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 6. FEEDBACK ================= */}
      <section className="py-24 bg-paper bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        <div className="container mx-auto px-6">
          <h2 className="font-display font-bold text-5xl text-[#2B1F18] mb-16 text-center">What They Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbacks.map((item, idx) => (
              <div key={idx} className="bg-paper/60 backdrop-blur-sm border border-[#E5DCC5] p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-transform duration-300">
                <div className="text-yellow-500 mb-6 text-xl">★★★★★</div>
                <p className="text-lg font-display font-bold italic text-[#2B1F18] mb-6 leading-relaxed">"{item.quote}"</p>
                <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden"><Image src={item.avatar} alt={item.name} fill className="object-cover" /></div>
                  <div><p className="font-bold text-[#2B1F18] text-base">{item.name}</p><p className="text-gray-500 text-xs">{item.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. FOOTER ================= */}
      <footer className="bg-paper bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pt-16 pb-0 border-t border-[#E5DCC5]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12 pb-8">
          <div className="space-y-4 text-sm text-[#2B1F18]">
            <div className="flex items-center gap-3 mb-6"><Image src="/Logo.png" alt="Logo" width={40} height={40} /><span className="font-display font-bold text-2xl">3.AM</span></div>
            <p className="font-light">Permata Buah Batu, Bojongsoang<br/>Bandung 40257</p>
            <p className="font-bold">+62 895-3249-47770</p>
          </div>
          <div className="flex gap-4 self-center md:self-start">
            <a href="#" className="p-3 bg-white border border-[#E5DCC5] rounded-full hover:bg-[#361509] hover:text-white transition hover:border-[#361509]"><Facebook size={18}/></a>
            <a href="#" className="p-3 bg-white border border-[#E5DCC5] rounded-full hover:bg-[#361509] hover:text-white transition hover:border-[#361509]"><Instagram size={18}/></a>
            <a href="#" className="p-3 bg-white border border-[#E5DCC5] rounded-full hover:bg-[#361509] hover:text-white transition hover:border-[#361509]"><Twitter size={18}/></a>
          </div>
        </div>
        <div className="w-full relative h-auto z-10"><Image src="/beans.png" alt="Beans Footer" width={1920} height={300} className="w-full h-auto object-cover block"/></div>
        <div className="bg-[#1A1A1A] text-white py-4 text-center text-xs font-light">© 2025 3.AM Coffee. For the sleepless and the dreamers.</div>
      </footer>
    </div>
  );
}