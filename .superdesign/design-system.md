# Rian.dev Design System

## Product

Personal full-stack developer portfolio presenting project work, technical credibility, certificates, and contact paths. The homepage should feel precise, editorial, technical, and memorable without looking like a generic developer dashboard.

## Visual language

- Use deep navy surfaces with restrained ochre/gold accents.
- Dark background: `#08111f`; dark panels: `#0b1725` and `#101e2e`.
- Light background: `#eef2f6`; light panels: `#f7f9fb` and `#e8edf2`.
- Accent dark theme: `#e0a83a`; accent light theme: `#9c6a12`.
- Primary text dark theme: `#e7edf5`; primary text light theme: `#10233f`.
- Display typography: Syne, weights 600–800, tight tracking.
- Body typography: DM Sans, weights 400–600.
- Technical labels: system monospace, uppercase, wide tracking.
- Borders are thin and low-contrast; radii are 16–22px; shadows are broad and subtle.
- Decorative details may include grid lines, corner brackets, orbit rings, scan lines, and technical microcopy.
- Portrait lighting stays neutral and photographic; avoid neon rim lights, colored halos, bloom, and synthetic AI-style glow.

## Motion

- Motion should feel cinematic but controlled: a short card settle, transform-only shutter sweep, masked headline reveal, and staggered content entrance.
- Prefer `transform` and `opacity`; avoid animating layout properties, large blurs, or filters.
- Entrance duration should remain around 1.1 seconds and run once via IntersectionObserver.
- Continuous decorative motion must be slow and minimal.
- Always provide a `prefers-reduced-motion: reduce` fallback that reveals content immediately.

## Components

- Navbar: rounded floating desktop bar and fixed mobile bottom navigation.
- Profile preview: two-column editorial card, portrait left and profile content right; stack below 860px.
- Buttons: pill-shaped, solid accent primary and outlined secondary.
- Status: compact glass pill with green availability dot.

## Constraints

- Keep the current English copy, portrait asset, information hierarchy, responsiveness, and dark/light theme support.
- Do not introduce new colors, fonts, gradients, or visual styles outside this system.
- Preserve accessibility, text contrast, semantic headings, and keyboard navigation.
