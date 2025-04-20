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
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

import { bestCertificates as certificates } from "../data/bestSertificates";

export default function CertificatesPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

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
      id="certificates"
      className={`py-10 md:py-24 relative overflow-hidden ${
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
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-3 md:mb-4 justify-center">
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

        {/* selecor certificate - kalau di mobile hilang */}
        <motion.div
          className="flex overflow-x-auto pb-4 gap-3 mb-4 md:hidden scrollbar-hide"
          variants={itemVariants}
          onTouchStart={() => setAutoplay(false)}
        >
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              className={`flex-shrink-0 w-64 p-3 rounded-lg cursor-pointer transition-colors ${
                activeIndex === index
                  ? isDark
                    ? "bg-gray-800 border-l-2 border-primary"
                    : "bg-gray-100 border-l-2 border-primaryInLight"
                  : isDark
                  ? "bg-gray-900/50 border border-gray-800"
                  : "bg-white/50 border border-gray-200"
              }`}
              onClick={() => handleCertificateClick(index)}
            >
              <div className="flex items-center gap-3">
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
                  <Award size={18} />
                </div>
                <div className="flex-grow">
                  <h4
                    className={`font-medium text-sm ${
                      isDark ? "text-white" : "text-gray-800"
                    } line-clamp-1`}
                  >
                    {cert.title}
                  </h4>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {cert.issuer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Showcase Sertifikat */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Left side - pilihan sertifikat */}
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
              <div className="relative aspect-[16/9] md:aspect-[4/3] overflow-hidden">
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

                {/* overlay issuer sertifikat*/}
                <div
                  className={`absolute bottom-0 right-0 ${
                    isDark ? "bg-gray-900/80" : "bg-white/80"
                  } backdrop-blur-sm py-1.5 px-3 m-3 md:m-4 rounded-md flex items-center gap-2 text-xs md:text-sm`}
                >
                  <span
                    className={`font-medium ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Issued by:
                  </span>
                  <span
                    className={`font-bold ${
                      isDark ? "text-primary" : "text-primaryInLight"
                    }`}
                  >
                    {currentCertificate.issuer}
                  </span>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-4 md:p-6">
                <h3
                  className={`text-lg md:text-2xl font-bold mb-2 md:mb-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {currentCertificate.title}
                </h3>

                {/* Certificate Meta */}
                <div
                  className={`flex flex-wrap gap-3 mb-3 md:mb-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span className="text-xs md:text-sm">
                      {currentCertificate.issueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} />
                    <span className="text-xs md:text-sm">
                      ID: {currentCertificate.credentialId}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4 md:mb-5">
                  <h4
                    className={`text-xs md:text-sm font-semibold mb-1.5 md:mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Skills & Knowledge
                  </h4>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {currentCertificate.skills.map((skill, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                          isDark
                            ? "bg-gray-800 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <CheckCircle size={10} className="hidden md:inline" />
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
                  className={`inline-flex items-center justify-center gap-1.5 text-xs md:text-sm px-4 py-2 rounded-lg w-full md:w-auto ${
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

          {/* Right side - Certificate List (Hidden on mobile) */}
          <motion.div
            className="md:col-span-5 order-1 md:order-2 hidden md:block"
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

        {/* button view all di mobile */}
        <div className="mt-6 md:hidden">
          <Link
            to="/certificates"
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg ${
              isDark
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } transition-colors font-medium text-sm group`}
          >
            View All Certificates
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
