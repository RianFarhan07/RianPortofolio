import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code,
  Globe,
  Github,
  ExternalLink,
  Search,
  Filter,
  Laptop,
  Smartphone,
  Database,
  Lock,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { projectsData } from "../data/projects";

// const projectsData = [
//   {
//     id: 1,
//     title: "FurniShop",
//     description:
//       "E-commerce platform for modern furniture with AR previews for an immersive shopping experience",
//     image: "/projects/furnishop.jpg",
//     technologies: ["React", "Next.js", "Tailwind CSS", "Three.js"],
//     category: "web",
//     featured: true,
//     githubUrl: "https://github.com/username/furnishop",
//     liveUrl: "https://furnishop.example.com",
//   },
//   {
//     id: 2,
//     title: "FinTrack",
//     description:
//       "Personal finance tracking app with expense analytics and budgeting features",
//     image: "/projects/fintrack.jpg",
//     technologies: ["React Native", "Firebase", "Redux", "Chart.js"],
//     category: "mobile",
//     featured: true,
//     githubUrl: "https://github.com/username/fintrack",
//     liveUrl: "https://fintrack.example.com",
//   },
//   {
//     id: 3,
//     title: "DevCollab",
//     description:
//       "Real-time collaboration tool for developers with code sharing and version control",
//     image: "/projects/devcollab.jpg",
//     technologies: ["Vue.js", "Node.js", "Socket.io", "MongoDB"],
//     category: "web",
//     featured: true,
//     githubUrl: "https://github.com/username/devcollab",
//     liveUrl: "https://devcollab.example.com",
//   },
//   {
//     id: 4,
//     title: "HealthMate",
//     description:
//       "Health monitoring application with sleep tracking and nutrition recommendations",
//     image: "/projects/healthmate.jpg",
//     technologies: ["Kotlin", "Android SDK", "Room Database", "ML Kit"],
//     category: "mobile",
//     featured: false,
//     githubUrl: "https://github.com/username/healthmate",
//     liveUrl: "https://healthmate.example.com",
//   },
//   {
//     id: 5,
//     title: "SecurePass",
//     description:
//       "Password manager with advanced encryption and cross-platform synchronization",
//     image: "/projects/securepass.jpg",
//     technologies: ["Electron", "React", "Node.js", "SQLite"],
//     category: "desktop",
//     featured: false,
//     githubUrl: "https://github.com/username/securepass",
//     liveUrl: "https://securepass.example.com",
//   },
//   {
//     id: 6,
//     title: "DataVizPro",
//     description:
//       "Data visualization dashboard with customizable widgets and real-time updates",
//     image: "/projects/datavizpro.jpg",
//     technologies: ["Angular", "D3.js", "Express", "PostgreSQL"],
//     category: "web",
//     featured: false,
//     githubUrl: "https://github.com/username/datavizpro",
//     liveUrl: "https://datavizpro.example.com",
//   },
//   {
//     id: 7,
//     title: "CloudStore",
//     description:
//       "Secure cloud storage solution with file sharing and permissions management",
//     image: "/projects/cloudstore.jpg",
//     technologies: ["AWS S3", "React", "Node.js", "MongoDB"],
//     category: "backend",
//     featured: false,
//     githubUrl: "https://github.com/username/cloudstore",
//     liveUrl: "https://cloudstore.example.com",
//   },
//   {
//     id: 8,
//     title: "TravelBuddy",
//     description:
//       "Travel companion app with itinerary planning and location-based recommendations",
//     image: "/projects/travelbuddy.jpg",
//     technologies: ["Flutter", "Firebase", "Google Maps API"],
//     category: "mobile",
//     featured: false,
//     githubUrl: "https://github.com/username/travelbuddy",
//     liveUrl: "https://travelbuddy.example.com",
//   },
// ];

// Define category options with icons
const categories = [
  { value: "all", label: "All Projects", icon: <Filter size={18} /> },
  { value: "web", label: "Web Apps", icon: <Globe size={18} /> },
  { value: "mobile", label: "Mobile Apps", icon: <Smartphone size={18} /> },
  { value: "desktop", label: "Desktop Apps", icon: <Laptop size={18} /> },
  { value: "backend", label: "Backend", icon: <Database size={18} /> },
];

const TechBadge = ({ text }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
        isDark
          ? "bg-gray-800 text-primary border border-primary/30"
          : "bg-white text-primaryInLight border border-primaryInLight/30"
      } shadow-sm`}
    >
      {text}
    </span>
  );
};

const ProjectCard = ({ project, isDark }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isHovered, setIsHovered] = useState(false);

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
      className={`group h-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isDark
          ? "bg-gray-900 hover:shadow-primary/20"
          : "bg-white hover:shadow-primaryInLight/20"
      } hover:shadow-xl hover:-translate-y-1`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with overlay */}
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isDark ? "bg-black/70 text-white" : "bg-white/70 text-gray-800"
            }`}
          >
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
              } flex items-center gap-1`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              Featured
            </span>
          </div>
        )}

        {/* Links overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDark
              ? "from-gray-900/95 via-gray-900/70 to-transparent"
              : "from-gray-800/90 via-gray-800/60 to-transparent"
          } flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
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
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-primaryInLight text-white hover:bg-primaryInLight/90"
            } transition-colors`}
            aria-label="View Live Demo"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className={`text-lg font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {project.title}
        </h3>

        <p
          className={`text-sm mb-4 line-clamp-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {project.description}
        </p>

        <div className="mt-auto">
          <p
            className={`text-xs mb-2 font-medium ${
              isDark ? "text-gray-500" : "text-gray-400"
            } uppercase`}
          >
            Technologies
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.techLogos.slice(0, 3).map((tech, index) => (
              <TechBadge key={index} text={tech} />
            ))}
            {project.techLogos.length > 3 && (
              <span
                className={`text-xs px-2 py-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                +{project.techLogos.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(projectsData);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    const filtered = projectsData.filter((project) => {
      // Filter by category
      const categoryMatch =
        activeCategory === "all" || project.category === activeCategory;

      // Filter by search query
      const query = searchQuery.toLowerCase();
      const searchMatch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.techLogos.some((tech) => tech.toLowerCase().includes(query));

      return categoryMatch && searchMatch;
    });

    setFilteredProjects(filtered);
  }, [activeCategory, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1.5,
      },
    },
  };

  return (
    <section
      id="projects"
      className={`py-16 md:py-24 relative overflow-hidden ${
        isDark ? "bg-bgDark" : "bg-bgLight"
      }`}
      ref={ref}
    >
      {/* Background decor */}
      <div className="absolute inset-0 overflow-hidden">
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
              My Work
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
            Explore My{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDark
                  ? "from-primary to-blue-400"
                  : "from-primaryInLight to-blue-500"
              }`}
            >
              Project Portfolio
            </span>
          </h2>
        </motion.div>

        {/* Filter and Search Controls */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isDark={isDark}
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
              <h3 className="text-xl font-medium mb-2">No projects found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </motion.div>

        {/* Result Count */}
        {filteredProjects.length > 0 && (
          <motion.div
            className={`mt-8 text-center text-sm ${
              isDark ? "text-gray-500" : "text-gray-600"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Showing {filteredProjects.length} of {projectsData.length} projects
          </motion.div>
        )}
      </div>
    </section>
  );
}
