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
      }, 4000); // Intro animation lasts 4 seconds
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Handle page transitions
  useEffect(() => {
    // Skip the initial render - don't show transition animation
    if (isInitialRender) return;

    // Only trigger page transition animation if path changed
    if (previousPathRef.current !== pathname) {
      setIsPageTransition(true);
      const timer = setTimeout(() => {
        setIsPageTransition(false);
      }, 2500); // Match your transitionDuration

      // Update the previous path
      previousPathRef.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname, isInitialRender]);

  // Generate random particles
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

  // Personal brand elements - customize these with your own values
  const personalInfo = {
    name: "Baso Rian Farhan Mallanti", // Your full name
    title: "FullStack Developer", // Your professional title
    origin: "Makassar, Indonesia", // Your location/origin
    initials: "RF", // Replace with your initials
    tagline: "I build websites that just work — beautifully.", // Replace with your personal tagline
    year: "2024", // Current year or founding year
    skills: ["React", "UI/UX", "Web", "Mobile"], // Your key skills
  };

  // Increased duration for all animations
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
          transition={{ duration: 0.5 }} // Slightly increased
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

      {/* Wow transition effect */}
      <AnimatePresence mode="wait">
        {!isInitialRender && isPageTransition && (
          <>
            {/* 3D rotating cube */}
            <motion.div
              key={`cube-${pathname}`}
              className="fixed inset-0 w-full h-full z-50 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                transition: {
                  times: [0, 0.2, 0.8, 1],
                  duration: transitionDuration,
                },
              }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`w-[200vw] h-[200vh] ${
                  isDark
                    ? "bg-gradient-to-br from-cyan-500 via-cyan-400 to-blue-500"
                    : "bg-gradient-to-br from-teal-500 via-teal-400 to-teal-600"
                }`}
                initial={{
                  rotateX: 0,
                  rotateY: 0,
                  scale: 0,
                }}
                animate={{
                  rotateX: [0, 90, 180, 270, 360],
                  rotateY: [0, 90, 180, 270, 360],
                  scale: [0, 1.5, 1.5, 0],
                  transition: {
                    duration: transitionDuration,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              />
            </motion.div>

            {/* Personal Logo/Initials */}
            <motion.div
              key={`logo-${pathname}`}
              className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[60] pointer-events-none"
              initial={{ opacity: 0, y: -50 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [-50, 0, 0, -50],
                transition: {
                  times: [0, 0.3, 0.7, 1],
                  duration: transitionDuration,
                },
              }}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                    : "bg-gradient-to-r from-teal-500 to-teal-600"
                }`}
              >
                <span className="text-white text-xl font-bold">
                  {personalInfo.initials}
                </span>
              </div>
            </motion.div>

            {/* Transition Text */}
            <motion.div
              key={`text-${pathname}`}
              className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                transition: {
                  times: [0, 0.3, 0.7, 1],
                  duration: transitionDuration,
                },
              }}
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{
                  scale: [0.5, 1, 1, 0.5],
                  y: [50, 0, 0, -50],
                  transition: {
                    times: [0, 0.3, 0.7, 1],
                    duration: transitionDuration,
                  },
                }}
                className="relative text-center"
              >
                <motion.h1
                  className="text-white text-6xl md:text-8xl font-bold tracking-tight"
                  style={{
                    textShadow: isDark
                      ? "0 0 20px rgba(6, 182, 212, 0.6)" // cyan glow for dark mode
                      : "0 0 20px rgba(20, 184, 166, 0.6)", // teal glow for light mode
                  }}
                >
                  {getPageName()}
                </motion.h1>
                <motion.p
                  className="text-white text-xl mt-2 opacity-90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [20, 0, 0, -20],
                    transition: {
                      times: [0.1, 0.3, 0.7, 0.9],
                      duration: transitionDuration,
                    },
                  }}
                >
                  {getTagline()}
                </motion.p>
                <motion.div
                  className={`absolute -bottom-4 left-0 right-0 h-1 rounded-full ${
                    isDark ? "bg-cyan-400" : "bg-teal-400"
                  }`}
                  initial={{ width: 0, x: "-50%" }}
                  animate={{
                    width: ["0%", "100%", "100%", "0%"],
                    x: ["-50%", "-50%", "-50%", "-50%"],
                    transition: {
                      times: [0, 0.3, 0.7, 1],
                      duration: transitionDuration,
                    },
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Skill Tags */}
            <div className="fixed inset-0 z-[59] pointer-events-none flex items-center justify-center">
              {personalInfo.skills.map((skill, index) => (
                <motion.div
                  key={`skill-${index}-${pathname}`}
                  className={`absolute rounded-full px-3 py-1 text-xs font-medium text-white ${
                    isDark
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                      : "bg-gradient-to-r from-teal-500 to-teal-600"
                  }`}
                  style={{
                    top: `${30 + Math.random() * 40}%`,
                    left: `${20 + index * 15}%`,
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: -20 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1, 1, 0],
                    rotate: [-20, 0, 0, 20],
                    transition: {
                      times: [0.1, 0.3, 0.7, 0.9],
                      duration: transitionDuration,
                      delay: 0.1 + index * 0.1,
                    },
                  }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>

            {/* Signature Line */}
            <motion.div
              key={`signature-${pathname}`}
              className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[60] pointer-events-none"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [50, 0, 0, 50],
                transition: {
                  times: [0, 0.3, 0.7, 1],
                  duration: transitionDuration,
                },
              }}
            >
              <div className="text-white text-center">
                <p className="text-sm font-light">{personalInfo.tagline}</p>
                <p className="text-xs opacity-70">© {personalInfo.year}</p>
              </div>
            </motion.div>

            {/* Particles effect */}
            {particles.map((particle) => (
              <motion.div
                key={`particle-${particle.id}-${pathname}`}
                className={`fixed rounded-full mix-blend-screen pointer-events-none z-50 ${
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
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  rotate: [0, particle.rotation],
                  transition: {
                    duration: transitionDuration,
                    delay: Math.random() * 0.3,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}

            {/* Radial wave effect */}
            <motion.div
              key={`wave-${pathname}`}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.7, 0],
                transition: {
                  duration: transitionDuration,
                  ease: "easeInOut",
                },
              }}
            >
              <motion.div
                className={`w-10 h-10 rounded-full border-4 mix-blend-overlay ${
                  isDark ? "border-cyan-400" : "border-teal-400"
                }`}
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 15],
                  opacity: [1, 0],
                  transition: {
                    duration: transitionDuration * 0.8,
                    ease: "easeOut",
                  },
                }}
              />
            </motion.div>

            {/* Perspective panels */}
            <motion.div
              key={`panel-top-${pathname}`}
              className={`fixed top-0 left-0 w-full h-1/2 origin-bottom z-50 pointer-events-none ${
                isDark
                  ? "bg-gradient-to-b from-cyan-500 to-cyan-400"
                  : "bg-gradient-to-b from-teal-500 to-teal-400"
              }`}
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{
                rotateX: [90, 0, 0, 90],
                opacity: [0, 1, 1, 0],
                transition: {
                  times: [0, 0.3, 0.7, 1],
                  duration: transitionDuration,
                  ease: "easeInOut",
                },
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            />
            <motion.div
              key={`panel-bottom-${pathname}`}
              className={`fixed bottom-0 left-0 w-full h-1/2 origin-top z-50 pointer-events-none ${
                isDark
                  ? "bg-gradient-to-t from-blue-500 to-cyan-400"
                  : "bg-gradient-to-t from-teal-600 to-teal-400"
              }`}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{
                rotateX: [-90, 0, 0, -90],
                opacity: [0, 1, 1, 0],
                transition: {
                  times: [0, 0.3, 0.7, 1],
                  duration: transitionDuration,
                  ease: "easeInOut",
                },
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
