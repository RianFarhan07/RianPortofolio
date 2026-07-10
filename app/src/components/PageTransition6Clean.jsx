import { useEffect, useRef, useState, createContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

/*
  INTRO VARIANTS (all 3000ms animation + 700ms exit):
  "pulse"      : Gradient → RF circle + ring wave → staggered text → progress
  "typewriter" : Name typed char-by-char with bounce cursor → title reveals
  "cards"      : 3 glass cards flip in with depth → stack & fade
  "particles"  : 60 particles converge → form RF → burst → text fades in
  "countdown"  : 3..2..1 ring-wave countdown → name reveal with glow

  PAGE TRANSITION VARIANTS:
  "curtain-reveal" | "flip-card" | "radial-expand" | "slide-strips"
*/

export const IntroContext = createContext({ 
  introExited: true, 
  pageTransitionDone: true,
  INTRO_DURATION: 3000, 
  PAGE_TRANSITION_DURATION: 1200 
});

const personalInfo = {
  name: "Baso Rian Farhan Mallanti",
  title: "FullStack Developer",
  origin: "Makassar, Indonesia",
  initials: "RF",
  tagline: "I build websites that just work — beautifully.",
};
function getPageName(p) { const m = { "/": "Home", "/about": "About", "/projects": "Projects", "/certificates": "Certificates", "/contact": "Contact" }; return m[p] || "Loading..."; }
function getPageCode(p) { const m = { "/": "01", "/about": "02", "/projects": "03", "/certificates": "04", "/contact": "05" }; return m[p] || "--"; }

const A = "var(--ac)";
const AD = "var(--ac-deep)";
const AR = "var(--ac1)";

const INTRO_DURATION = 3000;
const INTRO_EXIT = 700;
const PAGE_TRANSITION_DURATION = 1200;
const D = INTRO_DURATION / 1000; // 3.0

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function PageTransition6Clean({ children, variant = "slide-strips", introVariant = "random" }) {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const INTRO_POOL = ["pulse", "typewriter", "cards", "particles", "countdown"];
  const pickedRef = useRef(introVariant === "random" ? INTRO_POOL[Math.floor(Math.random() * INTRO_POOL.length)] : introVariant);
  const activeIntroVariant = introVariant === "random" ? pickedRef.current : introVariant;

  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [introExited, setIntroExited] = useState(false);
  const [isPageTransition, setIsPageTransition] = useState(false);
  const pageTransitionDone = !isPageTransition;
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    if (showIntro) {
      const t = setTimeout(() => { setShowIntro(false); setIsInitialRender(false); }, INTRO_DURATION);
      return () => clearTimeout(t);
    }
  }, [showIntro]);

  useEffect(() => {
    const t2 = setTimeout(() => setIntroExited(true), INTRO_DURATION);
    return () => clearTimeout(t2);
  }, []);

  useEffect(() => {
    if (isInitialRender) return;
    if (previousPathRef.current !== pathname) {
      setIsPageTransition(true);
      const t = setTimeout(() => setIsPageTransition(false), PAGE_TRANSITION_DURATION);
      previousPathRef.current = pathname;
      return () => clearTimeout(t);
    }
  }, [pathname, isInitialRender]);

  const renderIntro = () => {
    const p = { isDark };
    switch (activeIntroVariant) {
      case "typewriter": return <IntroTypewriter key="i" {...p} />;
      case "cards":      return <IntroCards key="i" {...p} />;
      case "particles":  return <IntroParticles key="i" {...p} />;
      case "countdown":  return <IntroCountdown key="i" {...p} />;
      default:           return <IntroPulse key="i" {...p} />;
    }
  };

  const renderTransition = () => {
    if (isInitialRender || !isPageTransition) return null;
    const p = { pathname, isDark, pageName: getPageName(pathname), pageCode: getPageCode(pathname) };
    switch (variant) {
      case "flip-card":      return <FlipCardTransition key={pathname} {...p} />;
      case "radial-expand":  return <RadialExpandTransition key={pathname} {...p} />;
      case "slide-strips":   return <SlideStripsTransition key={pathname} {...p} />;
      default:               return <CurtainRevealTransition key={pathname} {...p} />;
    }
  };

  return (
    <IntroContext.Provider value={{ introExited, pageTransitionDone, INTRO_DURATION, PAGE_TRANSITION_DURATION }}>
      <div className="relative" style={{ overflowX: "clip" }}>
        {children}
        <AnimatePresence>{showIntro && renderIntro()}</AnimatePresence>
        <AnimatePresence mode="wait">{renderTransition()}</AnimatePresence>
      </div>
    </IntroContext.Provider>
  );
}

function IntroWrap({ children, isDark }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: INTRO_EXIT / 1000, ease: "easeInOut" } }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   INTRO #1 — PULSE (polished)
   Gradient bg → RF circle + 3 expanding rings → staggered text → progress bar
   ═══════════════════════════════════════════════════════════ */
