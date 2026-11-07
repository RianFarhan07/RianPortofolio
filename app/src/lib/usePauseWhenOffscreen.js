import { useCallback, useEffect, useRef } from "react";

/*
  Pause every CSS animation inside an element while it is off-screen.

  Decorative loops (scan lines, pulse dots, scroll arrows) used to keep ticking
  in every section of the home page, all the time. Paired with the rule in
  index.css ([data-offscreen] … animation-play-state: paused), this marks the
  element while it is out of view so only the section you are looking at
  animates.

  Returns a callback ref so it follows components that swap between mobile and
  desktop markup, and can be combined with other refs:
    ref={(el) => { inViewRef(el); pauseRef(el); }}
*/
export function usePauseWhenOffscreen(rootMargin = "25% 0px") {
  const detach = useRef(null);

  useEffect(() => () => detach.current?.(), []);

  return useCallback(
    (node) => {
      detach.current?.();
      detach.current = null;
      if (!node || typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        ([entry]) => node.toggleAttribute("data-offscreen", !entry.isIntersecting),
        { rootMargin },
      );
      observer.observe(node);
      detach.current = () => {
        observer.disconnect();
        node.removeAttribute("data-offscreen");
      };
    },
    [rootMargin],
  );
}
