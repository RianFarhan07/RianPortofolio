import { motion } from "framer-motion";
const A = "var(--ac)";
const AD = "var(--ac-deep)";
const AR = "var(--ac1)";
const AR2 = "var(--ac2)";

export const CertificateCard = ({ certificate, isDark, onClick }) => {
  const cardBg = isDark ? "rgba(10,20,32,0.96)" : "rgba(232,236,241,0.96)";
  const cardBorder = `rgba(${AR2}, 0.18)`;
  const muted = isDark ? "rgba(210,222,235,0.45)" : "rgba(16,35,63,0.45)";
  const muted2 = isDark ? "rgba(210,222,235,0.28)" : "rgba(16,35,63,0.32)";
  const txt = isDark ? "#e7edf5" : "#10233f";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 + (certificate.id % 10) * 0.05 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="relative rounded-[14px] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ background: cardBg, border: `1px solid ${cardBorder}`, fontFamily: "'DM Sans', sans-serif" }}>
        {/* Accent top bar */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${AD}, ${A})` }} />

        <div className="p-5">
          {/* Featured badge */}
          {certificate.featured && (
            <div className="absolute top-5 right-5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase"
                style={{ background: `linear-gradient(135deg, ${AD}, ${A})`, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, boxShadow: `0 0 12px rgba(${AR}, 0.35)` }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white" style={{ animation: "pulse 2s infinite" }} />
                Featured
              </span>
            </div>
          )}

          {/* Category pill */}
          <span className="inline-flex items-center gap-1 mb-3 px-2.5 py-1 rounded-full text-[11px] tracking-wider uppercase"
            style={{ background: `rgba(${AR}, 0.07)`, border: `1px solid rgba(${AR}, 0.2)`, color: A, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            {certificate.category === "frontend" ? "Frontend" : certificate.category === "fullstack" ? "Full Stack" :
             certificate.category === "cloud" ? "Cloud" : certificate.category === "design" ? "Design" :
             certificate.category === "data" ? "Data" : certificate.category === "mobile" ? "Mobile" : "Other"}
          </span>

          {/* Title */}
          <h3 className="text-base font-bold mb-1 pr-16" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: txt, letterSpacing: "-0.01em" }}>
            {certificate.title}
          </h3>

          {/* Issuer + date */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[13px] font-medium" style={{ color: A }}>{certificate.issuer}</span>
            <span className="text-[11px]" style={{ color: muted2 }}>· {certificate.issueDate}</span>
          </div>

          {/* Description */}
          <p className="text-[13px] leading-relaxed line-clamp-2 mb-4" style={{ color: muted }}>
            {certificate.description}
          </p>

          {/* Skills chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {certificate.skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-full"
                style={{ background: `rgba(${AR}, 0.06)`, border: `1px solid rgba(${AR}, 0.15)`, color: A }}>
                {skill}
              </span>
            ))}
            {certificate.skills.length > 3 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ color: muted2 }}>+{certificate.skills.length - 3}</span>
            )}
          </div>

          {/* View button */}
          <button className="flex items-center justify-center gap-1.5 w-full text-xs px-3 py-2 rounded-full font-medium transition-all duration-200"
            style={{
              background: `rgba(${AR}, 0.06)`,
              border: `1px solid rgba(${AR}, 0.18)`,
              color: A,
              fontFamily: "'DM Sans', sans-serif",
            }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Details
          </button>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </motion.div>
  );
};
