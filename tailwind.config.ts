import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          deep: "#4C1D95",
          royal: "#6D28D9",
          violet: "#7C3AED",
          lavender: "#EDE9FE",
          orchid: "#A78BFA",
          white: "#FFFFFF",
          rosegold: "#B76E79",
          softgold: "#D4AF37",
          blush: "#FCE7F3",
          ink: "#1F1630",
          muted: "#6B5B7B",
          success: "#059669",
          warning: "#D97706",
          error: "#DC2626",
        },
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        script: ["var(--font-great-vibes)", "cursive"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(109, 40, 217, 0.08), 0 4px 6px -2px rgba(109, 40, 217, 0.04)",
        glow: "0 0 25px rgba(124, 58, 237, 0.25)",
        gold: "0 4px 20px -2px rgba(212, 175, 55, 0.3)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
