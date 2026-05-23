import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ArrowLeft, Github, ExternalLink } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { bestProjects as projects } from "../data/bestProjects";
import { TechStackTabs } from "./TechStackTabs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Flatten techStack apapun strukturnya ─────────────────
   Bisa berupa: string[], {name,icon}[], [{category, items:[]}]
   Kembalikan array string nama saja. */
function getTechNames(techStack, limit = 6) {
  if (!techStack) return [];
  const flat = Array.isArray(techStack) ? techStack : [techStack];
  const result = [];
  for (const item of flat) {
    if (!item) continue;
    if (typeof item === "string") {
      result.push(item);
      continue;
    }
    if (typeof item === "object" && item.name) {
      result.push(item.name);
      continue;
    }
    // {category, items:[]} shape
    if (item.items && Array.isArray(item.items)) {
      for (const sub of item.items) {
        if (typeof sub === "string") result.push(sub);
        else if (sub?.name) result.push(sub.name);
      }
    }
  }
  return result.slice(0, limit);
}

/* ─── Animated Counter (sama seperti hero/about) ─────────── */
function AnimCounter({ to, suffix = "", delay = 0 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const dur = 2000;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        setVal(Math.round(p * to));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [to, delay]);
  return (
    <span>
      {val}
      <em style={{ fontStyle: "normal", color: "#00d4ff" }}>{suffix}</em>
    </span>
  );
}

