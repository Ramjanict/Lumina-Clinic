import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#122033",
        paper: "#F4F9FC",
        foam: "#E7F7F6",
        line: "#D5E4EE",
        clay: "#C4513E",
        clinic: {
          DEFAULT: "#0F9D96",
          dark: "#0B7C76",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
        serif: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 50px rgba(20, 36, 31, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
