import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Leaf,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import rianAnimasi from "../assets/rian_animate.png";
import { useTheme } from "../context/ThemeContext";

const RotatingText = ({ texts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [texts.length]);
  return (
    <motion.span
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="font-mono"
    >
      {texts[currentIndex]}
    </motion.span>
  );
};

const Lanyard = () => (
  <div className="w-64 h-64 rounded-2xl overflow-hidden">
    <img
      src={rianAnimasi}
      alt="Rian Farhan"
      className="w-full h-full object-cover"
    />
  </div>
);

const TechScroll = () => (
  <div className="overflow-hidden py-4">
    <motion.div
      className="flex gap-8"
      animate={{ x: [0, -1000] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {["React", "TypeScript", "Node.js", "MongoDB", "Next.js", "Tailwind"].map(
        (tech, i) => (
          <span
            key={i}
            className="text-sm font-mono text-gray-500 whitespace-nowrap"
          >
            {tech}
          </span>
        ),
      )}
    </motion.div>
  </div>
);

const ExperienceItem = ({ position, company, period, description, index }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 pb-12 group"
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="absolute left-0 top-2">
        <motion.div
          className="w-3 h-3 rounded-full relative z-10"
          style={{ backgroundColor: isDark ? "#00adb5" : "#14b8a6" }}
          whileHover={{ scale: 1.5 }}
        >
          <div
            className="absolute inset-0 rounded-full blur-md opacity-50 animate-pulse"
            style={{ backgroundColor: isDark ? "#00adb5" : "#14b8a6" }}
          />
        </motion.div>
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-full"
          style={{
            background: `linear-gradient(to bottom, ${isDark ? "rgba(0,173,181,0.5)" : "rgba(20,184,166,0.5)"}, transparent)`,
          }}
        />
      </div>

      <motion.div
        className="p-6 rounded-xl backdrop-blur-xl border transition-all duration-300"
        style={{
          backgroundColor: isDark
            ? "rgba(34,40,49,0.5)"
            : "rgba(245,245,245,0.7)",
          borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
        }}
        whileHover={{
          y: -5,
          scale: 1.02,
          borderColor: isDark ? "rgba(0,173,181,0.5)" : "rgba(20,184,166,0.5)",
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <h3
            className="text-lg font-bold font-mono"
            style={{ color: isDark ? "#f0f4ff" : "#0a1230" }}
          >
            <span style={{ color: isDark ? "#00adb5" : "#14b8a6" }}>$ </span>
            {position}
          </h3>
          <Terminal
            size={18}
            style={{ color: isDark ? "#00adb5" : "#14b8a6" }}
          />
        </div>
        <p
          className="text-sm font-semibold mb-1"
          style={{
            color: isDark ? "rgba(220,230,255,0.7)" : "rgba(10,18,48,0.7)",
          }}
        >
          @ {company}
        </p>
        <p
          className="text-xs font-mono mb-3"
          style={{
            color: isDark ? "rgba(220,230,255,0.35)" : "rgba(10,18,48,0.4)",
          }}
        >
          {period}
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: isDark ? "rgba(220,230,255,0.55)" : "rgba(10,18,48,0.6)",
          }}
        >
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

const EducationItem = ({ degree, institution, period, description, index }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 pb-12 group"
      initial={{ opacity: 0, x: 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="absolute left-0 top-2">
        <motion.div
          className="w-3 h-3 rounded-full bg-blue-500 relative z-10"
          whileHover={{ scale: 1.5 }}
        >
          <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-50 animate-pulse" />
        </motion.div>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500/50 to-transparent" />
      </div>

      <motion.div
        className="p-6 rounded-xl backdrop-blur-xl border transition-all duration-300"
        style={{
          backgroundColor: isDark
            ? "rgba(34,40,49,0.5)"
            : "rgba(245,245,245,0.7)",
          borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
        }}
        whileHover={{
          y: -5,
          scale: 1.02,
          borderColor: "rgba(59,130,246,0.5)",
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <h3
            className="text-lg font-bold font-mono"
            style={{ color: isDark ? "#f0f4ff" : "#0a1230" }}
          >
            <span>📚 </span>
            {degree}
          </h3>
          <GraduationCap size={18} className="text-blue-400" />
        </div>
        <p
          className="text-sm font-semibold mb-1"
          style={{
            color: isDark ? "rgba(220,230,255,0.7)" : "rgba(10,18,48,0.7)",
          }}
        >
          @ {institution}
        </p>
        <p
          className="text-xs font-mono mb-3"
          style={{
            color: isDark ? "rgba(220,230,255,0.35)" : "rgba(10,18,48,0.4)",
          }}
        >
          {period}
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: isDark ? "rgba(220,230,255,0.55)" : "rgba(10,18,48,0.6)",
          }}
        >
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

const SkillBar = ({ label, percentage, isDark }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  return (
    <div className="w-full" ref={ref}>
      <div className="flex justify-between mb-2">
        <span
          className="text-xs font-mono"
          style={{
            color: isDark ? "rgba(220,230,255,0.5)" : "rgba(10,18,48,0.55)",
          }}
        >
          {label}
        </span>
        <span
          className="text-xs font-mono"
          style={{ color: isDark ? "#00adb5" : "#14b8a6" }}
        >
          {percentage}%
        </span>
      </div>
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{
          backgroundColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.08)",
        }}
      >
        <motion.div
          className="h-2 rounded-full"
          style={{
            background: isDark
              ? "linear-gradient(to right, #00adb5, #3b82f6)"
              : "linear-gradient(to right, #14b8a6, #3b82f6)",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const TechBadge = ({ text, index }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <motion.span
      ref={ref}
      className="px-4 py-2 rounded-lg text-sm font-mono backdrop-blur-sm transition-all duration-300 cursor-default"
      style={{
        backgroundColor: isDark
          ? "rgba(34,40,49,0.6)"
          : "rgba(245,245,245,0.8)",
        color: isDark ? "#00adb5" : "#14b8a6",
        border: `1px solid ${isDark ? "rgba(0,173,181,0.25)" : "rgba(20,184,166,0.3)"}`,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{
        scale: 1.05,
        y: -2,
        borderColor: isDark ? "rgba(0,173,181,0.6)" : "rgba(20,184,166,0.6)",
      }}
    >
      {text}
    </motion.span>
  );
};

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [skillsRef, skillsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [techRef, techInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Theme-aware color helpers
  const accent = isDark ? "#00adb5" : "#14b8a6";
  const bg = isDark ? "#222831" : "#f5f5f5";
  const bgSection = isDark ? "#030712" : "#e8e8e8";
  const textPrimary = isDark ? "#f0f4ff" : "#0a1230";
  const textMuted = isDark ? "rgba(220,230,255,0.45)" : "rgba(10,18,48,0.55)";
  const cardBg = isDark ? "rgba(34,40,49,0.5)" : "rgba(255,255,255,0.6)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const gridLine = isDark ? "#1f2937" : "#dde0e6";

  const skills = [
    {
      icon: <Code size={24} style={{ color: accent }} />,
      label: "Frontend Dev",
      description:
        "Building responsive, interactive web apps with modern frameworks",
      skills: [
        { name: "React/Next.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "HTML/CSS", level: 95 },
      ],
    },
    {
      icon: <Smartphone size={24} style={{ color: accent }} />,
      label: "Mobile Dev",
      description: "Native & cross-platform mobile applications",
      skills: [
        { name: "React Native", level: 80 },
        { name: "Kotlin", level: 75 },
        { name: "Swift", level: 65 },
      ],
    },
    {
      icon: <Layout size={24} style={{ color: accent }} />,
      label: "UI/UX Design",
      description: "Crafting beautiful, intuitive user experiences",
      skills: [
        { name: "Figma", level: 85 },
        { name: "Tailwind CSS", level: 90 },
        { name: "UX Research", level: 75 },
      ],
    },
    {
      icon: <Server size={24} style={{ color: accent }} />,
      label: "Backend Dev",
      description: "Robust APIs & database architectures",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Databases", level: 80 },
        { name: "API Design", level: 90 },
      ],
    },
  ];

  const experiences = [
    {
      position: "IT Support",
      company: "Department of Manpower, Makassar City",
      period: "Des 2022 - Feb 2023",
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
    {
      position: "FullStack Developer Associate Manager",
      company: "Carbonethics",
      period: "Mei 2024 - Now",
      description:
        "Designing, developing, and deploying end-to-end web solutions aligned with sustainability initiatives. Collaborate with stakeholders to gather and translate business requirements into actionable tasks.",
    },
  ];

  const education = [
    {
      degree: "Bachelor's in Informatics",
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
        "An intensive bootcamp covering fullstack web development using JavaScript, including technologies like React, Node.js, Express, and MongoDB.",
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
    "REST API",
    "GraphQL",
    "Jest",
    "Vercel",
    "Figma",
    "Material UI",
    "Framer Motion",
    "Retrofit",
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg }} ref={containerRef}>
      {/* ── HERO SECTION ── */}
      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: bg,
        }}
        ref={heroRef}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
            backgroundSize: "4rem 4rem",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%)",
          }}
        />

        {/* Glowing orbs */}
        <motion.div
          style={{
            y,
            position: "absolute",
            width: 384,
            height: 384,
            borderRadius: "50%",
            filter: "blur(80px)",
            backgroundColor: isDark
              ? "rgba(0,173,181,0.15)"
              : "rgba(20,184,166,0.12)",
            top: -192,
            right: -192,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            width: 384,
            height: 384,
            borderRadius: "50%",
            filter: "blur(80px)",
            backgroundColor: isDark
              ? "rgba(59,130,246,0.12)"
              : "rgba(59,130,246,0.1)",
            bottom: -192,
            left: -192,
          }}
        />

        <div className="container mx-auto px-6 relative z-10 flex items-center min-h-screen">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <Terminal size={20} style={{ color: accent }} />
                <span className="font-mono text-sm" style={{ color: accent }}>
                  console.log("Hello, World!")
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold"
                style={{ color: textPrimary }}
              >
                I'm{" "}
                <span
                  className={
                    isDark
                      ? "bg-gradient-to-r from-[#00adb5] via-blue-500 to-purple-500 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-[#14b8a6] via-blue-500 to-purple-500 bg-clip-text text-transparent"
                  }
                >
                  Rian Farhan
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-mono"
                style={{ color: textMuted }}
              >
                <RotatingText
                  texts={[
                    "Software Engineer",
                    "Full Stack Developer",
                    "UI/UX Enthusiast",
                    "Mobile Developer",
                    "Problem Solver",
                  ]}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: isDark
                    ? "rgba(0,173,181,0.08)"
                    : "rgba(20,184,166,0.1)",
                  border: `1px solid ${isDark ? "rgba(0,173,181,0.3)" : "rgba(20,184,166,0.35)"}`,
                  color: isDark ? "#00adb5" : "#14b8a6",
                }}
              >
                <Leaf size={16} />
                <span className="font-mono text-sm">
                  Fullstack Dev @ Carbonethics
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="text-lg leading-relaxed"
                style={{ color: textMuted }}
              >
                Crafting elegant solutions to complex problems. Specialized in
                building modern web and mobile applications with exceptional
                user experiences.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="/rianCV.pdf"
                  download
                  className="group flex items-center gap-2 px-6 py-3 rounded-lg font-mono backdrop-blur-xl transition-all"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(0,173,181,0.08)"
                      : "rgba(20,184,166,0.08)",
                    border: `1px solid ${isDark ? "rgba(0,173,181,0.45)" : "rgba(20,184,166,0.45)"}`,
                    color: accent,
                  }}
                >
                  <Download size={18} />
                  <span>Download CV</span>
                </a>

                <div className="flex gap-3">
                  {[
                    { icon: Github, href: "https://github.com" },
                    { icon: Linkedin, href: "https://linkedin.com" },
                    { icon: Mail, href: "mailto:email@example.com" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg backdrop-blur-xl flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: cardBg,
                        border: `1px solid ${cardBorder}`,
                        color: isDark
                          ? "rgba(220,230,255,0.6)"
                          : "rgba(10,18,48,0.5)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accent;
                        e.currentTarget.style.color = accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = cardBorder;
                        e.currentTarget.style.color = isDark
                          ? "rgba(220,230,255,0.6)"
                          : "rgba(10,18,48,0.5)";
                      }}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center"
            >
              <Lanyard />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <a
            href="#skills"
            className="flex flex-col items-center gap-2 transition-colors"
            style={{ color: textMuted }}
          >
            <span className="text-xs font-mono">Scroll Down</span>
            <ChevronDown size={20} />
          </a>
        </motion.div>

        <TechScroll />
      </section>

      {/* ── SKILLS SECTION ── */}
      <section
        id="skills"
        className="py-24 relative"
        style={{ backgroundColor: isDark ? "#030712" : "#ececec" }}
        ref={skillsRef}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={skillsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles size={24} style={{ color: accent }} />
              <h2
                className="text-4xl md:text-5xl font-bold font-mono"
                style={{ color: textPrimary }}
              >
                <span style={{ color: accent }}>{"<"}</span>
                Skills
                <span style={{ color: accent }}>{" />"}</span>
              </h2>
            </div>
            <p className="text-lg font-mono" style={{ color: textMuted }}>
              My technical expertise & capabilities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredSkill(index)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300"
                style={{
                  backgroundColor: cardBg,
                  borderColor:
                    hoveredSkill === index
                      ? isDark
                        ? "rgba(0,173,181,0.5)"
                        : "rgba(20,184,166,0.5)"
                      : cardBorder,
                }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div
                  className="w-14 h-14 rounded-xl backdrop-blur-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)",
                    border: `1px solid ${cardBorder}`,
                  }}
                >
                  {skill.icon}
                </div>

                <h3
                  className="text-xl font-bold font-mono mb-2"
                  style={{ color: textPrimary }}
                >
                  {skill.label}
                </h3>
                <p className="text-sm mb-4" style={{ color: textMuted }}>
                  {skill.description}
                </p>

                <motion.div
                  className="space-y-3 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: hoveredSkill === index ? "auto" : 0,
                    opacity: hoveredSkill === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {skill.skills.map((s, i) => (
                    <SkillBar
                      key={i}
                      label={s.name}
                      percentage={s.level}
                      isDark={isDark}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE & EDUCATION ── */}
      <section className="py-24" style={{ backgroundColor: bg }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Experience */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8"
              >
                <Briefcase size={28} style={{ color: accent }} />
                <h2
                  className="text-3xl font-bold font-mono"
                  style={{ color: textPrimary }}
                >
                  Experience
                </h2>
              </motion.div>
              <div className="space-y-2">
                {experiences.map((exp, index) => (
                  <ExperienceItem key={index} {...exp} index={index} />
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8"
              >
                <GraduationCap size={28} className="text-blue-400" />
                <h2
                  className="text-3xl font-bold font-mono"
                  style={{ color: textPrimary }}
                >
                  Education
                </h2>
              </motion.div>
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <EducationItem key={index} {...edu} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section
        id="technologies"
        className="py-24"
        style={{ backgroundColor: isDark ? "#030712" : "#ececec" }}
        ref={techRef}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={techInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap size={24} style={{ color: accent }} />
              <h2
                className="text-4xl md:text-5xl font-bold font-mono"
                style={{ color: textPrimary }}
              >
                Tech Stack
              </h2>
            </div>
            <p className="text-lg font-mono" style={{ color: textMuted }}>
              Tools & technologies I work with daily
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <TechBadge key={index} text={tech} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        {/* Background radial */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(circle at center, rgba(0,173,181,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(20,184,166,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2
              className="text-4xl md:text-5xl font-bold font-mono mb-6"
              style={{ color: textPrimary }}
            >
              Let's Build Something{" "}
              <span
                className={
                  isDark
                    ? "bg-gradient-to-r from-[#00adb5] to-blue-500 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-[#14b8a6] to-blue-500 bg-clip-text text-transparent"
                }
              >
                Amazing
              </span>
            </h2>

            <p className="text-lg mb-8" style={{ color: textMuted }}>
              I'm always open to discussing new projects, creative ideas or
              opportunities to be part of your vision.
            </p>

            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-mono backdrop-blur-xl transition-all"
              style={{
                backgroundColor: isDark
                  ? "rgba(0,173,181,0.08)"
                  : "rgba(20,184,166,0.08)",
                border: `1px solid ${isDark ? "rgba(0,173,181,0.45)" : "rgba(20,184,166,0.45)"}`,
                color: accent,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Terminal size={20} />
              <span>Start a Conversation</span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
