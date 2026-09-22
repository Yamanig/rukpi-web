import { memo, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const BULLETS = [
  "4-digit PIN with device-bound salt hashing; progressive lockout on failed attempts",
  "Optional biometric attestation for payments",
  "JWT access tokens with 15-minute TTL; 7-day rotating refresh tokens with replay detection",
  "Device management: max 5 devices, remote revoke, fingerprint-based anomaly detection",
  "Three-layer replay prevention: nonce + timestamp + idempotency key",
];

const NODES = ["LOGIN", "JWT 15-MIN TTL", "ROTATING REFRESH 7-DAY", "REPLAY DETECTION"];

const TOKEN_PERIOD_MS = 9000;

/**
 * Looping "token refresh": a mono token chip travels the timeline while its
 * TTL counts down 15:00 → 00:00, then renews. Isolated + memoized perpetual
 * animation; transform and countdown written directly to the DOM each frame
 * (no React re-renders on the animation path).
 */
const TokenRunner = memo(function TokenRunner() {
  const trackRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = ((now - start) % TOKEN_PERIOD_MS) / TOKEN_PERIOD_MS;
      const track = trackRef.current;
      const chip = chipRef.current;
      if (track && chip) {
        const range = Math.max(track.clientWidth - chip.offsetWidth, 0);
        chip.style.transform = `translateX(${p * range}px)`;
      }
      const remaining = Math.max(0, Math.round(15 * 60 * (1 - p)));
      const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
      const ss = String(remaining % 60).padStart(2, "0");
      if (countdownRef.current) countdownRef.current.textContent = `${mm}:${ss}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={trackRef} className="pointer-events-none absolute left-0 right-0 top-[26px]" aria-hidden="true">
      <div ref={chipRef} className="w-fit">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-teal/40 bg-ink-1 px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-teal shadow-teal-edge">
          TOKEN&nbsp;<span ref={countdownRef} className="tabular">15:00</span>
        </span>
      </div>
    </div>
  );
});

/** Single timeline node; ring pops as the scrubbed line reaches it. */
function TimelineNode({
  label,
  index,
  progress,
}: {
  label: string;
  index: number;
  progress: MotionValue<number>;
}) {
  // node positions along the track: 0, 1/3, 2/3, 1
  const at = index / (NODES.length - 1);
  const ringScale = useTransform(progress, [Math.max(at - 0.06, 0), at + 0.02], [0, 1]);
  const ringOpacity = useTransform(progress, [Math.max(at - 0.06, 0), at + 0.02], [0, 1]);
  const dotBg = useTransform(progress, [at - 0.02, at + 0.02], ["#2A3A47", "#00A3A1"]);
  const labelColor = useTransform(progress, [at - 0.02, at + 0.02], ["#5A6E78", "#E8EDF0"]);

  return (
    <div className="relative flex flex-col items-center gap-3">
      <div className="relative flex h-4 w-4 items-center justify-center">
        <motion.span
          style={{ scale: ringScale, opacity: ringOpacity }}
          className="absolute -inset-2 rounded-full border border-teal"
          aria-hidden="true"
        />
        <motion.span style={{ backgroundColor: dotBg }} className="h-2.5 w-2.5 rounded-full" />
      </div>
      <motion.span
        style={{ color: labelColor }}
        className="whitespace-nowrap font-mono text-[11px] tracking-[0.1em]"
      >
        {label}
      </motion.span>
    </div>
  );
}

export default function Authentication() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.85", "end 0.45"],
  });

  return (
    <section className="bg-ink-alt py-24 lg:py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        {/* Copy */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: EASE }}
            className="eyebrow text-teal"
          >
            Authentication &amp; Sessions
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl"
          >
            Every session, accounted for.
          </motion.h2>
          <ul className="mt-8 space-y-4">
            {BULLETS.map((b) => (
              <motion.li
                key={b}
                variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex items-start gap-3 text-[15px] leading-[1.7] text-txt-sub"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                {b}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Session-lifecycle timeline */}
        <div ref={timelineRef} className="relative px-2 pt-16 lg:px-6">
          <TokenRunner />

          {/* base track */}
          <div className="absolute left-2 right-2 top-[72px] h-px bg-ink-4 lg:left-6 lg:right-6" aria-hidden="true" />
          {/* scrubbed progress line */}
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="absolute left-2 right-2 top-[72px] h-px origin-left bg-teal lg:left-6 lg:right-6"
            aria-hidden="true"
          />

          <div className="relative flex items-start justify-between">
            {NODES.map((label, i) => (
              <TimelineNode key={label} label={label} index={i} progress={scrollYProgress} />
            ))}
          </div>

          <p className="mt-10 text-center font-mono text-[11px] tracking-[0.12em] text-txt-ter">
            SESSION LIFECYCLE — TOKENS ROTATE, REPLAYS REJECTED
          </p>
        </div>
      </div>
    </section>
  );
}
