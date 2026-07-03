import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IntroContext } from "./PageTransition6Clean";
import { Search, ChevronDown, CheckCircle } from "lucide-react";
import { CertificateCard } from "./CertificateCard";
import { CertificateModal } from "./CertificateModal";
import { useTheme } from "../context/ThemeContext";
import { certificatesData } from "../data/certificates";

const A = "var(--ac)";
const AD = "var(--ac-deep)";
const AR = "var(--ac1)";
const AR2 = "var(--ac2)";

const categories = [
  { value: "all", label: "All" },
  { value: "frontend", label: "Frontend" },
  { value: "fullstack", label: "Full Stack" },
  { value: "cloud", label: "Cloud" },
  { value: "design", label: "Design" },
  { value: "data", label: "Data" },
  { value: "mobile", label: "Mobile" },
  { value: "other", label: "Other" },
];

export default function Certificates() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredCertificates, setFilteredCertificates] = useState(certificatesData);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const { introExited, pageTransitionDone } = useContext(IntroContext);
  const [visible, setVisible] = useState(false);
  const prevPTD = useRef(pageTransitionDone);
  useEffect(() => {
    if (introExited && pageTransitionDone) {
      const isTransition = !prevPTD.current && pageTransitionDone;
      const delay = isTransition ? 40 : 600;
      const t = setTimeout(() => setVisible(true), delay);
      prevPTD.current = pageTransitionDone;
      return () => clearTimeout(t);
    }
    prevPTD.current = pageTransitionDone;
  }, [introExited, pageTransitionDone]);

  useEffect(() => {
    let filtered = certificatesData;
    if (selectedCategory !== "all") filtered = filtered.filter((cert) => cert.category === selectedCategory);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((cert) =>
        cert.title.toLowerCase().includes(term) ||
        cert.issuer.toLowerCase().includes(term) ||
        cert.skills.some((skill) => skill.toLowerCase().includes(term))
      );
    }
    setFilteredCertificates(filtered);
  }, [searchTerm, selectedCategory]);

  const txt = isDark ? "#f0f4ff" : "#0a1230";
  const muted = isDark ? "rgba(220,230,255,0.45)" : "rgba(10,18,48,0.45)";
  const muted2 = isDark ? "rgba(220,230,255,0.28)" : "rgba(10,18,48,0.32)";
  const chipBg = `rgba(${AR}, 0.07)`;
  const chipBorder = `rgba(${AR}, 0.22)`;
  const inputBg = isDark ? "rgba(4,8,28,0.96)" : "rgba(240,244,255,0.96)";

  return (
    <section id="certificates" className="py-16 md:py-24 relative min-h-screen"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes cp-pdot{0%,100%{box-shadow:0 0 0 0 rgba(${AR},.6)}50%{box-shadow:0 0 0 5px rgba(${AR},0)}}
        @keyframes cp-scan{0%{top:0;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0}}
        .cp-scan{position:absolute;left:0;right:0;height:1px;z-index:8;pointer-events:none;
          background:linear-gradient(90deg,transparent,rgba(${AR2},.3),transparent);animation:cp-scan 8s ease-in-out infinite}
        .cp-pdot{width:6px;height:6px;border-radius:50%;background:${A};flex-shrink:0;animation:cp-pdot 2s infinite}
        .cp-chip{display:inline-flex;align-items:center;padding:7px 16px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;cursor:pointer;transition:all .2s;border:1px solid transparent}
        .cp-chip.active{color:#fff;border-color:transparent}
        .cp-chip:not(.active):hover{border-color:${A}}
        .cp-search{border:1px solid;border-radius:100px;padding:10px 16px 10px 42px;font-family:'DM Sans',sans-serif;font-size:.85rem;outline:none;background:transparent;transition:border-color .2s;width:100%}
        .cp-search:focus{border-color:${A}}
        .cp-dropdown{border-radius:14px;overflow:hidden;backdrop-filter:blur(12px)}
        .cp-gridbg{position:absolute;inset:0;z-index:0;pointer-events:none;
          background-image:linear-gradient(rgba(${AR2},.018) 1px,transparent 1px),linear-gradient(90deg,rgba(${AR2},.018) 1px,transparent 1px);
          background-size:72px 72px}
      `}</style>

      <div className="cp-gridbg" />
      <div className="cp-scan" />
      {[
        { top: 20, left: 20, borderTop: `1px solid rgba(${AR2},.3)`, borderLeft: `1px solid rgba(${AR2},.3)` },
        { top: 20, right: 20, borderTop: `1px solid rgba(${AR2},.3)`, borderRight: `1px solid rgba(${AR2},.3)` },
        { bottom: 20, left: 20, borderBottom: `1px solid rgba(${AR2},.3)`, borderLeft: `1px solid rgba(${AR2},.3)` },
        { bottom: 20, right: 20, borderBottom: `1px solid rgba(${AR2},.3)`, borderRight: `1px solid rgba(${AR2},.3)` },
      ].map((s, i) => <div key={i} className="absolute w-4 h-4 z-10 pointer-events-none" style={{ ...s }} />)}

      <div className="relative z-10" style={{ padding: "0 clamp(20px,4vw,60px)", maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <motion.div className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}>
            <div style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${A})` }} />
            <span className="text-xs tracking-[0.22em] uppercase" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: `rgba(${AR}, 0.7)` }}>
              My Credentials
            </span>
            <motion.div className="cp-pdot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }} />
          </motion.div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(3rem, 6vw, 6.5rem)", lineHeight: 0.92, letterSpacing: "-0.04em", textTransform: "uppercase", margin: 0, color: txt }}>
            <motion.span className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}>Professional</motion.span>
            <motion.span className="block" style={{ color: "transparent", WebkitTextStroke: isDark ? "2px rgba(255,255,255,0.18)" : "2px rgba(10,18,48,0.15)", WebkitTextFillColor: "transparent" }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}>Certifications</motion.span>
          </h1>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button key={cat.value} onClick={() => setSelectedCategory(cat.value)}
                  className={`cp-chip ${active ? "active" : ""}`}
                  style={{ background: active ? `linear-gradient(135deg, ${AD}, ${A})` : chipBg, borderColor: active ? "transparent" : chipBorder,
                    color: active ? "#fff" : A, boxShadow: active ? `0 0 14px rgba(${AR}, 0.3)` : undefined }}>
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-56">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: muted2 }} />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="cp-search" style={{ borderColor: chipBorder, color: txt }} />
          </div>
        </div>

        {/* Grid */}
        {filteredCertificates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCertificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} isDark={isDark}
                  onClick={() => { setSelectedCertificate(certificate); document.body.style.overflow = "hidden"; }} />
              ))}
            </div>
            <div className="mt-6 text-center text-xs tracking-wider uppercase" style={{ color: muted2, fontFamily: "'DM Sans', sans-serif" }}>
              Showing {filteredCertificates.length} of {certificatesData.length}
              {selectedCategory !== "all" && <span> · {categories.find(c => c.value === selectedCategory)?.label}</span>}
            </div>
          </>
        ) : (
          <div className="text-center py-20" style={{ color: muted2, fontFamily: "'DM Sans', sans-serif" }}>
            <Search size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm mb-4">No certificates match your criteria</p>
            <button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
              className="px-5 py-2 rounded-full text-xs font-medium transition-all"
              style={{ background: `linear-gradient(135deg, ${AD}, ${A})`, color: "#fff", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 0 14px rgba(${AR}, 0.3)` }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCertificate && (
          <CertificateModal certificate={selectedCertificate} isDark={isDark}
            onClose={() => { setSelectedCertificate(null); document.body.style.overflow = "auto"; }} />
        )}
      </AnimatePresence>
    </section>
  );
}
