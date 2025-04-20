import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Code, Database, Server, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const TechStackTabs = ({ techStack }) => {
  const [activeTab, setActiveTab] = useState("Frontend");
  const [hoveredTab, setHoveredTab] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tabContainerRef = useRef(null);
  const [indicatorDimensions, setIndicatorDimensions] = useState({
    width: 0,
    left: 0,
  });

  // mendeteksi kalau di mobile screen
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // update window ketika ada perubahan ukuran layar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // dapatkan ikon tab berdasarkan nama tab untuk mobile
  const getTabIcon = (tab) => {
    switch (tab) {
      case "Frontend":
        return <Code className="w-5 h-5" />;
      case "Backend":
        return <Server className="w-5 h-5" />;
      case "Database":
        return <Database className="w-5 h-5" />;
      case "Utilities":
      case "DevOps":
        return <Wrench className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  // kalau tab di hover
  const handleTabHover = (tab) => {
    setHoveredTab(tab);
  };

  const handleTabLeave = () => {
    setHoveredTab(null);
  };

  // update posisi indikator kalau ada perubahan ukuran layar atau tab aktif
  useEffect(() => {
    if (tabContainerRef.current) {
      const activeTabElement = tabContainerRef.current.querySelector(
        `[data-tab="${activeTab}"]`
      );
      if (activeTabElement) {
        const { width, left } = activeTabElement.getBoundingClientRect();
        const containerLeft =
          tabContainerRef.current.getBoundingClientRect().left;
        setIndicatorDimensions({
          width,
          left: left - containerLeft,
        });
      }
    }
  }, [activeTab, tabContainerRef, windowWidth]);

  const tabVariants = {
    inactive: {
      backgroundColor: isDark
        ? "rgba(31, 41, 55, 0)"
        : "rgba(243, 244, 246, 0)",
      color: isDark ? "#9ca3af" : "#6b7280",
      scale: 0.98,
    },
    active: {
      backgroundColor: isDark
        ? "rgba(17, 24, 39, 0.3)"
        : "rgba(255, 255, 255, 0.7)",
      color: isDark ? "#ffffff" : "#111827",
      scale: 1,
      boxShadow: isDark
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      backgroundColor: isDark
        ? "rgba(17, 24, 39, 0.2)"
        : "rgba(255, 255, 255, 0.5)",
      color: isDark ? "#e5e7eb" : "#374151",
      scale: 0.99,
      y: -2,
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 15 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: i * 0.05,
      },
    }),
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // mendefinisikan tabs kalau bukan mobile
  const tabs = ["Frontend", "Backend", "Database", "Utilities"];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Tabs Header */}
      <div
        className="flex gap-2 mb-4 relative p-1 rounded-lg border"
        style={{
          background: isDark
            ? "rgba(17, 24, 39, 0.3)"
            : "rgba(243, 244, 246, 0.7)",
          backdropFilter: "blur(8px)",
          borderColor: isDark
            ? "rgba(75, 85, 99, 0.3)"
            : "rgba(209, 213, 219, 0.5)",
        }}
        ref={tabContainerRef}
      >
        {/* animasikan background indicator */}
        <motion.div
          className="absolute rounded-md z-0"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2))"
              : "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))",
            boxShadow: isDark
              ? "0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
            height: "85%",
            top: "7.5%",
          }}
          animate={{
            left: indicatorDimensions.left,
            width: indicatorDimensions.width,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />

        {tabs.map((tab) => (
          <motion.button
            key={tab}
            data-tab={tab}
            onClick={() => handleTabChange(tab)}
            onMouseEnter={() => handleTabHover(tab)}
            onMouseLeave={handleTabLeave}
            className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all z-10 relative flex-1 flex items-center justify-center`}
            variants={tabVariants}
            animate={
              activeTab === tab
                ? "active"
                : hoveredTab === tab
                ? "hover"
                : "inactive"
            }
            whileTap={{ scale: 0.95 }}
          >
            {/* icon aja kalau di mobile screen */}
            {isMobile ? (
              <span className="flex items-center justify-center">
                {getTabIcon(tab)}
              </span>
            ) : (
              <span>{tab}</span>
            )}

            {/* timbul dan glow effect ketika active */}
            {activeTab === tab && (
              <motion.div
                className={`absolute inset-0 rounded-md ${
                  isDark ? "bg-primary" : "bg-primaryInLight"
                } opacity-10 blur-sm -z-10`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tabs Content */}
      <motion.div
        className={`p-6 border rounded-lg shadow-sm min-h-[180px] relative overflow-hidden ${
          isDark
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/90 border-gray-300"
        }`}
        style={{
          backdropFilter: "blur(8px)",
          boxShadow: isDark
            ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
            : "0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10"
          >
            <motion.div className="flex flex-wrap gap-3">
              {(techStack[activeTab.toLowerCase()] || []).length > 0 ? (
                (techStack[activeTab.toLowerCase()] || []).map((item, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={itemVariants}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      isDark
                        ? "bg-gray-800 text-primary border border-primary/30 hover:bg-gray-700"
                        : "bg-blue-50 text-primaryInLight border border-blue-200 hover:bg-blue-100"
                    } shadow-sm transition-colors cursor-pointer`}
                    whileHover={{
                      y: -5,
                      boxShadow: isDark
                        ? "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.3)"
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.2)",
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item}

                    {/* timbul dan glow ketika di hover */}
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-0 -z-10"
                      style={{
                        background: isDark
                          ? "radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)"
                          : "radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)",
                      }}
                      whileHover={{ opacity: 1 }}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.p
                  variants={itemVariants}
                  custom={0}
                  className={`text-center w-full ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No {activeTab.toLowerCase()} technologies listed
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* animasi background */}
        <motion.div
          className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full opacity-5 ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
            rotate: [0, 15, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 12,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className={`absolute -left-10 -top-10 w-40 h-40 rounded-full opacity-5 ${
            isDark ? "bg-blue-400" : "bg-blue-300"
          }`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.07, 0.05],
            rotate: [0, -15, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 10,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* particles floating  */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDark
                ? i % 2 === 0
                  ? "bg-primary/30"
                  : "bg-blue-400/30"
                : i % 2 === 0
                ? "bg-primaryInLight/30"
                : "bg-blue-400/30"
            }`}
            initial={{
              x: Math.random() * 300 - 150,
              y: Math.random() * 150 - 75,
              opacity: 0.2,
            }}
            animate={{
              x: Math.random() * 300 - 150,
              y: Math.random() * 150 - 75,
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5 + Math.random() * 10,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};
