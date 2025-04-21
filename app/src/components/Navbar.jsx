import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Home, User, FolderOpen, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Home", path: "/", icon: Home },
    { title: "About", path: "/about", icon: User },
    { title: "Projects", path: "/projects", icon: FolderOpen },
    { title: "Contact", path: "/contact", icon: MessageSquare },
  ];

  return (
    <>
      <header className="hidden md:block fixed top-3 left-0 right-0 z-50 w-full px-4 transition-all duration-300">
        <motion.div
          className="mx-auto w-full"
          animate={{ width: isScrolled ? "768px" : "1280px" }}
          transition={{ duration: 0.9 }}
        >
          <motion.nav
            className={`max-w-6xl mx-auto flex w-full items-center justify-between rounded-full px-6 transition-all duration-300 border-0 ${
              isScrolled
                ? "py-2 bg-white/90 shadow-md dark:bg-gray-900/90 backdrop-blur-md scale-90"
                : "py-2 bg-transparent"
            }`}
            initial={{ backgroundColor: "transparent", borderWidth: 0 }}
            animate={{
              backgroundColor: isScrolled
                ? isDark
                  ? "rgba(17, 24, 39, 0.9)"
                  : "rgba(255, 255, 255, 0.9)"
                : "transparent",
              backdropFilter: isScrolled ? "blur(10px)" : "none",
              borderWidth: 0,
            }}
            style={{ borderWidth: 0, borderTopWidth: 0 }}
          >
            <Link to="/" className="text-xl font-bold">
              <span
                className={`text-2xl font-bold bg-gradient-to-r ${
                  isDark
                    ? "from-cyan-400 to-blue-500"
                    : "from-teal-400 to-teal-600"
                } bg-clip-text text-transparent`}
              >
                Rian.dev
              </span>
            </Link>

            {/* Desktop */}
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.title}
                    to={link.path}
                    className={`relative px-2 py-1 transition-colors ${
                      isActive
                        ? isDark
                          ? "text-cyan-400 font-semibold"
                          : "text-gray-800 font-semibold"
                        : isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {link.title}
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-1 h-1.5 w-1.5 bg-green-500 rounded-full mx-auto"></span>
                    )}
                  </Link>
                );
              })}

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </motion.nav>
        </motion.div>
      </header>

      {/* Mobile  */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        } border-t shadow-lg border-0`}
        style={{
          borderTopWidth: "1px",
          borderTopColor: isDark ? "#374151" : "#e5e7eb",
          borderLeft: 0,
          borderRight: 0,
          borderBottom: 0,
        }}
      >
        <div className="flex justify-around items-center py-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.title}
                to={link.path}
                className={`flex flex-col items-center py-1 px-3 ${
                  isActive
                    ? isDark
                      ? "text-cyan-400"
                      : "text-teal-600"
                    : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                <Icon size={16} />
                <span className="text-xs mt-1">{link.title}</span>
                {isActive && (
                  <span className="h-1 w-1 bg-green-500 rounded-full mt-1"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Theme di mobile */}
      <button
        onClick={toggleTheme}
        className={`md:hidden fixed bottom-20 right-4 z-50 p-3 rounded-full shadow-lg ${
          isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </>
  );
}
