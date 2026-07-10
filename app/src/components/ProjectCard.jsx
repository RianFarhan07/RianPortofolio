import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Globe,
  Github,
  ExternalLink,
  Filter,
  Laptop,
  Smartphone,
  Eye,
  PenTool,
} from "lucide-react";

const A = "var(--ac)";
const AD = "var(--ac-deep)";
const AR = "var(--ac1)";
const AR2 = "var(--ac2)";

const categoryMap = {
  all: { label: "All", icon: <Filter size={14} /> },
  web: { label: "Web Apps", icon: <Globe size={14} /> },
  mobile: { label: "Mobile Apps", icon: <Smartphone size={14} /> },
  desktop: { label: "Desktop Apps", icon: <Laptop size={14} /> },
  desain: { label: "Desain", icon: <PenTool size={14} /> },
};

export const ProjectCard = ({ project, isDark, onOpenModal }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cardBg = isDark ? "rgba(10,20,32,0.96)" : "rgba(232,236,241,0.96)";
  const cardBorder = `rgba(${AR2}, 0.18)`;
  const muted = isDark ? "rgba(210,222,235,0.45)" : "rgba(16,35,63,0.45)";
  const muted2 = isDark ? "rgba(210,222,235,0.35)" : "rgba(16,35,63,0.35)";
  const txt = isDark ? "#e7edf5" : "#10233f";
  const cat = categoryMap[project.category] || { label: project.category };

  return (
    <motion.div
      ref={ref}
      initial={{ y: 24, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 14 }}
      className="group relative h-full rounded-[14px] overflow-hidden cursor-pointer"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        fontFamily: "'DM Sans', sans-serif",
      }}
      onClick={() => onOpenModal(project)}
    >
      {/* Image area */}
      <div className="relative overflow-hidden aspect-video">
        <motion.img
          loading="lazy" decoding="async"
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
        {/* Navy-tinted overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${isDark ? "rgba(10,20,32,0.85)" : "rgba(232,236,241,0.85)"} 0%, rgba(10,20,32,0.08) 55%, transparent 100%)` }} />

        {/* Corner brackets */}
        {[
          { t: 8, l: 8, bt: "border-t", bl: "border-l" },
          { t: 8, r: 8, bt: "border-t", br: "border-r" },
          { b: 8, l: 8, bb: "border-b", bl: "border-l" },
          { b: 8, r: 8, bb: "border-b", br: "border-r" },
        ].map((s, i) => (
          <div key={i} className="absolute w-3 h-3 pointer-events-none"
            style={{
              top: s.t, left: s.l, right: s.r, bottom: s.b,
              borderTop: s.bt ? `1px solid rgba(${AR}, 0.35)` : undefined,
              borderLeft: s.bl ? `1px solid rgba(${AR}, 0.35)` : undefined,
              borderRight: s.br ? `1px solid rgba(${AR}, 0.35)` : undefined,
              borderBottom: s.bb ? `1px solid rgba(${AR}, 0.35)` : undefined,
            }} />
        ))}

        {/* Category badge — dark glass pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] tracking-wider uppercase"
            style={{
              background: isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.85)",
              color: A,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              backdropFilter: "blur(6px)",
              border: `1px solid rgba(${AR}, 0.25)`,
            }}>
            {cat.icon} {cat.label}
          </span>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] tracking-wider uppercase"
              style={{
                background: `linear-gradient(135deg, ${AD}, ${A})`,
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                boxShadow: `0 0 16px rgba(${AR}, 0.4)`,
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"
                style={{ animation: "pulse 2s infinite" }} />
              Featured
            </span>
          </div>
        )}

        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <h3 className="text-lg font-bold drop-shadow-md"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            {project.title}
          </h3>
        </div>
      </div>

      {/* Content body */}
      <div className="p-4">
        <p className="text-[13px] leading-relaxed line-clamp-2 mb-4" style={{ color: muted }}>
          {project.description}
        </p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techLogos.slice(0, 4).map((tech, i) => (
            <span key={i} className="text-[11px] px-2.5 py-1 rounded-full"
              style={{
                background: `rgba(${AR}, 0.07)`,
                border: `1px solid rgba(${AR}, 0.2)`,
                color: A,
                fontFamily: "'DM Sans', sans-serif",
              }}>
              {tech}
            </span>
          ))}
          {project.techLogos.length > 4 && (
            <span className="text-[11px] px-2.5 py-1 rounded-full"
              style={{ background: `rgba(${AR}, 0.07)`, border: `1px solid rgba(${AR}, 0.2)`, color: muted2 }}>
              +{project.techLogos.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: `rgba(${AR2}, 0.12)` }}>
          <div className="flex gap-1.5">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: `rgba(${AR}, 0.06)`, border: `1px solid rgba(${AR}, 0.18)`, color: muted }}>
              <Github size={16} />
            </a>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: `rgba(${AR}, 0.06)`, border: `1px solid rgba(${AR}, 0.18)`, color: muted }}>
              <ExternalLink size={16} />
            </a>
          </div>
          <button onClick={e => { e.stopPropagation(); onOpenModal(project); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${AD}, ${A})`,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 0 16px rgba(${AR2 === "var(--ac2)" ? AR : AR2}, 0.35)`,
            }}>
            <Eye size={14} /> Details
          </button>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </motion.div>
  );
};
