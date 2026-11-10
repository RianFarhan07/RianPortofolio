// Microsoft Clarity: visits, engagement, heatmaps and session recordings, plus
// custom events for what a recruiter actually does here (download the CV,
// reach out, open a project, follow a demo link).
//
// - The Clarity script loads only in production builds, only once the page has
//   finished loading, and never for automated browsers (the prerender step and
//   Playwright both run with navigator.webdriver = true).
// - Visit any page with ?analytics=off to stop tracking your own browser
//   (remembered in localStorage); ?analytics=on turns it back on.
// - Events are only sent when Clarity is on the page, so in dev they no-op.

const env = import.meta.env ?? {};
// Clarity project "rianfarhan.my.id" (public, it ships in every page anyway).
// VITE_CLARITY_ID overrides it, e.g. to point a test build at another project.
const CLARITY_ID = env.VITE_CLARITY_ID || "zbeuor45kt";
const OPT_OUT_KEY = "rian-analytics-off";

export function trackEvent(name) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("event", name);
  }
}

export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** The event a click on this link should log, or null for internal navigation. */
export function linkEvent(href, origin) {
  let url;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (/\.pdf$/i.test(url.pathname) && /cv/i.test(url.pathname)) return "cv_download";
  if (url.protocol === "mailto:") return "contact_email";
  if (url.protocol === "tel:") return "contact_phone";
  if (host === "wa.me" || host.endsWith("whatsapp.com")) return "contact_whatsapp";
  if (host.endsWith("linkedin.com")) return "contact_linkedin";
  if (host.endsWith("github.com")) return "contact_github";
  if (host.endsWith("instagram.com")) return "contact_instagram";
  if (/^https?:$/.test(url.protocol) && url.origin !== origin) return `outbound_${host}`;
  return null;
}

function optedOut() {
  try {
    const flag = new URLSearchParams(window.location.search).get("analytics");
    if (flag === "off") localStorage.setItem(OPT_OUT_KEY, "1");
    if (flag === "on") localStorage.removeItem(OPT_OUT_KEY);
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

function loadClarity(id) {
  // Same queue stub as Clarity's official snippet: calls made before the
  // script arrives are kept and replayed.
  window.clarity =
    window.clarity ||
    function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

export function startAnalytics() {
  if (typeof window === "undefined") return;

  // Link clicks are tracked in one place instead of in every component.
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!link) return;
      const name = linkEvent(link.getAttribute("href"), window.location.origin);
      if (name) trackEvent(name);
    },
    { capture: true },
  );

  if (!env.PROD || !CLARITY_ID || navigator.webdriver || optedOut()) return;

  const load = () => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    idle(() => loadClarity(CLARITY_ID), { timeout: 4000 });
  };
  if (document.readyState === "complete") load();
  else window.addEventListener("load", load, { once: true });
}
