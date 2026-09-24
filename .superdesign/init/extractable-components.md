# Extractable Components

## Navbar
- Source: `app/src/components/Navbar.jsx`
- Category: layout
- Description: Responsive top navigation with desktop links, theme toggle, and mobile bottom navigation.
- Extractable props: active route, theme.
- Hardcoded: Rian.dev wordmark, route labels, Lucide icons, component CSS.

## Footer
- Source: `app/src/components/Footer.jsx`
- Category: layout
- Description: Portfolio footer with contact and identity information.
- Extractable props: theme.
- Hardcoded: labels, links, decorative marks.

## MainLayout
- Source: `app/src/layouts/MainLayout.jsx`
- Category: layout
- Description: Global page shell, ambient background, and content wrapper.
- Extractable props: children.
- Hardcoded: background effects and responsive styling.

## CustomCursor
- Source: `app/src/components/CustomCursor.jsx`
- Category: basic
- Description: Gold ring-and-dot pointer that follows mouse input across routes.
- Extractable props: none.
- Hardcoded: size, hover behavior, accent tokens.

## AboutPreview
- Source: `app/src/components/AboutPreview.jsx`
- Category: basic
- Description: Editorial technical profile card with portrait, stats, technologies, and project CTAs.
- Extractable props: theme.
- Hardcoded: portrait, profile copy, stats, technology labels, routes.
