# Theme

## Compact token summary

- Framework styling: Tailwind CSS plus component-scoped CSS strings and global CSS variables.
- Primary dark background: `#08111f`; primary light background: `#f4f4f0`.
- Dark text: `#dce4ee`; light text: `#10233f`.
- Accent: ochre/gold, dark `#e0a83a`, light `#9c6a12`.
- Accent RGB triplets: `--ac1` and `--ac2`; glow token: `--ac-glow`.
- Display family: Syne; body family: DM Sans; technical labels: system monospace stack.
- Main cards use subtle 1px ochre borders, dark navy surfaces, 16–22px radii, and restrained shadows.
- Motion uses transform/opacity, cubic-bezier(.16,1,.3,1), one-time IntersectionObserver reveals, and reduced-motion fallbacks.
- Responsive breakpoints follow Tailwind defaults; the AboutPreview stacks at 860px.

## Global CSS

Path: `app/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* In your main CSS file (e.g., index.css) */
:root {
  /* Light theme variables */
  --bg-light: #f2f4f7;
  --text-light: #10233f;
  --accent-light: #9c6a12;

  /* Dark theme variables */
  --bg-dark: #0d1520;
  --text-dark: #e7edf5;
  --accent-dark: #e0a83a;

  /* Accent fallback (defaults to dark/blueprint until a theme class mounts) */
  --ac: #e0a83a;
  --ac-deep: #b8860b;
  --ac1: 224, 168, 58;
  --ac2: 184, 134, 11;
  --ac-glow: 224, 168, 58;
}

body.light-theme {
  background-color: #f2f4f7;
  color: var(--text-light);

  /* Accent â€” Blueprint Schematic (ochre revision-stamp on vellum) */
  --ac: #9c6a12; /* ochre accent (solid)        */
  --ac-deep: #7d5410; /* deep ochre (gradient stops) */
  --ac1: 156, 106, 18; /* ochre accent as rgb triplet */
  --ac2: 125, 84, 16; /* secondary / border rgb      */
  --ac-glow: 156, 106, 18;
}

body.dark-theme {
  background-color: #0d1520;
  color: var(--text-dark);

  /* Accent â€” Blueprint Schematic (brighter ochre for dark-navy contrast) */
  --ac: #e0a83a;
  --ac-deep: #b8860b;
  --ac1: 224, 168, 58;
  --ac2: 184, 134, 11;
  --ac-glow: 224, 168, 58;
}

/* Additional theme-specific styles */
.light-theme .special-element {
  background: linear-gradient(to right, #9c6a12, #7d5410);
}

.dark-theme .special-element {
  background: linear-gradient(to right, #b8860b, #e0a83a);
}

/* Sembunyikan scrollbar tetapi tetap bisa scroll */
html::-webkit-scrollbar {
  display: none;
}

html {
  scrollbar-width: none;
}

/* smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Sembunyikan cursor bawaan â€” dikelola oleh CustomCursor */
* {
  cursor: none !important;
}

/* Kembalikan cursor default untuk touch device (mobile) */
@media (hover: none) and (pointer: coarse) {
  * {
    cursor: auto !important;
  }
}
```
## Tailwind configuration

Path: `app/tailwind.config.js`

```js
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
```

## Theme provider

Path: `app/src/context/ThemeContext.jsx`

```jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  THEME SWITCH VARIANTS:
  "circle-expand"   : Circular clip-path from toggle â€” classic
  "horizontal-wipe" : Wipe leftâ†’right revealing new theme
*/

const VARIANT = "circle-expand"; // â† ganti: circle-expand | horizontal-wipe

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    setTimeout(
      () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      300,
    );
    setTimeout(() => setIsTransitioning(false), 1600);
  };

  const value = {
    theme,
    toggleTheme,
    isTransitioning,
    isDark: theme === "dark",
  };

  const particles = Array.from({ length: 20 }, () => ({
    tx: `${Math.floor(Math.random() * 100)}vw`,
    ty: `${Math.floor(Math.random() * 100)}vh`,
    size: Math.random() * 20 + 8,
    dur: Math.random() * 1.2 + 0.6,
    delay: Math.random() * 0.4,
    targetScale: Math.random() * 3 + 1.5,
  }));

  const transitionBg = theme === "dark" ? "#0d1520" : "#f2f4f7";

  return (
    <ThemeContext.Provider value={value}>
      <AnimatePresence>
        {isTransitioning && (
          <>
            {VARIANT === "circle-expand" && (
              <motion.div
                className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
                initial={{
                  opacity: 0,
                  clipPath: "circle(0% at calc(100% - 3rem) 3rem)",
                }}
                animate={{
                  opacity: 1,
                  clipPath: "circle(150% at calc(100% - 3rem) 3rem)",
                }}
                exit={{
                  opacity: 0,
                  clipPath: "circle(0% at calc(100% - 3rem) 3rem)",
                  transition: { duration: 0.7, delay: 0.2 },
                }}
                transition={{ duration: 0.8 }}
                style={{ background: transitionBg }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 180 }}
                  exit={{ scale: 0, rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: 100,
                      height: 100,
                      background: transitionBg,
                      boxShadow: "0 0 20px rgba(var(--ac1), 0.5)",
                    }}
                  >
                    {theme === "dark" ? (
                      <motion.svg
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--ac)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0, rotate: -30 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--ac)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0, rotate: 30 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </motion.svg>
                    )}
                  </div>
                </motion.div>
                <div className="absolute inset-0 overflow-hidden">
                  {particles.map((p, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      initial={{
                        x: "calc(100% - 3rem)",
                        y: "3rem",
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        x: p.tx,
                        y: p.ty,
                        opacity: [0, 0.8, 0],
                        scale: [0, p.targetScale, 0],
                      }}
                      transition={{
                        duration: p.dur,
                        delay: p.delay,
                        ease: "easeOut",
                      }}
                      style={{
                        width: p.size,
                        height: p.size,
                        background: "var(--ac)",
                        boxShadow: "0 0 15px rgba(var(--ac1), 0.7)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {VARIANT === "horizontal-wipe" && (
              <motion.div
                className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "100%", "100%", "0%"] }}
                exit={{ width: "0%" }}
                transition={{
                  duration: 1.2,
                  times: [0, 0.3, 0.7, 1],
                  ease: [0.83, 0, 0.17, 1],
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ width: "100vw", background: transitionBg }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ width: "100vw" }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(var(--ac1), 0.3)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <span className="text-2xl">
                      {theme === "dark" ? "â˜€" : "â˜¾"}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
```

## Package context

```json
{
  "name": "app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emailjs/browser": "^4.4.1",
    "@giscus/react": "^3.1.0",
    "emailjs": "^4.0.3",
    "framer-motion": "^11.18.2",
    "gsap": "^3.12.7",
    "lucide-react": "^0.488.0",
    "parallax-js": "^3.1.0",
    "particles.js": "^2.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-infinite-scroll-component": "^6.1.0",
    "react-infinite-scroll-hook": "^5.0.2",
    "react-intersection-observer": "^9.16.0",
    "react-lottie-player": "^2.1.0",
    "react-router-dom": "^7.5.0",
    "react-simple-typewriter": "^5.0.1",
    "react-tooltip": "^5.28.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.22.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react-swc": "^3.8.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.22.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "postcss": "^8.5.3",
    "sharp": "^0.35.2",
    "tailwindcss": "^3.4.17",
    "vite": "^6.3.0"
  }
}
```
