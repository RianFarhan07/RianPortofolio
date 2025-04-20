import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ArrowLeft, Github, ExternalLink } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { bestProjects as projects } from "../data/bestProjects";
import { TechStackTabs } from "./TechStackTabs";

export default function ProjectPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const sliderRef = useRef(null);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.pageX);
  };

  const handleTouchStart = (e) => {
    setDragging(true);
    setStartX(e.touches[0].pageX);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const currentX = e.pageX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setDragging(false);
    }
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const currentX = e.touches[0].pageX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setDragging(false);
    }
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

  useEffect(() => {
    // Auto-slide setiap 5 detik
    const timer = setInterval(() => {
      if (!dragging) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [dragging]);

  const currentProject = projects[activeIndex];

  return (
    <section
      id="projects"
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
          } opacity-5 -top-48 -right-48`}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          } opacity-5 -bottom-48 -left-48`}
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
              Projects
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
            Featured{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDark
                  ? "from-primary to-blue-400"
                  : "from-primaryInLight to-blue-500"
              }`}
            >
              Projects
            </span>
          </h2>
        </motion.div>

        {/* Slider Container */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div
            ref={sliderRef}
            className="relative overflow-hidden rounded-2xl shadow-xl"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            <div className="relative w-full">
              {/* Project Slider */}
              <div className="relative">
                <motion.div
                  className="flex flex-col md:flex-row md:h-[400px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Image Section */}
                  <div className="w-full md:w-1/2 relative aspect-[4/3] md:h-[500px]">
                    <div
                      className={`absolute inset-0 ${
                        isDark ? "bg-gray-900" : "bg-gray-100"
                      } flex items-center justify-center overflow-hidden`}
                    >
                      <img
                        src={currentProject.image || "/placeholder.svg"}
                        alt={currentProject.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 ${
                          isDark
                            ? "bg-gradient-to-t from-bgDark to-transparent"
                            : "bg-gradient-to-t from-bgLight to-transparent"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div
                    className={`w-full md:w-1/2 p-6 md:p-8 ${
                      isDark ? "bg-gray-900" : "bg-white"
                    } md:h-[400px] overflow-y-auto`}
                  >
                    {/* Nomor Project */}
                    <div className="mb-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isDark
                            ? "bg-primary/20 text-primary"
                            : "bg-primaryInLight/20 text-primaryInLight"
                        }`}
                      >
                        PROJECT {activeIndex + 1}/{projects.length}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3
                      className={`text-xl md:text-2xl font-bold mb-3 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {currentProject.title}
                    </h3>

                    {/* Project Description */}
                    <p
                      className={`mb-4 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {currentProject.description}
                    </p>

                    {/* Technologies */}
                    <div className="mb-6">
                      <TechStackTabs techStack={currentProject.techStack} />
                    </div>

                    {/* Action Buttons muncul ketika ada github URL atau Live Url */}
                    {currentProject.githubUrl ||
                      (currentProject.liveUrl && (
                        <div className="flex flex-wrap gap-3">
                          {currentProject.githubUrl && (
                            <a
                              href={currentProject.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${
                                isDark
                                  ? "bg-gray-800 text-white hover:bg-gray-700"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              } transition-colors`}
                            >
                              <Github size={14} />
                              <span>Source Code</span>
                            </a>
                          )}
                          {currentProject.liveUrl && (
                            <a
                              href={currentProject.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${
                                isDark
                                  ? "bg-primary text-white hover:bg-primary/90"
                                  : "bg-primaryInLight text-white hover:bg-primaryInLight/90"
                              } transition-colors`}
                            >
                              <ExternalLink size={14} />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>
                      ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Slider controls - muncul kalau di atas mobile saja */}
            <div className="hidden sm:block">
              <button
                onClick={prevSlide}
                className={`absolute top-1/2 -translate-y-1/2 left-3 z-10 p-2 rounded-full ${
                  isDark
                    ? "bg-black/50 hover:bg-black/70 text-white"
                    : "bg-white/70 hover:bg-white/90 text-gray-700"
                } transition-colors`}
                aria-label="Previous project"
              >
                <ArrowLeft size={20} />
              </button>

              <button
                onClick={nextSlide}
                className={`absolute top-1/2 -translate-y-1/2 right-3 z-10 p-2 rounded-full ${
                  isDark
                    ? "bg-black/50 hover:bg-black/70 text-white"
                    : "bg-white/70 hover:bg-white/90 text-gray-700"
                } transition-colors`}
                aria-label="Next project"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-4 gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === activeIndex
                    ? isDark
                      ? "bg-primary w-6"
                      : "bg-primaryInLight w-6"
                    : isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* button lihat semua project */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/projects"
            className={`inline-flex items-center gap-2 px-6 py-3 ${
              isDark
                ? "bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
                : "bg-gradient-to-r from-primaryInLight to-blue-600 hover:from-primaryInLight/90 hover:to-blue-600/90"
            } text-white rounded-lg font-medium shadow-lg transition-all group`}
          >
            View All Projects
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
