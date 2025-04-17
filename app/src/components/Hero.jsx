"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import {
  ChevronDown,
  Linkedin,
  Mail,
  ArrowRight,
  Github,
  Download,
  Star,
  Code,
  Layout,
  Smartphone,
  Server,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import fotoRian from "../assets/foto_rian.jpg";

const TechBadge = ({ icon, text, delay, style }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`absolute flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-md ${
        isDark
          ? "bg-gray-800/80 text-primary border border-primary/30"
          : "bg-white/80 text-primaryInLight border border-primaryInLight/30"
      } shadow-lg`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { delay, type: "spring", stiffness: 100 },
      }}
      whileHover={{ scale: 1.05 }}
      style={style}
    >
      {icon}
      <span>{text}</span>
    </motion.div>
  );
};

// Optimized static particle component to reduce animation load
const Particle = ({ x, y, size, delay, isDark }) => {
  return (
    <div
      className={`absolute rounded-full ${
        isDark ? "bg-primary/40" : "bg-primaryInLight/40"
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: 0.1 + Math.random() * 0.3,
        willChange: "transform, opacity",
        animation: `float ${15 + delay}s infinite linear`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

export default function Hero() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  // Typed text effect
  const [text] = useTypewriter({
    words: [
      "Android Developer",
      "Web Developer",
      "UI/UX Designer",
      "Mobile Developer",
      "Fullstack Developer",
      "Frontend Developer",
      "Backend Developer",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  useEffect(() => {
    // Add CSS animation for particles to the document
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0% { transform: translate(0, 0); opacity: 0.1; }
        25% { transform: translate(10px, -15px); opacity: 0.3; }
        50% { transform: translate(20px, -25px); opacity: 0.2; }
        75% { transform: translate(10px, -10px); opacity: 0.3; }
        100% { transform: translate(0, 0); opacity: 0.1; }
      }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e) => {
      if (!containerRef.current || isMobile) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      setMousePosition({ x, y });
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };

    handleResize(); // Set initial value
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Set visibility after a short delay for initial animations
    const timer = setTimeout(() => setIsVisible(true), 500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
      document.head.removeChild(style);
    };
  }, [isMobile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: isDark
        ? "0 10px 25px rgba(0, 173, 181, 0.5)"
        : "0 10px 25px rgba(20, 184, 166, 0.5)",
    },
    tap: { scale: 0.95 },
  };

  // Generate static particles - reduced number for better performance
  const particles = [];
  const particleCount = isMobile ? 8 : 15; // Further reduce particles on mobile

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100, // percentage-based positioning
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    });
  }

  // Adjust tech badge positions for mobile
  const getTechBadgePosition = (position) => {
    if (isMobile) {
      // Mobile positions - keep badges closer to the profile image
      switch (position) {
        case "topLeft":
          return { top: "-10%", left: "10%" };
        case "topRight":
          return { top: "15%", right: "-10%" };
        case "bottomRight":
          return { bottom: "15%", right: "-5%" };
        case "bottomLeft":
          return { bottom: "-5%", left: "15%" };
        default:
          return position;
      }
    }

    // Desktop positions
    switch (position) {
      case "topLeft":
        return { top: "-15%", left: "20%" };
      case "topRight":
        return { top: "20%", right: "-15%" };
      case "bottomRight":
        return { bottom: "10%", right: "0%" };
      case "bottomLeft":
        return { bottom: "-5%", left: "25%" };
      default:
        return position;
    }
  };

  return (
    <motion.div
      id="home"
      className={`min-h-screen flex items-center relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-bgDark via-gray-800/50 to-bgDark"
          : "bg-gradient-to-br from-bgLight via-blue-50/50 to-bgLight"
      } py-16 md:py-0`} // Added padding for mobile
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      ref={containerRef}
    >
      {/* Animated background with gradient mesh */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 opacity-20 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        ></div>

        {/* Gradient blobs - simplified to use CSS instead of JS animation */}
        <div
          className={`absolute w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          } opacity-10`}
          style={{
            top: "10%",
            right: "5%",
            animation: "pulse 8s infinite ease-in-out",
          }}
        />

        <div
          className={`absolute w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          } opacity-10`}
          style={{
            bottom: "5%",
            left: "10%",
            animation: "pulse 8s infinite ease-in-out reverse",
          }}
        />

        {/* Static particles with CSS animations instead of JS animations */}
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            size={particle.size}
            delay={particle.delay}
            isDark={isDark}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 z-10">
        <motion.div
          className="grid md:grid-cols-2 gap-8 md:gap-10 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile image section - moved to top on mobile */}
          <motion.div
            className="order-1 md:order-2 flex justify-center"
            variants={itemVariants}
            style={{
              perspective: 1000,
            }}
          >
            <motion.div
              className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-96 md:h-96"
              style={{
                transformStyle: "preserve-3d",
                transform: isMobile
                  ? "none"
                  : `rotateY(${
                      mousePosition.x
                    }deg) rotateX(${-mousePosition.y}deg)`,
                willChange: "transform",
              }}
            >
              {/* Floating tech badges - Fixed positioning */}
              {isVisible && (
                <>
                  <TechBadge
                    icon={<Code size={16} />}
                    text="React"
                    delay={1.5}
                    style={getTechBadgePosition("topLeft")}
                  />
                  <TechBadge
                    icon={<Layout size={16} />}
                    text="UI/UX"
                    delay={2.0}
                    style={getTechBadgePosition("topRight")}
                  />
                  <TechBadge
                    icon={<Smartphone size={16} />}
                    text="Mobile"
                    delay={2.5}
                    style={getTechBadgePosition("bottomRight")}
                  />
                  <TechBadge
                    icon={<Server size={16} />}
                    text="Backend"
                    delay={3.0}
                    style={getTechBadgePosition("bottomLeft")}
                  />
                </>
              )}

              {/* Animated rings - Using CSS animations instead of JS */}
              <div
                className={`absolute rounded-full ${
                  isDark ? "border-primary" : "border-primaryInLight"
                } border-2 opacity-20`}
                style={{
                  width: "110%",
                  height: "110%",
                  top: "-5%",
                  left: "-5%",
                  transformStyle: "preserve-3d",
                  transform: "translateZ(-10px)",
                  animation: "spin 30s linear infinite",
                }}
              />

              <div
                className={`absolute rounded-full ${
                  isDark ? "border-blue-500" : "border-blue-400"
                } border-2 opacity-20`}
                style={{
                  width: "120%",
                  height: "120%",
                  top: "-10%",
                  left: "-10%",
                  transformStyle: "preserve-3d",
                  transform: "translateZ(-20px)",
                  animation: "spin 35s linear infinite reverse",
                }}
              />

              {/* Main profile image */}
              <div
                className={`absolute inset-0 rounded-full overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-br from-primary via-blue-500 to-purple-500"
                    : "bg-gradient-to-br from-primaryInLight via-blue-500 to-purple-400"
                } p-1.5`}
                style={{
                  animation: "pulse-shadow 3s ease-in-out infinite",
                }}
              >
                <div
                  className={`w-full h-full rounded-full p-0.5 backdrop-blur-sm bg-gradient-to-br ${
                    isDark
                      ? "from-white/10 to-black/30"
                      : "from-white/80 to-white/20"
                  }`}
                >
                  <img
                    src={fotoRian || "/placeholder.svg"}
                    alt="Rian Farhan"
                    className={`w-full h-full object-cover rounded-full transition-all duration-500 ${
                      isDark
                        ? "filter grayscale hover:grayscale-0"
                        : "filter grayscale-0"
                    }`}
                  />
                </div>
              </div>

              {/* Experience badge - repositioned for mobile */}
              <motion.div
                className={`absolute ${
                  isSmallMobile ? "-bottom-4 -right-3" : "-bottom-6 -right-6"
                } ${
                  isDark
                    ? "bg-gradient-to-r from-primary to-blue-500"
                    : "bg-gradient-to-r from-primaryInLight to-blue-500"
                } text-white rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl`}
                style={{
                  transform: "translateZ(30px)",
                  animation: "float-badge 4s ease-in-out infinite",
                }}
                initial={{ scale: 0, rotate: -10 }}
                animate={{
                  scale: 1,
                  transition: {
                    scale: { duration: 0.5, delay: 1 },
                  },
                }}
              >
                <span className="text-base sm:text-lg font-bold flex items-center gap-1">
                  <Star
                    size={isSmallMobile ? 14 : 16}
                    className="fill-yellow-300 text-yellow-300"
                  />
                  3+ Years
                </span>
                <span className="text-xs sm:text-sm opacity-90">
                  Experience
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text content section */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <motion.h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              } mb-3 md:mb-4`}
              variants={itemVariants}
            >
              Hello, I'm{" "}
              <span
                className={`${
                  isDark
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-primaryInLight to-blue-500"
                }`}
              >
                Rian Farhan
              </span>
            </motion.h1>

            <motion.div
              className={`text-lg sm:text-xl md:text-2xl ${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-4 md:mb-6 h-8 sm:h-12`}
              variants={itemVariants}
            >
              <span>I am a </span>
              <span
                className={`font-medium ${
                  isDark ? "text-primary" : "text-primaryInLight"
                }`}
              >
                {text}
              </span>
              <Cursor cursorColor={isDark ? "#00adb5" : "#14b8a6"} />
            </motion.div>

            <motion.p
              className={`${
                isDark ? "text-gray-400" : "text-gray-500"
              } mb-6 md:mb-8 max-w-lg mx-auto md:mx-0 text-base sm:text-lg`}
              variants={itemVariants}
            >
              Passionate about creating intuitive, responsive applications with
              clean code and optimal user experiences.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4"
              variants={itemVariants}
            >
              <motion.a
                href="#projects"
                className={`px-4 sm:px-6 py-2.5 sm:py-3 ${
                  isDark
                    ? "bg-gradient-to-r from-primary to-blue-500"
                    : "bg-gradient-to-r from-primaryInLight to-blue-600"
                } text-white rounded-lg font-medium flex items-center gap-2 group relative overflow-hidden shadow-lg text-sm sm:text-base`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View My Work
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
                <motion.span
                  className="absolute inset-0 w-0 bg-white/20"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>

              <motion.a
                href="#contact"
                className={`px-4 sm:px-6 py-2.5 sm:py-3 border-2 ${
                  isDark
                    ? "border-primary text-primary hover:bg-primary/10"
                    : "border-primaryInLight text-primaryInLight hover:bg-primaryInLight/10"
                } rounded-lg font-medium hover:text-white transition-colors relative overflow-hidden group text-sm sm:text-base`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="relative z-10">Contact Me</span>
                <motion.span
                  className={`absolute bottom-0 left-0 w-full h-0 ${
                    isDark ? "bg-primary" : "bg-primaryInLight"
                  } opacity-20 transition-all duration-300 group-hover:h-full`}
                />
              </motion.a>

              <motion.a
                href="rianCV.pdf"
                download="Rian_Farhan_CV.pdf"
                className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 ${
                  isDark
                    ? "bg-gray-800 text-primary hover:bg-gray-700"
                    : "bg-gray-100 text-primaryInLight hover:bg-gray-200"
                } rounded-lg font-medium transition-all relative overflow-hidden group shadow-md text-sm sm:text-base`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download
                    size={isSmallMobile ? 16 : 20}
                    className="animate-bounce"
                  />
                  <span className={isSmallMobile ? "hidden sm:inline" : ""}>
                    Download
                  </span>{" "}
                  CV
                </span>
                <motion.span
                  className={`absolute bottom-0 left-0 w-full h-0 ${
                    isDark ? "bg-primary" : "bg-primaryInLight"
                  } opacity-20 transition-all duration-300 group-hover:h-full`}
                  style={{ zIndex: 1, opacity: 0.2 }}
                />
              </motion.a>
            </motion.div>

            <motion.div
              className="flex gap-4 mt-6 md:mt-8 justify-center md:justify-start"
              variants={itemVariants}
            >
              <motion.a
                href="https://github.com/username"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full ${
                  isDark
                    ? "bg-gray-800 text-gray-400 hover:text-primary hover:border-primary"
                    : "bg-gray-200 text-gray-600 hover:text-primaryInLight hover:border-primaryInLight"
                } flex items-center justify-center transition-colors border-2 border-transparent`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={isSmallMobile ? 18 : 22} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/username"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full ${
                  isDark
                    ? "bg-gray-800 text-gray-400 hover:text-primary hover:border-primary"
                    : "bg-gray-200 text-gray-600 hover:text-primaryInLight hover:border-primaryInLight"
                } flex items-center justify-center transition-colors border-2 border-transparent`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={isSmallMobile ? 18 : 22} />
              </motion.a>
              <motion.a
                href="mailto:email@example.com"
                className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full ${
                  isDark
                    ? "bg-gray-800 text-gray-400 hover:text-primary hover:border-primary"
                    : "bg-gray-200 text-gray-600 hover:text-primaryInLight hover:border-primaryInLight"
                } flex items-center justify-center transition-colors border-2 border-transparent`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail size={isSmallMobile ? 18 : 22} />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator - hidden on very small screens */}
      <motion.div
        className={`absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 ${
          isSmallMobile ? "hidden" : "block"
        }`}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <motion.a
          href="#about"
          className={`flex flex-col items-center ${
            isDark
              ? "text-gray-400 hover:text-primary"
              : "text-gray-500 hover:text-primaryInLight"
          } transition-colors`}
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-xs sm:text-sm font-medium mb-1">
            Scroll Down
          </span>
          <motion.div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
              isDark ? "border-gray-700" : "border-gray-300"
            } border flex items-center justify-center`}
            animate={{
              boxShadow: [
                "0 0 0 rgba(255, 255, 255, 0)",
                "0 0 10px rgba(255, 255, 255, 0.3)",
                "0 0 0 rgba(255, 255, 255, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ChevronDown size={isSmallMobile ? 18 : 24} />
          </motion.div>
        </motion.a>
      </motion.div>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.15;
          }
        }

        @keyframes spin {
          from {
            transform: translateZ(-10px) rotate(0deg);
          }
          to {
            transform: translateZ(-10px) rotate(360deg);
          }
        }

        @keyframes pulse-shadow {
          0%,
          100% {
            box-shadow: 0 0 30px
              ${isDark ? "rgba(0, 173, 181, 0.6)" : "rgba(20, 184, 166, 0.6)"};
          }
          50% {
            box-shadow: 0 0 70px
              ${isDark ? "rgba(0, 173, 181, 0.4)" : "rgba(20, 184, 166, 0.4)"};
          }
        }

        @keyframes float-badge {
          0%,
          100% {
            transform: translateZ(30px) translateY(0px) rotate(-5deg);
          }
          50% {
            transform: translateZ(30px) translateY(-8px) rotate(0deg);
          }
        }

        /* Add media query for reducing animations on small screens */
        @media (max-width: 640px) {
          @keyframes pulse-shadow {
            0%,
            100% {
              box-shadow: 0 0 20px
                ${isDark ? "rgba(0, 173, 181, 0.5)" : "rgba(20, 184, 166, 0.5)"};
            }
            50% {
              box-shadow: 0 0 40px
                ${isDark ? "rgba(0, 173, 181, 0.3)" : "rgba(20, 184, 166, 0.3)"};
            }
          }
        }
      `}</style>
    </motion.div>
  );
}
