import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ArrowLeft, Github, ExternalLink } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { bestProjects as projects } from "../data/bestProjects";
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
      <em style={{ fontStyle: "normal", color: "var(--ac)" }}>{suffix}</em>
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
  const [descOpen, setDescOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => { setDescOpen(false); }, [activeIndex]);

  const wrapperRef = useRef(null);
  const headerRef = useRef(null);
  const sliderRef = useRef(null);
  const footerRef = useRef(null);
  const stickyRef = useRef(null);
  const introRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  // Animasi selalu jalan — abaikan prefers-reduced-motion dari OS
  const reduced = false;

  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.15 });

  /* ── Responsive check ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Scroll-morph intro (desktop only) ──────────────────────
     Fase 1: "SELECTED WORKS" muncul gede & di tengah (masked reveal)
     Fase 2: scroll lagi → morph mengecil + geser kiri-atas + fade
     Fase 3: header/slider/footer fade-in di tempatnya

     NB: TANPA ScrollTrigger pin. "Pin" dilakukan via CSS position:sticky
     pada stickyRef (section = track tinggi 240vh). ScrollTrigger cuma
     scrub timeline berdasar progress scroll. Ini bikin kebal dari race
     antar pinned section (AboutPreview di atas pakai GSAP pin) + nggak
     ada pin-spacer yang bisa bikin crash/ layout meleset. */
  useLayoutEffect(() => {
    if (isMobile !== false) return;
    const section = wrapperRef.current;
    if (!section) return;

    // Reduced-motion: tampilkan semua statis, sembunyikan overlay intro
    if (reduced) {
      gsap.set([headerRef.current, sliderRef.current, footerRef.current], {
        clearProps: "all",
        autoAlpha: 1,
        y: 0,
      });
      if (introRef.current && introRef.current.parentElement)
        introRef.current.parentElement.style.display = "none";
      return;
    }

    const ctx = gsap.context(() => {
      // State awal: konten ke-hide, judul intro besar di tengah
      gsap.set(introRef.current, { autoAlpha: 1, scale: 1, x: 0, y: 0 });
      gsap.set(headerRef.current, { autoAlpha: 0, y: 24 });
      gsap.set(sliderRef.current, { autoAlpha: 0, y: 60 });
      gsap.set(footerRef.current, { autoAlpha: 0, y: 30 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Fase 1 — reveal baris dari balik mask (gsap penuh yang punya transform)
      tl.fromTo(
        [line1Ref.current, line2Ref.current],
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.2,
          ease: "power3.out",
          stagger: 0.1,
          immediateRender: true,
        },
        0.05,
      );

      // (hold ~0.35 → 0.45 — judul "diam" sejenak biar kebaca)

      // Fase 2 — morph: mengecil + geser ke kiri-atas + fade out
      tl.to(
        introRef.current,
        {
          scale: 0.3,
          x: () => -window.innerWidth * 0.3,
          y: () => -window.innerHeight * 0.32,
          autoAlpha: 0,
          ease: "power2.inOut",
          duration: 0.26,
        },
        0.45,
      );

      // Fase 3 — konten asli fade-in di tempatnya (selesai sebelum un-stick)
      tl.to(
        headerRef.current,
        { autoAlpha: 1, y: 0, duration: 0.16, ease: "power3.out" },
        0.5,
      )
        .to(
          sliderRef.current,
          { autoAlpha: 1, y: 0, duration: 0.18, ease: "power3.out" },
          0.56,
        )
        .to(
          footerRef.current,
          { autoAlpha: 1, y: 0, duration: 0.16, ease: "power3.out" },
          0.64,
        );

      // Tail kosong → kasih jeda "settle" sebelum sticky lepas
      tl.to({}, { duration: 0.18 }, 0.82);
    }, section);

    // Re-ukur posisi trigger setelah font besar (Syne) selesai load.
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [isMobile, reduced]);

  /* ── Mobile: trigger entered on inView ── */
  useEffect(() => {
    if (isMobile && inView) setEntered(true);
  }, [isMobile, inView]);

  /* ── Auto-slide (pause saat user lagi baca / hover) ── */
  useEffect(() => {
    if (descOpen || hovered) return; // jangan auto-next pas baca atau kursor di showcase
    const timer = setInterval(() => {
      if (!dragging)
        setActiveIndex((p) => (p === projects.length - 1 ? 0 : p + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [dragging, descOpen, hovered]);

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

  const textPrimary = isDark ? "#e7edf5" : "#10233f";
  const textMuted = isDark ? "rgba(210,222,235,.45)" : "rgba(16,35,63,.45)";
  const borderColor = "rgba(var(--ac2),.18)";
  const cardBg = isDark ? "rgba(10,20,32,.96)" : "rgba(232,236,241,.96)";

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
            0%,100%{box-shadow:0 0 0 0 rgba(var(--ac1),.7)} 50%{box-shadow:0 0 0 5px rgba(var(--ac1),0)}
          }
          .pp-scan {
            position:absolute; left:0; right:0; height:1px;
            background:linear-gradient(90deg,transparent,rgba(var(--ac2),.35),transparent);
            animation:pp-scan 7s ease-in-out infinite;
            pointer-events:none; z-index:8;
          }
          .pp-pdot {
            width:6px; height:6px; border-radius:50%; background:var(--ac);
            flex-shrink:0; animation:pp-pdot 2s infinite;
          }
          .pp-mob-chip {
            display:inline-flex; align-items:center;
            padding:3px 10px;
            border:1px solid rgba(var(--ac2),.2); border-radius:100px;
            font-size:.68rem; color:rgba(var(--ac1),.75);
            background:rgba(var(--ac2),.07);
            letter-spacing:.05em;
          }
          .pp-mob-cta {
            display:inline-flex; align-items:center; gap:7px;
            padding:10px 22px;
            background:var(--ac-deep);
            border:none; border-radius:100px; cursor:pointer;
            font-family:'DM Sans',sans-serif; font-size:.8rem;
            font-weight:500; color:${isDark ? "#10233f" : "white"};
            text-decoration:none;
            transition:background .2s;
          }
          .pp-mob-cta:hover { background:var(--ac); }
          .pp-mob-ghost {
            display:inline-flex; align-items:center; gap:7px;
            padding:10px 22px;
            background:rgba(var(--ac2),.06);
            border:1px solid rgba(var(--ac2),.22); border-radius:100px;
            font-family:'DM Sans',sans-serif; font-size:.8rem;
            font-weight:500; color:rgba(210,222,235,.72);
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

          {/* Corner marks */}
          {[
            {
              top: 14,
              left: 14,
              borderTop: "1px solid rgba(var(--ac2),.35)",
              borderLeft: "1px solid rgba(var(--ac2),.35)",
            },
            {
              top: 14,
              right: 14,
              borderTop: "1px solid rgba(var(--ac2),.35)",
              borderRight: "1px solid rgba(var(--ac2),.35)",
            },
            {
              bottom: 14,
              left: 14,
              borderBottom: "1px solid rgba(var(--ac2),.35)",
              borderLeft: "1px solid rgba(var(--ac2),.35)",
            },
            {
              bottom: 14,
              right: 14,
              borderBottom: "1px solid rgba(var(--ac2),.35)",
              borderRight: "1px solid rgba(var(--ac2),.35)",
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
                  : "1.5px rgba(16,35,63,.15)",
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
                  background: "linear-gradient(90deg,var(--ac),transparent)",
                }}
              />
              <span
                style={{
                  fontSize: ".62rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "rgba(var(--ac1),.6)",
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
                    "linear-gradient(to top, rgba(10,20,32,.85) 0%, transparent 60%)",
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
                  color: "rgba(var(--ac1),.6)",
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
                borderTop: `1px solid rgba(var(--ac2),.08)`,
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
                        ? "linear-gradient(90deg,var(--ac-deep),var(--ac))"
                        : "rgba(var(--ac2),.18)",
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
                background: "var(--ac-deep)",
                borderRadius: 100,
                fontSize: ".83rem",
                fontWeight: 500,
                color: isDark ? "#10233f" : "white",
                textDecoration: "none",
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
          0%,100%{box-shadow:0 0 0 0 rgba(var(--ac1),.7)} 50%{box-shadow:0 0 0 6px rgba(var(--ac1),0)}
        }
        @keyframes pp-arr {
          0%,100%{transform:rotate(45deg) translate(0,0);opacity:.3}
          50%{transform:rotate(45deg) translate(4px,4px);opacity:1}
        }

        .pp-scan {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(var(--ac2),.25),transparent);
          animation:pp-scan 7s ease-in-out infinite;
          pointer-events:none; z-index:8;
        }
        .pp-gridbg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 72px,rgba(var(--ac2),.018) 72px,rgba(var(--ac2),.018) 73px),
            repeating-linear-gradient(90deg,transparent,transparent 72px,rgba(var(--ac2),.018) 72px,rgba(var(--ac2),.018) 73px);
          z-index:0;
        }
        .pp-pdot {
          width:6px; height:6px; border-radius:50%; background:var(--ac);
          flex-shrink:0; animation:pp-pdot 2s infinite;
        }
        .pp-chip {
          display:inline-flex; align-items:center;
          padding:4px 12px;
          border:1px solid rgba(var(--ac2),.2); border-radius:100px;
          font-size:.7rem; color:rgba(var(--ac1),.75);
          background:rgba(var(--ac2),.07);
          letter-spacing:.06em;
          transition: border-color .2s, background .2s;
        }
        .pp-chip:hover {
          border-color:rgba(var(--ac2),.45);
          background:rgba(var(--ac2),.13);
        }
        .pp-cta {
          display:inline-flex; align-items:center; gap:7px;
          padding:11px 26px;
          background:var(--ac-deep);
          border:none; border-radius:100px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:.82rem;
          font-weight:500; color:${isDark ? "#10233f" : "white"};
          text-decoration:none;
          transition:transform .22s, background .22s;
          white-space:nowrap;
        }
        .pp-cta:hover { transform:translateY(-2px); background:var(--ac); }

        .pp-ghost {
          display:inline-flex; align-items:center; gap:7px;
          padding:11px 26px;
          background:rgba(var(--ac2),.06);
          border:1px solid rgba(var(--ac2),.22); border-radius:100px;
          font-family:'DM Sans',sans-serif; font-size:.82rem;
          font-weight:500; color:rgba(210,222,235,.72);
          text-decoration:none;
          transition:transform .22s, border-color .22s;
          white-space:nowrap;
        }
        .pp-ghost:hover { transform:translateY(-2px); border-color:rgba(var(--ac2),.5); }

        .pp-nav-btn {
          width:38px; height:38px; border-radius:50%;
          border:1px solid rgba(var(--ac1),.45);
          background:rgba(var(--ac1),.1);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:var(--ac);
          transition:border-color .2s, background .2s, transform .2s;
        }
        .pp-nav-btn:hover {
          border-color:var(--ac);
          background:rgba(var(--ac1),.2);
          transform:scale(1.08);
        }
        .pp-tstack { display:flex; flex-direction:column; gap:9px; }
        .pp-trow { display:flex; gap:10px; align-items:flex-start; }
        .pp-tcat { flex-shrink:0; width:72px; font-size:.58rem; letter-spacing:.12em; text-transform:uppercase; color:rgba(var(--ac1),.65); padding-top:6px; font-family:'DM Sans',sans-serif; }
        .pp-tchips { display:flex; flex-wrap:wrap; gap:6px; }
        .pp-tchip { font-size:.7rem; padding:4px 11px; border-radius:7px; color:var(--ac); background:rgba(var(--ac1),.1); border:1px solid rgba(var(--ac1),.28); white-space:nowrap; }

        .pp-proj-thumb {
          cursor:pointer;
          border:1px solid rgba(var(--ac2),.12);
          border-radius:8px;
          overflow:hidden;
          transition:border-color .25s, transform .25s;
          flex-shrink:0;
        }
        .pp-proj-thumb:hover { border-color:rgba(var(--ac2),.4); transform:scale(1.03); }
        .pp-proj-thumb.active { border-color:rgba(var(--ac1),.7); }

        .pp-scroll-arrow {
          width:12px; height:12px;
          border-right:1px solid rgba(var(--ac2),.5);
          border-bottom:1px solid rgba(var(--ac2),.5);
          transform:rotate(45deg);
          animation:pp-arr 1.5s ease-in-out infinite;
        }

        /* ── Intro overlay (scroll-morph) ── */
        .pp-intro {
          position:absolute; inset:0; z-index:30;
          display:flex; align-items:center; justify-content:center;
          pointer-events:none;
        }
        .pp-intro-inner {
          text-align:center;
          will-change:transform,opacity;
          transform-origin:center center;
        }
        .pp-intro-title {
          font-family:Syne,sans-serif; font-weight:800;
          font-size:clamp(3.5rem,11vw,9rem); line-height:.84;
          letter-spacing:-.04em; text-transform:uppercase;
        }
        .pp-intro .pp-mask { overflow:hidden; padding:0 .05em; }
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
          // track tinggi → ruang scroll buat scrub. Sticky inner yang "nge-pin".
          height: reduced ? "auto" : "150vh",
          fontFamily: "'DM Sans',sans-serif",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          ref={stickyRef}
          style={{
            position: reduced ? "relative" : "sticky",
            top: 0,
            height: reduced ? "auto" : "100vh",
            minHeight: reduced ? "100vh" : undefined,
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: "80px clamp(32px,5vw,80px) 60px",
            boxSizing: "border-box",
          }}
        >
        <div className="pp-gridbg" />

        {/* Corner marks */}
        {[
          {
            top: 14,
            left: 14,
            borderTop: "1px solid rgba(var(--ac2),.35)",
            borderLeft: "1px solid rgba(var(--ac2),.35)",
          },
          {
            top: 14,
            right: 14,
            borderTop: "1px solid rgba(var(--ac2),.35)",
            borderRight: "1px solid rgba(var(--ac2),.35)",
          },
          {
            bottom: 14,
            left: 14,
            borderBottom: "1px solid rgba(var(--ac2),.35)",
            borderLeft: "1px solid rgba(var(--ac2),.35)",
          },
          {
            bottom: 14,
            right: 14,
            borderBottom: "1px solid rgba(var(--ac2),.35)",
            borderRight: "1px solid rgba(var(--ac2),.35)",
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

        {/* ── INTRO OVERLAY (scroll-morph) ── */}
        <div className="pp-intro" aria-hidden="true">
          <div ref={introRef} className="pp-intro-inner">
            <div className="pp-intro-title">
              <div className="pp-mask">
                <div ref={line1Ref} style={{ color: textPrimary }}>
                  SELECTED
                </div>
              </div>
              <div className="pp-mask">
                <div
                  ref={line2Ref}
                  style={{
                    color: "transparent",
                    WebkitTextStroke: isDark
                      ? "2px rgba(255,255,255,.18)"
                      : "2px rgba(16,35,63,.18)",
                  }}
                >
                  WORKS
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    : "2px rgba(16,35,63,.15)",
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
                  color: "rgba(var(--ac1),.65)",
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
                  "linear-gradient(to top, rgba(10,20,32,.85) 0%, rgba(10,20,32,.1) 60%, transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(10,20,32,.15) 0%, transparent 40%)",
              }}
            />

            {/* Live Demo / Source — overlay pojok kanan-bawah gambar */}
            <div
              style={{ position: "absolute", bottom: 18, right: 18, display: "flex", gap: 8, zIndex: 6 }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {currentProject.liveUrl && (
                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pp-cta"
                  onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Source Code"
                >
                  <Github size={13} />
                </a>
              )}
            </div>


            {/* Bottom info on image */}
            <div
              style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}
            >
              <div
                style={{
                  fontSize: ".6rem",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "rgba(var(--ac1),.55)",
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
                  color: "#e7edf5",
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
                borderTop: "1px solid rgba(var(--ac2),.45)",
                borderLeft: "1px solid rgba(var(--ac2),.45)",
              },
              {
                top: 10,
                right: 10,
                borderTop: "1px solid rgba(var(--ac2),.45)",
                borderRight: "1px solid rgba(var(--ac2),.45)",
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
                borderBottom: `1px solid rgba(var(--ac2),.1)`,
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
                  background: "linear-gradient(90deg,var(--ac),transparent)",
                }}
              />
              <span
                style={{
                  fontSize: ".62rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "rgba(var(--ac1),.6)",
                  fontFamily: "Syne,sans-serif",
                }}
              >
                Project Details
              </span>
            </div>

            {/* Content — no scroll: deskripsi clamp + "Baca selengkapnya" */}
            <div style={{ flex: 1, overflow: "hidden", padding: "20px 20px 18px", display: "flex", flexDirection: "column" }}>
              <motion.div
                key={`content-${activeIndex}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                {/* Project number */}
                <div
                  style={{
                    fontSize: ".62rem",
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "rgba(var(--ac1),.55)",
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
                      "linear-gradient(90deg,rgba(var(--ac2),.3),transparent)",
                    marginBottom: 14,
                  }}
                />

                {/* Description (clamp 5 baris saat tertutup) */}
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: ".84rem",
                    lineHeight: 1.7,
                    color: textMuted,
                    margin: 0,
                    ...(descOpen
                      ? {}
                      : {
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }),
                  }}
                >
                  {currentProject.description}
                </p>

                {currentProject.description &&
                  currentProject.description.length > 150 && (
                    <button
                      onClick={() => setDescOpen((o) => !o)}
                      style={{
                        alignSelf: "flex-start",
                        marginTop: 8,
                        marginBottom: 14,
                        padding: 0,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: ".78rem",
                        fontWeight: 500,
                        color: "var(--ac)",
                      }}
                    >
                      {descOpen ? "Close ↑" : "Read more →"}
                    </button>
                  )}

                {/* Tech stack — disembunyikan saat deskripsi dibuka biar muat tanpa scroll */}
                {!descOpen && (
                  <div style={{ marginTop: 6 }}>
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
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Tech Stack
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 1,
                          background:
                            "linear-gradient(90deg,rgba(var(--ac2),.2),transparent)",
                        }}
                      />
                    </div>
                    <div className="pp-tstack">
                      {Object.entries(currentProject.techStack || {})
                        .filter(([, arr]) => Array.isArray(arr) && arr.length)
                        .map(([cat, arr]) => (
                          <div className="pp-trow" key={cat}>
                            <span className="pp-tcat">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                            <span className="pp-tchips">
                              {arr.map((t, i) => (
                                <span className="pp-tchip" key={i}>{t}</span>
                              ))}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
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
                <img loading="lazy" decoding="async"
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
              background: "rgba(var(--ac2),.12)",
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
                background: "linear-gradient(90deg,var(--ac-deep),var(--ac))",
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
                color: isDark ? "rgba(210,222,235,.25)" : "rgba(16,35,63,.3)",
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
        </div>
      </section>
    </>
  );
}
