/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e0a83a",
        primaryInLight: "#9c6a12",
        bgDark: "#0d1520",
        bgDarkSection: "#060d18",
        bgLight: "#f2f4f7",
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
