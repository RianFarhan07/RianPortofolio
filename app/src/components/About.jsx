import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { IntroContext } from "./PageTransition6Clean";
import { Terminal, Download, Github, Linkedin, Mail } from "lucide-react";
import rianPhoto from "../assets/rian-animate-editorial.webp";

/* ──────────────────────────────────────────────
   DATA
────────────────────────────────────────────── */
const EXPERIENCES = [
  { role: "IT Support", org: "Dept. of Manpower, Makassar", period: "2022 → 23", desc: "Daily technical support, hardware/software & internal networks." },
  { role: "Freelance Android Developer", org: "SMKN 4 Jeneponto", period: "2023", desc: "Built & maintained Android apps for school needs using Kotlin." },
  {
    role: "Fullstack Developer Associate Manager", org: "CarbonEthics", period: "2025 → now",
    desc: "Independently designed and built an end-to-end monitoring ecosystem—from database architecture to production deployment—replacing a manual Google Forms/Airtable workflow.",
    featured: true,
    highlights: [
      "Built a multi-role Internal Dashboard (Laravel, 30+ tables) managing planting operations, orders, vendors, finance, and HR across six departments.",
      "Developed an offline-first Field Monitoring App (React Native/Expo) with GPS-watermarked photos, draft persistence, and automatic sync—eliminating data loss in low-connectivity areas.",
      "Led the corporate website migration from Wix to Next.js with bilingual (EN/ID) content, SEO redirect mapping, Docker deployment, and AWS S3 media handling.",
      "Built a B2B Client Dashboard (Next.js) with interactive satellite maps, planting timeline, gallery, and downloadable reports and certificates.",
      "Led and mentored a team of 2 development interns, overseeing task delegation, code review, and delivery timelines.",
    ],
  },
];
const EDUCATION = [
  { degree: "B.Sc Informatics", org: "Universitas Negeri Makassar", period: "2020 → 2024", desc: "Computer science, software development & IT fundamentals.", score: "3.86", scale: "/4.00", scoreLabel: "GPA" },
  { degree: "Fullstack JavaScript Bootcamp", org: "Hacktiv8", period: "2024 → 2025", desc: "An intensive fullstack track covering React, Node.js, Express, and databases.", score: "99", scale: "/100", scoreLabel: "Final score", award: "Teacher's Award" },
];
const WORK_PRINCIPLES = [
  { title: "Think in Systems", desc: "I connect interface decisions with APIs, data, and the operational reality behind the product." },
  { title: "Own It End-to-End", desc: "I stay close to the work from discovery and architecture through release, feedback, and iteration." },
  { title: "Ship With Clarity", desc: "I turn ambiguous requirements into clear decisions, visible progress, and maintainable delivery." },
];
const CAPABILITY_GROUPS = [
  { cat: "Frontend / Product UI", desc: "Accessible interfaces with a strong product hierarchy and dependable implementation.", items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind", "Figma"] },
  { cat: "Backend / Systems", desc: "Practical APIs, data flows, and services designed around real operational needs.", items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "PHP", "Git"] },
  { cat: "Mobile Delivery", desc: "Focused mobile experiences that translate workflows into tools people can use anywhere.", items: ["React Native", "Flutter", "Kotlin", "Apps Script"] },
];
const STACK = ["React", "Next.js", "React Native", "Flutter", "TypeScript", "JavaScript", "Kotlin", "PHP", "Node.js", "Express", "MongoDB", "PostgreSQL", "Tailwind", "Figma", "Apps Script", "Git"];
const SOCIALS = { github: "https://github.com", linkedin: "https://linkedin.com", mail: "mailto:rian.mallanti@gmail.com" };
const CV = "/rianCV.pdf";
const ABOUT_VIEW_KEY = "rian-about-view";
const CARBONETHICS_LOGO = "https://static.wixstatic.com/media/ee9db0_f68a88bb9569472eae36b57823fdf84a~mv2.png/v1/crop/x_181,y_73,w_3005,h_835/fill/w_249,h_69,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/CarbonEthics%20Horizontal%20White.png";

