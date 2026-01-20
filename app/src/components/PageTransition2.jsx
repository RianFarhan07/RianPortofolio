import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function PageTransition2({ children }) {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [isPageTransition, setIsPageTransition] = useState(false);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        setIsInitialRender(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

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

  // Generate particles with more variety
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 15 + 5,
    delay: Math.random() * 0.3,
    duration: 1.5 + Math.random() * 1,
  }));

  // Liquid blobs for morphing effect
  const liquidBlobs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: (i % 4) * 25 + Math.random() * 15,
    y: Math.floor(i / 4) * 50 + Math.random() * 20,
    size: 150 + Math.random() * 100,
  }));

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

      {/* NEW LIQUID PORTAL PAGE TRANSITION */}
      <AnimatePresence mode="wait">
        {!isInitialRender && isPageTransition && (
          <>
            {/* Liquid morphing blobs background */}
            <motion.div
              key={`liquid-container-${pathname}`}
              className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {liquidBlobs.map((blob, index) => (
                <motion.div
                  key={`blob-${index}-${pathname}`}
                  className={`absolute rounded-full blur-3xl ${
                    isDark
                      ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600"
                      : "bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600"
                  }`}
                  style={{
                    left: `${blob.x}%`,
                    top: `${blob.y}%`,
                    width: `${blob.size}px`,
                    height: `${blob.size}px`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 1.8, 0],
                    opacity: [0, 0.6, 0.8, 0],
                    x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
                  }}
                  transition={{
                    duration: transitionDuration,
                    delay: index * 0.05,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>

            {/* Portal vortex effect */}
            <motion.div
              key={`portal-${pathname}`}
              className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`vortex-ring-${i}-${pathname}`}
                  className={`absolute rounded-full border-2 ${
                    isDark ? "border-cyan-300/30" : "border-teal-300/30"
                  }`}
                  style={{
                    width: `${100 + i * 80}px`,
                    height: `${100 + i * 80}px`,
                  }}
                  initial={{ scale: 0, opacity: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1.5, 2, 0],
                    opacity: [0, 0.8, 0.6, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: transitionDuration,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Center portal glow */}
              <motion.div
                className={`absolute w-40 h-40 rounded-full ${
                  isDark
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                    : "bg-gradient-to-r from-teal-400 to-teal-500"
                } blur-2xl`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 2, 0.5],
                  opacity: [0, 1, 0.8, 0],
                }}
                transition={{
                  duration: transitionDuration,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Flowing particles into portal */}
            <div className="fixed inset-0 z-[102] pointer-events-none">
              {particles.map((particle) => (
                <motion.div
                  key={`flow-particle-${particle.id}-${pathname}`}
                  className={`absolute rounded-full ${
                    isDark ? "bg-cyan-300" : "bg-teal-300"
                  }`}
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    boxShadow: isDark
                      ? "0 0 20px rgba(6, 182, 212, 0.6)"
                      : "0 0 20px rgba(20, 184, 166, 0.6)",
                  }}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1, 0.5, 0],
                    x: [0, (50 - particle.x) * 2, (50 - particle.x) * 3],
                    y: [0, (50 - particle.y) * 2, (50 - particle.y) * 3],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    ease: "easeIn",
                  }}
                />
              ))}
            </div>

            {/* Subtle initials watermark */}
            <motion.div
              key={`watermark-${pathname}`}
              className="fixed top-8 right-8 z-[105] pointer-events-none"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{
                opacity: [0, 0.3, 0.3, 0],
                scale: [0.8, 1, 1, 0.9],
                rotate: [-10, 0, 0, 10],
              }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut",
              }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm ${
                  isDark
                    ? "bg-cyan-500/20 border border-cyan-400/30"
                    : "bg-teal-500/20 border border-teal-400/30"
                }`}
              >
                <span className="text-white text-sm font-bold">
                  {personalInfo.initials}
                </span>
              </div>
            </motion.div>

            {/* Main page title with liquid morph */}
            <motion.div
              key={`title-${pathname}`}
              className="fixed inset-0 z-[106] flex items-center justify-center pointer-events-none"
            >
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.5, y: 100 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.1, 1, 0.8],
                  y: [100, -10, 0, -50],
                }}
                transition={{
                  duration: transitionDuration,
                  times: [0, 0.3, 0.6, 1],
                  ease: "easeOut",
                }}
              >
                <motion.h1
                  className="text-white text-6xl md:text-8xl font-bold tracking-tight relative"
                  style={{
                    textShadow: isDark
                      ? "0 0 40px rgba(6, 182, 212, 0.8), 0 0 80px rgba(6, 182, 212, 0.4)"
                      : "0 0 40px rgba(20, 184, 166, 0.8), 0 0 80px rgba(20, 184, 166, 0.4)",
                  }}
                >
                  {getPageName()}
                </motion.h1>

                {/* Liquid drip effect under title */}
                <motion.div
                  className={`absolute -bottom-4 left-1/2 w-2 h-20 rounded-full ${
                    isDark
                      ? "bg-gradient-to-b from-cyan-400 to-transparent"
                      : "bg-gradient-to-b from-teal-400 to-transparent"
                  }`}
                  initial={{ scaleY: 0, x: "-50%" }}
                  animate={{
                    scaleY: [0, 1, 1, 0],
                    opacity: [0, 1, 0.8, 0],
                  }}
                  transition={{
                    duration: transitionDuration,
                    times: [0.2, 0.5, 0.8, 1],
                  }}
                  style={{ transformOrigin: "top" }}
                />
              </motion.div>
            </motion.div>

            {/* Tagline with wave effect */}
            <motion.div
              key={`tagline-${pathname}`}
              className="fixed bottom-32 left-0 right-0 z-[106] flex justify-center pointer-events-none"
            >
              <motion.p
                className="text-white text-lg opacity-80"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: [0, 0.8, 0.8, 0],
                  y: [50, 0, 0, -30],
                }}
                transition={{
                  duration: transitionDuration,
                  times: [0.1, 0.4, 0.7, 1],
                  ease: "easeOut",
                }}
              >
                {getTagline()}
              </motion.p>
            </motion.div>

            {/* Ripple waves */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`ripple-${i}-${pathname}`}
                className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                  isDark ? "border-cyan-400/40" : "border-teal-400/40"
                }`}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{
                  width: ["0px", "800px", "1200px"],
                  height: ["0px", "800px", "1200px"],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: transitionDuration,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
                style={{ zIndex: 103 }}
              />
            ))}

            {/* Morphing gradient overlay */}
            <motion.div
              key={`gradient-overlay-${pathname}`}
              className={`fixed inset-0 z-[104] pointer-events-none ${
                isDark
                  ? "bg-gradient-to-br from-cyan-500/40 via-blue-600/40 to-cyan-700/40"
                  : "bg-gradient-to-br from-teal-500/40 via-teal-600/40 to-teal-700/40"
              }`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0.6, 0],
              }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
