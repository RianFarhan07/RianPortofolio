import { motion } from "framer-motion";
import {
  Award,
  Bookmark,
  CheckCircle,
  Clock,
  ExternalLink,
  Filter,
  Shield,
  Sparkles,
  Tag,
} from "lucide-react";

const getCategoryColor = (category, isDark) => {
  const colorMap = {
    frontend: isDark
      ? "from-purple-500 to-indigo-500"
      : "from-purple-400 to-indigo-400",
    fullstack: isDark
      ? "from-blue-500 to-cyan-500"
      : "from-blue-400 to-cyan-400",
    cloud: isDark ? "from-teal-500 to-green-500" : "from-teal-400 to-green-400",
    design: isDark ? "from-pink-500 to-rose-500" : "from-pink-400 to-rose-400",
    data: isDark
      ? "from-amber-500 to-orange-500"
      : "from-amber-400 to-orange-400",
    mobile: isDark
      ? "from-green-500 to-emerald-500"
      : "from-green-400 to-emerald-400",
    other: isDark ? "from-slate-500 to-gray-500" : "from-slate-400 to-gray-400",
  };

  return (
    colorMap[category] ||
    (isDark ? "from-blue-500 to-indigo-500" : "from-blue-400 to-indigo-400")
  );
};

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

export const CertificateCard = ({ certificate, isDark, onClick }) => {
  const categoryColor = getCategoryColor(certificate.category, isDark);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className={`relative rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
          isDark
            ? "shadow-lg shadow-primary/10"
            : "shadow-xl shadow-primaryInLight/10"
        }`}
      >
        {/* Top gradient border */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryColor} z-10`}
        ></div>

        {/* Card background with slight gradient */}
        <div
          className={`relative ${
            isDark
              ? "bg-gradient-to-b from-gray-900 to-gray-950"
              : "bg-gradient-to-b from-gray-50 to-white"
          }`}
        >
          {/* Certificate name area */}
          <div className="relative p-5">
            {/* Featured badge */}
            {certificate.featured && (
              <div className="absolute top-4 right-4">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    isDark
                      ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-600 border border-amber-500/30"
                  }`}
                >
                  <Award size={10} />
                  <span>Featured</span>
                </div>
              </div>
            )}

            {/* Category pill */}
            <div
              className={`inline-flex items-center gap-1 mb-3 px-2.5 py-1 rounded-full text-xs ${
                isDark
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {categories.find((c) => c.value === certificate.category)
                ?.icon || <Tag size={12} />}
              <span>
                {categories.find((c) => c.value === certificate.category)
                  ?.label || certificate.category}
              </span>
            </div>

            {/* Certificate title */}
            <h3
              className={`text-lg font-bold mb-1 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {certificate.title}
            </h3>

            {/* Issuer with logo */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isDark ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {certificate.issuer.charAt(0)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {certificate.issuer}
                </span>
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  • {certificate.issueDate}
                </span>
              </div>
            </div>

            {/* Description */}
            <p
              className={`text-sm line-clamp-2 mb-4 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {certificate.description}
            </p>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {certificate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    isDark
                      ? "border-gray-800 bg-gray-800/50 text-gray-300"
                      : "border-gray-200 bg-gray-100/50 text-gray-700"
                  }`}
                >
                  {skill}
                </span>
              ))}
              {certificate.skills.length > 3 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  +{certificate.skills.length - 3}
                </span>
              )}
            </div>

            {/* View button */}
            <div
              className={`flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg ${
                isDark
                  ? "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-primary hover:to-primary text-gray-300 hover:text-white border border-gray-800"
                  : "bg-gradient-to-r from-gray-100 to-gray-50 hover:from-primaryInLight hover:to-primaryInLight text-gray-700 hover:text-white border border-gray-200"
              } transition-all duration-300`}
            >
              <ExternalLink size={12} />
              View Certificate Details
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
