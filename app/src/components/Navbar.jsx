import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isTransitioning, isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Projects", path: "/projects" },
    { title: "Certificates", path: "/certificates" },
    { title: "Contact", path: "/contact" },
  ];

  const navbarVariants = {
    initial: { backgroundColor: "rgba(34, 40, 49, 0)" },
    scrolled: {
      backgroundColor: isDark
        ? "rgba(34, 40, 49, 0.95)" // Dark mode: tetap gelap
        : "rgba(255, 255, 255, 0.9)", // Light mode: putih semi-transparan
      backdropFilter: "blur(10px)",
    },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0 },
  };

  const linkVariants = {
    hover: {
      y: -3,
      textShadow: isDark
        ? "0 0 8px rgba(0, 173, 181, 0.6)"
        : "0 0 8px rgba(20, 184, 166, 0.6)",
      color: isDark ? "#00adb5" : "#14b8a6",
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 py-4 transition-all duration-300 ${
        isScrolled ? "py-2 shadow-lg" : "py-4"
      }`}
      variants={navbarVariants}
      animate={isScrolled ? "scrolled" : "initial"}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-white font-bold text-xl flex items-center space-x-2"
          >
            <motion.span
              className={`text-2xl font-bold bg-gradient-to-r ${
                isDark
                  ? "from-cyan-400 to-blue-500"
                  : "from-teal-400 to-teal-600"
              } bg-clip-text text-transparent`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Rian.dev
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <motion.div
                  key={link.title}
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <Link
                    to={link.path}
                    className={`relative px-1 transition-colors ${
                      isActive
                        ? isDark
                          ? "text-cyan-400 font-semibold"
                          : "text-teal-500 font-semibold"
                        : isDark
                        ? "text-gray-300 hover:text-cyan-400"
                        : "text-gray-700 hover:text-teal-500"
                    }`}
                  >
                    {link.title}
                    <motion.span
                      className={`absolute bottom-0 left-0 h-0.5 ${
                        isDark ? "bg-cyan-400" : "bg-teal-500"
                      }`}
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              );
            })}

            <motion.button
              onClick={toggleTheme}
              disabled={isTransitioning}
              className={`p-2 rounded-full ${
                isDark
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              } relative overflow-hidden`}
              whileHover={{
                scale: 1.1,
                rotate: isDark ? 15 : -15,
                boxShadow: isDark
                  ? "0 0 15px rgba(0, 173, 181, 0.5)"
                  : "0 0 15px rgba(20, 184, 166, 0.5)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{
                  rotate: isTransitioning ? (isDark ? 360 : -360) : 0,
                  scale: isTransitioning ? [1, 1.2, 0.8, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>

              {/* Button ripple effect */}
              <motion.span
                className="absolute inset-0 rounded-full"
                initial={{ scale: 0, opacity: 0.5 }}
                whileTap={{
                  scale: 4,
                  opacity: 0,
                  transition: { duration: 0.5 },
                }}
                style={{
                  background: isDark
                    ? "rgba(0, 173, 181, 0.3)"
                    : "rgba(20, 184, 166, 0.3)",
                  transformOrigin: "center",
                }}
              />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={`md:hidden ${isDark ? "text-white" : "text-gray-800"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={`fixed inset-0 ${
              isDark ? "bg-gray-900 bg-opacity-95" : "bg-white bg-opacity-95"
            } z-40 md:hidden`}
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <motion.div
                    key={link.title}
                    whileHover={{
                      scale: 1.1,
                      color: isDark ? "#00adb5" : "#14b8a6",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={link.path}
                      className={`text-xl font-medium ${
                        isActive
                          ? isDark
                            ? "text-cyan-400"
                            : "text-teal-500"
                          : isDark
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                disabled={isTransitioning}
                className={`mt-6 p-3 rounded-full ${
                  isDark
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-800"
                } relative overflow-hidden`}
                whileHover={{
                  scale: 1.1,
                  boxShadow: isDark
                    ? "0 0 20px rgba(0, 173, 181, 0.6)"
                    : "0 0 20px rgba(20, 184, 166, 0.6)",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{
                    rotate: isTransitioning ? (isDark ? 360 : -360) : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {isDark ? <Sun size={24} /> : <Moon size={24} />}
                </motion.div>

                {/* Button ripple effect */}
                <motion.span
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 0, opacity: 0.5 }}
                  whileTap={{
                    scale: 4,
                    opacity: 0,
                    transition: { duration: 0.5 },
                  }}
                  style={{
                    background: isDark
                      ? "rgba(0, 173, 181, 0.3)"
                      : "rgba(20, 184, 166, 0.3)",
                    transformOrigin: "center",
                  }}
                />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
