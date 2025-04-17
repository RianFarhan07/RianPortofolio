import React, { createContext, useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check if theme preference exists in localStorage
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark"; // Default to dark theme
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Apply theme class to document body
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  // Toggle theme function with transition
  const toggleTheme = () => {
    setIsTransitioning(true);

    // Delay the actual theme change to allow animation to start
    setTimeout(() => {
      setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    }, 300);

    // End the transition state after the animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  // Context value
  const value = {
    theme,
    toggleTheme,
    isTransitioning,
    isDark: theme === "dark",
  };

  // Generate random positions for particles that cover the whole screen
  const generateParticles = () => {
    return Array.from({ length: 30 }).map(() => ({
      initialX: "calc(100% - 3rem)",
      initialY: "3rem",
      targetX: `${Math.floor(Math.random() * 100)}vw`,
      targetY: `${Math.floor(Math.random() * 100)}vh`,
      size: Math.random() * 30 + 10,
      duration: Math.random() * 1.5 + 0.8,
      delay: Math.random() * 0.5,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  };

  // Generate particles once when transitioning starts
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isTransitioning) {
      setParticles(generateParticles());
    }
  }, [isTransitioning]);

  return (
    <ThemeContext.Provider value={value}>
      <AnimatePresence>
        {isTransitioning && (
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
              transition: { duration: 0.8, delay: 0.2 },
            }}
            transition={{ duration: 0.8 }}
            style={{
              background: theme === "dark" ? "#222831" : "#f5f5f5", // bgLight and bgDark values
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 180 }}
              exit={{ scale: 0, rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: "100px",
                  height: "100px",
                  background: theme === "dark" ? "#222831" : "#f5f5f5", // bgDark and bgLight values
                  boxShadow:
                    theme === "dark"
                      ? "0 0 20px rgba(0, 173, 181, 0.5)"
                      : "0 0 20px rgba(20, 184, 166, 0.5)", // primary and primaryInLight shadow
                }}
              >
                {theme === "dark" ? (
                  <motion.svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00adb5" // primary color
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, rotate: -30 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </motion.svg>
                ) : (
                  <motion.svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#14b8a6" // primaryInLight color
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, rotate: 30 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </motion.svg>
                )}
              </motion.div>
            </motion.div>

            {/* Fixed particles animation with better distribution */}
            <div className="absolute inset-0 overflow-hidden">
              {particles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  initial={{
                    x: particle.initialX,
                    y: particle.initialY,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: particle.targetX,
                    y: particle.targetY,
                    opacity: [0, 0.8, 0],
                    scale: [0, Math.random() * 3 + 1.5, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor:
                      theme === "dark"
                        ? "#00adb5" // primary
                        : "#14b8a6", // primaryInLight
                    opacity: particle.opacity,
                    boxShadow:
                      theme === "dark"
                        ? "0 0 15px rgba(0, 173, 181, 0.7)"
                        : "0 0 15px rgba(20, 184, 166, 0.7)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
