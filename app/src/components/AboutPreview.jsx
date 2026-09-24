import { useEffect, useRef, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import aboutImage from "../assets/foto-nobg-editorial-natural.webp";

const stats = [
  { value: 20, suffix: "+", label: "Projects shipped" },
  { value: 4, suffix: "+", label: "Years building" },
];

const technologies = [
  {
    name: "Next.js",
    category: "Framework",
    icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF",
    color: "238, 243, 255",
  },
  {
    name: "NestJS",
    category: "Backend",
    icon: "https://cdn.simpleicons.org/nestjs/E0234E",
    color: "224, 35, 78",
  },
  {
    name: "React",
    category: "Interface",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    color: "97, 218, 251",
  },
  {
    name: "Node.js",
    category: "Runtime",
    icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
    color: "95, 160, 78",
  },
  {
    name: "Flutter",
    category: "Mobile",
    icon: "https://cdn.simpleicons.org/flutter/54C5F8",
    color: "84, 197, 248",
  },
  {
    name: "Kotlin",
    category: "Android",
    icon: "https://cdn.simpleicons.org/kotlin/7F52FF",
    color: "127, 82, 255",
  },
];

const carbonEthicsLogo = "https://static.wixstatic.com/media/ee9db0_f68a88bb9569472eae36b57823fdf84a~mv2.png/v1/crop/x_181,y_73,w_3005,h_835/fill/w_249,h_69,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/CarbonEthics%20Horizontal%20White.png";
const proofItems = [
  "CarbonEthics",
  "Disnaker Makassar",
  "Hacktiv8",
  "SMKN 4 Jeneponto",
];

function CountUp({ to, suffix = "", active }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    let frame;
    const duration = 1400;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, to]);

  return (
    <>
      {value}
      <em>{suffix}</em>
    </>
  );
}

