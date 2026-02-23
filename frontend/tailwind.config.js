/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
        },
      },
      keyframes: {
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-slide-up": "fadeSlideUp 0.5s ease-out forwards",
        "fade-slide-up-1": "fadeSlideUp 0.5s 0.1s ease-out both",
        "fade-slide-up-2": "fadeSlideUp 0.5s 0.25s ease-out both",
        "fade-slide-up-3": "fadeSlideUp 0.5s 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
