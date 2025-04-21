import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Globe,
  Search,
  Filter,
  Laptop,
  Smartphone,
  PenTool,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { projectsData } from "../data/projects";
import { ProjectModal } from "./ProjectModal";
import { ProjectCard } from "./ProjectCard";

const categories = [
  { value: "all", label: "All", icon: <Filter size={18} /> },
  { value: "web", label: "Web Apps", icon: <Globe size={18} /> },
  { value: "mobile", label: "Mobile Apps", icon: <Smartphone size={18} /> },
  { value: "desktop", label: "Desktop Apps", icon: <Laptop size={18} /> },
  { value: "desain", label: "Desain", icon: <PenTool size={18} /> },
];

// Combined data
const combinedData = [...projectsData.map((p) => ({ ...p, type: "project" }))];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 1.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function Projects() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(combinedData);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    const filtered = combinedData.filter((item) => {
      // Filter bedasarkan kategori
      const categoryMatch =
        activeCategory === "all" ||
        activeCategory === item.type ||
        activeCategory === item.category;

      // Filter berdasarkan search query
      const query = searchQuery.toLowerCase();
      const searchMatch =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.type === "project" &&
          item.techLogos.some((tech) => tech.toLowerCase().includes(query))) ||
        (item.type === "certificate" &&
          item.skills.some((skill) => skill.toLowerCase().includes(query)));

      return categoryMatch && searchMatch;
    });

    setFilteredItems(filtered);
  }, [activeCategory, searchQuery]);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section
      id="projects"
      className={`py-16 md:py-24 relative overflow-hidden ${
        isDark ? "bg-bgDarkSection" : "bg-bgLight"
      }`}
      ref={ref}
    >
      {/* Background decor */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          } opacity-5 -top-48 -left-48`}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          } opacity-5 -bottom-48 -right-48`}
        />
        <div
          className={`absolute inset-0 opacity-10 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        ></div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 1.7 }}
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
              My Work
            </span>
            <div
              className={`h-1 w-8 md:w-12 ${
                isDark ? "bg-primary" : "bg-primaryInLight"
              } rounded-full`}
            ></div>
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            } drop-shadow-sm`}
          >
            Featured{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDark
                  ? "from-primary via-blue-400 to-purple-400"
                  : "from-primaryInLight via-blue-500 to-purple-500"
              }`}
            >
              Projects
            </span>
          </h1>

          <p
            className={`max-w-2xl mx-auto text-base md:text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            A showcase of the applications and websites I've built — blending
            creativity, functionality, and user experience into real-world
            digital solutions.
          </p>
        </motion.div>

        {/* Filter dan Search Controls */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.value
                      ? isDark
                        ? "bg-primary text-white"
                        : "bg-primaryInLight text-white"
                      : isDark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div
              className={`relative w-full md:w-64 lg:w-72 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    : "bg-white border-gray-300 text-gray-800 placeholder:text-gray-400"
                } border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "focus:ring-primary/50"
                    : "focus:ring-primaryInLight/50"
                } transition-colors`}
              />
              <Search
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Projects & Certificates Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <ProjectCard
                    key={item.id}
                    project={item}
                    isDark={isDark}
                    onOpenModal={handleOpenModal}
                    variants={itemVariants}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className={`text-center py-16 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Search size={48} className="mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-medium mb-2">No items found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </motion.div>

        {/* Jumlah Hasil */}
        {filteredItems.length > 0 && (
          <motion.div
            className={`mt-8 text-center text-sm ${
              isDark ? "text-gray-500" : "text-gray-600"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            Showing {filteredItems.length} of {combinedData.length} items
          </motion.div>
        )}

        {/* Project Detail Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isDark={isDark}
          />
        )}
      </div>
    </section>
  );
}