export default function AboutPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionRef = useRef(null);
  const profileRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.22 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;

    const timer = window.setTimeout(() => setIsSettled(true), 1250);
    return () => window.clearTimeout(timer);
  }, [isVisible]);

  const handlePointerMove = (event) => {
    if (!profileRef.current || window.innerWidth < 768) return;

    const bounds = profileRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const imageX = (relativeX - 0.5) * -12;
    const imageY = (relativeY - 0.5) * -8;

    profileRef.current.style.setProperty("--pointer-x", `${relativeX * 100}%`);
    profileRef.current.style.setProperty("--pointer-y", `${relativeY * 100}%`);
    profileRef.current.style.setProperty("--image-x", `${imageX}px`);
    profileRef.current.style.setProperty("--image-y", `${imageY}px`);
  };

  const resetPointer = () => {
    if (!profileRef.current) return;
    profileRef.current.style.setProperty("--pointer-x", "72%");
    profileRef.current.style.setProperty("--pointer-y", "22%");
    profileRef.current.style.setProperty("--image-x", "0px");
    profileRef.current.style.setProperty("--image-y", "0px");
  };

  const themeStyles = {
    "--apx-bg": isDark ? "#08121f" : "#eef2f6",
    "--apx-panel": isDark ? "#0b1725" : "#f7f9fb",
    "--apx-panel-strong": isDark ? "#101e2e" : "#e8edf2",
    "--apx-ink": isDark ? "#e7edf5" : "#10233f",
    "--apx-muted": isDark ? "#91a0b2" : "#58677b",
    "--apx-faint": isDark ? "#7d8ca0" : "#5c6a7d",
    "--apx-photo-bg": isDark ? "#07101a" : "#dfe5ea",
    "--apx-button-text": isDark ? "#101a25" : "#ffffff",
    "--apx-shadow": isDark
      ? "0 46px 110px rgba(0, 0, 0, .3)"
      : "0 42px 100px rgba(24, 42, 67, .14)",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@600;700;800&display=swap');

        .apx-section {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: clamp(78px, 9vw, 136px) clamp(18px, 4vw, 64px);
          color: var(--apx-ink);
          background: var(--apx-bg);
          font-family: 'DM Sans', sans-serif;
        }

        .apx-section::before {
          position: absolute;
          inset: 0;
          z-index: -2;
          background-image:
            linear-gradient(rgba(var(--ac2), .045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--ac2), .045) 1px, transparent 1px);
          background-size: 72px 72px;
          content: '';
          mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
        }

        .apx-section::after {
          position: absolute;
          z-index: -1;
          top: 5%;
          left: -12%;
          width: 52vw;
          height: 52vw;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(var(--ac1), .12), transparent 68%);
          content: '';
          filter: blur(20px);
        }

        .apx-kicker {
          display: flex;
          width: min(1220px, 100%);
          align-items: center;
          justify-content: space-between;
          margin: 0 auto 18px;
          color: var(--apx-faint);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .64rem;
          letter-spacing: .16em;
          text-transform: uppercase;
          opacity: 0;
          transform: translate3d(0, 12px, 0);
          transition: opacity 500ms ease, transform 700ms cubic-bezier(.16, 1, .3, 1);
        }

        .apx-kicker.is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .apx-kicker span:first-child {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--ac);
        }

        .apx-kicker span:first-child::before {
          width: 30px;
          height: 1px;
          background: var(--ac);
          content: '';
        }

        .apx-profile {
          --pointer-x: 72%;
          --pointer-y: 22%;
          --image-x: 0px;
          --image-y: 0px;
          position: relative;
          display: grid;
          width: min(1220px, 100%);
          min-height: 700px;
          margin: 0 auto;
          overflow: hidden;
          grid-template-columns: minmax(360px, .84fr) minmax(520px, 1.16fr);
          border: 1px solid rgba(var(--ac2), .22);
          border-radius: 22px;
          background: var(--apx-panel);
          box-shadow: var(--apx-shadow);
          opacity: 0;
          transform: perspective(1200px) translate3d(0, 58px, 0) rotateX(3deg) scale(.975);
          transform-origin: 50% 28%;
          transition:
            opacity 420ms ease,
            transform 950ms cubic-bezier(.16, 1, .3, 1);
          contain: paint;
        }

        .apx-profile.is-visible {
          opacity: 1;
          transform: perspective(1200px) translate3d(0, 0, 0) rotateX(0) scale(1);
        }

        .apx-shutters {
          position: absolute;
          z-index: 40;
          inset: 0;
          display: grid;
          grid-template-rows: repeat(3, 1fr);
          pointer-events: none;
        }

        .apx-shutter {
          position: relative;
          background: linear-gradient(90deg, var(--apx-panel), var(--apx-panel-strong) 72%, var(--ac));
          transform: scaleX(1);
          transform-origin: right center;
          transition: transform 760ms cubic-bezier(.76, 0, .24, 1);
        }

        .apx-shutter::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 2px;
          background: var(--ac);
          box-shadow: -18px 0 44px rgba(var(--ac1), .34);
          content: '';
        }

        .apx-profile.is-visible .apx-shutter { transform: scaleX(0); }
        .apx-profile.is-visible .apx-shutter:nth-child(2) { transition-delay: 70ms; }
        .apx-profile.is-visible .apx-shutter:nth-child(3) { transition-delay: 140ms; }
        .apx-profile.is-settled .apx-shutters { display: none; }

        .apx-profile::before,
        .apx-profile::after {
          position: absolute;
          z-index: 15;
          width: 26px;
          height: 26px;
          pointer-events: none;
          content: '';
        }

        .apx-profile::before {
          top: 12px;
          left: 12px;
          border-top: 1px solid rgba(var(--ac2), .58);
          border-left: 1px solid rgba(var(--ac2), .58);
        }

        .apx-profile::after {
          right: 12px;
          bottom: 12px;
          border-right: 1px solid rgba(var(--ac2), .58);
          border-bottom: 1px solid rgba(var(--ac2), .58);
        }

        .apx-portrait {
          position: relative;
          min-height: 700px;
          overflow: hidden;
          border-right: 1px solid rgba(var(--ac2), .2);
          background:
            radial-gradient(circle at 52% 35%, rgba(var(--ac1), .24), transparent 31%),
            radial-gradient(circle at 50% 70%, rgba(35, 180, 210, .08), transparent 38%),
            linear-gradient(145deg, var(--apx-photo-bg), #050b12 72%);
        }

        .apx-portrait::before {
          position: absolute;
          z-index: 4;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(5, 11, 18, .04) 42%, rgba(5, 11, 18, .92) 100%),
            linear-gradient(90deg, transparent 78%, rgba(5, 11, 18, .32));
          content: '';
          pointer-events: none;
        }

        .apx-portrait::after {
          position: absolute;
          z-index: 6;
          top: -18%;
          right: 0;
          left: 0;
          height: 15%;
          background: linear-gradient(180deg, transparent, rgba(var(--ac1), .42), transparent);
          content: '';
          opacity: .52;
          animation: apx-scan 6.5s linear infinite;
          pointer-events: none;
        }

        .apx-photo {
          position: absolute;
          z-index: 3;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 51% center;
          filter: saturate(.88) contrast(1.08) brightness(.9);
          opacity: .48;
          transform: translate3d(var(--image-x), calc(var(--image-y) + 22px), 0) scale(1.14);
          transition:
            opacity 700ms ease 150ms,
            transform 1100ms cubic-bezier(.16, 1, .3, 1) 120ms;
          will-change: transform;
        }

        .apx-profile.is-visible .apx-photo {
          opacity: 1;
          transform: translate3d(var(--image-x), var(--image-y), 0) scale(1.055);
        }

        .apx-profile.is-settled .apx-photo {
          transition: transform 560ms cubic-bezier(.2, .75, .2, 1);
        }

        .apx-orbit {
          position: absolute;
          z-index: 2;
          top: 13%;
          left: 50%;
          width: 430px;
          height: 430px;
          border: 1px solid rgba(var(--ac2), .18);
          border-radius: 50%;
          transform: translateX(-50%);
          animation: apx-orbit 18s linear infinite;
        }

        .apx-orbit::before,
        .apx-orbit::after {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--ac);
          box-shadow: 0 0 18px rgba(var(--ac1), .8);
          content: '';
        }

        .apx-orbit::before { top: 38px; right: 78px; }
        .apx-orbit::after { bottom: 54px; left: 57px; opacity: .5; }

        .apx-portrait-top,
        .apx-portrait-bottom {
          position: absolute;
          z-index: 8;
          right: 28px;
          left: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          opacity: 0;
          transform: translate3d(0, 18px, 0);
          transition: opacity 500ms ease 420ms, transform 750ms cubic-bezier(.16, 1, .3, 1) 380ms;
        }

        .apx-profile.is-visible .apx-portrait-top,
        .apx-profile.is-visible .apx-portrait-bottom {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .apx-portrait-top { top: 28px; }
        .apx-portrait-bottom { bottom: 30px; align-items: flex-end; }

        .apx-system-label,
        .apx-location {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .64rem;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .apx-system-label { color: rgba(255, 255, 255, .62); }

        .apx-status {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, .16);
          border-radius: 999px;
          color: rgba(255, 255, 255, .84);
          background: rgba(5, 11, 18, .46);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .64rem;
          letter-spacing: .08em;
          backdrop-filter: blur(12px);
        }

        .apx-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #55db8a;
          box-shadow: 0 0 0 0 rgba(85, 219, 138, .55);
          animation: apx-pulse 2.4s ease-out infinite;
        }

        .apx-name p {
          margin: 0 0 8px;
          color: var(--ac);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .66rem;
          letter-spacing: .17em;
          text-transform: uppercase;
        }

        .apx-name-title {
          max-width: 340px;
          margin: 0;
          color: #f1f5fa;
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.55rem);
          font-weight: 700;
          line-height: 1.01;
          letter-spacing: -.05em;
        }

        .apx-location {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255, 255, 255, .58);
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }

        .apx-content {
          position: relative;
          display: flex;
          min-width: 0;
          flex-direction: column;
          padding: clamp(42px, 4.6vw, 68px) clamp(34px, 4.4vw, 64px) 0;
          background:
            radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(var(--ac1), .1), transparent 27%),
            var(--apx-panel);
        }

        .apx-content::before {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 29px;
          border-left: 1px dashed rgba(var(--ac2), .14);
          content: '';
        }

        .apx-content > * { position: relative; z-index: 1; }

        .apx-step {
          opacity: 0;
          transform: translate3d(0, 30px, 0);
          transition:
            opacity 560ms ease,
            transform 800ms cubic-bezier(.16, 1, .3, 1);
        }

        .apx-profile.is-visible .apx-step { opacity: 1; transform: translate3d(0, 0, 0); }
        .apx-profile.is-visible .apx-step:nth-child(1) { transition-delay: 220ms; }
        .apx-profile.is-visible .apx-step:nth-child(2) { transition-delay: 290ms; }
        .apx-profile.is-visible .apx-step:nth-child(3) { transition-delay: 360ms; }
        .apx-profile.is-visible .apx-step:nth-child(4) { transition-delay: 430ms; }
        .apx-profile.is-visible .apx-step:nth-child(5) { transition-delay: 500ms; }
        .apx-profile.is-visible .apx-step:nth-child(6) { transition-delay: 570ms; }

        .apx-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 22px;
          color: var(--ac);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .69rem;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .apx-eyebrow::before { width: 34px; height: 1px; background: var(--ac); content: ''; }

        .apx-title {
          max-width: 720px;
          margin: 0;
          color: var(--apx-ink);
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.9rem, 4.15vw, 4.5rem);
          font-weight: 800;
          line-height: .94;
          letter-spacing: -.065em;
        }

        .apx-title-line {
          display: block;
          overflow: hidden;
        }

        .apx-title-line > span {
          display: block;
          transform: translate3d(0, 112%, 0) skewY(3deg);
          transition: transform 900ms cubic-bezier(.16, 1, .3, 1) 300ms;
        }

        .apx-title-line:nth-child(2) > span { transition-delay: 390ms; }

        .apx-profile.is-visible .apx-title-line > span {
          transform: translate3d(0, 0, 0) skewY(0);
        }

        .apx-title-line-accent > span {
          color: transparent;
          background: linear-gradient(110deg, transparent 18%, rgba(var(--ac1), .7) 50%, transparent 82%);
          background-clip: text;
          background-size: 240% 100%;
          -webkit-background-clip: text;
          -webkit-text-stroke: 1px rgba(var(--ac2), .82);
          animation: apx-title-shine 4.8s ease-in-out infinite;
        }

        .apx-lead {
          max-width: 650px;
          margin: 24px 0 0;
          color: var(--apx-muted);
          font-size: clamp(.92rem, 1.15vw, 1.04rem);
          line-height: 1.72;
        }

        .apx-lead strong { color: var(--apx-ink); font-weight: 600; }

        .apx-role {
          display: grid;
          margin-top: 26px;
          padding: 15px 17px;
          grid-template-columns: 96px minmax(0, 1fr);
          align-items: center;
          gap: 3px 14px;
          border: 1px solid rgba(var(--ac2), .23);
          border-radius: 12px;
          background:
            radial-gradient(circle at 8% 50%, rgba(71, 193, 154, .1), transparent 27%),
            rgba(var(--ac1), .04);
        }

        .apx-role-logo {
          position: relative;
          display: grid;
          width: 96px;
          height: 46px;
          grid-row: 1 / span 2;
          place-items: center;
          overflow: hidden;
          border: 1px solid rgba(97, 225, 178, .22);
          border-radius: 9px;
          background: linear-gradient(145deg, #071b24, #0b2a30);
          box-shadow: inset 0 1px rgba(255, 255, 255, .05), 0 8px 22px rgba(3, 18, 23, .16);
        }

        .apx-role-logo::before {
          position: absolute;
          inset: -20%;
          background: radial-gradient(circle, rgba(67, 210, 158, .15), transparent 63%);
          content: '';
        }

        .apx-role-logo img {
          position: relative;
          z-index: 1;
          width: 78px;
          height: auto;
          object-fit: contain;
        }

        .apx-role small {
          color: var(--apx-faint);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .6rem;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .apx-role strong { font-size: .88rem; font-weight: 600; }

        .apx-stats {
          display: grid;
          margin-top: 26px;
          grid-template-columns: .8fr .8fr 1.2fr;
          border-top: 1px solid rgba(var(--ac2), .22);
          border-bottom: 1px solid rgba(var(--ac2), .22);
        }

        .apx-stat { padding: 21px 18px 19px 0; }
        .apx-stat + .apx-stat { padding-left: 21px; border-left: 1px solid rgba(var(--ac2), .2); }

        .apx-stat strong {
          display: block;
          min-height: 37px;
          margin-bottom: 5px;
          color: var(--apx-ink);
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.65rem, 2.5vw, 2.25rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .apx-stat strong em { color: var(--ac); font-style: normal; }

        .apx-stat span {
          color: var(--apx-faint);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .58rem;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .apx-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 22px;
          margin-top: auto;
          padding: 25px 0 22px;
        }

        .apx-tech {
          display: grid;
          width: min(360px, 100%);
          margin: 0;
          padding: 0;
          grid-template-columns: repeat(3, minmax(102px, 1fr));
          gap: 8px;
          list-style: none;
        }

        .apx-tech-card {
          position: relative;
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 9px;
          overflow: hidden;
          padding: 8px;
          border: 1px solid rgba(var(--ac2), .22);
          border-radius: 10px;
          background: linear-gradient(145deg, rgba(var(--ac1), .055), rgba(var(--ac1), .015));
          opacity: 0;
          transform: translate3d(0, 10px, 0) scale(.97);
          transition:
            opacity 420ms ease,
            transform 560ms cubic-bezier(.16, 1, .3, 1),
            border-color 180ms ease,
            box-shadow 180ms ease;
          transition-delay: calc(610ms + var(--tech-index) * 55ms);
        }

        .apx-tech-card::before {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(var(--tech-color), .16), transparent 60%);
          content: '';
          opacity: .58;
          pointer-events: none;
          transition: opacity 180ms ease;
        }

        .apx-profile.is-visible .apx-tech-card {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }

        .apx-profile.is-visible .apx-tech-card:hover {
          border-color: rgba(var(--tech-color), .55);
          box-shadow: 0 10px 26px rgba(var(--tech-color), .12);
          transform: translate3d(0, -3px, 0) scale(1.015);
        }

        .apx-profile.is-visible .apx-tech-card:hover::before { opacity: 1; }

        .apx-tech-icon {
          position: relative;
          z-index: 1;
          display: grid;
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          place-items: center;
          border: 1px solid rgba(var(--tech-color), .23);
          border-radius: 8px;
          background: #07121f;
          box-shadow: inset 0 1px rgba(255, 255, 255, .05);
        }

        .apx-tech-icon img {
          width: 17px;
          height: 17px;
          object-fit: contain;
        }

        .apx-tech-copy {
          position: relative;
          z-index: 1;
          display: grid;
          min-width: 0;
          gap: 1px;
        }

        .apx-tech-copy strong {
          overflow: hidden;
          color: var(--apx-ink);
          font-size: .68rem;
          font-weight: 600;
          line-height: 1.2;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .apx-tech-copy small {
          color: var(--apx-faint);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .48rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .apx-actions { display: flex; flex-shrink: 0; gap: 10px; }

        .apx-button {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 20px;
          border: 1px solid rgba(var(--ac2), .28);
          border-radius: 999px;
          color: var(--apx-ink);
          text-decoration: none;
          font-size: .76rem;
          font-weight: 600;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        .apx-button:hover { transform: translateY(-3px); }

        .apx-button-primary {
          border-color: transparent;
          color: var(--apx-button-text);
          background: linear-gradient(135deg, var(--ac-deep), var(--ac));
          box-shadow: 0 0 28px rgba(var(--ac-glow), .18);
        }

        .apx-button-primary:hover { box-shadow: 0 0 42px rgba(var(--ac-glow), .32); }
        .apx-button-ghost:hover { border-color: rgba(var(--ac2), .62); }

        .apx-proof {
          position: relative;
          z-index: 2;
          margin: 0 calc(clamp(34px, 4.4vw, 64px) * -1);
          overflow: hidden;
          border-top: 1px solid rgba(var(--ac2), .18);
          background: var(--apx-panel-strong);
        }

        .apx-proof-track {
          display: flex;
          width: max-content;
          align-items: center;
          animation: apx-marquee 24s linear infinite;
        }

        .apx-proof-group {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 14px 8px 14px 32px;
          color: var(--apx-faint);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .56rem;
          letter-spacing: .1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .apx-proof-group b { color: var(--apx-muted); font-weight: 500; }
        .apx-proof-group i { width: 3px; height: 3px; border-radius: 50%; background: var(--ac); }

        @keyframes apx-scan { to { top: 110%; } }
        @keyframes apx-pulse { 70% { box-shadow: 0 0 0 8px rgba(85, 219, 138, 0); } 100% { box-shadow: 0 0 0 0 rgba(85, 219, 138, 0); } }
        @keyframes apx-orbit { from { transform: translateX(-50%) rotate(0); } to { transform: translateX(-50%) rotate(360deg); } }
        @keyframes apx-title-shine { 0%, 18% { background-position: 100% 0; } 65%, 100% { background-position: -100% 0; } }
        @keyframes apx-marquee { to { transform: translateX(-50%); } }

        @media (prefers-reduced-motion: reduce) {
          .apx-kicker,
          .apx-profile,
          .apx-photo,
          .apx-portrait-top,
          .apx-portrait-bottom,
          .apx-step,
          .apx-tech-card,
          .apx-title-line > span {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .apx-shutters { display: none; }
          .apx-portrait::after,
          .apx-orbit,
          .apx-status-dot,
          .apx-title-line-accent > span,
          .apx-proof-track { animation: none !important; }
        }

        @media (max-width: 1080px) {
          .apx-profile { grid-template-columns: minmax(320px, .72fr) minmax(470px, 1.28fr); }
          .apx-content { padding-right: 38px; padding-left: 42px; }
          .apx-title { font-size: clamp(2.7rem, 4.5vw, 3.8rem); }
          .apx-bottom { align-items: flex-start; flex-direction: column; }
          .apx-tech { width: 100%; max-width: 430px; }
          .apx-actions { width: 100%; }
          .apx-button { flex: 1; }
        }

        @media (max-width: 860px) {
          .apx-profile { grid-template-columns: 1fr; }
          .apx-portrait {
            min-height: 620px;
            border-right: 0;
            border-bottom: 1px solid rgba(var(--ac2), .2);
          }
          .apx-content { padding: 48px 46px 0; }
          .apx-proof { margin-right: -46px; margin-left: -46px; }
        }

        @media (max-width: 767px) {
          .apx-section { padding: 76px 12px; }
          .apx-section::before { background-size: 48px 48px; }
          .apx-kicker { padding: 0 6px; }
          .apx-kicker span:last-child { display: none; }
          .apx-profile { min-height: auto; grid-template-columns: 1fr; border-radius: 16px; transform: perspective(900px) translate3d(0, 34px, 0) scale(.985); }
          .apx-portrait { min-height: 500px; border-right: 0; border-bottom: 1px solid rgba(var(--ac2), .2); }
          .apx-photo { object-position: 52% center; }
          .apx-orbit { top: 10%; width: 340px; height: 340px; }
          .apx-portrait-top, .apx-portrait-bottom { right: 20px; left: 20px; }
          .apx-portrait-top { top: 20px; }
          .apx-portrait-bottom { bottom: 23px; }
          .apx-location { display: none; }
          .apx-name-title { max-width: 280px; font-size: clamp(1.8rem, 8vw, 2.3rem); }
          .apx-content { padding: 35px 24px 0; }
          .apx-content::before { display: none; }
          .apx-title { max-width: 100%; font-size: clamp(2.4rem, 11.3vw, 3.3rem); }
          .apx-lead { margin-top: 20px; font-size: .91rem; }
          .apx-role { margin-top: 24px; }
          .apx-tech { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .apx-stats { grid-template-columns: 1fr; }
          .apx-stat, .apx-stat + .apx-stat { display: flex; align-items: baseline; justify-content: space-between; padding: 17px 0; border-left: 0; }
          .apx-stat + .apx-stat { border-top: 1px solid rgba(var(--ac2), .18); }
          .apx-stat strong { min-height: 0; margin: 0; }
          .apx-bottom { margin-top: 0; }
          .apx-actions { flex-direction: column; }
          .apx-proof { margin-right: -24px; margin-left: -24px; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="about"
        className="apx-section"
        style={themeStyles}
        aria-labelledby="about-preview-title"
      >
        <div className={`apx-kicker${isVisible ? " is-visible" : ""}`} aria-hidden="true">
          <span>Profile / 01</span>
          <span>Makassar — Indonesia</span>
        </div>

        <div
          ref={profileRef}
          className={`apx-profile${isVisible ? " is-visible" : ""}${isSettled ? " is-settled" : ""}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
        >
          <div className="apx-shutters" aria-hidden="true">
            <span className="apx-shutter" />
            <span className="apx-shutter" />
            <span className="apx-shutter" />
          </div>

          <div className="apx-portrait">
            <div className="apx-orbit" aria-hidden="true" />
            <img
              className="apx-photo"
              src={aboutImage}
              alt="Baso Rian Farhan Mallanti"
              loading="lazy"
              decoding="async"
            />

            <div className="apx-portrait-top">
              <span className="apx-system-label">Subject / BRFM</span>
              <span className="apx-status"><i className="apx-status-dot" aria-hidden="true" />Open to work</span>
            </div>

            <div className="apx-portrait-bottom">
              <div className="apx-name">
                <p>Full-stack &amp; mobile engineer</p>
                <div className="apx-name-title">Baso Rian<br />Farhan Mallanti</div>
              </div>
              <span className="apx-location"><MapPin size={12} aria-hidden="true" /> Makassar — ID</span>
            </div>
          </div>

          <div className="apx-content">
            <p className="apx-eyebrow apx-step">Profile overview</p>
            <h2 className="apx-title apx-step" id="about-preview-title">
              <span className="apx-title-line"><span>I build products</span></span>
              <span className="apx-title-line apx-title-line-accent"><span>end-to-end.</span></span>
            </h2>

            <p className="apx-lead apx-step">
              I design and build digital products from the interface to the systems behind it.
              My work spans <strong>web and mobile</strong> applications used by real businesses,
              institutions, and people.
            </p>

            <div className="apx-role apx-step">
              <span className="apx-role-logo">
                <img src={carbonEthicsLogo} alt="CarbonEthics" width="249" height="69" loading="lazy" />
              </span>
              <small>Currently building at</small>
              <strong>CarbonEthics &mdash; Fullstack Developer Associate Manager</strong>
            </div>

            <div className="apx-stats apx-step" role="group" aria-label="Experience summary">
              {stats.map(({ value, suffix, label }) => (
                <div className="apx-stat" key={label}>
                  <strong><CountUp to={value} suffix={suffix} active={isVisible} /></strong>
                  <span>{label}</span>
                </div>
              ))}
              <div className="apx-stat"><strong>Web <em>+</em> Mobile</strong><span>Full product range</span></div>
            </div>

            <div className="apx-bottom apx-step">
              <ul className="apx-tech" aria-label="Core technologies">
                {technologies.map((technology, index) => (
                  <li
                    className="apx-tech-card"
                    key={technology.name}
                    style={{ "--tech-color": technology.color, "--tech-index": index }}
                  >
                    <span className="apx-tech-icon" aria-hidden="true">
                      <img src={technology.icon} alt="" width="17" height="17" loading="lazy" />
                    </span>
                    <span className="apx-tech-copy">
                      <strong>{technology.name}</strong>
                      <small>{technology.category}</small>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="apx-actions">
                <Link to="/projects" className="apx-button apx-button-primary">Explore Projects <ArrowRight size={15} aria-hidden="true" /></Link>
                <Link to="/about" className="apx-button apx-button-ghost">About Me</Link>
              </div>
            </div>

            <div className="apx-proof" aria-label="Selected employers and clients">
              <div className="apx-proof-track">
                {[0, 1].map((copy) => (
                  <div className="apx-proof-group" key={copy} aria-hidden={copy === 1}>
                    <span>Selected proof</span>
                    {proofItems.map((item) => (
                      <span key={item} style={{ display: "contents" }}><i aria-hidden="true" /><b>{item}</b></span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
