import { motion } from "framer-motion";

const RAILS = [
  "EVC PLUS",
  "ZAAD",
  "SAHAL",
  "E-DAHAB",
  "E-BESA",
  "MY-CASH",
  "PREMIER WALLET",
  "SIPS",
];

/** Section 4 — Map / Presence strip (contact.md). Light compact band. */
export default function PresenceStrip() {
  return (
    <section className="border-y border-bordergray bg-offwhite py-14 lg:py-16">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[13px] uppercase tracking-[0.05em] text-ltxt-muted">
            Presence
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-ltxt">
            Mogadishu, Somalia — serving the nationwide mobile-money ecosystem across four
            operators and the SIPS bank hub.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {RAILS.map((r, i) => (
            <motion.span
              key={r}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.35, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              className="rail-chip"
            >
              {r}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
