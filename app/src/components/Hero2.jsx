import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Play,
  Coffee,
  Heart,
} from "lucide-react";

// Mock theme context
const useTheme = () => ({
  theme: "dark",
});

const fotoRian =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face";

const GradientText = ({
  children,
  colors,
  animationSpeed,
  showBorder,
  className,
}) => (
  <span
    className={`bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);

const FloatingElement = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: direction === "up" ? 50 : -50 }}
    animate={{
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      },
    }}
    whileHover={{
      y: -5,
      transition: { duration: 0.2 },
    }}
  >
    {children}
  </motion.div>
);

const TechOrb = ({ icon, text, delay, position }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`absolute flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-lg ${
        isDark
          ? "bg-gray-900/70 text-cyan-400 border border-cyan-400/40"
          : "bg-white/70 text-teal-600 border border-teal-400/40"
      } shadow-2xl cursor-pointer`}
      style={position}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
          delay,
          type: "spring",
          stiffness: 200,
          damping: 10,
        },
      }}
      whileHover={{
        scale: 1.1,
        rotate: 5,
        boxShadow: "0 20px 40px rgba(0, 255, 255, 0.3)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {icon}
      </motion.div>
      <span className="hidden sm:inline">{text}</span>
    </motion.div>
  );
};

const StatCard = ({ icon, number, label, delay }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`flex flex-col items-center p-4 rounded-xl backdrop-blur-md ${
        isDark
          ? "bg-gray-800/50 border border-gray-700/50"
          : "bg-white/50 border border-gray-200/50"
      } shadow-lg`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <motion.div
        className={`p-3 rounded-full mb-2 ${
          isDark ? "bg-cyan-500/20" : "bg-teal-500/20"
        }`}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        {icon}
      </motion.div>
      <span
        className={`text-2xl font-bold ${
          isDark ? "text-cyan-400" : "text-teal-600"
        }`}
      >
        {number}
      </span>
      <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {label}
      </span>
    </motion.div>
  );
};

export default function Hero2() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [text] = useTypewriter({
    words: [
      "Creative Problem Solver",
      "Digital Craftsman",
      "Code Architect",
      "Innovation Driver",
      "Tech Explorer",
      "Solution Builder",
      "Digital Alchemist",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    const sectionTimer = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 3);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(loadTimer);
      clearInterval(sectionTimer);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 30;
      const y = (e.clientY - top - height / 2) / 30;
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
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, type: "spring", stiffness: 100 },
    },
  };

  return (
    <div
      id="home"
      className={`min-h-screen relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-white"
      }`}
      ref={containerRef}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Grid pattern */}
        <div
          className={`absolute inset-0 opacity-5 ${
            isDark ? "bg-white" : "bg-black"
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${
              isDark ? "white" : "black"
            } 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <motion.div
          className="flex justify-between items-center p-6 backdrop-blur-md bg-black/10 border-b border-white/10"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-3 h-3 rounded-full ${
                isDark ? "bg-cyan-400" : "bg-teal-500"
              } animate-pulse`}
            ></div>
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDark
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-500/20 text-green-600"
              }`}
            >
              Available for work
            </div>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-7xl w-full">
            {/* Main Hero Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Left Content - Text Section */}
              <motion.div
                className="lg:col-span-7 order-2 lg:order-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Greeting Section */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className={`w-12 h-12 rounded-full ${
                        isDark
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                          : "bg-gradient-to-r from-teal-400 to-blue-500"
                      } flex items-center justify-center`}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Coffee className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Hello World! I'm
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Ready to create something amazing
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Name and Title */}
                <motion.div variants={itemVariants}>
                  <h1
                    className={`text-5xl md:text-7xl font-black mb-6 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <GradientText>Rian</GradientText>
                    <br />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      Farhan
                    </span>
                  </h1>

                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className={`h-1 w-20 ${
                        isDark ? "bg-cyan-400" : "bg-teal-500"
                      } rounded-full`}
                    ></div>
                    <div
                      className={`text-xl md:text-2xl font-medium ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <span>{text}</span>
                      <Cursor cursorColor={isDark ? "#00adb5" : "#14b8a6"} />
                    </div>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p
                  className={`text-lg md:text-xl leading-relaxed mb-8 max-w-2xl ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                  variants={itemVariants}
                >
                  Transforming complex problems into elegant solutions through
                  innovative design and cutting-edge technology.
                  <span
                    className={`font-semibold ${
                      isDark ? "text-cyan-400" : "text-teal-600"
                    }`}
                  >
                    Let's build the future together.
                  </span>
                </motion.p>

                {/* Stats Row */}
                <motion.div
                  className="grid grid-cols-3 gap-4 mb-8"
                  variants={itemVariants}
                >
                  <StatCard
                    icon={<Star className="w-5 h-5 text-yellow-400" />}
                    number="4+"
                    label="Years Exp"
                    delay={0.5}
                  />
                  <StatCard
                    icon={<Code className="w-5 h-5 text-blue-400" />}
                    number="50+"
                    label="Projects"
                    delay={0.7}
                  />
                  <StatCard
                    icon={<Heart className="w-5 h-5 text-red-400" />}
                    number="∞"
                    label="Coffee Cups"
                    delay={0.9}
                  />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-wrap gap-4 mb-8"
                  variants={itemVariants}
                >
                  <motion.button
                    className={`px-8 py-4 bg-gradient-to-r ${
                      isDark
                        ? "from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                        : "from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400"
                    } text-white rounded-xl font-semibold flex items-center gap-3 shadow-lg group`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Watch My Work
                  </motion.button>

                  <motion.button
                    className={`px-8 py-4 ${
                      isDark
                        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                        : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                    } rounded-xl font-semibold flex items-center gap-3 shadow-lg`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                    Download CV
                  </motion.button>
                </motion.div>

                {/* Social Links */}
                <motion.div className="flex gap-4" variants={itemVariants}>
                  {[
                    {
                      icon: Github,
                      href: "https://github.com",
                      label: "GitHub",
                    },
                    {
                      icon: Linkedin,
                      href: "https://linkedin.com",
                      label: "LinkedIn",
                    },
                    {
                      icon: Mail,
                      href: "mailto:contact@example.com",
                      label: "Email",
                    },
                    {
                      icon: MessageCircle,
                      href: "https://wa.me/",
                      label: "WhatsApp",
                    },
                  ].map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-full ${
                        isDark
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-cyan-400"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-teal-600"
                      } flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Content - Image Section */}
              <motion.div
                className="lg:col-span-5 order-1 lg:order-2 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <div className="relative max-w-md mx-auto">
                  {/* Floating Tech Orbs */}
                  <AnimatePresence>
                    {isLoaded && (
                      <>
                        <TechOrb
                          icon={<Code className="w-5 h-5" />}
                          text="React"
                          delay={1.5}
                          position={{ top: "10%", right: "-10%" }}
                        />
                        <TechOrb
                          icon={<Layout className="w-5 h-5" />}
                          text="Design"
                          delay={1.8}
                          position={{ top: "30%", left: "-15%" }}
                        />
                        <TechOrb
                          icon={<Smartphone className="w-5 h-5" />}
                          text="Mobile"
                          delay={2.1}
                          position={{ bottom: "25%", right: "-5%" }}
                        />
                        <TechOrb
                          icon={<Server className="w-5 h-5" />}
                          text="Backend"
                          delay={2.4}
                          position={{ bottom: "5%", left: "-10%" }}
                        />
                      </>
                    )}
                  </AnimatePresence>

                  {/* Main Image Container */}
                  <motion.div
                    className="relative"
                    style={{
                      transform: `rotateY(${
                        mousePosition.x * 0.5
                      }deg) rotateX(${mousePosition.y * 0.5}deg)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Rotating Rings */}
                    <div className="absolute inset-0 -z-10">
                      <motion.div
                        className={`absolute inset-0 rounded-full border-2 ${
                          isDark ? "border-cyan-400/30" : "border-teal-400/30"
                        }`}
                        style={{
                          width: "110%",
                          height: "110%",
                          top: "-5%",
                          left: "-5%",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.div
                        className={`absolute inset-0 rounded-full border-2 ${
                          isDark ? "border-blue-400/20" : "border-blue-400/20"
                        }`}
                        style={{
                          width: "130%",
                          height: "130%",
                          top: "-15%",
                          left: "-15%",
                        }}
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 30,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>

                    {/* Profile Image */}
                    <div
                      className={`relative w-80 h-80 rounded-full overflow-hidden ${
                        isDark
                          ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500"
                          : "bg-gradient-to-br from-teal-400 via-blue-500 to-purple-400"
                      } p-2 shadow-2xl`}
                    >
                      <motion.div
                        className="w-full h-full rounded-full overflow-hidden bg-gray-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={fotoRian}
                          alt="Rian Farhan"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>

                    {/* Experience Badge */}
                    <motion.div
                      className={`absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl ${
                        isDark
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                          : "bg-gradient-to-r from-teal-500 to-blue-500"
                      } text-white shadow-xl`}
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 2, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                        <div>
                          <div className="text-xl font-bold">4+</div>
                          <div className="text-sm opacity-90">Years</div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <motion.div
          className="flex justify-center pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div
            className="flex flex-col items-center cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.1 }}
          >
            <span
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Explore More
            </span>
            <motion.div
              className={`w-6 h-10 border-2 ${
                isDark ? "border-cyan-400" : "border-teal-500"
              } rounded-full flex justify-center`}
            >
              <motion.div
                className={`w-1 h-3 ${
                  isDark ? "bg-cyan-400" : "bg-teal-500"
                } rounded-full mt-2`}
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
