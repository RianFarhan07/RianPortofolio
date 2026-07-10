import { useState, useEffect, useRef, useContext } from "react";
import { useTheme } from "../context/ThemeContext";
import { IntroContext } from "./PageTransition6Clean";
import { Terminal, Download, Github, Linkedin, Mail } from "lucide-react";
import rianPhoto from "../assets/rian_animate.webp";

/* ──────────────────────────────────────────────
   DATA
────────────────────────────────────────────── */
const EXPERIENCES = [
  { role: "Fullstack Developer Associate Manager", org: "Carbonethics", period: "2024 → now", desc: "End-to-end web solutions aligned with sustainability initiatives." },
  { role: "Freelance Android Developer", org: "SMKN 4 Jeneponto", period: "2023", desc: "Built & maintained Android apps for school needs using Kotlin." },
  { role: "IT Support", org: "Dept. of Manpower, Makassar", period: "2022 → 23", desc: "Daily technical support, hardware/software & internal networks." },
];
const EDUCATION = [
  { degree: "B.Sc Informatics", org: "Universitas Negeri Makassar", period: "2020 → 24", desc: "Computer science, software development & IT fundamentals." },
  { degree: "Fullstack JS Bootcamp", org: "Hacktiv8", period: "2024 → 25", desc: "React, Node.js, Express, MongoDB — intensive fullstack track." },
];
const SKILLS = [
  { name: "React / Next.js", pct: 90 }, { name: "TypeScript", pct: 85 },
  { name: "React Native", pct: 80 }, { name: "Node / API", pct: 85 },
  { name: "Kotlin / Flutter", pct: 75 }, { name: "PHP", pct: 75 },
];
const STACK = ["React", "Next.js", "React Native", "Flutter", "TypeScript", "JavaScript", "Kotlin", "PHP", "Node.js", "Express", "MongoDB", "PostgreSQL", "Tailwind", "Figma", "Apps Script", "Git"];
const SOCIALS = { github: "https://github.com", linkedin: "https://linkedin.com", mail: "mailto:rian.mallanti@gmail.com" };
const CV = "/rianCV.pdf";

