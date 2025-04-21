import {
  Award,
  Bookmark,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Filter,
  Shield,
  Sparkles,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export const CertificateModal = ({ certificate, isDark, onClose }) => {
  if (!certificate) return null;

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

  const getCategoryColor = (category, isDark) => {
    const colorMap = {
      frontend: isDark
        ? "from-purple-500 to-indigo-500"
        : "from-purple-400 to-indigo-400",
      fullstack: isDark
        ? "from-blue-500 to-cyan-500"
        : "from-blue-400 to-cyan-400",
      cloud: isDark
        ? "from-teal-500 to-green-500"
        : "from-teal-400 to-green-400",
      design: isDark
        ? "from-pink-500 to-rose-500"
        : "from-pink-400 to-rose-400",
      data: isDark
        ? "from-amber-500 to-orange-500"
        : "from-amber-400 to-orange-400",
      mobile: isDark
        ? "from-green-500 to-emerald-500"
        : "from-green-400 to-emerald-400",
      other: isDark
        ? "from-slate-500 to-gray-500"
        : "from-slate-400 to-gray-400",
    };

    return (
      colorMap[category] ||
      (isDark ? "from-blue-500 to-indigo-500" : "from-blue-400 to-indigo-400")
    );
  };

  // Get category gradient color
  const categoryColor = getCategoryColor(certificate.category, isDark);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`relative max-w-4xl w-full rounded-2xl overflow-hidden ${
          isDark ? "bg-gray-900" : "bg-white"
        } shadow-2xl`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${categoryColor} z-10`}
        ></div>

        {/* Close button */}
        <button
          className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
            isDark
              ? "bg-gray-800/80 text-white hover:bg-gray-700"
              : "bg-gray-200/80 text-gray-800 hover:bg-gray-300"
          } backdrop-blur-sm`}
          onClick={onClose}
          aria-label="Close modal"
        >
          <XCircle size={20} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Certificate Image */}
          <div className="md:w-1/2">
            <div className="relative aspect-video md:aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={certificate.image || "/placeholder.svg"}
                  alt={certificate.title}
                  className="w-full h-full object-contain object-center"
                />
                <div
                  className={`absolute inset-0 ${
                    isDark
                      ? "bg-gradient-to-t from-gray-900 via-transparent to-transparent"
                      : "bg-gradient-to-t from-white via-transparent to-transparent"
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="md:w-1/2 p-6 md:p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  isDark
                    ? `bg-gradient-to-r ${categoryColor} bg-opacity-20 text-white`
                    : `bg-gradient-to-r ${categoryColor} bg-opacity-10 text-gray-800`
                }`}
              >
                {categories.find((c) => c.value === certificate.category)
                  ?.icon || <Shield size={16} />}
                {categories.find((c) => c.value === certificate.category)
                  ?.label || certificate.category}
              </div>

              {certificate.featured && (
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    isDark
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                  }`}
                >
                  <Award size={14} />
                  Featured
                </div>
              )}
            </div>

            <h2
              className={`text-xl md:text-2xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {certificate.title}
            </h2>

            {/* Issuer with logo */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {certificate.issuer.charAt(0)}
                </span>
              </div>
              <div>
                <p
                  className={`font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {certificate.issuer}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {certificate.instructor}
                </p>
              </div>
            </div>

            <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {certificate.description}
            </p>

            {/* Certificate Meta with Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className={`flex flex-col p-3 rounded-lg ${
                  isDark ? "bg-gray-800/50" : "bg-gray-100/50"
                }`}
              >
                <div
                  className={`flex items-center gap-2 mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <Calendar size={16} />
                  <p className="text-xs font-medium">Issue Date</p>
                </div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {certificate.issueDate}
                </p>
              </div>

              <div
                className={`flex flex-col p-3 rounded-lg ${
                  isDark ? "bg-gray-800/50" : "bg-gray-100/50"
                }`}
              >
                <div
                  className={`flex items-center gap-2 mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <Clock size={16} />
                  <p className="text-xs font-medium">Expiration</p>
                </div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {certificate.expirationDate}
                </p>
              </div>

              <div
                className={`flex flex-col p-3 rounded-lg ${
                  isDark ? "bg-gray-800/50" : "bg-gray-100/50"
                }`}
              >
                <div
                  className={`flex items-center gap-2 mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <User size={16} />
                  <p className="text-xs font-medium">Instructor</p>
                </div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {certificate.instructor}
                </p>
              </div>

              <div
                className={`flex flex-col p-3 rounded-lg ${
                  isDark ? "bg-gray-800/50" : "bg-gray-100/50"
                }`}
              >
                <div
                  className={`flex items-center gap-2 mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <Tag size={16} />
                  <p className="text-xs font-medium">Credential ID</p>
                </div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {certificate.credentialId}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3
                className={`text-sm font-semibold mb-3 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {certificate.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${
                      isDark
                        ? "bg-gray-800 text-gray-300 border border-gray-700"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
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
                    ? `bg-gradient-to-r ${categoryColor} text-white hover:opacity-90`
                    : `bg-gradient-to-r ${categoryColor} text-white hover:opacity-90`
                } transition-all duration-300`}
              >
                <ExternalLink size={16} />
                Verify Certificate
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
