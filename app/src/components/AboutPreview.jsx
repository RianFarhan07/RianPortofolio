import { useState, useEffect, useRef } from "react";
import { ArrowRight, Award, Briefcase, Clock, MapPin, Code2, Layers, Quote } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import aboutImage from "../assets/foto-nobg.png";
import BounceCards from "./BounceCards";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://images.prismic.io/qovery/5fbe059d-281e-4748-8c1b-e4ba3d0ea75c_5e88cdbcbcf6e13c14c276d8_kotlin.jpg?ixlib=gatsbyFP&auto=compress%2Cformat&fit=max",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4vxfPlxUGB4j6dO4NSYh6LAPH94CGS-T7TgdL04X9dMHXhQd-7Bc-XRTXqo-WYLHtxzk&usqp=CAU",
  "https://miro.medium.com/v2/resize:fit:848/1*RuVFJ8RMnzjKm6ZwDYE8bA.png",
  "https://static.cdnlogo.com/logos/t/96/typescript.svg",
  "https://static.cdnlogo.com/logos/j/44/javascript.svg",
];

const transformStyles = [
  "rotate(5deg) translate(-150px)",
  "rotate(0deg) translate(-75px)",
  "rotate(-5deg)",
  "rotate(5deg) translate(75px)",
  "rotate(-5deg) translate(150px)",
];

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

