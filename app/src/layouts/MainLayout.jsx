import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

// ═══════════════════════════════════════════════════════════════
//  GANTI ANGKA DI BAWAH → SAVE → LIHAT HASILNYA
//  1–12 tersedia
// ═══════════════════════════════════════════════════════════════
const ACTIVE_THEME = 12;

// ─────────────────────────────────────────────────────────────
//  01 — ORIGINAL GRID  ★ (persis seperti tema lama kamu)
//  Background biru tua, glow besar di tengah, orb blur,
//  + perspective grid floor bergerak ke bawah.
// ─────────────────────────────────────────────────────────────
const THEME_1 = {
  effect: "grid",
  pageBg: {
    dark: "linear-gradient(180deg,#08111f 0%,#0a1730 42%,#03070f 100%)",
    light: "linear-gradient(180deg,#edf6f2 0%,#e2f1ec 46%,#f5faf8 100%)",
  },
  glowA: {
    dark: "radial-gradient(ellipse 65% 42% at 50% 50%,rgba(0,180,255,0.32),rgba(0,110,255,0.15) 42%,transparent 70%)",
    light:
      "radial-gradient(ellipse 65% 42% at 50% 50%,rgba(20,184,166,0.26),rgba(16,185,129,0.12) 42%,transparent 70%)",
  },
  orb: {
    dark: "radial-gradient(circle,rgba(120,220,255,0.45),rgba(0,130,255,0.20) 48%,transparent 70%)",
    light: null,
  },
  gridLines: {
    dark: ["rgba(31,182,255,0.42)", "rgba(56,130,255,0.36)"],
    light: ["rgba(20,184,166,0.34)", "rgba(16,185,129,0.26)"],
  },
};

// ─────────────────────────────────────────────────────────────
//  02 — ANIMATED GRID  (grid biasa tapi bergerak scroll ke bawah)
//  Sama seperti #1 tapi lebih bersih, tanpa orb.
// ─────────────────────────────────────────────────────────────
const THEME_2 = {
  effect: "animgrid",
  pageBg: {
    dark: "linear-gradient(180deg,#050d18 0%,#07152a 42%,#020810 100%)",
    light: "linear-gradient(180deg,#edf6f2 0%,#e2f1ec 46%,#f5faf8 100%)",
  },
  glowA: {
    dark: "radial-gradient(ellipse 70% 40% at 50% 50%,rgba(0,180,255,0.22),rgba(0,100,255,0.10) 42%,transparent 70%)",
    light:
      "radial-gradient(ellipse 70% 40% at 50% 50%,rgba(20,184,166,0.20),rgba(16,185,129,0.10) 42%,transparent 70%)",
  },
  orb: { dark: null, light: null },
  gridLines: {
    dark: ["rgba(31,182,255,0.28)", "rgba(56,130,255,0.22)"],
    light: ["rgba(20,184,166,0.28)", "rgba(16,185,129,0.20)"],
  },
  animated: true,
};

// ─────────────────────────────────────────────────────────────
//  03 — DOT MATRIX  (titik-titik halus menggantikan garis)
//  Lebih subtle dari grid, terasa modern & techy.
// ─────────────────────────────────────────────────────────────
const THEME_3 = {
  effect: "dots",
  pageBg: {
    dark: "linear-gradient(160deg,#060a12 0%,#090f1e 55%,#040810 100%)",
    light: "linear-gradient(160deg,#f0f4f8 0%,#e8eff6 55%,#f5f8fb 100%)",
  },
  glowA: {
    dark: "radial-gradient(ellipse 60% 40% at 50% 30%,rgba(56,170,255,0.14),transparent 70%)",
    light:
      "radial-gradient(ellipse 60% 40% at 50% 30%,rgba(14,165,233,0.14),transparent 70%)",
  },
  orb: { dark: null, light: null },
  dotColor: { dark: "rgba(255,255,255,0.10)", light: "rgba(0,80,200,0.08)" },
};

// ─────────────────────────────────────────────────────────────
//  04 — PARTICLES  (titik bergerak + garis koneksi antar titik)
//  Dynamic & interaktif — paling "hidup".
// ─────────────────────────────────────────────────────────────
const THEME_4 = {
  effect: "particles",
  pageBg: {
    dark: "linear-gradient(160deg,#050810 0%,#080c1a 55%,#030610 100%)",
    light: "linear-gradient(160deg,#f0f4f8 0%,#e8eff6 55%,#f5f8fb 100%)",
  },
  glowA: {
    dark: "radial-gradient(ellipse 70% 40% at 50% -5%,rgba(56,130,255,0.12),transparent 65%)",
    light:
      "radial-gradient(ellipse 70% 40% at 50% -5%,rgba(56,130,255,0.10),transparent 65%)",
  },
  orb: { dark: null, light: null },
};

