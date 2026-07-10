import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IntroContext } from "./PageTransition6Clean";
import {
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { projectsData } from "../data/projects";
import { ProjectModal } from "./ProjectModal";
import { ProjectCard } from "./ProjectCard";

const A = "var(--ac)";
const AD = "var(--ac-deep)";
const AR = "var(--ac1)";
const AR2 = "var(--ac2)";

const categories = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "desain", label: "Design" },
];

const combinedData = [...projectsData.map((p) => ({ ...p, type: "project" }))];

export default function Projects() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const { introExited, pageTransitionDone } = useContext(IntroContext);
  const [visible, setVisible] = useState(false);
  const [visibleKey, setVisibleKey] = useState(0);
  const prevPTDone = useRef(pageTransitionDone);
  useEffect(() => {
    if (introExited && pageTransitionDone) {
      const isTransition = !prevPTDone.current && pageTransitionDone;
      const delay = isTransition ? 40 : 600;
      if (!isTransition) setVisibleKey(k => k + 1);
      const t = setTimeout(() => setVisible(true), delay);
      prevPTDone.current = pageTransitionDone;
      return () => clearTimeout(t);
    }
    prevPTDone.current = pageTransitionDone;
  }, [introExited, pageTransitionDone]);

  const ITEMS_PER_PAGE = isMobile ? 6 : 12;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const filtered = combinedData.filter((item) => {
      const categoryMatch =
        activeCategory === "all" ||
        activeCategory === item.type ||
        (activeCategory === "mobile" && (item.category === "mobile" || item.category === "android")) ||
        activeCategory === item.category;
      const query = searchQuery.toLowerCase();
      const searchMatch =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.type === "project" && item.techLogos.some((tech) => tech.toLowerCase().includes(query)));
      return categoryMatch && searchMatch;
    });
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const goToPage = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const txt = isDark ? "#e7edf5" : "#10233f";
  const muted = isDark ? "rgba(210,222,235,0.45)" : "rgba(16,35,63,0.45)";
  const muted2 = isDark ? "rgba(210,222,235,0.28)" : "rgba(16,35,63,0.32)";
  const chipBg = `rgba(${AR}, 0.07)`;
  const chipBorder = `rgba(${AR}, 0.22)`;
  const pageBg = isDark ? "rgba(10,20,32,0.96)" : "rgba(232,236,241,0.96)";
  const pageBorder = `rgba(${AR2}, 0.18)`;

  return (
    <section
      id="projects"
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s" }}
      key={visibleKey}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes pp-pdot { 0%,100% { box-shadow: 0 0 0 0 rgba(${AR},0.6); } 50% { box-shadow: 0 0 0 5px rgba(${AR},0); } }
        @keyframes pp-scan { 0% { top: 0; opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .pp-scan { position: absolute; left: 0; right: 0; height: 1px; z-index: 8; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(${AR2}, 0.3), transparent);
          animation: pp-scan 8s ease-in-out infinite; }
        .pp-pdot { width: 6px; height: 6px; border-radius: 50%; background: ${A}; flex-shrink: 0; animation: pp-pdot 2s infinite; }
        .pp-chip { display: inline-flex; align-items: center; padding: 7px 16px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .pp-chip.active { color: #fff; border-color: transparent; }
        .pp-chip:not(.active):hover { border-color: ${A}; }
        .pp-search { width: 100%; background: transparent; border: 1px solid; border-radius: 100px; padding: 10px 16px 10px 42px; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
        .pp-search:focus { border-color: ${A}; }
        .pp-page-btn { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; background: transparent; }
        .pp-page-btn.active { color: #fff; border-color: transparent; }
        .pp-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .pp-gridbg { position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(${AR2}, 0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(${AR2}, 0.018) 1px, transparent 1px);
          background-size: 72px 72px; }
      `}</style>

      <div className="pp-gridbg" />
      <div className="pp-scan" />

      {/* Corner brackets */}
      {[
        { top: 20, left: 20, borderTop: `1px solid rgba(${AR2}, 0.3)`, borderLeft: `1px solid rgba(${AR2}, 0.3)` },
        { top: 20, right: 20, borderTop: `1px solid rgba(${AR2}, 0.3)`, borderRight: `1px solid rgba(${AR2}, 0.3)` },
        { bottom: 20, left: 20, borderBottom: `1px solid rgba(${AR2}, 0.3)`, borderLeft: `1px solid rgba(${AR2}, 0.3)` },
        { bottom: 20, right: 20, borderBottom: `1px solid rgba(${AR2}, 0.3)`, borderRight: `1px solid rgba(${AR2}, 0.3)` },
      ].map((s, i) => (
        <div key={i} className="absolute w-4 h-4 z-10 pointer-events-none" style={{ ...s }} />
      ))}

      <div className="relative z-10" style={{ padding: "0 clamp(20px, 4vw, 60px)", maxWidth: 1280, margin: "0 auto" }}>
        {/* Section Header — Syne two-line + accent divider */}
        <div className="mb-10 md:mb-14">
          <motion.div className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}>
            <div style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${A})` }} />
            <span className="text-xs tracking-[0.22em] uppercase" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: `rgba(${AR}, 0.7)` }}>
              My Work
            </span>
            <motion.div className="pp-pdot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }} />
          </motion.div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 6vw, 6.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            margin: 0,
            color: txt,
          }}>
            <motion.span className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}>
              Selected
            </motion.span>
            <motion.span className="block" style={{
              color: "transparent",
              WebkitTextStroke: isDark ? "2px rgba(255,255,255,0.18)" : "2px rgba(16,35,63,0.15)",
              WebkitTextFillColor: "transparent",
            }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}>
              Works
            </motion.span>
          </h1>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = activeCategory === cat.value;
              return (
                <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                  className={`pp-chip ${active ? "active" : ""}`}
                  style={{
                    background: active ? `linear-gradient(135deg, ${AD}, ${A})` : chipBg,
                    borderColor: active ? "transparent" : chipBorder,
                    color: active ? "#fff" : A,
                    boxShadow: active ? `0 0 14px rgba(${AR}, 0.3)` : undefined,
                  }}>
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="relative w-full md:w-56">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: muted2 }} />
            <input type="text" placeholder="Search..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pp-search"
              style={{ borderColor: chipBorder, color: txt }}
            />
          </div>
        </div>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {currentItems.map((item) => (
                  <ProjectCard
                    key={item.id}
                    project={item}
                    isDark={isDark}
                    onOpenModal={(p) => { setSelectedProject(p); setIsModalOpen(true); }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-1.5">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="pp-page-btn" style={{ borderColor: chipBorder, color: muted }}>
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button key={page} onClick={() => goToPage(page)}
                        className={`pp-page-btn ${currentPage === page ? "active" : ""}`}
                        style={{
                          background: currentPage === page ? `linear-gradient(135deg, ${AD}, ${A})` : "transparent",
                          borderColor: currentPage === page ? "transparent" : chipBorder,
                          color: currentPage === page ? "#fff" : muted,
                          boxShadow: currentPage === page ? `0 0 14px rgba(${AR}, 0.35)` : undefined,
                        }}>
                        {page}
                      </button>
                    );
                  } else if ((page === currentPage - 2 && currentPage > 3) || (page === currentPage + 2 && currentPage < totalPages - 2)) {
                    return <span key={page} className="w-[38px] h-[38px] flex items-center justify-center" style={{ color: muted2 }}>…</span>;
                  }
                  return null;
                })}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="pp-page-btn" style={{ borderColor: chipBorder, color: muted }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="mt-6 text-center text-xs tracking-wider uppercase" style={{ color: muted2, fontFamily: "'DM Sans', sans-serif" }}>
              Showing {Math.min(endIndex, totalItems) - startIndex} of {totalItems}
              {totalPages > 1 && ` · page ${currentPage}/${totalPages}`}
            </div>
          </>
        ) : (
          <div className="text-center py-20" style={{ color: muted2, fontFamily: "'DM Sans', sans-serif" }}>
            <Search size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">No items match your criteria</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isDark={isDark}
        />
      )}
    </section>
  );
}