function IntroPulse({ isDark }) {
  const bgEnd = isDark ? "#020817" : "#eef2ff";
  const muted = isDark ? "rgba(255,255,255,0.5)" : "rgba(16,35,63,0.5)";
  return (
    <IntroWrap>
      {/* Gradient background */}
      <motion.div className="absolute inset-0"
        style={{ background: isDark
          ? `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(${AR}, 0.35) 0%, rgba(${AR}, 0.15) 25%, ${bgEnd} 100%)`
          : `radial-gradient(ellipse 70% 60% at 50% 40%, ${A} 0%, ${AD} 45%, ${bgEnd} 100%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0.3], transition: { duration: D, times: [0, 0.15, 0.85, 1], ease: "easeOut" } }}
      />

      {/* Expanding pulse rings */}
      {[0, 1, 2].map(i => (
        <motion.div key={`pr-${i}`}
          className="absolute rounded-full border-2 pointer-events-none"
          style={{ borderColor: `rgba(${AR}, ${0.5 - i * 0.15})`, width: 20, height: 20, boxShadow: `0 0 ${20 + i * 10}px rgba(${AR}, 0.3)` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 8 + i * 4], opacity: [0.8, 0], transition: { duration: 1.2, delay: 0.15 + i * 0.2, ease: "easeOut" } }}
        />
      ))}

      {/* RF Logo */}
      <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: `linear-gradient(135deg, ${A}, ${AD})`, boxShadow: `0 0 80px rgba(${AR}, 0.5), 0 0 120px rgba(${AR}, 0.2)` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.18, 0.92, 1.04, 0.98, 1, 1, 1, 1, 0.8],
          opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
          transition: { duration: D, times: [0, 0.08, 0.14, 0.2, 0.25, 0.55, 0.72, 0.85, 0.9, 1], ease: "easeInOut" },
        }}>
        <span className="text-white text-2xl font-bold">{personalInfo.initials}</span>
      </motion.div>

      {/* Name — 1st */}
      <motion.div className="text-3xl md:text-5xl font-bold tracking-tight mt-5 mb-1"
        style={{ fontFamily: "'Syne', sans-serif", color: "#fff", textShadow: "0 0 30px rgba(0,0,0,0.4)" }}
        initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
        animate={{
          opacity: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          y: [14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, -6],
          filter: ["blur(4px)","blur(4px)","blur(0px)","blur(0px)","blur(0px)","blur(0px)","blur(0px)","blur(0px)","blur(0px)","blur(0px)","blur(0px)","blur(2px)"],
          transition: { duration: D, times: [0, 0.06, 0.13, 0.3, 0.45, 0.55, 0.65, 0.72, 0.78, 0.82, 0.88, 1], ease: "easeOut" },
        }}>
        {personalInfo.name}
      </motion.div>

      {/* Title — 2nd */}
      <motion.div className="text-lg md:text-xl font-light"
        style={{ color: "#fff", textShadow: "0 0 16px rgba(0,0,0,0.3)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
          y: [10, 10, 10, 0, 0, 0, 0, 0, 0, 0, -5],
          transition: { duration: D, times: [0, 0.12, 0.18, 0.28, 0.45, 0.55, 0.65, 0.72, 0.82, 0.88, 1], ease: "easeOut" },
        }}>
        {personalInfo.title}
      </motion.div>

      {/* Origin — 3rd */}
      <motion.div className="text-sm tracking-wider"
        style={{ color: "rgba(255,255,255,0.5)" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
          transition: { duration: D, times: [0, 0.24, 0.3, 0.35, 0.45, 0.55, 0.65, 0.72, 0.82, 1], ease: "easeOut" },
        }}>
        {personalInfo.origin}
      </motion.div>

      {/* Tagline — 4th */}
      <motion.div className="text-sm mt-1 max-w-xs text-center leading-relaxed"
        style={{ color: "rgba(255,255,255,0.65)" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0, 0, 0, 0, 1, 1, 1, 0],
          transition: { duration: D, times: [0, 0.36, 0.4, 0.44, 0.48, 0.55, 0.65, 0.72, 1], ease: "easeOut" },
        }}>
        {personalInfo.tagline}
      </motion.div>

      {/* Progress bar */}
      <motion.div className="absolute bottom-16 w-48 h-0.5 rounded-full overflow-hidden"
        style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(16,35,63,0.08)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0], transition: { duration: D, times: [0, 0.7, 0.78, 0.94, 1] } }}>
        <motion.div className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${A}, ${AD})` }}
          initial={{ width: "0%" }}
          animate={{ width: "100%", transition: { duration: D * 0.18, delay: 0.72, ease: "easeInOut" } }} />
      </motion.div>

      {/* Floating dots */}
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div key={`pd-${i}`} className="absolute rounded-full"
          style={{ width: `${2 + Math.random() * 3}px`, height: `${2 + Math.random() * 3}px`, background: A,
            left: `${15 + Math.random() * 70}%`, top: `${15 + Math.random() * 70}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.5, 0.5],
            transition: { duration: D * 0.7, delay: 0.2 + Math.random() * 0.5, ease: "easeInOut", repeat: 1 } }} />
      ))}
    </IntroWrap>
  );
}

/* ═══════════════════════════════════════════════════════════
   INTRO #2 — TYPEWRITER (polished)
   Name typed char-by-char with rAF → cursor bounce → title reveals with stagger
   ═══════════════════════════════════════════════════════════ */
function IntroTypewriter({ isDark }) {
  const bgEnd = isDark ? "#020817" : "#eef2ff";
  const txt = isDark ? "#fff" : "#10233f";
  const nameChars = [...personalInfo.name];
  const [visible, setVisible] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    let idx = 0;
    const target = nameChars.length;
    const total = 1600; // typing takes 1.6s
    const frame = () => {
      const elapsed = performance.now() - startRef.current;
      const progress = Math.min(elapsed / total, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const next = Math.floor(eased * target);
      if (next > idx) { idx = next; setVisible(idx); }
      if (progress < 1) { rafRef.current = requestAnimationFrame(frame); }
      else { setVisible(target); setTypingDone(true); }
    };
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const titleWords = personalInfo.title.split(" ");

  return (
    <IntroWrap>
      <motion.div className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${AD} 0%, ${bgEnd} 80%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      />

      {/* Name — typed */}
      <div className="relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-center px-4"
          style={{ fontFamily: "'Syne', sans-serif", color: txt }}>
          {nameChars.map((ch, i) => (
            <motion.span key={i}
              initial={{ opacity: 0.12 }}
              animate={{ opacity: i < visible ? 1 : 0.12, color: i < visible ? txt : `rgba(${AR}, 0.2)` }}
              transition={{ duration: 0.08 }}>
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
          {/* Cursor — bounces after typing done */}
          <motion.span className="inline-block align-middle ml-0.5"
            style={{ width: "3px", height: "1.1em", background: A, borderRadius: "1px" }}
            animate={typingDone
              ? { opacity: [1, 0, 1, 0], transition: { duration: 0.7, repeat: 2 } }
              : { opacity: [1, 0, 1, 0], transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse" } }} />
        </h1>
      </div>

      {/* Title — stagger per word */}
      <div className="flex flex-wrap justify-center gap-x-2.5 mt-3">
        {titleWords.map((word, i) => (
          <motion.span key={i} className="text-lg md:text-xl font-light"
            style={{ color: A }}
            initial={{ opacity: 0, y: 8 }}
            animate={typingDone ? { opacity: [0, 1, 1, 0], y: [8, 0, 0, -6],
              transition: { duration: D * 0.45, delay: 0.25 + i * 0.1, times: [0, 0.3, 0.85, 1], ease: "easeOut" } } : {}}>
            {word}
          </motion.span>
        ))}
      </div>

      {/* Decorative dots — sequential fill */}
      <div className="flex gap-3 mt-6">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
            style={{ background: A }}
            initial={{ opacity: 0.15, scale: 0.6 }}
            animate={typingDone ? { opacity: [0.15, 1, 0.15], scale: [0.6, 1.3, 0.6],
              transition: { duration: 0.9, delay: 0.4 + i * 0.15, repeat: 1, ease: "easeInOut" } } : {}} />
        ))}
      </div>

      {/* Progress bar at bottom */}
      <motion.div className="absolute bottom-16 w-48 h-0.5 rounded-full overflow-hidden"
        style={{ background: `rgba(${AR}, 0.12)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0], transition: { duration: D, times: [0, 0.15, 0.78, 1], delay: 0.72 } }}>
        <motion.div className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${A}, ${AD})` }}
          initial={{ width: "0%" }}
          animate={{ width: "100%", transition: { duration: D * 0.5, delay: 0.78, ease: [0.4, 0, 0.2, 1] } }} />
      </motion.div>
    </IntroWrap>
  );
}

/* ═══════════════════════════════════════════════════════════
   INTRO #3 — CARDS (polished)
   3 glass cards flip in with depth, glass morphism, spring timing
   ═══════════════════════════════════════════════════════════ */
function IntroCards({ isDark }) {
  const bgEnd = isDark ? "#020817" : "#eef2ff";
  const txt = isDark ? "#fff" : "#10233f";
  const glassBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const glassBorder = `rgba(${AR}, 0.3)`;
  return (
    <IntroWrap>
      <motion.div className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% 35%, ${AD} 0%, ${bgEnd} 90%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      />

      <div className="flex flex-col items-center gap-5" style={{ perspective: "1400px" }}>
        {/* Card 1 — RF Logo — flips in from left */}
        <motion.div className="w-28 h-28 rounded-[22px] flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${A}, ${AD})`,
            boxShadow: `0 25px 60px rgba(${AR}, 0.35), 0 0 80px rgba(${AR}, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
          initial={{ rotateY: -100, opacity: 0, scale: 0.8 }}
          animate={{ rotateY: [-100, 8, -3, 0, 0, 105], opacity: [0, 1, 1, 1, 1, 0], scale: [0.8, 1.03, 0.98, 1, 1, 0.85],
            transition: { times: [0, 0.12, 0.2, 0.3, 0.75, 1], duration: D, ease: "easeInOut" } }}>
          {/* Inner glass reflection */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)" }} />
          <span className="relative text-white text-3xl font-bold drop-shadow-lg">{personalInfo.initials}</span>
        </motion.div>

        {/* Card 2 — Name — flips in from right */}
        <motion.div className="px-8 py-4 rounded-2xl backdrop-blur-md relative overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${glassBg}, rgba(255,255,255,0.02))`, border: `1px solid ${glassBorder}`, boxShadow: `0 15px 40px rgba(${AR}, 0.08)` }}
          initial={{ rotateY: 100, opacity: 0, scale: 0.85 }}
          animate={{ rotateY: [100, -6, 2, 0, 0, -100], opacity: [0, 1, 1, 1, 1, 0], scale: [0.85, 1.02, 0.99, 1, 1, 0.85],
            transition: { times: [0, 0.18, 0.26, 0.36, 0.75, 1], duration: D, delay: 0.04, ease: "easeInOut" } }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
          <h1 className="relative text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif", color: txt }}>
            {personalInfo.name}
          </h1>
        </motion.div>

        {/* Card 3 — Title + Origin — flips from bottom */}
        <motion.div className="px-6 py-3 rounded-2xl backdrop-blur-md text-center relative overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${glassBg}, rgba(255,255,255,0.01))`, border: `1px solid ${glassBorder}`, boxShadow: `0 15px 40px rgba(${AR}, 0.06)` }}
          initial={{ rotateX: -100, opacity: 0, scale: 0.85 }}
          animate={{ rotateX: [-100, 6, -2, 0, 0, 100], opacity: [0, 1, 1, 1, 1, 0], scale: [0.85, 1.02, 0.99, 1, 1, 0.85],
            transition: { times: [0, 0.25, 0.33, 0.43, 0.75, 1], duration: D, delay: 0.08, ease: "easeInOut" } }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 60%)" }} />
          <p className="relative text-base md:text-lg font-light" style={{ color: A }}>{personalInfo.title}</p>
          <p className="relative text-xs mt-1 opacity-50 tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(16,35,63,0.4)" }}>{personalInfo.origin}</p>
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <motion.p className="absolute bottom-16 text-xs tracking-[0.2em] uppercase" style={{ color: A }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.65, 0.65, 0], transition: { duration: D, times: [0, 0.48, 0.78, 1], delay: 0.15 } }}>
        {personalInfo.tagline}
      </motion.p>
    </IntroWrap>
  );
}

