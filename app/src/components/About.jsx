"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code,
  Coffee,
  BookOpen,
  Lightbulb,
  Briefcase,
  GraduationCap,
  Download,
  Github,
  Linkedin,
  Mail,
  Server,
  Smartphone,
  Layout,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import aboutImage from "../assets/foto-nobg.png"; // Replace with your actual image path

const SkillCard = ({ icon, title, description, index, inView }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`flex flex-col items-center p-6 rounded-xl shadow-lg ${
        isDark
          ? "bg-gray-800/80 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -5,
        boxShadow: isDark
          ? "0 15px 30px rgba(0, 0, 0, 0.4)"
          : "0 15px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
          isDark
            ? "bg-gradient-to-br from-primary to-blue-500"
            : "bg-gradient-to-br from-primaryInLight to-blue-500"
        } text-white`}
      >
        {icon}
      </div>
      <h3
        className={`text-lg font-bold mb-2 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-center text-sm ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
};

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
  const containerRef = useRef(null);

  const [heroRef, heroInView] = useInView({
    triggerOnce: false,
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
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const skills = [
    {
      icon: <Code size={24} />,
      title: "Web Development",
      description:
        "Creating responsive and interactive web applications using modern frameworks and technologies.",
    },
    {
      icon: <Smartphone size={24} />,
      title: "Mobile Development",
      description:
        "Building native and cross-platform mobile applications for Android and iOS.",
    },
    {
      icon: <Layout size={24} />,
      title: "UI/UX Design",
      description:
        "Designing intuitive user interfaces and experiences that are both functional and beautiful.",
    },
    {
      icon: <Server size={24} />,
      title: "Backend Development",
      description:
        "Implementing robust server-side solutions, APIs, and database architectures.",
    },
  ];

  const experiences = [
    {
      position: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      period: "Jan 2023 - Present",
      description:
        "Leading the frontend development team in creating modern, responsive web applications using React and Next.js. Implementing best practices for performance optimization and accessibility.",
    },
    {
      position: "Mobile Developer",
      company: "App Solutions",
      period: "Mar 2021 - Dec 2022",
      description:
        "Developed and maintained native Android applications using Kotlin. Collaborated with design and product teams to deliver high-quality user experiences.",
    },
    {
      position: "Junior Web Developer",
      company: "Digital Creations",
      period: "Jun 2019 - Feb 2021",
      description:
        "Built responsive websites and web apps using HTML, CSS, JavaScript, and React. Worked in an agile team environment and participated in code reviews.",
    },
  ];

  const education = [
    {
      degree: "BS in Computer Science",
      institution: "University of Technology",
      period: "2015 - 2019",
      description:
        "Focused on software engineering and web development. Graduated with honors and completed a thesis on efficient algorithms for mobile applications.",
    },
    {
      degree: "Web Development Bootcamp",
      institution: "CodeCamp Academy",
      period: "2019",
      description:
        "Intensive 12-week program covering modern web development practices, frameworks and tools including React, Node.js, and database management.",
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
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Redux",
    "Git",
    "Firebase",
    "REST API",
    "GraphQL",
    "Jest",
    "CI/CD",
  ];

  const heroVariants = {
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

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-bgDark" : "bg-bgLight"}`}
      ref={containerRef}
    >
      {/* Hero Section */}
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
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
            variants={heroVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            {/* Image section */}
            <motion.div
              className="w-full md:w-1/3 flex justify-center md:order-2"
              variants={itemVariants}
            >
              <div className="relative">
                {/* Decorative elements */}
                <div
                  className={`absolute rounded-xl ${
                    isDark ? "border-primary" : "border-primaryInLight"
                  } border-2 opacity-20 w-full h-full top-4 -left-4`}
                />

                <div
                  className={`absolute rounded-xl ${
                    isDark ? "border-blue-500" : "border-blue-400"
                  } border-2 opacity-20 w-full h-full -top-4 left-4`}
                />

                {/* Main image */}
                <div
                  className={`relative rounded-xl overflow-hidden ${
                    isDark
                      ? "bg-gradient-to-br from-primary via-blue-500 to-purple-500"
                      : "bg-gradient-to-br from-primaryInLight via-blue-500 to-purple-400"
                  } p-1.5 shadow-2xl`}
                  style={{
                    width: "280px",
                    height: "350px",
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
                      className={`w-full h-full object-cover rounded-xl ${
                        isDark
                          ? "filter grayscale hover:grayscale-0 transition-all duration-500"
                          : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
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
                , Full Stack Developer
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
      </section>

      {/* Skills Section */}
      <section
        className={`py-16 ${isDark ? "bg-bgDark" : "bg-bgLight"}`}
        ref={skillsRef}
      >
        <div className="container mx-auto px-4 sm:px-6">
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
              }`}
              initial={{ opacity: 0 }}
              animate={skillsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              I'm constantly expanding my toolkit to create better digital
              experiences. Here are the areas where I specialize:
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <SkillCard
                key={index}
                icon={skill.icon}
                title={skill.title}
                description={skill.description}
                index={index}
                inView={skillsInView}
              />
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
            <a
              href="#contact"
              className={`inline-flex items-center gap-2 px-8 py-3 ${
                isDark
                  ? "bg-gradient-to-r from-primary to-blue-500"
                  : "bg-gradient-to-r from-primaryInLight to-blue-600"
              } text-white rounded-lg font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105`}
            >
              Let's Talk
            </a>
          </motion.div>
        </div>
      </section>

      {/* Add CSS animations similar to Hero component */}
      <style jsx global>{`
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