/* ──────────────────────────────────────────────
   COMPONENT
────────────────────────────────────────────── */
export default function About() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [view, setView] = useState("terminal"); // 'terminal' | 'page'
  const [barsIn, setBarsIn] = useState(false);

  const { introExited, pageTransitionDone } = useContext(IntroContext);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (introExited && pageTransitionDone) setVisible(true);
    }, 120);
    return () => clearTimeout(t);
  }, [introExited, pageTransitionDone]);

  const bodyRef = useRef(null);
  const apiRef = useRef(null);
  const setViewRef = useRef(setView);
  const toggleThemeRef = useRef(toggleTheme);
  setViewRef.current = setView;
  toggleThemeRef.current = toggleTheme;

  /* page-view skill bars reveal */
  useEffect(() => {
    if (view !== "page") { setBarsIn(false); return; }
    const t = setTimeout(() => setBarsIn(true), 140);
    return () => clearTimeout(t);
  }, [view]);

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
      + '<div><span class="k">company</span> Carbonethics</div><div><span class="k">location</span> Makassar, ID</div>'
      + '<div><span class="k">uptime</span> 4+ years</div><div><span class="k">projects</span> 50+</div>'
      + '<div><span class="k">status</span> <span class="ok">● open_to_work</span></div></div></div>';
    const bio = '<span class="muted">"""</span> Crafting elegant solutions to complex problems. Specialized in building modern web &amp; mobile applications with exceptional user experiences. <span class="muted">"""</span>';
    const exp = EXPERIENCES.map((e) => `<div class="rec"><span class="ok">▸ ${e.period}</span>  ${e.role} · <span class="hl">${e.org}</span><div class="sub">${e.desc}</div></div>`).join("");
    const edu = EDUCATION.map((e) => `<div class="rec"><span class="ok">🎓 ${e.period}</span>  ${e.degree} · <span class="hl">${e.org}</span></div>`).join("");
    const bar = (l, n) => `<div class="sk"><span class="lbl">${l}</span><span class="bar"><i data-w="${n}"></i></span><span class="pc">${n}</span></div>`;
    const skills = '<div class="skcat"># frontend</div>' + bar("react / next", 90) + bar("typescript", 85) + bar("html / css", 95)
      + '<div class="skcat"># mobile</div>' + bar("react native", 80) + bar("kotlin", 75) + bar("flutter", 70)
      + '<div class="skcat"># backend &amp; design</div>' + bar("node / api", 85) + bar("php", 75) + bar("figma / ui", 85);
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
    ? { "--term": "#0a1322", "--chrome": "#0c1526", "--line": "#16233c", "--txt": "#c5d4e8", "--muted": "#5d6f8e", "--ok": "#3ddc97", "--path": "#ffcf6a", "--hl": "#9ec9ff", "--mag": "#c792ea", "--err": "#ff7a7a" }
    : { "--term": "#f6faf8", "--chrome": "#ffffff", "--line": "#dde8e2", "--txt": "#1e2a3b", "--muted": "#7c8aa0", "--ok": "#0f9d6b", "--path": "#b5862a", "--hl": "#2563a8", "--mag": "#8b5cf6", "--err": "#d4453b" };
  const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

  /* ── PAGE VIEW (readable, mirip hero) ── */
  if (view === "page") {
    const soft = isDark ? "rgba(220,230,255,.7)" : "rgba(10,18,48,.7)";
    const muted = isDark ? "rgba(220,230,255,.5)" : "rgba(10,18,48,.5)";
    const txt = isDark ? "#eaf1fb" : "#0a1230";
    const card = isDark ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.55)";
    const line = isDark ? "rgba(120,160,220,.14)" : "rgba(16,120,100,.16)";
    const strk = isDark ? "rgba(255,255,255,.16)" : "rgba(10,18,48,.16)";
    return (
      <div className="bp" style={{ minHeight: "100vh", fontFamily: "'DM Sans',system-ui,sans-serif", color: txt, padding: "90px clamp(20px,4vw,40px) 60px", maxWidth: 1160, margin: "0 auto", opacity: visible ? 1 : 0, transition: "opacity 0.4s" }}>
        <style>{bpCss}</style>

        <div className="bp-top">
          <button className="bp-tbtn" onClick={() => setView("terminal")}><Terminal size={14} /> view as terminal</button>
        </div>

        {/* HERO */}
        <div className="bp-hero">
          <div>
            <div className="bp-eyebrow">console.log("Hello, World!")</div>
            <h1 className="bp-title"><span className="l1">Rian</span><span className="l2" style={{ WebkitTextStroke: `2px ${strk}` }}>Farhan</span></h1>
            <p className="bp-role" style={{ color: soft }}>Full Stack Developer · Mobile · UI/UX</p>
            <span className="bp-badge"><span className="bp-dot" /> Available · Fullstack Dev @ Carbonethics</span>
            <p className="bp-lead" style={{ color: muted }}>Crafting elegant solutions to complex problems. Specialized in building modern web &amp; mobile applications with exceptional user experiences.</p>
            <div className="bp-actions">
              <a className="bp-cv" href={CV} target="_blank" rel="noreferrer"><Download size={16} /> Download CV</a>
              <a className="bp-soc" href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
              <a className="bp-soc" href={SOCIALS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a className="bp-soc" href={SOCIALS.mail} aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>
          <div className="bp-photo"><div className="bp-ava"><img loading="lazy" decoding="async" src={rianPhoto} alt="Rian Farhan" /><span className="bp-st" style={{ borderColor: isDark ? "#06101e" : "#eef5f1" }} /></div></div>
        </div>

        {/* STATS */}
        <div className="bp-stats" style={{ borderColor: line }}>
          {[["50", "+", "Projects Done"], ["4", "+", "Years Exp"], ["99", "%", "Satisfaction"]].map(([n, s, l]) => (
            <div className="bp-stat" key={l}><div className="n" style={{ color: txt }}>{n}<em>{s}</em></div><div className="l" style={{ color: muted }}>{l}</div></div>
          ))}
        </div>

        {/* EXP + EDU */}
        <section className="bp-s" style={{ borderColor: line }}>
          <div className="bp-grid2">
            <div>
              <div className="bp-label"><span className="no" style={{ color: strk }}>01</span> Experience</div>
              {EXPERIENCES.map((e) => (
                <div className="bp-card" key={e.role} style={{ background: card, borderColor: line }}>
                  <div className="h" style={{ color: txt }}><span className="ac">$</span> {e.role}</div>
                  <div className="meta" style={{ color: muted }}>@ {e.org} · {e.period}</div>
                  <div className="d" style={{ color: soft }}>{e.desc}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="bp-label"><span className="no" style={{ color: strk }}>02</span> Education</div>
              {EDUCATION.map((e) => (
                <div className="bp-card" key={e.degree} style={{ background: card, borderColor: line }}>
                  <div className="h" style={{ color: txt }}>🎓 {e.degree}</div>
                  <div className="meta" style={{ color: muted }}>@ {e.org} · {e.period}</div>
                  <div className="d" style={{ color: soft }}>{e.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="bp-s" style={{ borderColor: line }}>
          <div className="bp-label"><span className="no" style={{ color: strk }}>03</span> Skills</div>
          <div className="bp-grid2">
            {[SKILLS.slice(0, 3), SKILLS.slice(3)].map((col, ci) => (
              <div key={ci}>
                {col.map((s) => (
                  <div className="bp-skill" key={s.name}>
                    <div className="top"><span style={{ color: soft }}>{s.name}</span><span className="pc">{s.pct}%</span></div>
                    <div className="track" style={{ background: line }}><i style={{ width: barsIn ? `${s.pct}%` : "0%" }} /></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* STACK */}
        <section className="bp-s" style={{ borderColor: line }}>
          <div className="bp-label"><span className="no" style={{ color: strk }}>04</span> Tech Stack</div>
          <div className="bp-chips">{STACK.map((t) => <span className="bp-chip" key={t} style={{ background: card }}>{t}</span>)}</div>
        </section>

        {/* CTA */}
        <section className="bp-s" style={{ borderColor: line }}>
          <div className="bp-cta">
            <h2 style={{ color: txt }}>Let's build something <span className="ac">amazing</span></h2>
            <p style={{ color: muted }}>I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
            <a className="bp-cv" href="/contact"><Terminal size={16} /> Start a Conversation</a>
          </div>
        </section>
      </div>
    );
  }

  /* ── TERMINAL VIEW (default) ── */
  return (
    <div className="bt" style={{ ...tv, "--mono": mono, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "90px 16px 40px", fontFamily: mono, opacity: visible ? 1 : 0, transition: "opacity 0.4s" }}>
      <style>{btCss}</style>
      <div className="term-win">
        <div className="term-bar">
          <div className="dots"><span className="dot" style={{ background: "#ff5f57" }} /><span className="dot" style={{ background: "#febc2e" }} /><span className="dot" style={{ background: "#28c840" }} /></div>
          <div className="term-title"><b>rian@portfolio</b> : ~/about — zsh</div>
          <button className="vbtn" onClick={() => setView("page")}>▦ read as page</button>
        </div>
        <div className="term-body" ref={bodyRef} />
        <div className="qchips">
          {["help", "whoami", "experience", "skills", "projects", "contact"].map((c) => (
            <button key={c} onClick={() => apiRef.current && apiRef.current.run(c)}>{c}</button>
          ))}
        </div>
        <div className="term-status"><span>⎇ main</span><span>● open_to_work</span><span>📍 Makassar, ID</span><span className="sp">TSX · UTF-8</span></div>
        <div className="crt" />
      </div>
    </div>
  );
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
.bt .nf-ava{width:84px;height:84px;border-radius:16px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:30px;letter-spacing:1px;color:#04121a;background:linear-gradient(135deg,var(--ac),color-mix(in srgb,var(--ac) 50%,var(--ok)));box-shadow:0 0 26px rgba(var(--ac2),.4)}
.bt .nf-info>div{display:flex;gap:10px}.bt .nf-info .k{color:var(--ac);min-width:78px;display:inline-block}
.bt .rec{margin-bottom:11px}.bt .rec .sub{color:var(--muted);font-size:12px;padding-left:16px;line-height:1.5}
.bt .skcat{color:var(--mag);margin:10px 0 5px;font-size:12px}
.bt .sk{display:grid;grid-template-columns:130px 1fr 36px;align-items:center;gap:12px;margin:5px 0 5px 14px;font-size:12.5px}
.bt .sk .lbl{color:var(--hl)}.bt .sk .bar{height:7px;border-radius:6px;background:var(--line);overflow:hidden}
.bt .sk .bar>i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,var(--ac),var(--ok));width:0;transition:width 1s cubic-bezier(.2,.8,.2,1)}
.bt .sk .pc{color:var(--ac);text-align:right;font-variant-numeric:tabular-nums}
.bt .chips{display:flex;flex-wrap:wrap;gap:7px}
.bt .chip{font-size:11.5px;color:var(--txt);background:rgba(var(--ac2),.08);border:1px solid rgba(var(--ac2),.25);border-radius:7px;padding:5px 10px}.bt .chip .k{color:var(--ac)}
.bt .cta{display:flex;flex-wrap:wrap;gap:9px;margin:6px 0 12px}
.bt .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:9px;font-size:12.5px;text-decoration:none;cursor:pointer}
.bt .btn.primary{background:linear-gradient(135deg,var(--ac),color-mix(in srgb,var(--ac) 55%,var(--ok)));color:#04121a;font-weight:600}
.bt .btn.ghost{background:transparent;border:1px solid rgba(var(--ac2),.35);color:var(--txt)}
.bt .cta-line{font-size:13px}
.bt .cf-box{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:7}
.bt .cf-box i{position:absolute;top:-14px;width:8px;height:12px;border-radius:2px;animation:bt-cf linear forwards}
.bt .mtx{position:absolute;inset:0;z-index:6;pointer-events:none}
`;

const bpCss = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
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
.bp-badge{display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:7px 15px;border-radius:100px;font-size:13px;background:rgba(var(--ac1),.1);border:1px solid rgba(var(--ac1),.32);color:var(--ac)}
.bp-dot{width:8px;height:8px;border-radius:50%;background:var(--ac);animation:bp-pulse 2s infinite}
.bp-lead{font-size:clamp(.95rem,1.4vw,1.05rem);line-height:1.7;max-width:52ch;margin:20px 0 0}
.bp-actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:26px}
.bp-cv{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:100px;font-weight:500;font-size:.9rem;color:#04121a;background:linear-gradient(135deg,var(--ac-deep,#0066ff),var(--ac));box-shadow:0 0 30px rgba(var(--ac1),.4);text-decoration:none;border:none;cursor:pointer}
.bp-soc{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(var(--ac1),.06);border:1px solid rgba(var(--ac1),.2);color:inherit;text-decoration:none}
.bp-soc:hover{border-color:var(--ac);color:var(--ac)}
.bp-photo{justify-self:center}
.bp-ava{width:clamp(190px,26vw,300px);height:clamp(190px,26vw,300px);border-radius:28px;position:relative;overflow:hidden;box-shadow:0 30px 80px -24px rgba(var(--ac1),.55),0 0 0 1px rgba(var(--ac1),.3)}
.bp-ava img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.bp-st{position:absolute;bottom:14px;right:14px;width:18px;height:18px;border-radius:50%;background:#3ddc97;border:3px solid #06101e;z-index:2}
.bp-stats{display:flex;gap:clamp(20px,4vw,52px);flex-wrap:wrap;border-top:1px solid;padding-top:22px;margin-top:8px}
.bp-stat .n{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.8rem,3.4vw,2.6rem);line-height:1}.bp-stat .n em{font-style:normal;color:var(--ac)}
.bp-stat .l{font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;margin-top:6px}
.bp-s{padding:clamp(34px,5vw,60px) 0;border-top:1px solid}
.bp-label{font-family:ui-monospace,Menlo,monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--ac);display:flex;align-items:center;gap:10px;margin-bottom:24px}
.bp-label .no{font-family:'Syne',sans-serif;font-weight:800;font-size:22px}
.bp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,3vw,40px)}
@media (max-width:820px){.bp-grid2{grid-template-columns:1fr;gap:26px}}
.bp-card{border:1px solid;border-radius:14px;padding:16px 18px;backdrop-filter:blur(8px)}
.bp-card+.bp-card{margin-top:14px}
.bp-card .h{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem}.bp-card .h .ac{color:var(--ac)}
.bp-card .meta{font-family:ui-monospace,Menlo,monospace;font-size:12px;margin:4px 0 8px}
.bp-card .d{font-size:.86rem;line-height:1.6}
.bp-skill{margin:0 0 14px}
.bp-skill .top{display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:7px}
.bp-skill .top .pc{font-family:'Syne',sans-serif;font-weight:700;color:var(--ac)}
.bp-skill .track{height:8px;border-radius:5px;overflow:hidden}
.bp-skill .track>i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,var(--ac-deep,#0066ff),var(--ac));transition:width 1.1s cubic-bezier(.2,.8,.2,1)}
.bp-chips{display:flex;flex-wrap:wrap;gap:9px}
.bp-chip{font-family:ui-monospace,Menlo,monospace;font-size:13px;padding:8px 14px;border-radius:9px;color:var(--ac);border:1px solid rgba(var(--ac1),.28)}
.bp-cta{text-align:center;max-width:680px;margin:0 auto}
.bp-cta h2{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.8rem,4vw,3rem);margin:0 0 14px;text-wrap:balance}
.bp-cta h2 .ac{color:var(--ac)}
.bp-cta p{line-height:1.7;margin:0 0 26px}
`;