/* ═══════════════════════════════════════════════════════════
   INTRO #4 — PARTICLES (polished)
   60 particles terbang dari pinggir → nyatu jadi lingkaran → lingkaran bubar
   ═══════════════════════════════════════════════════════════ */
function IntroParticles({ isDark }) {
  const bgEnd = isDark ? "#020817" : "#eef2ff";
  const txt = isDark ? "#fff" : "#10233f";
  const COUNT = 60;
  const CIRCLE_R = 100; // radius lingkaran saat partikel nyatu
  const particles = Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2;
    const startDist = 350 + Math.random() * 450;
    const cx = Math.cos(angle) * CIRCLE_R; // posisi di lingkaran
    const cy = Math.sin(angle) * CIRCLE_R;
    const burstAngle = angle + (Math.random() - 0.5) * 0.4;
    const burstDist = CIRCLE_R + 300 + Math.random() * 400;
    return {
      id: i,
      sx: Math.cos(angle) * startDist,
      sy: Math.sin(angle) * startDist,
      cx, cy, // posisi di lingkaran
      bx: Math.cos(burstAngle) * burstDist,
      by: Math.sin(burstAngle) * burstDist,
      size: 2 + Math.random() * 3.5,
    };
  });

  return (
    <IntroWrap>
      <motion.div className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(${AR}, 0.1) 0%, ${bgEnd} 75%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.6 } }}
      />

      {/* Particle field */}
      {particles.map((p) => (
        <motion.div key={`pt-${p.id}`} className="absolute rounded-full"
          style={{
            width: `${p.size}px`, height: `${p.size}px`,
            background: p.id % 3 === 0 ? A : p.id % 3 === 1 ? AD : `rgba(${AR}, 0.75)`,
            boxShadow: `0 0 ${4 + p.size * 3}px rgba(${AR}, 0.6)`,
          }}
          initial={{ x: p.sx, y: p.sy, opacity: 0, scale: 0 }}
          animate={{
            // Phase 1: terbang dari pinggir → nyatu jadi lingkaran (0→0.28)
            // Phase 2: lingkaran hold rotate dikit  (0.28→0.55)
            // Phase 3: lingkaran bubar pecah        (0.55→0.82)
            // Phase 4: fade out                     (0.82→1)
            x: [p.sx, p.cx, p.cx, p.bx],
            y: [p.sy, p.cy, p.cy, p.by],
            opacity: [0, 0.9, 0.9, 0],
            scale: [0, 1, 1, 0],
            transition: { duration: D, times: [0, 0.28, 0.55, 1], delay: Math.random() * 0.1, ease: "easeInOut" },
          }} />
      ))}

      {/* Ring glow outline saat lingkaran terbentuk */}
      <motion.div className="absolute rounded-full border-2 pointer-events-none"
        style={{ width: CIRCLE_R * 2, height: CIRCLE_R * 2, borderColor: `rgba(${AR}, 0.5)`, boxShadow: `0 0 60px rgba(${AR}, 0.3), inset 0 0 60px rgba(${AR}, 0.1)` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 0, 1.05, 1, 1, 1.6],
          opacity: [0, 0, 0.7, 0.7, 0.5, 0],
          transition: { duration: D, times: [0, 0.22, 0.3, 0.52, 0.6, 1], ease: "easeOut" },
        }} />

      {/* Center glow saat partikel nyatu */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: CIRCLE_R * 0.6, height: CIRCLE_R * 0.6, background: `radial-gradient(circle, ${A} 0%, ${AD} 60%, transparent 90%)` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 0, 1.5, 1, 0],
          opacity: [0, 0, 0.8, 0.5, 0],
          transition: { duration: D, times: [0, 0.26, 0.35, 0.55, 1], ease: "easeOut" },
        }} />

      {/* RF Logo muncul di tengah lingkaran */}
      <motion.div className="rounded-full flex items-center justify-center"
        style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${A}, ${AD})`, boxShadow: `0 0 80px rgba(${AR}, 0.5)` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 0, 0, 1.2, 0.95, 1, 0.6],
          opacity: [0, 0, 0, 1, 1, 1, 0],
          transition: { duration: D, times: [0, 0.28, 0.35, 0.42, 0.5, 0.7, 1], ease: "easeOut" },
        }}>
        <span className="text-white text-xl font-bold">{personalInfo.initials}</span>
      </motion.div>

      {/* Text fade in setelah lingkaran stabil */}
      <motion.h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-5"
        style={{ fontFamily: "'Syne', sans-serif", color: txt, textShadow: isDark ? `0 0 40px rgba(${AR}, 0.4)` : undefined }}
        initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
        animate={{ opacity: [0, 0, 0, 1, 1, 0], y: [16, 16, 16, 0, 0, -8], filter: ["blur(4px)", "blur(4px)", "blur(4px)", "blur(0px)", "blur(0px)", "blur(2px)"],
          transition: { duration: D, times: [0, 0.32, 0.4, 0.5, 0.72, 1], ease: "easeOut" } }}>
        {personalInfo.name}
      </motion.h1>

      <motion.p className="text-lg md:text-xl font-light mt-2"
        style={{ color: A }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 0, 0, 1, 1, 0], y: [10, 10, 10, 0, 0, -6],
          transition: { duration: D, times: [0, 0.38, 0.45, 0.55, 0.72, 1], ease: "easeOut" } }}>
        {personalInfo.title}
      </motion.p>
    </IntroWrap>
  );
}

/* ═══════════════════════════════════════════════════════════
   INTRO #5 — COUNTDOWN (polished)
   3..2..1 with ring-wave + glow → name reveal with scale
   ═══════════════════════════════════════════════════════════ */
function IntroCountdown({ isDark }) {
  const bgEnd = isDark ? "#020817" : "#eef2ff";
  const txt = isDark ? "#fff" : "#10233f";
  const countNumColor = isDark ? "#fff" : "#10233f";
  const numStyle = {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "clamp(8rem, 20vw, 16rem)",
    lineHeight: 1,
    color: countNumColor,
    textShadow: isDark ? `0 0 60px rgba(${AR}, 0.7), 0 0 120px rgba(${AR}, 0.3)` : undefined,
  };

  const stepDur = D * 0.22; // ~660ms per number

  // Ring wave keyframes for each number
  const ringVariant = (delay) => ({
    initial: { scale: 0, opacity: 0 },
    animate: { scale: [0, 3], opacity: [0.6, 0], transition: { duration: stepDur * 1.5, delay, ease: "easeOut" } },
  });

  const numVariant = (delay) => ({
    initial: { scale: 2.5, opacity: 0 },
    animate: { scale: [2.5, 0.85, 1.05, 0.95, 1, 0.7], opacity: [0, 1, 1, 1, 1, 0],
      transition: { duration: stepDur * 1.6, times: [0, 0.15, 0.3, 0.45, 0.6, 1], delay, ease: "easeOut" } },
  });

  return (
    <IntroWrap>
      <motion.div className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 65% 55% at 50% 45%, ${AD} 0%, ${bgEnd} 100%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      />

      {/* Number 3 */}
      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div className="absolute rounded-full border-2 pointer-events-none"
          style={{ borderColor: `rgba(${AR}, 0.4)`, width: 40, height: 40, boxShadow: `0 0 30px rgba(${AR}, 0.3)` }}
          {...ringVariant(0.05)} />
        <motion.div className="absolute" style={numStyle} {...numVariant(0)}>3</motion.div>
      </motion.div>

      {/* Number 2 */}
      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div className="absolute rounded-full border-2 pointer-events-none"
          style={{ borderColor: `rgba(${AR}, 0.35)`, width: 40, height: 40, boxShadow: `0 0 25px rgba(${AR}, 0.25)` }}
          {...ringVariant(stepDur + 0.05)} />
        <motion.div className="absolute" style={numStyle} {...numVariant(stepDur)}>2</motion.div>
      </motion.div>

      {/* Number 1 */}
      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div className="absolute rounded-full border-2 pointer-events-none"
          style={{ borderColor: `rgba(${AR}, 0.3)`, width: 40, height: 40, boxShadow: `0 0 20px rgba(${AR}, 0.2)` }}
          {...ringVariant(stepDur * 2 + 0.05)} />
        <motion.div className="absolute" style={numStyle} {...numVariant(stepDur * 2)}>1</motion.div>
      </motion.div>

      {/* Name reveal — starts after countdown (~stepDur*3 = 1.98s) */}
      <motion.div className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 1, 1, 0], transition: { duration: D, times: [0, 0.63, 0.7, 0.82, 0.93, 1] } }}>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif", color: txt, textShadow: isDark ? `0 0 35px rgba(${AR}, 0.5)` : undefined }}>
          {personalInfo.name}
        </h1>
        <p className="text-lg md:text-xl font-light mt-2" style={{ color: A }}>{personalInfo.title}</p>
        <p className="text-sm mt-1 opacity-50 tracking-wide" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(16,35,63,0.4)" }}>{personalInfo.origin}</p>
      </motion.div>
    </IntroWrap>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE TRANSITIONS
   ═══════════════════════════════════════════════════════════ */

function CurtainRevealTransition({ pathname, isDark, pageName, pageCode }) {
  const dur = 1.4;
  return (
    <motion.div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      <motion.div className="absolute top-0 left-0 h-full"
        style={{ width: "52%", background: `linear-gradient(135deg, ${AD} 0%, ${A} 100%)` }}
        initial={{ x: "0%" }}
        animate={{ x: ["0%", "-105%"], transition: { duration: dur, times: [0, 1], ease: [0.83, 0, 0.17, 1] } }} />
      <motion.div className="absolute top-0 right-0 h-full"
        style={{ width: "52%", background: `linear-gradient(225deg, ${AD} 0%, ${A} 100%)` }}
        initial={{ x: "0%" }}
        animate={{ x: ["0%", "105%"], transition: { duration: dur, times: [0, 1], ease: [0.83, 0, 0.17, 1] } }} />
      <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full"
        style={{ background: `rgba(${AR}, 0.8)`, boxShadow: `0 0 40px 10px rgba(${AR}, 0.5)` }}
        initial={{ scaleY: 0, opacity: 1 }}
        animate={{ scaleY: [0, 1, 1, 0], opacity: [1, 0.8, 0.8, 0], transition: { duration: dur * 0.7, times: [0, 0.08, 0.6, 1], ease: "easeOut" } }} />
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0], transition: { duration: dur, times: [0, 0.35, 0.8, 1] } }}>
        <motion.div className="text-sm tracking-[0.3em] uppercase" style={{ color: A, fontFamily: "'DM Sans', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -15], transition: { duration: dur, times: [0, 0.4, 0.8, 1], delay: 0.05, ease: "easeOut" } }}>[{pageCode}]</motion.div>
        <motion.h1 className="text-6xl md:text-8xl font-bold tracking-tight mt-2"
          style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#fff" : "#10233f", textShadow: isDark ? `0 0 50px rgba(${AR}, 0.4)` : undefined }}
          initial={{ opacity: 0, y: 40, scale: 0.85 }}
          animate={{ opacity: [0, 1, 1, 0], y: [40, 0, 0, -20], scale: [0.85, 1, 1, 0.85], transition: { duration: dur, times: [0, 0.42, 0.78, 1], delay: 0.1, ease: "easeOut" } }}>{pageName}</motion.h1>
        <motion.div className="flex items-center gap-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -15], transition: { duration: dur, times: [0, 0.45, 0.78, 1], delay: 0.18, ease: "easeOut" } }}>
          <div className="w-10 h-px" style={{ background: A }} />
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: A, fontFamily: "'DM Sans', sans-serif" }}>{pathname === "/" ? "Welcome" : pathname.replace("/", "")} — portfolio 2025</span>
          <div className="w-10 h-px" style={{ background: A }} />
        </motion.div>
      </motion.div>
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div key={`cp-${i}`} className="absolute rounded-full pointer-events-none"
          style={{ background: `rgba(${AR}, 0.4)`, width: `${4 + Math.random() * 8}px`, height: `${4 + Math.random() * 8}px`, left: `${20 + Math.random() * 60}%`, top: `${10 + Math.random() * 80}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0], transition: { duration: dur * 0.8, delay: i * 0.04 + 0.1, ease: "easeOut" } }} />
      ))}
    </motion.div>
  );
}

