import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const MainLayout = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Add this useEffect to your Layout component
  useEffect(() => {
    // Add a delay to ensure elements are loaded
    const timer = setTimeout(() => {
      if (
        typeof window !== "undefined" &&
        window.particlesJS &&
        document.getElementById("particles-js")
      ) {
        console.log("Initializing particles.js");
        window.particlesJS("particles-js", {
          particles: {
            number: { value: 20, density: { enable: true, value_area: 800 } },
            color: { value: isDark ? "#00adb5" : "#14b8a6" },
            opacity: {
              value: 0.4,
              random: true,
              anim: {
                enable: true,
                speed: 0.5,
                opacity_min: 0.3,
                sync: false,
              },
            },
            size: {
              value: 6,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 2,
                sync: false,
              },
            },
            line_linked: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 0.8,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
            },
          },
        });
      } else {
        console.error("Particles.js not available or element not found", {
          particlesJS: !!window.particlesJS,
          element: !!document.getElementById("particles-js"),
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
      }
    };
  }, [isDark]);

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-bgDark via-gray-800/50 to-bgDark"
          : "bg-gradient-to-br from-bgLight via-blue-50/50 to-bgLight"
      }`}
    >
      {/* Particles.js container */}
      <div id="particles-js" className="absolute inset-0 z-0"></div>

      {/* Gradient background */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 opacity-20 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        ></div>

        {/* Gradient blobs */}
        <div
          className={`absolute w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          } opacity-10`}
          style={{
            top: "10%",
            right: "5%",
            animation: "pulse 8s infinite ease-in-out",
          }}
        />

        <div
          className={`absolute w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          } opacity-10`}
          style={{
            bottom: "5%",
            left: "10%",
            animation: "pulse 8s infinite ease-in-out reverse",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">{children}</div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
