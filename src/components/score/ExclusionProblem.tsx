import { useMemo } from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Ledger card stamped NO CREDIT HISTORY, edges dissolving into drifting particles. */
function DissolvingLedgerCard() {
  // stable random particle layout along the card edges
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const edge = i % 4; // 0 top, 1 right, 2 bottom, 3 left
        const along = ((i * 37) % 100) / 100;
        const pos =
          edge === 0
            ? { left: `${along * 100}%`, top: "0%" }
            : edge === 1
              ? { left: "100%", top: `${along * 100}%` }
              : edge === 2
                ? { left: `${along * 100}%`, top: "100%" }
                : { left: "0%", top: `${along * 100}%` };
        return {
          ...pos,
          dx: (edge === 1 ? 1 : edge === 3 ? -1 : along - 0.5) * (30 + ((i * 13) % 40)),
          dy: (edge === 2 ? 1 : edge === 0 ? -1 : along - 0.5) * (30 + ((i * 17) % 40)),
          delay: (i % 6) * 0.12,
        };
      }),
    [],
  );

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative rounded-xl border border-bordergray bg-white p-8 shadow-light-card"
      >
        <p className="font-mono text-[12px] tracking-[0.12em] text-ltxt-muted">CREDIT FILE</p>
        <div className="mt-6 space-y-3">
          <div className="h-2.5 w-3/4 rounded bg-subtle" />
          <div className="h-2.5 w-1/2 rounded bg-subtle" />
          <div className="h-2.5 w-2/3 rounded bg-subtle" />
          <div className="h-2.5 w-1/3 rounded bg-subtle" />
        </div>
        <div className="mt-8 flex items-end justify-between">
          <div>
            <p className="tabular font-mono text-3xl text-ltxt-muted">–––</p>
            <p className="mt-1 font-mono text-[11px] tracking-[0.1em] text-ltxt-muted">
              SCORE UNAVAILABLE
            </p>
          </div>
        </div>

        {/* stamp */}
        <motion.div
          initial={{ opacity: 0, scale: 1.3 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] rounded-md border-2 border-ltxt-muted/70 px-4 py-2"
        >
          <span className="whitespace-nowrap font-mono text-[15px] font-medium tracking-[0.14em] text-ltxt-muted">
            NO CREDIT HISTORY
          </span>
        </motion.div>

        {/* dissolving edge particles */}
        {particles.map((p, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.55, x: 0, y: 0 }}
            whileInView={{ opacity: 0, x: p.dx, y: p.dy }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.5, delay: 0.4 + p.delay, ease: "easeOut" }}
            className="pointer-events-none absolute h-1 w-1 rounded-full bg-ltxt-muted"
            style={{ left: p.left, top: p.top }}
            aria-hidden="true"
          />
        ))}
      </motion.div>
    </div>
  );
}

export default function ExclusionProblem() {
  return (
    <section className="bg-offwhite py-24 text-ltxt lg:py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.12 }}
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: EASE }}
            className="eyebrow text-ltxt-sub"
          >
            The Exclusion Problem
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl"
          >
            Millions move billions — and remain invisible to formal finance.
          </motion.h2>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-6 max-w-[520px] text-lg leading-[1.7] text-ltxt-sub"
          >
            Somalia's mobile-money users are among the most active digital transactors on earth.
            Yet without a credit file, that history earns nothing: no loan, no advance, no
            leverage. RUKPI SCORE turns everyday payment telemetry into a portable financial
            identity.
          </motion.p>
        </motion.div>

        <DissolvingLedgerCard />
      </div>
    </section>
  );
}
