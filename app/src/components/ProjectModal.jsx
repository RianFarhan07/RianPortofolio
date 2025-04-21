import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Globe,
  Github,
  ExternalLink,
  Filter,
  Laptop,
  Smartphone,
  FileCheck,
  X,
  Clock,
  ChevronRight,
  ChevronLeft,
  PenTool,
} from "lucide-react";

const categories = [
  { value: "all", label: "All", icon: <Filter size={18} /> },
  { value: "web", label: "Web Apps", icon: <Globe size={18} /> },
  { value: "android", label: "Mobile Apps", icon: <Smartphone size={18} /> },
  { value: "desktop", label: "Desktop Apps", icon: <Laptop size={18} /> },
  { value: "desain", label: "Desain", icon: <PenTool size={18} /> },
];

export const ProjectModal = ({ project, isOpen, onClose, isDark }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // gabung image dan images
  const projectImages = project.images
    ? [project.image, ...(project.images || [])]
    : [project.image];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!isOpen) return null;

  // biar gabisa di scroll pas modal kebuka
  if (isOpen && typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
  }

  const handleClose = () => {
    document.body.style.overflow = "unset";
    setCurrentImageIndex(0);
    onClose();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === projectImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? projectImages.length - 1 : prev - 1
    );
  };

  const categoryLabel =
    categories.find((cat) => cat.value === project.category)?.label ||
    project.category;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        ></div>

        {/* Content */}
        <motion.div
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            isDark ? "bg-gray-900" : "bg-white"
          }`}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
              isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors`}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Image Gallery */}
          <div className="relative aspect-video w-full overflow-hidden">
            <div className="absolute inset-0 flex">
              {projectImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img || "/placeholder.svg"}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className={`w-full h-full transition-opacity duration-300 ${
                    idx === currentImageIndex
                      ? "opacity-100"
                      : "opacity-0 absolute"
                  } object-contain object-center bg-black`}
                />
              ))}
            </div>

            {/* navigasi */}
            {projectImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>

                {/* jumlah image */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {currentImageIndex + 1} / {projectImages.length}
                </div>
              </>
            )}

            {/* badge category */}
            <div className="absolute top-4 left-4">
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-black/50 text-white">
                {categoryLabel}
              </span>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {project.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  {project.featured && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isDark
                          ? "bg-primary/90 text-white"
                          : "bg-primaryInLight/90 text-white"
                      } flex items-center gap-1`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                      Featured
                    </span>
                  )}
                  {project.completed !== undefined && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        project.completed
                          ? isDark
                            ? "bg-green-800/70 text-green-100"
                            : "bg-green-600/70 text-white"
                          : isDark
                          ? "bg-yellow-800/70 text-yellow-100"
                          : "bg-yellow-600/70 text-white"
                      } flex items-center gap-1`}
                    >
                      <FileCheck size={14} className="inline mr-1" />
                      {project.completed ? "Completed" : "In Progress"}
                    </span>
                  )}
                  {project.duration && (
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Clock size={14} className="inline mr-1" />
                      Duration: {project.duration}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDark
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    aria-label="View Source Code"
                  >
                    <Github size={18} />
                    Source
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDark
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-primaryInLight text-white hover:bg-primaryInLight/90"
                    }`}
                    aria-label="View Live Demo"
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Deskripsi Full */}
            <div
              className={`mb-8 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              <h3
                className={`text-lg font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Overview
              </h3>
              <p className="mb-4">{project.description}</p>
            </div>

            {/* Fitur Kunci */}
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <div className="mb-8">
                <h3
                  className={`text-lg font-semibold mb-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Key Features
                </h3>
                <ul
                  className={`list-disc pl-5 space-y-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {project.keyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            {project.techLogos && project.techLogos.length > 0 && (
              <div className="mb-8">
                <h3
                  className={`text-lg font-semibold mb-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Technologies Used
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  {project.techLogos.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        isDark
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges and Solutions */}
            {project.challengesAndSolutions && (
              <div className="mb-8">
                <h3
                  className={`text-lg font-semibold mb-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Challenges & Solutions
                </h3>
                <div
                  className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  <p>{project.challengesAndSolutions}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