function FlipCardTransition({ pathname, isDark, pageName, pageCode }) {
  const dur = 1.3;
  const bg = isDark ? "#020817" : "#eef2ff";
  return (
    <motion.div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center" style={{ perspective: "1500px" }}>
      <motion.div className="absolute inset-0" style={{ background: bg }}
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.92, 0.92, 0], transition: { times: [0, 0.08, 0.92, 1], duration: dur, ease: "easeInOut" } }} />
      <motion.div className="relative flex flex-col items-center justify-center border rounded-2xl overflow-hidden"
        style={{ width: "min(560px, 75vw)", height: "min(360px, 45vh)", background: `linear-gradient(145deg, ${bg}, ${isDark ? "rgba(0,180,255,0.04)" : "rgba(20,184,166,0.04)"})`, borderColor: `rgba(${AR}, 0.25)`, boxShadow: `0 30px 80px rgba(${AR}, 0.15), 0 0 100px rgba(${AR}, 0.08)` }}
        initial={{ rotateY: -90, opacity: 0, scale: 0.9 }}
        animate={{ rotateY: [-90, 10, -5, 0, 0, 90], opacity: [0, 1, 1, 1, 1, 0], scale: [0.9, 1.02, 0.98, 1, 1, 0.9], transition: { times: [0, 0.15, 0.25, 0.4, 0.75, 1], duration: dur, ease: "easeInOut" } }}>
        {[{ t: -2, l: -2, br: "border-r border-b" }, { t: -2, r: -2, bl: "border-l border-b" }, { b: -2, l: -2, tr: "border-r border-t" }, { b: -2, r: -2, tl: "border-l border-t" }].map((s, i) => (
          <motion.div key={i} className={`absolute w-8 h-8 ${s.br || ""} ${s.bl || ""} ${s.tr || ""} ${s.tl || ""}`}
            style={{ top: s.t, left: s.l, right: s.r, bottom: s.b, borderColor: `rgba(${AR}, 0.35)`, borderWidth: 1 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0.6, 0], scale: [0, 1, 1, 0], transition: { times: [0, 0.25, 0.7, 1], duration: dur, delay: i * 0.03 } }} />
        ))}
        <motion.p className="text-xs tracking-[0.35em] uppercase" style={{ color: A, fontFamily: "'DM Sans', sans-serif" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -10], transition: { duration: dur, times: [0, 0.3, 0.75, 1], delay: 0.08 } }}>{pageCode} — {pageName}</motion.p>
        <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-2"
          style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#fff" : "#10233f", textShadow: isDark ? `0 0 40px rgba(${AR}, 0.4)` : undefined }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -15], scale: [0.9, 1, 1, 0.9], transition: { duration: dur, times: [0, 0.32, 0.72, 1], delay: 0.12, ease: "easeOut" } }}>{pageName}</motion.h1>
        <motion.div className="flex gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], transition: { duration: dur, times: [0, 0.35, 0.75, 1], delay: 0.2 } }}>
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: A }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 1, 0.2], transition: { duration: 0.6, delay: i * 0.1, repeat: 2, ease: "easeInOut" } }} />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function RadialExpandTransition({ pathname, isDark, pageName, pageCode }) {
  const dur = 1.4;
  const bg = isDark ? "#020817" : "#f8fcff";
  return (
    <motion.div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ background: bg }}
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0], transition: { times: [0, 0.1, 0.88, 1], duration: dur, ease: "easeInOut" } }} />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div key={`ring-${i}`} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: `rgba(${AR}, ${0.5 - i * 0.08})`, borderWidth: `${3 - i * 0.4}px`, boxShadow: `0 0 ${30 + i * 10}px ${3 + i * 2}px rgba(${AR}, ${0.3 - i * 0.05}), inset 0 0 ${20 + i * 8}px rgba(${AR}, 0.15)` }}
          initial={{ width: "0px", height: "0px", opacity: 0.8 }}
          animate={{ width: ["0px", `${150 + i * 120}vh`], height: ["0px", `${150 + i * 120}vh`], opacity: [0.8, 0], transition: { duration: dur, delay: i * 0.06, ease: [0.25, 0.1, 0, 1] } }} />
      ))}
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${A} 0%, transparent 70%)` }}
        initial={{ width: "0px", height: "0px", opacity: 0 }}
        animate={{ width: ["0px", "120px", "120px", "0px"], height: ["0px", "120px", "120px", "0px"], opacity: [0, 0.9, 0.9, 0], transition: { duration: dur, times: [0, 0.15, 0.85, 1], ease: "easeInOut" } }} />
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.9, 0.92, 1, 1, 0.9], transition: { times: [0, 0.15, 0.35, 0.78, 1], duration: dur, ease: "easeOut" } }}>
        <motion.div className="text-xs tracking-[0.35em] uppercase" style={{ color: A, fontFamily: "'DM Sans', sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -8], transition: { duration: dur, times: [0, 0.35, 0.78, 1], delay: 0.05 } }}>{pathname === "/" ? "HOME" : pathname.replace("/", "").toUpperCase()}</motion.div>
        <motion.h1 className="text-6xl md:text-8xl font-bold tracking-tight mt-2"
          style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#fff" : "#10233f", textShadow: isDark ? `0 0 50px rgba(${AR}, 0.5)` : undefined }}
          initial={{ opacity: 0, y: 25, scale: 0.85 }}
          animate={{ opacity: [0, 1, 1, 0], y: [25, 0, 0, -18], scale: [0.85, 1, 1, 0.85], transition: { duration: dur, times: [0, 0.38, 0.75, 1], delay: 0.08, ease: "easeOut" } }}>{pageName}</motion.h1>
        <motion.p className="text-sm mt-3 opacity-60" style={{ fontFamily: "'DM Sans', sans-serif", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(16,35,63,0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.7, 0], transition: { duration: dur, times: [0, 0.4, 0.75, 1], delay: 0.15 } }}>{pageCode} / {pageName} — portfolio 2025</motion.p>
      </motion.div>
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = 80 + Math.random() * 180;
        return (
          <motion.div key={`rp-${i}`} className="absolute top-1/2 left-1/2 rounded-full"
            style={{ width: "3px", height: "3px", background: A, boxShadow: `0 0 6px 2px ${A}` }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: [0, Math.cos(rad) * dist], y: [0, Math.sin(rad) * dist], opacity: [0, 0.9, 0], transition: { duration: dur, delay: i * 0.02 + 0.1, ease: "easeOut" } }} />
        );
      })}
    </motion.div>
  );
}

function SlideStripsTransition({ pathname, isDark, pageName, pageCode }) {
  const dur = 1.2;
  const strips = Array.from({ length: 7 }, (_, i) => ({ id: i, y: (i / 7) * 100, height: 100 / 7, direction: i % 2 === 0 ? -1 : 1 }));
  return (
    <motion.div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {strips.map((strip) => (
        <motion.div key={`strip-${strip.id}`} className="absolute left-0 w-full"
          style={{ top: `${strip.y}%`, height: `${strip.height}%`, background: `linear-gradient(${strip.direction > 0 ? "90deg" : "270deg"}, ${AD} 0%, ${A} 50%, ${AD} 100%)` }}
          initial={{ x: "0%" }}
          animate={{ x: ["0%", `${strip.direction * 120}%`], transition: { duration: dur, delay: strip.id * 0.04, ease: [0.83, 0, 0.17, 1] } }} />
      ))}
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0], transition: { times: [0, 0.15, 0.4, 0.8, 1], duration: dur } }}>
        <motion.div className="flex items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: [0, 1, 1, 0], y: [16, 0, 0, -12], transition: { duration: dur, times: [0, 0.4, 0.8, 1], delay: 0.06, ease: "easeOut" } }}>
          <div className="w-6 h-px" style={{ background: A }} />
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: A, fontFamily: "'DM Sans', sans-serif" }}>{pageCode}</span>
          <div className="w-6 h-px" style={{ background: A }} />
        </motion.div>
        <motion.h1 className="text-6xl md:text-8xl font-bold tracking-tight mt-2"
          style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#fff" : "#10233f", textShadow: isDark ? `0 0 40px rgba(${AR}, 0.45)` : undefined }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -15], transition: { duration: dur, times: [0, 0.42, 0.78, 1], delay: 0.1, ease: "easeOut" } }}>{pageName}</motion.h1>
        <motion.div className="mt-5 w-36 h-0.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], transition: { duration: dur, times: [0, 0.45, 0.78, 1], delay: 0.15 } }}>
          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${A}, ${AD})` }}
            initial={{ width: "0%" }}
            animate={{ width: "100%", transition: { duration: dur * 0.45, delay: 0.2, ease: "easeOut" } }} />
        </motion.div>
        <motion.p className="text-xs mt-3 opacity-50 tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.5, 0], transition: { duration: dur, times: [0, 0.5, 0.78, 1], delay: 0.2 } }}>navigating to {pageName.toLowerCase()}</motion.p>
      </motion.div>
    </motion.div>
  );
}
