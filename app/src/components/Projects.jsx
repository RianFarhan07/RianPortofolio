import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData } from "../data/projects";
import { ExternalLink, Code, Github } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Projects({ openProjectDialog, fullPage = false }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    setFilteredProjects(projectsData);
  }, []);

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    setAnimateCard({ y: 100, opacity: 0 });

    setTimeout(() => {
      setAnimateCard({ y: 0, opacity: 1 });

      if (category === "all") {
        setFilteredProjects(projectsData);
      } else {
        setFilteredProjects(
          projectsData.filter((project) => project.category === category)
        );
      }
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const filterButtonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: isDark
        ? "0 5px 15px rgba(0, 173, 181, 0.3)"
        : "0 5px 15px rgba(95, 111, 255, 0.3)",
      y: -3,
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      id="projects"
      className={`py-20 ${fullPage ? "min-h-screen pt-32" : ""} ${
        isDark
          ? "bg-gradient-to-b from-gray-900 to-gray-800"
          : "bg-gradient-to-b from-gray-100 to-white"
      }`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2
            className={`text-3xl md:text-4xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            } mb-4`}
          >
            My{" "}
            <span className={isDark ? "text-cyan-400" : "text-primary"}>
              Projects
            </span>
          </h2>
          <p
            className={`${
              isDark ? "text-gray-400" : "text-gray-600"
            } max-w-xl mx-auto`}
          >
            Here are some of my recent projects. Click on any project to see
            more details.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {["all", "android", "web"].map((item) => (
            <motion.button
              key={item}
              className={`px-6 py-3 rounded-lg font-medium capitalize transition-all ${
                activeFilter === item
                  ? isDark
                    ? "bg-cyan-500 text-white"
                    : "bg-primary text-white"
                  : isDark
                  ? "border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                  : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
              }`}
              onClick={() => handleFilterChange(item)}
              variants={filterButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {item}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                className={`${
                  isDark ? "bg-gray-800" : "bg-white border border-gray-200"
                } rounded-xl overflow-hidden shadow-lg hover:shadow-${
                  isDark ? "cyan-900/20" : "primary/20"
                } transition-all`}
                initial={{ opacity: 0, y: 20 }}
                animate={animateCard}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5 }}
                onClick={() => openProjectDialog(project)}
              >
                <div
                  className="relative overflow-hidden group"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <img
                    src={project.image || "/api/placeholder/600/338"}
                    alt={project.title}
                    className="absolute w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-2 ${
                                isDark ? "bg-gray-800" : "bg-gray-100"
                              } rounded-full text-${
                                isDark ? "white" : "gray-800"
                              } hover:bg-${
                                isDark ? "cyan-500" : "primary"
                              } hover:text-white transition-colors`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github size={18} />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-2 ${
                                isDark ? "bg-gray-800" : "bg-gray-100"
                              } rounded-full text-${
                                isDark ? "white" : "gray-800"
                              } hover:bg-${
                                isDark ? "cyan-500" : "primary"
                              } hover:text-white transition-colors`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 ${
                            isDark ? "bg-cyan-500" : "bg-primary"
                          } text-xs font-semibold rounded-full text-white uppercase`}
                        >
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className={`text-xl font-bold ${
                      isDark
                        ? "text-white group-hover:text-cyan-400"
                        : "text-gray-800 group-hover:text-primary"
                    } mb-2`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-600"
                    } text-sm mb-4 line-clamp-2`}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(project.technologies) &&
                      project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className={`text-xs ${
                            isDark
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          } px-2 py-1 rounded`}
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}
