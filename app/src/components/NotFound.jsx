import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FolderGit2, Mail } from "lucide-react";
import { IntroContext } from "./PageTransition6Clean";
import { useTheme } from "../context/ThemeContext";

const A = "var(--ac)";
const AR = "var(--ac1)";
const AR2 = "var(--ac2)";

const LINKS = [
  { to: "/projects", label: "Selected Works", Icon: FolderGit2 },
  { to: "/contact", label: "Get In Touch", Icon: Mail },
];

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { introExited, pageTransitionDone } = useContext(IntroContext);
  const [visible, setVisible] = useState(false);
  const prevPTD = useRef(pageTransitionDone);
  useEffect(() => {
    if (introExited && pageTransitionDone) {
      const isTransition = !prevPTD.current && pageTransitionDone;
      const t = setTimeout(() => setVisible(true), isTransition ? 40 : 600);
      prevPTD.current = pageTransitionDone;
      return () => clearTimeout(t);
    }
    prevPTD.current = pageTransitionDone;
  }, [introExited, pageTransitionDone]);

  const txt = isDark ? "#e7edf5" : "#10233f";
  const muted = isDark ? "rgba(210,222,235,0.45)" : "rgba(16,35,63,0.45)";

  return (
    <section
      className="relative min-h-[80vh] flex items-center overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity .5s ease" }}
    >
      {[
        { top: 20, left: 20, borderTop: `1px solid rgba(${AR2},.3)`, borderLeft: `1px solid rgba(${AR2},.3)` },
        { top: 20, right: 20, borderTop: `1px solid rgba(${AR2},.3)`, borderRight: `1px solid rgba(${AR2},.3)` },
        { bottom: 20, left: 20, borderBottom: `1px solid rgba(${AR2},.3)`, borderLeft: `1px solid rgba(${AR2},.3)` },
        { bottom: 20, right: 20, borderBottom: `1px solid rgba(${AR2},.3)`, borderRight: `1px solid rgba(${AR2},.3)` },
      ].map((s, i) => (
        <div key={i} className="absolute w-4 h-4 z-10 pointer-events-none" style={{ ...s }} />
      ))}

      <div
        className="relative z-10 w-full"
        style={{ padding: "0 clamp(20px,4vw,60px)", maxWidth: 1280, margin: "0 auto" }}
      >
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <div style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${A})` }} />
          <span
            className="text-xs tracking-[0.22em] uppercase"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: `rgba(${AR}, 0.7)` }}
          >
            Error 404
          </span>
        </motion.div>

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 6vw, 6.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            margin: 0,
            color: txt,
          }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          >
            Route
          </motion.span>
          <motion.span
            className="block"
            style={{
              color: "transparent",
              WebkitTextStroke: isDark ? "2px rgba(255,255,255,0.18)" : "2px rgba(16,35,63,0.15)",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            Not Found
          </motion.span>
        </h1>

        <motion.p
          className="mt-6 max-w-md text-sm leading-relaxed"
          style={{ color: muted }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
        >
          This path doesn't resolve to anything. The work is still where you left it.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-80"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              background: A,
              color: "#0d1520",
            }}
          >
            <ArrowLeft size={15} />
            Back Home
          </Link>

          {LINKS.map((link) => {
            const Icon = link.Icon;
            return (
            <Link
              key={link.to}
              to={link.to}
              className="inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-80"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                color: txt,
                border: `1px solid rgba(${AR2}, 0.25)`,
              }}
            >
              <Icon size={15} />
              {link.label}
            </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
