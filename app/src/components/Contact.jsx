import { useState, useRef, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IntroContext } from "./PageTransition6Clean";
import emailjs from "@emailjs/browser";
import { Send, Phone, Mail, MapPin, Linkedin, Github, Loader2, CheckCircle, AlertCircle, Instagram, Handshake, Clock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const A = "var(--ac)";
const AD = "var(--ac-deep)";
const AR = "var(--ac1)";
const AR2 = "var(--ac2)";

export default function Contact() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const formRef = useRef(null);
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const { introExited, pageTransitionDone } = useContext(IntroContext);
  const [visible, setVisible] = useState(false);
  const prevPTD = useRef(pageTransitionDone);
  useEffect(() => {
    if (introExited && pageTransitionDone) {
      const isTransition = !prevPTD.current && pageTransitionDone;
      const delay = isTransition ? 40 : 600;
      const t = setTimeout(() => setVisible(true), delay);
      prevPTD.current = pageTransitionDone;
      return () => clearTimeout(t);
    }
    prevPTD.current = pageTransitionDone;
  }, [introExited, pageTransitionDone]);

  const txt = isDark ? "#e7edf5" : "#10233f";
  const muted = isDark ? "rgba(210,222,235,0.45)" : "rgba(16,35,63,0.45)";
  const muted2 = isDark ? "rgba(210,222,235,0.28)" : "rgba(16,35,63,0.32)";
  const cardBg = isDark ? "rgba(10,20,32,0.96)" : "rgba(232,236,241,0.96)";
  const cardBorder = `rgba(${AR2}, 0.18)`;
  const chipBg = `rgba(${AR}, 0.06)`;
  const chipBorder = `rgba(${AR}, 0.2)`;
  const inputBg = isDark ? "rgba(10,20,32,0.7)" : "rgba(255,255,255,0.7)";

  const contactInfo = [
    { icon: <Phone size={18} />, title: "Phone", value: "+62 822 8037 2670", link: "https://wa.me/6282280372670" },
    { icon: <Mail size={18} />, title: "Email", value: "rian.mallanti@gmail.com", link: "mailto:rian.mallanti@gmail.com" },
    { icon: <MapPin size={18} />, title: "Location", value: "Barru, Sulawesi Selatan", link: "#" },
    { icon: <Clock size={18} />, title: "Available", value: "Freelance & Full-time" },
  ];

  const socialLinks = [
    { icon: <Linkedin size={16} />, url: "https://www.linkedin.com/in/baso-rian-farhan-82bb73245/" },
    { icon: <Github size={16} />, url: "https://github.com/RianFarhan07" },
    { icon: <Instagram size={16} />, url: "https://www.instagram.com/rianfarhan/" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!formState.name.trim()) newErrors.name = "Required";
    if (!formState.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formState.email)) newErrors.email = "Invalid email";
    if (!formState.subject.trim()) newErrors.subject = "Required";
    if (!formState.message.trim()) newErrors.message = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setFormStatus("submitting");
    try {
      await emailjs.send("service_gqzjzjd", "template_n3a7ndg", {
        from_name: formState.name, from_email: formState.email,
        subject: formState.subject, message: formState.message, to_name: "Rian Farhan",
      }, "2G8xLwErCmOXqXE70");
      setFormStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setFormStatus(null), 3000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  const inputCls = (field) => ({
    width: "100%", padding: "12px 16px", borderRadius: "100px",
    background: inputBg, border: `1px solid ${errors[field] ? "rgba(239,68,68,0.5)" : chipBorder}`,
    color: txt, fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <section id="contact" className="py-16 md:py-24 relative min-h-screen"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes ct-pdot{0%,100%{box-shadow:0 0 0 0 rgba(${AR},.6)}50%{box-shadow:0 0 0 5px rgba(${AR},0)}}
        @keyframes ct-scan{0%{top:0;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0}}
        .ct-scan{position:absolute;left:0;right:0;height:1px;z-index:8;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(${AR2},.3),transparent);animation:ct-scan 8s ease-in-out infinite}
        .ct-pdot{width:6px;height:6px;border-radius:50%;background:${A};flex-shrink:0;animation:ct-pdot 2s infinite}
        .ct-input:focus{border-color:${A}!important}
        .ct-gridbg{position:absolute;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(${AR2},.018) 1px,transparent 1px),linear-gradient(90deg,rgba(${AR2},.018) 1px,transparent 1px);background-size:72px 72px}
      `}</style>

      <div className="ct-gridbg" />
      <div className="ct-scan" />
      {[
        { top: 20, left: 20, borderTop: `1px solid rgba(${AR2},.3)`, borderLeft: `1px solid rgba(${AR2},.3)` },
        { top: 20, right: 20, borderTop: `1px solid rgba(${AR2},.3)`, borderRight: `1px solid rgba(${AR2},.3)` },
        { bottom: 20, left: 20, borderBottom: `1px solid rgba(${AR2},.3)`, borderLeft: `1px solid rgba(${AR2},.3)` },
        { bottom: 20, right: 20, borderBottom: `1px solid rgba(${AR2},.3)`, borderRight: `1px solid rgba(${AR2},.3)` },
      ].map((s, i) => <div key={i} className="absolute w-4 h-4 z-10 pointer-events-none" style={{ ...s }} />)}

      <div className="relative z-10" style={{ padding: "0 clamp(20px,4vw,60px)", maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <motion.div className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}>
            <div style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${A})` }} />
            <span className="text-xs tracking-[0.22em] uppercase" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: `rgba(${AR}, 0.7)` }}>Get In Touch</span>
            <motion.div className="ct-pdot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }} />
          </motion.div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(3rem, 6vw, 6.5rem)", lineHeight: 0.92, letterSpacing: "-0.04em", textTransform: "uppercase", margin: 0, color: txt }}>
            <motion.span className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}>Let's</motion.span>
            <motion.span className="block" style={{ color: "transparent", WebkitTextStroke: isDark ? "2px rgba(255,255,255,0.18)" : "2px rgba(16,35,63,0.15)", WebkitTextFillColor: "transparent" }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}>Connect</motion.span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Info card */}
          <div className="lg:col-span-5">
            <div className="rounded-[14px] p-6 md:p-8" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif", color: txt }}>Contact Info</h2>
              <div className="space-y-5 mb-8">
                {contactInfo.map((item, i) => (
                  <a key={i} href={item.link || "#"} target={item.link?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    className="flex items-center gap-4 group no-underline" style={{ color: txt }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: chipBg, border: `1px solid ${chipBorder}`, color: A }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[11px] tracking-wider uppercase mb-0.5" style={{ color: muted2 }}>{item.title}</p>
                      <p className="text-sm font-medium m-0 group-hover:underline" style={{ color: txt }}>{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="h-px mb-6" style={{ background: `rgba(${AR2}, 0.12)` }} />
              <p className="text-xs tracking-wider uppercase mb-3" style={{ color: muted2 }}>Social</p>
              <div className="flex gap-2">
                {socialLinks.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: chipBg, border: `1px solid ${chipBorder}`, color: A }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="lg:col-span-7">
            <div className="rounded-[14px] p-6 md:p-8" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif", color: txt }}>Send a Message</h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] tracking-wider uppercase mb-1.5" style={{ color: muted2, fontFamily: "'DM Sans', sans-serif" }}>Name</label>
                    <input type="text" name="name" value={formState.name} onChange={handleChange} disabled={formStatus === "submitting"}
                      className="ct-input" style={inputCls("name")} placeholder="Your name" />
                    {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-wider uppercase mb-1.5" style={{ color: muted2, fontFamily: "'DM Sans', sans-serif" }}>Email</label>
                    <input type="email" name="email" value={formState.email} onChange={handleChange} disabled={formStatus === "submitting"}
                      className="ct-input" style={inputCls("email")} placeholder="you@example.com" />
                    {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] tracking-wider uppercase mb-1.5" style={{ color: muted2, fontFamily: "'DM Sans', sans-serif" }}>Subject</label>
                  <input type="text" name="subject" value={formState.subject} onChange={handleChange} disabled={formStatus === "submitting"}
                    className="ct-input" style={inputCls("subject")} placeholder="Project inquiry" />
                  {errors.subject && <p className="text-red-400 text-[11px] mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <label className="block text-[11px] tracking-wider uppercase mb-1.5" style={{ color: muted2, fontFamily: "'DM Sans', sans-serif" }}>Message</label>
                  <textarea name="message" value={formState.message} onChange={handleChange} rows={6} disabled={formStatus === "submitting"}
                    className="ct-input" style={{ ...inputCls("message"), borderRadius: "16px", resize: "none" }} placeholder="Your message..." />
                  {errors.message && <p className="text-red-400 text-[11px] mt-1">{errors.message}</p>}
                </div>

                <AnimatePresence>
                  {formStatus === "success" && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3 rounded-full text-sm" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }}>
                      <CheckCircle size={16} /> Sent successfully!
                    </motion.div>
                  )}
                  {formStatus === "error" && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3 rounded-full text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                      <AlertCircle size={16} /> Failed — try again.
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={formStatus === "submitting"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all duration-200"
                  style={{ background: `linear-gradient(135deg, ${AD}, ${A})`, color: isDark ? "#10233f" : "#fff", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 0 20px rgba(${AR}, 0.35)`, opacity: formStatus === "submitting" ? 0.7 : 1 }}>
                  {formStatus === "submitting" ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
