"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ArrowRight,
  Code,
  Coffee,
  BookOpen,
  Lightbulb,
  Award,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import aboutImage from "../assets/foto-nobg.png";

const SkillBadge = ({ icon, text, delay, index }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base font-medium ${
        isDark
          ? "bg-gray-800 text-primary border border-primary/30"
          : "bg-white text-primaryInLight border border-primaryInLight/30"
      } shadow-md`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index + delay, duration: 0.5 }}
      whileHover={{
        scale: 1.05,
        boxShadow: isDark
          ? "0 0 10px rgba(0, 173, 181, 0.3)"
          : "0 0 10px rgba(20, 184, 166, 0.3)",
      }}
    >
      {icon}
      <span>{text}</span>
    </motion.div>
  );
};

export default function AboutPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

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

    handleResize(); // Set initial value
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const skills = [
    { icon: <Code size={18} />, text: "React & Next.js" },
    { icon: <Coffee size={18} />, text: "Java & Kotlin" },
    { icon: <BookOpen size={18} />, text: "UI/UX Design" },
    { icon: <Lightbulb size={18} />, text: "Problem Solving" },
  ];

  return (
    <section
      id="about-preview"
      className={`py-16 md:py-24 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-bgDark via-gray-800/50 to-bgDark"
          : "bg-gradient-to-br from-bgLight via-blue-50/50 to-bgLight"
      }`}
      ref={containerRef}
    >
      {/* Background decor */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          } opacity-5 -top-48 -left-48`}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          } opacity-5 -bottom-48 -right-48`}
        />
        <div
          className={`absolute inset-0 opacity-10 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10" ref={ref}>
        <motion.div
          className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Image Section */}
          <motion.div
            className="w-full md:w-5/12 flex justify-center md:justify-end"
            variants={itemVariants}
            style={{
              perspective: 1000,
            }}
          >
            <motion.div
              className="relative w-64 h-64 sm:w-80 sm:h-80"
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
              {/* Decorative elements */}
              <div
                className={`absolute rounded-xl ${
                  isDark ? "border-primary" : "border-primaryInLight"
                } border-2 opacity-20`}
                style={{
                  width: "105%",
                  height: "105%",
                  top: "2.5%",
                  left: "-2.5%",
                  transformStyle: "preserve-3d",
                  transform: "translateZ(-10px) rotate(5deg)",
                }}
              />

              <div
                className={`absolute rounded-xl ${
                  isDark ? "border-blue-500" : "border-blue-400"
                } border-2 opacity-20`}
                style={{
                  width: "105%",
                  height: "105%",
                  top: "-5%",
                  left: "2.5%",
                  transformStyle: "preserve-3d",
                  transform: "translateZ(-20px) rotate(-5deg)",
                }}
              />

              {/* Main image */}
              <div
                className={`absolute inset-0 rounded-xl overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-br from-primary via-blue-500 to-purple-500"
                    : "bg-gradient-to-br from-primaryInLight via-blue-500 to-purple-400"
                } p-1.5`}
                style={{
                  boxShadow: isDark
                    ? "0 0 30px rgba(0, 173, 181, 0.3)"
                    : "0 0 30px rgba(20, 184, 166, 0.3)",
                }}
              >
                <div
                  className={`w-full h-full rounded-xl p-0.5 backdrop-blur-sm bg-gradient-to-br ${
                    isDark
                      ? "from-white/10 to-black/30"
                      : "from-white/80 to-white/20"
                  }`}
                >
                  <img
                    src={aboutImage || "/placeholder.svg"}
                    alt="About Me"
                    className="w-full h-full rounded-xl"
                  />
                </div>
              </div>

              {/* Experience badge */}
              <motion.div
                className={`absolute -bottom-6 -right-6 ${
                  isDark
                    ? "bg-gradient-to-r from-primary to-blue-500"
                    : "bg-gradient-to-r from-primaryInLight to-blue-500"
                } text-white rounded-xl px-4 py-2.5 shadow-xl`}
                style={{
                  transform: "translateZ(30px)",
                }}
                initial={{ scale: 0, rotate: -10 }}
                animate={{
                  scale: inView ? 1 : 0,
                  transition: {
                    scale: { duration: 0.5, delay: 0.3 },
                  },
                }}
              >
                <span className="text-base sm:text-lg font-bold flex items-center gap-1">
                  <Award
                    size={16}
                    className="fill-yellow-300 text-yellow-300"
                  />
                  BS in Computer Science
                </span>
                <span className="text-xs sm:text-sm opacity-90">
                  University of Tech
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            className="w-full md:w-7/12 text-center md:text-left"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center gap-2 mb-4 justify-center md:justify-start"
              variants={itemVariants}
            >
              <div
                className={`h-1 w-8 md:w-12 ${
                  isDark ? "bg-primary" : "bg-primaryInLight"
                } rounded-full`}
              ></div>
              <span
                className={`text-sm font-semibold uppercase tracking-wider ${
                  isDark ? "text-primary" : "text-primaryInLight"
                }`}
              >
                About Me
              </span>
              <div
                className={`h-1 w-8 md:w-12 ${
                  isDark ? "bg-primary" : "bg-primaryInLight"
                } rounded-full`}
              ></div>
            </motion.div>

            <motion.h2
              className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
              variants={itemVariants}
            >
              Turning Ideas into{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDark
                    ? "from-primary to-blue-400"
                    : "from-primaryInLight to-blue-500"
                }`}
              >
                Digital Reality
              </span>
            </motion.h2>

            <motion.p
              className={`${
                isDark ? "text-gray-400" : "text-gray-600"
              } mb-6 text-base sm:text-lg`}
              variants={itemVariants}
            >
              I'm a passionate Full Stack Developer with a strong focus on
              creating clean, efficient code and intuitive user experiences.
              With expertise in both front-end and back-end technologies, I
              enjoy bringing complex projects to life.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start"
              variants={itemVariants}
            >
              {skills.map((skill, index) => (
                <SkillBadge
                  key={index}
                  icon={skill.icon}
                  text={skill.text}
                  delay={0.5}
                  index={index}
                />
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                to="/about"
                className={`inline-flex items-center gap-2 px-6 py-3 ${
                  isDark
                    ? "bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
                    : "bg-gradient-to-r from-primaryInLight to-blue-600 hover:from-primaryInLight/90 hover:to-blue-600/90"
                } text-white rounded-lg font-medium shadow-lg transition-all group`}
              >
                Read More About Me
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
