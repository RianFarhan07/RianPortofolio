/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00adb5",
        primaryInLight: "#14b8a6",
        bgDark: "#222831",
        bgLight: "#f5f5f5",
      },
    },
  },
  plugins: [],
};
