import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE, DEFAULT_OG_IMAGE, seoForPath } from "./seoConfig";

// Rewriting the tags index.html already ships beats rendering new ones:
// a second <title> or <link rel=canonical> leaves crawlers to pick a winner.
function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setMetaName(name, content) {
  setTag(
    `meta[name="${name}"]`,
    () => Object.assign(document.createElement("meta"), { name }),
    "content",
    content
  );
}

function setMetaProperty(property, content) {
  setTag(
    `meta[property="${property}"]`,
    () => {
      const m = document.createElement("meta");
      m.setAttribute("property", property);
      return m;
    },
    "content",
    content
  );
}

function setBreadcrumb(trail) {
  const id = "seo-breadcrumb";
  const existing = document.getElementById(id);
  if (!trail.length) {
    existing?.remove();
    return;
  }
  const script = existing || document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"], ...trail].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE}${path === "/" ? "/" : path}`,
    })),
  });
  if (!existing) document.head.appendChild(script);
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoForPath(pathname);
    const url = `${SITE}${seo.path === "/" ? "/" : seo.path}`;

    document.title = seo.title;
    setMetaName("description", seo.description);
    setMetaName(
      "robots",
      seo.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"
    );

    setTag(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      "href",
      url
    );

    setMetaProperty("og:url", url);
    setMetaProperty("og:title", seo.title);
    setMetaProperty("og:description", seo.description);
    setMetaProperty("og:type", seo.path === "/" ? "profile" : "website");
    setMetaProperty("og:image", DEFAULT_OG_IMAGE);

    setMetaName("twitter:url", url);
    setMetaName("twitter:title", seo.title);
    setMetaName("twitter:description", seo.description);
    setMetaName("twitter:image", DEFAULT_OG_IMAGE);

    setBreadcrumb(seo.breadcrumb);
  }, [pathname]);

  return null;
}
