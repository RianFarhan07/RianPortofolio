// CertificatesPreview.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ArrowRight,
  Award,
  ExternalLink,
  Calendar,
  Tag,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

// Sample certificates data
const certificates = [
  {
    id: 1,
    title: "Advanced React & Redux",
    issuer: "Udemy",
    image: "/certificates/react-redux.jpg",
    issueDate: "November 2023",
    credentialId: "UC-12345678",
    category: "frontend",
    credentialUrl: "https://udemy.com/certificate/UC-12345678/",
    skills: ["React", "Redux", "React Router", "Redux Thunk"],
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    issuer: "freeCodeCamp",
    image: "/certificates/fullstack.jpg",
    issueDate: "August 2023",
    credentialId: "FCC-98765432",
    category: "fullstack",
    credentialUrl: "https://freecodecamp.org/certification/user/fullstack",
    skills: ["JavaScript", "Node.js", "MongoDB", "Express"],
  },
  {
    id: 3,
    title: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    image: "/certificates/aws-dev.jpg",
    issueDate: "March 2024",
    credentialId: "AWS-DEV-1234567",
    category: "cloud",
    credentialUrl: "https://aws.amazon.com/verification",
    skills: ["AWS Lambda", "S3", "DynamoDB", "CloudFormation"],
  },
  {
    id: 4,
    title: "UX/UI Design Fundamentals",
    issuer: "Interaction Design Foundation",
    image: "/certificates/uxui.jpg",
    issueDate: "January 2024",
    credentialId: "IDF-87654321",
    category: "design",
    credentialUrl: "https://www.interaction-design.org/certificates/87654321",
    skills: ["Wireframing", "Prototyping", "User Research", "UI Design"],
  },
];

export default function CertificatesPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
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

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((prev) =>
          prev === certificates.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, certificates.length]);

  const handleCertificateClick = (index) => {
    setActiveIndex(index);
    setAutoplay(false);
  };

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

  const currentCertificate = certificates[activeIndex];

  return (
    <section
      id="certificates-preview"
      className={`py-16 md:py-24 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-bgDark via-gray-800/50 to-bgDark"
          : "bg-gradient-to-br from-bgLight via-blue-50/50 to-bgLight"
      }`}
      ref={ref}
    >
      {/* Background decor */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          } opacity-5 -top-48 -left-48`}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          } opacity-5 -bottom-48 -right-48`}
        />
        <div
          className={`absolute inset-0 opacity-10 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4 justify-center">
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
              Certificates
            </span>
            <div
              className={`h-1 w-8 md:w-12 ${
                isDark ? "bg-primary" : "bg-primaryInLight"
              } rounded-full`}
            ></div>
          </div>

          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Professional{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDark
                  ? "from-primary to-blue-400"
                  : "from-primaryInLight to-blue-500"
              }`}
            >
              Certifications
            </span>
          </h2>
        </motion.div>

        {/* Certificate Showcase */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Left side - Selected Certificate */}
          <motion.div
            className="md:col-span-7 order-2 md:order-1"
            variants={itemVariants}
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <div
              className={`relative rounded-xl overflow-hidden shadow-xl ${
                isDark ? "bg-gray-900" : "bg-white"
              } h-full`}
            >
              {/* Certificate Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.img
                  src={currentCertificate.image || "/placeholder.svg"}
                  alt={currentCertificate.title}
                  className="w-full h-full object-cover"
                  key={currentCertificate.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Certificate Issuer Overlay */}
                <div
                  className={`absolute bottom-0 right-0 ${
                    isDark ? "bg-gray-900/80" : "bg-white/80"
                  } backdrop-blur-sm py-2 px-4 m-4 rounded-lg flex items-center gap-2`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Issued by:
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      isDark ? "text-primary" : "text-primaryInLight"
                    }`}
                  >
                    {currentCertificate.issuer}
                  </span>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-6">
                <h3
                  className={`text-xl md:text-2xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {currentCertificate.title}
                </h3>

                {/* Certificate Meta */}
                <div
                  className={`flex flex-wrap gap-4 mb-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span className="text-sm">
                      {currentCertificate.issueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag size={16} />
                    <span className="text-sm">
                      ID: {currentCertificate.credentialId}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-5">
                  <h4
                    className={`text-sm font-semibold mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Skills & Knowledge
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentCertificate.skills.map((skill, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          isDark
                            ? "bg-gray-800 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <CheckCircle size={12} />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <a
                  href={currentCertificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg ${
                    isDark
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-primaryInLight text-white hover:bg-primaryInLight/90"
                  } transition-colors`}
                >
                  <ExternalLink size={14} />
                  Verify Certificate
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right side - Certificate List */}
          <motion.div
            className="md:col-span-5 order-1 md:order-2"
            variants={itemVariants}
          >
            <div
              className={`p-6 rounded-xl ${
                isDark ? "bg-gray-900/50" : "bg-white/50"
              } backdrop-blur-sm border ${
                isDark ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Featured Certifications
              </h3>

              <div className="space-y-3">
                {certificates.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      activeIndex === index
                        ? isDark
                          ? "bg-gray-800 border-l-4 border-primary"
                          : "bg-gray-100 border-l-4 border-primaryInLight"
                        : isDark
                        ? "hover:bg-gray-800/50"
                        : "hover:bg-gray-100/50"
                    }`}
                    onClick={() => handleCertificateClick(index)}
                  >
                    <div
                      className={`flex-shrink-0 p-2 rounded-full ${
                        activeIndex === index
                          ? isDark
                            ? "bg-primary/20 text-primary"
                            : "bg-primaryInLight/20 text-primaryInLight"
                          : isDark
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <Award size={20} />
                    </div>
                    <div className="flex-grow">
                      <h4
                        className={`font-medium text-sm ${
                          isDark ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {cert.title}
                      </h4>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {cert.issuer} • {cert.issueDate}
                      </p>
                    </div>
                    {activeIndex === index && (
                      <div
                        className={`flex-shrink-0 h-2 w-2 rounded-full ${
                          isDark ? "bg-primary" : "bg-primaryInLight"
                        } animate-pulse`}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-6">
                <Link
                  to="/certificates"
                  className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg ${
                    isDark
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  } transition-colors font-medium text-sm group`}
                >
                  View All Certificates
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
