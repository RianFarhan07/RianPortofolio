import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { IntroContext } from "./PageTransition6Clean";
import { usePauseWhenOffscreen } from "../lib/usePauseWhenOffscreen";
// Navy-era originals, kept for rollback: swap these four lines back in
// import fotoRianDark from "../assets/foto_rian_nobg3.webp";
// import fotoRianDarkMobile from "../assets/foto_rian_nobg3-960.webp";
// import fotoRianLight from "../assets/foto_rian_putih.webp";
// import fotoRianLightMobile from "../assets/foto_rian_putih-960.webp";
// import fotoRianDark from "../assets/foto_rian_nobg_light2.webp";
import fotoRianDark from "../assets/foto_rian_earth_dark.webp";
import fotoRianDarkMobile from "../assets/foto_rian_earth_dark-960.webp";
import fotoRianLight from "../assets/foto_rian_earth_light.webp";
import fotoRianLightMobile from "../assets/foto_rian_earth_light-960.webp";

/* ─── Animated Counter ────────────────────────────────────── */
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

/* ─── Main Hero ───────────────────────────────────────────── */
// The CV the About page already links to (public/rianCV.pdf)
function DownloadCv({ className, short = false }) {
  return (
    <a
      href="/rianCV.pdf"
      download="Baso Rian Farhan Mallanti - CV.pdf"
      aria-label="Download CV"
      className={className}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12" />
        <path d="M7 11l5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      {short ? "CV" : "Download CV"}
    </a>
  );
}