/* ──────────────────────────────────────────────
   COMPONENT
────────────────────────────────────────────── */
export default function About() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [view, setView] = useState(() => {
    if (typeof window === "undefined") return "picker";
    const savedView = window.sessionStorage.getItem(ABOUT_VIEW_KEY);
    return savedView === "page" || savedView === "terminal" ? savedView : "picker";
  }); // 'picker' | 'terminal' | 'page'
  const [selecting, setSelecting] = useState(null); // null | 'terminal' | 'page' — drives the expand transition

  const { introExited, pageTransitionDone } = useContext(IntroContext);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (introExited && pageTransitionDone) setVisible(true);
    }, 120);
    return () => clearTimeout(t);
  }, [introExited, pageTransitionDone]);

  const openView = useCallback((target) => {
    window.sessionStorage.setItem(ABOUT_VIEW_KEY, target);
    setSelecting(null);
    setView(target);
  }, []);

  const choose = useCallback((target) => {
    if (selecting) return;
    setSelecting(target);
    setTimeout(() => openView(target), 560);
  }, [openView, selecting]);

  const showPicker = () => {
    window.sessionStorage.removeItem(ABOUT_VIEW_KEY);
    setSelecting(null);
    setView("picker");
  };

  useEffect(() => {
    if (view !== "picker") return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "1") choose("page");
      if (event.key === "2") choose("terminal");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, choose]);

  const bodyRef = useRef(null);
  const apiRef = useRef(null);
  const setViewRef = useRef(setView);
  const toggleThemeRef = useRef(toggleTheme);
  setViewRef.current = openView;
  toggleThemeRef.current = toggleTheme;

  /* ── terminal engine ── */
  useEffect(() => {
    if (view !== "terminal" || !bodyRef.current || !visible) return;
    const reduce = false; // Animasi selalu jalan — abaikan prefers-reduced-motion dari OS
    const term = bodyRef.current;
    let inputRow = null, cin = null, history = [], histIdx = 0, tabState = null;
    let timers = [], killed = false;

    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const prompt = () => '<span class="prompt"><span class="u">rian@portfolio</span><span class="s">:</span><span class="p">~/about</span><span class="s">$</span> </span>';
    const scroll = () => { term.scrollTop = term.scrollHeight; };
    const fillBars = (s) => (s || term).querySelectorAll(".sk .bar > i").forEach((el) => { el.style.width = el.getAttribute("data-w") + "%"; });
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)));
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

    /* content */
    const neofetch = '<div class="nf"><div class="nf-ava">RF</div><div class="nf-info">'
      + '<div><span class="k">host</span> rian@portfolio</div><div><span class="k">role</span> Full Stack Developer</div>'
      + '<div><span class="k">company</span> CarbonEthics</div><div><span class="k">location</span> Jakarta / Makassar, ID</div>'
      + '<div><span class="k">uptime</span> 4+ years</div><div><span class="k">projects</span> 20+</div>'
      + '<div><span class="k">status</span> <span class="ok">● open_to_work</span></div></div></div>';
    const bio = '<span class="muted">"""</span> Crafting elegant solutions to complex problems. Specialized in building modern web &amp; mobile applications with exceptional user experiences. <span class="muted">"""</span>';
    const exp = EXPERIENCES.map((e) => {
      const highlights = e.highlights?.length
        ? `<div class="rec-points">${e.highlights.map((point) => `<div><span class="k">├─</span> ${point}</div>`).join("")}</div>`
        : "";
      return `<div class="rec"><span class="ok">▸ ${e.period}</span>  ${e.role} · <span class="hl">${e.org}</span><div class="sub">${e.desc}</div>${highlights}</div>`;
    }).join("");
    const edu = EDUCATION.map((e) => `<div class="rec"><span class="ok">🎓 ${e.period}</span>  ${e.degree} · <span class="hl">${e.org}</span></div>`).join("");
    const chipRow = (items) => '<div class="chips">' + items.map((t) => `<span class="chip"><span class="k">▸</span> ${t}</span>`).join("") + "</div>";
    const skills = '<div class="skcat"># frontend</div>' + chipRow(["react / next", "typescript", "html / css"])
      + '<div class="skcat"># mobile</div>' + chipRow(["react native", "kotlin", "flutter"])
      + '<div class="skcat"># backend &amp; design</div>' + chipRow(["node / api", "php", "figma / ui"]);
    const stack = '<div class="chips">' + STACK.map((t) => `<span class="chip"><span class="k">▸</span> ${t}</span>`).join("") + "</div>";
    const projects = '<div class="rec"><span class="ok">▸</span> Portfolio — React + Vite <span class="muted">(this site)</span></div>'
      + '<div class="rec"><span class="ok">▸</span> Carbonethics Platform — Fullstack web</div>'
      + '<div class="rec"><span class="ok">▸</span> School Android App — Kotlin</div><div class="muted">→ see all at /projects</div>';
    const contact = `<div class="cta"><a class="btn primary" href="${CV}" target="_blank" rel="noreferrer">⬇ Download CV</a>`
      + `<a class="btn ghost" href="${SOCIALS.github}" target="_blank" rel="noreferrer">↗ GitHub</a>`
      + `<a class="btn ghost" href="${SOCIALS.linkedin}" target="_blank" rel="noreferrer">↗ LinkedIn</a>`
      + `<a class="btn ghost" href="${SOCIALS.mail}">✉ Email</a></div>`
      + '<div class="cta-line">&gt; Let\'s build something <span class="hl">amazing</span> — <span class="ok">start a conversation</span></div>';
    const whoami = '<span class="ok">Baso Rian Farhan Mallanti</span> — Full Stack Developer @ Carbonethics';
    const coffee = '<pre class="art">     ( (\n      ) )\n   ........\n   |      |]   brewing… ☕\n   \\      /\n    `----\'</pre>';
    const CMDS = ["whoami", "about", "experience", "education", "skills", "stack", "projects", "contact", "resume", "neofetch", "theme", "clear", "help", "page", "coffee", "matrix", "sudo hire-me"];
    const help = '<div class="help">'
      + '<div><span class="cn">whoami</span> who am I</div><div><span class="cn">about</span> short intro</div>'
      + '<div><span class="cn">experience</span> work history</div><div><span class="cn">education</span> degrees &amp; bootcamp</div>'
      + '<div><span class="cn">skills</span> skill levels</div><div><span class="cn">stack</span> tools I use</div>'
      + '<div><span class="cn">projects</span> selected work</div><div><span class="cn">contact</span> reach me / hire</div>'
      + '<div><span class="cn">resume</span> download CV</div><div><span class="cn">page</span> readable view ↗</div>'
      + '<div><span class="cn">theme</span> toggle light / dark</div><div><span class="cn">clear</span> clear screen</div>'
      + '<div class="muted" style="margin-top:7px">tip: Tab = autocomplete · ↑/↓ = history · try <span class="ac">sudo hire-me</span></div></div>';
    const CONTENT = { whoami, about: bio, experience: exp, education: edu, skills, stack, projects, contact, neofetch, help };

    const place = (n) => { if (inputRow) term.insertBefore(n, inputRow); else term.appendChild(n); };
    const out = (html) => { const d = document.createElement("div"); d.className = "out"; d.innerHTML = html; place(d); fillBars(d); scroll(); };
    const echoLine = (raw) => { const l = document.createElement("div"); l.className = "line"; l.innerHTML = prompt() + '<span class="cmd">' + esc(raw) + "</span>"; place(l); };
    const refocus = () => { if (cin) cin.focus(); scroll(); };
    const clearScreen = () => { Array.prototype.slice.call(term.children).forEach((c) => { if (c !== inputRow) term.removeChild(c); }); refocus(); };

    const confetti = () => {
      if (reduce) return;
      const box = document.createElement("div"); box.className = "cf-box"; term.parentElement.appendChild(box);
      const cols = ["var(--ac)", "var(--ok)", "var(--hl)", "#ffcf6a"];
      for (let n = 0; n < 48; n++) { const d = document.createElement("i"); d.style.left = Math.random() * 100 + "%"; d.style.background = cols[n % 4]; d.style.animationDelay = Math.random() * 0.3 + "s"; d.style.animationDuration = 0.9 + Math.random() * 0.7 + "s"; box.appendChild(d); }
      setTimeout(() => box.remove(), 1900);
    };
    const matrixRain = () => {
      if (reduce) return;
      const win = term.parentElement; const cv = document.createElement("canvas"); cv.className = "mtx"; win.appendChild(cv);
      const ctx = cv.getContext("2d"); cv.width = win.clientWidth; cv.height = win.clientHeight;
      const fs = 14, cols = Math.floor(cv.width / fs), y = []; for (let i = 0; i < cols; i++) y[i] = Math.random() * -40;
      const ch = "01¦│<>*#$/\\{}[]", start = Date.now();
      (function frame() {
        ctx.fillStyle = "rgba(3,8,16,.16)"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = "#3ddc97"; ctx.font = fs + "px monospace";
        for (let i = 0; i < cols; i++) { ctx.fillText(ch[Math.floor(Math.random() * ch.length)], i * fs, y[i] * fs); if (y[i] * fs > cv.height && Math.random() > 0.975) y[i] = 0; y[i]++; }
        if (Date.now() - start < 2600) requestAnimationFrame(frame); else { cv.style.transition = "opacity .4s"; cv.style.opacity = 0; setTimeout(() => cv.remove(), 420); }
      })();
    };

    const submit = (raw) => {
      const cmd = (raw || "").trim(); echoLine(raw || "");
      if (cmd) history.push(cmd); histIdx = history.length;
      if (!cmd) { refocus(); return; }
      const key = cmd.toLowerCase();
      if (key === "clear") return clearScreen();
      if (key === "theme") { toggleThemeRef.current(); out('<span class="muted">theme →</span> toggled'); return; }
      if (key === "page") { out('<span class="ok">↗</span> opening readable view…'); setTimeout(() => setViewRef.current("page"), 380); return; }
      if (key === "resume" || key === "cv") { out('<span class="ok">↓</span> opening <span class="hl">rianCV.pdf</span> …'); window.open(CV, "_blank"); return; }
      if (key === "coffee") return out(coffee);
      if (key === "matrix") { matrixRain(); return out('<span class="ok">wake up, Neo…</span> <span class="muted">(the stack has you)</span>'); }
      if (key === "sudo hire-me" || key === "sudo hire me") { confetti(); out('<span class="ok">[sudo]</span> access granted ✓ — <span class="hl">opening /contact…</span> 🎉'); setTimeout(() => { window.location.href = "/contact"; }, 1400); return; }
      const html = CONTENT[key];
      if (html === undefined) { out('<span class="err">zsh: command not found: ' + esc(cmd) + "</span> — type <span class=\"ac\">help</span>"); return; }
      out(html);
    };
    apiRef.current = { run: (c) => { if (!inputRow) renderAll(); submit(c); } };

    const autocomplete = () => {
      const v = cin.value.trim().toLowerCase();
      if (!v) { out('<span class="muted">' + CMDS.join("  ") + "</span>"); refocus(); return; }
      const m = CMDS.filter((n) => n.indexOf(v) === 0);
      if (m.length > 1 && (!tabState || tabState.base !== v)) out('<span class="muted">' + m.join("  ") + "</span>");
      if (!m.length) return;
      if (!tabState || tabState.base !== v) tabState = { base: v, idx: 0, m };
      cin.value = tabState.m[tabState.idx % tabState.m.length]; tabState.idx++;
    };
    const showInput = () => {
      inputRow = document.createElement("div"); inputRow.className = "line inrow"; inputRow.innerHTML = prompt();
      cin = document.createElement("input"); cin.className = "bt-input"; cin.type = "text"; cin.autocomplete = "off"; cin.spellcheck = false;
      cin.setAttribute("placeholder", "type a command…  (try: help)"); cin.setAttribute("aria-label", "terminal input");
      inputRow.appendChild(cin); term.appendChild(inputRow);
      cin.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); const v = cin.value; cin.value = ""; tabState = null; submit(v); }
        else if (e.key === "Tab") { e.preventDefault(); autocomplete(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); if (history.length) { histIdx = Math.max(0, histIdx - 1); cin.value = history[histIdx] || ""; } }
        else if (e.key === "ArrowDown") { e.preventDefault(); if (history.length) { histIdx = Math.min(history.length, histIdx + 1); cin.value = history[histIdx] || ""; } }
        else tabState = null;
      });
      refocus();
    };

    const bootLine = (html) => { const d = document.createElement("div"); d.className = "line boot"; d.innerHTML = html; d.style.opacity = 0; term.appendChild(d); timers.push(setTimeout(() => { d.style.transition = "opacity .2s"; d.style.opacity = 1; }, 10)); scroll(); return d; };
    const bootAnimated = async () => {
      bootLine('<span class="ac">rian@portfolio</span> <span class="muted">·</span> booting profile…'); await wait(95);
      bootLine('<span class="ok">[ ok ]</span> mounting <span class="hl">/about</span>'); await wait(95);
      const pl = bootLine('<span class="acw">[ .. ]</span> loading modules <span class="pbar"><i></i></span> <span class="ppct">0%</span>'); await wait(60);
      pl.querySelector(".pbar>i").style.width = "100%"; const pct = pl.querySelector(".ppct");
      let p = 0; const iv = setInterval(() => { p = Math.min(100, p + Math.round(7 + Math.random() * 9)); pct.textContent = p + "%"; if (p >= 100) clearInterval(iv); }, 95);
      await wait(1180); clearInterval(iv); pct.textContent = "100%"; pl.querySelector(".acw").outerHTML = '<span class="ok">[ ok ]</span>';
      bootLine('<span class="ok">[ ok ]</span> theme synced <span class="muted">·</span> status: <span class="ok">open_to_work</span>'); await wait(95);
      bootLine('<span class="muted">────────────────────────────────────────</span>'); await wait(180);
    };
    const typeCmd = (text) => new Promise((res) => {
      const line = document.createElement("div"); line.className = "line"; line.innerHTML = prompt();
      const c = document.createElement("span"); c.className = "cmd"; line.appendChild(c);
      const cur = document.createElement("span"); cur.className = "cur"; line.appendChild(cur); term.appendChild(line); scroll();
      let j = 0; (function t() { if (killed) return; if (j <= text.length) { c.textContent = text.slice(0, j); j++; timers.push(setTimeout(t, 24)); } else { cur.remove(); res(); } })();
    });
    const autoStep = async (cmd, html) => { await typeCmd(cmd); if (killed) return; await wait(150); const d = document.createElement("div"); d.className = "out"; d.innerHTML = html; term.appendChild(d); fillBars(d); scroll(); await wait(360); };
    const run = async () => { await bootAnimated(); if (killed) return; await autoStep("whoami", whoami); if (killed) return; await autoStep("neofetch", neofetch); if (killed) return; showInput(); };
    const renderAll = () => {
      clearTimers(); killed = true; term.innerHTML = ""; inputRow = null;
      [["whoami", whoami], ["neofetch", neofetch], ["help", help]].forEach((s) => {
        const l = document.createElement("div"); l.className = "line"; l.innerHTML = prompt() + '<span class="cmd">' + s[0] + "</span>"; term.appendChild(l);
        const d = document.createElement("div"); d.className = "out"; d.innerHTML = s[1]; term.appendChild(d);
      });
      fillBars(); killed = false; showInput();
    };

    term.innerHTML = "";
    if (reduce) renderAll(); else run();

    const clickFocus = (e) => { if (cin && e.target.tagName !== "A" && e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") cin.focus(); };
    term.addEventListener("click", clickFocus);

    return () => { killed = true; clearTimers(); term.removeEventListener("click", clickFocus); apiRef.current = null; };
  }, [view, visible]);

  /* ── theme tokens ── */
  const tv = isDark
    ? { "--term": "#0e1826", "--chrome": "#101d2c", "--line": "#1c2a3f", "--txt": "#cdd8ea", "--muted": "#5d6f8e", "--ok": "#3ddc97", "--path": "#e0a83a", "--hl": "#9ec9ff", "--mag": "#c792ea", "--err": "#ff7a7a" }
    : { "--term": "#eef1f5", "--chrome": "#f7f9fb", "--line": "#d8dee6", "--txt": "#17263d", "--muted": "#7c8aa0", "--ok": "#0f9d6b", "--path": "#9c6a12", "--hl": "#2563a8", "--mag": "#8b5cf6", "--err": "#d4453b" };
  const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

  /* ── static boot snapshot shown in the terminal PREVIEW (no live engine) ── */
  const bootPreview = (
    <>
      <div className="line boot"><span className="ac">rian@portfolio</span> <span className="muted">·</span> booting profile…</div>
      <div className="line boot"><span className="ok">[ ok ]</span> mounting <span className="hl">/about</span></div>
      <div className="line boot"><span className="ok">[ ok ]</span> loading modules <span className="pbar"><i style={{ width: "100%" }} /></span> <span className="muted">100%</span></div>
      <div className="line boot"><span className="ok">[ ok ]</span> theme synced <span className="muted">·</span> status: <span className="ok">open_to_work</span></div>
      <div className="line boot"><span className="muted">──────────────────────────────</span></div>
      <div className="line"><span className="prompt"><span className="u">rian@portfolio</span><span className="s">:</span><span className="p">~/about</span><span className="s">$</span></span> <span className="cur" style={{ marginLeft: 2 }} /></div>
    </>
  );

  /* ── terminal window (live = real engine boots; preview = static snapshot) ── */
  const renderTerminal = ({ live, outerStyle }) => (
    <div id={live ? "terminal-view" : undefined} className="bt" style={{ ...tv, "--mono": mono, ...outerStyle }}>
      <style>{btCss}</style>
      <div className="term-win">
        <div className="term-bar">
          <div className="dots"><span className="dot" style={{ background: "#ff5f57" }} /><span className="dot" style={{ background: "#febc2e" }} /><span className="dot" style={{ background: "#28c840" }} /></div>
          <div className="term-title"><b>rian@portfolio</b> : ~/about — zsh</div>
          {live && <button className="vbtn" onClick={showPicker} aria-label="Switch view">▦ Switch view</button>}
        </div>
        {live
          ? <div className="term-body" ref={bodyRef} />
          : <div className="term-body" style={{ pointerEvents: "none" }}>{bootPreview}</div>}
        {live && (
          <div className="qchips">
            {["help", "whoami", "experience", "skills", "projects", "contact"].map((c) => (
              <button key={c} onClick={() => apiRef.current && apiRef.current.run(c)}>{c}</button>
            ))}
          </div>
        )}
        <div className="term-status"><span>⎇ main</span><span>● open_to_work</span><span>📍 Jakarta / Makassar, ID</span><span className="sp">TSX · UTF-8</span></div>
        <div className="crt" />
      </div>
    </div>
  );

  /* ── readable page ── */
  const renderPage = () => {
    const soft = isDark ? "rgba(210,222,235,.7)" : "rgba(16,35,63,.7)";
    const muted = isDark ? "rgba(210,222,235,.5)" : "rgba(16,35,63,.5)";
    const txt = isDark ? "#eaf1fb" : "#10233f";
    const card = isDark ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.55)";
    const line = isDark ? "rgba(120,160,220,.14)" : "rgba(16,120,100,.16)";
    const strk = isDark ? "rgba(255,255,255,.16)" : "rgba(16,35,63,.16)";
    return (
      <div id="visual-journey" className="bp" style={{ minHeight: "100vh", fontFamily: "'DM Sans',system-ui,sans-serif", color: txt, padding: "90px clamp(20px,3vw,24px) 60px", maxWidth: 1200, margin: "0 auto", opacity: visible ? 1 : 0, transition: "opacity 0.4s" }}>
        <style>{bpCss}</style>

        <div className="bp-top">
          <button className="bp-tbtn" onClick={showPicker} aria-label="Switch view"><Terminal size={14} /> Switch view</button>
        </div>

        {/* HERO */}
        <div className="bp-hero">
          <div>
            <div className="bp-eyebrow">console.log("Hello, World!")</div>
            <h1 className="bp-title"><span className="l1">Rian</span><span className="l2" style={{ WebkitTextStroke: `2px ${strk}` }}>Farhan</span></h1>
            <p className="bp-role" style={{ color: soft }}>Full Stack Developer · Mobile · UI/UX</p>
            <span className="bp-badge"><span className="bp-dot" /> Available · Jakarta / Makassar</span>
            <p className="bp-lead" style={{ color: muted }}>Crafting elegant solutions to complex problems. Specialized in building modern web &amp; mobile applications with exceptional user experiences.</p>
            <div className="bp-actions">
              <a className="bp-cv" href={CV} target="_blank" rel="noreferrer"><Download size={16} /> Download CV</a>
              <a className="bp-soc" href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
              <a className="bp-soc" href={SOCIALS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a className="bp-soc" href={SOCIALS.mail} aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>
          <div className="bp-photo"><div className="bp-ava" data-intro-portrait><img loading="lazy" decoding="async" src={rianPhoto} alt="Rian Farhan" /><span className="bp-st" style={{ borderColor: isDark ? "#06101e" : "#eef5f1" }} /></div></div>
        </div>

        {/* STATS */}
        <div className="bp-stats" style={{ borderColor: line }}>
          {[["20", "+", "Projects Done"], ["4", "+", "Years Exp"], ["2", "", "Web + Mobile"]].map(([n, s, l]) => (
            <div className="bp-stat" key={l}><div className="n" style={{ color: txt }}>{n}<em>{s}</em></div><div className="l" style={{ color: muted }}>{l}</div></div>
          ))}
        </div>

        {/* LEARNING JOURNEY */}
        <section id="education-journey" className="bp-s" style={{ borderColor: line }}>
          <div className="bp-label"><span className="no" style={{ color: strk }}>01</span> Learning Journey</div>
          <div className="bp-section-intro">
            <h2 style={{ color: txt }}>Built through depth,<br />then sharpened by speed.</h2>
            <p style={{ color: muted }}>A foundation in informatics followed by an intensive fullstack program, with the outcomes shown clearly.</p>
          </div>
          <div className="bp-achievement-grid">
            {EDUCATION.map((item, index) => (
              <article className="bp-achievement" key={item.degree} style={{ background: card, borderColor: line }}>
                <div className="bp-achievement-top">
                  <span className="bp-index">0{index + 1}</span>
                  <span className="bp-period" style={{ color: muted }}>{item.period}</span>
                </div>
                <div className="bp-score" aria-label={`${item.score} ${item.scale}`}>
                  <strong style={{ color: txt }}>{item.score}</strong><span>{item.scale}</span>
                </div>
                <div className="bp-score-label">{item.scoreLabel}</div>
                <h3 style={{ color: txt }}>{item.degree}</h3>
                <div className="bp-org" style={{ color: soft }}>{item.org}</div>
                <p style={{ color: muted }}>{item.desc}</p>
                {item.award && <div className="bp-award">✦ <span>Teacher's Award</span></div>}
              </article>
            ))}
          </div>
        </section>

        {/* CAREER JOURNEY */}
        <section id="career-journey" className="bp-s" style={{ borderColor: line }}>
          <div className="bp-label"><span className="no" style={{ color: strk }}>02</span> Professional Journey</div>
          <div className="bp-career-list">
            {EXPERIENCES.map((item, index) => (
              <article className={`bp-career-item ${item.featured ? "is-current" : ""}`} key={item.role} style={{ borderColor: line }}>
                <div className="bp-career-marker"><span>{String(index + 1).padStart(2, "0")}</span></div>
                <div className="bp-career-time" style={{ color: muted }}>{item.period}</div>
                <div className="bp-career-copy">
                  <div className="bp-career-titleline">
                    <div>
                      <h3 style={{ color: txt }}>{item.role}</h3>
                      <div className="bp-org" style={{ color: soft }}>{item.org}</div>
                    </div>
                    {item.featured && (
                      <div className="bp-company-lockup" aria-label="CarbonEthics">
                        <img src={CARBONETHICS_LOGO} alt="CarbonEthics logo" loading="lazy" decoding="async" />
                        <span>Current role</span>
                      </div>
                    )}
                  </div>
                  <p style={{ color: muted }}>{item.desc}</p>
                  {item.highlights?.length > 0 && (
                    <ul className="bp-career-highlights">
                      {item.highlights.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HOW I WORK */}
        <section id="work-principles" className="bp-s" style={{ borderColor: line }}>
          <div className="bp-section-head">
            <div className="bp-label"><span className="no" style={{ color: strk }}>03</span> How I Work</div>
            <p style={{ color: muted }}>The habits behind the output—how I move from an unclear problem to a product people can rely on.</p>
          </div>
          <div className="bp-principles">
            {WORK_PRINCIPLES.map((principle, index) => (
              <article className="bp-principle" key={principle.title}>
                <span className="bp-principle-no">0{index + 1}</span>
                <h3 style={{ color: txt }}>{principle.title}</h3>
                <p style={{ color: muted }}>{principle.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CAPABILITIES + TOOLBOX */}
        <section id="capabilities-toolbox" className="bp-s" style={{ borderColor: line }}>
          <div className="bp-toolbox-intro">
            <div>
              <div className="bp-label"><span className="no" style={{ color: strk }}>04</span> Capabilities &amp; Toolbox</div>
              <h2 style={{ color: txt }}>One builder,<br /><span>across the stack.</span></h2>
            </div>
            <p style={{ color: muted }}>Tools are selected for the problem, not for decoration. The constant is ownership across interface, system, and delivery.</p>
          </div>
          <div className="bp-tool-rows">
            {CAPABILITY_GROUPS.map((group, index) => (
              <article className="bp-tool-row" key={group.cat} style={{ borderColor: line }}>
                <span className="bp-tool-index">0{index + 1}</span>
                <div className="bp-tool-copy">
                  <h3 style={{ color: txt }}>{group.cat}</h3>
                  <p style={{ color: muted }}>{group.desc}</p>
                </div>
                <div className="bp-tool-list">
                  {group.items.map((tool) => <span key={tool}>{tool}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bp-s" style={{ borderColor: line }}>
          <div className="bp-cta">
            <div className="bp-label bp-cta-label"><span className="no" style={{ color: strk }}>05</span> Next Chapter</div>
            <h2 style={{ color: txt }}>Need someone who can move from <span className="ac">product thinking</span> to production code?</h2>
            <p style={{ color: muted }}>Let’s talk about the problem, the people using it, and what a dependable release should look like.</p>
            <a className="bp-cv" href="/contact"><Terminal size={16} /> Start a Conversation</a>
          </div>
        </section>
      </div>
    );
  };

  /* ── PICKER VIEW (shown once per browser session) ── */
  if (view === "picker") {
    const pickerTheme = isDark
      ? { "--pk-bg": "#08111f", "--pk-panel": "#0d1827", "--pk-text": "#e8eef7", "--pk-soft": "#93a3b8", "--pk-line": "#243247" }
      : { "--pk-bg": "#edf2f0", "--pk-panel": "#f8faf9", "--pk-text": "#10233f", "--pk-soft": "#68768a", "--pk-line": "#cad4d2" };
    return (
      <main
        id="about-view-picker"
        className={`pk ${visible ? "is-visible" : ""} ${selecting ? `is-selecting is-selecting-${selecting}` : ""}`}
        style={pickerTheme}
      >
        <style>{pkCss}</style>
        <div className="pk-frame">
          <section className="pk-identity" aria-label="Profile introduction">
            <div className="pk-kicker"><span /> PROFILE / ABOUT</div>
            <div className="pk-portrait-wrap" data-intro-portrait>
              <div className="pk-portrait-index">01</div>
              <img src={rianPhoto} alt="Rian Farhan illustrated portrait" decoding="async" />
              <div className="pk-portrait-caption">
                <span>Full Stack Developer</span>
                <span>Web · Mobile · UI/UX</span>
              </div>
            </div>
            <div className="pk-identity-copy">
              <span className="pk-available"><i /> Available · Jakarta / Makassar</span>
              <h1>Baso Rian<br />Farhan Mallanti</h1>
              <p>One story, two ways to explore it.</p>
            </div>
          </section>

          <section className="pk-choices" aria-labelledby="picker-heading">
            <div className="pk-choice-kicker">CHOOSE YOUR ENTRY POINT</div>
            <h2 id="picker-heading">How do you want<br />to meet me?</h2>
            <p className="pk-choice-lead">The content is the same. The experience is yours.</p>

            <div className="pk-options">
              <button
                className={`pk-option pk-option-page ${selecting === "page" ? "is-selected" : ""}`}
                onClick={() => choose("page")}
                aria-label="Visual Journey"
                disabled={Boolean(selecting)}
              >
                <span className="pk-option-no">01</span>
                <span className="pk-option-copy">
                  <strong>Visual Journey</strong>
                  <small>Editorial, structured, and easy to scan.</small>
                </span>
                <span className="pk-option-glyph" aria-hidden="true">↗</span>
              </button>

              <button
                className={`pk-option pk-option-terminal ${selecting === "terminal" ? "is-selected" : ""}`}
                onClick={() => choose("terminal")}
                aria-label="Terminal Mode"
                disabled={Boolean(selecting)}
              >
                <span className="pk-option-no">02</span>
                <span className="pk-option-copy">
                  <strong>Terminal Mode</strong>
                  <small>Interactive commands for the curious.</small>
                </span>
                <span className="pk-option-glyph" aria-hidden="true">$_</span>
              </button>
            </div>

            <div className="pk-keyhint"><kbd>1</kbd> Visual <span /> <kbd>2</kbd> Terminal</div>
          </section>
        </div>
      </main>
    );
  }

  /* ── PAGE VIEW (readable, full-screen) ── */
  if (view === "page") return renderPage();

  /* ── TERMINAL VIEW (full-screen, live engine boots) ── */
  return renderTerminal({
    live: true,
    outerStyle: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "90px 16px 40px", fontFamily: mono, opacity: visible ? 1 : 0, transition: "opacity 0.4s" },
  });
}

/* ──────────────────────────────────────────────
   STYLES
────────────────────────────────────────────── */
const btCss = `
@keyframes bt-blink{50%{opacity:0}}
@keyframes bt-pulse{0%,100%{box-shadow:0 0 0 0 rgba(var(--ac1),.6)}50%{box-shadow:0 0 0 6px rgba(var(--ac1),0)}}
@keyframes bt-flick{0%,100%{opacity:.55}48%{opacity:.62}50%{opacity:.4}52%{opacity:.6}}
@keyframes bt-cf{to{transform:translateY(130%) rotate(440deg);opacity:0}}
.bt .term-win{position:relative;width:100%;max-width:940px;background:var(--term);border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 30px 80px -30px rgba(0,0,0,.6),0 0 0 1px rgba(var(--ac2),.05);display:flex;flex-direction:column}
.bt .term-bar{display:flex;align-items:center;gap:12px;background:var(--chrome);border-bottom:1px solid var(--line);padding:0 12px;height:42px;flex-shrink:0}
.bt .dots{display:flex;gap:7px}.bt .dot{width:11px;height:11px;border-radius:50%}
.bt .term-title{font-size:12px;color:var(--muted);margin:0 auto;white-space:nowrap}.bt .term-title b{color:var(--txt);font-weight:600}
.bt .vbtn{font-family:var(--mono);font-size:11.5px;color:var(--ac);background:rgba(var(--ac2),.1);border:1px solid rgba(var(--ac2),.3);border-radius:7px;padding:6px 10px;cursor:pointer;white-space:nowrap;flex-shrink:0}
.bt .vbtn:hover{border-color:var(--ac)}
.bt .term-body{position:relative;padding:18px 20px;font-size:13.5px;line-height:1.7;min-height:56vh;max-height:64vh;overflow:auto;scrollbar-width:thin;cursor:text}
.bt .term-body::-webkit-scrollbar{width:8px}.bt .term-body::-webkit-scrollbar-thumb{background:var(--line);border-radius:8px}
.bt .crt{position:absolute;inset:0;z-index:4;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.05) 0,rgba(0,0,0,.05) 1px,transparent 1px,transparent 3px);mix-blend-mode:overlay;opacity:.6;animation:bt-flick 5s infinite}
.bt .qchips{display:none}
@media (max-width:768px){.bt .qchips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:8px 12px;border-top:1px solid var(--line);background:var(--chrome);flex-shrink:0}.bt .qchips::-webkit-scrollbar{display:none}.bt .term-body{max-height:none}}
.bt .qchips button{flex-shrink:0;font-family:var(--mono);font-size:11.5px;color:var(--ac);background:rgba(var(--ac2),.08);border:1px solid rgba(var(--ac2),.3);border-radius:7px;padding:6px 11px;cursor:pointer}
.bt .term-status{display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:var(--ac);color:#04121a;padding:7px 16px;font-size:11px;font-weight:600;letter-spacing:.02em;flex-shrink:0}
.bt .term-status .sp{margin-left:auto}
.bt .line{white-space:pre-wrap;word-break:break-word}
.bt .boot{color:var(--muted);font-size:12.6px;line-height:1.7}
.bt .prompt .u{color:var(--ac)}.bt .prompt .p{color:var(--path)}.bt .prompt .s{color:var(--muted)}
.bt .cmd{color:var(--txt)}
.bt .cur{display:inline-block;width:8px;height:15px;background:var(--ac);vertical-align:text-bottom;margin-left:1px;animation:bt-blink 1.05s step-end infinite}
.bt .out{margin:4px 0 16px;padding-left:2px}
.bt .muted{color:var(--muted)}.bt .ok{color:var(--ok)}.bt .hl{color:var(--hl)}.bt .ac{color:var(--ac)}.bt .acw{color:var(--ac)}.bt .mag{color:var(--mag)}.bt .err{color:var(--err)}
.bt .art{font-size:12px;line-height:1.25;color:var(--ok);margin:0;font-family:var(--mono)}
.bt .pbar{display:inline-block;width:150px;height:8px;border-radius:5px;background:var(--line);overflow:hidden;vertical-align:middle;margin:0 8px}
.bt .pbar>i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--ac),var(--ok));transition:width 1.1s ease}
.bt .inrow{display:flex;align-items:center}
.bt .bt-input{flex:1;min-width:0;background:transparent;border:none;outline:none;color:var(--txt);font:inherit;caret-color:var(--ac);padding:0;margin-left:3px}
.bt .bt-input::placeholder{color:var(--muted);opacity:.75}
.bt .help div{line-height:1.6}.bt .help .cn{color:var(--ac);min-width:104px;display:inline-block}
.bt .nf{display:flex;gap:20px;align-items:center;flex-wrap:wrap}
.bt .nf-ava{width:84px;height:84px;border-radius:16px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:30px;letter-spacing:1px;color:#04121a;background:var(--ac)}
.bt .nf-info>div{display:flex;gap:10px}.bt .nf-info .k{color:var(--ac);min-width:78px;display:inline-block}
.bt .rec{margin-bottom:11px}.bt .rec .sub{color:var(--muted);font-size:12px;padding-left:16px;line-height:1.5}.bt .rec-points{display:grid;gap:5px;margin:8px 0 0 16px;padding-left:11px;border-left:1px solid rgba(var(--ac1),.28);color:var(--muted);font-size:11px;line-height:1.5}.bt .rec-points .k{margin-right:5px}
.bt .skcat{color:var(--mag);margin:10px 0 5px;font-size:12px}
.bt .chips{display:flex;flex-wrap:wrap;gap:7px}
.bt .chip{font-size:11.5px;color:var(--txt);background:rgba(var(--ac2),.08);border:1px solid rgba(var(--ac2),.25);border-radius:7px;padding:5px 10px}.bt .chip .k{color:var(--ac)}
.bt .cta{display:flex;flex-wrap:wrap;gap:9px;margin:6px 0 12px}
.bt .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:9px;font-size:12.5px;text-decoration:none;cursor:pointer}
.bt .btn.primary{background:var(--ac);color:#04121a;font-weight:600}
.bt .btn.ghost{background:transparent;border:1px solid rgba(var(--ac2),.35);color:var(--txt)}
.bt .cta-line{font-size:13px}
.bt .cf-box{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:7}
.bt .cf-box i{position:absolute;top:-14px;width:8px;height:12px;border-radius:2px;animation:bt-cf linear forwards}
.bt .mtx{position:absolute;inset:0;z-index:6;pointer-events:none}
`;

const bpCss = `
@keyframes bp-pulse{0%,100%{box-shadow:0 0 0 0 rgba(var(--ac1),.5)}50%{box-shadow:0 0 0 6px rgba(var(--ac1),0)}}
.bp-top{display:flex;justify-content:flex-end;margin-bottom:8px}
.bp-tbtn{display:inline-flex;align-items:center;gap:7px;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--ac);background:rgba(var(--ac1),.08);border:1px solid rgba(var(--ac1),.3);border-radius:8px;padding:8px 14px;cursor:pointer}
.bp-tbtn:hover{border-color:var(--ac)}
.bp-hero{display:grid;grid-template-columns:1.25fr .75fr;gap:clamp(28px,4vw,56px);align-items:center;padding:clamp(20px,4vw,48px) 0 clamp(18px,3vw,32px)}
@media (max-width:820px){.bp-hero{grid-template-columns:1fr}}
.bp-eyebrow{font-family:ui-monospace,Menlo,monospace;font-size:13px;color:var(--ac);display:flex;align-items:center;gap:8px;margin-bottom:16px}
.bp-eyebrow::before{content:'';width:16px;height:1px;background:var(--ac)}
.bp-title{font-family:'Syne',sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:-.03em;line-height:.9;margin:0;font-size:clamp(3rem,8vw,6rem)}
.bp-title .l1{display:block}.bp-title .l2{display:block;color:transparent}
.bp-role{font-family:ui-monospace,Menlo,monospace;font-size:clamp(1rem,2vw,1.25rem);margin:16px 0 0}
.bp-badge{display:inline-flex;align-items:center;gap:8px;margin-top:18px;font-size:13px;color:var(--ac)}
.bp-dot{width:8px;height:8px;border-radius:50%;background:var(--ac);animation:bp-pulse 2s infinite}
.bp-lead{font-size:clamp(.95rem,1.4vw,1.05rem);line-height:1.7;max-width:52ch;margin:20px 0 0}
.bp-actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:26px}
.bp-cv{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:100px;font-weight:500;font-size:.9rem;color:#04121a;background:var(--ac);text-decoration:none;border:none;cursor:pointer;transition:transform .2s}
.bp-cv:hover{transform:translateY(-2px)}
.bp-soc{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(var(--ac1),.06);border:1px solid rgba(var(--ac1),.2);color:inherit;text-decoration:none}
.bp-soc:hover{border-color:var(--ac);color:var(--ac)}
.bp-photo{justify-self:center}
.bp-ava{width:clamp(190px,26vw,300px);height:clamp(190px,26vw,300px);border-radius:28px;position:relative;overflow:hidden;box-shadow:0 30px 80px -24px rgba(var(--ac1),.55),0 0 0 1px rgba(var(--ac1),.3)}
.bp-ava img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.bp-st{position:absolute;bottom:14px;right:14px;width:18px;height:18px;border-radius:50%;background:#3ddc97;border:3px solid #06101e;z-index:2}
.bp-stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid;border-bottom:1px solid;margin-top:8px}
.bp-stat{padding:22px clamp(14px,3vw,34px)}.bp-stat:first-child{padding-left:0}.bp-stat+.bp-stat{border-left:1px solid rgba(var(--ac1),.16)}
.bp-stat .n{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.8rem,3.4vw,2.6rem);line-height:1}.bp-stat .n em{font-style:normal;color:var(--ac)}
.bp-stat .l{font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;margin-top:6px}
.bp-s{padding:clamp(34px,5vw,60px) 0;border-top:1px solid}
.bp-label{font-family:ui-monospace,Menlo,monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--ac);display:flex;align-items:center;gap:10px;margin-bottom:24px}
.bp-label .no{font-family:'Syne',sans-serif;font-weight:800;font-size:22px}
.bp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,3vw,40px)}
@media (max-width:820px){.bp-grid2{grid-template-columns:1fr;gap:26px}}
.bp-card{border:1px solid;border-radius:14px;padding:16px 18px}
.bp-card+.bp-card{margin-top:14px}
.bp-card .h{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem}.bp-card .h .ac{color:var(--ac)}
.bp-card .meta{font-family:ui-monospace,Menlo,monospace;font-size:12px;margin:4px 0 8px}
.bp-card .d{font-size:.86rem;line-height:1.6}
.bp-section-intro{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);gap:36px;align-items:end;margin-bottom:28px}
.bp-section-intro h2{font-family:'Syne',sans-serif;font-size:clamp(2rem,5vw,4rem);line-height:.96;letter-spacing:-.045em;margin:0;text-transform:uppercase}
.bp-section-intro p{font-size:.95rem;line-height:1.7;margin:0;max-width:44ch}
.bp-achievement-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.bp-achievement{position:relative;overflow:hidden;border:1px solid;border-radius:18px;padding:clamp(20px,3vw,30px);min-height:330px;transition:transform .25s ease,border-color .25s ease}
.bp-achievement:hover{transform:translateY(-4px);border-color:rgba(var(--ac1),.48)!important}
.bp-achievement::after{content:'';position:absolute;right:-34px;bottom:-50px;width:150px;height:150px;border:1px solid rgba(var(--ac1),.18);border-radius:50%;pointer-events:none}
.bp-achievement-top{display:flex;align-items:center;justify-content:space-between;font:11px ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase}
.bp-index{color:var(--ac);font-weight:700}.bp-period{white-space:nowrap}
.bp-score{display:flex;align-items:baseline;margin:32px 0 0;font-family:'Syne',sans-serif;line-height:.8}
.bp-score strong{font-size:clamp(4rem,8vw,7rem);letter-spacing:-.08em}.bp-score span{color:var(--ac);font-size:clamp(1rem,2vw,1.35rem);margin-left:10px;font-weight:700}
.bp-score-label{font:10px ui-monospace,Menlo,monospace;color:var(--ac);letter-spacing:.18em;text-transform:uppercase;margin:12px 0 24px}
.bp-achievement h3{font-family:'Syne',sans-serif;font-size:clamp(1.15rem,2vw,1.45rem);margin:0 0 4px}.bp-achievement p{font-size:.86rem;line-height:1.6;margin:12px 0 0;max-width:48ch}
.bp-org{font:12px ui-monospace,Menlo,monospace;letter-spacing:.02em}
.bp-award{position:absolute;right:20px;top:58px;display:inline-flex;align-items:center;gap:7px;background:var(--ac);color:#08111f;border-radius:999px;padding:8px 12px;font:700 10px ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;transform:rotate(2deg)}
.bp-career-list{position:relative;border-left:1px solid rgba(var(--ac1),.32);margin-left:19px}
.bp-career-item{display:grid;grid-template-columns:52px 132px 1fr;gap:18px;padding:0 0 32px;position:relative}
.bp-career-item:last-child{padding-bottom:0}.bp-career-marker{width:39px;height:39px;margin-left:-20px;border:1px solid rgba(var(--ac1),.5);border-radius:50%;display:grid;place-items:center;background:var(--term,#08111f);color:var(--ac);font:700 10px ui-monospace,Menlo,monospace}
.bp-career-time{padding-top:10px;font:11px ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
.bp-career-copy{border-bottom:1px solid;padding:4px 0 28px;border-color:inherit}.bp-career-item:last-child .bp-career-copy{border-bottom:0;padding-bottom:0}
.bp-career-copy h3{font-family:'Syne',sans-serif;font-size:clamp(1.1rem,2vw,1.5rem);margin:0 0 6px}.bp-career-copy p{font-size:.9rem;line-height:1.65;margin:13px 0 0;max-width:72ch}.bp-career-highlights{display:grid;gap:10px;margin:18px 0 0;padding:0;max-width:78ch;list-style:none}.bp-career-highlights li{position:relative;padding-left:20px;font-size:.84rem;line-height:1.62;color:var(--muted)}.bp-career-highlights li::before{content:'↳';position:absolute;left:0;color:var(--ac);font-family:ui-monospace,Menlo,monospace;font-weight:700}
.bp-career-titleline{display:flex;align-items:flex-start;justify-content:space-between;gap:24px}.bp-company-lockup{background:#08111f;border:1px solid rgba(224,168,58,.35);border-radius:10px;padding:9px 12px;min-width:176px;display:flex;flex-direction:column;gap:6px;align-items:flex-start}.bp-company-lockup img{display:block;width:150px;height:25px;object-fit:contain;object-position:left center}.bp-company-lockup span{font:9px ui-monospace,Menlo,monospace;color:#e0a83a;letter-spacing:.17em;text-transform:uppercase}
.bp-career-item.is-current .bp-career-marker{background:var(--ac);color:#08111f}.bp-career-item.is-current .bp-career-copy{position:relative}.bp-career-item.is-current .bp-career-copy::before{content:'CURRENT';position:absolute;right:0;top:-18px;color:var(--ac);font:700 9px ui-monospace,Menlo,monospace;letter-spacing:.18em}
.bp-section-head{display:grid;grid-template-columns:1fr minmax(280px,.62fr);gap:36px;align-items:start;margin-bottom:30px}.bp-section-head .bp-label{margin-bottom:0}.bp-section-head>p{font-size:.92rem;line-height:1.7;margin:0;max-width:48ch}
.bp-principles{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(var(--ac1),.18);border-bottom:1px solid rgba(var(--ac1),.18)}
.bp-principle{padding:28px clamp(18px,2.8vw,34px) 30px;min-height:210px}.bp-principle:first-child{padding-left:0}.bp-principle+.bp-principle{border-left:1px solid rgba(var(--ac1),.18)}
.bp-principle-no,.bp-tool-index{display:block;color:var(--ac);font:700 10px ui-monospace,Menlo,monospace;letter-spacing:.16em}.bp-principle h3{font-family:'Syne',sans-serif;font-size:clamp(1.25rem,2.2vw,1.75rem);line-height:1.05;margin:36px 0 12px}.bp-principle p{font-size:.86rem;line-height:1.65;margin:0;max-width:34ch}
.bp-toolbox-intro{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:44px;align-items:end;margin-bottom:34px}.bp-toolbox-intro h2{font-family:'Syne',sans-serif;font-size:clamp(2.3rem,5.2vw,4.6rem);line-height:.9;letter-spacing:-.05em;text-transform:uppercase;margin:0}.bp-toolbox-intro h2 span{color:transparent;-webkit-text-stroke:1px rgba(var(--ac1),.44)}.bp-toolbox-intro>p{font-size:.92rem;line-height:1.7;margin:0;max-width:45ch}
.bp-tool-rows{border-bottom:1px solid rgba(var(--ac1),.18)}.bp-tool-row{display:grid;grid-template-columns:54px minmax(230px,.8fr) minmax(0,1.2fr);gap:24px;align-items:center;border-top:1px solid;padding:24px 0}.bp-tool-copy h3{font-family:'Syne',sans-serif;font-size:clamp(1.1rem,1.8vw,1.35rem);margin:0 0 7px}.bp-tool-copy p{font-size:.8rem;line-height:1.55;margin:0;max-width:43ch}.bp-tool-list{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}.bp-tool-list span{border-bottom:1px solid rgba(var(--ac1),.34);padding:5px 2px;color:var(--ac);font:11px ui-monospace,Menlo,monospace;white-space:nowrap}
@media (max-width:820px){.bp-section-intro,.bp-achievement-grid,.bp-section-head,.bp-toolbox-intro{grid-template-columns:1fr}.bp-achievement{min-height:300px}.bp-career-item{grid-template-columns:42px 1fr;gap:13px}.bp-career-time{grid-column:2;padding-top:0}.bp-career-copy{grid-column:2}.bp-career-marker{grid-row:1 / span 2}.bp-career-titleline{flex-direction:column}.bp-company-lockup{margin-top:8px}.bp-principles{grid-template-columns:1fr}.bp-principle{min-height:0;padding:24px 0}.bp-principle+.bp-principle{border-left:0;border-top:1px solid rgba(var(--ac1),.18)}.bp-principle h3{margin-top:20px}.bp-tool-row{grid-template-columns:38px 1fr}.bp-tool-list{grid-column:2;justify-content:flex-start;margin-top:4px}}
@media (max-width:520px){.bp-award{position:static;margin-top:20px;transform:none}.bp-score strong{font-size:4rem}}
.bp-cta{text-align:center;max-width:680px;margin:0 auto}
.bp-cta .bp-cta-label{justify-content:center;margin-bottom:22px}
.bp-cta h2{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.8rem,4vw,3rem);margin:0 0 14px;text-wrap:balance}
.bp-cta h2 .ac{color:var(--ac)}
.bp-cta p{line-height:1.7;margin:0 0 26px}
`;

const pkCss = `
.pk{min-height:100vh;background:var(--pk-bg);color:var(--pk-text);padding:clamp(82px,9vh,112px) clamp(16px,4vw,56px) 34px;display:flex;align-items:center;position:relative;overflow:hidden;opacity:0;transition:opacity .4s ease;font-family:'DM Sans',system-ui,sans-serif}
.pk.is-visible{opacity:1}.pk::before,.pk::after{content:'';position:absolute;pointer-events:none;background:var(--pk-line);opacity:.55}.pk::before{width:1px;top:0;bottom:0;left:8vw}.pk::after{height:1px;left:0;right:0;top:18vh}
.pk-frame{width:min(1220px,100%);min-height:min(690px,calc(100vh - 120px));margin:0 auto;border:1px solid var(--pk-line);display:grid;grid-template-columns:minmax(360px,.9fr) minmax(480px,1.1fr);background:var(--pk-panel);position:relative;z-index:1}
.pk-identity{padding:clamp(24px,4vw,48px);border-right:1px solid var(--pk-line);display:flex;flex-direction:column;justify-content:space-between;min-width:0;opacity:0;transform:translateX(-28px);transition:opacity .65s ease,transform .65s cubic-bezier(.22,1,.36,1)}
.pk.is-visible .pk-identity{opacity:1;transform:none}
.pk-kicker,.pk-choice-kicker{font:700 10px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.22em;color:var(--ac);display:flex;align-items:center;gap:10px}.pk-kicker span{display:block;width:28px;height:1px;background:var(--ac)}
.pk-portrait-wrap{width:min(340px,85%);aspect-ratio:1/1.04;position:relative;align-self:center;margin:26px 0 22px;border:1px solid rgba(var(--ac1),.38);border-radius:28px 28px 28px 7px;overflow:hidden;background:var(--pk-bg)}
.pk-portrait-wrap::before{content:'';position:absolute;left:16px;top:16px;width:30px;height:30px;border-left:1px solid var(--ac);border-top:1px solid var(--ac);z-index:2}.pk-portrait-wrap img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;transform:scale(1.02)}
.pk-portrait-index{position:absolute;right:15px;top:14px;z-index:2;color:var(--ac);font:700 10px ui-monospace,Menlo,monospace;letter-spacing:.18em}
.pk-portrait-caption{position:absolute;inset:auto 0 0;display:flex;justify-content:space-between;gap:12px;padding:13px 16px;background:#08111f;color:#d8e1ed;font:9px ui-monospace,Menlo,monospace;letter-spacing:.13em;text-transform:uppercase}.pk-portrait-caption span:last-child{color:#e0a83a;text-align:right}
.pk-identity-copy h1{font-family:'Syne',system-ui,sans-serif;font-size:clamp(2rem,3.5vw,3.7rem);line-height:.92;letter-spacing:-.045em;text-transform:uppercase;margin:15px 0 8px}.pk-identity-copy p{color:var(--pk-soft);font-size:.92rem;margin:0}
.pk-available{font:600 10px ui-monospace,Menlo,monospace;letter-spacing:.08em;color:var(--ac);display:flex;align-items:center;gap:8px}.pk-available i{display:block;width:7px;height:7px;border-radius:50%;background:#3ddc97;box-shadow:0 0 0 4px rgba(61,220,151,.1)}
.pk-choices{padding:clamp(32px,6vw,76px);display:flex;justify-content:center;flex-direction:column;min-width:0;opacity:0;transform:translateY(24px);transition:opacity .65s .12s ease,transform .65s .12s cubic-bezier(.22,1,.36,1)}.pk.is-visible .pk-choices{opacity:1;transform:none}
.pk-choices h2{font-family:'Syne',system-ui,sans-serif;font-size:clamp(2.6rem,5.5vw,5.7rem);line-height:.88;letter-spacing:-.055em;text-transform:uppercase;margin:22px 0 18px}.pk-choice-lead{color:var(--pk-soft);font-size:.95rem;margin:0 0 34px}
.pk-options{display:flex;flex-direction:column;border-top:1px solid var(--pk-line)}
.pk-option{appearance:none;width:100%;display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:16px;text-align:left;padding:22px 4px;border:0;border-bottom:1px solid var(--pk-line);background:transparent;color:var(--pk-text);cursor:pointer;transition:padding .24s ease,background-color .24s ease,opacity .28s ease,transform .45s cubic-bezier(.22,1,.36,1)}
.pk-option:hover,.pk-option:focus-visible{padding-left:16px;background:rgba(var(--ac1),.07);outline:none}.pk-option:focus-visible{box-shadow:inset 3px 0 0 var(--ac)}.pk-option:disabled{cursor:default}
.pk-option-no{color:var(--ac);font:700 11px ui-monospace,Menlo,monospace}.pk-option-copy{display:flex;flex-direction:column;gap:5px}.pk-option-copy strong{font-family:'Syne',system-ui,sans-serif;font-size:clamp(1.2rem,2vw,1.55rem)}.pk-option-copy small{color:var(--pk-soft);font-size:.8rem}.pk-option-glyph{color:var(--ac);font:700 16px ui-monospace,Menlo,monospace;min-width:28px;text-align:right}
.pk-keyhint{margin-top:22px;color:var(--pk-soft);display:flex;align-items:center;gap:8px;font:9px ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase}.pk-keyhint kbd{border:1px solid var(--pk-line);border-bottom-width:2px;border-radius:5px;padding:4px 7px;color:var(--pk-text);font:inherit}.pk-keyhint>span{width:16px;height:1px;background:var(--pk-line);margin:0 4px}
.pk.is-selecting .pk-option:not(.is-selected){opacity:.12;transform:translateX(24px)}.pk.is-selecting .pk-option.is-selected{background:var(--ac);color:#08111f;padding-left:16px;transform:scale(1.01)}.pk.is-selecting .pk-option.is-selected .pk-option-no,.pk.is-selecting .pk-option.is-selected .pk-option-glyph,.pk.is-selecting .pk-option.is-selected small{color:#08111f}.pk.is-selecting .pk-identity{opacity:.25;transform:scale(.985)}
@media (max-width:900px){.pk{align-items:flex-start;overflow:auto}.pk-frame{grid-template-columns:1fr;min-height:0}.pk-identity{border-right:0;border-bottom:1px solid var(--pk-line)}.pk-portrait-wrap{width:min(280px,76vw)}.pk-identity-copy h1{font-size:clamp(2rem,10vw,3.6rem)}.pk-choices{padding:34px 24px 42px}.pk-choices h2{font-size:clamp(2.6rem,12vw,5rem)}}
@media (max-width:520px){.pk{padding:74px 10px 18px}.pk-identity{padding:20px 16px;display:grid;grid-template-columns:124px 1fr;gap:16px;align-items:center}.pk-kicker{grid-column:1/-1}.pk-portrait-wrap{width:124px;margin:2px 0;align-self:auto;border-radius:18px 18px 18px 5px}.pk-portrait-wrap::before{left:10px;top:10px;width:20px;height:20px}.pk-portrait-index{right:9px;top:9px}.pk-portrait-caption{display:none}.pk-identity-copy h1{font-size:1.55rem;line-height:.94;margin:11px 0 7px}.pk-identity-copy p{font-size:.78rem;line-height:1.4}.pk-available{font-size:7px;letter-spacing:.03em;gap:5px}.pk-choices{padding:27px 24px 34px}.pk-choices h2{font-size:2.5rem;margin:16px 0 12px}.pk-choice-lead{font-size:.82rem;margin-bottom:22px}.pk-option{grid-template-columns:34px 1fr auto;gap:10px;padding:17px 2px}.pk-option-copy strong{font-size:1.12rem}.pk-option-copy small{max-width:27ch;font-size:.72rem}}
@media (prefers-reduced-motion:reduce){.pk,.pk-identity,.pk-choices,.pk-option{transition-duration:.01ms!important}}
`;
