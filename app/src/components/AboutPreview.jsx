import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ArrowRight, Award, MapPin } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import aboutImage from "../assets/foto-nobg.webp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export default function AboutPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // null = belum tahu (SSR / first paint), biar GSAP tidak jalan dulu
  const [isMobile, setIsMobile] = useState(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [tab, setTab] = useState("rian.tsx");
  const [skillsReady, setSkillsReady] = useState(false);

  const wrapperRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const cardRef = useRef(null);
  const prevMobileRef = useRef(null);

  const textPrimary = isDark ? "#e7edf5" : "#10233f";
  const textMuted = isDark ? "rgba(210,222,235,.62)" : "rgba(16,35,63,.6)";

  useEffect(() => {
    const check = () => {
      const next = window.innerWidth < 768;
      // Desktop -> mobile: revert/kill GSAP pins SECARA SINKRON sebelum React unmount
      // tree desktop, biar pin-spacer ScrollTrigger nggak bikin removeChild crash.
      if (prevMobileRef.current === false && next) {
        try { ScrollTrigger.getAll().forEach((t) => t.kill(true)); } catch (e) { /* noop */ }
      }
      prevMobileRef.current = next;
      setIsMobile(next);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // animate skill bars whenever the skills.json tab opens
  useEffect(() => {
    if (tab !== "skills.json") { setSkillsReady(false); return; }
    const t = setTimeout(() => setSkillsReady(true), 80);
    return () => clearTimeout(t);
  }, [tab]);

  useLayoutEffect(() => {
    // Hanya jalan kalau sudah pasti desktop (bukan null, bukan true)
    // useLayoutEffect: cleanup (ctx.revert) jalan SEBELUM React hapus DOM saat resize,
    // biar pin-spacer GSAP nggak bentrok sama removeChild React.
    if (isMobile !== false) return;
    if (!wrapperRef.current || !line1Ref.current || !cardRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=120%",
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
          @keyframes ap-pdot{0%,100%{box-shadow:0 0 0 0 rgba(var(--ac1),.7)}50%{box-shadow:0 0 0 5px rgba(var(--ac1),0)}}
          .m-pdot{width:6px;height:6px;border-radius:50%;background:var(--ac);flex-shrink:0;animation:ap-pdot 2s infinite}
          .m-cta{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:var(--ac-deep);border:none;border-radius:100px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.83rem;font-weight:500;color:${isDark ? "#10233f" : "white"};text-decoration:none;transition:background .2s}
          .m-cta:hover{background:var(--ac)}
          .m-cta-ghost{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:rgba(255,255,255,.05);border:1px solid rgba(var(--ac2),.22);border-radius:100px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.83rem;font-weight:500;color:rgba(210,222,235,.7);text-decoration:none}
        `}</style>
        <section id="about" style={{ padding: "72px 24px", fontFamily: "'DM Sans',sans-serif" }}>
          <div style={{ marginBottom: 40, fontFamily: "Syne,sans-serif", fontSize: "clamp(2rem,9.5vw,3.2rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.92, textTransform: "uppercase" }}>
            <div style={{ color: isDark ? "#e7edf5" : "#10233f" }}>TURNING</div>
            <div style={{ color: isDark ? "#e7edf5" : "#10233f" }}>IDEAS INTO</div>
            <div style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,.15)" }}>DIGITAL REALITY</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: isDark ? "rgba(210,222,235,.62)" : "rgba(16,35,63,.6)", margin: 0 }}>
              I build the whole product — web with React &amp; Node, mobile with Kotlin &amp; React Native — and take it all the way to production.
            </p>
            <div>
              <div style={{ fontSize: ".62rem", letterSpacing: ".14em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>Worked with</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Carbonethics", "Hacktiv8", "Disnaker Makassar", "UNM"].map((org) => (
                  <span key={org} style={{ fontSize: ".72rem", padding: "5px 11px", borderRadius: 7, color: "var(--ac)", background: "rgba(var(--ac1),.1)", border: "1px solid rgba(var(--ac1),.28)" }}>{org}</span>
                ))}
              </div>
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

  /* ─────────── DESKTOP — OPSI B · Terminal / IDE ─────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes b-scan { 0%{top:0;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes ap-pdot { 0%,100%{box-shadow:0 0 0 0 rgba(var(--ac1),.7)} 50%{box-shadow:0 0 0 6px rgba(var(--ac1),0)} }

        .b-scan {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(var(--ac2),.22),transparent);
          animation:b-scan 8s ease-in-out infinite; pointer-events:none; z-index:0;
        }
        .b-pdot-sm { width:6px; height:6px; border-radius:50%; background:var(--ac); flex-shrink:0; animation:ap-pdot 2s infinite; }
        .b-gridbg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 72px,rgba(var(--ac2),.02) 72px,rgba(var(--ac2),.02) 73px),
            repeating-linear-gradient(90deg,transparent,transparent 72px,rgba(var(--ac2),.02) 72px,rgba(var(--ac2),.02) 73px);
          z-index:0;
        }
        .b-cta {
          display:inline-flex; align-items:center; gap:7px; padding:10px 22px;
          background:var(--ac-deep);
          border:none; border-radius:100px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:500;
          color:${isDark ? "#10233f" : "white"};
          text-decoration:none; transition:transform .2s,background .2s; white-space:nowrap;
        }
        .b-cta:hover { transform:translateY(-2px); background:var(--ac); }

        /* ── Terminal / IDE editor ── */
        .ed-win {
          display:flex; flex-direction:column; width:100%; max-width:1180px; margin:0 auto;
          background:var(--ed-bg); border:1px solid var(--ed-line); border-radius:14px; overflow:hidden;
          box-shadow:0 30px 80px -30px rgba(0,0,0,.55), 0 0 0 1px rgba(var(--ac2),.04);
          font-family:var(--ed-mono);
        }
        .ed-titlebar { display:flex; align-items:center; gap:14px; background:var(--ed-chrome); border-bottom:1px solid var(--ed-line); padding:0 14px; height:42px; flex-shrink:0; }
        .ed-dots { display:flex; gap:7px; flex-shrink:0; }
        .ed-dot { width:11px; height:11px; border-radius:50%; }
        .ed-tabs { display:flex; gap:2px; overflow-x:auto; scrollbar-width:none; }
        .ed-tabs::-webkit-scrollbar { display:none; }
        .ed-tab { font-family:var(--ed-mono); font-size:12px; color:var(--ed-muted); background:transparent; border:none; border-bottom:2px solid transparent; padding:9px 13px; white-space:nowrap; cursor:pointer; }
        .ed-tab:hover { color:var(--ed-txt); }
        .ed-tab .ext { color:var(--ac); opacity:.7; }
        .ed-tab.active { color:var(--ed-txt); border-bottom-color:var(--ac); background:var(--ed-bg); }
        .ed-clock { margin-left:auto; font-size:11px; color:var(--ed-muted); flex-shrink:0; white-space:nowrap; }

        .ed-body { flex:1; min-height:0; overflow:hidden; display:flex; flex-direction:column; }
        .ed-file { flex:1; min-height:0; overflow:hidden; display:flex; flex-direction:column; }
        .ed-pad { padding:16px 20px; }

        .ed-code { display:flex; font-size:13px; line-height:1.8; }
        .ed-gutter { flex-shrink:0; text-align:right; color:var(--ed-muted); opacity:.5; padding:16px 12px 10px 16px; background:var(--ed-gutter); user-select:none; border-right:1px solid var(--ed-line); white-space:pre; }
        .ed-lines { padding:16px 18px 10px; flex:1; white-space:pre; color:var(--ed-txt); overflow-x:auto; }
        .ed-kw{color:var(--ed-kw)} .ed-str{color:var(--ed-str)} .ed-num{color:var(--ed-num)}
        .ed-prop{color:var(--ed-prop)} .ed-com{color:var(--ed-com);font-style:italic} .ed-fn{color:var(--ed-fn)} .ed-punc{color:var(--ed-muted)}
        .ed-pulse { display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--ac); box-shadow:0 0 0 0 rgba(var(--ac1),.6); animation:ap-pdot 2s infinite; vertical-align:middle; margin-right:6px; }

        .ed-sec { padding:14px 18px; border-top:1px solid var(--ed-line); }
        .ed-label { font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--ed-muted); margin:0 0 12px; display:flex; gap:8px; align-items:center; }
        .ed-label::before { content:''; width:14px; height:1px; background:var(--ac); }

        .ed-skillrow { display:grid; grid-template-columns:118px 1fr 32px; align-items:center; gap:12px; margin:9px 0; font-size:12px; }
        .ed-skillrow .nm { color:var(--ed-prop); }
        .ed-bar { height:6px; border-radius:6px; background:var(--ed-line); overflow:hidden; }
        .ed-bar > i { display:block; height:100%; border-radius:6px; background:linear-gradient(90deg,var(--ac-deep),var(--ac)); width:0; transition:width 1.1s cubic-bezier(.2,.8,.2,1); }
        .ed-skillrow .pc { text-align:right; color:var(--ac); font-variant-numeric:tabular-nums; }

        .ed-avail { padding:12px 18px 16px; border-top:1px solid var(--ed-line); font-size:12px; line-height:1.95; }
        .ed-avail .on { color:var(--ed-txt); display:flex; align-items:center; gap:7px; }
        .ed-avail .off { color:var(--ed-muted); text-decoration:line-through; }

        .ed-log { display:flex; flex-direction:column; gap:13px; }
        .ed-entry { display:grid; grid-template-columns:14px 1fr; gap:10px; }
        .ed-rail { position:relative; }
        .ed-rail::before { content:''; position:absolute; left:4px; top:4px; width:8px; height:8px; border-radius:50%; background:var(--ac); box-shadow:0 0 8px rgba(var(--ac1),.6); }
        .ed-rail::after { content:''; position:absolute; left:7px; top:13px; bottom:-13px; width:1px; background:var(--ed-line); }
        .ed-entry:last-child .ed-rail::after { display:none; }
        .ed-yr { color:var(--ac); font-size:11px; letter-spacing:.05em; }
        .ed-t { color:var(--ed-txt); font-weight:600; margin:2px 0; }
        .ed-d { color:var(--ed-muted); font-size:11.5px; line-height:1.5; }
        .ed-cursor { display:inline-block; width:7px; height:13px; background:var(--ac); vertical-align:text-bottom; animation:ed-blink 1.1s step-end infinite; margin-left:3px; }
        @keyframes ed-blink { 50%{opacity:0} }

        .ed-imp { font-size:12px; color:var(--ed-muted); margin-bottom:11px; }
        .ed-chips { display:flex; flex-wrap:wrap; gap:7px; }
        .ed-chip { font-size:11.5px; color:var(--ed-txt); background:rgba(var(--ac2),.08); border:1px solid rgba(var(--ac2),.25); border-radius:7px; padding:5px 10px; }
        .ed-chip .k { color:var(--ac); }
        .ed-edu { display:flex; align-items:center; gap:10px; margin-top:14px; background:var(--ac-deep); color:${isDark ? "#10233f" : "#fff"}; border-radius:10px; padding:11px 14px; }

        .ed-footer { display:flex; align-items:center; gap:14px; flex-wrap:wrap; padding:11px 16px; border-top:1px solid var(--ed-line); background:var(--ed-chrome); }
        .ed-ident { display:flex; align-items:center; gap:10px; min-width:0; flex-wrap:wrap; }
        .ed-ava { width:30px; height:30px; border-radius:50%; overflow:hidden; border:1.5px solid rgba(var(--ac2),.4); flex-shrink:0; }
        .ed-ava img { width:100%; height:100%; object-fit:cover; object-position:center top; }
        .ed-name { font-family:'DM Sans',sans-serif; font-weight:700; font-size:13px; color:var(--ed-txt); white-space:nowrap; }
        .ed-open { display:inline-flex; align-items:center; gap:6px; font-size:11.5px; color:var(--ac); white-space:nowrap; }
        .ed-loc { display:inline-flex; align-items:center; gap:4px; font-size:11.5px; color:var(--ed-muted); white-space:nowrap; }
        .ed-actions { display:flex; gap:9px; margin-left:auto; flex-shrink:0; }
        .ed-ghost {
          display:inline-flex; align-items:center; gap:7px; padding:10px 22px;
          background:transparent; border:1px solid rgba(var(--ac2),.35); border-radius:100px;
          font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:500; color:var(--ed-txt);
          text-decoration:none; transition:border-color .2s,transform .2s; white-space:nowrap;
        }
        .ed-ghost:hover { border-color:var(--ac); transform:translateY(-2px); }

        .ed-status { display:flex; align-items:center; gap:16px; flex-wrap:wrap; background:var(--ac); color:#04121a; padding:6px 16px; font-size:11px; font-weight:600; letter-spacing:.02em; }
        .ed-status .sp { margin-left:auto; }
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
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(3.2rem,8vw,8rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.88, textTransform: "uppercase", textAlign: "left", padding: "0 clamp(24px,5vw,80px)", maxWidth: "100%" }}>
            <div ref={line1Ref} style={{ overflow: "hidden" }}><span style={{ display: "block", color: textPrimary }}>TURNING</span></div>
            <div ref={line2Ref} style={{ overflow: "hidden" }}><span style={{ display: "block", color: textPrimary }}>IDEAS INTO</span></div>
            <div ref={line3Ref} style={{ overflow: "hidden" }}><span style={{ display: "block", color: "transparent", WebkitTextStroke: isDark ? "2px rgba(255,255,255,.15)" : "2px rgba(16,35,63,.15)" }}>DIGITAL REALITY</span></div>
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
              background: isDark ? "#0a1420" : "#e8ecf1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "84px clamp(20px,4vw,56px) 28px",
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="b-scan" />

            <div
              className="ed-win"
              style={{
                "--ed-mono": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                "--ed-bg": isDark ? "#0e1826" : "#eef1f5",
                "--ed-chrome": isDark ? "#101d2c" : "#f7f9fb",
                "--ed-gutter": isDark ? "#0a1420" : "#e6eaef",
                "--ed-line": isDark ? "#1c2a3f" : "#d8dee6",
                "--ed-txt": isDark ? "#cdd8ea" : "#17263d",
                "--ed-muted": isDark ? "#5d6f8e" : "#7c8aa0",
                "--ed-kw": "var(--ac)",
                "--ed-str": isDark ? "#3ddc97" : "#0f9d6b",
                "--ed-num": isDark ? "#ffb27a" : "#c2683a",
                "--ed-prop": isDark ? "#9ec9ff" : "#2563a8",
                "--ed-com": isDark ? "#4d5f7e" : "#94a3b8",
                "--ed-fn": isDark ? "#c792ea" : "#8b5cf6",
                height: "100%",
                maxHeight: "calc(100vh - 112px)",
              }}
            >
              {/* Title bar */}
              <div className="ed-titlebar">
                <div className="ed-dots">
                  <span className="ed-dot" style={{ background: "#ff5f57" }} />
                  <span className="ed-dot" style={{ background: "#febc2e" }} />
                  <span className="ed-dot" style={{ background: "#28c840" }} />
                </div>
                <div className="ed-tabs">
                  {[["rian.tsx", "rian", ".tsx"], ["skills.json", "skills", ".json"], ["journey.log", "journey", ".log"], ["stack.ts", "stack", ".ts"]].map(([key, nm, ext]) => (
                    <button key={key} type="button" className={"ed-tab" + (tab === key ? " active" : "")} onClick={() => setTab(key)}>{nm}<span className="ext">{ext}</span></button>
                  ))}
                </div>
                <div className="ed-clock">~/portfolio · main</div>
              </div>

              {/* Body — tabbed (klik tab buat ganti file, tanpa scroll) */}
              <div className="ed-body">
                {tab === "rian.tsx" && (
                  <div className="ed-file">
                    <div className="ed-code">
                      <div className="ed-gutter">{"1\n2\n3\n4\n5\n6\n7\n8\n9\n10"}</div>
                      <div className="ed-lines">
                        <div><span className="ed-com">// Baso Rian Farhan Mallanti — Full Stack Developer</span></div>
                        <div><span className="ed-kw">const</span> <span className="ed-prop">rian</span><span className="ed-punc">:</span> <span className="ed-fn">Developer</span> <span className="ed-punc">= {'{'}</span></div>
                        <div>{"  "}<span className="ed-prop">location</span><span className="ed-punc">:</span> <span className="ed-str">"Makassar, ID"</span><span className="ed-punc">,</span></div>
                        <div>{"  "}<span className="ed-prop">born</span><span className="ed-punc">:</span> <span className="ed-str">"2002-07-07"</span><span className="ed-punc">,</span></div>
                        <div>{"  "}<span className="ed-prop">languages</span><span className="ed-punc">:</span> <span className="ed-punc">[</span><span className="ed-str">"ID"</span><span className="ed-punc">,</span> <span className="ed-str">"EN"</span><span className="ed-punc">],</span></div>
                        <div>{"  "}<span className="ed-prop">status</span><span className="ed-punc">:</span> <span className="ed-str">"open_to_work"</span><span className="ed-punc">,</span>{"   "}<span className="ed-com"><span className="ed-pulse" />// available for freelance</span></div>
                        <div>{"  "}<span className="ed-prop">projects</span><span className="ed-punc">:</span> <span className="ed-num">20</span><span className="ed-punc">,</span> <span className="ed-prop">years</span><span className="ed-punc">:</span> <span className="ed-num">4</span><span className="ed-punc">,</span> <span className="ed-prop">stack</span><span className="ed-punc">:</span> <span className="ed-str">"web + mobile"</span><span className="ed-punc">,</span></div>
                        <div><span className="ed-punc">{'}'}</span></div>
                        <div>{" "}</div>
                        <div><span className="ed-com">// "It always seems impossible, until it's done." — Mandela</span></div>
                      </div>
                    </div>
                    <div className="ed-avail">
                      <div><span className="ed-com">// available_for</span></div>
                      <div className="on">▸ full_time_positions <span className="b-pdot-sm" /></div>
                      <div className="on">▸ freelance_projects</div>
                      <div className="on">▸ contract</div>
                    </div>
                  </div>
                )}

                {tab === "skills.json" && (
                  <div className="ed-file"><div className="ed-pad">
                    <p className="ed-label">core skills</p>
                    {[
                      { name: "fullstack", pct: 90 },
                      { name: "react_next", pct: 88 },
                      { name: "typescript", pct: 82 },
                      { name: "kotlin", pct: 75 },
                      { name: "ui_ux", pct: 70 },
                    ].map(({ name, pct }) => (
                      <div className="ed-skillrow" key={name}>
                        <span className="nm">{name}</span>
                        <span className="ed-bar"><i style={{ width: skillsReady ? `${pct}%` : "0%" }} /></span>
                        <span className="pc">{pct}</span>
                      </div>
                    ))}
                  </div></div>
                )}

                {tab === "journey.log" && (
                  <div className="ed-file"><div className="ed-pad">
                    <p className="ed-label">journey.log</p>
                    <div className="ed-log">
                      <div className="ed-entry"><div className="ed-rail" /><div><div className="ed-yr">2024 — NOW</div><div className="ed-t">Fullstack Developer · Carbonethics<span className="ed-cursor" /></div><div className="ed-d">End-to-end web solutions for sustainability initiatives</div></div></div>
                      <div className="ed-entry"><div className="ed-rail" /><div><div className="ed-yr">2024 — 25</div><div className="ed-t">Fullstack JS Bootcamp · Hacktiv8</div><div className="ed-d">React, Node.js, Express, MongoDB — intensive fullstack track</div></div></div>
                      <div className="ed-entry"><div className="ed-rail" /><div><div className="ed-yr">2020 — 24</div><div className="ed-t">B.Sc Informatics · UNM</div><div className="ed-d">Universitas Negeri Makassar — software development &amp; IT fundamentals</div></div></div>
                    </div>
                  </div></div>
                )}

                {tab === "stack.ts" && (
                  <div className="ed-file"><div className="ed-pad">
                    <p className="ed-label">stack.ts</p>
                    <div className="ed-imp"><span className="ed-kw">import</span> <span className="ed-punc">{'{'}</span> <span className="ed-fn">React, Next, Flutter, ReactNative, PHP, Node</span> <span className="ed-punc">{'}'}</span> <span className="ed-kw">from</span> <span className="ed-str">"@rian/stack"</span></div>
                    <div className="ed-chips">
                      {["React", "Next.js", "React Native", "Flutter", "TypeScript", "JavaScript", "Kotlin", "PHP", "Node.js", "Apps Script", "Tailwind"].map((t) => (
                        <span className="ed-chip" key={t}><span className="k">▸</span> {t}</span>
                      ))}
                    </div>
                    <div className="ed-edu">
                      <Award size={16} style={{ fill: "#fde047", color: "#fde047", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: "Syne,sans-serif", fontSize: ".85rem", fontWeight: 700 }}>B.Sc Informatics</div>
                        <div style={{ fontSize: ".72rem", opacity: 0.85 }}>Universitas Negeri Makassar · 2020 – 2024</div>
                      </div>
                    </div>
                  </div></div>
                )}
              </div>

              {/* Footer toolbar */}
              <div className="ed-footer">
                <div className="ed-ident">
                  <div className="ed-ava"><img loading="lazy" decoding="async" src={aboutImage} alt="Rian Farhan" /></div>
                  <span className="ed-name">Baso Rian Farhan</span>
                  <span className="ed-open"><span className="b-pdot-sm" /> Open to Work</span>
                  <span className="ed-loc"><MapPin size={11} /> Makassar, ID</span>
                </div>
                <div className="ed-actions">
                  <Link to="/about" className="b-cta">Read More <ArrowRight size={13} /></Link>
                  <Link to="/contact" className="ed-ghost">Contact Me <ArrowRight size={13} /></Link>
                </div>
              </div>

              {/* Status bar */}
              <div className="ed-status">
                <span>⎇ main</span>
                <span>20+ projects</span>
                <span>· 4+ yrs</span>
                <span>· web + mobile</span>
                <span className="sp">TSX · UTF-8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
