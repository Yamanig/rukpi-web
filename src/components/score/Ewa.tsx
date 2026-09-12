import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Soft amber shimmer particles behind the roadmap chip (4 max). */
function AmberShimmer() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {[
        { left: "18%", top: "30%", d: 0 },
        { left: "78%", top: "24%", d: 0.7 },
        { left: "30%", top: "72%", d: 1.3 },
        { left: "68%", top: "66%", d: 1.9 },
      ].map((p, i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0, 0.8, 0], y: [0, -18, -30] }}
          transition={{ duration: 3, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-1.5 w-1.5 rounded-full bg-amber"
          style={{ left: p.left, top: p.top }}
        />
      ))}
    </div>
  );
}

export default function Ewa() {
  return (
    <section className="relative overflow-hidden bg-ink-0 py-24 lg:py-32">
      <AmberShimmer />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-block rounded-md border border-amber/50 bg-amber/10 px-3 py-1.5 font-mono text-[12px] tracking-[0.12em] text-amber"
        >
          ROADMAP · POST-PILOT
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mt-8 font-display text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-txt lg:text-5xl"
        >
          The score is the key.{" "}
          <span className="relative inline-block">
            Access
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
              style={{ transformOrigin: "left center" }}
              className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-amber-glow"
              aria-hidden="true"
            />
          </span>{" "}
          is what it unlocks.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          className="mx-auto mt-8 max-w-xl text-lg leading-[1.7] text-txt-sub"
        >
          Earned Wage Access — drawing on income as you earn it, priced by your score — is on the
          roadmap. Your payment history is building toward it today.
        </motion.p>
      </div>
    </section>
  );
}
