import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Download,
  Calendar,
  Code,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Github,
  Linkedin,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import fotoRian from "../assets/foto-nobg.png";

export default function About({ fullPage = false }) {
  const skillsRef = useRef(null);
  const bioRef = useRef(null);
  const isSkillsInView = useInView(skillsRef, { once: true, amount: 0.2 });
  const isBioInView = useInView(bioRef, { once: true, amount: 0.2 });
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expandedEducation, setExpandedEducation] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const skills = [
    { name: "Kotlin", level: 90, color: "from-purple-500 to-pink-500" },
    {
      name: "Android Development",
      level: 85,
      color: "from-green-500 to-emerald-500",
    },
    { name: "React", level: 80, color: "from-cyan-500 to-blue-500" },
    { name: "JavaScript", level: 85, color: "from-yellow-500 to-amber-500" },
    { name: "UI/UX Design", level: 75, color: "from-rose-500 to-red-500" },
    { name: "Java", level: 80, color: "from-indigo-500 to-violet-500" },
    { name: "Firebase", level: 70, color: "from-orange-500 to-amber-500" },
    { name: "Node.js", level: 65, color: "from-teal-500 to-green-500" },
  ];

  const education = [
    {
      degree: "Bachelor of Computer Science",
      institution: "University of Indonesia",
      year: "2018 - 2022",
      description:
        "Graduated with honors. Specialized in Mobile and Web Development.",
      achievements: [
        "Developed a mobile application for campus navigation",
        "Participated in Google Developer Student Club",
        "Completed thesis on optimizing Android application performance",
      ],
    },
    {
      degree: "Android Developer Certification",
      institution: "Google Associate Android Developer",
      year: "2021",
      description:
        "Professional certification for Android application development.",
      achievements: [
        "Passed practical exam with distinction",
        "Built a fully functional Android application as part of certification",
        "Demonstrated proficiency in Kotlin and Android SDK",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  const toggleEducation = (index) => {
    if (expandedEducation === index) {
      setExpandedEducation(null);
    } else {
      setExpandedEducation(index);
    }
  };

  return (
    <section
      id="about"
      className={`py-20 ${fullPage ? "min-h-screen pt-32" : ""} ${
        isDark
          ? "bg-gradient-to-b from-gray-800 to-gray-900"
          : "bg-gradient-to-b from-gray-100 to-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-block mb-3">
            <motion.div
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                isDark
                  ? "bg-gray-700 text-cyan-400"
                  : "bg-gray-200 text-primary"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              About Me
            </motion.div>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            } mb-4`}
          >
            Know Who{" "}
            <span className={isDark ? "text-cyan-400" : "text-primary"}>
              I Am
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-6"></div>
          <p
            className={`${
              isDark ? "text-gray-400" : "text-gray-600"
            } max-w-2xl mx-auto text-lg`}
          >
            Passionate developer with expertise in mobile and web technologies,
            focused on creating intuitive and efficient applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-16 items-center">
          {/* Left Column - Profile Photo and Bio */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            ref={bioRef}
          >
            <motion.div
              className="relative mx-auto mb-12 max-w-md"
              variants={itemVariants}
              whileHover={{
                rotate: [0, -1, 1, -1, 0],
                transition: { duration: 0.5 },
              }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <div
                className={`relative rounded-2xl overflow-hidden p-3 ${
                  isDark
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                    : "bg-gradient-to-br from-primary to-blue-600"
                }`}
                style={{
                  boxShadow: isDark
                    ? "0 10px 30px -5px rgba(0, 201, 255, 0.3)"
                    : "0 10px 30px -5px rgba(59, 130, 246, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 z-10 rounded-xl"></div>
                <img
                  src={fotoRian}
                  alt="Rian Farhan"
                  className="w-full h-full object-cover rounded-xl transition-all duration-500"
                  style={{
                    filter: `grayscale(${isHovered ? 0 : 100}%)`,
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.5s ease",
                  }}
                />

                <motion.div
                  className={`absolute bottom-0 right-0 ${
                    isDark
                      ? "bg-gradient-to-r from-blue-600 to-cyan-400"
                      : "bg-gradient-to-r from-blue-600 to-primary"
                  } text-white px-3 py-2 rounded-tr-none rounded-bl-none rounded-tl-md rounded-br-xl shadow-lg z-20 flex items-center gap-2`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                >
                  <Calendar size={16} className="text-white" />
                  <div className="text-sm font-medium">3+ yrs Experience</div>
                </motion.div>
              </div>

              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 flex gap-3 z-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.a
                  href="#"
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isDark
                      ? "bg-gray-800 text-white hover:bg-cyan-500"
                      : "bg-white text-gray-800 hover:bg-primary hover:text-white"
                  } shadow-lg transition-colors`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Github size={18} />
                </motion.a>
                <motion.a
                  href="#"
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isDark
                      ? "bg-gray-800 text-white hover:bg-cyan-500"
                      : "bg-white text-gray-800 hover:bg-primary hover:text-white"
                  } shadow-lg transition-colors`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Linkedin size={18} />
                </motion.a>
                <motion.a
                  href="#"
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isDark
                      ? "bg-gray-800 text-white hover:bg-cyan-500"
                      : "bg-white text-gray-800 hover:bg-primary hover:text-white"
                  } shadow-lg transition-colors`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ExternalLink size={18} />
                </motion.a>
              </motion.div>

              <motion.a
                href="#"
                className={`absolute top-5 left-5 flex items-center gap-2 ${
                  isDark
                    ? "bg-gray-800/90 text-white hover:bg-cyan-500"
                    : "bg-white/90 text-gray-800 hover:bg-primary hover:text-white"
                } px-4 py-2 rounded-lg transition-colors backdrop-blur-sm z-20`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                <span className="text-sm font-medium">Resume</span>
              </motion.a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                } mb-4 flex items-center`}
              >
                <span className="relative">
                  Who am I?
                  <motion.span
                    className={`absolute -bottom-1 left-0 h-1 ${
                      isDark ? "bg-cyan-400" : "bg-primary"
                    } rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                  />
                </span>
              </h3>
              <p
                className={`${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4 leading-relaxed`}
              >
                I'm a passionate Android and Web Developer with over 3 years of
                experience creating innovative applications. My expertise spans
                across mobile development using Kotlin and Java, as well as web
                development with React and JavaScript.
              </p>
              <p
                className={`${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-8 leading-relaxed`}
              >
                I take pride in writing clean, efficient code and creating
                intuitive user interfaces that provide exceptional user
                experiences. I'm constantly learning new technologies and
                staying up-to-date with the latest industry trends.
              </p>

              <motion.div
                className="hidden md:grid grid-cols-2 gap-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.4 },
                  },
                }}
              >
                <motion.div
                  className={`flex items-start gap-4 p-5 rounded-xl ${
                    isDark
                      ? "bg-gray-800/50 hover:bg-gray-800"
                      : "bg-gray-100/50 hover:bg-gray-100"
                  } transition-colors`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      isDark
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                        : "bg-gradient-to-br from-primary to-blue-600"
                    } text-white`}
                  >
                    <Code size={22} />
                  </div>
                  <div>
                    <h4
                      className={`${
                        isDark ? "text-white" : "text-gray-800"
                      } font-semibold text-lg`}
                    >
                      Developer
                    </h4>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Android & Web
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className={`flex items-start gap-4 p-5 rounded-xl ${
                    isDark
                      ? "bg-gray-800/50 hover:bg-gray-800"
                      : "bg-gray-100/50 hover:bg-gray-100"
                  } transition-colors`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      isDark
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                        : "bg-gradient-to-br from-primary to-blue-600"
                    } text-white`}
                  >
                    <Calendar size={22} />
                  </div>
                  <div>
                    <h4
                      className={`${
                        isDark ? "text-white" : "text-gray-800"
                      } font-semibold text-lg`}
                    >
                      Experience
                    </h4>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      3+ Years
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Skills and Education */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            ref={skillsRef}
          >
            <motion.div className="mb-12" variants={itemVariants}>
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                } mb-6 flex items-center`}
              >
                <span className="relative">
                  My Skills
                  <motion.span
                    className={`absolute -bottom-1 left-0 h-1 ${
                      isDark ? "bg-cyan-400" : "bg-primary"
                    } rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                  />
                </span>
              </h3>
              <div className="space-y-5">
                {skills.map((skill, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span
                        className={`${
                          isDark ? "text-white" : "text-gray-800"
                        } font-medium`}
                      >
                        {skill.name}
                      </span>
                      <motion.span
                        className={isDark ? "text-cyan-400" : "text-primary"}
                        initial={{ opacity: 0 }}
                        animate={
                          isSkillsInView ? { opacity: 1 } : { opacity: 0 }
                        }
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                      >
                        {skill.level}%
                      </motion.span>
                    </div>
                    <div
                      className={`h-3 ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      } rounded-full overflow-hidden`}
                    >
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                        initial={{ width: 0 }}
                        animate={
                          isSkillsInView
                            ? { width: `${skill.level}%` }
                            : { width: 0 }
                        }
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                } mb-6 flex items-center`}
              >
                <span className="relative">
                  Education
                  <motion.span
                    className={`absolute -bottom-1 left-0 h-1 ${
                      isDark ? "bg-cyan-400" : "bg-primary"
                    } rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                  />
                </span>
              </h3>
              <div className="space-y-8">
                {education.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`border-l-2 ${
                      isDark ? "border-cyan-400" : "border-primary"
                    } pl-5 relative`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full ${
                        isDark ? "bg-cyan-400" : "bg-primary"
                      } flex items-center justify-center`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isDark ? "bg-gray-900" : "bg-white"
                        }`}
                      ></div>
                    </div>
                    <div className="mb-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold ${
                          isDark
                            ? "bg-gray-800 text-cyan-400"
                            : "bg-gray-100 text-primary"
                        } rounded-full mb-2`}
                      >
                        {item.year}
                      </span>
                      <h4
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.degree}
                      </h4>
                      <p
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } mb-2`}
                      >
                        {item.institution}
                      </p>
                    </div>
                    <p
                      className={`${
                        isDark ? "text-gray-300" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      {item.description}
                    </p>

                    <motion.button
                      className={`flex items-center text-sm ${
                        isDark
                          ? "text-cyan-400 hover:text-cyan-300"
                          : "text-primary hover:text-blue-700"
                      } mt-1 font-medium`}
                      onClick={() => toggleEducation(index)}
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {expandedEducation === index ? (
                        <>
                          <span>Hide details</span>
                          <ChevronUp size={16} className="ml-1" />
                        </>
                      ) : (
                        <>
                          <span>Show details</span>
                          <ChevronDown size={16} className="ml-1" />
                        </>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {expandedEducation === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <ul
                            className={`mt-3 space-y-1 text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.achievements.map((achievement, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start"
                              >
                                <span
                                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                                    isDark ? "bg-cyan-400" : "bg-primary"
                                  } mt-1.5 mr-2`}
                                ></span>
                                {achievement}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