export default function AboutPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // null = belum tahu (SSR / first paint), biar GSAP tidak jalan dulu
  const [isMobile, setIsMobile] = useState(null);
  const [cardVisible, setCardVisible] = useState(false);

  const wrapperRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const cardRef = useRef(null);

  const accent = isDark ? "#00d4ff" : "#0ea5e9";
  const textPrimary = isDark ? "#f0f4ff" : "#0a1230";
  const textMuted = isDark ? "rgba(220,230,255,.45)" : "rgba(10,18,48,.45)";
  const borderColor = "rgba(0,180,255,.11)";
  const cardBg = "rgba(255,255,255,.025)";

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    // Hanya jalan kalau sudah pasti desktop (bukan null, bukan true)
    if (isMobile !== false) return;
    if (!wrapperRef.current || !line1Ref.current || !cardRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          onUpdate: (self) => {
            if (self.progress > 0.35 && !cardVisible) setCardVisible(true);
          },
        },
      });
      tl.from(line1Ref.current, { y: 120, opacity: 0, duration: 0.12 }, 0)
        .from(line2Ref.current, { y: 120, opacity: 0, duration: 0.12 }, 0.04)
        .from(line3Ref.current, { y: 120, opacity: 0, duration: 0.12 }, 0.08);
      tl.fromTo(
        cardRef.current,
        { y: "100vh", opacity: 1 },
        { y: "0vh", opacity: 1, duration: 0.42, ease: "power3.out" },
        0.3
      );
      tl.to({}, { duration: 0.28 }, 0.72);
    }, wrapperRef);
    return () => ctx.revert();
  }, [isMobile]);

  /* ─────────── MOBILE ─────────── */
  if (isMobile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
          @keyframes ap-pdot{0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,.7)}50%{box-shadow:0 0 0 5px rgba(0,212,255,0)}}
          .m-pdot{width:6px;height:6px;border-radius:50%;background:#00d4ff;flex-shrink:0;animation:ap-pdot 2s infinite}
          .m-cta{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:linear-gradient(135deg,#0066ff,#00d4ff);border:none;border-radius:100px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.83rem;font-weight:500;color:white;box-shadow:0 0 24px rgba(0,100,255,.4);text-decoration:none}
          .m-cta-ghost{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:rgba(255,255,255,.05);border:1px solid rgba(0,180,255,.22);border-radius:100px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.83rem;font-weight:500;color:rgba(220,230,255,.7);text-decoration:none}
        `}</style>
        <section id="about" style={{ padding: "72px 24px", fontFamily: "'DM Sans',sans-serif" }}>
          <div style={{ marginBottom: 40, fontFamily: "Syne,sans-serif", fontSize: "clamp(2.5rem,12vw,4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.92, textTransform: "uppercase" }}>
            <div style={{ color: isDark ? "#f0f4ff" : "#0a1230" }}>TURNING</div>
            <div style={{ color: isDark ? "#f0f4ff" : "#0a1230" }}>IDEAS INTO</div>
            <div style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,.15)" }}>DIGITAL REALITY</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: isDark ? "rgba(220,230,255,.55)" : "rgba(10,18,48,.55)", margin: 0 }}>
              I'm a passionate Full Stack Developer with a strong focus on creating clean, efficient code and intuitive user experiences.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {[{ to: 50, suf: "+", label: "Projects" }, { to: 4, suf: "+", label: "Years Exp" }, { to: 99, suf: "%", label: "Satisfaction" }].map(({ to, suf, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1.8rem", fontWeight: 700, color: textPrimary }}><AnimCounter to={to} suffix={suf} /></div>
                  <div style={{ fontSize: ".62rem", letterSpacing: ".08em", textTransform: "uppercase", color: textMuted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/about" className="m-cta">Read More <ArrowRight size={14} /></Link>
              <Link to="/contact" className="m-cta-ghost">Contact Me <ArrowRight size={14} /></Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ─────────── DESKTOP — OPSI B (fixed) ─────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes b-scan {
          0%{top:0;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0}
        }
        @keyframes ap-pdot {
          0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,.7)} 50%{box-shadow:0 0 0 6px rgba(0,212,255,0)}
        }

        .b-scan {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(0,180,255,.22),transparent);
          animation:b-scan 8s ease-in-out infinite;
          pointer-events:none; z-index:0;
        }
        .b-pdot {
          width:7px; height:7px; border-radius:50%; background:#00d4ff;
          flex-shrink:0; animation:ap-pdot 2s infinite;
        }
        .b-pdot-sm {
          width:5px; height:5px; border-radius:50%; background:#00d4ff;
          flex-shrink:0; animation:ap-pdot 2s infinite;
        }
        .b-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(0,180,255,.08); border:1px solid rgba(0,180,255,.2);
          border-radius:100px; padding:5px 16px;
          font-size:.68rem; letter-spacing:.13em; text-transform:uppercase; color:#00d4ff;
          white-space:nowrap;
        }
        .b-cta {
          display:inline-flex; align-items:center; gap:7px; padding:11px 28px;
          background:linear-gradient(135deg,#0066ff,#00d4ff);
          border:none; border-radius:100px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:500;
          color:white; box-shadow:0 0 28px rgba(0,100,255,.4);
          text-decoration:none; transition:transform .2s,box-shadow .2s; white-space:nowrap;
        }
        .b-cta:hover { transform:translateY(-2px); box-shadow:0 0 44px rgba(0,150,255,.65); }
        .b-cta-ghost {
          display:inline-flex; align-items:center; gap:7px; padding:11px 28px;
          background:rgba(255,255,255,.04); border:1px solid rgba(0,180,255,.22);
          border-radius:100px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:500;
          color:rgba(220,230,255,.72); text-decoration:none;
          transition:transform .2s,border-color .2s; white-space:nowrap;
        }
        .b-cta-ghost:hover { transform:translateY(-2px); border-color:rgba(0,180,255,.5); }
        .b-gridbg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 72px,rgba(0,180,255,.02) 72px,rgba(0,180,255,.02) 73px),
            repeating-linear-gradient(90deg,transparent,transparent 72px,rgba(0,180,255,.02) 72px,rgba(0,180,255,.02) 73px);
          z-index:0;
        }
        .b-bar-bg { height:3px; border-radius:3px; background:rgba(255,255,255,.07); margin-top:6px; }
        .b-bar-fill { height:3px; border-radius:3px; background:linear-gradient(90deg,#0066ff,#00d4ff); }
        .b-col-label {
          font-size:.6rem; letter-spacing:.2em; text-transform:uppercase;
          color:#00d4ff; display:flex; align-items:center; gap:8px;
          flex-shrink:0;
        }
        .b-col-label::after {
          content:''; flex:1; height:1px;
          background:linear-gradient(90deg,rgba(0,180,255,.3),transparent);
        }
        .b-journey-wrap { border-left:1px solid rgba(0,180,255,.28); padding-left:20px; }
        .b-journey-dot {
          position:absolute; left:-25px; top:6px;
          width:9px; height:9px; border-radius:50%;
          background:#00d4ff; box-shadow:0 0 8px rgba(0,212,255,.55);
        }
        .b-info-row {
          display:flex; justify-content:space-between; align-items:center;
          padding:8px 0; border-bottom:1px solid rgba(0,180,255,.07);
          font-size:.76rem;
        }
        .b-info-row:last-child { border-bottom:none; }
        .b-stat-num {
          font-family:Syne,sans-serif; font-weight:800; line-height:1;
          font-size:clamp(1.8rem,2.8vw,2.8rem);
        }
        .b-stat-label {
          font-size:.58rem; letter-spacing:.1em; text-transform:uppercase;
          color:rgba(220,230,255,.35); margin-top:4px;
        }
        .b-motto-bar {
          display:flex; align-items:center; gap:16px;
          padding:12px clamp(32px,5vw,80px);
          border-top:1px solid rgba(0,180,255,.1);
          border-bottom:1px solid rgba(0,180,255,.1);
          background:rgba(0,180,255,.028);
          flex-shrink:0;
        }
        .b-tech-chip {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 11px;
          border:1px solid rgba(0,180,255,.18); border-radius:100px;
          font-size:.7rem; color:rgba(220,230,255,.6);
          background:rgba(0,180,255,.05);
        }
      `}</style>

      <div
        ref={wrapperRef}
        id="about"
        style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="b-scan" />
        <div className="b-gridbg" />

        {/* Title layer */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, pointerEvents: "none" }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(4rem,10vw,10rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.88, textTransform: "uppercase", textAlign: "left", padding: "0 clamp(24px,5vw,80px)" }}>
            <div ref={line1Ref} style={{ overflow: "hidden" }}><span style={{ display: "block", color: textPrimary }}>TURNING</span></div>
            <div ref={line2Ref} style={{ overflow: "hidden" }}><span style={{ display: "block", color: textPrimary }}>IDEAS INTO</span></div>
            <div ref={line3Ref} style={{ overflow: "hidden" }}><span style={{ display: "block", color: "transparent", WebkitTextStroke: isDark ? "2px rgba(255,255,255,.15)" : "2px rgba(10,18,48,.15)" }}>DIGITAL REALITY</span></div>
          </div>
        </div>

        {/* Card layer */}
        <div
          ref={cardRef}
          style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 1, transform: "translateY(100vh)", height: "100vh", overflow: "hidden" }}
        >
          <div
            style={{
              height: "100vh",
              background: isDark ? "rgba(4,8,28,0.96)" : "rgba(240,244,255,0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              paddingTop: 68,
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="b-scan" />

            {/* ══ ROW 1: Identity bar ══ */}
            <div
              style={{
                display: "flex", alignItems: "center",
                gap: "clamp(14px,2vw,32px)",
                padding: "14px clamp(32px,5vw,80px)",
                borderBottom: `1px solid ${borderColor}`,
                flexShrink: 0,
              }}
            >
              {/* Avatar */}
              <div style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid rgba(0,180,255,.38)", overflow: "hidden", flexShrink: 0, position: "relative", background: "rgba(0,20,60,.4)", boxShadow: "0 0 20px rgba(0,180,255,.18)" }}>
                <img src={aboutImage} alt="Rian Farhan" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                <div style={{ position: "absolute", bottom: 3, right: 3, width: 10, height: 10, borderRadius: "50%", background: "#00d4ff", border: "2px solid rgba(4,8,28,1)", animation: "ap-pdot 2s infinite" }} />
              </div>

              {/* Name + badge */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(.95rem,1.4vw,1.35rem)", fontWeight: 800, color: textPrimary, letterSpacing: "-.03em", marginBottom: 6 }}>
                  Baso Rian Farhan Mallanti
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="b-badge"><div className="b-pdot-sm" /> Available for Freelance · Full Stack Developer</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".72rem", color: textMuted }}>
                    <MapPin size={11} /> Makassar, ID
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(0,180,255,.15),transparent)", minWidth: 0, margin: "0 8px" }} />

              {/* Stats */}
              {[
                { to: 50, suf: "+", label: "Projects Done" },
                { to: 4, suf: "+", label: "Years Exp" },
                { to: 99, suf: "%", label: "Satisfaction" },
              ].map(({ to, suf, label }, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,32px)" }}>
                  {i > 0 && <div style={{ width: 1, height: 38, background: "rgba(0,180,255,.18)", flexShrink: 0 }} />}
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div className="b-stat-num" style={{ color: textPrimary }}>
                      {cardVisible
                        ? <AnimCounter to={to} suffix={suf} delay={i * 130} />
                        : <span>0<em style={{ fontStyle: "normal", color: "#00d4ff" }}>{suf}</em></span>
                      }
                    </div>
                    <div className="b-stat-label">{label}</div>
                  </div>
                </div>
              ))}

              <div style={{ width: 1, height: 38, background: "rgba(0,180,255,.18)", flexShrink: 0 }} />

              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <Link to="/about" className="b-cta">Read More <ArrowRight size={13} /></Link>
                <Link to="/contact" className="b-cta-ghost">Contact Me <ArrowRight size={13} /></Link>
              </div>
            </div>

            {/* ══ MOTTO BANNER ══ */}
            <div className="b-motto-bar">
              <Quote size={15} color={accent} style={{ flexShrink: 0, opacity: 0.65 }} />
              <p style={{ margin: 0, fontStyle: "italic", fontSize: "clamp(.82rem,1vw,.98rem)", color: isDark ? "rgba(240,244,255,.82)" : "rgba(10,18,48,.75)", flex: 1, letterSpacing: ".01em" }}>
                "It always seems impossible, until its done."
              </p>
              <span style={{ fontSize: ".7rem", color: textMuted, flexShrink: 0, letterSpacing: ".04em" }}>— Nelson Mandela</span>
            </div>

            {/* ══ ROW 2: 3 columns ══ */}
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                minHeight: 0,
                padding: "0 clamp(32px,5vw,80px)",
                overflow: "visible",
              }}
            >

              {/* ── COL 1: Personal Info + Skills + bio + Available For ── */}
              <div style={{ display: "flex", flexDirection: "column", padding: "18px 28px 18px 0", borderRight: `1px solid ${borderColor}`, overflow: "hidden" }}>

                {/* Personal Info — top of col 1 */}
                <div style={{ border: `1px solid rgba(0,180,255,.14)`, borderRadius: 9, background: cardBg, padding: "4px 14px", flexShrink: 0, marginBottom: 16 }}>
                  {[
                    { k: "Full Name", v: "Baso Rian Farhan M." },
                    { k: "Born", v: "July 07, 2002" },
                    { k: "Location", v: "Makassar, ID" },
                    { k: "Languages", v: "ID · EN" },
                    { k: "Status", v: null },
                  ].map(({ k, v }) => (
                    <div key={k} className="b-info-row">
                      <span style={{ color: textMuted, letterSpacing: ".07em", textTransform: "uppercase", fontSize: ".62rem" }}>{k}</span>
                      {v
                        ? <span style={{ fontFamily: "Syne,sans-serif", fontSize: ".76rem", fontWeight: 700, color: textPrimary }}>{v}</span>
                        : <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Syne,sans-serif", fontSize: ".76rem", fontWeight: 700, color: "#00d4ff" }}><div className="b-pdot-sm" />Open to Work</span>
                      }
                    </div>
                  ))}
                </div>

                <div className="b-col-label" style={{ marginBottom: 14 }}><Code2 size={11} />Core Skills</div>

                {/* Skills */}
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {[
                    { name: "Full Stack Development", pct: 90 },
                    { name: "React / Next.js", pct: 88 },
                    { name: "TypeScript", pct: 82 },
                    { name: "Kotlin / Mobile", pct: 75 },
                    { name: "UI / UX Design", pct: 70 },
                  ].map(({ name, pct }) => (
                    <div key={name}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: ".78rem", color: isDark ? "rgba(220,230,255,.65)" : "rgba(10,18,48,.65)" }}>{name}</span>
                        <span style={{ fontSize: ".78rem", color: accent, fontFamily: "Syne,sans-serif", fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div className="b-bar-bg">
                        <div className="b-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bio paragraph — fills the gap */}
                <p style={{ fontSize: ".82rem", lineHeight: 1.75, color: textMuted, margin: "18px 0 0", flex: 1 }}>
                  I'm a passionate Full Stack Developer with a strong focus on creating clean, efficient code and intuitive user experiences.
                  With expertise in both front-end and back-end technologies, I enjoy bringing complex projects to life — from idea to production.
                </p>

                {/* Available For */}
                <div style={{ border: `1px solid rgba(0,180,255,.14)`, borderRadius: 9, background: cardBg, padding: "12px 14px", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <Briefcase size={12} color={accent} />
                    <span style={{ fontSize: ".6rem", letterSpacing: ".14em", textTransform: "uppercase", color: textMuted }}>Available For</span>
                    <div className="b-pdot-sm" />
                  </div>
                  {[["Full-time Positions", true], ["Freelance Projects", false], ["Contract", true]].map(([t, struck]) => (
                    <div key={t} style={{ fontSize: ".78rem", color: struck ? isDark ? "rgba(220,230,255,.27)" : "rgba(10,18,48,.27)" : isDark ? "rgba(220,230,255,.88)" : "rgba(10,18,48,.82)", textDecoration: struck ? "line-through" : "none", marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                      {t} {!struck && <div className="b-pdot-sm" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── COL 2: Journey + Personal Info ── */}
              <div style={{ display: "flex", flexDirection: "column", padding: "18px 28px", borderRight: `1px solid ${borderColor}`, overflow: "hidden" }}>
                <div className="b-col-label" style={{ marginBottom: 14 }}><Clock size={11} />Journey</div>

                {/* Timeline — spaced to fill */}
                <div className="b-journey-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  {[
                    { year: "2021", title: "Started Coding", sub: "First line of code, never looked back", detail: "Sparked by curiosity, built my first web project and fell in love with the craft." },
                    { year: "2022 — Now", title: "BE Computer Science", sub: "State University of Makassar", detail: "Deepening fundamentals — algorithms, data structures, software engineering." },
                    { year: "2023 — Now", title: "Full Stack Developer", sub: "Freelance & open source", detail: "Building real products for clients and contributing to the open source community." },
                  ].map(({ year, title, sub, detail }) => (
                    <div key={year} style={{ position: "relative" }}>
                      <div className="b-journey-dot" />
                      <div style={{ fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", color: accent, marginBottom: 3 }}>{year}</div>
                      <div style={{ fontFamily: "Syne,sans-serif", fontSize: ".9rem", fontWeight: 700, color: textPrimary, marginBottom: 2 }}>{title}</div>
                      <div style={{ fontSize: ".75rem", color: textMuted, marginBottom: 4 }}>{sub}</div>
                      <div style={{ fontSize: ".73rem", color: isDark ? "rgba(220,230,255,.35)" : "rgba(10,18,48,.35)", lineHeight: 1.5 }}>{detail}</div>
                    </div>
                  ))}
                </div>

              </div>

              {/* ── COL 3: Tech Stack BounceCards + chips + Education + Hire ── */}
              <div style={{ display: "flex", flexDirection: "column", padding: "18px 0 18px 28px", overflow: "visible", position: "relative", zIndex: 10 }}>
                <div className="b-col-label" style={{ marginBottom: 14 }}><Layers size={11} />Tech Stack</div>

                {/* BounceCards — top, overflow visible so cards escape column */}
                <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", minHeight: 0, overflow: "visible", paddingTop: 8 }}>
                  <BounceCards
                    images={images}
                    containerWidth={320}
                    containerHeight={200}
                    animationDelay={1}
                    animationStagger={0.08}
                    easeType="elastic.out(1, 0.5)"
                    transformStyles={transformStyles}
                    enableHover={true}
                    isDark={isDark}
                  />
                </div>

                {/* Tech chips below cards */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {["Kotlin", "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Tailwind"].map((t) => (
                    <span key={t} className="b-tech-chip">{t}</span>
                  ))}
                </div>

                {/* Education */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#0066ff,#00d4ff)", color: "white", borderRadius: 9, padding: "12px 16px", boxShadow: "0 0 24px rgba(0,100,255,.3)", flexShrink: 0, marginBottom: 10 }}>
                  <Award size={15} style={{ fill: "#fde047", color: "#fde047", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontSize: ".85rem", fontWeight: 700 }}>BE in Computer Science</div>
                    <div style={{ fontSize: ".7rem", opacity: 0.85 }}>State University of Makassar</div>
                  </div>
                </div>

                {/* Hire Status */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 15px", border: `1px solid rgba(0,180,255,.15)`, borderRadius: 9, background: "rgba(0,180,255,.04)", flexShrink: 0 }}>
                  <div>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".13em", textTransform: "uppercase", color: textMuted, marginBottom: 4 }}>Hire Status</div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontSize: ".82rem", fontWeight: 700, color: "#00d4ff", display: "flex", alignItems: "center", gap: 6 }}>
                      <div className="b-pdot-sm" /> Open to Work
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".13em", textTransform: "uppercase", color: textMuted, marginBottom: 4 }}>Since</div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontSize: ".82rem", fontWeight: 700, color: textPrimary }}>2021</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}