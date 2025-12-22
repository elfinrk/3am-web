/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F1E7",
        cocoa: {
          light: "#6A4A38",
          DEFAULT: "#52392C",
          dark: "#3F2C22",
          text: "#2B1F18",
          accent: "#361509"
        },
        cream: "#F3EDE2",
      },
      fontFamily: {
        // PERUBAHAN: Menggunakan font baru
        display: ["var(--font-playfair)", "serif"], // Untuk Judul
        body: ["var(--font-jakarta)", "sans-serif"], // Untuk Teks Biasa
      },
    },
  },
  plugins: [],
};