export default function ProjectPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [entered, setEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(null);

  const wrapperRef = useRef(null);
  const headerRef = useRef(null);
  const sliderRef = useRef(null);
  const footerRef = useRef(null);

  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.15 });

  /* ── Responsive check ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── GSAP entrance animation (desktop only) ── */
  useEffect(() => {
    if (isMobile !== false) return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          onEnter: () => setEntered(true),
          onLeaveBack: () => setEntered(false),
        },
      });

      tl.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
      })
        .from(
          sliderRef.current,
          { y: 60, opacity: 0, duration: 0.6, ease: "power3.out" },
          0.12,
        )
        .from(
          footerRef.current,
          { y: 30, opacity: 0, duration: 0.5, ease: "power3.out" },
          0.25,
        );
    }, wrapperRef);

    return () => ctx.revert();
  }, [isMobile]);

  /* ── Mobile: trigger entered on inView ── */
  useEffect(() => {
    if (isMobile && inView) setEntered(true);
  }, [isMobile, inView]);

  /* ── Auto-slide ── */
  useEffect(() => {
    const timer = setInterval(() => {
      if (!dragging)
        setActiveIndex((p) => (p === projects.length - 1 ? 0 : p + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [dragging]);

  const nextSlide = () =>
    setActiveIndex((p) => (p === projects.length - 1 ? 0 : p + 1));
  const prevSlide = () =>
    setActiveIndex((p) => (p === 0 ? projects.length - 1 : p - 1));

  /* ── Drag / swipe handlers ── */
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.pageX);
  };
  const handleTouchStart = (e) => {
    setDragging(true);
    setStartX(e.touches[0].pageX);
  };
  const handleMouseUp = () => setDragging(false);
  const handleTouchEnd = () => setDragging(false);
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const diff = startX - e.pageX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
      setDragging(false);
    }
  };
  const handleTouchMove = (e) => {
    if (!dragging) return;
    const diff = startX - e.touches[0].pageX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
      setDragging(false);
    }
  };

  const currentProject = projects[activeIndex];

  const textPrimary = isDark ? "#f0f4ff" : "#0a1230";
  const textMuted = isDark ? "rgba(220,230,255,.45)" : "rgba(10,18,48,.45)";
  const borderColor = "rgba(0,180,255,.18)";
  const cardBg = isDark ? "rgba(4,8,28,.96)" : "rgba(240,244,255,.96)";

  /* ══════════════════════════════════════════
     MOBILE LAYOUT
  ══════════════════════════════════════════ */
  if (isMobile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

          @keyframes pp-scan {
            0%{top:0;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0}
          }
          @keyframes pp-pdot {
            0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,.7)} 50%{box-shadow:0 0 0 5px rgba(0,212,255,0)}
          }
          .pp-scan {
            position:absolute; left:0; right:0; height:1px;
            background:linear-gradient(90deg,transparent,rgba(0,180,255,.35),transparent);
            animation:pp-scan 7s ease-in-out infinite;
            pointer-events:none; z-index:8;
          }
          .pp-pdot {
            width:6px; height:6px; border-radius:50%; background:#00d4ff;
            flex-shrink:0; animation:pp-pdot 2s infinite;
          }
          .pp-mob-chip {
            display:inline-flex; align-items:center;
            padding:3px 10px;
            border:1px solid rgba(0,180,255,.2); border-radius:100px;
            font-size:.68rem; color:rgba(0,212,255,.75);
            background:rgba(0,180,255,.07);
            letter-spacing:.05em;
          }
          .pp-mob-cta {
            display:inline-flex; align-items:center; gap:7px;
            padding:10px 22px;
            background:linear-gradient(135deg,#0066ff,#00d4ff);
            border:none; border-radius:100px; cursor:pointer;
            font-family:'DM Sans',sans-serif; font-size:.8rem;
            font-weight:500; color:white;
            box-shadow:0 0 24px rgba(0,100,255,.35);
            text-decoration:none;
          }
          .pp-mob-ghost {
            display:inline-flex; align-items:center; gap:7px;
            padding:10px 22px;
            background:rgba(0,180,255,.06);
            border:1px solid rgba(0,180,255,.22); border-radius:100px;
            font-family:'DM Sans',sans-serif; font-size:.8rem;
            font-weight:500; color:rgba(220,230,255,.72);
            text-decoration:none;
          }
        `}</style>

        <section
          id="projects"
          ref={ref}
          style={{
            position: "relative",
            padding: "72px 24px 80px",
            fontFamily: "'DM Sans',sans-serif",
            overflow: "hidden",
          }}
        >
          <div className="pp-scan" />

          {/* Corner marks */}
          {[
            {
              top: 14,
              left: 14,
              borderTop: "1px solid rgba(0,180,255,.35)",
              borderLeft: "1px solid rgba(0,180,255,.35)",
            },
            {
              top: 14,
              right: 14,
              borderTop: "1px solid rgba(0,180,255,.35)",
              borderRight: "1px solid rgba(0,180,255,.35)",
            },
            {
              bottom: 14,
              left: 14,
              borderBottom: "1px solid rgba(0,180,255,.35)",
              borderLeft: "1px solid rgba(0,180,255,.35)",
            },
            {
              bottom: 14,
              right: 14,
              borderBottom: "1px solid rgba(0,180,255,.35)",
              borderRight: "1px solid rgba(0,180,255,.35)",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 14,
                height: 14,
                zIndex: 10,
                ...s,
              }}
            />
          ))}

          {/* Section label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity .6s ease, transform .6s ease",
            }}
          >
            <div
              style={{
                width: 28,
                height: 1,
                background: "linear-gradient(90deg,#00d4ff,transparent)",
              }}
            />
            <span
              style={{
                fontSize: ".65rem",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "rgba(0,212,255,.7)",
                fontFamily: "Syne,sans-serif",
                fontWeight: 700,
              }}
            >
              Featured Projects
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "clamp(2rem,9vw,3rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              textTransform: "uppercase",
              marginBottom: 32,
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(30px)",
              transition: "opacity .65s ease .1s, transform .65s ease .1s",
            }}
          >
            <div style={{ color: textPrimary }}>SELECTED</div>
            <div
              style={{
                color: "transparent",
                WebkitTextStroke: isDark
                  ? "1.5px rgba(255,255,255,.15)"
                  : "1.5px rgba(10,18,48,.15)",
              }}
            >
              WORKS
            </div>
          </div>

          {/* Slider */}
          <div
            style={{
              position: "relative",
              border: `1px solid ${borderColor}`,
              borderRadius: 14,
              overflow: "hidden",
              background: cardBg,
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(40px)",
              transition: "opacity .7s ease .2s, transform .7s ease .2s",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {/* Project counter header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 1,
                  background: "linear-gradient(90deg,#00d4ff,transparent)",
                }}
              />
              <span
                style={{
                  fontSize: ".62rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "rgba(0,212,255,.6)",
                  fontFamily: "Syne,sans-serif",
                }}
              >
                Featured Projects
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: ".65rem",
                  color: textMuted,
                  letterSpacing: ".08em",
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>

            {/* Image */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                overflow: "hidden",
              }}
            >
              <motion.img
                key={activeIndex}
                src={currentProject.image || "/placeholder.svg"}
                alt={currentProject.title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(4,8,28,.85) 0%, transparent 60%)",
                }}
              />

              {/* Project number overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 14,
                  fontFamily: "Syne,sans-serif",
                  fontSize: ".65rem",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "rgba(0,212,255,.6)",
                }}
              >
                Project — {String(activeIndex + 1).padStart(2, "0")}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "16px 16px 12px" }}>
              <motion.h3
                key={`title-${activeIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: textPrimary,
                  marginBottom: 6,
                }}
              >
                {currentProject.title}
              </motion.h3>

              <motion.p
                key={`desc-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                style={{
                  fontSize: ".82rem",
                  lineHeight: 1.65,
                  color: textMuted,
                  marginBottom: 12,
                }}
              >
                {currentProject.description}
              </motion.p>

              {/* Tech chips */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 5,
                  marginBottom: 14,
                }}
              >
                {getTechNames(currentProject.techStack, 6).map((name) => (
                  <span key={name} className="pp-mob-chip">
                    {name}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8 }}>
                {currentProject.liveUrl && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pp-mob-cta"
                  >
                    <ExternalLink size={12} /> Live Demo
                  </a>
                )}
                {currentProject.githubUrl && (
                  <a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pp-mob-ghost"
                  >
                    <Github size={12} /> Source
                  </a>
                )}
              </div>
            </div>

            {/* Pagination dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 5,
                padding: "10px 0 12px",
                borderTop: `1px solid rgba(0,180,255,.08)`,
              }}
            >
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width: i === activeIndex ? 18 : 5,
                    height: 5,
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    background:
                      i === activeIndex
                        ? "linear-gradient(90deg,#0066ff,#00d4ff)"
                        : "rgba(0,180,255,.18)",
                    transition: "width .3s ease, background .3s ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* View All button */}
          <div
            style={{
              marginTop: 24,
              textAlign: "center",
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity .7s ease .35s, transform .7s ease .35s",
            }}
          >
            <Link
              to="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                background: "linear-gradient(135deg,#0066ff,#00d4ff)",
                borderRadius: 100,
                fontSize: ".83rem",
                fontWeight: 500,
                color: "white",
                textDecoration: "none",
                boxShadow: "0 0 28px rgba(0,100,255,.35)",
              }}
            >
              View All Projects <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </>
    );
  }

  /* ══════════════════════════════════════════
     DESKTOP LAYOUT
  ══════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes pp-scan {
          0%{top:0;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0}
        }
        @keyframes pp-pdot {
          0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,.7)} 50%{box-shadow:0 0 0 6px rgba(0,212,255,0)}
        }
        @keyframes pp-arr {
          0%,100%{transform:rotate(45deg) translate(0,0);opacity:.3}
          50%{transform:rotate(45deg) translate(4px,4px);opacity:1}
        }

        .pp-scan {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(0,180,255,.25),transparent);
          animation:pp-scan 7s ease-in-out infinite;
          pointer-events:none; z-index:8;
        }
        .pp-gridbg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 72px,rgba(0,180,255,.018) 72px,rgba(0,180,255,.018) 73px),
            repeating-linear-gradient(90deg,transparent,transparent 72px,rgba(0,180,255,.018) 72px,rgba(0,180,255,.018) 73px);
          z-index:0;
        }
        .pp-pdot {
          width:6px; height:6px; border-radius:50%; background:#00d4ff;
          flex-shrink:0; animation:pp-pdot 2s infinite;
        }
        .pp-chip {
          display:inline-flex; align-items:center;
          padding:4px 12px;
          border:1px solid rgba(0,180,255,.2); border-radius:100px;
          font-size:.7rem; color:rgba(0,212,255,.75);
          background:rgba(0,180,255,.07);
          letter-spacing:.06em;
          transition: border-color .2s, background .2s;
        }
        .pp-chip:hover {
          border-color:rgba(0,180,255,.45);
          background:rgba(0,180,255,.13);
        }
        .pp-cta {
          display:inline-flex; align-items:center; gap:7px;
          padding:11px 26px;
          background:linear-gradient(135deg,#0066ff,#00d4ff);
          border:none; border-radius:100px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:.82rem;
          font-weight:500; color:white;
          box-shadow:0 0 28px rgba(0,100,255,.4);
          text-decoration:none;
          transition:transform .22s, box-shadow .22s;
          white-space:nowrap;
        }
        .pp-cta:hover { transform:translateY(-2px); box-shadow:0 0 44px rgba(0,150,255,.65); }

        .pp-ghost {
          display:inline-flex; align-items:center; gap:7px;
          padding:11px 26px;
          background:rgba(0,180,255,.06);
          border:1px solid rgba(0,180,255,.22); border-radius:100px;
          font-family:'DM Sans',sans-serif; font-size:.82rem;
          font-weight:500; color:rgba(220,230,255,.72);
          text-decoration:none;
          transition:transform .22s, border-color .22s;
          white-space:nowrap;
        }
        .pp-ghost:hover { transform:translateY(-2px); border-color:rgba(0,180,255,.5); }

        .pp-nav-btn {
          width:38px; height:38px; border-radius:50%;
          border:1px solid rgba(0,180,255,.22);
          background:rgba(0,180,255,.06);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:rgba(220,230,255,.7);
          transition:border-color .2s, background .2s, transform .2s;
        }
        .pp-nav-btn:hover {
          border-color:rgba(0,180,255,.5);
          background:rgba(0,180,255,.14);
          transform:scale(1.08);
        }

        .pp-proj-thumb {
          cursor:pointer;
          border:1px solid rgba(0,180,255,.12);
          border-radius:8px;
          overflow:hidden;
          transition:border-color .25s, transform .25s;
          flex-shrink:0;
        }
        .pp-proj-thumb:hover { border-color:rgba(0,180,255,.4); transform:scale(1.03); }
        .pp-proj-thumb.active { border-color:rgba(0,212,255,.7); }

        .pp-scroll-arrow {
          width:12px; height:12px;
          border-right:1px solid rgba(0,180,255,.5);
          border-bottom:1px solid rgba(0,180,255,.5);
          transform:rotate(45deg);
          animation:pp-arr 1.5s ease-in-out infinite;
        }
      `}</style>

      <section
        id="projects"
        ref={(el) => {
          ref(el);
          wrapperRef.current = el;
        }}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          overflow: "hidden",
          fontFamily: "'DM Sans',sans-serif",
          display: "flex",
          flexDirection: "column",
          padding: "80px clamp(32px,5vw,80px) 60px",
          boxSizing: "border-box",
        }}
      >
        <div className="pp-scan" />
        <div className="pp-gridbg" />

        {/* Corner marks */}
        {[
          {
            top: 14,
            left: 14,
            borderTop: "1px solid rgba(0,180,255,.35)",
            borderLeft: "1px solid rgba(0,180,255,.35)",
          },
          {
            top: 14,
            right: 14,
            borderTop: "1px solid rgba(0,180,255,.35)",
            borderRight: "1px solid rgba(0,180,255,.35)",
          },
          {
            bottom: 14,
            left: 14,
            borderBottom: "1px solid rgba(0,180,255,.35)",
            borderLeft: "1px solid rgba(0,180,255,.35)",
          },
          {
            bottom: 14,
            right: 14,
            borderBottom: "1px solid rgba(0,180,255,.35)",
            borderRight: "1px solid rgba(0,180,255,.35)",
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 18,
              height: 18,
              zIndex: 10,
              ...s,
            }}
          />
        ))}

        {/* ── SECTION HEADER ── */}
        <div
          ref={headerRef}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 40,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div>
            {/* Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 1,
                  background: "linear-gradient(90deg,#00d4ff,transparent)",
                }}
              />
              <span
                style={{
                  fontSize: ".65rem",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "rgba(0,212,255,.7)",
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 700,
                }}
              >
                Featured Projects
              </span>
            </div>

            {/* Big title */}
            <div
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "clamp(3rem,6vw,6.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.88,
                textTransform: "uppercase",
              }}
            >
              <div style={{ color: textPrimary }}>SELECTED</div>
              <div
                style={{
                  color: "transparent",
                  WebkitTextStroke: isDark
                    ? "2px rgba(255,255,255,.15)"
                    : "2px rgba(10,18,48,.15)",
                }}
              >
                WORKS
              </div>
            </div>
          </div>

          {/* Right side — counter + nav */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="pp-pdot" />
              <span
                style={{
                  fontSize: ".68rem",
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  color: "rgba(0,212,255,.65)",
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="pp-nav-btn"
                onClick={prevSlide}
                aria-label="Previous"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                className="pp-nav-btn"
                onClick={nextSlide}
                aria-label="Next"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN SLIDER AREA ── */}
        <div
          ref={sliderRef}
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 20,
            position: "relative",
            zIndex: 2,
            minHeight: 0,
          }}
        >
          {/* ── LEFT: Image panel ── */}
          <div
            style={{
              position: "relative",
              border: `1px solid ${borderColor}`,
              borderRadius: 14,
              overflow: "hidden",
              cursor: "grab",
              userSelect: "none",
              height: 460,
              maxHeight: "55vh",
              flexShrink: 0,
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            <motion.img
              key={activeIndex}
              src={currentProject.image || "/placeholder.svg"}
              alt={currentProject.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                display: "block",
                position: "absolute",
                inset: 0,
              }}
            />

            {/* Gradient overlays */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(4,8,28,.85) 0%, rgba(4,8,28,.1) 60%, transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(4,8,28,.15) 0%, transparent 40%)",
              }}
            />

            {/* Scan line on image */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg,transparent,rgba(0,180,255,.3),transparent)",
                animation: "pp-scan 7s ease-in-out infinite 1.5s",
                pointerEvents: "none",
              }}
            />

            {/* Bottom info on image */}
            <div
              style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}
            >
              <div
                style={{
                  fontSize: ".6rem",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "rgba(0,212,255,.55)",
                  marginBottom: 6,
                }}
              >
                Project — {String(activeIndex + 1).padStart(2, "0")}
              </div>
              <motion.h2
                key={`img-title-${activeIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontSize: "clamp(1.4rem,2.5vw,2.2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#f0f4ff",
                  marginBottom: 10,
                }}
              >
                {currentProject.title}
              </motion.h2>

              {/* Tech chips on image */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {getTechNames(currentProject.techStack, 5).map((name) => (
                  <span
                    key={name}
                    style={{
                      fontSize: ".65rem",
                      padding: "3px 10px",
                      borderRadius: 100,
                      border: "1px solid rgba(255,255,255,.18)",
                      background: "rgba(255,255,255,.08)",
                      color: "rgba(255,255,255,.75)",
                      letterSpacing: ".05em",
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Corner marks on image */}
            {[
              {
                top: 10,
                left: 10,
                borderTop: "1px solid rgba(0,180,255,.45)",
                borderLeft: "1px solid rgba(0,180,255,.45)",
              },
              {
                top: 10,
                right: 10,
                borderTop: "1px solid rgba(0,180,255,.45)",
                borderRight: "1px solid rgba(0,180,255,.45)",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{ position: "absolute", width: 12, height: 12, ...s }}
              />
            ))}
          </div>

          {/* ── RIGHT: Content panel ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              border: `1px solid ${borderColor}`,
              borderRadius: 14,
              background: cardBg,
              overflow: "hidden",
              height: 460,
              maxHeight: "55vh",
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: `1px solid rgba(0,180,255,.1)`,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 1,
                  background: "linear-gradient(90deg,#00d4ff,transparent)",
                }}
              />
              <span
                style={{
                  fontSize: ".62rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "rgba(0,212,255,.6)",
                  fontFamily: "Syne,sans-serif",
                }}
              >
                Project Details
              </span>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>
              <motion.div
                key={`content-${activeIndex}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                {/* Project title */}
                <div
                  style={{
                    fontSize: ".62rem",
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "rgba(0,212,255,.55)",
                    marginBottom: 6,
                  }}
                >
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </div>
                <h3
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: textPrimary,
                    marginBottom: 12,
                    lineHeight: 1.1,
                  }}
                >
                  {currentProject.title}
                </h3>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg,rgba(0,180,255,.3),transparent)",
                    marginBottom: 14,
                  }}
                />

                {/* Description */}
                <p
                  style={{
                    fontSize: ".84rem",
                    lineHeight: 1.7,
                    color: textMuted,
                    marginBottom: 18,
                  }}
                >
                  {currentProject.description}
                </p>

                {/* Tech stack section */}
                <div style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: ".6rem",
                        letterSpacing: ".15em",
                        textTransform: "uppercase",
                        color: textMuted,
                      }}
                    >
                      Tech Stack
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background:
                          "linear-gradient(90deg,rgba(0,180,255,.2),transparent)",
                      }}
                    />
                  </div>
                  <TechStackTabs techStack={currentProject.techStack} />
                </div>
              </motion.div>
            </div>

            {/* Action buttons — pinned to bottom */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: `1px solid rgba(0,180,255,.1)`,
                display: "flex",
                gap: 8,
                flexShrink: 0,
              }}
            >
              {currentProject.liveUrl && (
                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pp-cta"
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
              {currentProject.githubUrl && (
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pp-ghost"
                >
                  <Github size={13} /> Source Code
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── FOOTER BAR ── */}
        <div
          ref={footerRef}
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Thumbnail strip */}
          <div style={{ display: "flex", gap: 8 }}>
            {projects.map((p, i) => (
              <button
                key={i}
                className={`pp-proj-thumb${i === activeIndex ? " active" : ""}`}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: 52,
                  height: 36,
                  padding: 0,
                  background: "none",
                }}
              >
                <img
                  src={p.image || "/placeholder.svg"}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    opacity: i === activeIndex ? 1 : 0.45,
                    transition: "opacity .25s",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(0,180,255,.12)",
              margin: "0 20px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${((activeIndex + 1) / projects.length) * 100}%`,
                background: "linear-gradient(90deg,#0066ff,#00d4ff)",
                transition: "width .4s ease",
              }}
            />
          </div>

          {/* View all + scroll hint */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: ".62rem",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: isDark ? "rgba(220,230,255,.25)" : "rgba(10,18,48,.3)",
              }}
            >
              <div className="pp-scroll-arrow" />
              Scroll
            </div>
            <Link to="/projects" className="pp-cta">
              View All <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
