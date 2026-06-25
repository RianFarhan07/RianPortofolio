import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function PageTransition5Tech({ children }) {
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
      }, 3000);

      previousPathRef.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname, isInitialRender]);

  // Generate particles for intro
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    rotation: Math.random() * 360,
  }));

  // Generate matrix rain drops
  const matrixDrops = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (i * 100) / 30,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 0.5,
  }));

  // Generate grid lines
  const gridLines = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    isVertical: i % 2 === 0,
    position: (i / 12) * 100,
  }));

  // Generate scanning lines
  const scanLines = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    delay: i * 0.15,
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

  const getPageCode = () => {
    switch (pathname) {
      case "/":
        return "HOME.SYS";
      case "/about":
        return "ABOUT.EXE";
      case "/projects":
        return "PROJECTS.DAT";
      case "/certificates":
        return "CERTS.BIN";
      case "/contact":
        return "CONTACT.IO";
      default:
        return "LOAD.SYS";
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
      {/* Main content — render langsung tanpa AnimatePresence mode="wait".
          Wrapper opacity lama kadang nyangkut di opacity:0 saat ganti route
          (race framer-motion vs React Router) → halaman blank tanpa error.
          Transisi visual sudah ditangani overlay tech di bawah. */}
      {children}

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
              className={`absolute inset-0 bg-gradient-to-br from-[var(--ac-deep)] via-[var(--ac)] to-[var(--ac-deep)]`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {particles.map((particle) => (
              <motion.div
                key={`intro-particle-${particle.id}`}
                className={`fixed rounded-full mix-blend-screen pointer-events-none bg-[var(--ac)]`}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  boxShadow: "0 0 15px 5px rgba(var(--ac1), 0.3)",
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
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 bg-gradient-to-r from-[var(--ac)] to-[var(--ac-deep)]`}
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
                textShadow: "0 0 20px rgba(var(--ac1), 0.6)",
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
                  className={`px-3 py-1 rounded-full text-sm text-white bg-[rgba(var(--ac1),0.3)]`}
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
                className={`h-full rounded-full bg-gradient-to-r from-[var(--ac)] to-[var(--ac-deep)]`}
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

      {/* 🚀 NEW CINEMATIC TECH TRANSITION */}
      <AnimatePresence mode="wait">
        {!isInitialRender && isPageTransition && (
          <>
            {/* Background Blackout with Fade */}
            <motion.div
              key={`blackout-${pathname}`}
              className={`fixed inset-0 z-[100] pointer-events-none ${
                isDark ? "bg-black" : "bg-[#eaf4ef]"
              }`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                transition: {
                  times: [0, 0.15, 0.85, 1],
                  duration: transitionDuration,
                  ease: "easeInOut",
                },
              }}
            />

            {/* Cinematic Letterbox Bars */}
            <motion.div
              key={`letterbox-top-${pathname}`}
              className={`fixed top-0 left-0 w-full h-16 z-[101] pointer-events-none ${
                isDark ? "bg-black" : "bg-[var(--ac-deep)]"
              }`}
              initial={{ y: -64 }}
              animate={{
                y: [-64, 0, 0, -64],
                transition: {
                  times: [0, 0.2, 0.8, 1],
                  duration: transitionDuration,
                  ease: "easeInOut",
                },
              }}
            />
            <motion.div
              key={`letterbox-bottom-${pathname}`}
              className={`fixed bottom-0 left-0 w-full h-16 z-[101] pointer-events-none ${
                isDark ? "bg-black" : "bg-[var(--ac-deep)]"
              }`}
              initial={{ y: 64 }}
              animate={{
                y: [64, 0, 0, 64],
                transition: {
                  times: [0, 0.2, 0.8, 1],
                  duration: transitionDuration,
                  ease: "easeInOut",
                },
              }}
            />

            {/* Matrix Digital Rain Effect */}
            <div className="fixed inset-0 z-[102] pointer-events-none overflow-hidden">
              {matrixDrops.map((drop) => (
                <motion.div
                  key={`matrix-${drop.id}-${pathname}`}
                  className="absolute top-0 w-0.5"
                  style={{
                    left: `${drop.x}%`,
                    height: "100%",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    transition: {
                      times: [0, 0.2, 0.8, 1],
                      duration: transitionDuration,
                      ease: "linear",
                    },
                  }}
                >
                  <motion.div
                    className={`w-full h-32 bg-gradient-to-b from-transparent via-[var(--ac)] to-transparent`}
                    style={{
                      boxShadow: "0 0 10px 2px rgba(var(--ac1), 0.5)",
                    }}
                    initial={{ y: "-100%" }}
                    animate={{
                      y: ["- 100%", "100vh"],
                      transition: {
                        duration: drop.duration,
                        delay: drop.delay,
                        ease: "linear",
                        repeat: 2,
                      },
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* 3D Grid Background */}
            <motion.div
              key={`grid-bg-${pathname}`}
              className="fixed inset-0 z-[103] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.3, 0.3, 0],
                transition: {
                  times: [0, 0.2, 0.8, 1],
                  duration: transitionDuration,
                },
              }}
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(var(--ac1), 0.1) 0%, transparent 70%)",
              }}
            >
              {/* Perspective Grid Lines */}
              {gridLines.map((line) => (
                <motion.div
                  key={`grid-line-${line.id}-${pathname}`}
                  className={`absolute bg-[rgba(var(--ac1),0.2)]`}
                  style={
                    line.isVertical
                      ? {
                          left: `${line.position}%`,
                          top: 0,
                          width: "1px",
                          height: "100%",
                        }
                      : {
                          top: `${line.position}%`,
                          left: 0,
                          width: "100%",
                          height: "1px",
                        }
                  }
                  initial={{
                    opacity: 0,
                    scaleY: line.isVertical ? 0 : 1,
                    scaleX: line.isVertical ? 1 : 0,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scaleY: line.isVertical ? [0, 1, 1, 0] : 1,
                    scaleX: line.isVertical ? 1 : [0, 1, 1, 0],
                    transition: {
                      times: [0, 0.3, 0.7, 1],
                      duration: transitionDuration,
                      delay: line.id * 0.05,
                    },
                  }}
                />
              ))}
            </motion.div>

            {/* Holographic Scan Lines */}
            {scanLines.map((scan) => (
              <motion.div
                key={`scan-${scan.id}-${pathname}`}
                className={`fixed left-0 w-full h-1 z-[104] pointer-events-none bg-[rgba(var(--ac1),0.5)]`}
                style={{
                  boxShadow:
                    "0 0 20px 5px rgba(var(--ac1), 0.6), 0 0 40px 10px rgba(var(--ac1), 0.3)",
                }}
                initial={{ top: "0%", opacity: 0 }}
                animate={{
                  top: ["0%", "100%"],
                  opacity: [0, 1, 1, 0],
                  transition: {
                    times: [0, 0.3, 0.7, 1],
                    duration: transitionDuration * 0.8,
                    delay: scan.delay,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}

            {/* Central Hologram Frame */}
            <motion.div
              key={`holo-frame-${pathname}`}
              className="fixed inset-0 z-[105] flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                transition: {
                  times: [0, 0.2, 0.8, 1],
                  duration: transitionDuration,
                },
              }}
            >
              <motion.div
                className={`relative border-2 border-[var(--ac)]`}
                style={{
                  width: "80vw",
                  height: "60vh",
                  maxWidth: "800px",
                  boxShadow:
                    "0 0 30px rgba(var(--ac1), 0.5), inset 0 0 30px rgba(var(--ac1), 0.2)",
                }}
                initial={{ scale: 0, rotateY: -90 }}
                animate={{
                  scale: [0, 1.1, 1, 1, 0.9],
                  rotateY: [-90, 0, 0, 0, 90],
                  transition: {
                    times: [0, 0.25, 0.35, 0.75, 1],
                    duration: transitionDuration,
                    ease: "easeInOut",
                  },
                }}
              >
                {/* Corner Brackets */}
                {[
                  "top-0 left-0",
                  "top-0 right-0",
                  "bottom-0 left-0",
                  "bottom-0 right-0",
                ].map((position, i) => (
                  <motion.div
                    key={`bracket-${i}-${pathname}`}
                    className={`absolute w-8 h-8 ${position} border-[var(--ac)]`}
                    style={{
                      borderWidth:
                        i === 0
                          ? "2px 0 0 2px"
                          : i === 1
                            ? "2px 2px 0 0"
                            : i === 2
                              ? "0 0 2px 2px"
                              : "0 2px 2px 0",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 0],
                      transition: {
                        times: [0, 0.3, 0.7, 1],
                        duration: transitionDuration,
                        delay: i * 0.05,
                      },
                    }}
                  />
                ))}

                {/* Page Name with Glitch */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    transition: {
                      times: [0, 0.3, 0.7, 1],
                      duration: transitionDuration,
                    },
                  }}
                >
                  <div className="relative">
                    {/* Main Text */}
                    <motion.h1
                      className={`text-6xl md:text-8xl font-bold tracking-wider relative z-10 ${
                        isDark ? "text-white" : "text-[#0a1230]"
                      }`}
                      style={{
                        textShadow:
                          "0 0 30px rgba(var(--ac1), 0.8), 0 0 60px rgba(var(--ac1), 0.4)",
                        fontFamily: "monospace",
                      }}
                      initial={{ scale: 0.8, y: 20 }}
                      animate={{
                        scale: [0.8, 1, 1, 0.8],
                        y: [20, 0, 0, -20],
                        transition: {
                          times: [0, 0.3, 0.7, 1],
                          duration: transitionDuration,
                        },
                      }}
                    >
                      {getPageName()}
                    </motion.h1>

                    {/* Glitch Layers */}
                    <motion.h1
                      className="absolute inset-0 text-6xl md:text-8xl font-bold tracking-wider opacity-70"
                      style={{
                        color: "var(--ac)",
                        fontFamily: "monospace",
                        clipPath: "inset(0 0 0 0)",
                      }}
                      animate={{
                        x: [0, -3, 3, -2, 2, 0],
                        clipPath: [
                          "inset(0 0 0 0)",
                          "inset(20% 0 30% 0)",
                          "inset(60% 0 10% 0)",
                          "inset(10% 0 70% 0)",
                          "inset(0 0 0 0)",
                        ],
                        transition: {
                          duration: 0.3,
                          repeat: 3,
                          repeatDelay: 0.5,
                        },
                      }}
                    >
                      {getPageName()}
                    </motion.h1>

                    <motion.h1
                      className="absolute inset-0 text-6xl md:text-8xl font-bold tracking-wider opacity-70"
                      style={{
                        color: "var(--ac-deep)",
                        fontFamily: "monospace",
                        clipPath: "inset(0 0 0 0)",
                      }}
                      animate={{
                        x: [0, 3, -3, 2, -2, 0],
                        clipPath: [
                          "inset(0 0 0 0)",
                          "inset(40% 0 20% 0)",
                          "inset(10% 0 60% 0)",
                          "inset(70% 0 10% 0)",
                          "inset(0 0 0 0)",
                        ],
                        transition: {
                          duration: 0.3,
                          repeat: 3,
                          repeatDelay: 0.5,
                          delay: 0.15,
                        },
                      }}
                    >
                      {getPageName()}
                    </motion.h1>
                  </div>
                </motion.div>

                {/* Loading Bar Inside Frame */}
                <motion.div
                  className={`absolute bottom-8 left-8 right-8 h-1 overflow-hidden ${
                    isDark ? "bg-white/10" : "bg-black/10"
                  }`}
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
                    className={`h-full bg-gradient-to-r from-[var(--ac)] to-[var(--ac-deep)]`}
                    initial={{ width: "0%" }}
                    animate={{
                      width: "100%",
                      transition: {
                        duration: transitionDuration * 0.6,
                        delay: 0.3,
                        ease: "easeInOut",
                      },
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* HUD Elements - Top Right */}
            <motion.div
              key={`hud-tr-${pathname}`}
              className="fixed top-20 right-8 z-[106] pointer-events-none text-right"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [50, 0, 0, 50],
                transition: {
                  times: [0, 0.3, 0.7, 1],
                  duration: transitionDuration,
                },
              }}
            >
              <div
                className={`font-mono text-xs text-[var(--ac)]`}
              >
                <div className="mb-1">USER: {personalInfo.initials}</div>
                <div className="mb-1">
                  TIME: {new Date().toLocaleTimeString()}
                </div>
                <div>BUILD: {personalInfo.year}</div>
              </div>
            </motion.div>

            {/* Energy Pulse Waves */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={`pulse-${i}-${pathname}`}
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 z-[104] pointer-events-none border-[rgba(var(--ac1),0.3)]`}
                style={{
                  width: "100px",
                  height: "100px",
                }}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{
                  scale: [0, 8],
                  opacity: [0.8, 0],
                  transition: {
                    duration: 2,
                    delay: i * 0.3,
                    ease: "easeOut",
                  },
                }}
              />
            ))}

            {/* Radial Scan Effect */}
            <motion.div
              key={`radial-scan-${pathname}`}
              className="fixed inset-0 z-[104] pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                transition: {
                  times: [0, 0.5, 1],
                  duration: transitionDuration,
                },
              }}
            >
              <motion.div
                className="relative"
                style={{ width: "200px", height: "200px" }}
                animate={{
                  rotate: [0, 360],
                  transition: {
                    duration: 2,
                    ease: "linear",
                    repeat: 1,
                  },
                }}
              >
                <div
                  className={`absolute top-0 left-1/2 w-0.5 h-full origin-bottom bg-[var(--ac)]`}
                  style={{
                    boxShadow: "0 0 20px 3px rgba(var(--ac1), 0.8)",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Diagonal Wipe Effect */}
            <motion.div
              key={`wipe-${pathname}`}
              className={`fixed top-0 left-0 w-[200%] h-[200%] origin-top-left z-[107] pointer-events-none bg-gradient-to-br from-[rgba(var(--ac1),0.2)] to-[rgba(var(--ac-glow),0.2)]`}
              initial={{ x: "-100%", y: "-100%", rotate: 45 }}
              animate={{
                x: ["- 100%", "100%"],
                y: ["-100%", "100%"],
                transition: {
                  duration: transitionDuration * 0.6,
                  delay: 0.2,
                  ease: "easeInOut",
                },
              }}
            />

            {/* Bottom Status Text */}
            <motion.div
              key={`status-${pathname}`}
              className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[106] pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -20],
                transition: {
                  times: [0, 0.3, 0.7, 1],
                  duration: transitionDuration,
                },
              }}
            >
              <div className="text-center">
                <div
                  className={`font-mono text-sm mb-2 text-[var(--ac)]`}
                >
                  {getTagline()}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className={`w-2 h-2 rounded-full bg-[var(--ac)]`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                      transition: {
                        duration: 1,
                        repeat: 2,
                      },
                    }}
                  />
                  <span className="font-mono text-xs text-white/50">
                    INITIALIZING...
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
