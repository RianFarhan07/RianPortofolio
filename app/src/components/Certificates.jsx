import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function Certificates({ fullPage = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const certificates = [
    {
      id: 1,
      title: "Google Associate Android Developer",
      organization: "Google",
      date: "November 2021",
      image: "/api/placeholder/480/320",
    },
    {
      id: 2,
      title: "React Developer Certification",
      organization: "Meta",
      date: "March 2022",
      image: "/api/placeholder/480/320",
    },
    {
      id: 3,
      title: "AWS Cloud Practitioner",
      organization: "Amazon Web Services",
      date: "June 2023",
      image: "/api/placeholder/480/320",
    },
    {
      id: 4,
      title: "UI/UX Design Specialization",
      organization: "Google & Coursera",
      date: "September 2022",
      image: "/api/placeholder/480/320",
    },
    {
      id: 5,
      title: "Firebase Fundamentals",
      organization: "Google",
      date: "January 2023",
      image: "/api/placeholder/480/320",
    },
    {
      id: 6,
      title: "Kotlin Developer",
      organization: "JetBrains",
      date: "May 2022",
      image: "/api/placeholder/480/320",
    },
  ];

  return (
    <section
      id="certificates"
      className={`py-20 ${fullPage ? "min-h-screen pt-32" : ""} ${
        isDark
          ? "bg-gradient-to-b from-gray-900 to-gray-800"
          : "bg-gradient-to-b from-gray-100 to-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2
            className={`text-3xl md:text-4xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            } mb-4`}
          >
            My{" "}
            <span className={isDark ? "text-cyan-400" : "text-primary"}>
              Certificates
            </span>
          </h2>
          <p
            className={`${
              isDark ? "text-gray-400" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Professional certifications that validate my skills and expertise in
            various technologies.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          viewport={{ once: true }}
        >
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              className="relative h-64 perspective-1000"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                className="w-full h-full rounded-xl overflow-hidden cursor-pointer preserve-3d transition-all duration-500"
                animate={{
                  rotateY: hoveredIndex === index ? 180 : 0,
                  boxShadow:
                    hoveredIndex === index
                      ? isDark
                        ? "0 20px 25px -5px rgba(0, 173, 181, 0.2), 0 10px 10px -5px rgba(0, 173, 181, 0.1)"
                        : "0 20px 25px -5px rgba(95, 111, 255, 0.2), 0 10px 10px -5px rgba(95, 111, 255, 0.1)"
                      : isDark
                      ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* Front side */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="w-full h-full relative">
                    <img
                      src={certificate.image}
                      alt={certificate.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-lg font-bold text-white">
                        {certificate.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {certificate.organization}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Back side */}
                <div
                  className={`absolute inset-0 ${
                    isDark ? "bg-gray-800" : "bg-white border border-gray-200"
                  } rounded-xl p-6 flex flex-col justify-center backface-hidden rotate-y-180`}
                >
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-cyan-400" : "text-primary"
                    } mb-2`}
                  >
                    {certificate.title}
                  </h3>
                  <p
                    className={`${
                      isDark ? "text-white" : "text-gray-800"
                    } font-medium mb-2`}
                  >
                    {certificate.organization}
                  </p>
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-600"
                    } text-sm mb-4`}
                  >
                    Issued: {certificate.date}
                  </p>
                  <div
                    className={`mt-auto pt-4 border-t ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Hover out to flip back
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
