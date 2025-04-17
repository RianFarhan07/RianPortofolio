import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
} from "lucide-react";

export default function ProjectDialog({ project, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const constraintsRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const dialogVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const contentVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30, delay: 0.2 },
    },
    exit: {
      y: 50,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4"
      variants={dialogVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-4xl bg-gray-800 rounded-xl overflow-hidden"
        variants={contentVariants}
        onClick={(e) => e.stopPropagation()}
        ref={constraintsRef}
      >
        <div className="relative">
          {/* Image Slider */}
          <div className="relative aspect-video bg-black">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={
                  project.images[currentImageIndex] ||
                  "/api/placeholder/800/450"
                }
                alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Navigation buttons */}
            {project.images.length > 1 && (
              <>
                <motion.button
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
                  onClick={handlePrevImage}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(0, 173, 181, 0.7)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <motion.button
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
                  onClick={handleNextImage}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(0, 173, 181, 0.7)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </>
            )}

            {/* Image counter */}
            {project.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-3 py-1 text-white text-sm">
                {currentImageIndex + 1} / {project.images.length}
              </div>
            )}

            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
              onClick={onClose}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(255, 50, 50, 0.7)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          </div>

          {/* Project details */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="text-cyan-400 text-sm">{project.category}</p>
              </div>
              <div className="flex space-x-3">
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={16} />
                    <span className="text-sm">GitHub</span>
                  </motion.a>
                )}
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-cyan-600 rounded-lg text-white hover:bg-cyan-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} />
                    <span className="text-sm">Live Demo</span>
                  </motion.a>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                Description
              </h4>
              <p className="text-gray-300">{project.description}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(project.technologies) &&
                  project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm"
                    >
                      {tech}
                    </span>
                  ))}
              </div>
            </div>

            {project.features && project.features.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Key Features
                </h4>
                <ul className="list-disc pl-5 text-gray-300">
                  {project.features.map((feature, index) => (
                    <li key={index} className="mb-1">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
