import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Tier {
  name: string;
  range: string;
  max: number;
  width: string;
  band: string;
  text: string;
  desc: string;
}

const TIERS: Tier[] = [
  {
    name: "Building",
    range: "0–300",
    max: 300,
    width: "30%",
    band: "bg-ink-4",
    text: "text-white/80",
    desc: "Establish your history. Consistent daily use moves you fast at this stage.",
  },
  {
    name: "Fair",
    range: "301–500",
    max: 500,
    width: "20%",
    band: "bg-info",
    text: "text-white/90",
    desc: "Emerging profile. Growing limits and early access to score-linked features.",
  },
  {
    name: "Good",
    range: "501–750",
    max: 750,
    width: "25%",
    band: "bg-teal",
    text: "text-white",
    desc: "Trusted transactor. Priority support and higher velocity limits.",
  },
  {
    name: "Excellent",
    range: "751+",
    max: 1000,
    width: "25%",
    band: "bg-amber-glow",
    text: "text-ink-0",
    desc: "Top tier. First in line for Earned Wage Access and future credit products.",
  },
];

function tierFor(v: number): Tier {
  if (v <= 300) return TIERS[0];
  if (v <= 500) return TIERS[1];
  if (v <= 750) return TIERS[2];
  return TIERS[3];
}

export default function TierExplorer() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [value, setValue] = useState(742);
  const tier = tierFor(value);
  const pct = (value / 1000) * 100;

  const updateFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setValue(Math.round(t * 1000));
  };

  const onTrackDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onTrackMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const onTrackUp = () => {
    dragging.current = false;
  };

  return (
    <section className="bg-white py-24 text-ltxt lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-amber">The Tiers</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
            Four tiers. One trajectory.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ltxt-sub">
            Drag the marker to explore what each tier means.
          </p>
        </motion.div>

        {/* Interactive scale */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div
            ref={trackRef}
            role="slider"
            aria-label="Score tier explorer"
            aria-valuemin={0}
            aria-valuemax={1000}
            aria-valuenow={value}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setValue((v) => Math.max(0, v - 10));
              if (e.key === "ArrowRight") setValue((v) => Math.min(1000, v + 10));
            }}
            onPointerDown={onTrackDown}
            onPointerMove={onTrackMove}
            onPointerUp={onTrackUp}
            onPointerCancel={onTrackUp}
            className="relative h-16 cursor-ew-resize touch-none select-none overflow-visible rounded-lg"
          >
            {/* bands wipe in left -> right */}
            <div className="flex h-full overflow-hidden rounded-lg">
              {TIERS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                  style={{ width: t.width, transformOrigin: "left center" }}
                  className={`flex h-full items-center justify-center ${t.band}`}
                >
                  <span
                    className={`hidden font-mono text-[11px] tracking-[0.1em] sm:block ${t.text}`}
                  >
                    {t.name.toUpperCase()} {t.range}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* draggable marker — spring snap */}
            <motion.div
              animate={{ left: `${pct}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="pointer-events-none absolute -top-9 bottom-[-8px] w-0"
            >
              <div className="absolute -top-1 left-0 -translate-x-1/2 rounded-md border border-ltxt bg-ltxt px-2.5 py-1">
                <span className="tabular font-mono text-[13px] font-medium text-white">
                  {value}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 top-9 w-[3px] -translate-x-1/2 rounded-full bg-ltxt shadow-[0_0_0_3px_rgba(255,255,255,0.7)]" />
            </motion.div>
          </div>

          <p className="mt-6 text-center font-mono text-[12px] tracking-[0.08em] text-ltxt-muted">
            14-DAY TIER-UPGRADE GATE · TIERS NEVER DROP WITHOUT CAUSE SHOWN
          </p>

          {/* detail card */}
          <div className="mx-auto mt-8 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="rounded-xl border border-bordergray bg-offwhite p-6 text-center shadow-light-card"
              >
                <p className="font-mono text-[12px] tracking-[0.12em] text-ltxt-muted">
                  {tier.range}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold">{tier.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ltxt-sub">{tier.desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
