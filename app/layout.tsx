import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
// Impor AdminProvider agar data tersinkronisasi di seluruh aplikasi
import { AdminProvider } from "./admin/AdminContext"; 

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "3AM Coffee",
  description: "For the sleepless and the dreamers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-body antialiased">
        {/* Membungkus aplikasi dengan AdminProvider agar Landing Page & Admin bisa sinkron */}
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}