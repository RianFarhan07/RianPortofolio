// Certificates.jsx
"use client";

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
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Expanded certificates data
const certificatesData = [
  {
    id: 1,
    title: "Advanced React & Redux",
    issuer: "Udemy",
    instructor: "Stephen Grider",
    image: "/certificates/react-redux.jpg",
    issueDate: "November 2023",
    expirationDate: "No Expiration",
    credentialId: "UC-12345678",
    category: "frontend",
    credentialUrl: "https://udemy.com/certificate/UC-12345678/",
    skills: ["React", "Redux", "React Router", "Redux Thunk"],
    description:
      "This certification covers advanced React patterns, Redux architecture, middleware, authentication, and deployment best practices.",
    featured: true,
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    issuer: "freeCodeCamp",
    instructor: "freeCodeCamp",
    image: "/certificates/fullstack.jpg",
    issueDate: "August 2023",
    expirationDate: "No Expiration",
    credentialId: "FCC-98765432",
    category: "fullstack",
    credentialUrl: "https://freecodecamp.org/certification/user/fullstack",
    skills: ["JavaScript", "Node.js", "MongoDB", "Express", "React"],
    description:
      "This comprehensive certification covers all aspects of full-stack web development, including front-end frameworks, back-end technologies, and database management.",
    featured: true,
  },
  {
    id: 3,
    title: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    instructor: "AWS Training",
    image: "/certificates/aws-dev.jpg",
    issueDate: "March 2024",
    expirationDate: "March 2027",
    credentialId: "AWS-DEV-1234567",
    category: "cloud",
    credentialUrl: "https://aws.amazon.com/verification",
    skills: ["AWS Lambda", "S3", "DynamoDB", "CloudFormation", "IAM"],
    description:
      "This certification validates technical expertise in developing and maintaining applications on the AWS platform, focusing on core AWS services, architecture, and best practices.",
    featured: true,
  },
  {
    id: 4,
    title: "UX/UI Design Fundamentals",
    issuer: "Interaction Design Foundation",
    instructor: "IDF Faculty",
    image: "/certificates/uxui.jpg",
    issueDate: "January 2024",
    expirationDate: "No Expiration",
    credentialId: "IDF-87654321",
    category: "design",
    credentialUrl: "https://www.interaction-design.org/certificates/87654321",
    skills: [
      "Wireframing",
      "Prototyping",
      "User Research",
      "UI Design",
      "Usability Testing",
    ],
    description:
      "This certification covers principles of user experience design, including user research methodologies, wireframing techniques, and interaction design patterns.",
    featured: true,
  },
  {
    id: 5,
    title: "Python for Data Science",
    issuer: "DataCamp",
    instructor: "Hugo Bowne-Anderson",
    image: "/certificates/python-ds.jpg",
    issueDate: "May 2023",
    expirationDate: "No Expiration",
    credentialId: "DC-34567890",
    category: "data",
    credentialUrl:
      "https://www.datacamp.com/statement-of-accomplishment/34567890",
    skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Data Analysis"],
    description:
      "This certification demonstrates proficiency in using Python for data manipulation, visualization, and analysis, with a focus on key libraries for data science.",
    featured: false,
  },
  {
    id: 6,
    title: "Kotlin for Android Development",
    issuer: "Coursera",
    instructor: "Doug Stevenson",
    image: "/certificates/kotlin-android.jpg",
    issueDate: "October 2023",
    expirationDate: "No Expiration",
    credentialId: "COURSERA-45678901",
    category: "mobile",
    credentialUrl: "https://www.coursera.org/verify/45678901",
    skills: ["Kotlin", "Android SDK", "Mobile Development", "Material Design"],
    description:
      "This certification covers Kotlin programming for Android, including language fundamentals, Android architecture components, and modern app development practices.",
    featured: false,
  },
  {
    id: 7,
    title: "Agile Project Management",
    issuer: "Scrum.org",
    instructor: "Professional Scrum Trainers",
    image: "/certificates/agile-pm.jpg",
    issueDate: "February 2023",
    expirationDate: "No Expiration",
    credentialId: "PSM-56789012",
    category: "other",
    credentialUrl: "https://www.scrum.org/certificates/56789012",
    skills: [
      "Scrum",
      "Agile",
      "Sprint Planning",
      "Backlog Management",
      "Team Leadership",
    ],
    description:
      "This certification validates knowledge of Agile methodologies, with a focus on the Scrum framework, roles, events, and artifacts for effective project management.",
    featured: false,
  },
  {
    id: 8,
    title: "Cybersecurity Fundamentals",
    issuer: "CompTIA",
    instructor: "CompTIA",
    image: "/certificates/cybersecurity.jpg",
    issueDate: "June 2023",
    expirationDate: "June 2026",
    credentialId: "COMPTIA-67890123",
    category: "other",
    credentialUrl: "https://www.comptia.org/certifications/verify/67890123",
    skills: [
      "Network Security",
      "Cryptography",
      "Security Protocols",
      "Threat Analysis",
    ],
    description:
      "This certification covers essentials of cybersecurity, including network security concepts, threat identification, security policies, and risk management strategies.",
    featured: false,
  },
];

