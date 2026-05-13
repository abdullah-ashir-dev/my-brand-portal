// ============================================================
// FILE: tailwind.config.js  (project ROOT)
// PURPOSE: Customize Tailwind — adds our gold color so we can
//   write class="text-gold" or "bg-gold" anywhere in the app
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where to look for class names to include
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ✅ Our custom gold color — use as: text-gold, bg-gold, border-gold
      colors: {
        gold: {
          DEFAULT: "#d4af37",  // Main gold
          light: "#f0d060",    // Lighter gold (for hover states)
          dark: "#a88a1a",     // Darker gold (for pressed states)
        },
        dark: {
          DEFAULT: "#0a0a0a",  // Main background
          card: "#111111",     // Card background
          border: "#1e1e1e",   // Borders
          muted: "#2a2a2a",    // Muted surfaces
        }
      },
      // ✅ Custom font — we'll use this for headings
      fontFamily: {
        display: ["'Cinzel'", "serif"],   // Gold/premium font for headings
        body: ["'Inter'", "sans-serif"],  // Clean font for body text
      },
      // ✅ Custom animations
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
