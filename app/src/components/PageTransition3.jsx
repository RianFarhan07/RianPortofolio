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

  // Generate random particles for logo explosion
  const logoParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / 30,
    distance: 100 + Math.random() * 150,
    size: Math.random() * 8 + 4,
  }));

  // Matrix-style code characters
  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
  const matrixColumns = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (i / 20) * 100,
    chars: Array.from(
      { length: 15 },
      () => matrixChars[Math.floor(Math.random() * matrixChars.length)],
    ),
  }));

  // Get page info
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
    <div className="relative overflow-hidden perspective-1000">
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

      {/* 🚀 NEW WOW FUTURISTIC TRANSITION */}
      <AnimatePresence mode="wait">
        {!isInitialRender && isPageTransition && (
          <>
            {/* Dark overlay background */}
            <motion.div
              key={`bg-${pathname}`}
              className="fixed inset-0 z-[100] bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.2, 0.8, 1],
              }}
            />

            {/* Cyber Grid Background */}
            <motion.div
              key={`grid-${pathname}`}
              className="fixed inset-0 z-[101] pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(${isDark ? "rgba(6, 182, 212, 0.1)" : "rgba(20, 184, 166, 0.1)"} 1px, transparent 1px),
                  linear-gradient(90deg, ${isDark ? "rgba(6, 182, 212, 0.1)" : "rgba(20, 184, 166, 0.1)"} 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.5, 0.5, 0],
                scale: [0.8, 1, 1, 1.2],
              }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.2, 0.7, 1],
              }}
            />

            {/* Matrix Code Rain */}
            <div className="fixed inset-0 z-[102] pointer-events-none overflow-hidden">
              {matrixColumns.map((column) => (
                <motion.div
                  key={`matrix-${column.id}-${pathname}`}
                  className="absolute top-0 flex flex-col"
                  style={{ left: `${column.x}%` }}
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{
                    y: ["100%", "100%"],
                    opacity: [0, 0.6, 0.6, 0],
                  }}
                  transition={{
                    duration: transitionDuration * 0.8,
                    delay: column.id * 0.05,
                    times: [0, 0.3, 0.7, 1],
                  }}
                >
                  {column.chars.map((char, i) => (
                    <span
                      key={i}
                      className={`text-xs font-mono ${
                        isDark ? "text-cyan-400" : "text-teal-400"
                      }`}
                      style={{
                        opacity: 1 - (i / column.chars.length) * 0.8,
                        textShadow: isDark
                          ? "0 0 5px rgba(6, 182, 212, 0.8)"
                          : "0 0 5px rgba(20, 184, 166, 0.8)",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* 3D Layered Panels with Depth */}
            {[0, 1, 2].map((layer) => (
              <motion.div
                key={`panel-${layer}-${pathname}`}
                className={`fixed inset-0 z-[${103 + layer}] pointer-events-none`}
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, rgba(6, 182, 212, ${0.3 - layer * 0.1}) 0%, rgba(59, 130, 246, ${0.3 - layer * 0.1}) 100%)`
                    : `linear-gradient(135deg, rgba(20, 184, 166, ${0.3 - layer * 0.1}) 0%, rgba(13, 148, 136, ${0.3 - layer * 0.1}) 100%)`,
                  transform: `translateZ(${layer * 50}px)`,
                }}
                initial={{ x: layer % 2 === 0 ? "-100%" : "100%", opacity: 0 }}
                animate={{
                  x: [
                    layer % 2 === 0 ? "-100%" : "100%",
                    "0%",
                    "0%",
                    layer % 2 === 0 ? "100%" : "-100%",
                  ],
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: transitionDuration,
                  times: [0, 0.3, 0.7, 1],
                  delay: layer * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Holographic Scan Lines */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`scanline-${i}-${pathname}`}
                className={`fixed left-0 right-0 h-0.5 z-[106] pointer-events-none ${
                  isDark ? "bg-cyan-400" : "bg-teal-400"
                }`}
                style={{
                  boxShadow: isDark
                    ? "0 0 10px 2px rgba(6, 182, 212, 0.8)"
                    : "0 0 10px 2px rgba(20, 184, 166, 0.8)",
                }}
                initial={{ top: `${i * 12.5}%`, opacity: 0 }}
                animate={{
                  top: [`${i * 12.5}%`, `${(i + 1) * 12.5}%`],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: transitionDuration * 0.4,
                  delay: i * 0.05,
                  repeat: 1,
                }}
              />
            ))}

            {/* Logo Explosion Effect */}
            <motion.div
              key={`logo-explode-${pathname}`}
              className="fixed top-1/2 left-1/2 z-[107] pointer-events-none"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              {/* Center Logo */}
              <motion.div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                    : "bg-gradient-to-r from-teal-500 to-teal-600"
                }`}
                style={{
                  boxShadow: isDark
                    ? "0 0 40px 10px rgba(6, 182, 212, 0.6)"
                    : "0 0 40px 10px rgba(20, 184, 166, 0.6)",
                }}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1, 0.8, 0],
                  rotate: [0, 180, 360, 540, 720],
                  opacity: [0, 1, 1, 0.8, 0],
                }}
                transition={{
                  duration: transitionDuration,
                  times: [0, 0.2, 0.4, 0.7, 1],
                }}
              >
                <span className="text-white text-2xl font-bold">
                  {personalInfo.initials}
                </span>
              </motion.div>

              {/* Exploding Particles from Logo */}
              {logoParticles.map((particle) => (
                <motion.div
                  key={`logo-particle-${particle.id}-${pathname}`}
                  className={`absolute w-2 h-2 rounded-full ${
                    isDark ? "bg-cyan-400" : "bg-teal-400"
                  }`}
                  style={{
                    top: "50%",
                    left: "50%",
                    boxShadow: isDark
                      ? "0 0 10px 2px rgba(6, 182, 212, 0.8)"
                      : "0 0 10px 2px rgba(20, 184, 166, 0.8)",
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: [
                      0,
                      Math.cos(particle.angle) * particle.distance * 0.5,
                      Math.cos(particle.angle) * particle.distance,
                      Math.cos(particle.angle) * particle.distance * 1.2,
                    ],
                    y: [
                      0,
                      Math.sin(particle.angle) * particle.distance * 0.5,
                      Math.sin(particle.angle) * particle.distance,
                      Math.sin(particle.angle) * particle.distance * 1.2,
                    ],
                    scale: [0, 1, 0.8, 0],
                    opacity: [0, 1, 0.6, 0],
                  }}
                  transition={{
                    duration: transitionDuration * 0.8,
                    times: [0, 0.3, 0.7, 1],
                    delay: 0.3 + particle.id * 0.02,
                  }}
                />
              ))}
            </motion.div>

            {/* Glitch Text Effect */}
            <motion.div
              key={`text-glitch-${pathname}`}
              className="fixed inset-0 z-[108] flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                {/* Main Text */}
                <motion.h1
                  className={`text-6xl md:text-8xl font-bold tracking-tight ${
                    isDark ? "text-cyan-400" : "text-teal-400"
                  }`}
                  style={{
                    textShadow: isDark
                      ? "0 0 20px rgba(6, 182, 212, 0.8)"
                      : "0 0 20px rgba(20, 184, 166, 0.8)",
                  }}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    y: [20, 0, 0, 0, -20],
                    filter: [
                      "blur(10px)",
                      "blur(0px)",
                      "blur(0px)",
                      "blur(0px)",
                      "blur(10px)",
                    ],
                  }}
                  transition={{
                    duration: transitionDuration,
                    times: [0, 0.3, 0.5, 0.7, 1],
                  }}
                >
                  {getPageName()}
                </motion.h1>

                {/* Glitch Layer 1 - Red */}
                <motion.h1
                  className="absolute top-0 left-0 text-6xl md:text-8xl font-bold tracking-tight text-red-500 opacity-70"
                  style={{ mixBlendMode: "screen" }}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{
                    x: [0, -3, 2, -2, 3, -1, 0],
                    opacity: [0, 0.7, 0, 0.7, 0, 0.7, 0],
                  }}
                  transition={{
                    duration: transitionDuration * 0.5,
                    times: [0, 0.2, 0.3, 0.5, 0.7, 0.9, 1],
                    delay: 0.2,
                  }}
                >
                  {getPageName()}
                </motion.h1>

                {/* Glitch Layer 2 - Blue */}
                <motion.h1
                  className="absolute top-0 left-0 text-6xl md:text-8xl font-bold tracking-tight text-blue-500 opacity-70"
                  style={{ mixBlendMode: "screen" }}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{
                    x: [0, 3, -2, 2, -3, 1, 0],
                    opacity: [0, 0.7, 0, 0.7, 0, 0.7, 0],
                  }}
                  transition={{
                    duration: transitionDuration * 0.5,
                    times: [0, 0.2, 0.3, 0.5, 0.7, 0.9, 1],
                    delay: 0.25,
                  }}
                >
                  {getPageName()}
                </motion.h1>

                {/* Tagline */}
                <motion.p
                  className={`text-xl mt-4 text-center ${
                    isDark ? "text-cyan-300" : "text-teal-300"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [20, 0, 0, -20],
                  }}
                  transition={{
                    duration: transitionDuration,
                    times: [0.1, 0.3, 0.7, 0.9],
                  }}
                >
                  {getTagline()}
                </motion.p>
              </div>
            </motion.div>

            {/* Hexagon Border Animation */}
            <motion.div
              key={`hexagon-${pathname}`}
              className="fixed top-1/2 left-1/2 z-[105] pointer-events-none"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <motion.div
                className={`w-[400px] h-[400px] border-4 ${
                  isDark ? "border-cyan-400" : "border-teal-400"
                }`}
                style={{
                  clipPath:
                    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                  boxShadow: isDark
                    ? "0 0 30px 5px rgba(6, 182, 212, 0.5)"
                    : "0 0 30px 5px rgba(20, 184, 166, 0.5)",
                }}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 2],
                  rotate: [0, 180, 360],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: transitionDuration,
                  times: [0, 0.5, 1],
                }}
              />
            </motion.div>

            {/* Digital Noise Overlay */}
            <motion.div
              key={`noise-${pathname}`}
              className="fixed inset-0 z-[109] pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E\")",
                opacity: 0.1,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.5, 1],
              }}
            />

            {/* Status Bar - Top */}
            <motion.div
              key={`status-top-${pathname}`}
              className={`fixed top-0 left-0 right-0 h-1 z-[110] ${
                isDark ? "bg-cyan-400" : "bg-teal-400"
              }`}
              style={{
                boxShadow: isDark
                  ? "0 0 10px 2px rgba(6, 182, 212, 0.8)"
                  : "0 0 10px 2px rgba(20, 184, 166, 0.8)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0] }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.3, 0.7, 1],
              }}
            />

            {/* Status Bar - Bottom */}
            <motion.div
              key={`status-bottom-${pathname}`}
              className={`fixed bottom-0 left-0 right-0 h-1 z-[110] ${
                isDark ? "bg-cyan-400" : "bg-teal-400"
              }`}
              style={{
                boxShadow: isDark
                  ? "0 0 10px 2px rgba(6, 182, 212, 0.8)"
                  : "0 0 10px 2px rgba(20, 184, 166, 0.8)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0] }}
              transition={{
                duration: transitionDuration,
                times: [0, 0.3, 0.7, 1],
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
