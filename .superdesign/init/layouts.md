# Shared Layouts

## MainLayout

- Path: `app/src/layouts/MainLayout.jsx`
- Purpose: Global visual shell and responsive background behavior.

```jsx
import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  GANTI ANGKA DI BAWAH â†’ SAVE â†’ LIHAT HASILNYA
//  1â€“12 tersedia
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const ACTIVE_THEME = 12;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  01 â€” ORIGINAL GRID  â˜… (persis seperti tema lama kamu)
//  Background biru tua, glow besar di tengah, orb blur,
//  + perspective grid floor bergerak ke bawah.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  02 â€” ANIMATED GRID  (grid biasa tapi bergerak scroll ke bawah)
//  Sama seperti #1 tapi lebih bersih, tanpa orb.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  03 â€” DOT MATRIX  (titik-titik halus menggantikan garis)
//  Lebih subtle dari grid, terasa modern & techy.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  04 â€” PARTICLES  (titik bergerak + garis koneksi antar titik)
//  Dynamic & interaktif â€” paling "hidup".
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  05 â€” AURORA  (awan warna bergerak halus di background)
//  Deep purple-navy, aurora bergerak seperti northern lights.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const THEME_5 = {
  effect: "aurora",
  pageBg: {
    dark: "linear-gradient(170deg,#07091a 0%,#0e0c28 40%,#060a14 100%)",
    light: "linear-gradient(170deg,#f0f5fb 0%,#eaf0f8 40%,#f5f8fc 100%)",
  },
  glowA: { dark: "none", light: "none" },
  orb: { dark: null, light: null },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  06 â€” NEON CITY  (cyan dari kiri, magenta dari kanan + scanlines)
//  Paling bold dan eye-catching â€” cyberpunk aesthetic.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  07 â€” SCANLINES RETRO  (hijau gelap + scanlines tebal)
//  Terminal / hacker aesthetic. Kalau suka vibes retro CRT.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  08 â€” RADAR  (lingkaran radar berputar dengan sweep animasi)
//  Paling unik & interaktif secara visual. Full sci-fi.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  09 â€” POLOS BIRU  (hanya gradient + glow, tanpa efek)
//  Clean, mirip tema 1 tapi tanpa grid sama sekali.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  10 â€” POLOS VIOLET  (deep purple, hanya glow atas)
//  Luxury & premium. Tanpa efek apapun.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  11 â€” POLOS CARBON  (solid hitam, tidak ada glow sama sekali)
//  Paling minimalis. Teks dan elemen konten jadi fokus utama.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const THEME_11 = {
  effect: "noise",
  pageBg: { dark: "#050505", light: "#f9f9f9" },
  glowA: { dark: "none", light: "none" },
  orb: { dark: null, light: null },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  12 â€” POLOS PUTIH  (white/light mode primary, hint biru es)
//  Apple / Linear aesthetic. Ultra clean & airy.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MAPPING
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CANVAS EFFECTS (particles, aurora, radar, animgrid)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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

    // â”€â”€ Particles â”€â”€
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

    // â”€â”€ Aurora â”€â”€
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

    // â”€â”€ Radar â”€â”€
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

    // â”€â”€ Animated Grid â”€â”€
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MAIN LAYOUT COMPONENT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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
      {/* â”€â”€ Canvas (particles / aurora / radar / animgrid) â”€â”€ */}
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

      {/* â”€â”€ Ambient glow A â”€â”€ */}
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

      {/* â”€â”€ Orb (tema 1 dark) â”€â”€ */}
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

      {/* â”€â”€ Perspective grid floor (tema 1 original) â”€â”€ */}
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

      {/* â”€â”€ Dot grid (tema 3) â”€â”€ */}
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

      {/* â”€â”€ Scanlines (tema 6 & 7) â”€â”€ */}
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

      {/* â”€â”€ Noise texture (tema 11) â”€â”€ */}
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

      {/* â”€â”€ Main content â”€â”€ */}
      <div style={{ position: "relative", zIndex: 10 }}>{children}</div>

    </div>
  );
};

export default MainLayout;
```
## Navbar

- Path: `app/src/components/Navbar.jsx`
- Purpose: Desktop top navigation and mobile bottom navigation.

```jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Home,
  User,
  FolderOpen,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // hysteresis biar nggak flicker di sekitar threshold
        setIsScrolled((s) => (s ? y > 30 : y > 60));
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Home", path: "/", icon: Home },
    { title: "About", path: "/about", icon: User },
    { title: "Projects", path: "/projects", icon: FolderOpen },
    { title: "Certificates", path: "/certificates", icon: ShieldCheck },
    { title: "Contact", path: "/contact", icon: MessageSquare },
  ];

  return (
    <>
      <header className="hidden md:block fixed top-3 left-0 right-0 z-50 w-full px-4">
        <nav
          className="mx-auto flex items-center justify-between rounded-full px-6 py-2 border-0"
          style={{
            width: "100%",
            maxWidth: isScrolled ? 760 : 1200,
            backgroundColor: isScrolled
              ? isDark
                ? "#111d2c"
                : "#f7f9fb"
              : "transparent",
            boxShadow: isScrolled ? "0 10px 30px -12px rgba(0,0,0,0.35)" : "none",
            transition:
              "max-width .45s cubic-bezier(.4,0,.2,1), background-color .35s ease, box-shadow .35s ease",
            willChange: "max-width",
          }}
        >
          <Link to="/" className="text-xl font-bold">
            <span className="text-2xl font-bold text-[var(--ac)]">
              Rian.dev
            </span>
          </Link>

          {/* Desktop */}
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.title}
                  to={link.path}
                  className={`relative px-2 py-1 transition-colors ${
                    isActive
                      ? "text-[var(--ac)] font-semibold"
                      : isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.title}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-1 h-1.5 w-1.5 bg-[var(--ac)] rounded-full mx-auto"></span>
                  )}
                </Link>
              );
            })}

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile  */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${
          isDark ? "bg-[#111d2c] border-gray-800" : "bg-[#f7f9fb] border-gray-200"
        } border-t shadow-lg border-0`}
        style={{
          borderTopWidth: "1px",
          borderTopColor: isDark ? "rgba(184,134,11,0.25)" : "rgba(125,84,16,0.18)",
          borderLeft: 0,
          borderRight: 0,
          borderBottom: 0,
        }}
      >
        <div className="flex justify-around items-center py-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.title}
                to={link.path}
                className={`flex flex-col items-center py-1 px-3 ${
                  isActive
                    ? "text-[var(--ac)]"
                    : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                <Icon size={16} />
                <span className="text-xs mt-1">{link.title}</span>
                {isActive && (
                  <span className="h-1 w-1 bg-[var(--ac)] rounded-full mt-1"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Theme di mobile */}
      <button
        onClick={toggleTheme}
        className={`md:hidden fixed bottom-20 right-4 z-50 p-3 rounded-full shadow-lg ${
          isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </>
  );
}
```

## Footer

- Path: `app/src/components/Footer.jsx`
- Purpose: Shared footer used by routed pages.

```jsx
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";

const A = "var(--ac)";
const AD = "var(--ac-deep)";
const AR = "var(--ac1)";
const AR2 = "var(--ac2)";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  const txt = isDark ? "#e7edf5" : "#10233f";
  const muted = isDark ? "rgba(210,222,235,0.45)" : "rgba(16,35,63,0.45)";
  const muted2 = isDark ? "rgba(210,222,235,0.25)" : "rgba(16,35,63,0.28)";

  const navItems = ["Home", "About", "Projects", "Certificates", "Contact"];
  const socialLinks = [
    { icon: <Github size={16} />, href: "https://github.com/RianFarhan07" },
    { icon: <Linkedin size={16} />, href: "https://www.linkedin.com/in/baso-rian-farhan-82bb73245/" },
    { icon: <Mail size={16} />, href: "mailto:rian.mallanti@gmail.com" },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative py-12 md:py-16 overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .ft-scan{position:absolute;left:0;right:0;height:1px;top:0;z-index:8;pointer-events:none;
          background:linear-gradient(90deg,transparent,rgba(${AR2},.3),transparent);animation:ft-sc 8s ease-in-out infinite}
        @keyframes ft-sc{0%{opacity:0;left:-100%}5%{opacity:1;left:0}95%{opacity:1;left:0}100%{opacity:0;left:100%}}
        @keyframes ft-heart{0%,100%{transform:scale(1)rotate(0deg)}25%{transform:scale(1.2)rotate(5deg)}75%{transform:scale(1.2)rotate(-5deg)}}
        .ft-heart{display:inline-block;animation:ft-heart 1.5s ease-in-out infinite;color:${A}}
      `}</style>

      {/* Top border with scanning line */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: `rgba(${AR2}, 0.18)` }} />
      <div className="ft-scan" />

      {/* Corner brackets */}
      {[
        { top: 16, left: 16, borderTop: `1px solid rgba(${AR2},.2)`, borderLeft: `1px solid rgba(${AR2},.2)` },
        { top: 16, right: 16, borderTop: `1px solid rgba(${AR2},.2)`, borderRight: `1px solid rgba(${AR2},.2)` },
        { bottom: 16, left: 16, borderBottom: `1px solid rgba(${AR2},.2)`, borderLeft: `1px solid rgba(${AR2},.2)` },
        { bottom: 16, right: 16, borderBottom: `1px solid rgba(${AR2},.2)`, borderRight: `1px solid rgba(${AR2},.2)` },
      ].map((s, i) => <div key={i} className="absolute w-3 h-3 pointer-events-none" style={{ ...s }} />)}

      <div className="relative z-10 flex flex-col items-center gap-8" style={{ padding: "0 clamp(20px,4vw,60px)", maxWidth: 800, margin: "0 auto" }}>
        {/* Back to top */}
        <motion.button onClick={scrollToTop}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{ background: `rgba(${AR}, 0.06)`, border: `1px solid rgba(${AR}, 0.2)`, color: A }}
          whileHover={{ scale: 1.1, boxShadow: `0 0 20px rgba(${AR}, 0.3)` }} whileTap={{ scale: 0.95 }}>
          <ArrowUp size={18} />
        </motion.button>

        {/* Name */}
        <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif", color: txt }}>
          Baso Rian Farhan Mallanti
        </h2>

        {/* Nav */}
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {navItems.map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="text-xs tracking-wider uppercase transition-colors no-underline"
                style={{ color: muted, fontFamily: "'DM Sans', sans-serif" }}>
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Social */}
        <div className="flex gap-3">
          {socialLinks.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ background: `rgba(${AR}, 0.06)`, border: `1px solid rgba(${AR}, 0.18)`, color: A }}
              onMouseEnter={e => e.currentTarget.style.background = `rgba(${AR}, 0.14)`}
              onMouseLeave={e => e.currentTarget.style.background = `rgba(${AR}, 0.06)`}>
              {s.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[11px] tracking-wider text-center" style={{ color: muted2 }}>
          &copy; {currentYear} &mdash; Designed &amp; Built with <span className="ft-heart"><Heart size={12} fill={A} /></span> by Rian Farhan
        </p>
      </div>
    </footer>
  );
}
```
