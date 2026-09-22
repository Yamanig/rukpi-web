import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* Node positions matched to /tech-topology.png (1920×800, percentage coords) */
const RAILS = [
  { chip: "EVC PLUS", tip: "EVC PLUS · USSD/SIM TOOLKIT", x: 21, y: 25 },
  { chip: "ZAAD", tip: "ZAAD · TELESOM GATEWAY", x: 80, y: 25 },
  { chip: "SAHAL", tip: "SAHAL · GOLIS GATEWAY", x: 21, y: 84 },
  { chip: "E-DAHAB", tip: "E-DAHAB · SOMTEL MONEY", x: 81.5, y: 84 },
  { chip: "SIPS", tip: "SIPS · ISO 20022 MESSAGING", x: 16, y: 50 },
  { chip: "AGENTS", tip: "AGENTS · CASH-IN / CASH-OUT", x: 86.5, y: 50 },
  { chip: "RUKPI CORE", tip: "RUKPI CORE · RAILADAPTER CONTRACT", x: 51, y: 52, core: true },
];

export default function NetworkAggregation() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden bg-ink-0 py-24 lg:py-32">
      {/* wide topology backdrop at 0.5 opacity */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/tech-topology.png"
          alt=""
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-0 via-ink-0/40 to-ink-0" />
      </div>

      {/* positioned teal ring overlays — entry pulse + hover highlight */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {RAILS.map((r, i) => (
          <div
            key={r.chip}
            className="absolute"
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
          >
            {/* entry pulse: staggered ring expanding once */}
            <motion.span
              initial={{ opacity: 0.8, scale: 0.2 }}
              whileInView={{ opacity: 0, scale: 2.4 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, delay: 0.3 + i * 0.15, ease: EASE }}
              className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal"
            />
            {/* hover ring — scales in with spring */}
            <AnimatePresence>
              {active === r.chip && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-teal shadow-[0_0_32px_rgba(0,163,161,0.55)] ${
                    r.core ? "h-28 w-28" : "h-20 w-20"
                  }`}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-content px-6">
        {/* centered glass copy block */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-glass-surface p-8 text-center shadow-teal-edge backdrop-blur-md lg:p-10"
        >
          <p className="eyebrow text-teal">Network Aggregation</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            Seven heterogeneous rails. One contract.
          </h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-txt-sub">
            Four mobile-money operators, the ISO 20022 SIPS bank hub, and cash agents —
            each with its own protocols, failure modes, and settlement cycles — unified
            behind a single protocol-agnostic RailAdapter contract. RUKPI core never sees
            the chaos; adapters absorb it.
          </p>
        </motion.div>

        {/* rail chips row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {RAILS.map((r) => (
            <span key={r.chip} className="relative">
              <button
                type="button"
                onMouseEnter={() => setActive(r.chip)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(r.chip)}
                onBlur={() => setActive(null)}
                className={`rail-chip cursor-pointer transition-colors duration-200 ${
                  active === r.chip ? "border-teal bg-teal/10 text-teal" : ""
                } ${r.core ? "font-medium" : ""}`}
                aria-describedby={`tip-${r.chip.replace(/\s+/g, "-")}`}
              >
                {r.chip}
              </button>
              <AnimatePresence>
                {active === r.chip && (
                  <motion.span
                    id={`tip-${r.chip.replace(/\s+/g, "-")}`}
                    role="tooltip"
                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-teal/40 bg-ink-1 px-3 py-1.5 font-mono text-[11px] tracking-[0.06em] text-teal shadow-teal-glow"
                  >
                    {r.tip}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
