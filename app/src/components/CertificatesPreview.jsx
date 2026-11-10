import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { usePauseWhenOffscreen } from "../lib/usePauseWhenOffscreen";
import {
  ArrowRight,
  Award,
  ExternalLink,
  Calendar,
  Tag,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { bestCertificates as certificates } from "../data/bestSertificates";
import { slugify, trackEvent } from "../lib/analytics";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const getCertificatePreview = (image) =>
  image?.replace(
    /^images\/certificates\//,
    "images/certificates/previews/",
  );

export default function CertificatesPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [peek, setPeek] = useState(null); // index of the certificate previewed while hovering the list
  const [entered, setEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(null);
  // Animasi selalu jalan — abaikan prefers-reduced-motion dari OS
  const reduced = false;

  const autoplayRef = useRef(null);
  const peekRef = useRef(null);
  const peekPos = useRef({ x: 0, y: 0 });
  const peekFrame = useRef(0);
  const peekPrefer = useRef("left"); // which side of the cursor the preview prefers
  const wrapperRef = useRef(null);
  const headerRef = useRef(null);
  const headerSideRef = useRef(null);
  const contentRef = useRef(null);
  const stickyRef = useRef(null);
  const introRef = useRef(null);
  const badgeRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.15 });
  const pauseRef = usePauseWhenOffscreen();

  const textPrimary = isDark ? "#e2d6c6" : "#232b20";
  const textMuted = isDark ? "rgba(226,214,198,.68)" : "rgba(35,43,32,.76)";
  const borderColor = "rgba(var(--ac2),.18)";
  const cardBg = isDark ? "rgba(27,33,25,.96)" : "rgba(216,202,182,.96)";

  /* ── Hover preview: the certificate follows the cursor over the list (pointer devices only) ── */
  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const placePeek = () => {
    peekFrame.current = 0;
    const el = peekRef.current;
    if (!el) return;
    const { x, y } = peekPos.current;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const fitsRight = x + 22 + w <= window.innerWidth - 12;
    const fitsLeft = x - w - 22 >= 12;
    // over the list (right side of the page) open to the left of the cursor; over the detail card open to its right,
    // so the preview never covers the text being read
    const goLeft = peekPrefer.current === "left" ? fitsLeft || !fitsRight : !fitsRight && fitsLeft;
    const left = Math.min(Math.max(12, goLeft ? x - w - 22 : x + 22), window.innerWidth - w - 12);
    const top = Math.min(Math.max(12, y - h / 2), window.innerHeight - h - 12);
    el.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
  };
  const movePeek = (e) => {
    peekPos.current = { x: e.clientX, y: e.clientY };
    if (!peekFrame.current) peekFrame.current = requestAnimationFrame(placePeek);
  };
  const showPeek = (e, i, prefer = "left") => {
    if (!canHover()) return;
    peekPrefer.current = prefer;
    movePeek(e);
    setPeek(i);
  };
  useLayoutEffect(() => {
    if (peek !== null) placePeek();
  }, [peek]);
  useEffect(() => () => cancelAnimationFrame(peekFrame.current), []);
  // warm the cache once the section is on screen so the preview never pops in late
  useEffect(() => {
    if (!inView || !canHover()) return;
    certificates.forEach((c) => {
      const im = new Image();
      im.src = getCertificatePreview(c.image);
    });
  }, [inView]);

  /* ── Responsive ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Autoplay ── */
  useEffect(() => {
    if (autoplay && inView) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((p) => (p === certificates.length - 1 ? 0 : p + 1));
      }, 5000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [autoplay, inView]);

  /* ── Scroll-morph intro (desktop only) ──────────────────────
     "VERIFIED SKILLS" (judul header, elemen SAMA) di-transform ke tengah
     layar → morf balik ke posisi header → konten fade-in. Tidak ada intro
     duplikat yang hilang lalu header baru muncul. "Pin" via CSS sticky
     (bukan GSAP pin) + ScrollTrigger scrub. Robust: no pin-spacer,
     no race, no crash. */
  useLayoutEffect(() => {
    if (isMobile !== false) return;
    const section = wrapperRef.current;
    if (!section) return;

    if (reduced) {
      gsap.set(
        [introRef.current, headerSideRef.current, contentRef.current],
        {
          clearProps: "all",
          autoAlpha: 1,
          y: 0,
        },
      );
      return;
    }

    const ctx = gsap.context(() => {
      // Offset layout judul terhadap sticky container (scroll-independent):
      // pas sticky top:0, offset ini = posisi layar judul di header.
      const leftOf = (el) => {
        let v = 0;
        while (el && el !== stickyRef.current && el !== document.body) {
          v += el.offsetLeft;
          el = el.offsetParent;
        }
        return v;
      };
      const topOf = (el) => {
        let v = 0;
        while (el && el !== stickyRef.current && el !== document.body) {
          v += el.offsetTop;
          el = el.offsetParent;
        }
        return v;
      };

      // State awal: judul header (elemen SAMA) di-transform ke tengah layar.
      // Dipisah ke fungsi supaya bisa di-re-evaluate pada refresh (font load,
      // resize) — kalau cuma gsap.set sekali, ukuran kehitung dengan font
      // fallback dan judul melenceng/overflow ke kanan.
      const positionIntro = () => {
        gsap.set(introRef.current, {
          x: () => {
            const el = introRef.current;
            return window.innerWidth / 2 - (leftOf(el) + el.offsetWidth / 2);
          },
          y: () => {
            const el = introRef.current;
            return window.innerHeight / 2 - (topOf(el) + el.offsetHeight / 2);
          },
          scale: () => {
            const fs = parseFloat(
              getComputedStyle(
                introRef.current.querySelector(".cp-intro-title"),
              ).fontSize,
            );
            return Math.min(window.innerWidth * 0.11, 144) / fs;
          },
          transformOrigin: "50% 50%",
        });
      };
      positionIntro();
      gsap.set(headerSideRef.current, { autoAlpha: 0, y: 24 });
      gsap.set(contentRef.current, { autoAlpha: 0, y: 60 });
      gsap.set(badgeRef.current, {
        autoAlpha: 0,
        clipPath: "inset(0 100% 0 0)",
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 15%",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: positionIntro,
        },
      });

      // Fase 1 — reveal baris dari balik mask
      tl.to(
        badgeRef.current,
        {
          autoAlpha: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.2,
          ease: "power2.out",
        },
        0.05,
      );

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

      // Fase 2 — MORPH ASLI: judul yang sama terbang dari tengah layar
      // ke posisi header-nya (scale→1, translate→0). Tidak pernah hilang.
      tl.to(
        introRef.current,
        {
          x: 0,
          y: 0,
          scale: 1,
          ease: "power2.inOut",
          duration: 0.26,
        },
        0.45,
      );

      // Fase 3 — elemen yang memang baru (sisi kanan header + konten) fade-in
      tl.to(
        headerSideRef.current,
        { autoAlpha: 1, y: 0, duration: 0.16, ease: "power3.out" },
        0.5,
      ).to(
        contentRef.current,
        { autoAlpha: 1, y: 0, duration: 0.2, ease: "power3.out" },
        0.58,
      );

      // Tail kosong → jeda settle sebelum sticky lepas
      tl.to({}, { duration: 0.18 }, 0.82);

    }, section);

    // Re-ukur posisi trigger setelah font besar (Syne) selesai load.
    // Harus di luar gsap.context() — cleanup di bawah butuh `raf` dalam scope-nya.
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

  /* ── Mobile: entered on inView ── */
  useEffect(() => {
    if (isMobile && inView) setEntered(true);
  }, [isMobile, inView]);

  const handleSelect = (i) => {
    setActiveIndex(i);
    setAutoplay(false);
    trackEvent(`home_certificate_${slugify(certificates[i].title)}`);
  };
  const current = certificates[activeIndex];

  /* ══════════════════════════════════════════
     MOBILE
  ══════════════════════════════════════════ */
  if (isMobile) {
    return (
      <>
        <style>{`
          @keyframes cp-scan{0%{transform:translate3d(0,0,0);opacity:0}5%{opacity:1}95%{opacity:1}100%{transform:translate3d(0,100%,0);opacity:0}}
          @keyframes cp-pdot{0%,100%{box-shadow:0 0 0 0 rgba(var(--ac1),.7)}50%{box-shadow:0 0 0 5px rgba(var(--ac1),0)}}
          .cp-scan{position:absolute;left:0;right:0;top:0;bottom:0;background:linear-gradient(90deg,transparent,rgba(var(--ac2),.35),transparent) top/100% 1px no-repeat;will-change:transform,opacity;animation:cp-scan 7s ease-in-out infinite;pointer-events:none;z-index:8}
          .cp-pdot{width:6px;height:6px;border-radius:50%;background:var(--ac);flex-shrink:0;animation:cp-pdot 2s infinite}
          .cp-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border:1px solid rgba(var(--ac2),.2);border-radius:100px;font-size:.68rem;color:rgba(var(--ac1),.75);background:rgba(var(--ac2),.07);letter-spacing:.05em}
          .cp-verify-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;width:100%;padding:12px;background:var(--ac-deep);border:none;border-radius:100px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.83rem;font-weight:500;color:${isDark ? "#232b20" : "white"};text-decoration:none;transition:background .2s}
          .cp-verify-btn:hover{background:var(--ac)}
          .cp-mob-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;border:1px solid rgba(var(--ac2),.12);background:rgba(var(--ac2),.04);margin-bottom:6px;transition:border-color .2s,background .2s}
          .cp-mob-item.active{border-color:rgba(var(--ac1),.5);background:rgba(var(--ac2),.1)}
          .cp-view-all{display:inline-flex;align-items:center;justify-content:center;gap:7px;width:100%;padding:12px;background:rgba(var(--ac2),.06);border:1px solid rgba(var(--ac2),.22);border-radius:100px;font-family:'DM Sans',sans-serif;font-size:.83rem;font-weight:500;color:${isDark ? "rgba(226,214,198,.72)" : "rgba(35,43,32,.72)"};text-decoration:none}
        `}</style>

        <section
          id="certificates"
          ref={(el) => {
            ref(el);
            pauseRef(el);
            wrapperRef.current = el;
          }}
          style={{
            position: "relative",
            padding: "72px 24px 80px",
            fontFamily: "'DM Sans',sans-serif",
            overflow: "hidden",
          }}
        >
          <div className="cp-scan" />
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

          {/* Header */}
          <div
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity .6s ease, transform .6s ease",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 1,
                  background: "linear-gradient(90deg,var(--ac),transparent)",
                }}
              />
              <span
                style={{
                  fontSize: ".65rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "rgba(var(--ac1),.7)",
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 700,
                }}
              >
                Proof Behind the Practice
              </span>
            </div>
            <div
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "clamp(2rem,9vw,3rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.92,
                textTransform: "uppercase",
              }}
            >
              <div style={{ color: textPrimary }}>VERIFIED</div>
              <div
                style={{
                  color: "transparent",
                  WebkitTextStroke: isDark
                    ? "1.5px rgba(255,255,255,.15)"
                    : "1.5px rgba(35,43,32,.15)",
                }}
              >
                SKILLS
              </div>
            </div>
          </div>

          {/* Main cert card */}
          <div
            style={{
              border: `1px solid ${borderColor}`,
              borderRadius: 14,
              background: cardBg,
              overflow: "hidden",
              marginBottom: 16,
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(30px)",
              transition: "opacity .65s ease .1s, transform .65s ease .1s",
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 200,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <motion.img
                key={activeIndex}
                src={getCertificatePreview(current.image) || "/placeholder.svg"}
                alt={current.title}
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55 }}
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(27,33,25,.85) 0%, transparent 60%)",
                }}
              />
              {/* Issuer badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 12,
                  background: "#1a2018",
                  borderRadius: 8,
                  padding: "4px 10px",
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                  border: "1px solid rgba(var(--ac2),.2)",
                }}
              >
                <span
                  style={{ fontSize: ".65rem", color: "rgba(226,214,198,.6)" }}
                >
                  Issued by
                </span>
                <span
                  style={{
                    fontSize: ".7rem",
                    fontWeight: 700,
                    color: "var(--ac)",
                    fontFamily: "Syne,sans-serif",
                  }}
                >
                  {current.issuer}
                </span>
              </div>
              {/* Project label */}
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 12,
                  fontSize: ".6rem",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "rgba(var(--ac1),.55)",
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(certificates.length).padStart(2, "0")}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "14px 16px 16px" }}>
              <h3
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: textPrimary,
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              >
                {current.title}
              </h3>

              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  marginBottom: 12,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: ".72rem",
                    color: textMuted,
                  }}
                >
                  <Calendar size={11} /> {current.issueDate}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: ".72rem",
                    color: textMuted,
                  }}
                >
                  <Tag size={11} /> {current.credentialId}
                </div>
              </div>

              {/* Skills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 5,
                  marginBottom: 14,
                }}
              >
                {current.skills?.map((s, i) => (
                  <span key={i} className="cp-chip">
                    <CheckCircle size={9} />
                    {s}
                  </span>
                ))}
              </div>

              <a
                href={current.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cp-verify-btn"
              >
                <ExternalLink size={13} /> Verify Certificate
              </a>
            </div>

            {/* Dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 5,
                padding: "10px 0 12px",
                borderTop: `1px solid rgba(var(--ac2),.08)`,
              }}
            >
              {certificates.map((cert, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  aria-label={`Show certificate: ${cert.title}`}
                  aria-current={i === activeIndex ? "true" : undefined}
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
                    transition: "width .3s ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* List */}
          <div
            style={{
              marginBottom: 20,
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity .7s ease .2s, transform .7s ease .2s",
            }}
          >
            {certificates.map((cert, i) => (
              <div
                key={cert.id}
                className={`cp-mob-item${i === activeIndex ? " active" : ""}`}
                onClick={() => handleSelect(i)}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background:
                      i === activeIndex
                        ? "rgba(var(--ac2),.15)"
                        : "rgba(var(--ac2),.05)",
                    border: `1px solid ${i === activeIndex ? "rgba(var(--ac1),.4)" : "rgba(var(--ac2),.12)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Award
                    size={15}
                    color={
                      i === activeIndex ? "var(--ac)" : isDark ? "rgba(226,214,198,.4)" : "rgba(35,43,32,.4)"
                    }
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "Syne,sans-serif",
                      fontSize: ".82rem",
                      fontWeight: 700,
                      color: textPrimary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cert.title}
                  </div>
                  <div style={{ fontSize: ".68rem", color: textMuted }}>
                    {cert.issuer} · {cert.issueDate}
                  </div>
                </div>
                {i === activeIndex && <div className="cp-pdot" />}
              </div>
            ))}
          </div>

          <Link to="/certificates" className="cp-view-all">
            View All Certificates <ArrowRight size={14} />
          </Link>
        </section>
      </>
    );
  }

  /* ══════════════════════════════════════════
     DESKTOP
  ══════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @keyframes cp-scan{0%{transform:translate3d(0,0,0);opacity:0}5%{opacity:1}95%{opacity:1}100%{transform:translate3d(0,100%,0);opacity:0}}
        @keyframes cp-pdot{0%,100%{box-shadow:0 0 0 0 rgba(var(--ac1),.7)}50%{box-shadow:0 0 0 6px rgba(var(--ac1),0)}}
        @keyframes cp-arr{0%,100%{transform:rotate(45deg) translate(0,0);opacity:.3}50%{transform:rotate(45deg) translate(4px,4px);opacity:1}}

        .cp-scan{position:absolute;left:0;right:0;top:0;bottom:0;background:linear-gradient(90deg,transparent,rgba(var(--ac2),.25),transparent) top/100% 1px no-repeat;will-change:transform,opacity;animation:cp-scan 7s ease-in-out infinite;pointer-events:none;z-index:8}
        .cp-gridbg{position:absolute;inset:0;pointer-events:none;background-image:repeating-linear-gradient(0deg,transparent,transparent 72px,rgba(var(--ac2),.018) 72px,rgba(var(--ac2),.018) 73px),repeating-linear-gradient(90deg,transparent,transparent 72px,rgba(var(--ac2),.018) 72px,rgba(var(--ac2),.018) 73px);z-index:0}
        .cp-pdot{width:6px;height:6px;border-radius:50%;background:var(--ac);flex-shrink:0;animation:cp-pdot 2s infinite}
        .cp-pdot-sm{width:5px;height:5px;border-radius:50%;background:var(--ac);flex-shrink:0;animation:cp-pdot 2s infinite}
        .cp-peek{animation:cp-peek-in .14s ease-out}
        @keyframes cp-peek-in{from{opacity:0}to{opacity:1}}

        .cp-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border:1px solid rgba(var(--ac2),.2);border-radius:100px;font-size:.7rem;color:rgba(var(--ac1),.75);background:rgba(var(--ac2),.07);letter-spacing:.06em;transition:border-color .2s,background .2s}
        .cp-chip:hover{border-color:rgba(var(--ac2),.45);background:rgba(var(--ac2),.13)}

        .cp-verify{display:inline-flex;align-items:center;gap:7px;padding:11px 26px;background:var(--ac-deep);border:none;border-radius:100px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;color:${isDark ? "#232b20" : "white"};text-decoration:none;transition:transform .22s,background .22s;white-space:nowrap}
        .cp-verify:hover{transform:translateY(-2px);background:var(--ac)}

        .cp-view-all{display:inline-flex;align-items:center;justify-content:center;gap:7px;width:100%;padding:11px;background:rgba(var(--ac2),.06);border:1px solid rgba(var(--ac2),.22);border-radius:100px;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;color:${isDark ? "rgba(226,214,198,.72)" : "rgba(35,43,32,.72)"};text-decoration:none;transition:transform .22s,border-color .22s}
        .cp-view-all:hover{transform:translateY(-2px);border-color:rgba(var(--ac2),.5)}

        .cp-list-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:10px;cursor:pointer;border:1px solid rgba(var(--ac2),.08);background:transparent;transition:border-color .2s,background .2s,transform .2s;margin-bottom:6px}
        .cp-list-item:hover{border-color:rgba(var(--ac2),.25);background:rgba(var(--ac2),.05);transform:translateX(4px)}
        .cp-list-item.active{border-color:rgba(var(--ac1),.45);background:rgba(var(--ac2),.09)}

        .cp-scroll-arrow{width:12px;height:12px;border-right:1px solid rgba(var(--ac2),.5);border-bottom:1px solid rgba(var(--ac2),.5);transform:rotate(45deg);animation:cp-arr 1.5s ease-in-out infinite}

        /* ── Judul header = intro (morph asli: elemen sama, tanpa duplikat) ── */
        .cp-intro-inner{will-change:transform,opacity;transform-origin:center center}
        .cp-intro-title{font-family:Syne,sans-serif;font-weight:800;font-size:clamp(3rem,6vw,6.5rem);line-height:.88;letter-spacing:-.04em;text-transform:uppercase}
        .cp-mask{overflow:hidden;padding:0 .05em}
      `}</style>

      <section
        id="certificates"
        ref={(el) => {
          ref(el);
          pauseRef(el);
          wrapperRef.current = el;
        }}
        style={{
          position: "relative",
          width: "100%",
          height: reduced ? "auto" : "240vh",
          fontFamily: "'DM Sans',sans-serif",
        }}
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
        <div className="cp-scan" />
        <div className="cp-gridbg" />

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

        {/* ── HEADER ── label + judul di sini JUGA intro-nya (morph asli) */}
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
          {/* Label + judul = intro: di-transform ke tengah layar saat masuk
              section, lalu morf kembali ke posisi ini. Satu elemen, tidak
              ada duplikat. */}
          <div
            ref={introRef}
            className="cp-intro-inner"
            style={{ position: "relative", zIndex: 30 }}
          >
            <div
              ref={badgeRef}
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
                  background: "linear-gradient(90deg,var(--ac),transparent)",
                }}
              />
              <span
                style={{
                  fontSize: ".65rem",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "rgba(var(--ac1),.7)",
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 700,
                }}
              >
                Proof Behind the Practice
              </span>
            </div>
            <div className="cp-intro-title">
              <div className="cp-mask">
                <div ref={line1Ref} style={{ color: textPrimary }}>
                  VERIFIED
                </div>
              </div>
              <div className="cp-mask">
                <div
                  ref={line2Ref}
                  style={{
                    color: "transparent",
                    WebkitTextStroke: isDark
                      ? "2px rgba(255,255,255,.15)"
                      : "2px rgba(35,43,32,.15)",
                  }}
                >
                  SKILLS
                </div>
              </div>
            </div>
          </div>

          {/* Right side — counter + scroll hint (elemen baru, fade-in wajar) */}
          <div
            ref={headerSideRef}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="cp-pdot" />
              <span
                style={{
                  fontSize: ".68rem",
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  color: "rgba(var(--ac1),.65)",
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(certificates.length).padStart(2, "0")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: ".62rem",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: isDark ? "rgba(226,214,198,.25)" : "rgba(35,43,32,.3)",
              }}
            >
              <div className="cp-scroll-arrow" />
              Scroll
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div
          ref={contentRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 20,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* ── LEFT: Certificate display ── */}
          <div
            style={{
              border: `1px solid ${borderColor}`,
              borderRadius: 14,
              overflow: "hidden",
              background: cardBg,
              display: "flex",
              flexDirection: "column",
              height: 480,
              maxHeight: "56vh",
            }}
            data-cert-card="detail"
            onMouseEnter={(e) => {
              setAutoplay(false);
              showPeek(e, activeIndex, "right");
            }}
            onMouseMove={movePeek}
            onMouseLeave={() => {
              setAutoplay(true);
              setPeek(null);
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "13px 20px",
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
                Certificate Detail
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
                {String(certificates.length).padStart(2, "0")}
              </span>
            </div>

            {/* Details — deliberately does not scroll; the certificate image is a hover preview on the list */}
            <div data-scroll="cert-details" style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "22px 24px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <motion.div
                key={`detail-${activeIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: textPrimary,
                    marginBottom: 10,
                    lineHeight: 1.15,
                  }}
                >
                  {current.title}
                </h3>

                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg,rgba(var(--ac2),.3),transparent)",
                    marginBottom: 12,
                  }}
                />

                {/* Meta row */}
                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    marginBottom: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: ".75rem",
                      color: textMuted,
                    }}
                  >
                    <Award size={12} /> {current.issuer}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: ".75rem",
                      color: textMuted,
                    }}
                  >
                    <Calendar size={12} /> {current.issueDate}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: ".75rem",
                      color: textMuted,
                    }}
                  >
                    <Tag size={12} /> {current.credentialId}
                  </div>
                </div>

                {/* Skills */}
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
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
                      Skills & Knowledge
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
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {current.skills?.map((s, i) => (
                      <span key={i} className="cp-chip">
                        <CheckCircle size={9} />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action — pinned bottom */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: `1px solid rgba(var(--ac2),.1)`,
                flexShrink: 0,
              }}
            >
              <a
                href={current.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cp-verify"
              >
                <ExternalLink size={13} /> Verify Certificate
              </a>
            </div>
          </div>

          {/* ── RIGHT: Certificate list ── */}
          <div
            style={{
              border: `1px solid ${borderColor}`,
              borderRadius: 14,
              background: cardBg,
              display: "flex",
              flexDirection: "column",
              height: 480,
              maxHeight: "56vh",
              overflow: "hidden",
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "13px 20px",
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
                All Certifications
              </span>
            </div>

            {/* List */}
            <div className="thin-scroll" data-scroll="cert-list" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "12px 14px" }}>
              {peek !== null &&
                createPortal(
                  <div
                    ref={peekRef}
                    aria-hidden="true"
                    className="cp-peek"
                    style={{
                      position: "fixed",
                      left: 0,
                      top: 0,
                      width: 320,
                      pointerEvents: "none",
                      zIndex: 70,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1px solid rgba(var(--ac2),.3)",
                      background: isDark ? "#1b2119" : "#ece3d6",
                      boxShadow: "0 20px 44px -14px rgba(0,0,0,.45)",
                    }}
                  >
                    <img
                      src={getCertificatePreview(certificates[peek].image)}
                      alt=""
                      decoding="async"
                      onLoad={placePeek} // the card grows when the image arrives; keep it inside the viewport
                      style={{
                        display: "block",
                        width: "100%",
                        maxHeight: 260,
                        objectFit: "contain",
                        background: isDark ? "#151a13" : "#e2d6c6",
                      }}
                    />
                    <div
                      style={{
                        padding: "9px 12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 10,
                        borderTop: "1px solid rgba(var(--ac2),.14)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Syne,sans-serif",
                          fontSize: ".74rem",
                          fontWeight: 700,
                          color: textPrimary,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {certificates[peek].title}
                      </span>
                      <span style={{ fontSize: ".66rem", color: textMuted, flexShrink: 0 }}>
                        {certificates[peek].issueDate}
                      </span>
                    </div>
                  </div>,
                  document.body,
                )}
              {certificates.map((cert, i) => (
                <div
                  key={cert.id}
                  className={`cp-list-item${i === activeIndex ? " active" : ""}`}
                  onClick={() => handleSelect(i)}
                  onMouseEnter={(e) => {
                    setAutoplay(false);
                    showPeek(e, i);
                  }}
                  onMouseMove={movePeek}
                  onMouseLeave={() => {
                    setAutoplay(true);
                    setPeek(null);
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background:
                        i === activeIndex
                          ? "rgba(var(--ac2),.15)"
                          : "rgba(var(--ac2),.05)",
                      border: `1px solid ${i === activeIndex ? "rgba(var(--ac1),.4)" : "rgba(var(--ac2),.12)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background .2s, border-color .2s",
                    }}
                  >
                    <Award
                      size={16}
                      color={
                        i === activeIndex ? "var(--ac)" : isDark ? "rgba(226,214,198,.35)" : "rgba(35,43,32,.35)"
                      }
                    />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "Syne,sans-serif",
                        fontSize: ".82rem",
                        fontWeight: 700,
                        color:
                          i === activeIndex
                            ? textPrimary
                            : isDark
                              ? "rgba(226,214,198,.76)"
                              : "rgba(35,43,32,.8)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: 2,
                      }}
                    >
                      {cert.title}
                    </div>
                    <div
                      style={{
                        fontSize: ".68rem",
                        color: textMuted,
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      {cert.issuer} <span style={{ opacity: 0.4 }}>·</span>{" "}
                      {cert.issueDate}
                    </div>
                  </div>

                  {i === activeIndex && <div className="cp-pdot-sm" />}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div
              style={{
                margin: "0 14px 10px",
                height: 1,
                background: "rgba(var(--ac2),.1)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${((activeIndex + 1) / certificates.length) * 100}%`,
                  background: "linear-gradient(90deg,var(--ac-deep),var(--ac))",
                  transition: "width .4s ease",
                }}
              />
            </div>

            {/* View All */}
            <div style={{ padding: "0 14px 14px", flexShrink: 0 }}>
              <Link to="/certificates" className="cp-view-all">
                View All Certificates <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
