import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const currentYear = new Date().getFullYear();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  return (
    <footer className={`py-12 ${
      isDark 
        ? "bg-gradient-to-t from-gray-900 to-gray-800" 
        : "bg-gradient-to-t from-gray-200 to-gray-100"
    }`}>
      <div className="container mx-auto px-6">
        <motion.div 
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Back to top button */}
          <motion.div 
            className="mb-12"
            variants={itemVariants}
          >
            <motion.a 
              href="#home"
              className={`w-12 h-12 rounded-full ${
                isDark 
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              } flex items-center justify-center transition-colors shadow-md`}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUp size={20} />
            </motion.a>
          </motion.div>
          
          {/* Logo/Brand */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <h2 className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}>
              Rian <span className={isDark ? "text-cyan-400" : "text-primary"}>Farhan</span>
            </h2>
          </motion.div>
          
          {/* Navigation */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <ul className="flex flex-wrap justify-center gap-6 md:gap-10">
              <li>
                <a 
                  href="#home" 
                  className={`${
                    isDark 
                      ? "text-gray-400 hover:text-cyan-400" 
                      : "text-gray-600 hover:text-primary"
                  } transition-colors font-medium`}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className={`${
                    isDark 
                      ? "text-gray-400 hover:text-cyan-400" 
                      : "text-gray-600 hover:text-primary"
                  } transition-colors font-medium`}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#projects" 
                  className={`${
                    isDark 
                      ? "text-gray-400 hover:text-cyan-400" 
                      : "text-gray-600 hover:text-primary"
                  } transition-colors font-medium`}
                >
                  Projects
                </a>
              </li>
              <li>
                <a 
                  href="#skills" 
                  className={`${
                    isDark 
                      ? "text-gray-400 hover:text-cyan-400" 
                      : "text-gray-600 hover:text-primary"
                  } transition-colors font-medium`}
                >
                  Skills
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className={`${
                    isDark 
                      ? "text-gray-400 hover:text-cyan-400" 
                      : "text-gray-600 hover:text-primary"
                  } transition-colors font-medium`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
          
          {/* Social Links */}
          <motion.div 
            className="flex gap-4 mb-8"
            variants={itemVariants}
          >
            <motion.a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full ${
                isDark
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              } flex items-center justify-center hover:text-white transition-colors shadow-md`}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github size={18} />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/username"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full ${
                isDark
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              } flex items-center justify-center hover:text-white transition-colors shadow-md`}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin size={18} />
            </motion.a>
            <motion.a
              href="mailto:email@example.com"
              className={`w-10 h-10 rounded-full ${
                isDark
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              } flex items-center justify-center hover:text-white transition-colors shadow-md`}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail size={18} />
            </motion.a>
          </motion.div>
          
          {/* Copyright */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <p className={`flex items-center justify-center gap-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              © {currentYear} - Designed & Built with 
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  color: isDark 
                    ? ["#00adb5", "#22d3ee", "#00adb5"] 
                    : ["#5F6FFF", "#3b82f6", "#5F6FFF"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart size={16} fill={isDark ? "#00adb5" : "#5F6FFF"} />
              </motion.span> 
              by Rian Farhan
            </p>
            <p className={`mt-2 text-sm ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}>
              All rights reserved
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}