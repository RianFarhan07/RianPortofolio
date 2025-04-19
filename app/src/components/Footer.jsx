import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Github,
  Linkedin,
  Mail,
  Heart,
  ArrowUp,
  Twitter,
  Instagram,
  Code,
  Sparkles,
} from "lucide-react";
import Parallax from "parallax-js";
import Lottie from "react-lottie-player";
import scrollAnimation from "../assets/scrollAnimation.json";
import { Tooltip } from "react-tooltip";

export default function Footer() {
  const { theme } = useTheme();
  const particlesRef = useRef(null);
  const parallaxSceneRef = useRef(null);
  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const controls = useAnimation();
  const [particlesLoaded, setParticlesLoaded] = useState(false);

  const currentYear = new Date().getFullYear();

  // Improved parallax initialization
  useEffect(() => {
    if (parallaxSceneRef.current) {
      // Destroy any existing instance first
      if (parallaxSceneRef.current.parallaxInstance) {
        parallaxSceneRef.current.parallaxInstance.destroy();
      }

      // Create new instance with better settings
      const parallaxInstance = new Parallax(parallaxSceneRef.current, {
        relativeInput: true,
        clipRelativeInput: false, // Allow elements to move more freely
        hoverOnly: false, // Make parallax respond to device movement too
        scalarX: 5, // Increase movement on X axis significantly
        scalarY: 5, // Increase movement on Y axis significantly
      });

      // Store the instance for cleanup
      parallaxSceneRef.current.parallaxInstance = parallaxInstance;

      return () => {
        if (parallaxSceneRef.current?.parallaxInstance) {
          parallaxSceneRef.current.parallaxInstance.destroy();
        }
      };
    }
  }, [theme]); // Re-initialize when theme changes

  useEffect(() => {
    // Show back to top button only when scrolled down
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Improved particles.js initialization
  useEffect(() => {
    // Load particles.js if not already loaded
    if (typeof window !== "undefined" && !window.particlesJS) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.async = true;
      script.onload = () => {
        setParticlesLoaded(true);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else if (window.particlesJS) {
      setParticlesLoaded(true);
    }
  }, []);

  // Initialize particles when loaded and when theme changes
  useEffect(() => {
    if (!particlesLoaded || !particlesRef.current) return;

    // Clear any existing particles
    if (window.pJSDom && window.pJSDom.length) {
      window.pJSDom.forEach((dom) => {
        if (dom && dom.pJS && dom.pJS.fn && dom.pJS.fn.vendors) {
          dom.pJS.fn.vendors.destroypJS();
        }
      });
      window.pJSDom = [];
    }

    const particlesConfig = {
      particles: {
        number: {
          value: 40, // More particles
          density: { enable: true, value_area: 800 },
        },
        color: { value: isDark ? "#00adb5" : "#14b8a6" },
        opacity: {
          value: 0.7, // Increased opacity further
          random: true,
          anim: {
            enable: true,
            speed: 0.5,
            opacity_min: 0.3,
            sync: false,
          },
        },
        size: {
          value: 8, // Larger size for better visibility
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 2,
            sync: false,
          },
        },
        line_linked: {
          enable: true, // Enable links between particles for better visual effect
          distance: 150,
          color: isDark ? "#00adb5" : "#14b8a6",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2, // Slightly faster
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "bubble",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 150,
            size: 10,
            duration: 2,
            opacity: 0.8,
            speed: 3,
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
    };

    // Initialize particles with a small delay to ensure DOM is ready
    setTimeout(() => {
      if (window.particlesJS && particlesRef.current) {
        try {
          window.particlesJS(particlesRef.current.id, particlesConfig);
          console.log("Particles.js initialized successfully");
        } catch (error) {
          console.error("Error initializing particles.js:", error);
        }
      }
    }, 300);

    return () => {
      if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom.forEach((dom) => {
          if (dom && dom.pJS && dom.pJS.fn && dom.pJS.fn.vendors) {
            dom.pJS.fn.vendors.destroypJS();
          }
        });
        window.pJSDom = [];
      }
    };
  }, [isDark, particlesLoaded]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github size={18} />,
      href: "https://github.com/username",
      color: "#171515",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={18} />,
      href: "https://linkedin.com/in/username",
      color: "#0077B5",
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} />,
      href: "https://twitter.com/username",
      color: "#1DA1F2",
    },
    {
      name: "Instagram",
      icon: <Instagram size={18} />,
      href: "https://instagram.com/username",
      color: "#E4405F",
    },
    {
      name: "Email",
      icon: <Mail size={18} />,
      href: "mailto:email@example.com",
      color: "#D44638",
    },
  ];

  // Create parallax shapes
  const parallaxShapes = [
    {
      depth: "0.1",
      className: `absolute top-20 left-20 w-16 h-16 rotate-45 ${
        isDark ? "bg-cyan-500" : "bg-blue-400"
      } opacity-20 rounded-md`,
    },
    {
      depth: "0.2",
      className: `absolute bottom-40 right-40 w-24 h-24 ${
        isDark ? "bg-indigo-500" : "bg-indigo-400"
      } opacity-25 rounded-full`,
    },
    {
      depth: "0.3",
      className: `absolute top-1/2 left-1/3 w-12 h-12 rotate-12 ${
        isDark ? "bg-pink-500" : "bg-pink-400"
      } opacity-20 rounded-full`,
    },
    {
      depth: "0.6",
      className: `absolute top-20 right-1/4 w-20 h-20 ${
        isDark ? "bg-teal-500" : "bg-teal-400"
      } opacity-20 rounded-md transform rotate-12`,
    },
    {
      depth: "0.4",
      className: `absolute bottom-20 left-1/4 w-32 h-8 ${
        isDark ? "bg-purple-500" : "bg-purple-400"
      } opacity-20 rounded-full`,
    },
    // Large colored gradients
    {
      depth: "0.5",
      className: `absolute w-96 h-96 rounded-full blur-3xl ${
        isDark ? "bg-blue-500" : "bg-blue-300"
      } opacity-30 -top-48 -right-48`,
    },
    {
      depth: "0.7",
      className: `absolute w-96 h-96 rounded-full blur-3xl ${
        isDark ? "bg-primary" : "bg-primaryInLight"
      } opacity-30 -bottom-48 -left-48`,
    },
    // Add floating icons (will be more visible)
    {
      depth: "0.4",
      className: "absolute top-1/4 right-1/3",
      content: (
        <Sparkles
          size={24}
          className={`${isDark ? "text-cyan-400" : "text-primary"} opacity-50`}
        />
      ),
    },
    {
      depth: "0.5",
      className: "absolute bottom-1/3 left-1/3",
      content: (
        <Code
          size={28}
          className={`${
            isDark ? "text-purple-400" : "text-purple-500"
          } opacity-50`}
        />
      ),
    },
  ];

  return (
    <footer
      className={`py-16 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-bgDark via-gray-800/50 to-bgDark"
          : "bg-gradient-to-br from-bgLight via-blue-50/50 to-bgLight"
      }`}
    >
      {/* Particle container with unique ID */}
      <div
        id="footer-particles-js"
        ref={particlesRef}
        className="absolute inset-0 z-0"
      ></div>

      {/* Improved Parallax background effects */}
      <div
        ref={parallaxSceneRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Grid Pattern for visibility */}
        <div
          data-depth="0.2"
          className={`absolute inset-0 opacity-20 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        />

        {/* Dynamically render all parallax shapes */}
        {parallaxShapes.map((shape, index) => (
          <div key={index} data-depth={shape.depth} className={shape.className}>
            {shape.content}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Back to top button with animation */}
          <motion.div
            className="mb-12"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={scrollToTop}
              className={`group w-12 h-12 rounded-full ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-primary hover:text-white"
                  : "bg-white text-gray-600 hover:bg-primaryInLight hover:text-white border border-gray-200"
              } flex items-center justify-center transition-all duration-300 shadow-md`}
              whileHover={{
                scale: 1.1,
                y: -5,
                boxShadow: isDark
                  ? "0 10px 25px -5px rgba(0, 173, 181, 0.5)"
                  : "0 10px 25px -5px rgba(95, 111, 255, 0.5)",
              }}
              whileTap={{ scale: 0.9 }}
              data-tooltip-id="scroll-tooltip"
              data-tooltip-content="Back to top"
            >
              <div className="relative">
                <ArrowUp
                  size={20}
                  className="transition-transform group-hover:translate-y-[-3px] duration-300"
                />
                <motion.div
                  className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 -z-10`}
                  initial={{ scale: 0.3 }}
                  whileHover={{ scale: 1 }}
                >
                  <Lottie
                    loop
                    animationData={scrollAnimation}
                    play={isVisible}
                    style={{ width: 40, height: 40 }}
                  />
                </motion.div>
              </div>
            </motion.button>
            <Tooltip id="scroll-tooltip" />
          </motion.div>

          {/* Logo/Brand with ENHANCED hover effect and glow */}
          <motion.div className="mb-8 relative" variants={itemVariants}>
            <motion.h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              Rian{" "}
              <span
                className={`relative inline-block ${
                  isDark ? "text-cyan-400" : "text-primary"
                }`}
              >
                {/* Enhanced glow effect for Farhan */}
                <span className={`relative z-20`}>Farhan</span>

                {/* Multiple layers of glow for enhanced effect */}
                <motion.span
                  className={`absolute inset-0 blur-md rounded-lg ${
                    isDark ? "bg-cyan-500" : "bg-blue-500"
                  } opacity-30 z-10`}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <motion.span
                  className={`absolute inset-0 blur-lg rounded-lg ${
                    isDark ? "bg-cyan-400" : "bg-primary"
                  } opacity-20 -z-10 scale-110`}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1.1, 1.15, 1.1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />

                {/* Outer glow ring */}
                <motion.span
                  className={`absolute -inset-1 blur-xl rounded-lg ${
                    isDark ? "bg-cyan-400" : "bg-primary"
                  } opacity-10 -z-20 scale-125`}
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1.25, 1.3, 1.25],
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
              </span>
            </motion.h2>
          </motion.div>

          {/* Dynamic Navigation */}
          <motion.div className="mb-12" variants={itemVariants}>
            <ul className="flex flex-wrap justify-center gap-6 md:gap-10">
              {navItems.map((item, index) => (
                <motion.li key={index}>
                  <motion.a
                    href={item.href}
                    className={`${
                      isDark
                        ? "text-gray-400 hover:text-cyan-400"
                        : "text-gray-600 hover:text-primary"
                    } transition-colors font-medium relative`}
                    onMouseEnter={() => setHoveredNav(index)}
                    onMouseLeave={() => setHoveredNav(null)}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.name}
                    <AnimatePresence>
                      {hoveredNav === index && (
                        <motion.span
                          className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                            isDark ? "bg-cyan-400" : "bg-primary"
                          } rounded-full`}
                          initial={{ width: 0, left: "50%" }}
                          animate={{ width: "100%", left: 0 }}
                          exit={{ width: 0, left: "50%" }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Enhanced Social Links - Interactive Cards */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-full ${
                  isDark
                    ? "bg-gray-800 text-gray-400 hover:text-white"
                    : "bg-white text-gray-600 hover:text-white border border-gray-200"
                } flex items-center justify-center transition-all duration-300 shadow-md relative group overflow-hidden`}
                whileHover={{
                  scale: 1.15,
                  y: -5,
                  boxShadow: `0 10px 25px -5px ${social.color}50`,
                }}
                whileTap={{ scale: 0.95 }}
                data-tooltip-id={`social-tooltip-${index}`}
                data-tooltip-content={social.name}
              >
                {social.icon}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: social.color }}
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <Tooltip id={`social-tooltip-${index}`} />
              </motion.a>
            ))}
          </motion.div>

          {/* Animated Copyright */}
          <motion.div className="text-center" variants={itemVariants}>
            <motion.p
              className={`flex items-center justify-center gap-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              © {currentYear} - Designed & Built with
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                  color: isDark
                    ? ["#00adb5", "#22d3ee", "#00adb5"]
                    : ["#5F6FFF", "#3b82f6", "#5F6FFF"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart size={16} fill={isDark ? "#00adb5" : "#5F6FFF"} />
              </motion.span>
              by Rian Farhan
            </motion.p>
            <div className="mt-3 flex items-center justify-center gap-1 text-sm">
              <Code
                size={14}
                className={isDark ? "text-gray-500" : "text-gray-400"}
              />
              <p className={isDark ? "text-gray-500" : "text-gray-400"}>
                Built with React & TailwindCSS
              </p>
            </div>
            <p
              className={`mt-2 text-sm ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              All rights reserved
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
