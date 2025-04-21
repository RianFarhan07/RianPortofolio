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
import Lottie from "react-lottie-player";
import scrollAnimation from "../assets/scrollAnimation.json";
import { Tooltip } from "react-tooltip";

export default function Footer() {
  const { theme } = useTheme();
  const particlesRef = useRef(null);
  const footerRef = useRef(null);
  const shapesContainerRef = useRef(null);
  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const controls = useAnimation();
  const [particlesLoaded, setParticlesLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  const currentYear = new Date().getFullYear();

  // check kalau footer di viewport
  useEffect(() => {
    const checkIfInView = () => {
      if (!footerRef.current) return;

      const rect = footerRef.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
      setInView(isInView);
    };

    window.addEventListener("scroll", checkIfInView);
    window.addEventListener("resize", checkIfInView);

    // Initial check
    checkIfInView();

    return () => {
      window.removeEventListener("scroll", checkIfInView);
      window.removeEventListener("resize", checkIfInView);
    };
  }, []);

  // Custom parallax effect
  useEffect(() => {
    if (!shapesContainerRef.current || !inView) return;

    const shapes =
      shapesContainerRef.current.querySelectorAll(".parallax-shape");

    const handleMouseMove = (e) => {
      const container = shapesContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      // kalkulasi posisi mouse
      const centerX = containerRect.left + containerRect.width / 2;
      const centerY = containerRect.top + containerRect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // implementasikan gerakan berdasarkan data depth
      shapes.forEach((shape) => {
        const depth = Number.parseFloat(
          shape.getAttribute("data-depth") || 0.1
        );
        const moveX = (mouseX * depth * -1) / 5; // turunkan faktor movement
        const moveY = (mouseY * depth * -1) / 5; // turunkan faktor movement

        shape.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) ${
          shape.getAttribute("data-rotate") || ""
        }`;
      });
    };

    //  tambahkan random movement kecil ke shape bahkan jika mouse tidak bergerak
    const intervalId = setInterval(() => {
      if (!shapesContainerRef.current || !inView) return;

      shapes.forEach((shape) => {
        const depth = Number.parseFloat(
          shape.getAttribute("data-depth") || 0.1
        );
        const randomX = (Math.random() - 0.5) * 10 * depth;
        const randomY = (Math.random() - 0.5) * 10 * depth;

        const currentTransform = shape.style.transform || "";
        if (currentTransform.includes("translate3d")) {
          // jangan override transform yang sudah ada
          return;
        }

        shape.style.transform = `translate3d(${randomX}px, ${randomY}px, 0) ${
          shape.getAttribute("data-rotate") || ""
        }`;
      });
    }, 3000);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(intervalId);
    };
  }, [inView]);

  useEffect(() => {
    // tampilkan back to top button jika di viewport
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

  useEffect(() => {
    // Load particles.js kalau belum di load
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

  // Initialize particles ketika di load dan ketika thema ganti
  useEffect(() => {
    if (!particlesLoaded || !particlesRef.current || !inView) return;

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
          value: 40,
          density: { enable: true, value_area: 800 },
        },
        color: { value: isDark ? "#00adb5" : "#14b8a6" },
        opacity: {
          value: 0.7,
          random: true,
          anim: {
            enable: true,
            speed: 0.5,
            opacity_min: 0.3,
            sync: false,
          },
        },
        size: {
          value: 8,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 2,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: isDark ? "#00adb5" : "#14b8a6",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2,
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

    // Initialize particles dengan delay agar memastikan dom sudah di load
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
  }, [isDark, particlesLoaded, inView]);

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
    { name: "Certificates", href: "#certificates" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github size={18} />,
      href: "https://github.com/RianFarhan07",
      color: "#171515",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={18} />,
      href: "https://www.linkedin.com/in/baso-rian-farhan-82bb73245/",
      color: "#0077B5",
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} />,
      href: "https://x.com/RianFarhanM",
      color: "#1DA1F2",
    },
    {
      name: "Instagram",
      icon: <Instagram size={18} />,
      href: "https://www.instagram.com/rianfarhan/",
      color: "#E4405F",
    },
    {
      name: "Email",
      icon: <Mail size={18} />,
      href: "#contact",
      color: "#D44638",
    },
  ];

  // Create parallax shapes
  const parallaxShapes = [
    {
      depth: "0.1",
      className: `parallax-shape absolute w-16 h-16 ${
        isDark ? "bg-cyan-500" : "bg-blue-400"
      } opacity-20 rounded-md`,
      style: { left: "15%", top: "10%" },
      rotate: "rotate(45deg)",
    },
    {
      depth: "0.2",
      className: `parallax-shape absolute w-24 h-24 ${
        isDark ? "bg-indigo-500" : "bg-indigo-400"
      } opacity-25 rounded-full`,
      style: { right: "20%", bottom: "30%" },
    },
    {
      depth: "0.3",
      className: `parallax-shape absolute w-12 h-12 ${
        isDark ? "bg-pink-500" : "bg-pink-400"
      } opacity-20 rounded-full`,
      style: { left: "60%", top: "40%" },
      rotate: "rotate(12deg)",
    },
    {
      depth: "0.6",
      className: `parallax-shape absolute w-20 h-20 ${
        isDark ? "bg-teal-500" : "bg-teal-400"
      } opacity-20 rounded-md`,
      style: { right: "30%", top: "15%" },
      rotate: "rotate(12deg)",
    },
    {
      depth: "0.4",
      className: `parallax-shape absolute w-32 h-8 ${
        isDark ? "bg-purple-500" : "bg-purple-400"
      } opacity-20 rounded-full`,
      style: { left: "40%", bottom: "15%" },
    },
    {
      depth: "0.5",
      className: `parallax-shape absolute w-16 h-16 ${
        isDark ? "bg-amber-500" : "bg-amber-400"
      } opacity-20 rounded-md`,
      style: { right: "60%", top: "60%" },
      rotate: "rotate(45deg)",
    },
    {
      depth: "0.7",
      className: `parallax-shape absolute w-20 h-20 ${
        isDark ? "bg-emerald-500" : "bg-emerald-400"
      } opacity-20 rounded-full`,
      style: { left: "75%", top: "25%" },
    },
    {
      depth: "0.8",
      className: `parallax-shape absolute w-24 h-12 ${
        isDark ? "bg-rose-500" : "bg-rose-400"
      } opacity-20 rounded-md`,
      style: { right: "45%", bottom: "45%" },
      rotate: "rotate(12deg)",
    },

    {
      depth: "0.5",
      className: `parallax-shape absolute w-96 h-96 rounded-full blur-3xl ${
        isDark ? "bg-blue-500" : "bg-blue-300"
      } opacity-30`,
      style: { right: "-5%", top: "-10%" },
    },
    {
      depth: "0.7",
      className: `parallax-shape absolute w-96 h-96 rounded-full blur-3xl ${
        isDark ? "bg-primary" : "bg-primaryInLight"
      } opacity-30`,
      style: { left: "-5%", bottom: "-10%" },
    },

    {
      depth: "0.4",
      className: "parallax-shape absolute",
      style: { right: "25%", top: "30%" },
      content: (
        <Sparkles
          size={28}
          className={`${isDark ? "text-cyan-400" : "text-primary"} opacity-70`}
        />
      ),
    },
    {
      depth: "0.5",
      className: "parallax-shape absolute",
      style: { left: "20%", bottom: "25%" },
      content: (
        <Code
          size={32}
          className={`${
            isDark ? "text-purple-400" : "text-purple-500"
          } opacity-70`}
        />
      ),
    },

    {
      depth: "0.3",
      className: "parallax-shape absolute",
      style: { left: "80%", top: "50%" },
      content: (
        <Heart
          size={24}
          className={`${isDark ? "text-pink-400" : "text-pink-500"} opacity-70`}
        />
      ),
    },
    {
      depth: "0.6",
      className: "parallax-shape absolute",
      style: { right: "70%", bottom: "60%" },
      content: (
        <Github
          size={30}
          className={`${isDark ? "text-gray-400" : "text-gray-500"} opacity-70`}
        />
      ),
    },
  ];

  return (
    <footer
      ref={footerRef}
      className={`py-16 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-bgDark via-gray-800/50 to-bgDark"
          : "bg-gradient-to-br from-bgLight via-blue-50/50 to-bgLight"
      }`}
    >
      {/* Particle container dengan id unique */}
      <div
        id="footer-particles-js"
        ref={particlesRef}
        className="absolute inset-0 z-0"
      ></div>

      {/* Custom parallax */}
      <div
        ref={shapesContainerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ height: "100%", width: "100%", position: "absolute" }}
      >
        <div
          className={`absolute inset-0 opacity-20 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        />

        {/* render dinamik semua shapes */}
        {parallaxShapes.map((shape, index) => (
          <div
            key={index}
            data-depth={shape.depth}
            data-rotate={shape.rotate}
            className={shape.className}
            style={shape.style}
          >
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
          {/* animasi back to top */}
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
                <span className={`relative z-20`}>Farhan</span>

                <motion.span
                  className={`absolute inset-0 blur-md rounded-lg ${
                    isDark ? "bg-cyan-500" : "bg-blue-500"
                  } opacity-30 z-10`}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                <motion.span
                  className={`absolute inset-0 blur-lg rounded-lg ${
                    isDark ? "bg-cyan-400" : "bg-primary"
                  } opacity-20 -z-10 scale-110`}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1.1, 1.15, 1.1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                />

                <motion.span
                  className={`absolute -inset-1 blur-xl rounded-lg ${
                    isDark ? "bg-cyan-400" : "bg-primary"
                  } opacity-10 -z-20 scale-125`}
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1.25, 1.3, 1.25],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                />
              </span>
            </motion.h2>
          </motion.div>

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
                  repeat: Number.POSITIVE_INFINITY,
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
