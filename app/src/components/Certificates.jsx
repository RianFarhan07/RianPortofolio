import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Award,
  ExternalLink,
  Calendar,
  Search,
  Filter,
  CheckCircle,
  Clock,
  User,
  ChevronDown,
  Download,
  Tag,
  Shield,
  Sparkles,
  Bookmark,
  XCircle,
} from "lucide-react";
import { CertificateCard } from "./CertificateCard";
import { CertificateModal } from "./CertificateModal";
import { useTheme } from "../context/ThemeContext";
import { certificatesData } from "../data/certificates";

// Pilihan Categories
const categories = [
  { value: "all", label: "All Certificates", icon: <Shield size={18} /> },
  {
    value: "frontend",
    label: "Frontend Development",
    icon: <Award size={18} />,
  },
  {
    value: "fullstack",
    label: "Full Stack Development",
    icon: <Sparkles size={18} />,
  },
  { value: "cloud", label: "Cloud Computing", icon: <Clock size={18} /> },
  { value: "design", label: "Design", icon: <Tag size={18} /> },
  { value: "data", label: "Data Science", icon: <Filter size={18} /> },
  {
    value: "mobile",
    label: "Mobile Development",
    icon: <Bookmark size={18} />,
  },
  { value: "other", label: "Other", icon: <CheckCircle size={18} /> },
];

