// Microsoft Clarity: visits, engagement, heatmaps and session recordings, plus
// custom events and tags for what a recruiter actually does here.
//
// - The Clarity script loads only in production builds, only once the page has
//   finished loading, and never for automated browsers (the prerender step and
//   Playwright both run with navigator.webdriver = true).
// - Visit any page with ?analytics=off to stop tracking your own browser
//   (remembered in localStorage); ?analytics=on turns it back on.
// - Links shared with ?ref=<source> (cv, linkedin, kalibrr, a company name...)
//   tag the whole session with that source, so Clarity can filter by it.
// - Events and tags are only sent when Clarity is enabled, so in dev they no-op.

const env = import.meta.env ?? {};
// Clarity project "rianfarhan.my.id" (public, it ships in every page anyway).
// VITE_CLARITY_ID overrides it, e.g. to point a test build at another project.
const CLARITY_ID = env.VITE_CLARITY_ID || "zbeuor45kt";
const OPT_OUT_KEY = "rian-analytics-off";
const REF_KEY = "rian-analytics-ref";

function call(...args) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity(...args);
  }
}

export function trackEvent(name) {
  call("event", name);
}

export function setTag(key, value) {
  call("set", key, String(value));
}

export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** A ?ref= value made safe to use as a tag: lowercase, [a-z0-9_-], max 40 chars. */
export function cleanRef(raw) {
  const value = String(raw ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return value || null;
}

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

/** The session's source: ?ref= on this visit, or the one the session arrived with. */
function sessionRef() {
  try {
    const fromUrl = cleanRef(new URLSearchParams(window.location.search).get("ref"));
    if (fromUrl) sessionStorage.setItem(REF_KEY, fromUrl);
    return sessionStorage.getItem(REF_KEY);
  } catch {
    return null;
  }
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

  // Clarity's own queue stub (same as its official snippet): everything sent
  // before the script arrives is kept and replayed, so tags set during the
  // first render are not lost.
  window.clarity =
    window.clarity ||
    function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

  const ref = sessionRef();
  if (ref) setTag("ref", ref);

  const load = () => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    idle(
      () => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_ID)}`;
        document.head.appendChild(script);
      },
      { timeout: 4000 },
    );
  };
  if (document.readyState === "complete") load();
  else window.addEventListener("load", load, { once: true });
}
