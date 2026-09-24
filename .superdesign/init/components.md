# Shared UI Components

This project uses custom React components rather than a third-party primitive library. The small components below are the shared cross-page primitives most relevant to interaction behavior.

## CustomCursor

- Path: `app/src/components/CustomCursor.jsx`
- Purpose: Shared high-z-index pointer treatment used across every route.

```jsx
import { useEffect, useState } from "react";

const SIZE = 24;
const DOT = 5;

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    const onHover = (e) => {
      const el = e.target.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]'
      );
      setHover(!!el);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseover", onHover);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseover", onHover);
    };
  }, []);

  const half = SIZE / 2;
  const halfDot = DOT / 2;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          border: "2px solid var(--ac)",
          background: hover ? "rgba(var(--ac1), 0.25)" : "transparent",
          transform: `translate(${pos.x - half}px, ${pos.y - half}px)`,
          pointerEvents: "none",
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: "background 0.2s, opacity 0.1s",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: hover ? DOT * 2 : DOT,
          height: hover ? DOT * 2 : DOT,
          borderRadius: "50%",
          background: "var(--ac)",
          transform: `translate(${pos.x - (hover ? DOT : halfDot)}px, ${pos.y - (hover ? DOT : halfDot)}px)`,
          pointerEvents: "none",
          zIndex: 100000,
          opacity: visible ? 1 : 0,
          transition: "width 0.2s, height 0.2s, opacity 0.1s",
        }}
      />
    </>
  );
}
```
## ScrollToTop

- Path: `app/src/components/ScrollToTop.jsx`
- Purpose: Shared route-change scroll behavior.

```jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
```
