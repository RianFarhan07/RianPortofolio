// Per-route SEO. The static tags in index.html cover the homepage and any
// crawler that doesn't run JS; SeoManager rewrites them on every navigation.

export const SITE = "https://rianfarhan.my.id";

export const DEFAULT_OG_IMAGE = `${SITE}/og-image.jpg`;

export const ROUTE_SEO = {
  "/": {
    title: "Baso Rian Farhan Mallanti — Software Engineer & Fullstack Developer",
    description:
      "Baso Rian Farhan Mallanti (Rian Farhan) — software engineer, product engineer, and fullstack developer in Makassar, Indonesia. 20+ shipped apps across MERN, Next.js, Kotlin, and Flutter.",
    breadcrumb: [],
  },

  "/projects": {
    title: "Projects — 20+ Web & Android Apps by Baso Rian Farhan Mallanti",
    description:
      "Selected works by Rian Farhan: 20+ production web and mobile apps built end-to-end with the MERN stack, Next.js, Kotlin, React Native, and Flutter. Live links and source included.",
    breadcrumb: [["Projects", "/projects"]],
  },

  "/about": {
    title: "About Baso Rian Farhan Mallanti — Software Engineer, Makassar",
    description:
      "Who is Baso Rian Farhan Mallanti? A software engineer and fullstack developer from Makassar, Universitas Negeri Makassar informatics alumnus, now Fullstack Developer Associate Manager at CarbonEthics.",
    breadcrumb: [["About", "/about"]],
  },

  "/certificates": {
    title: "Certificates & Credentials — Baso Rian Farhan Mallanti",
    description:
      "Verified certifications and training completed by Rian Farhan, covering fullstack web development, Android and Kotlin, React, and software engineering fundamentals.",
    breadcrumb: [["Certificates", "/certificates"]],
  },

  "/contact": {
    title: "Contact Baso Rian Farhan Mallanti — Hire a Fullstack Developer",
    description:
      "Get in touch with Rian Farhan, a software engineer and fullstack developer based in Makassar, Indonesia. Open to work, freelance projects, remote roles, and collaboration.",
    breadcrumb: [["Contact", "/contact"]],
  },
};

export const NOT_FOUND_SEO = {
  title: "Page not found — Baso Rian Farhan Mallanti",
  description: "This page does not exist. Head back to the portfolio homepage.",
  noindex: true,
  breadcrumb: [],
};

// "/projects/" and "/Projects" should resolve to the same entry as "/projects".
export function seoForPath(pathname) {
  const key =
    pathname.length > 1 ? pathname.replace(/\/+$/, "").toLowerCase() : "/";
  return ROUTE_SEO[key] ? { path: key, ...ROUTE_SEO[key] } : { path: key, ...NOT_FOUND_SEO };
}
