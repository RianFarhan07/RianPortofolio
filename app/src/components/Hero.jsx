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
  MessageCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import fotoRian from "../assets/foto_rian.jpg";
import GradientText from "./GradientText";
import { Link } from "react-router-dom";

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

export default function Hero() {
  const containerRef = useRef(null);
  const particlesRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  // efek typewriter
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

  // untuk inisialisasi particles.js
  useEffect(() => {
    // tambahkan sedikit delay untuk memastikan bahwa elemen telah dimuat
    const timer = setTimeout(() => {
      if (
        typeof window !== "undefined" &&
        window.particlesJS &&
        document.getElementById("particles-js")
      ) {
        console.log("Initializing particles.js");
        window.particlesJS("particles-js", {
          particles: {
            number: { value: 20, density: { enable: true, value_area: 800 } },
            color: { value: isDark ? "#00adb5" : "#14b8a6" },
            opacity: {
              value: 0.4,
              random: true, // agar opacitiynya random
              anim: {
                enable: true,
                speed: 0.5,
                opacity_min: 0.3,
                sync: false,
              },
            },
            size: {
              value: 6,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 2,
                sync: false,
              },
            },
            line_linked: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 0.8,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
            },
          },
        });
      } else {
        console.error("Particles.js not available or element not found", {
          particlesJS: !!window.particlesJS,
          element: !!document.getElementById("particles-js"),
        });
      }
    }, 1500); // delay agar muncul setelah transisi

    return () => {
      clearTimeout(timer);
      if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
      }
    };
  }, [isDark]);

  useEffect(() => {
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

    handleResize();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => setIsVisible(true), 500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [isMobile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 1.5,
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

  const getTechBadgePosition = (position) => {
    if (isMobile) {
      // kalau di mobile posisi badge diubah supaya lebih dekat
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

    // kalau di desktop posisi badge tetap seperti biasa
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
      } py-16 md:py-0`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      ref={containerRef}
    >
      {/* Particles.js container */}
      <div
        id="particles-js"
        ref={particlesRef}
        className="absolute inset-0 z-0"
      ></div>

      {/* Gradient background */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 opacity-20 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        ></div>

        {/* bola bola gradient */}
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
      </div>

      <div className="container mx-auto px-4 sm:px-6 z-10">
        <motion.div
          className="grid md:grid-cols-2 gap-8 md:gap-10 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile image section - pindah ke atas kalau di mobile */}
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
              {/* tech badges melayang  */}
              {isVisible && (
                <>
                  <TechBadge
                    icon={<Code size={16} />}
                    text="React"
                    delay={2}
                    style={getTechBadgePosition("topLeft")}
                  />
                  <TechBadge
                    icon={<Layout size={16} />}
                    text="UI/UX"
                    delay={2.5}
                    style={getTechBadgePosition("topRight")}
                  />
                  <TechBadge
                    icon={<Smartphone size={16} />}
                    text="Mobile"
                    delay={3.0}
                    style={getTechBadgePosition("bottomRight")}
                  />
                  <TechBadge
                    icon={<Server size={16} />}
                    text="Backend"
                    delay={3.5}
                    style={getTechBadgePosition("bottomLeft")}
                  />
                </>
              )}

              {/* rings samping foto*/}
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

              {/* foto profile*/}
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

              {/* badge pengalaman */}
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
              Hello I'm
              <br />
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={4}
                showBorder={false}
                className="md:text-left text-center"
              >
                Rian Farhan
              </GradientText>
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
              Passionate about turning ideas into reality through thoughtful
              design and high-performance code.
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

              <Link to="/contact">
                <motion.div
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
                </motion.div>
              </Link>

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
                href="https://github.com/RianFarhan07"
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
                href="https://www.linkedin.com/in/baso-rian-farhan-82bb73245/"
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
              <Link to={"/contact"}>
                <motion.div
                  className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full ${
                    isDark
                      ? "bg-gray-800 text-gray-400 hover:text-primary hover:border-primary"
                      : "bg-gray-200 text-gray-600 hover:text-primaryInLight hover:border-primaryInLight"
                  } flex items-center justify-center transition-colors border-2 border-transparent`}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail size={isSmallMobile ? 18 : 22} />
                </motion.div>
              </Link>
              <motion.a
                href="https://wa.me/6282280372670?text=Hi%20Rian,%20I%20would%20like%20to%20discuss%20a%20job%20opportunity%20we%20have%20and%20see%20if%20you%20might%20be%20interested."
                target="_blank"
                className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full ${
                  isDark
                    ? "bg-gray-800 text-gray-400 hover:text-primary hover:border-primary"
                    : "bg-gray-200 text-gray-600 hover:text-primaryInLight hover:border-primaryInLight"
                } flex items-center justify-center transition-colors border-2 border-transparent`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle size={isSmallMobile ? 18 : 22} />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* scroll ke bawah button */}
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

      {/* CSS Animations agar lebih hidup */}
      <style jsx="" global="true">{`
        /* Animasi pulse: memberikan efek denyut pada elemen */
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

        /* Animasi spin: memberikan efek putar pada elemen */
        @keyframes spin {
          from {
            transform: translateZ(-10px) rotate(0deg);
          }
          to {
            transform: translateZ(-10px) rotate(360deg);
          }
        }

        /* Animasi pulse-shadow: memberikan efek bayangan yang "berdenyut" */
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

        /* Animasi float-badge: memberikan efek gerakan mengambang (floating) */
        @keyframes float-badge {
          0%,
          100% {
            transform: translateZ(30px) translateY(0px) rotate(-5deg);
          }
          50% {
            transform: translateZ(30px) translateY(-8px) rotate(0deg);
          }
        }

        /* Media query untuk perangkat dengan layar kecil (max-width: 640px) */
        /* Mengurangi efek bayangan agar lebih ringan pada perangkat mobile */
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
