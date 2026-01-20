import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function WowTransition({ children }) {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [isPageTransition, setIsPageTransition] = useState(false);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    // Show intro animation
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        setIsInitialRender(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Handle page transitions
  useEffect(() => {
    if (isInitialRender) return;

    if (previousPathRef.current !== pathname) {
      setIsPageTransition(true);
      const timer = setTimeout(() => {
        setIsPageTransition(false);
      }, 2500);

      previousPathRef.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname, isInitialRender]);

  // Generate random particles for intro
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    rotation: Math.random() * 360,
  }));

  // Get page name for transition text
  const getPageName = () => {
    switch (pathname) {
      case "/":
        return "Home";
      case "/about":
        return "About";
      case "/projects":
        return "Projects";
      case "/certificates":
        return "Certificates";
      case "/contact":
        return "Contact";
      default:
        return "Loading...";
    }
  };

  // Get tagline based on current page
  const getTagline = () => {
    switch (pathname) {
      case "/":
        return "Welcome to my digital space";
      case "/about":
        return "Get to know me better";
      case "/projects":
        return "Explore my creative work";
      case "/certificates":
        return "My achievements & skills";
      case "/contact":
        return "Let's connect";
      default:
        return "Exploring...";
    }
  };

  // Personal brand elements
  const personalInfo = {
    name: "Baso Rian Farhan Mallanti",
    title: "FullStack Developer",
    origin: "Makassar, Indonesia",
    initials: "RF",
    tagline: "I build websites that just work — beautifully.",
    year: "2024",
    skills: ["React", "UI/UX", "Web", "Mobile"],
  };

  const transitionDuration = 2.5;

  return (
    <div className="relative overflow-hidden">
      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Initial Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro-animation"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 1.2, ease: "easeInOut" },
            }}
          >
            {/* Background */}
            <motion.div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-gradient-to-br from-cyan-900 via-cyan-800 to-blue-900"
                  : "bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* Animated particles for intro */}
            {particles.map((particle) => (
              <motion.div
                key={`intro-particle-${particle.id}`}
                className={`fixed rounded-full mix-blend-screen pointer-events-none ${
                  isDark ? "bg-cyan-300" : "bg-teal-300"
                }`}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  boxShadow: isDark
                    ? "0 0 15px 5px rgba(6, 182, 212, 0.3)"
                    : "0 0 15px 5px rgba(20, 184, 166, 0.3)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0.8, 0],
                  scale: [0, 1, 1, 0],
                  x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                  y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                  transition: {
                    times: [0, 0.2, 0.8, 1],
                    duration: 5,
                    delay: Math.random() * 0.7,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}

            {/* Logo/Initials */}
            <motion.div
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${
                isDark
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                  : "bg-gradient-to-r from-teal-500 to-teal-600"
              }`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1, 1, 0.9],
                opacity: [0, 1, 1, 1, 0],
                transition: {
                  duration: 3.5,
                  times: [0, 0.15, 0.25, 0.85, 1],
                  ease: "easeInOut",
                },
              }}
            >
              <span className="text-white text-3xl font-bold">
                {personalInfo.initials}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-white text-4xl md:text-6xl font-bold tracking-tight text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -10],
              }}
              transition={{
                duration: 3.5,
                times: [0, 0.2, 0.8, 1],
                delay: 0.3,
                ease: "easeOut",
              }}
              style={{
                textShadow: isDark
                  ? "0 0 20px rgba(6, 182, 212, 0.6)"
                  : "0 0 20px rgba(20, 184, 166, 0.6)",
              }}
            >
              {personalInfo.name}
            </motion.h1>

            {/* Title */}
            <motion.h2
              className="text-white text-xl md:text-2xl mt-2 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -10],
              }}
              transition={{
                duration: 3.5,
                times: [0, 0.2, 0.8, 1],
                delay: 0.5,
                ease: "easeOut",
              }}
            >
              {personalInfo.title}
            </motion.h2>

            {/* Origin */}
            <motion.div
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -10],
              }}
              transition={{
                duration: 3.5,
                times: [0, 0.2, 0.8, 1],
                delay: 0.7,
                ease: "easeOut",
              }}
            >
              <div className="w-1 h-1 rounded-full bg-white opacity-70"></div>
              <p className="text-white opacity-70">{personalInfo.origin}</p>
              <div className="w-1 h-1 rounded-full bg-white opacity-70"></div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-white text-lg mt-6 opacity-90 max-w-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -10],
              }}
              transition={{
                duration: 3.5,
                times: [0, 0.2, 0.8, 1],
                delay: 0.9,
                ease: "easeOut",
              }}
            >
              {personalInfo.tagline}
            </motion.p>

            {/* Skills */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3.5,
                times: [0, 0.2, 0.8, 1],
                delay: 1.1,
                ease: "easeInOut",
              }}
            >
              {personalInfo.skills.map((skill, index) => (
                <motion.span
                  key={`intro-skill-${index}`}
                  className={`px-3 py-1 rounded-full text-sm text-white ${
                    isDark ? "bg-cyan-500/30" : "bg-teal-500/30"
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1, 1, 0.8],
                  }}
                  transition={{
                    duration: 3.5,
                    times: [0, 0.2, 0.8, 1],
                    delay: 1.2 + index * 0.08,
                    ease: "easeOut",
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="absolute bottom-20 w-48 h-1 bg-white/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 3.5,
                times: [0, 0.2, 0.8, 1],
                delay: 1.3,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className={`h-full rounded-full ${
                  isDark
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                    : "bg-gradient-to-r from-teal-500 to-teal-600"
                }`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, delay: 1.5, ease: "easeInOut" }}
              />
            </motion.div>

            {/* "Entering portfolio..." text */}
            <motion.p
              className="absolute bottom-10 text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                times: [0, 0.2, 0.8, 1],
                duration: 3.5,
                delay: 1.5,
                ease: "easeInOut",
              }}
            >
              Entering portfolio...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW Apple-style Minimalist Page Transition */}
      <AnimatePresence mode="wait">
        {!isInitialRender && isPageTransition && (
          <>
            {/* Smooth Background Fade */}
            <motion.div
              key={`bg-fade-${pathname}`}
              className={`fixed inset-0 z-[100] ${
                isDark ? "bg-black" : "bg-white"
              }`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.2, 0.8, 1],
                ease: [0.43, 0.13, 0.23, 0.96], // Apple's signature easing
              }}
            />

            {/* Expanding Circle Reveal */}
            <motion.div
              key={`circle-reveal-${pathname}`}
              className="fixed inset-0 z-[99] flex items-center justify-center pointer-events-none overflow-hidden"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.7, 1],
              }}
            >
              <motion.div
                className={`rounded-full ${
                  isDark
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
                    : "bg-gradient-to-br from-gray-100 via-white to-gray-50"
                }`}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 30],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: transitionDuration * 0.9,
                  times: [0, 0.6, 1],
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                style={{
                  width: "100px",
                  height: "100px",
                }}
              />
            </motion.div>

            {/* Clean Typography - Page Name */}
            <motion.div
              key={`page-title-${pathname}`}
              className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
            >
              <motion.div className="text-center">
                <motion.h1
                  className={`text-6xl md:text-8xl font-light tracking-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [40, 0, 0, -20],
                    scale: [0.9, 1, 1, 0.95],
                  }}
                  transition={{
                    duration: transitionDuration,
                    times: [0, 0.25, 0.75, 1],
                    ease: [0.43, 0.13, 0.23, 0.96],
                  }}
                  style={{
                    fontWeight: 300,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {getPageName()}
                </motion.h1>

                {/* Subtle Underline */}
                <motion.div
                  className={`h-[2px] mx-auto mt-6 ${
                    isDark
                      ? "bg-gradient-to-r from-transparent via-white to-transparent"
                      : "bg-gradient-to-r from-transparent via-gray-900 to-transparent"
                  }`}
                  initial={{ width: "0%", opacity: 0 }}
                  animate={{
                    width: ["0%", "80%", "80%", "0%"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: transitionDuration,
                    times: [0, 0.3, 0.7, 1],
                    ease: [0.43, 0.13, 0.23, 0.96],
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Ambient Light Glow */}
            <motion.div
              key={`ambient-glow-${pathname}`}
              className="fixed inset-0 z-[98] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0.4, 0],
              }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.3, 0.7, 1],
              }}
            >
              <div
                className={`absolute inset-0 ${
                  isDark
                    ? "bg-gradient-radial from-cyan-500/20 via-transparent to-transparent"
                    : "bg-gradient-radial from-teal-500/20 via-transparent to-transparent"
                }`}
                style={{
                  background: isDark
                    ? "radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)"
                    : "radial-gradient(circle at center, rgba(20, 184, 166, 0.15) 0%, transparent 70%)",
                }}
              />
            </motion.div>

            {/* Floating Minimalist Dots */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`dot-${i}-${pathname}`}
                className={`fixed w-2 h-2 rounded-full z-[100] pointer-events-none ${
                  isDark ? "bg-white/40" : "bg-gray-900/30"
                }`}
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 0.6, 0.6, 0],
                  scale: [0, 1, 1, 0],
                  y: [0, -30, -60, -90],
                }}
                transition={{
                  duration: transitionDuration,
                  times: [0, 0.2, 0.7, 1],
                  delay: i * 0.08,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
              />
            ))}

            {/* Smooth Blur Layers */}
            <motion.div
              key={`blur-layer-${pathname}`}
              className="fixed inset-0 z-[97] pointer-events-none backdrop-blur-0"
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{
                backdropFilter: [
                  "blur(0px)",
                  "blur(20px)",
                  "blur(20px)",
                  "blur(0px)",
                ],
              }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.25, 0.75, 1],
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
