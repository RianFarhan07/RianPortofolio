import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import fotoRian from "../assets/foto_rian_3.webp";

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
      <em style={{ fontStyle: "normal", color: "#00d4ff" }}>{suffix}</em>
    </span>
  );
}

/* ─── Main Hero ───────────────────────────────────────────── */
export default function Hero2() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const photoRef = useRef(null);
  const btl1Ref = useRef(null);
  const btrRef = useRef(null);
  const photoImgRef = useRef(null);

  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const xr = (e.clientX / window.innerWidth - 0.5) * 2;
    const yr = (e.clientY / window.innerHeight - 0.5) * 2;
    if (photoRef.current) {
      photoRef.current.style.transform = `translateX(-50%) translateX(${xr * 10}px)`;
    }
    if (photoImgRef.current) {
      photoImgRef.current.style.transform = `rotateY(${xr * 5}deg) rotateX(${-yr * 3}deg)`;
    }
    if (btl1Ref.current) {
      btl1Ref.current.style.transform = `translateX(${xr * -8}px)`;
    }
    if (btrRef.current) {
      btrRef.current.style.transform = `translateX(${xr * -6}px)`;
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

  const blue = "#00d4ff";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes hero2-pdot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.7); }
          50%       { box-shadow: 0 0 0 5px rgba(0,212,255,0); }
        }
        @keyframes hero2-arr {
          0%, 100% { transform: rotate(45deg) translate(0,0); opacity: 0.3; }
          50%       { transform: rotate(45deg) translate(4px,4px); opacity: 1; }
        }
        @keyframes hero2-scan {
          0%   { top: 0;    opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .h2-scan {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,180,255,0.35), transparent);
          z-index: 8;
          pointer-events: none;
          animation: hero2-scan 7s ease-in-out infinite;
        }
        .h2-role-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00d4ff;
          flex-shrink: 0;
          animation: hero2-pdot 2s infinite;
        }
        .h2-scroll-arrow {
          width: 14px; height: 14px;
          border-right: 1px solid rgba(0,180,255,0.5);
          border-bottom: 1px solid rgba(0,180,255,0.5);
          transform: rotate(45deg);
          animation: hero2-arr 1.5s ease-in-out infinite;
        }
        .h2-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          background: linear-gradient(135deg, #0066ff, #00d4ff);
          border: none;
          border-radius: 100px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: white;
          text-decoration: none;
          box-shadow: 0 0 28px rgba(0,100,255,0.45);
          transition: transform 0.25s, box-shadow 0.25s;
          white-space: nowrap;
        }
        .h2-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 45px rgba(0,150,255,0.65);
        }
        .h2-nav-link {
          font-size: 0.72rem;
          color: rgba(220,230,255,0.35);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .h2-nav-link:hover { color: #f0f4ff; }
        .h2-social {
          width: 34px; height: 34px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .h2-social:hover { border-color: #00d4ff; color: #00d4ff; }
      `}</style>

      {/* ══ SECTION WRAPPER — scrollable, no overflow hidden ══ */}
      <section
        id="home"
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          overflow: "hidden" /* clips particles/effects to this section only */,
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
          background: "transparent",
        }}
      >
        {/* Scan line */}
        <div className="h2-scan" />

        {/* Corner marks */}
        {[
          {
            top: 14,
            left: 14,
            borderTop: "1px solid rgba(0,180,255,0.35)",
            borderLeft: "1px solid rgba(0,180,255,0.35)",
          },
          {
            top: 14,
            right: 14,
            borderTop: "1px solid rgba(0,180,255,0.35)",
            borderRight: "1px solid rgba(0,180,255,0.35)",
          },
          {
            bottom: 14,
            left: 14,
            borderBottom: "1px solid rgba(0,180,255,0.35)",
            borderLeft: "1px solid rgba(0,180,255,0.35)",
          },
          {
            bottom: 14,
            right: 14,
            borderBottom: "1px solid rgba(0,180,255,0.35)",
            borderRight: "1px solid rgba(0,180,255,0.35)",
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

        {/* ── BIG TITLE — left-aligned, vertically centered ── */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%",
            zIndex: 3,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            paddingLeft: "clamp(20px, 4vw, 70px)",
          }}
        >
          <span
            ref={btl1Ref}
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(4rem, 9vw, 9.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: isDark ? "#f0f4ff" : "#0a1230",
              ...fade(0.2),
              transform: entered ? "translateX(0)" : "translateX(-40px)",
            }}
          >
            SOFTWARE
          </span>
          <span
            ref={btrRef}
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(4rem, 9vw, 9.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: "transparent",
              WebkitTextStroke: isDark
                ? "2px rgba(255,255,255,0.22)"
                : "2px rgba(10,18,48,0.18)",
              ...fade(0.25),
              transform: entered ? "translateX(0)" : "translateX(40px)",
            }}
          >
            ENGINEER
          </span>
        </div>

        {/* ── PHOTO CENTER ── */}
        <div
          ref={photoRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(320px, 38vw, 580px)",
            height: "100%",
            zIndex: 5,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            ...fade(0.1),
            transition: "opacity 1.1s ease 0.1s",
          }}
        >
          {/* Top glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "40%",
              height: 150,
              background:
                "radial-gradient(ellipse, rgba(0,180,255,0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <img
            ref={photoImgRef}
            src={fotoRian}
            alt="Rian Farhan"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, black 22%, black 68%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, black 22%, black 68%, transparent 100%)",
              filter: isDark
                ? "brightness(0.95) contrast(1.08) saturate(1.12)"
                : "brightness(1.02) contrast(1.05) saturate(1.1)",
              transformStyle: "preserve-3d",
              transition: "transform 1s ease",
            }}
          />
        </div>

        {/* Bottom glow under photo */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "28%",
            height: 200,
            background:
              "radial-gradient(ellipse, rgba(0,80,255,0.35) 0%, transparent 70%)",
            filter: "blur(32px)",
            zIndex: 4,
            pointerEvents: "none",
          }}
        />

        {/* ── SIDE LEFT ── */}
        <div
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
              color: isDark ? "rgba(220,230,255,0.25)" : "rgba(10,18,48,0.3)",
            }}
          >
            Portfolio 2025
          </span>
          <div
            style={{
              width: 1,
              height: 56,
              background:
                "linear-gradient(to bottom, transparent, rgba(0,180,255,0.3), transparent)",
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
              color: isDark ? "rgba(220,230,255,0.25)" : "rgba(10,18,48,0.3)",
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
                background: "rgba(0,180,255,0.08)",
                border: "1px solid rgba(0,180,255,0.22)",
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: blue,
                width: "fit-content",
              }}
            >
              <div className="h2-role-dot" />
              Available Now
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.65,
                maxWidth: 260,
                color: isDark
                  ? "rgba(220,230,255,0.45)"
                  : "rgba(10,18,48,0.55)",
              }}
            >
              Membangun solusi digital yang indah dan bermakna — desain bertemu
              teknologi.
            </p>
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
              Hubungi Saya
            </Link>
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
              { to: 50, suf: "+", label: "Project Done", delay: 1300 },
              { to: 4, suf: "+", label: "Years Exp", delay: 1400 },
              { to: 99, suf: "%", label: "Client Satisfaction", delay: 1500 },
            ].map(({ to, suf, label, delay }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "1.9rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: isDark ? "#f0f4ff" : "#0a1230",
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
                      ? "rgba(220,230,255,0.35)"
                      : "rgba(10,18,48,0.4)",
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
                "linear-gradient(90deg, transparent, #00d4ff, transparent)",
            }}
          />
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(0.75rem, 1.1vw, 0.95rem)",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: isDark ? "rgba(255,255,255,0.85)" : "rgba(10,18,48,0.7)",
            }}
          >
            BASO RIAN FARHAN MALLANTI
          </div>
          <div
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: isDark ? "rgba(220,230,255,0.3)" : "rgba(10,18,48,0.35)",
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
