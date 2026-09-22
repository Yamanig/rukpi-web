import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const HEADLINE = "Infrastructure, engineered for Somalia's reality.";

const CHIPS = ["~180K REQ/S ROUTING", "RPO=0", "WS <50MS", "150% PEAK HEADROOM"];

/** Lightweight drifting particle field (~60 dots, canvas — not WebGL). */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const dots: P[] = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.012,
      vy: (Math.random() - 0.5) * 0.012,
      r: 0.8 + Math.random() * 1.4,
      a: 0.25 + Math.random() * 0.45,
    }));

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx * dt * 0.06;
        d.y += d.vy * dt * 0.06;
        if (d.x < 0) d.x += 1;
        if (d.x > 1) d.x -= 1;
        if (d.y < 0) d.y += 1;
        if (d.y > 1) d.y -= 1;
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,163,161,${d.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

/** Mono chip that types itself in (20ms/char) once visible. */
function TypeChip({ text, delay }: { text: string; delay: number }) {
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLen(text.length);
      return;
    }
    let i = 0;
    let interval = 0;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setLen(i);
        if (i >= text.length) window.clearInterval(interval);
      }, 20);
    }, delay * 1000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <span className="rail-chip tabular">
      {text.slice(0, len)}
      {len < text.length && (
        <span className="ml-0.5 inline-block h-3 w-1.5 animate-caret-blink bg-teal align-middle" aria-hidden="true" />
      )}
    </span>
  );
}

export default function TechHero() {
  const scope = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: scope,
    offset: ["start start", "end start"],
  });
  // grid background subtly scales on scroll (parallax 0.9 rate)
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      ref={scope}
      className="relative -mt-[72px] flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-ink-0 pb-20 pt-[120px]"
    >
      {/* faint isometric grid — 1px Deep Slate 3 lines at 40% opacity */}
      <motion.div
        aria-hidden="true"
        style={{
          scale: gridScale,
          y: gridY,
          position: "absolute",
          inset: "-10%",
          backgroundImage:
            "linear-gradient(rgba(26,35,43,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(26,35,43,0.4) 1px, transparent 1px), linear-gradient(30deg, rgba(26,35,43,0.16) 1px, transparent 1px), linear-gradient(150deg, rgba(26,35,43,0.16) 1px, transparent 1px)",
          backgroundSize: "64px 64px, 64px 64px, 128px 128px, 128px 128px",
        }}
      />
      <ParticleField />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-0/30 via-transparent to-ink-0"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-content px-6">
        <div className="max-w-[680px]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="eyebrow text-teal"
          >
            Platform Engineering
          </motion.p>

          {/* character-level reveal */}
          <h1
            className="mt-6 font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.03em] text-txt lg:text-[64px]"
            aria-label={HEADLINE}
          >
            {(() => {
              let charIndex = 0;
              const words = HEADLINE.split(" ");
              return words.map((word, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
                  {word.split("").map((ch, ci) => {
                    const delay = 0.15 + charIndex++ * 0.02;
                    return (
                      <span key={ci} className="inline-block overflow-hidden align-bottom">
                        <motion.span
                          className="inline-block"
                          initial={{ y: "110%" }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.7, ease: EASE, delay }}
                        >
                          {ch}
                        </motion.span>
                      </span>
                    );
                  })}
                  {wi < words.length - 1 && <span>&nbsp;</span>}
                </span>
              ));
            })()}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.2 }}
            className="mt-6 max-w-xl text-lg leading-[1.7] text-txt-sub"
          >
            Exactly-once money movement over intermittent 3G. An append-only double-entry
            ledger. A type-safe loop from database to mobile. Chaos-tested against real
            connectivity failure patterns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {CHIPS.map((c, i) => (
              <TypeChip key={c} text={c} delay={1.6 + i * 0.3} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
