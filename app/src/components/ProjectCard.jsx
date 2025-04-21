import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Globe,
  Github,
  ExternalLink,
  Filter,
  Laptop,
  Smartphone,
  Eye,
  PenTool,
} from "lucide-react";

const categories = [
  { value: "all", label: "All", icon: <Filter size={18} /> },
  { value: "web", label: "Web Apps", icon: <Globe size={18} /> },
  { value: "mobile", label: "Mobile Apps", icon: <Smartphone size={18} /> },
  { value: "desktop", label: "Desktop Apps", icon: <Laptop size={18} /> },
  { value: "desain", label: "Desain", icon: <PenTool size={18} /> },
];

export const ProjectCard = ({ project, isDark, onOpenModal }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`group relative h-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isDark
          ? "bg-gray-900/70 hover:shadow-primary/20 border border-gray-800/60"
          : "bg-white hover:shadow-primaryInLight/20 border border-gray-200"
      } hover:shadow-xl hover:-translate-y-1`}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60"></div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
            {categories.find((cat) => cat.value === project.category)?.label ||
              project.category}
          </span>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                isDark
                  ? "bg-primary/90 text-white"
                  : "bg-primaryInLight/90 text-white"
              } flex items-center gap-1 backdrop-blur-sm`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              Featured
            </span>
          </div>
        )}

        {/* Project title -*/}
        <div className="absolute bottom-0 left-0 right-0 transition-all duration-300 group-hover:bottom-8">
          <h3
            className={`text-lg font-bold text-white mx-4 mb-2 p-2 drop-shadow-md  rounded-md inline-block transition-all duration-300`}
          >
            {project.title}
          </h3>
        </div>

        {/* Tech stack  */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
          <div className="flex flex-wrap gap-1.5 transform translate-y-2 group-hover:-translate-y-1 transition-transform duration-500 ease-out">
            {project.techLogos.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className={`text-xs font-medium px-2.5 py-1 rounded-full 
          ${
            isDark
              ? "bg-gray-900/70 text-white border border-white/20 shadow-sm"
              : "bg-white/80 text-gray-800 border border-gray-200/50 shadow-sm"
          } backdrop-blur-sm hover:scale-105 transition-transform`}
              >
                {tech}
              </span>
            ))}
            {project.techLogos.length > 3 && (
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full 
       ${
         isDark
           ? "bg-gray-900/70 text-white border border-white/20 shadow-sm"
           : "bg-white/80 text-gray-800 border border-gray-200/50 shadow-sm"
       } backdrop-blur-sm hover:scale-105 transition-transform`}
              >
                +{project.techLogos.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p
          className={`text-sm mb-4 line-clamp-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {project.description}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-800/20 flex justify-between items-center">
          <div className="flex gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition-colors`}
              aria-label="View Source Code"
            >
              <Github size={18} />
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition-colors`}
              aria-label="View Live Demo"
            >
              <ExternalLink size={18} />
            </a>
          </div>

          <button
            onClick={() => onOpenModal(project)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "bg-primaryInLight/10 text-primaryInLight hover:bg-primaryInLight/20"
            }`}
          >
            <Eye size={16} />
            Details
          </button>
        </div>
      </div>

      {/* Clickable overlay for entire card */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => onOpenModal(project)}
        aria-hidden="true"
      ></div>
    </motion.div>
  );
};