// ─────────────────────────────────────────────────────────────
//  05 — AURORA  (awan warna bergerak halus di background)
//  Deep purple-navy, aurora bergerak seperti northern lights.
// ─────────────────────────────────────────────────────────────
const THEME_5 = {
  effect: "aurora",
  pageBg: {
    dark: "linear-gradient(170deg,#07091a 0%,#0e0c28 40%,#060a14 100%)",
    light: "linear-gradient(170deg,#f0f5fb 0%,#eaf0f8 40%,#f5f8fc 100%)",
  },
  glowA: { dark: "none", light: "none" },
  orb: { dark: null, light: null },
};

// ─────────────────────────────────────────────────────────────
//  06 — NEON CITY  (cyan dari kiri, magenta dari kanan + scanlines)
//  Paling bold dan eye-catching — cyberpunk aesthetic.
// ─────────────────────────────────────────────────────────────
const THEME_6 = {
  effect: "scanlines",
  scanOpacity: 0.04,
  pageBg: {
    dark: "linear-gradient(160deg,#050810 0%,#080c18 55%,#030610 100%)",
    light: "linear-gradient(160deg,#f0f4ff 0%,#e8eeff 55%,#f5f8ff 100%)",
  },
  glowA: {
    dark: `radial-gradient(ellipse 55% 40% at 10% 40%,rgba(0,255,240,0.12) 0%,transparent 60%),
          radial-gradient(ellipse 55% 40% at 90% 40%,rgba(255,0,220,0.10) 0%,transparent 60%),
          radial-gradient(ellipse 70% 25% at 50% -5%,rgba(80,120,255,0.09) 0%,transparent 65%)`,
    light: `radial-gradient(ellipse 55% 40% at 10% 40%,rgba(6,182,212,0.10) 0%,transparent 60%),
           radial-gradient(ellipse 55% 40% at 90% 40%,rgba(168,85,247,0.09) 0%,transparent 60%)`,
  },
  orb: { dark: null, light: null },
};

// ─────────────────────────────────────────────────────────────
//  07 — SCANLINES RETRO  (hijau gelap + scanlines tebal)
//  Terminal / hacker aesthetic. Kalau suka vibes retro CRT.
// ─────────────────────────────────────────────────────────────
const THEME_7 = {
  effect: "scanlines",
  scanOpacity: 0.12,
  pageBg: {
    dark: "linear-gradient(180deg,#080c04 0%,#0d1408 50%,#050804 100%)",
    light: "linear-gradient(180deg,#f5fbf2 0%,#edf7e8 50%,#f8fbf6 100%)",
  },
  glowA: {
    dark: "radial-gradient(ellipse 65% 42% at 50% 50%,rgba(100,255,80,0.18),rgba(50,200,30,0.08) 42%,transparent 70%)",
    light:
      "radial-gradient(ellipse 65% 42% at 50% 50%,rgba(16,185,129,0.16),rgba(5,150,105,0.08) 42%,transparent 70%)",
  },
  orb: { dark: null, light: null },
};

// ─────────────────────────────────────────────────────────────
//  08 — RADAR  (lingkaran radar berputar dengan sweep animasi)
//  Paling unik & interaktif secara visual. Full sci-fi.
// ─────────────────────────────────────────────────────────────
const THEME_8 = {
  effect: "radar",
  pageBg: {
    dark: "linear-gradient(180deg,#010d06 0%,#031208 50%,#010a04 100%)",
    light: "linear-gradient(180deg,#f0fbf5 0%,#e8f8ee 50%,#f5fbf8 100%)",
  },
  glowA: {
    dark: "radial-gradient(ellipse 60% 60% at 50% 50%,rgba(0,255,100,0.07),transparent 70%)",
    light:
      "radial-gradient(ellipse 60% 60% at 50% 50%,rgba(16,185,129,0.08),transparent 70%)",
  },
  orb: { dark: null, light: null },
};

// ─────────────────────────────────────────────────────────────
//  09 — POLOS BIRU  (hanya gradient + glow, tanpa efek)
//  Clean, mirip tema 1 tapi tanpa grid sama sekali.
// ─────────────────────────────────────────────────────────────
const THEME_9 = {
  effect: "none",
  pageBg: {
    dark: "linear-gradient(180deg,#08111f 0%,#0a1730 42%,#03070f 100%)",
    light: "linear-gradient(180deg,#edf6f2 0%,#e2f1ec 46%,#f5faf8 100%)",
  },
  glowA: {
    dark: "radial-gradient(ellipse 65% 42% at 50% -5%,rgba(0,140,255,0.15),transparent 65%)",
    light:
      "radial-gradient(ellipse 65% 42% at 50% -5%,rgba(6,182,212,0.14),transparent 65%)",
  },
  orb: { dark: null, light: null },
};

