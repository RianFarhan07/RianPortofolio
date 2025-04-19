"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

export default function InfiniteScroll({
  // ----- Layout / Style Props -----
  width = "30rem", // Width of the outer wrapper
  maxHeight = "100%", // Max-height of the outer wrapper
  negativeMargin = "-0.5em", // Negative margin to reduce spacing between items
  // ----- Items Prop -----
  items = [], // Array of items with { content: ... }
  itemMinHeight = 150, // Fixed height for each item
  // ----- Tilt Props -----
  isTilted = false, // Whether the container is in "skewed" perspective
  tiltDirection = "left", // tiltDirection: "left" or "right"
  // ----- Autoplay Props -----
  autoplay = false, // Whether it should automatically scroll
  autoplaySpeed = 0.5, // Speed (pixels/frame approx.)
  autoplayDirection = "down", // "down" or "up"
  pauseOnHover = false, // Pause autoplay on hover
}) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  const getTiltTransform = () => {
    if (!isTilted) return "none";
    return tiltDirection === "left"
      ? "rotateX(20deg) rotateZ(-20deg) skewX(20deg)"
      : "rotateX(20deg) rotateZ(20deg) skewX(-20deg)";
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (items.length === 0) return;

    const divItems = gsap.utils.toArray(container.children);
    if (!divItems.length) return;

    const firstItem = divItems[0];
    const itemStyle = getComputedStyle(firstItem);
    const itemHeight = firstItem.offsetHeight;
    const itemMarginTop = Number.parseFloat(itemStyle.marginTop) || 0;
    const totalItemHeight = itemHeight + itemMarginTop;
    const totalHeight = totalItemHeight * items.length;

    // Create a duplicate set of items for seamless scrolling
    const clonedItems = [];
    divItems.forEach((item) => {
      const clone = item.cloneNode(true);
      container.appendChild(clone);
      clonedItems.push(clone);
    });

    const allItems = [...divItems, ...clonedItems];

    // Position all items initially
    allItems.forEach((child, i) => {
      const y = i * totalItemHeight;
      gsap.set(child, { y });
    });

    // Modified wrap function that creates a seamless loop
    const wrapY = (y) => {
      const itemCount = items.length;
      if (y > totalHeight) {
        return y - totalHeight;
      } else if (y < 0) {
        return y + totalHeight;
      }
      return y;
    };

    // Create a timeline for smooth scrolling
    const scrollTl = gsap.timeline({ paused: true });

    // Observer for manual scrolling
    const observer = Observer.create({
      target: container,
      type: "wheel,touch,pointer",
      preventDefault: true,
      onPress: ({ target }) => {
        target.style.cursor = "grabbing";
        // Pause autoplay when user interacts
        if (autoplay && rafId) {
          cancelAnimationFrame(rafId);
        }
      },
      onRelease: ({ target }) => {
        target.style.cursor = "grab";
        // Resume autoplay when user stops interacting
        if (autoplay && pauseOnHover === false) {
          rafId = requestAnimationFrame(tick);
        }
      },
      onChange: ({ deltaY, isDragging, event }) => {
        const d = event.type === "wheel" ? -deltaY : deltaY * 2;
        const distance = isDragging ? d * 5 : d * 10;

        // Update positions with the wrap function
        allItems.forEach((child) => {
          const currentY = gsap.getProperty(child, "y");
          const newY = wrapY(currentY + distance);

          gsap.to(child, {
            duration: 0.5,
            ease: "expo.out",
            y: newY,
          });
        });

        // Check if any items need to be repositioned for infinite scrolling
        allItems.forEach((child) => {
          const currentY = gsap.getProperty(child, "y");
          if (currentY > totalHeight) {
            gsap.set(child, { y: currentY - totalHeight });
          } else if (currentY < -totalItemHeight) {
            gsap.set(child, { y: currentY + totalHeight });
          }
        });
      },
    });

    let rafId;
    if (autoplay) {
      const directionFactor = autoplayDirection === "down" ? 1 : -1;
      const speedPerFrame = autoplaySpeed * directionFactor;

      const tick = () => {
        // Update positions with the wrap function
        allItems.forEach((child) => {
          const currentY = gsap.getProperty(child, "y");
          const newY = currentY + speedPerFrame;

          gsap.set(child, { y: newY });

          // Check if items need to be repositioned for infinite scrolling
          if (newY > totalHeight) {
            gsap.set(child, { y: newY - totalHeight });
          } else if (newY < -totalItemHeight) {
            gsap.set(child, { y: newY + totalHeight });
          }
        });

        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      if (pauseOnHover) {
        const stopTicker = () => rafId && cancelAnimationFrame(rafId);
        const startTicker = () => (rafId = requestAnimationFrame(tick));

        container.addEventListener("mouseenter", stopTicker);
        container.addEventListener("mouseleave", startTicker);

        return () => {
          observer.kill();
          stopTicker();
          container.removeEventListener("mouseenter", stopTicker);
          container.removeEventListener("mouseleave", startTicker);
        };
      } else {
        return () => {
          observer.kill();
          rafId && cancelAnimationFrame(rafId);
        };
      }
    }

    return () => {
      observer.kill();
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTl) scrollTl.kill();
    };
  }, [
    items,
    autoplay,
    autoplaySpeed,
    autoplayDirection,
    pauseOnHover,
    isTilted,
    tiltDirection,
    negativeMargin,
  ]);

  return (
    <div
      className="relative flex items-center justify-center w-full overflow-hidden overscroll-none border-t-2 border-b-2 border-t-dotted border-b-dotted border-transparent"
      ref={wrapperRef}
      style={{ maxHeight }}
    >
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>

      {/* Container */}
      <div
        className="flex flex-col overscroll-contain px-4 cursor-grab origin-center"
        ref={containerRef}
        style={{
          width,
          transform: getTiltTransform(),
        }}
      >
        {items.map((item, i) => (
          <div
            className="flex items-center justify-center p-4 text-xl font-semibold text-center border-2 border-white rounded-[15px] select-none box-border relative"
            key={i}
            style={{
              height: `${itemMinHeight}px`,
              marginTop: negativeMargin,
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
