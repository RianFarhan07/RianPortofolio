import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  ArrowRight,
  MessageSquare,
  Handshake,
  Send,
  Star,
  BarChart2,
  Info,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const [isMobile, setIsMobile] = useState(null);
  // Animasi selalu jalan — abaikan prefers-reduced-motion dari OS
  const reduced = false;
  const trackRef = useRef(null);
  const introRef = useRef(null);
  const l1Ref = useRef(null);
  const l2Ref = useRef(null);
  const l3Ref = useRef(null);
  const contentRef = useRef(null);

  /* ── Responsive ── */
  useEffect(() => {
    const c = () => setIsMobile(window.innerWidth < 768);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);

  /* ── Curtain intro (desktop only) ────────────────────────────
     "LET'S BUILD TOGETHER" muncul gede di tengah → morph keluar saat
     scroll, lalu konten asli (kartu, comments, stats) flow normal di
     bawahnya — full & scrollable, Giscus nggak kepotong.
     Curtain = CSS sticky (no GSAP pin) + ScrollTrigger scrub. */
  useLayoutEffect(() => {
    if (isMobile !== false) return;
    const track = trackRef.current;
    if (!track || !contentRef.current) return;

    if (reduced) {
      gsap.set(contentRef.current, { clearProps: "all", autoAlpha: 1, y: 0 });
      if (introRef.current && introRef.current.parentElement)
        introRef.current.parentElement.style.display = "none";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(introRef.current, { autoAlpha: 1, scale: 1, x: 0, y: 0 });
      gsap.set(contentRef.current, { autoAlpha: 0, y: 40 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Fase 1 — reveal 3 baris dari balik mask
      tl.fromTo(
        [l1Ref.current, l2Ref.current, l3Ref.current],
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.18,
          ease: "power3.out",
          stagger: 0.08,
          immediateRender: true,
        },
        0.04,
      );

      // Fase 2 — morph keluar (mengecil + geser kiri-atas + fade)
      tl.to(
        introRef.current,
        {
          scale: 0.34,
          x: () => -window.innerWidth * 0.26,
          y: () => -window.innerHeight * 0.3,
          autoAlpha: 0,
          ease: "power2.inOut",
          duration: 0.28,
        },
        0.46,
      );

      // Fase 3 — konten asli fade-in (flow normal di bawah curtain)
      tl.to(
        contentRef.current,
        { autoAlpha: 1, y: 0, duration: 0.22, ease: "power3.out" },
        0.6,
      );

      tl.to({}, { duration: 0.16 }, 0.84);
    }, track);

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

  /* ── Giscus ── */
  useEffect(() => {
    if (!inView) return;

    const existing = document.getElementById("giscus-script");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.id = "giscus-script";
    script.setAttribute("data-repo", "RianFarhan07/RianPortofolio");
    script.setAttribute("data-repo-id", "R_kgDOObW8sg");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOObW8ss4CpSL1");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", isDark ? "dark" : "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    const container = document.getElementById("giscus-container");
    if (container) container.appendChild(script);

    return () => {
      const s = document.getElementById("giscus-script");
      if (s) s.remove();
    };
  }, [inView, isDark]);

  /* ── Data ── */
  const contactCards = [
    {
      icon: <Phone size={16} />,
      label: "WhatsApp",
      value: "+62 822 8037 2670",
      href: "https://wa.me/6282280372670?text=Hi%20Rian,%20I%20would%20like%20to%20discuss%20a%20job%20opportunity.",
      external: true,
    },
    {
      icon: <Mail size={16} />,
      label: "Email",
      value: "rian.mallanti@gmail.com",
      href: "mailto:rian.mallanti@gmail.com",
      external: false,
    },
    {
      icon: <MapPin size={16} />,
      label: "Location",
      value: "Makassar, ID",
      href: "https://www.google.com/maps/place/Rezki+Ayra/@-4.2378229,119.6255899,20.6z",
      external: true,
    },
    {
      icon: <Handshake size={16} />,
      label: "Collaboration",
      value: "Let's build something!",
      href: "mailto:rian.mallanti@gmail.com",
      external: false,
    },
  ];

  const socialLinks = [
    {
      icon: <Linkedin size={15} />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/baso-rian-farhan-82bb73245/",
    },
    {
      icon: <Github size={15} />,
      name: "GitHub",
      url: "https://github.com/RianFarhan07",
    },
    {
      icon: <Instagram size={15} />,
      name: "Instagram",
      url: "https://www.instagram.com/rianfarhan/",
    },
  ];

  /* ── Shared tokens ── */
  const accent = "var(--ac)";
  const textPrimary = isDark ? "#e7edf5" : "#10233f";
  const textMuted = isDark ? "rgba(210,222,235,.62)" : "rgba(16,35,63,.6)";
  const textFaint = isDark ? "rgba(210,222,235,.45)" : "rgba(16,35,63,.45)";
  const borderColor = "rgba(var(--ac2),.12)";
  const cardBg = isDark ? "rgba(255,255,255,.025)" : "rgba(255,255,255,.7)";


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes cp-fadein {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cp-col-label {
          font-size: .6rem; letter-spacing: .2em; text-transform: uppercase;
          color: var(--ac); display: flex; align-items: center; gap: 8px;
          margin-bottom: 16px; font-family: 'DM Sans', sans-serif;
        }
        .cp-col-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(var(--ac2),.3), transparent);
        }
        .cp-contact-card {
          display: flex; align-items: center; gap: 14px;
          border: 1px solid rgba(var(--ac2),.12); border-radius: 9px;
          padding: 14px 16px; text-decoration: none; color: inherit;
          transition: border-color .2s, background .2s;
        }
        .cp-contact-card:hover {
          border-color: rgba(var(--ac2),.35);
        }
        .cp-icon-wrap {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1px solid rgba(var(--ac2),.22);
          background: rgba(var(--ac2),.07);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: var(--ac);
          transition: background .2s;
        }
        .cp-contact-card:hover .cp-icon-wrap {
          background: rgba(var(--ac2),.15);
        }
        .cp-social-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,.12);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,.4); text-decoration: none;
          transition: border-color .2s, color .2s;
        }
        .cp-social-btn:hover { border-color: var(--ac); color: var(--ac); }
        .cp-social-btn-light {
          border-color: rgba(16,35,63,.15); color: rgba(16,35,63,.35);
        }
        .cp-social-btn-light:hover { border-color: var(--ac); color: var(--ac); }
        .cp-stat-bar-bg {
          height: 2px; border-radius: 2px;
          background: rgba(255,255,255,.08); margin-top: 5px;
        }
        .cp-stat-bar-bg-light {
          background: rgba(16,35,63,.08);
        }
        .cp-stat-bar-fill {
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, var(--ac-deep), var(--ac));
        }
        .cp-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 28px;
          background: var(--ac-deep);
          border: none; border-radius: 100px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: .82rem;
          font-weight: 500; color: ${isDark ? "#10233f" : "white"}; text-decoration: none;
          transition: transform .2s, background .2s;
        }
        .cp-cta:hover {
          transform: translateY(-2px);
          background: var(--ac);
        }
        .cp-animate {
          animation: cp-fadein .7s ease both;
        }

        /* ── Curtain intro (scroll-morph) ── */
        .ct-intro-inner{text-align:center;will-change:transform,opacity;transform-origin:center center}
        .ct-intro-label{display:flex;align-items:center;justify-content:center;gap:8px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:var(--ac);margin-bottom:18px}
        .ct-intro-title{font-family:Syne,sans-serif;font-weight:800;font-size:clamp(3rem,10vw,8rem);line-height:.86;letter-spacing:-.04em;text-transform:uppercase}
        .ct-mask{overflow:hidden;padding:0 .05em}
      `}</style>

      <section
        id="contact"
        ref={ref}
        style={{
          position: "relative",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── CONTENT (flows in normally — no scroll-jack) ── */}
        <div
          ref={contentRef}
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "72px clamp(24px, 5vw, 80px)",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.15fr 1fr",
              gap: "clamp(28px, 5vw, 64px)",
              alignItems: "start",
            }}
          >
            {/* ══ LEFT COLUMN ══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {/* Big title */}
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "clamp(2.6rem, 5.5vw, 5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                <span style={{ display: "block", color: textPrimary }}>
                  LET'S
                </span>
                <span style={{ display: "block", color: textPrimary }}>
                  BUILD
                </span>
                <span
                  style={{
                    display: "block",
                    color: "transparent",
                    WebkitTextStroke: isDark
                      ? "2px rgba(255,255,255,.15)"
                      : "2px rgba(16,35,63,.15)",
                  }}
                >
                  TOGETHER
                </span>
              </div>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: ".88rem",
                  lineHeight: 1.7,
                  color: textMuted,
                  margin: "0 0 22px",
                  maxWidth: 340,
                }}
              >
                Open to freelance projects, collaborations, and new
                opportunities. Drop a message — I'll get back to you.
              </p>

              {/* Contact cards grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {contactCards.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="cp-contact-card"
                    style={{ background: cardBg }}
                  >
                    <div className="cp-icon-wrap">{item.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: ".58rem",
                          letterSpacing: ".14em",
                          textTransform: "uppercase",
                          color: textFaint,
                          marginBottom: 3,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "Syne, sans-serif",
                          fontSize: ".8rem",
                          fontWeight: 700,
                          color: textPrimary,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(var(--ac2),.1)",
                  marginBottom: 18,
                }}
              />

              {/* Social links */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: ".58rem",
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: textFaint,
                    marginRight: 4,
                  }}
                >
                  Follow
                </span>
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className={`cp-social-btn${!isDark ? " cp-social-btn-light" : ""}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ══ RIGHT COLUMN ══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Giscus block */}
              <div
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: 9,
                  background: cardBg,
                  padding: "20px 22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div className="cp-col-label" style={{ margin: 0, flex: 1 }}>
                    <MessageSquare size={11} />
                    Join the conversation
                  </div>
                  <a
                    href="https://github.com/RianFarhan07/RianPortofolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: ".68rem",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: accent,
                      textDecoration: "none",
                      flexShrink: 0,
                    }}
                  >
                    <Star size={11} /> Star Repo
                  </a>
                </div>

                {/* Giscus container */}
                <div id="giscus-container" style={{ width: "100%" }} />

                {/* Hint */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 12,
                    padding: "10px 12px",
                    background: "rgba(var(--ac2),.04)",
                    border: "1px solid rgba(var(--ac2),.08)",
                    borderRadius: 7,
                  }}
                >
                  <Info
                    size={13}
                    style={{ color: accent, flexShrink: 0, marginTop: 1 }}
                  />
                  <p
                    style={{
                      fontSize: ".73rem",
                      lineHeight: 1.6,
                      color: textMuted,
                      margin: 0,
                    }}
                  >
                    Sign in with GitHub to comment. Drop a reaction ❤️ or ⭐
                    and star the repo if you find it useful.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Link to="/contact" className="cp-cta">
                  <Send size={13} />
                  Email Me Directly
                  <ArrowRight size={13} />
                </Link>
                <span
                  style={{
                    fontSize: ".68rem",
                    color: textFaint,
                    letterSpacing: ".08em",
                  }}
                >
                  or leave a comment above
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
