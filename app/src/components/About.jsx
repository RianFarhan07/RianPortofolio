import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code,
  Briefcase,
  GraduationCap,
  Download,
  Github,
  Linkedin,
  Mail,
  Server,
  ChevronDown,
  Smartphone,
  Layout,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import RotatingText from "./RotatingText";
import Lanyard from "./Lanyard";
import TechScroll from "./TechScroll";

const ExperienceItem = ({
  position,
  company,
  period,
  description,
  index,
  inView,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`flex gap-4 md:gap-6 ${
        isDark ? "text-gray-300" : "text-gray-600"
      }`}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className="relative flex-none pt-1">
        <div
          className={`w-4 h-4 rounded-full ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          } z-10 relative`}
        ></div>
        <div
          className={`absolute top-5 bottom-0 left-1.5 w-0.5 ${
            isDark ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>
      </div>
      <div className="pb-10">
        <h3
          className={`text-xl font-bold mb-1 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {position}{" "}
          <span
            className={`text-lg ${
              isDark ? "text-primary" : "text-primaryInLight"
            }`}
          >
            @ {company}
          </span>
        </h3>
        <p
          className={`text-sm mb-3 font-medium ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}
        >
          {period}
        </p>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const EducationItem = ({
  degree,
  institution,
  period,
  description,
  index,
  inView,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`flex gap-4 md:gap-6 ${
        isDark ? "text-gray-300" : "text-gray-600"
      }`}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className="relative flex-none pt-1">
        <div
          className={`w-4 h-4 rounded-full ${
            isDark ? "bg-blue-500" : "bg-blue-500"
          } z-10 relative`}
        ></div>
        <div
          className={`absolute top-5 bottom-0 left-1.5 w-0.5 ${
            isDark ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>
      </div>
      <div className="pb-10">
        <h3
          className={`text-xl font-bold mb-1 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {degree}{" "}
          <span
            className={`text-lg ${isDark ? "text-blue-400" : "text-blue-600"}`}
          >
            @ {institution}
          </span>
        </h3>
        <p
          className={`text-sm mb-3 font-medium ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}
        >
          {period}
        </p>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const SkillBar = ({ label, percentage, isDark }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span
          className={`text-xs font-medium ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </span>
        <span
          className={`text-xs font-medium ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {percentage}%
        </span>
      </div>
      <div
        className={`w-full h-1.5 rounded-full ${
          isDark ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <motion.div
          className={`h-1.5 rounded-full ${
            isDark
              ? "bg-gradient-to-r from-primary to-blue-500"
              : "bg-gradient-to-r from-primaryInLight to-blue-500"
          }`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: false }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const TechBadge = ({ text, index, inView }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.span
      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
        isDark
          ? "bg-gray-800 text-primary border border-primary/30"
          : "bg-gray-100 text-primaryInLight border border-primaryInLight/30"
      }`}
      initial={{ opacity: 0, scale: 0 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
    >
      {text}
    </motion.span>
  );
};

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const containerRef = useRef(null);
  // First, add a new state to track which skill is being hovered
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [skillsRef, skillsInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  const [expRef, expInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [eduRef, eduInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [techRef, techInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Modified skills data with descriptions
  const skills = [
    {
      icon: <Code size={24} color={isDark ? "#00ADB5" : "#14B8A6"} />,
      label: "Frontend Development",
      description:
        "Creating responsive and interactive web applications using modern frameworks and technologies.",
      onClick: () => {},
      className: isDark
        ? "border-primary hover:border-primary/60"
        : "border-primaryInLight hover:border-primaryInLight/60",
    },
    {
      icon: <Smartphone size={24} color={isDark ? "#00ADB5" : "#14B8A6"} />,
      label: "Mobile Development",
      description:
        "Building native and cross-platform mobile applications for Android and iOS.",
      onClick: () => {},
      className: isDark
        ? "border-primary hover:border-primary/60"
        : "border-primaryInLight hover:border-primaryInLight/60",
    },
    {
      icon: <Layout size={24} color={isDark ? "#00ADB5" : "#14B8A6"} />,
      label: "UI/UX Design",
      description:
        "Designing intuitive user interfaces and experiences that are both functional and beautiful.",
      onClick: () => {},
      className: isDark
        ? "border-primary hover:border-primary/60"
        : "border-primaryInLight hover:border-primaryInLight/60",
    },
    {
      icon: <Server size={24} color={isDark ? "#00ADB5" : "#14B8A6"} />,
      label: "Backend Development",
      description:
        "Implementing robust server-side solutions, APIs, and database architectures.",
      onClick: () => {},
      className: isDark
        ? "border-primary hover:border-primary/60"
        : "border-primaryInLight hover:border-primaryInLight/60",
    },
  ];

  const experiences = [
    {
      position: "IT Support",
      company: "Department of Manpower, Makassar City",
      period: "Des 2022 - Feb 2022",
      description:
        "Provided daily technical support to staff, managed office hardware and software, and assisted in maintaining internal networks and information systems.",
    },
    {
      position: "Freelance Android Developer",
      company: "SMKN 4 Jeneponto",
      period: "Okt 2023 - Dec 2023",
      description:
        "Developed and maintained Android applications for school needs using Kotlin, Collaborated with the school to ensure the app met functional requirements.",
    },
  ];

  const education = [
    {
      degree: "Bachelor's in Informatics and Computer Engineering Education",
      institution: "Universitas Negeri Makassar",
      period: "2020 - 2024",
      description:
        "Focused on computer science education, software development, and IT fundamentals. Completed a final project related to educational technology and application development.",
    },
    {
      degree: "Fullstack JavaScript Bootcamp",
      institution: "Hacktiv8",
      period: "Des 2024 - Apr 2025",
      description:
        "An intensive bootcamp covering fullstack web development using JavaScript, including technologies like React, Node.js, Express, and MongoDB. Built several real-world projects and collaborated in team-based coding assignments.",
    },
  ];

  const technologies = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Kotlin",
    "Java",
    "Android Studio",
    "Jetpack Compose",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Redux",
    "Git",
    "GitHub",
    "Firebase",
    "Firestore",
    "Firebase Authentication",
    "Firebase Storage",
    "REST API",
    "GraphQL",
    "Jest",
    "CI/CD",
    "Vercel",
    "Netlify",
    "Figma",
    "Material UI",
    "Bootstrap",
    "Framer Motion",
    "Glide",
    "Picasso",
    "Retrofit",
  ];

  const heroVariants = {
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

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-bgDark" : "bg-bgLight"}`}
      ref={containerRef}
    >
      <section
        className={`py-16 md:py-24 relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-b from-gray-900 to-bgDark"
            : "bg-gradient-to-b from-gray-100 to-bgLight"
        }`}
        ref={heroRef}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute w-96 h-96 rounded-full blur-3xl ${
              isDark ? "bg-primary" : "bg-primaryInLight"
            } opacity-5 -top-48 -right-48`}
          />
          <div
            className={`absolute w-96 h-96 rounded-full blur-3xl ${
              isDark ? "bg-blue-500" : "bg-blue-300"
            } opacity-5 -bottom-48 -left-48`}
          />
          <div
            className={`absolute inset-0 opacity-10 ${
              isDark ? "bg-grid-white/5" : "bg-grid-black/5"
            }`}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row gap-8 md:gap-12"
            variants={heroVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            transsition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Lanyard container - modified for proper positioning */}
            <motion.div
              className="w-full md:w-1/3 flex flex-col items-center md:order-2 relative"
              variants={itemVariants}
            >
              {/* Increased z-index and added relative positioning */}
              <div className="relative z-30 w-full flex justify-center items-center">
                {/* Decorative frame elements - adjusted to not overlap Lanyard */}
                <div
                  className={`absolute rounded-xl ${
                    isDark ? "border-primary" : "border-primaryInLight"
                  } border-2 opacity-20 w-4/5 h-4/5 top-8 -left-4 z-10`}
                />

                <div
                  className={`absolute rounded-xl ${
                    isDark ? "border-blue-500" : "border-blue-400"
                  } border-2 opacity-20 w-4/5 h-4/5 -top-4 left-8 z-10`}
                />

                {/* We'll modify this part to add the delay */}
                <div className="relative z-40 flex justify-center items-center w-full">
                  <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
                </div>
              </div>

              {/* Mobile scroll indicator - only shown on mobile */}
              {isMobile && (
                <motion.div
                  className="absolute bottom-[600px] "
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
                    href="#skills"
                    className={`flex flex-col items-center ${
                      isDark
                        ? "text-gray-400 hover:text-primary"
                        : "text-gray-500 hover:text-primaryInLight"
                    } transition-colors`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-3xl sm:text-sm font-medium mb-1">
                      Scroll Down
                    </span>
                    <motion.div
                      className={`w-28 h-28 sm:w-10 sm:h-10 rounded-full ${
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
                      <ChevronDown size={isSmallMobile ? 24 : 42} />
                    </motion.div>
                  </motion.a>
                </motion.div>
              )}
            </motion.div>

            {/* Content section */}
            <motion.div
              className="w-full md:w-2/3 text-center md:text-left md:order-1"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center gap-2 mb-4 justify-center md:justify-start"
                variants={itemVariants}
              >
                <div
                  className={`h-1 w-12 ${
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
              </motion.div>

              <motion.h1
                className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
                variants={itemVariants}
              >
                I'm
                <span
                  className={` text-transparent bg-clip-text bg-gradient-to-r ${
                    isDark
                      ? "from-primary via-blue-400 to-cyan-400"
                      : "from-primaryInLight via-teal-400 to-sky-500"
                  }`}
                >
                  {" "}
                  Rian Farhan
                </span>
                , <br />
                <div className="inline-block">
                  <RotatingText
                    texts={[
                      "Software Engineer",
                      "Full Stack Developer",
                      "UI/UX Enthusiast",
                      "Mobile Developer",
                      "Problem Solver",
                      "Tech Enthusiast",
                      "AI Prompter",
                    ]}
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={4000}
                  />
                </div>
              </motion.h1>

              <motion.p
                className={`${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-6 text-lg leading-relaxed`}
                variants={itemVariants}
              >
                With over 3 years of experience, I specialize in creating modern
                web and mobile applications that combine clean code with
                exceptional user experiences. My journey in tech began with a
                passion for solving problems through code, and that passion
                continues to drive my work today.
              </motion.p>

              <motion.p
                className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-8`}
                variants={itemVariants}
              >
                I enjoy working on challenging projects that push my skills to
                new heights. When I'm not coding, you'll find me exploring new
                technologies, contributing to open-source projects, or sharing
                my knowledge through technical writing.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 justify-center md:justify-start"
                variants={itemVariants}
              >
                <a
                  href="/rianCV.pdf"
                  download="Rian_Farhan_CV.pdf"
                  className={`flex items-center gap-2 px-6 py-3 ${
                    isDark
                      ? "bg-gradient-to-r from-primary to-blue-500"
                      : "bg-gradient-to-r from-primaryInLight to-blue-600"
                  } text-white rounded-lg font-medium shadow-lg transition-all group`}
                >
                  <Download size={18} />
                  <span>Download CV</span>
                </a>

                <div className="flex gap-4">
                  <a
                    href="https://github.com/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full ${
                      isDark
                        ? "bg-gray-800 text-gray-400 hover:text-primary hover:border-primary"
                        : "bg-gray-200 text-gray-600 hover:text-primaryInLight hover:border-primaryInLight"
                    } flex items-center justify-center transition-colors border-2 border-transparent`}
                  >
                    <Github size={22} />
                  </a>
                  <a
                    href="https://linkedin.com/in/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full ${
                      isDark
                        ? "bg-gray-800 text-gray-400 hover:text-primary hover:border-primary"
                        : "bg-gray-200 text-gray-600 hover:text-primaryInLight hover:border-primaryInLight"
                    } flex items-center justify-center transition-colors border-2 border-transparent`}
                  >
                    <Linkedin size={22} />
                  </a>
                  <a
                    href="mailto:email@example.com"
                    className={`w-12 h-12 rounded-full ${
                      isDark
                        ? "bg-gray-800 text-gray-400 hover:text-primary hover:border-primary"
                        : "bg-gray-200 text-gray-600 hover:text-primaryInLight hover:border-primaryInLight"
                    } flex items-center justify-center transition-colors border-2 border-transparent`}
                  >
                    <Mail size={22} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <div className={`${isMobile ? "pt-10" : ""}`}>
          <TechScroll />
        </div>

        {/* Desktop scroll indicator - only shown on desktop */}
        {!isMobile && (
          <motion.div
            className="absolute bottom-60 left-1/2 transform -translate-x-1/2"
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
              href="#skills"
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
        )}
      </section>

      {/* Skills Section with Dock */}
      <section
        className={`py-16 ${isDark ? "bg-bgDark" : "bg-bgLight"} relative`}
        ref={skillsRef}
        id="skills"
      >
        {/* Add a subtle gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute w-96 h-96 rounded-full blur-3xl ${
              isDark ? "bg-primary" : "bg-primaryInLight"
            } opacity-5 top-1/3 -right-48`}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <motion.h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={
                skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5 }}
            >
              My{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDark
                    ? "from-primary to-blue-400"
                    : "from-primaryInLight to-blue-500"
                }`}
              >
                Skills & Expertise
              </span>
            </motion.h2>
            <motion.div
              className="w-24 h-1 mx-auto rounded-full mb-6"
              style={{
                background: isDark
                  ? "linear-gradient(to right, #00adb5, #3a86ff)"
                  : "linear-gradient(to right, #14b8a6, #3a86ff)",
              }}
              initial={{ opacity: 0, width: 0 }}
              animate={
                skillsInView
                  ? { opacity: 1, width: 96 }
                  : { opacity: 0, width: 0 }
              }
              transition={{ duration: 0.5, delay: 0.2 }}
            ></motion.div>
            <motion.p
              className={`max-w-xl mx-auto ${
                isDark ? "text-gray-400" : "text-gray-600"
              } mb-10`}
              initial={{ opacity: 0 }}
              animate={skillsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              I'm constantly expanding my toolkit to create better digital
              experiences. Here are the areas where I specialize:
            </motion.p>
          </div>

          {/* Enhanced skill cards with hover effect to show progress bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-xl ${
                  isDark
                    ? "bg-gray-800/50 border border-gray-700 hover:border-primary/50"
                    : "bg-white/50 border border-gray-200 hover:border-primaryInLight/50"
                } transition-all duration-300 hover:shadow-lg group relative overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5 }}
                onMouseEnter={() => setHoveredSkill(index)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div className="flex flex-col items-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      isDark
                        ? "bg-gray-700 group-hover:bg-gray-700/80"
                        : "bg-gray-100 group-hover:bg-gray-50"
                    } transition-colors duration-300`}
                  >
                    {skill.icon}
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      isDark ? "text-white" : "text-gray-800"
                    } group-hover:${
                      isDark ? "text-primary" : "text-primaryInLight"
                    } transition-colors duration-300`}
                  >
                    {skill.label}
                  </h3>
                </div>

                <p
                  className={`text-center text-sm mb-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {skill.description}
                </p>

                {/* Skill level indicators - only visible when hovered */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredSkill === index ? 1 : 0,
                    height: hoveredSkill === index ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {index === 0 && (
                    <>
                      <SkillBar
                        label="React/Next.js"
                        percentage={90}
                        isDark={isDark}
                      />
                      <SkillBar
                        label="JavaScript/TypeScript"
                        percentage={85}
                        isDark={isDark}
                      />
                      <SkillBar
                        label="HTML/CSS"
                        percentage={95}
                        isDark={isDark}
                      />
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <SkillBar
                        label="React Native"
                        percentage={80}
                        isDark={isDark}
                      />
                      <SkillBar
                        label="Kotlin"
                        percentage={75}
                        isDark={isDark}
                      />
                      <SkillBar label="Swift" percentage={65} isDark={isDark} />
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <SkillBar label="Figma" percentage={85} isDark={isDark} />
                      <SkillBar
                        label="Tailwind CSS"
                        percentage={90}
                        isDark={isDark}
                      />
                      <SkillBar
                        label="UX Research"
                        percentage={75}
                        isDark={isDark}
                      />
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <SkillBar
                        label="Node.js"
                        percentage={85}
                        isDark={isDark}
                      />
                      <SkillBar
                        label="Databases"
                        percentage={80}
                        isDark={isDark}
                      />
                      <SkillBar
                        label="API Design"
                        percentage={90}
                        isDark={isDark}
                      />
                    </>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section
        className={`py-16 relative ${
          isDark ? "bg-gray-900/50" : "bg-gray-100/50"
        }`}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute w-96 h-96 rounded-full blur-3xl ${
              isDark ? "bg-primary" : "bg-primaryInLight"
            } opacity-5 top-1/4 -left-48`}
          />
          <div
            className={`absolute inset-0 opacity-5 ${
              isDark ? "bg-grid-white/5" : "bg-grid-black/5"
            }`}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Experience */}
            <div ref={expRef}>
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={
                  expInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.5 }}
              >
                <Briefcase
                  size={24}
                  className={isDark ? "text-primary" : "text-primaryInLight"}
                />
                <h2
                  className={`text-2xl md:text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Work Experience
                </h2>
              </motion.div>

              <div className="pl-4">
                {experiences.map((exp, index) => (
                  <ExperienceItem
                    key={index}
                    position={exp.position}
                    company={exp.company}
                    period={exp.period}
                    description={exp.description}
                    index={index}
                    inView={expInView}
                  />
                ))}
              </div>
            </div>

            {/* Education */}
            <div ref={eduRef}>
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={
                  eduInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                }
                transition={{ duration: 0.5 }}
              >
                <GraduationCap
                  size={24}
                  className={isDark ? "text-blue-400" : "text-blue-600"}
                />
                <h2
                  className={`text-2xl md:text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Education
                </h2>
              </motion.div>

              <div className="pl-4">
                {education.map((edu, index) => (
                  <EducationItem
                    key={index}
                    degree={edu.degree}
                    institution={edu.institution}
                    period={edu.period}
                    description={edu.description}
                    index={index}
                    inView={eduInView}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Technologies Section */}
      <section
        className={`py-16 ${isDark ? "bg-bgDark" : "bg-bgLight"}`}
        ref={techRef}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <motion.h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={
                techInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5 }}
            >
              Technologies
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDark
                    ? "from-primary to-blue-400"
                    : "from-primaryInLight to-blue-500"
                }`}
              >
                {" "}
                I Work With
              </span>
            </motion.h2>
            <motion.div
              className="w-24 h-1 mx-auto rounded-full mb-6"
              style={{
                background: isDark
                  ? "linear-gradient(to right, #00adb5, #3a86ff)"
                  : "linear-gradient(to right, #14b8a6, #3a86ff)",
              }}
              initial={{ opacity: 0, width: 0 }}
              animate={
                techInView
                  ? { opacity: 1, width: 96 }
                  : { opacity: 0, width: 0 }
              }
              transition={{ duration: 0.5, delay: 0.2 }}
            ></motion.div>
          </div>

          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={techInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {technologies.map((tech, index) => (
              <TechBadge
                key={index}
                text={tech}
                index={index}
                inView={techInView}
              />
            ))}
          </motion.div>
        </div>
      </section>
      {/* Call to Action */}
      <section
        className={`py-16 ${
          isDark ? "bg-gray-900" : "bg-gray-100"
        } relative overflow-hidden`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute w-96 h-96 rounded-full blur-3xl ${
              isDark ? "bg-primary" : "bg-primaryInLight"
            } opacity-5 -bottom-48 -right-48`}
          />
          <div
            className={`absolute w-96 h-96 rounded-full blur-3xl ${
              isDark ? "bg-blue-500" : "bg-blue-300"
            } opacity-5 -top-48 -left-48`}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className={`text-center max-w-3xl mx-auto ${
              isDark ? "text-white" : "text-gray-800"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Interested in working together?
            </h2>
            <p className={`mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              I'm always open to discussing new projects, creative ideas or
              opportunities to be part of your vision.
            </p>
            <Link
              to={"/contact"}
              className={`inline-flex items-center gap-2 px-8 py-3 ${
                isDark
                  ? "bg-gradient-to-r from-primary to-blue-500"
                  : "bg-gradient-to-r from-primaryInLight to-blue-600"
              } text-white rounded-lg font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105`}
            >
              Let's Talk
            </Link>
          </motion.div>
        </div>
      </section>
      <style jsx="true" global="true">{`
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
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
      `}</style>
    </div>
  );
}
