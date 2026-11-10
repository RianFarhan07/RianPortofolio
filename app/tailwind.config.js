/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#c9a27a",
        primaryInLight: "#6c4830",
        bgDark: "#1b2119",
        bgDarkSection: "#151a13",
        bgLight: "#e2d6c6",
        gray: {
          50: "#f3ece1",
          100: "#ebe1d3",
          200: "#e2d6c6",
          300: "#d3c5b0",
          400: "#a89a84",
          500: "#7d725f",
          600: "#5b5848",
          700: "#3c4636",
          800: "#2a3326",
          900: "#1b2119",
        },
        blue: { 400: "#c9a27a", 500: "#6c4830" },
        indigo: { 400: "#a67c52", 500: "#4f3322" },
      },
      //buat warna nama ubah ubah
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        gradient: "gradient 8s linear infinite",
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};
