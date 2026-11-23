"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scale?: number;
  style?: CSSProperties;
}

/**
 * Lightweight scroll-reveal wrapper (formerly Framer Motion driven).
 *
 * - One IntersectionObserver per element, only added while the component is mounted.
 * - CSS transitions drive the animation, so no JS animation loop runs on the
 *   main thread after the element has revealed (no perpetual rAF work).
 * - `prefers-reduced-motion` users get content immediately.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  scale = 1,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-y": `${y}px`,
          "--reveal-scale": scale,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
