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
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import fotoRian from "../assets/foto_rian.jpg";

export default function Hero() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 2,
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

  return (
    <motion.div
      id="home"
      className={`min-h-screen flex items-center relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-bgDark via-gray-800 to-bgDark"
          : "bg-gradient-to-br from-bgLight via-white to-bgLight"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      ref={containerRef}
    >
      {/* Animated particles background */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDark ? "bg-primary" : "bg-primaryInLight"
            } opacity-20`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 3 + 0.5,
            }}
            animate={{
              y: [0, -Math.random() * 100, 0],
              opacity: [0.1, Math.random() * 0.5 + 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 z-10">
        <motion.div
          className="grid md:grid-cols-2 gap-10 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="order-2 md:order-1">
            <motion.h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              } mb-4`}
              variants={itemVariants}
            >
              Hello, I'm{" "}
              <span className={isDark ? "text-primary" : "text-primaryInLight"}>
                Rian Farhan
              </span>
            </motion.h1>

            <motion.div
              className={`text-xl md:text-2xl ${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-6 h-12`}
              variants={itemVariants}
            >
              <span>I am a </span>
              <span className={isDark ? "text-primary" : "text-primaryInLight"}>
                {text}
              </span>
              <Cursor cursorColor={isDark ? "#00adb5" : "#14b8a6"} />
            </motion.div>

            <motion.p
              className={`${
                isDark ? "text-gray-400" : "text-gray-500"
              } mb-8 max-w-lg`}
              variants={itemVariants}
            >
              Passionate about creating intuitive, responsive applications with
              clean code and optimal user experiences.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <motion.a
                href="#projects"
                className={`px-6 py-3 ${
                  isDark
                    ? "bg-gradient-to-r from-primary to-blue-500"
                    : "bg-gradient-to-r from-primaryInLight to-blue-600"
                } text-white rounded-lg font-medium flex items-center gap-2 group`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                View My Work
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.a>

              <motion.a
                href="#contact"
                className={`px-6 py-3 border-2 ${
                  isDark
                    ? "border-primary text-primary hover:bg-primary"
                    : "border-primaryInLight text-primaryInLight hover:bg-primaryInLight"
                } rounded-lg font-medium hover:text-white transition-colors`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Contact Me
              </motion.a>

              <motion.a
                href="rianCV.pdf"
                download="Rian_Farhan_CV.pdf"
                className={`inline-flex items-center gap-2 px-6 py-3 ${
                  isDark
                    ? "bg-gray-800 text-primary hover:bg-gray-700"
                    : "bg-gray-100 text-primaryInLight hover:bg-gray-200"
                } rounded-lg font-medium transition-all relative overflow-hidden group`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download size={20} className="animate-pulse" />
                  Download CV
                </span>
                <motion.span
                  className={`absolute bottom-0 left-0 w-full h-0 ${
                    isDark ? "bg-primary" : "bg-primaryInLight"
                  } transition-all duration-300 group-hover:h-full`}
                  style={{ zIndex: 1, opacity: 0.2 }}
                />
              </motion.a>
            </motion.div>

            <motion.div className="flex gap-4 mt-8" variants={itemVariants}>
              <motion.a
                href="https://github.com/RianFarhan07"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full ${
                  isDark
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                } flex items-center justify-center hover:text-white transition-colors`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/baso-rian-farhan-82bb73245/"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full ${
                  isDark
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                } flex items-center justify-center hover:text-white transition-colors`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="mailto:rian.mallanti@gmail.com"
                className={`w-10 h-10 rounded-full ${
                  isDark
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                } flex items-center justify-center hover:text-white transition-colors`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail size={20} />
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            className="order-1 md:order-2 flex justify-center"
            variants={itemVariants}
            style={{
              perspective: 1000,
            }}
          >
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${
                  mousePosition.x
                }deg) rotateX(${-mousePosition.y}deg)`,
              }}
            >
              <motion.div
                className={`absolute inset-0 rounded-full overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-br from-primary to-blue-500"
                    : "bg-gradient-to-br from-primaryInLight to-blue-600"
                } p-1`}
                animate={{
                  boxShadow: isDark
                    ? [
                        "0 0 20px rgba(0, 173, 181, 0.5)",
                        "0 0 60px rgba(0, 173, 181, 0.3)",
                        "0 0 20px rgba(0, 173, 181, 0.5)",
                      ]
                    : [
                        "0 0 20px rgba(20, 184, 166, 0.5)",
                        "0 0 60px rgba(20, 184, 166, 0.3)",
                        "0 0 20px rgba(20, 184, 166, 0.5)",
                      ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={fotoRian}
                  alt="Rian Farhan"
                  className={`w-full h-full object-cover rounded-full transition-all duration-300 ${
                    isDark ? "filter grayscale" : "filter grayscale-0"
                  }`}
                />
              </motion.div>

              <motion.div
                className={`absolute -bottom-6 -right-6 ${
                  isDark ? "bg-primary" : "bg-primaryInLight"
                } text-white rounded-lg px-4 py-2 shadow-lg`}
                style={{
                  transform: "translateZ(20px)",
                }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-lg font-bold">3+ Years</span>
                <br />
                <span className="text-sm">Experience</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <a
          href="#about"
          className={`${
            isDark
              ? "text-gray-400 hover:text-primary"
              : "text-gray-500 hover:text-primaryInLight"
          } transition-colors`}
        >
          <ChevronDown size={30} />
        </a>
      </motion.div>
    </motion.div>
  );
}
