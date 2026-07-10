import React, { createContext, useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  THEME SWITCH VARIANTS:
  "circle-expand"   : Circular clip-path from toggle — classic
  "horizontal-wipe" : Wipe left→right revealing new theme
*/

const VARIANT = "circle-expand"; // ← ganti: circle-expand | horizontal-wipe

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
                      {theme === "dark" ? "☀" : "☾"}
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
