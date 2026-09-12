import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Factor {
  label: string;
  value: number; // signed SHAP-style weight
}

const POSITIVE: Factor[] = [
  { label: "consistent daily usage", value: 0.18 },
  { label: "on-time settlement streak", value: 0.11 },
];
const NEGATIVE: Factor[] = [{ label: "high balance volatility", value: -0.06 }];
const MAX_ABS = 0.18;

/** Mono value that counts up when scrolled into view. */
function CountValue({ value, delay }: { value: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 0.8,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  const sign = value >= 0 ? "+" : "−";
  return (
    <span
      ref={ref}
      className={`tabular font-mono text-[13px] ${value >= 0 ? "text-success" : "text-error"}`}
    >
      {sign}
      {Math.abs(display).toFixed(2)}
    </span>
  );
}

function FactorRow({ factor, index }: { factor: Factor; index: number }) {
  const positive = factor.value >= 0;
  const widthPct = (Math.abs(factor.value) / MAX_ABS) * 100;
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 font-mono text-[13px] tracking-[0.02em] text-txt-sub">
          <span className={positive ? "text-success" : "text-error"} aria-hidden="true">
            {positive ? "▲" : "▼"}
          </span>
          {factor.label}
        </p>
        <CountValue value={factor.value} delay={0.3 + index * 0.1} />
      </div>
      {/* SHAP-style bar, width proportional to weight */}
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-3">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: EASE }}
          style={{ width: `${widthPct}%`, transformOrigin: "left center" }}
          className={`h-full rounded-full ${positive ? "bg-success" : "bg-error"}`}
        />
      </div>
    </div>
  );
}

export default function Explainability() {
  return (
    <section className="bg-ink-alt py-24 lg:py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        {/* Copy */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.12 }}
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: EASE }}
            className="eyebrow text-amber"
          >
            Radical Clarity
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl"
          >
            No black boxes.
          </motion.h2>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-6 max-w-[480px] text-lg leading-[1.7] text-txt-sub"
          >
            Every score ships with its reasons: top positive and negative factors, their weights,
            and the model version that computed it. If your score moves, you see why — in plain
            language.
          </motion.p>
        </motion.div>

        {/* Explainability panel */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="ledger-card p-6 lg:p-8"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <p className="font-mono text-[12px] tracking-[0.1em] text-txt-ter">
              MODEL <span className="text-txt">v1.4</span>
            </p>
            <p className="font-mono text-[12px] tracking-[0.1em] text-txt-ter">
              REFRESHED <span className="text-teal">2 MIN AGO</span>
            </p>
          </div>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-txt-ter">
            Top positive factors
          </p>
          <div className="divide-y divide-white/[0.04]">
            {POSITIVE.map((f, i) => (
              <FactorRow key={f.label} factor={f} index={i} />
            ))}
          </div>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-txt-ter">
            Top negative factors
          </p>
          <div className="divide-y divide-white/[0.04]">
            {NEGATIVE.map((f, i) => (
              <FactorRow key={f.label} factor={f} index={POSITIVE.length + i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
