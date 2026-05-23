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

const Lanyard = ({ isMobile }) => (
  <div
    style={{
      width: isMobile ? 180 : 256,
      height: isMobile ? 180 : 256,
      borderRadius: 16,
      overflow: "hidden",
      margin: "0 auto",
    }}
  >
    <img
      src={rianAnimasi}
      alt="Rian Farhan"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
);

const TechScroll = () => (
  <div style={{ overflow: "hidden", padding: "16px 0" }}>
    <motion.div
      style={{ display: "flex", gap: 32 }}
      animate={{ x: [0, -1000] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {[
        "React",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "Next.js",
        "Tailwind",
        "React",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "Next.js",
        "Tailwind",
      ].map((tech, i) => (
        <span
          key={i}
          style={{
            fontSize: "0.75rem",
            fontFamily: "monospace",
            color: "#6b7280",
            whiteSpace: "nowrap",
          }}
        >
          {tech}
        </span>
      ))}
    </motion.div>
  </div>
);

const ExperienceItem = ({ position, company, period, description, index }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const accent = isDark ? "#00adb5" : "#14b8a6";

  return (
    <motion.div
      ref={ref}
      style={{ position: "relative", paddingLeft: 28, paddingBottom: 32 }}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div style={{ position: "absolute", left: 0, top: 8 }}>
        <motion.div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: accent,
            position: "relative",
            zIndex: 1,
          }}
          whileHover={{ scale: 1.5 }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              backgroundColor: accent,
              filter: "blur(4px)",
              opacity: 0.5,
            }}
          />
        </motion.div>
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            height: "100%",
            background: `linear-gradient(to bottom, ${isDark ? "rgba(0,173,181,0.5)" : "rgba(20,184,166,0.5)"}, transparent)`,
          }}
        />
      </div>

      <motion.div
        style={{
          padding: "16px 20px",
          borderRadius: 12,
          backdropFilter: "blur(12px)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
          backgroundColor: isDark
            ? "rgba(34,40,49,0.5)"
            : "rgba(245,245,245,0.7)",
        }}
        whileHover={{ y: -4, scale: 1.01 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 6,
            gap: 8,
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              fontFamily: "monospace",
              color: isDark ? "#f0f4ff" : "#0a1230",
              margin: 0,
            }}
          >
            <span style={{ color: accent }}>$ </span>
            {position}
          </h3>
          <Terminal size={16} style={{ color: accent, flexShrink: 0 }} />
        </div>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: 4,
            color: isDark ? "rgba(220,230,255,0.7)" : "rgba(10,18,48,0.7)",
          }}
        >
          @ {company}
        </p>
        <p
          style={{
            fontSize: "0.72rem",
            fontFamily: "monospace",
            marginBottom: 10,
            color: isDark ? "rgba(220,230,255,0.35)" : "rgba(10,18,48,0.4)",
          }}
        >
          {period}
        </p>
        <p
          style={{
            fontSize: "0.82rem",
            lineHeight: 1.6,
            margin: 0,
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
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      style={{ position: "relative", paddingLeft: 28, paddingBottom: 32 }}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div style={{ position: "absolute", left: 0, top: 8 }}>
        <motion.div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            position: "relative",
            zIndex: 1,
          }}
          whileHover={{ scale: 1.5 }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              filter: "blur(4px)",
              opacity: 0.5,
            }}
          />
        </motion.div>
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(59,130,246,0.5), transparent)",
          }}
        />
      </div>

      <motion.div
        style={{
          padding: "16px 20px",
          borderRadius: 12,
          backdropFilter: "blur(12px)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
          backgroundColor: isDark
            ? "rgba(34,40,49,0.5)"
            : "rgba(245,245,245,0.7)",
        }}
        whileHover={{ y: -4, scale: 1.01 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 6,
            gap: 8,
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              fontFamily: "monospace",
              color: isDark ? "#f0f4ff" : "#0a1230",
              margin: 0,
            }}
          >
            📚 {degree}
          </h3>
          <GraduationCap
            size={16}
            style={{ color: "#60a5fa", flexShrink: 0 }}
          />
        </div>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: 4,
            color: isDark ? "rgba(220,230,255,0.7)" : "rgba(10,18,48,0.7)",
          }}
        >
          @ {institution}
        </p>
        <p
          style={{
            fontSize: "0.72rem",
            fontFamily: "monospace",
            marginBottom: 10,
            color: isDark ? "rgba(220,230,255,0.35)" : "rgba(10,18,48,0.4)",
          }}
        >
          {period}
        </p>
        <p
          style={{
            fontSize: "0.82rem",
            lineHeight: 1.6,
            margin: 0,
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
  const accent = isDark ? "#00adb5" : "#14b8a6";
  return (
    <div style={{ width: "100%" }} ref={ref}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            fontFamily: "monospace",
            color: isDark ? "rgba(220,230,255,0.5)" : "rgba(10,18,48,0.55)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            fontFamily: "monospace",
            color: accent,
          }}
        >
          {percentage}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.08)",
        }}
      >
        <motion.div
          style={{
            height: 8,
            borderRadius: 4,
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
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const accent = isDark ? "#00adb5" : "#14b8a6";

  return (
    <motion.span
      ref={ref}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        fontSize: "0.8rem",
        fontFamily: "monospace",
        backdropFilter: "blur(8px)",
        backgroundColor: isDark
          ? "rgba(34,40,49,0.6)"
          : "rgba(245,245,245,0.8)",
        color: accent,
        border: `1px solid ${isDark ? "rgba(0,173,181,0.25)" : "rgba(20,184,166,0.3)"}`,
        cursor: "default",
        display: "inline-block",
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ scale: 1.05, y: -2 }}
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
    threshold: 0.1,
  });
  const [skillsRef, skillsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [techRef, techInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const accent = isDark ? "#00adb5" : "#14b8a6";
  const bg = isDark ? "#222831" : "#f5f5f5";
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
          style={{
            position: "absolute",
            inset: 0,
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

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: isMobile ? "80px 20px 40px" : "0 24px",
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? 32 : 48,
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Avatar — mobile: tampil duluan di atas */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Lanyard isMobile={isMobile} />
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <Terminal size={18} style={{ color: accent }} />
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                    color: accent,
                  }}
                >
                  console.log("Hello, World!")
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: isMobile ? "2.4rem" : "clamp(3rem, 6vw, 4.5rem)",
                  fontWeight: 700,
                  color: textPrimary,
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                I'm{" "}
                <span
                  style={{
                    background: isDark
                      ? "linear-gradient(to right, #00adb5, #3b82f6, #a855f7)"
                      : "linear-gradient(to right, #14b8a6, #3b82f6, #a855f7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Rian Farhan
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                style={{
                  fontSize: isMobile
                    ? "1.1rem"
                    : "clamp(1.2rem, 2.5vw, 1.8rem)",
                  fontFamily: "monospace",
                  color: textMuted,
                }}
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
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 100,
                  backgroundColor: isDark
                    ? "rgba(0,173,181,0.08)"
                    : "rgba(20,184,166,0.1)",
                  border: `1px solid ${isDark ? "rgba(0,173,181,0.3)" : "rgba(20,184,166,0.35)"}`,
                  color: accent,
                  width: "fit-content",
                  fontSize: "0.8rem",
                }}
              >
                <Leaf size={14} />
                <span style={{ fontFamily: "monospace" }}>
                  Fullstack Dev @ Carbonethics
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                style={{
                  fontSize: isMobile ? "0.9rem" : "1.05rem",
                  lineHeight: 1.7,
                  color: textMuted,
                  margin: 0,
                }}
              >
                Crafting elegant solutions to complex problems. Specialized in
                building modern web and mobile applications with exceptional
                user experiences.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <a
                  href="/rianCV.pdf"
                  download
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 8,
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                    backdropFilter: "blur(12px)",
                    backgroundColor: isDark
                      ? "rgba(0,173,181,0.08)"
                      : "rgba(20,184,166,0.08)",
                    border: `1px solid ${isDark ? "rgba(0,173,181,0.45)" : "rgba(20,184,166,0.45)"}`,
                    color: accent,
                    textDecoration: "none",
                  }}
                >
                  <Download size={16} />
                  <span>Download CV</span>
                </a>

                <div style={{ display: "flex", gap: 10 }}>
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
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        backdropFilter: "blur(12px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: cardBg,
                        border: `1px solid ${cardBorder}`,
                        color: isDark
                          ? "rgba(220,230,255,0.6)"
                          : "rgba(10,18,48,0.5)",
                        textDecoration: "none",
                        transition: "all 0.2s",
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
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Avatar — desktop: di kanan */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Lanyard isMobile={false} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <a
            href="#skills"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              color: textMuted,
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: "0.72rem", fontFamily: "monospace" }}>
              Scroll Down
            </span>
            <ChevronDown size={18} />
          </a>
        </motion.div>

        <TechScroll />
      </section>

      {/* ── SKILLS SECTION ── */}
      <section
        id="skills"
        style={{
          padding: isMobile ? "60px 0" : "96px 0",
          position: "relative",
          backgroundColor: isDark ? "#030712" : "#ececec",
        }}
        ref={skillsRef}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={skillsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: isMobile ? 32 : 64 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <Sparkles size={22} style={{ color: accent }} />
              <h2
                style={{
                  fontSize: isMobile ? "1.8rem" : "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: textPrimary,
                  margin: 0,
                }}
              >
                <span style={{ color: accent }}>{"<"}</span>
                Skills
                <span style={{ color: accent }}>{" />"}</span>
              </h2>
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                fontFamily: "monospace",
                color: textMuted,
                margin: 0,
              }}
            >
              My technical expertise & capabilities
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: isMobile ? 12 : 24,
            }}
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredSkill(index)}
                onMouseLeave={() => setHoveredSkill(null)}
                style={{
                  padding: isMobile ? "16px 14px" : 24,
                  borderRadius: 16,
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${
                    hoveredSkill === index
                      ? isDark
                        ? "rgba(0,173,181,0.5)"
                        : "rgba(20,184,166,0.5)"
                      : cardBorder
                  }`,
                  backgroundColor: cardBg,
                  transition: "all 0.3s",
                  cursor: "default",
                }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div
                  style={{
                    width: isMobile ? 40 : 56,
                    height: isMobile ? 40 : 56,
                    borderRadius: 12,
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: isMobile ? 10 : 16,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)",
                    border: `1px solid ${cardBorder}`,
                  }}
                >
                  {skill.icon}
                </div>

                <h3
                  style={{
                    fontSize: isMobile ? "0.85rem" : "1.1rem",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: textPrimary,
                    marginBottom: 6,
                  }}
                >
                  {skill.label}
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? "0.72rem" : "0.85rem",
                    color: textMuted,
                    marginBottom: isMobile ? 8 : 16,
                    lineHeight: 1.5,
                  }}
                >
                  {skill.description}
                </p>

                <motion.div
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
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
      <section
        style={{
          padding: isMobile ? "60px 0" : "96px 0",
          backgroundColor: bg,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? 40 : 64,
            }}
          >
            {/* Experience */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                <Briefcase size={24} style={{ color: accent }} />
                <h2
                  style={{
                    fontSize: isMobile ? "1.4rem" : "1.8rem",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: textPrimary,
                    margin: 0,
                  }}
                >
                  Experience
                </h2>
              </motion.div>
              <div>
                {experiences.map((exp, index) => (
                  <ExperienceItem key={index} {...exp} index={index} />
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: isMobile ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                <GraduationCap size={24} style={{ color: "#60a5fa" }} />
                <h2
                  style={{
                    fontSize: isMobile ? "1.4rem" : "1.8rem",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: textPrimary,
                    margin: 0,
                  }}
                >
                  Education
                </h2>
              </motion.div>
              <div>
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
        style={{
          padding: isMobile ? "60px 0" : "96px 0",
          backgroundColor: isDark ? "#030712" : "#ececec",
        }}
        ref={techRef}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={techInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: isMobile ? 28 : 64 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <Zap size={22} style={{ color: accent }} />
              <h2
                style={{
                  fontSize: isMobile ? "1.8rem" : "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: textPrimary,
                  margin: 0,
                }}
              >
                Tech Stack
              </h2>
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                fontFamily: "monospace",
                color: textMuted,
                margin: 0,
              }}
            >
              Tools & technologies I work with daily
            </p>
          </motion.div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: isMobile ? 8 : 12,
            }}
          >
            {technologies.map((tech, index) => (
              <TechBadge key={index} text={tech} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: isMobile ? "60px 0" : "96px 0",
          position: "relative",
          overflow: "hidden",
          backgroundColor: bg,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? "radial-gradient(circle at center, rgba(0,173,181,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(20,184,166,0.08) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}
          >
            <h2
              style={{
                fontSize: isMobile ? "1.8rem" : "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                fontFamily: "monospace",
                color: textPrimary,
                marginBottom: 20,
                lineHeight: 1.3,
              }}
            >
              Let's Build Something{" "}
              <span
                style={{
                  background: isDark
                    ? "linear-gradient(to right, #00adb5, #3b82f6)"
                    : "linear-gradient(to right, #14b8a6, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Amazing
              </span>
            </h2>

            <p
              style={{
                fontSize: isMobile ? "0.9rem" : "1.05rem",
                marginBottom: 32,
                color: textMuted,
                lineHeight: 1.7,
              }}
            >
              I'm always open to discussing new projects, creative ideas or
              opportunities to be part of your vision.
            </p>

            <motion.a
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: isMobile ? "12px 28px" : "14px 32px",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: isMobile ? "0.85rem" : "0.95rem",
                backdropFilter: "blur(12px)",
                backgroundColor: isDark
                  ? "rgba(0,173,181,0.08)"
                  : "rgba(20,184,166,0.08)",
                border: `1px solid ${isDark ? "rgba(0,173,181,0.45)" : "rgba(20,184,166,0.45)"}`,
                color: accent,
                textDecoration: "none",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Terminal size={18} />
              <span>Start a Conversation</span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
