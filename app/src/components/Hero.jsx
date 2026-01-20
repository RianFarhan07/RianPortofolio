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
  Coffee,
  Play,
  Heart,
  Clock,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import fotoRian from "../assets/foto_rian.jpg";
import GradientText from "./GradientText";
import { Link } from "react-router-dom";

const TechOrb = ({ icon, text, delay, position }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`absolute flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md ${
        isDark
          ? "bg-gray-800/80 text-primary border border-primary/30"
          : "bg-white/80 text-primaryInLight border border-primaryInLight/30"
      } shadow-lg z-10`}
      initial={{ opacity: 0, scale: 0, rotate: -10 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { delay, type: "spring", stiffness: 200 },
      }}
      whileHover={{ scale: 1.05, rotate: 5 }}
      style={position}
    >
      {icon}
      <span>{text}</span>
    </motion.div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === "∞") {
      setCount("∞");
      return;
    }

    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

// Circular Progress Stats Component
const CircularStatCard = ({
  icon,
  number,
  label,
  delay,
  percentage,
  gradient,
  theme,
}) => {
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [percentage, delay]);

  const circumference = 2 * Math.PI * 28; // radius = 28
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glowing effect */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
      />

      {/* Main card */}
      <div
        className={`relative text-center p-4 rounded-xl ${
          isDark
            ? "bg-gray-800/50 backdrop-blur-lg border border-gray-700/50"
            : "bg-white/50 backdrop-blur-lg border border-gray-200/50"
        } shadow-lg overflow-hidden`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse" />
        </div>

        {/* Circular Progress */}
        <div className="relative w-16 h-16 mx-auto mb-3">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 64 64"
          >
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              strokeWidth="3"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke={`url(#gradient-${label.replace(/\s+/g, "")})`}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="drop-shadow-lg"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient
                id={`gradient-${label.replace(/\s+/g, "")}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={isDark ? "#00f5ff" : "#14b8a6"} />
                <stop
                  offset="100%"
                  stopColor={isDark ? "#0066ff" : "#3b82f6"}
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Icon in center with pulse effect */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`p-2 rounded-full bg-gradient-to-r ${gradient} shadow-lg`}
            >
              <div className="relative">
                {icon}
                {/* Pulse ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} opacity-30`}
                  animate={
                    isHovered
                      ? { scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }
                      : {}
                  }
                  transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Number with enhanced animation */}
        <motion.div
          className={`text-lg font-bold mb-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
        >
          <AnimatedCounter
            target={typeof number === "number" ? number : number}
            duration={2000}
            suffix={typeof number === "number" && number >= 4 ? "+" : ""}
          />

          {/* Sparkle effect for special numbers */}
          {number === "∞" && (
            <motion.div
              className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          )}
        </motion.div>

        {/* Label */}
        <div
          className={`text-xs font-medium ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {label}
        </div>

        {/* Bottom glow line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 ${
            isDark ? "bg-white/10" : "bg-black/10"
          }`}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${gradient}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: delay + 0.5, duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function Hero() {
  const containerRef = useRef(null);
  const particlesRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // efek typewriter
  const [text] = useTypewriter({
    words: [
      "Android Developer",
      "Web Developer",
      "UI/UX Designer",
      "Mobile Developer",
      "Fullstack Developer",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  // untuk inisialisasi particles.js
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof window !== "undefined" &&
        window.particlesJS &&
        document.getElementById("particles-js")
      ) {
        console.log("Initializing particles.js");
        window.particlesJS("particles-js", {
          particles: {
            number: { value: 15, density: { enable: true, value_area: 800 } },
            color: { value: isDark ? "#00adb5" : "#14b8a6" },
            opacity: {
              value: 0.3,
              random: true,
              anim: {
                enable: true,
                speed: 0.5,
                opacity_min: 0.2,
                sync: false,
              },
            },
            size: {
              value: 4,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 1,
                sync: false,
              },
            },
            line_linked: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 0.6,
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
              onhover: { enable: false },
              onclick: { enable: false },
              resize: true,
            },
          },
        });
      }
    }, 1500);

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
    };

    handleResize();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const loadTimer = setTimeout(() => setIsLoaded(true), 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      clearTimeout(loadTimer);
    };
  }, [isMobile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const statsData = [
    {
      icon: <Clock className="w-4 h-4 text-white" />,
      number: 4,
      label: "Years Exp",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: <Code className="w-4 h-4 text-white" />,
      number: 50,
      label: "Projects",
      gradient: "from-green-500 to-blue-500",
    },
    {
      icon: <Heart className="w-4 h-4 text-white" />,
      number: "∞",
      label: "Coffee",
      gradient: "from-red-500 to-pink-500",
    },
  ];

  return (
    <motion.div
      id="home"
      className="min-h-screen flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      {/* Particles.js container */}
      <div
        id="particles-js"
        ref={particlesRef}
        className="absolute inset-0 z-0 pointer-events-none"
      ></div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <div className="max-w-6xl w-full">
          {/* Main Hero Grid */}
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            {/* Left Content - Text Section */}
            <motion.div
              className={`lg:col-span-7 order-2 lg:order-1 ${
                isMobile ? "text-center" : ""
              }`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Greeting Section */}
              <motion.div className="mb-2" variants={itemVariants}>
                <div
                  className={`flex items-center gap-3 mb-4 ${
                    isMobile ? "justify-center" : ""
                  }`}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full ${
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
                    <Coffee className="w-5 h-5 text-white" />
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
                      className={`text-base font-bold ${
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
                  className={`text-4xl md:text-5xl lg:text-6xl font-black mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <GradientText
                    colors={[
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                    ]}
                    animationSpeed={4}
                    showBorder={false}
                  >
                    Rian Farhan
                  </GradientText>
                </h1>

                <div
                  className={`flex items-center gap-3 mb-4 ${
                    isMobile ? "justify-center" : ""
                  }`}
                >
                  <div
                    className={`h-1 w-16 ${
                      isDark ? "bg-cyan-400" : "bg-teal-500"
                    } rounded-full`}
                  ></div>
                  <div
                    className={`text-lg md:text-xl font-medium ${
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
                className={`text-base leading-relaxed mb-6 ${
                  isMobile ? "max-w-lg mx-auto" : "max-w-xl"
                } ${isDark ? "text-gray-400" : "text-gray-600"}`}
                variants={itemVariants}
              >
                Transforming complex problems into elegant solutions.
                <Link
                  to="/contact"
                  className={`font-semibold underline-offset-4 hover:underline transition-all duration-600 
    ${isDark ? "text-cyan-400" : "text-teal-600"}`}
                >
                  {" "}
                  Let's build together.
                </Link>
              </motion.p>

              {/* Stats Row */}
              <motion.div
                className={`grid grid-cols-3 gap-4 mb-6 ${
                  isMobile ? "max-w-md mx-auto" : ""
                }`}
                variants={itemVariants}
              >
                {statsData.map((stat, index) => (
                  <CircularStatCard
                    key={index}
                    icon={stat.icon}
                    number={stat.number}
                    label={stat.label}
                    delay={0.5 + index * 0.2}
                    percentage={stat.percentage}
                    gradient={stat.gradient}
                    theme={theme}
                  />
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className={`flex flex-wrap gap-3 mb-6 relative z-50 ${
                  isMobile ? "justify-center" : ""
                }`}
                variants={itemVariants}
              >
                <motion.a
                  href="#projects"
                  className={`relative px-6 py-3 bg-gradient-to-r ${
                    isDark
                      ? "from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                      : "from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400"
                  } text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg group cursor-pointer z-50`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 1000,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const projectsSection = document.getElementById("projects");
                    if (projectsSection) {
                      projectsSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Watch My Work
                </motion.a>

                <motion.a
                  href="rianCV.pdf"
                  download="Rian_Farhan_CV.pdf"
                  className={`relative px-6 py-3 ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                      : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                  } rounded-lg font-semibold flex items-center gap-2 shadow-lg cursor-pointer z-50`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 1000,
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </motion.a>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className={`flex gap-3 relative z-50 ${
                  isMobile ? "justify-center" : ""
                }`}
                variants={itemVariants}
              >
                {[
                  {
                    icon: Github,
                    href: "https://github.com/RianFarhan07",
                    label: "GitHub",
                  },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/baso-rian-farhan-82bb73245/",
                    label: "LinkedIn",
                  },
                  {
                    icon: Mail,
                    href: "/contact",
                    label: "Email",
                    isLink: true,
                  },
                  {
                    icon: MessageCircle,
                    href: "https://wa.me/6282280372670?text=Hi%20Rian,%20I%20would%20like%20to%20discuss%20a%20job%20opportunity%20we%20have%20and%20see%20if%20you%20might%20be%20interested.",
                    label: "WhatsApp",
                  },
                ].map((social, index) => {
                  const SocialComponent = social.isLink ? Link : motion.a;
                  return (
                    <SocialComponent
                      key={social.label}
                      {...(social.isLink
                        ? { to: social.href }
                        : { href: social.href })}
                      {...(!social.isLink && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                      className={`w-10 h-10 rounded-full ${
                        isDark
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-cyan-400"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-teal-600"
                      } flex items-center justify-center transition-all duration-300 relative z-50`}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      style={{
                        pointerEvents: "auto",
                        position: "relative",
                        zIndex: 1000,
                      }}
                    >
                      <social.icon className="w-4 h-4" />
                    </SocialComponent>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right Content - Image Section */}
            <motion.div
              className="lg:col-span-5 order-1 lg:order-2 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="relative max-w-xs mx-auto">
                {/* Floating Tech Orbs */}
                <AnimatePresence>
                  {isLoaded && (
                    <>
                      <TechOrb
                        icon={<Code className="w-4 h-4" />}
                        text="React"
                        delay={1.5}
                        position={{ top: "10%", right: "-10%" }}
                      />
                      <TechOrb
                        icon={<Layout className="w-4 h-4" />}
                        text="Design"
                        delay={1.8}
                        position={{ top: "30%", left: "-15%" }}
                      />
                      <TechOrb
                        icon={<Smartphone className="w-4 h-4" />}
                        text="Mobile"
                        delay={2.1}
                        position={{ bottom: "25%", right: "-5%" }}
                      />
                      <TechOrb
                        icon={<Server className="w-4 h-4" />}
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
                    transform: `rotateY(${mousePosition.x * 0.5}deg) rotateX(${
                      mousePosition.y * 0.5
                    }deg)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Rotating Rings */}
                  <div className="absolute inset-0 -z-10 pointer-events-none">
                    <motion.div
                      className={`absolute inset-0 rounded-full border-2 ${
                        isDark ? "border-cyan-400/30" : "border-teal-400/30"
                      } pointer-events-none`}
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
                      } pointer-events-none`}
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
                    className={`relative w-85 h-85 rounded-full overflow-hidden ${
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
                    className={`absolute -bottom-4 -right-4 px-4 py-2 rounded-xl ${
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
                      <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                      <div>
                        <div className="text-lg font-bold">4+</div>
                        <div className="text-xs opacity-90">Years</div>
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
        className="flex justify-center pb-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center cursor-pointer relative z-50"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
          style={{
            pointerEvents: "auto",
            position: "relative",
            zIndex: 1000,
          }}
        >
          <span
            className={`text-xs font-medium mb-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Explore More
          </span>
          <motion.div
            className={`w-5 h-8 border-2 ${
              isDark ? "border-cyan-400" : "border-teal-500"
            } rounded-full flex justify-center`}
          >
            <motion.div
              className={`w-0.5 h-2 ${
                isDark ? "bg-cyan-400" : "bg-teal-500"
              } rounded-full mt-1.5`}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.a>
      </motion.div>

      {/* CSS Animations */}
      <style jsx global>
        {`
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

          #particles-js {
            pointer-events: none !important;
          }

          #particles-js canvas {
            pointer-events: none !important;
          }
        `}
      </style>
    </motion.div>
  );
}
