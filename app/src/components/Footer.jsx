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

  const txt = isDark ? "#f0f4ff" : "#0a1230";
  const muted = isDark ? "rgba(220,230,255,0.45)" : "rgba(10,18,48,0.45)";
  const muted2 = isDark ? "rgba(220,230,255,0.25)" : "rgba(10,18,48,0.28)";

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