// ─────────────────────────────────────────────────────────────
//  10 — POLOS VIOLET  (deep purple, hanya glow atas)
//  Luxury & premium. Tanpa efek apapun.
// ─────────────────────────────────────────────────────────────
const THEME_10 = {
  effect: "none",
  pageBg: {
    dark: "linear-gradient(160deg,#09060f 0%,#110c1e 45%,#070410 100%)",
    light: "linear-gradient(160deg,#f5f2ff 0%,#ede8ff 45%,#f8f6ff 100%)",
  },
  glowA: {
    dark: "radial-gradient(ellipse 65% 42% at 50% -5%,rgba(139,92,246,0.18),transparent 65%)",
    light:
      "radial-gradient(ellipse 65% 42% at 50% -5%,rgba(139,92,246,0.14),transparent 65%)",
  },
  orb: { dark: null, light: null },
};

// ─────────────────────────────────────────────────────────────
//  11 — POLOS CARBON  (solid hitam, tidak ada glow sama sekali)
//  Paling minimalis. Teks dan elemen konten jadi fokus utama.
// ─────────────────────────────────────────────────────────────
const THEME_11 = {
  effect: "noise",
  pageBg: { dark: "#050505", light: "#f9f9f9" },
  glowA: { dark: "none", light: "none" },
  orb: { dark: null, light: null },
};

// ─────────────────────────────────────────────────────────────
//  12 — POLOS PUTIH  (white/light mode primary, hint biru es)
//  Apple / Linear aesthetic. Ultra clean & airy.
// ─────────────────────────────────────────────────────────────
const THEME_12 = {
  effect: "none",
  pageBg: {
    dark: "linear-gradient(160deg,#0d1520 0%,#111d2c 55%,#0a121c 100%)",
    light: "#f2f4f7",
  },
  glowA: {
    dark: "radial-gradient(ellipse 70% 35% at 50% -5%,rgba(224,168,58,0.06),transparent 65%)",
    light: `radial-gradient(ellipse 80% 45% at 50% -10%,rgba(156,106,18,0.14),rgba(232,236,241,0.25) 45%,transparent 70%)`,
  },
  orb: { dark: null, light: null },
};

// ═══════════════════════════════════════════════════════════════
//  MAPPING
// ═══════════════════════════════════════════════════════════════
const THEMES = {
  1: THEME_1,
  2: THEME_2,
  3: THEME_3,
  4: THEME_4,
  5: THEME_5,
  6: THEME_6,
  7: THEME_7,
  8: THEME_8,
  9: THEME_9,
  10: THEME_10,
  11: THEME_11,
  12: THEME_12,
};

