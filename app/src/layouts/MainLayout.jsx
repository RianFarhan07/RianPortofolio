import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const MainLayout = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        background: isDark
          ? "linear-gradient(180deg, #08111f 0%, #0a1730 42%, #03070f 100%)"
          : "linear-gradient(180deg, #edf6f2 0%, #e2f1ec 46%, #f5faf8 100%)",
      }}
    >
      {/* ── Horizon glow ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: isDark
            ? "radial-gradient(ellipse 65% 42% at 50% 50%, rgba(0,180,255,0.32), rgba(0,110,255,0.15) 42%, transparent 70%)"
            : "radial-gradient(ellipse 65% 42% at 50% 50%, rgba(20,184,166,0.26), rgba(16,185,129,0.12) 42%, transparent 70%)",
        }}
      />

      {/* ── Sun / horizon orb (dark theme) ── */}
      {isDark && (
        <div
          style={{
            position: "fixed",
            top: "32%",
            left: "50%",
            width: "clamp(160px, 22vw, 300px)",
            height: "clamp(160px, 22vw, 300px)",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(120,220,255,0.45), rgba(0,130,255,0.20) 48%, transparent 70%)",
            filter: "blur(8px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Perspective grid floor ── */}
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
            backgroundImage: isDark
              ? "linear-gradient(rgba(31,182,255,0.42) 1px, transparent 1px), linear-gradient(90deg, rgba(56,130,255,0.36) 1px, transparent 1px)"
              : "linear-gradient(rgba(20,184,166,0.34) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.26) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "rotateX(74deg)",
            transformOrigin: "top center",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 32%, #000 100%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 32%, #000 100%)",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div style={{ position: "relative", zIndex: 10 }}>{children}</div>

      <style>{`
        @keyframes mlFloor {
          from { background-position: 0 0; }
          to   { background-position: 0 60px; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="mlFloor"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