export default function Certificates() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredCertificates, setFilteredCertificates] =
    useState(certificatesData);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Filter certificates
  useEffect(() => {
    let filtered = certificatesData;

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((cert) => cert.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cert) =>
          cert.title.toLowerCase().includes(term) ||
          cert.issuer.toLowerCase().includes(term) ||
          cert.instructor.toLowerCase().includes(term) ||
          cert.skills.some((skill) => skill.toLowerCase().includes(term))
      );
    }

    setFilteredCertificates(filtered);
  }, [searchTerm, selectedCategory]);

  // Handle certificate click
  const handleCertificateClick = (certificate) => {
    setSelectedCertificate(certificate);
    // kalau modal open tidak boleh scroll
    document.body.style.overflow = "hidden";
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedCertificate(null);
    // Kalau modal close boleh scroll
    document.body.style.overflow = "auto";
  };

  return (
    <section
      id="certificates"
      className={`py-16 md:py-24 relative ${
        isDark ? "bg-bgDarkSection" : "bg-gray-50"
      } min-h-screen`}
      ref={ref}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-900" : "bg-blue-200"
          } opacity-10 -top-48 -left-48 animate-pulse`}
          style={{ animationDuration: "15s" }}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-purple-900" : "bg-purple-200"
          } opacity-10 -bottom-48 -right-48 animate-pulse`}
          style={{ animationDuration: "20s" }}
        />
        <div
          className={`absolute w-64 h-64 rounded-full blur-3xl ${
            isDark ? "bg-emerald-900" : "bg-emerald-200"
          } opacity-5 top-1/4 right-1/4 animate-pulse`}
          style={{ animationDuration: "25s" }}
        />
        <div
          className={`absolute inset-0 opacity-10 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Page Header  */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 1.4 }}
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
              My Credentials
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
            Professional{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDark
                  ? "from-primary via-blue-400 to-purple-400"
                  : "from-primaryInLight via-blue-500 to-purple-500"
              }`}
            >
              Certifications
            </span>
          </h1>

          <p
            className={`max-w-2xl mx-auto text-base md:text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            A collection of my professional certifications and credentials,
            showcasing my continuous learning journey and technical expertise in
            various domains.
          </p>
        </motion.div>

        {/*  Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/*  Search Input */}
            <div
              className={`flex items-center rounded-lg ${
                isDark
                  ? "bg-gray-900/50 border border-gray-800 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30"
                  : "bg-white/70 border border-gray-200 focus-within:border-primaryInLight/50 focus-within:ring-1 focus-within:ring-primaryInLight/30"
              } px-3 py-2 shadow-sm backdrop-blur-sm transition-all duration-200`}
            >
              <Search
                size={18}
                className={`${isDark ? "text-gray-500" : "text-gray-400"} mr-2`}
              />
              <input
                type="text"
                placeholder="Search certificates, skills, issuers..."
                className={`flex-grow outline-none ${
                  isDark
                    ? "bg-transparent text-white placeholder:text-gray-500"
                    : "bg-transparent text-gray-800 placeholder:text-gray-400"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                >
                  <XCircle
                    size={16}
                    className={isDark ? "text-gray-500" : "text-gray-400"}
                  />
                </button>
              )}
            </div>

            {/*  Category Filter */}
            <div className="relative">
              <div
                className={`flex items-center justify-between rounded-lg ${
                  isDark
                    ? "bg-gray-900/50 border border-gray-800 hover:border-gray-700"
                    : "bg-white/70 border border-gray-200 hover:border-gray-300"
                } px-3 py-2 shadow-sm backdrop-blur-sm cursor-pointer transition-all duration-200`}
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1 rounded-full ${
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    {categories.find((cat) => cat.value === selectedCategory)
                      ?.icon || <Filter size={18} />}
                  </div>
                  <span
                    className={`${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    {categories.find((cat) => cat.value === selectedCategory)
                      ?.label || "All Certificates"}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    showCategoryDropdown ? "rotate-180" : ""
                  } ${isDark ? "text-gray-500" : "text-gray-400"}`}
                />
              </div>

              {/*  Dropdown */}
              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div
                    className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-10 ${
                      isDark
                        ? "bg-gray-900/80 border border-gray-800 backdrop-blur-md"
                        : "bg-white/90 border border-gray-200 backdrop-blur-md"
                    } py-2 overflow-hidden`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {categories.map((category) => (
                      <div
                        key={category.value}
                        className={`flex items-center px-3 py-2 cursor-pointer transition-colors ${
                          selectedCategory === category.value
                            ? isDark
                              ? "bg-gray-800 text-primary"
                              : "bg-gray-100 text-primaryInLight"
                            : isDark
                            ? "text-white hover:bg-gray-800/70"
                            : "text-gray-800 hover:bg-gray-100/70"
                        }`}
                        onClick={() => {
                          setSelectedCategory(category.value);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        <div className="w-8 flex items-center justify-center mr-2">
                          {selectedCategory === category.value ? (
                            <CheckCircle
                              size={16}
                              className={
                                isDark ? "text-primary" : "text-primaryInLight"
                              }
                            />
                          ) : (
                            category.icon
                          )}
                        </div>
                        {category.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Certificates Grid  */}
        <div className="mb-8">
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCertificates.map((certificate, index) => (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <CertificateCard
                    certificate={certificate}
                    isDark={isDark}
                    onClick={() => handleCertificateClick(certificate)}
                    ref={cardRef}
                    inView={cardInView}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`text-center p-12 rounded-2xl ${
                isDark ? "bg-gray-900/70" : "bg-white/90"
              } backdrop-blur-sm shadow-lg border ${
                isDark ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div
                    className={`text-6xl ${
                      isDark ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    🔍
                  </div>
                  <div
                    className={`absolute -bottom-2 -right-2 p-2 rounded-full ${
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <XCircle
                      size={24}
                      className={isDark ? "text-gray-600" : "text-gray-400"}
                    />
                  </div>
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  No certificates found
                </h3>
                <p
                  className={`max-w-md mx-auto mb-6 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  We couldn't find any certificates matching your search
                  criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  className={`px-5 py-2.5 rounded-lg ${
                    isDark
                      ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-primary hover:to-blue-600 border border-gray-700"
                      : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 hover:from-primaryInLight hover:to-blue-500 hover:text-white border border-gray-200"
                  } transition-all duration-300 flex items-center gap-2`}
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  <Filter size={18} />
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/*  Results Info */}
        {filteredCertificates.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`flex justify-center items-center gap-2 text-sm ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <span
              className={`px-2 py-1 rounded-md ${
                isDark ? "bg-gray-900" : "bg-gray-100"
              }`}
            >
              {filteredCertificates.length}
            </span>
            <span>of {certificatesData.length} certificates</span>
            {selectedCategory !== "all" && (
              <span className="flex items-center gap-1">
                • Filtered by
                <span
                  className={`font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {
                    categories.find((cat) => cat.value === selectedCategory)
                      ?.label
                  }
                </span>
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <CertificateModal
            certificate={selectedCertificate}
            isDark={isDark}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