// ═══════════════════════════════════════════════════════════════
//  CANVAS EFFECTS (particles, aurora, radar, animgrid)
// ═══════════════════════════════════════════════════════════════
function useCanvasEffect(canvasRef, effect, isDark) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf,
      particles = [],
      auroraT = 0,
      radarAngle = 0,
      gridOff = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // ── Particles ──
    function initP() {
      const W = canvas.width,
        H = canvas.height;
      particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.4,
        a: Math.random(),
      }));
    }
    function drawP() {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,180,255,${p.a * 0.7})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(80,160,255,${(1 - d / 120) * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    // ── Aurora ──
    function drawAurora() {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      auroraT += 0.003;
      [
        [0, 255, 180],
        [80, 120, 255],
        [200, 50, 255],
      ].forEach((c, i) => {
        const cx = W * (0.2 + i * 0.28 + Math.sin(auroraT + i) * 0.08);
        const cy = H * (0.15 + Math.sin(auroraT * 0.7 + i * 1.2) * 0.12);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.45);
        g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.10)`);
        g.addColorStop(0.5, `rgba(${c[0]},${c[1]},${c[2]},0.04)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });
    }

    // ── Radar ──
    function drawRadar() {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      radarAngle += 0.012;
      const cx = W * 0.5,
        cy = H * 0.5,
        R = Math.min(W, H) * 0.42;
      ctx.strokeStyle = "rgba(0,255,120,0.08)";
      ctx.lineWidth = 0.8;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * (i / 4), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(0,255,120,0.07)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, radarAngle - 1.0, radarAngle);
      ctx.closePath();
      const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      sg.addColorStop(0, "rgba(0,255,120,0.18)");
      sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(radarAngle) * R, cy + Math.sin(radarAngle) * R);
      ctx.strokeStyle = "rgba(0,255,120,0.55)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,255,120,0.8)";
      ctx.fill();
    }

    // ── Animated Grid ──
    function drawAnimGrid() {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      gridOff = (gridOff + 0.4) % 60;
      const cols = 30,
        rows = Math.ceil(H / 60) + 2;
      const alpha = isDark ? 0.1 : 0.06;
      ctx.strokeStyle = `rgba(31,182,255,${alpha})`;
      ctx.lineWidth = 0.8;
      for (let r = 0; r < rows; r++) {
        const y = r * 60 - gridOff;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      for (let c = 0; c <= cols; c++) {
        const x = (c / cols) * W;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
    }

    if (effect === "particles") initP();

    function tick() {
      if (effect === "particles") drawP();
      else if (effect === "aurora") drawAurora();
      else if (effect === "radar") drawRadar();
      else if (effect === "animgrid") drawAnimGrid();
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [effect, isDark]);
}

// ═══════════════════════════════════════════════════════════════
//  MAIN LAYOUT COMPONENT
// ═══════════════════════════════════════════════════════════════
const MainLayout = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = THEMES[ACTIVE_THEME];
  const canvasRef = useRef(null);

  useCanvasEffect(canvasRef, t.effect, isDark);

  const bg = isDark ? t.pageBg.dark : t.pageBg.light;
  const glowA = isDark ? t.glowA.dark : t.glowA.light;
  const orbBg = isDark ? t.orb?.dark : t.orb?.light;

  // Grid (tema 1 & 2)
  const showGrid = t.effect === "grid" || t.effect === "animgrid";
  const gridIsStatic = t.effect === "grid"; // perspektif hanya tema 1
  const gridH = isDark ? t.gridLines?.dark : t.gridLines?.light;
  const gridImg = gridH
    ? `linear-gradient(${gridH[0]} 1px,transparent 1px),linear-gradient(90deg,${gridH[1]} 1px,transparent 1px)`
    : "";

  // Dots (tema 3)
  const showDots = t.effect === "dots";
  const dotColor = isDark ? t.dotColor?.dark : t.dotColor?.light;

  // Scanlines (tema 6 & 7)
  const showScan = t.effect === "scanlines";

  // Noise (tema 11)
  const showNoise = t.effect === "noise";

  // Canvas effects (4, 5, 8, 2 animated)
  const showCanvas = ["particles", "aurora", "radar", "animgrid"].includes(
    t.effect,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "clip",
        fontFamily: "'DM Sans',sans-serif",
        background: bg,
        transition: "background .4s",
      }}
    >
      {/* ── Canvas (particles / aurora / radar / animgrid) ── */}
      {showCanvas && (
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Ambient glow A ── */}
      {glowA && glowA !== "none" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: glowA,
          }}
        />
      )}

      {/* ── Orb (tema 1 dark) ── */}
      {orbBg && (
        <div
          style={{
            position: "fixed",
            top: "32%",
            left: "50%",
            width: "clamp(160px,22vw,300px)",
            height: "clamp(160px,22vw,300px)",
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            background: orbBg,
            filter: "blur(8px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Perspective grid floor (tema 1 original) ── */}
      {gridIsStatic && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: "50%",
            bottom: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
            perspective: "300px",
            perspectiveOrigin: "50% 0%",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-50%",
              right: "-50%",
              bottom: "-60%",
              backgroundImage: gridImg,
              backgroundSize: "60px 60px",
              transform: "rotateX(74deg)",
              transformOrigin: "top center",
              WebkitMaskImage:
                "linear-gradient(180deg,transparent 0%,#000 32%,#000 100%)",
              maskImage:
                "linear-gradient(180deg,transparent 0%,#000 32%,#000 100%)",
            }}
          />
        </div>
      )}

      {/* ── Dot grid (tema 3) ── */}
      {showDots && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `radial-gradient(circle,${dotColor} 1px,transparent 1px)`,
            backgroundSize: "32px 32px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%,#000 40%,transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%,#000 40%,transparent 100%)",
          }}
        />
      )}

      {/* ── Scanlines (tema 6 & 7) ── */}
      {showScan && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.18) 3px,rgba(0,0,0,0.18) 4px)",
            opacity: t.scanOpacity ?? 0.06,
          }}
        />
      )}

      {/* ── Noise texture (tema 11) ── */}
      {showNoise && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
      )}

      {/* ── Main content ── */}
      <div style={{ position: "relative", zIndex: 10 }}>{children}</div>

    </div>
  );
};

export default MainLayout;