// Define category options
const categories = [
  { value: "all", label: "All Certificates" },
  { value: "frontend", label: "Frontend Development" },
  { value: "fullstack", label: "Full Stack Development" },
  { value: "cloud", label: "Cloud Computing" },
  { value: "design", label: "Design" },
  { value: "data", label: "Data Science" },
  { value: "mobile", label: "Mobile Development" },
  { value: "other", label: "Other" },
];

const CertificateCard = ({ certificate, isDark, onClick }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl overflow-hidden shadow-lg ${
        isDark ? "bg-gray-900" : "bg-white"
      } hover:shadow-xl transition-all duration-300 cursor-pointer group`}
      onClick={onClick}
    >
      {/* Certificate Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={certificate.image || "/placeholder.svg"}
          alt={certificate.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Badge */}
        {certificate.featured && (
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                isDark
                  ? "bg-primary/90 text-white"
                  : "bg-primaryInLight/90 text-white"
              } flex items-center gap-1`}
            >
              <Award size={12} />
              Featured
            </span>
          </div>
        )}

        {/* Issuer Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 py-2 px-4 ${
            isDark ? "bg-gray-900/80" : "bg-white/80"
          } backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-bold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {certificate.issuer}
            </span>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {certificate.issueDate}
            </span>
          </div>
        </div>
      </div>

      {/* Certificate Content */}
      <div className="p-4">
        <h3
          className={`text-lg font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {certificate.title}
        </h3>

        <p
          className={`text-sm mb-3 line-clamp-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {certificate.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {certificate.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-0.5 rounded-full ${
                isDark
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {skill}
            </span>
          ))}
          {certificate.skills.length > 3 && (
            <span
              className={`text-xs px-2 py-0.5 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              +{certificate.skills.length - 3} more
            </span>
          )}
        </div>

        {/* View Button */}
        <div
          className={`flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${
            isDark
              ? "bg-gray-800 text-primary group-hover:bg-primary group-hover:text-white"
              : "bg-gray-100 text-primaryInLight group-hover:bg-primaryInLight group-hover:text-white"
          } transition-colors w-full`}
        >
          <ExternalLink size={12} />
          View Certificate
        </div>
      </div>
    </motion.div>
  );
};

const CertificateModal = ({ certificate, isDark, onClose }) => {
  if (!certificate) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`relative max-w-4xl w-full rounded-xl overflow-hidden ${
          isDark ? "bg-gray-900" : "bg-white"
        } shadow-2xl`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className={`absolute top-4 right-4 z-10 p-1 rounded-full ${
            isDark
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Certificate Image */}
          <div className="md:w-1/2">
            <div className="relative aspect-video md:aspect-square">
              <img
                src={certificate.image || "/placeholder.svg"}
                alt={certificate.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Certificate Details */}
          <div className="md:w-1/2 p-6 md:p-8 max-h-[80vh] overflow-y-auto">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                isDark
                  ? "bg-primary/20 text-primary"
                  : "bg-primaryInLight/20 text-primaryInLight"
              }`}
            >
              <Award size={16} />
              {categories.find((cat) => cat.value === certificate.category)
                ?.label || certificate.category}
            </div>

            <h2
              className={`text-xl md:text-2xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {certificate.title}
            </h2>

            <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {certificate.description}
            </p>

            {/* Certificate Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div
                className={`flex items-center gap-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Calendar size={16} />
                <div>
                  <p className="text-xs font-medium">Issue Date</p>
                  <p className="text-sm">{certificate.issueDate}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Clock size={16} />
                <div>
                  <p className="text-xs font-medium">Expiration</p>
                  <p className="text-sm">{certificate.expirationDate}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <User size={16} />
                <div>
                  <p className="text-xs font-medium">Instructor</p>
                  <p className="text-sm">{certificate.instructor}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Tag size={16} />
                <div>
                  <p className="text-xs font-medium">Credential ID</p>
                  <p className="text-sm">{certificate.credentialId}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3
                className={`text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {certificate.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      isDark
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <CheckCircle size={12} />
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg ${
                  isDark
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-primaryInLight text-white hover:bg-primaryInLight/90"
                } transition-colors`}
              >
                <ExternalLink size={16} />
                Verify Certificate
              </a>

              <button
                className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } transition-colors`}
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

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

  // Filter certificates based on search term and category
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
    // When modal is opened, prevent scrolling on body
    document.body.style.overflow = "hidden";
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedCertificate(null);
    // When modal is closed, allow scrolling on body
    document.body.style.overflow = "auto";
  };

  return (
    <section
      id="certificates"
      className={`py-16 md:py-24 ${
        isDark ? "bg-bgDark" : "bg-bgLight"
      } min-h-screen`}
      ref={ref}
    >
      {/* Background decor */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          } opacity-5 -top-48 -left-48`}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          } opacity-5 -bottom-48 -right-48`}
        />
        <div
          className={`absolute inset-0 opacity-10 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Page Header */}
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
            }`}
          >
            Professional{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDark
                  ? "from-primary to-blue-400"
                  : "from-primaryInLight to-blue-500"
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

        {/* Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Search Input */}
            <div
              className={`flex items-center rounded-lg ${
                isDark
                  ? "bg-gray-900 border border-gray-800"
                  : "bg-white border border-gray-200"
              } px-3 py-2 shadow-sm`}
            >
              <Search
                size={18}
                className={isDark ? "text-gray-500" : "text-gray-400"}
              />
              <input
                type="text"
                placeholder="Search certificates, skills, issuers..."
                className={`ml-2 flex-grow outline-none ${
                  isDark
                    ? "bg-gray-900 text-white placeholder:text-gray-500"
                    : "bg-white text-gray-800 placeholder:text-gray-400"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div
                className={`flex items-center justify-between rounded-lg ${
                  isDark
                    ? "bg-gray-900 border border-gray-800"
                    : "bg-white border border-gray-200"
                } px-3 py-2 shadow-sm cursor-pointer`}
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <div className="flex items-center">
                  <Filter
                    size={18}
                    className={isDark ? "text-gray-500" : "text-gray-400"}
                  />
                  <span
                    className={`ml-2 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
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

              {/* Dropdown */}
              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div
                    className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-10 ${
                      isDark
                        ? "bg-gray-900 border border-gray-800"
                        : "bg-white border border-gray-200"
                    } py-2`}
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
                            ? "text-white hover:bg-gray-800"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setSelectedCategory(category.value);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        {selectedCategory === category.value && (
                          <CheckCircle size={16} className="mr-2" />
                        )}
                        {!selectedCategory !== category.value && (
                          <div className="w-4 mr-2" />
                        )}
                        {category.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Certificates Grid */}
        <div className="mb-8">
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCertificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  isDark={isDark}
                  onClick={() => handleCertificateClick(certificate)}
                />
              ))}
            </div>
          ) : (
            <div
              className={`text-center p-12 rounded-lg ${
                isDark ? "bg-gray-900" : "bg-white"
              } shadow-sm`}
            >
              <div
                className={`text-6xl mb-4 ${
                  isDark ? "text-gray-700" : "text-gray-300"
                }`}
              >
                🔍
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                No certificates found
              </h3>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Try adjusting your search or filter criteria.
              </p>
              <button
                className={`mt-4 px-4 py-2 rounded-lg ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } transition-colors`}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        {filteredCertificates.length > 0 && (
          <div
            className={`text-sm text-center ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Displaying {filteredCertificates.length} of{" "}
            {certificatesData.length} certificates
          </div>
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