export default function Hero3() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const photoRef = useRef(null);
  const photoImgRef = useRef(null);
  const pauseRef = usePauseWhenOffscreen();

  const location = useLocation();
  const { introExited, pageTransitionDone } = useContext(IntroContext);
  const [entered, setEntered] = useState(false);

  // Animate after intro (first load) or after page transition (navigating back)
  useEffect(() => {
    const t = setTimeout(() => {
      if (introExited && pageTransitionDone) setEntered(true);
    }, 10);
    return () => clearTimeout(t);
  }, [introExited, pageTransitionDone, location.pathname]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (window.innerWidth < 768) return;
    const xr = (e.clientX / window.innerWidth - 0.5) * 2;
    const yr = (e.clientY / window.innerHeight - 0.5) * 2;
    if (photoRef.current) {
      photoRef.current.style.transform = `translateX(-50%) translateX(${xr * 6}px) translateY(${yr * 3}px)`;
    }
    if (photoImgRef.current) {
      photoImgRef.current.style.transform = `rotateY(${xr * 4}deg) rotateX(${-yr * 2}deg)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const fade = (delay) => ({
    opacity: entered ? 1 : 0,
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const blue = "var(--ac)";

  /* ══════════════════════════════════════════
     MOBILE LAYOUT — totally different approach
  ══════════════════════════════════════════ */
  if (isMobile) {
    return (
      <>
        <style>{`

          @keyframes hero-mob-pdot {
            0%, 100% { box-shadow: 0 0 0 0 rgba(var(--ac1),0.7); }
            50%       { box-shadow: 0 0 0 5px rgba(var(--ac1),0); }
          }
          /* transform, not top: the element spans the section and paints its 1px line at the top edge,
             so translateY(100%) travels the full height without triggering layout every frame */
          @keyframes hero-mob-scan {
            0%   { transform: translate3d(0, 0, 0);    opacity: 0; }
            5%   { opacity: 1; }
            95%  { opacity: 1; }
            100% { transform: translate3d(0, 100%, 0); opacity: 0; }
          }
          @keyframes hero-mob-arr {
            0%, 100% { transform: rotate(45deg) translate(0,0); opacity: 0.3; }
            50%       { transform: rotate(45deg) translate(4px,4px); opacity: 1; }
          }
          .mob-scan {
            position: absolute; left: 0; right: 0; top: 0; bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(var(--ac2),0.35), transparent) top / 100% 1px no-repeat;
            z-index: 8; pointer-events: none; will-change: transform, opacity;
            animation: hero-mob-scan 7s ease-in-out infinite;
          }
          .mob-pdot {
            width: 6px; height: 6px; border-radius: 50%;
            background: var(--ac); flex-shrink: 0;
            animation: hero-mob-pdot 2s infinite;
          }
          .mob-scroll-arrow {
            width: 12px; height: 12px;
            border-right: 1px solid rgba(var(--ac2),0.5);
            border-bottom: 1px solid rgba(var(--ac2),0.5);
            transform: rotate(45deg);
            animation: hero-mob-arr 1.5s ease-in-out infinite;
          }
          .mob-cta {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 13px 32px;
            background: var(--ac-deep);
            border: none; border-radius: 100px; cursor: pointer;
            font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
            font-weight: 500; color: ${isDark ? "#232b20" : "white"}; text-decoration: none;
            transition: transform 0.25s, background 0.25s;
          }
          .mob-cta:hover {
            transform: translateY(-2px);
            background: var(--ac);
          }
          .mob-cta-row {
            display: flex; align-items: center; justify-content: center;
            gap: 10px; flex-wrap: wrap;
          }
          .mob-cta-ghost {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 22px;
            background: transparent;
            border: 1px solid rgba(var(--ac2),0.6); border-radius: 100px; cursor: pointer;
            font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
            font-weight: 500; color: ${isDark ? "#e2d6c6" : "#232b20"}; text-decoration: none;
            transition: transform 0.25s, border-color 0.25s;
          }
          .mob-cta-ghost:hover {
            transform: translateY(-2px);
            border-color: var(--ac);
          }
        `}</style>

        <section
          id="home"
          ref={pauseRef}
          style={{
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'DM Sans', sans-serif",
            background: "transparent",
          }}
        >
          <div className="mob-scan" />

          {/* Corner marks */}
          {[
            {
              top: 14,
              left: 14,
              borderTop: "1px solid rgba(var(--ac2),0.35)",
              borderLeft: "1px solid rgba(var(--ac2),0.35)",
            },
            {
              top: 14,
              right: 14,
              borderTop: "1px solid rgba(var(--ac2),0.35)",
              borderRight: "1px solid rgba(var(--ac2),0.35)",
            },
            {
              bottom: 14,
              left: 14,
              borderBottom: "1px solid rgba(var(--ac2),0.35)",
              borderLeft: "1px solid rgba(var(--ac2),0.35)",
            },
            {
              bottom: 14,
              right: 14,
              borderBottom: "1px solid rgba(var(--ac2),0.35)",
              borderRight: "1px solid rgba(var(--ac2),0.35)",
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

          {/* ── FOTO FULL HEIGHT — background layer ── */}
          <div
            data-intro-portrait
            style={{
              position: "absolute",
              bottom: "28%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "180%",
              zIndex: 2,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              opacity: introExited ? 1 : 0,
              transition: introExited ? "opacity 0.6s ease" : "none",
            }}
          >
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={isDark ? fotoRianDarkMobile : fotoRianLightMobile}
              />
              <img
                ref={photoImgRef}
                src={isDark ? fotoRianDark : fotoRianLight}
                alt="Rian Farhan"
                width="1672"
                height="941"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, black 6%, black 80%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, black 6%, black 80%, transparent 100%)",
                  filter: isDark
                    ? "brightness(0.95) contrast(1.08) saturate(1.12)"
                    : "brightness(1.02) contrast(1.05) saturate(1.1)",
                }}
              />
            </picture>
          </div>

          {/* Gradient overlay bawah — supaya teks bottom terbaca */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "45%",
              background:
                isDark
                  ? "linear-gradient(to top, rgba(27,33,25,0.98) 0%, rgba(27,33,25,0.90) 45%, transparent 100%)"
                  : "linear-gradient(to top, rgba(226,214,198,0.98) 0%, rgba(226,214,198,0.90) 45%, transparent 100%)",
              zIndex: 3,
              pointerEvents: "none",
            }}
          />

          {/* ── TITLE TOP — kecil, di belakang foto ── */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: 0,
              right: 0,
              zIndex: 2,
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 0,
              opacity: entered ? 1 : 0,
              transition: "opacity 0.7s ease 0.2s",
            }}
          >
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(1.9rem, 9vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                textTransform: "uppercase",
                color: isDark ? "rgba(216,202,182,0.9)" : "#232b20",
              }}
            >
              SOFTWARE
            </span>
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(1.9rem, 9vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                textTransform: "uppercase",
                color: "transparent",
                WebkitTextStroke: isDark
                  ? "1.5px rgba(255,255,255,0.34)"
                  : "1.5px rgba(35,43,32,0.32)",
              }}
            >
              ENGINEER
            </span>
          </div>

          {/* ── BOTTOM CONTENT ── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "0 24px 90px",
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.75s, transform 0.7s ease 0.75s",
            }}
          >
            {/* Name */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, var(--ac), transparent)",
                }}
              />
              <h1
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  margin: 0,
                  color: isDark
                    ? "rgba(255,255,255,0.9)"
                    : "#232b20",
                  textShadow: isDark
                    ? "0 1px 8px rgba(0,0,0,0.55)"
                    : "0 0 5px rgba(226,214,198,0.95), 0 0 12px rgba(226,214,198,0.9), 0 0 20px rgba(226,214,198,0.8)",
                }}
              >
                BASO RIAN FARHAN MALLANTI
                <span className="sr-only">
                  {" "}
                  — Software Engineer &amp; Fullstack Developer in Jakarta, Indonesia
                </span>
              </h1>
            </div>

            {/* Availability readout */}
            <div
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <div className="mob-pdot" />
              <span
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: blue,
                }}
              >
                Open to work
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "0.83rem",
                lineHeight: 1.6,
                textAlign: "center",
                color: isDark ? "rgba(226,214,198,0.72)" : "rgba(35,43,32,0.78)",
                margin: 0,
                maxWidth: 280,
              }}
            >
              Passionate about building products people love to use
            </p>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 28,
                width: "100%",
              }}
            >
              {[
                { to: 20, suf: "+", label: "Projects", delay: 1300 },
                { to: 4, suf: "+", label: "Years", delay: 1400 },
                { to: 2, suf: "", label: "Web + Mobile", delay: 1500 },
              ].map(({ to, suf, label, delay }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: isDark ? "#e2d6c6" : "#232b20",
                    }}
                  >
                    <AnimCounter to={to} suffix={suf} delay={delay} />
                  </div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: isDark
                        ? "rgba(226,214,198,0.62)"
                        : "rgba(35,43,32,0.75)",
                      marginTop: 2,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mob-cta-row">
              <Link to="/contact" className="mob-cta">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.77 9.81" />
                  <path d="M1 1l22 22" />
                </svg>
                Contact Me
              </Link>
              <DownloadCv className="mob-cta-ghost" short />
            </div>

            {/* Scroll hint */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: isDark ? "rgba(226,214,198,0.55)" : "rgba(35,43,32,0.68)",
              }}
            >
              <div className="mob-scroll-arrow" />
              Scroll
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ══════════════════════════════════════════
     DESKTOP / TABLET LAYOUT — tidak diubah
  ══════════════════════════════════════════ */
  return (
    <>
      <style>{`

        @keyframes hero2-pdot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(var(--ac1),0.7); }
          50%       { box-shadow: 0 0 0 5px rgba(var(--ac1),0); }
        }
        @keyframes hero2-arr {
          0%, 100% { transform: rotate(45deg) translate(0,0); opacity: 0.3; }
          50%       { transform: rotate(45deg) translate(4px,4px); opacity: 1; }
        }
        /* transform, not top (see hero-mob-scan) */
        @keyframes hero2-scan {
          0%   { transform: translate3d(0, 0, 0);    opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { transform: translate3d(0, 100%, 0); opacity: 0; }
        }

        .h2-scan {
          position: absolute; left: 0; right: 0; top: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(var(--ac2),0.35), transparent) top / 100% 1px no-repeat;
          z-index: 8; pointer-events: none; will-change: transform, opacity;
          animation: hero2-scan 7s ease-in-out infinite;
        }
        .h2-role-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--ac); flex-shrink: 0;
          animation: hero2-pdot 2s infinite;
        }
        .h2-scroll-arrow {
          width: 14px; height: 14px;
          border-right: 1px solid rgba(var(--ac2),0.5);
          border-bottom: 1px solid rgba(var(--ac2),0.5);
          transform: rotate(45deg);
          animation: hero2-arr 1.5s ease-in-out infinite;
        }
        .h2-cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 28px;
          background: var(--ac-deep);
          border: none; border-radius: 100px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          font-weight: 500; color: ${isDark ? "#232b20" : "white"}; text-decoration: none;
          transition: transform 0.25s, background 0.25s;
          white-space: nowrap;
        }
        .h2-cta:hover {
          transform: translateY(-2px);
          background: var(--ac);
        }
        .h2-cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px;
          background: transparent;
          border: 1px solid rgba(var(--ac2),0.6); border-radius: 100px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          font-weight: 500; color: ${isDark ? "#e2d6c6" : "#232b20"}; text-decoration: none;
          transition: transform 0.25s, border-color 0.25s;
          white-space: nowrap;
        }
        .h2-cta-ghost:hover {
          transform: translateY(-2px);
          border-color: var(--ac);
        }
        .h2-nav-link {
          font-size: 0.72rem; color: rgba(226,214,198,0.35);
          letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none; transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .h2-nav-link:hover { color: #e2d6c6; }
        .h2-social {
          width: 34px; height: 34px;
          border: 1px solid rgba(255,255,255,0.12); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; color: rgba(255,255,255,0.45);
          text-decoration: none; transition: border-color 0.2s, color 0.2s;
        }
        .h2-social:hover { border-color: var(--ac); color: var(--ac); }
      `}</style>

      <section
        id="home"
        ref={pauseRef}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
          background: "transparent",
        }}
      >
        <div className="h2-scan" />

        {/* Corner marks */}
        {[
          {
            top: 14,
            left: 14,
            borderTop: "1px solid rgba(var(--ac2),0.35)",
            borderLeft: "1px solid rgba(var(--ac2),0.35)",
          },
          {
            top: 14,
            right: 14,
            borderTop: "1px solid rgba(var(--ac2),0.35)",
            borderRight: "1px solid rgba(var(--ac2),0.35)",
          },
          {
            bottom: 14,
            left: 14,
            borderBottom: "1px solid rgba(var(--ac2),0.35)",
            borderLeft: "1px solid rgba(var(--ac2),0.35)",
          },
          {
            bottom: 14,
            right: 14,
            borderBottom: "1px solid rgba(var(--ac2),0.35)",
            borderRight: "1px solid rgba(var(--ac2),0.35)",
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

        {/* ── BIG TITLE — CENTERED behind photo ── */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            zIndex: 3,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            overflow: "hidden",
            padding: "0 8px",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(4.5rem, 10vw, 10.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: isDark ? "#e2d6c6" : "#232b20",
              opacity: entered ? 1 : 0,
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
              transform: entered ? "translateY(0)" : "translateY(-30px)",
            }}
          >
            SOFTWARE
          </span>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(4.5rem, 10vw, 10.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: "transparent",
              WebkitTextStroke: isDark
                ? "2px rgba(255,255,255,0.32)"
                : "2px rgba(35,43,32,0.3)",
              opacity: entered ? 1 : 0,
              transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
              transform: entered ? "translateY(0)" : "translateY(30px)",
            }}
          >
            ENGINEER
          </span>
        </div>

        {/* ── PHOTO CENTER ── */}
        <div
          ref={photoRef}
          data-intro-portrait
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(600px, 75vw, 1200px)",
            zIndex: 5,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            opacity: introExited ? 1 : 0,
            transition: introExited ? "opacity 0.6s ease" : "none",
          }}
        >
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={isDark ? fotoRianDarkMobile : fotoRianLightMobile}
            />
            <img
              ref={photoImgRef}
              src={isDark ? fotoRianDark : fotoRianLight}
              alt="Rian Farhan"
              width="1672"
              height="941"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 5%, black 82%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 5%, black 82%, transparent 100%)",
                filter: isDark
                  ? "brightness(0.95) contrast(1.08) saturate(1.12)"
                  : "brightness(1.02) contrast(1.05) saturate(1.1)",
                transformStyle: "preserve-3d",
                transition: "transform 1s ease",
              }}
            />
          </picture>
        </div>

        {/* ── SIDE LEFT ── */}
        <div
          className="h2-side-left"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "clamp(20px, 3.5vw, 52px)",
            zIndex: 9,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            ...fade(0.6),
          }}
        >
          <span
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: isDark ? "rgba(226,214,198,0.55)" : "rgba(35,43,32,0.68)",
            }}
          >
            Portfolio 2025
          </span>
          <div
            style={{
              width: 1,
              height: 56,
              background:
                "linear-gradient(to bottom, transparent, rgba(var(--ac2),0.3), transparent)",
              alignSelf: "center",
            }}
          />
          <span
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: isDark ? "rgba(226,214,198,0.55)" : "rgba(35,43,32,0.68)",
            }}
          >
            Jakarta — ID
          </span>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            padding: "0 clamp(20px, 4vw, 60px) 36px",
            ...fade(0.75),
            transform: entered ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* LEFT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxWidth: 300,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                width: "fit-content",
              }}
            >
              <div className="h2-role-dot" />
              <span
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: blue,
                }}
              >
                Open to work
              </span>
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.65,
                maxWidth: 260,
                color: isDark ? "rgba(226,214,198,0.72)" : "rgba(35,43,32,0.78)",
                margin: 0,
              }}
            >
              Passionate about building products people love to use
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                alignSelf: "flex-start",
              }}
            >
              <Link to="/contact" className="h2-cta">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.77 9.81" />
                  <path d="M1 1l22 22" />
                </svg>
                Contact Me
              </Link>
              <DownloadCv className="h2-cta-ghost" />
            </div>
          </div>

          {/* RIGHT — Stats */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 18,
            }}
          >
            {[
              { to: 20, suf: "+", label: "Projects", delay: 1300 },
              { to: 4, suf: "+", label: "Years", delay: 1400 },
              { to: 2, suf: "", label: "Web + Mobile", delay: 1500 },
            ].map(({ to, suf, label, delay }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "1.9rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: isDark ? "#e2d6c6" : "#232b20",
                  }}
                >
                  <AnimCounter to={to} suffix={suf} delay={delay} />
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isDark
                      ? "rgba(226,214,198,0.62)"
                      : "rgba(35,43,32,0.75)",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER BOTTOM — Name + Scroll ── */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            zIndex: 11,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            ...fade(0.85),
          }}
        >
          <div
            style={{
              width: 60,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--ac), transparent)",
            }}
          />
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(0.6rem, 2.5vw, 0.95rem)",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: 0,
              color: isDark ? "rgba(255,255,255,0.92)" : "#232b20",
              textShadow: isDark
                ? "0 1px 10px rgba(0,0,0,0.55)"
                : "0 0 6px rgba(226,214,198,0.95), 0 0 14px rgba(226,214,198,0.9), 0 0 24px rgba(226,214,198,0.8)",
              whiteSpace: "nowrap",
            }}
          >
            BASO RIAN FARHAN MALLANTI
            <span className="sr-only">
              {" "}
              — Software Engineer &amp; Fullstack Developer in Jakarta, Indonesia
            </span>
          </h1>
          <div
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: isDark ? "rgba(226,214,198,0.58)" : "rgba(35,43,32,0.72)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div className="h2-scroll-arrow" />
            Scroll
          </div>
        </div>
      </section>
    </>
  );
}
