import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const GLYPHS = "ABCDEFGHJKMNPQRSTUVWXYZ0123456789#$%&*+=/";

interface ScrambleTextProps {
  text: string;
  /** total resolve duration in seconds (default 0.6) */
  duration?: number;
  /** delay before resolving starts, seconds */
  delay?: number;
  className?: string;
}

/**
 * Mono label that scrambles from random glyphs to its final text when it
 * enters the viewport (security.md: encryption labels 0.6s, stat cells 0.8s).
 * Resolves character-by-character left to right. Static under reduced motion.
 */
export default function ScrambleText({
  text,
  duration = 0.6,
  delay = 0,
  className,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView) return;
    // reduced motion: output is already the final text — no scramble
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const total = duration * 1000;

    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / total, 0), 1);
      const resolved = Math.floor(t * text.length);
      let s = text.slice(0, resolved);
      for (let i = resolved; i < text.length; i++) {
        const ch = text[i];
        s += ch === " " || ch === "-" || ch === "+" || ch === "." || ch === "%"
          ? ch
          : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOutput(s);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, duration, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {output}
    </span>
  );
}
