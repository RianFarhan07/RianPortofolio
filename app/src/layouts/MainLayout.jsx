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
          ? "radial-gradient(ellipse 80% 80% at 50% 30%, #0a1230 0%, #040810 70%)"
          : "radial-gradient(ellipse 80% 80% at 50% 30%, #e8f4ff 0%, #f0f8ff 70%)",
      }}
    >
      {/* ── Grid overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: isDark
            ? "linear-gradient(rgba(0,180,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(0,100,200,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,200,0.04) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* ── Ambient glow blobs ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* Top-right blue blob */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "clamp(200px, 25vw, 380px)",
            height: "clamp(200px, 25vw, 380px)",
            borderRadius: "50%",
            background: isDark
              ? "rgba(0,100,255,0.12)"
              : "rgba(59,130,246,0.1)",
            filter: "blur(80px)",
            animation: "mlPulse 8s infinite ease-in-out",
          }}
        />
        {/* Bottom-left cyan blob */}
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "10%",
            width: "clamp(200px, 25vw, 380px)",
            height: "clamp(200px, 25vw, 380px)",
            borderRadius: "50%",
            background: isDark
              ? "rgba(0,212,255,0.08)"
              : "rgba(20,184,166,0.08)",
            filter: "blur(80px)",
            animation: "mlPulse 8s infinite ease-in-out reverse",
          }}
        />
        {/* Center purple blob */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(180px, 22vw, 320px)",
            height: "clamp(180px, 22vw, 320px)",
            borderRadius: "50%",
            background: isDark
              ? "rgba(120,40,255,0.05)"
              : "rgba(168,85,247,0.05)",
            filter: "blur(80px)",
            animation: "mlPulse 10s infinite ease-in-out",
          }}
        />
      </div>

      {/* ── Scan line ── */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(0,180,255,0.25), transparent)",
          zIndex: 1,
          pointerEvents: "none",
          animation: "mlScan 12s ease-in-out infinite",
        }}
      />

      {/* ── Main content ── */}
      <div style={{ position: "relative", zIndex: 10 }}>{children}</div>

      <style>{`
        @keyframes mlPulse {
          0%, 100% { transform: scale(1);   opacity: 0.8; }
          50%       { transform: scale(1.15); opacity: 1;   }
        }
        @keyframes mlScan {
          0%   { top: 0;    opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
