import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const TIERS = [
  { code: "TIER_0", name: "Unverified", note: "Browse only" },
  { code: "TIER_1", name: "Basic", note: "Phone + OTP" },
  { code: "TIER_2", name: "KYC", note: "Gov ID + AI + manual review" },
  { code: "TIER_3", name: "Business", note: "Full merchant limits" },
];

const AML_ITEMS = [
  "Watchlist screening flags",
  "SAR (Suspicious Activity Report) references",
  "Regulatory holds",
  "Compliance freezes via encumbered balances",
];

/** Check that draws its stroke when scrolled into view. */
function DrawnCheck({ delay }: { delay: number }) {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true">
      <motion.path
        d="M4 10.5l4 4 8-9"
        fill="none"
        stroke="#00A3A1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4, delay, ease: EASE }}
      />
    </svg>
  );
}

/** Encumbered-balance micro-visual: padlock snaps shut, balance dims 50%. */
function EncumberedChip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
      className="mt-6 inline-flex items-center gap-3 rounded-lg border border-bordergray bg-white px-4 py-3 shadow-light-card"
    >
      <motion.span
        initial={{ rotate: -25, scale: 0.6, opacity: 0.4 }}
        whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 500, damping: 18, delay: 1.2 }}
        className="inline-flex text-amber"
      >
        <Lock className="h-4 w-4" strokeWidth={1.5} />
      </motion.span>
      <span className="font-mono text-[12px] tracking-[0.06em] text-ltxt-sub">
        BALANCE{" "}
        <motion.span
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 1.25 }}
          className="tabular text-ltxt"
        >
          $1,284.50
        </motion.span>
      </span>
      <span className="rounded border border-amber/40 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-amber">
        ENCUMBERED
      </span>
    </motion.div>
  );
}

export default function KycAml() {
  return (
    <section className="bg-offwhite py-24 text-ltxt lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-teal">KYC &amp; AML Compliance</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
            Compliance in the data model, not in a spreadsheet.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* KYC tier ladder */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-xl border border-bordergray bg-white p-8 shadow-light-card"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ltxt-muted">
              KYC tiers
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Verify more, unlock more.</h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-ltxt-sub">
              Government ID with AI analysis (&gt;90% confidence threshold) plus manual review
              before limits lift.
            </p>

            {/* ladder builds upward step by step */}
            <div className="mt-10 flex items-end gap-3 sm:gap-4">
              {TIERS.map((t, i) => (
                <motion.div
                  key={t.code}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.15, ease: EASE }}
                  className={`flex-1 rounded-lg border px-3 py-3 ${
                    i === TIERS.length - 1
                      ? "border-teal bg-teal/5"
                      : "border-bordergray bg-offwhite"
                  }`}
                  style={{ minHeight: `${64 + i * 28}px` }}
                >
                  <p className={`font-mono text-[12px] tracking-[0.08em] ${i === TIERS.length - 1 ? "text-teal" : "text-ltxt"}`}>
                    {t.code}
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-ltxt">{t.name}</p>
                  <p className="mt-0.5 hidden text-[12px] leading-snug text-ltxt-muted sm:block">
                    {t.note}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AML controls checklist */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="rounded-xl border border-bordergray bg-white p-8 shadow-light-card"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-teal" strokeWidth={1.5} />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ltxt-muted">
                  AML controls
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold">Enforced, always on.</h3>
              </div>
            </div>

            <ul className="mt-8 space-y-4">
              {AML_ITEMS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.45, delay: 0.25 + i * 0.18, ease: EASE }}
                  className="flex items-start gap-3 text-[15px] leading-[1.6] text-ltxt-sub"
                >
                  <DrawnCheck delay={0.35 + i * 0.18} />
                  {item}
                </motion.li>
              ))}
            </ul>

            <p className="mt-6 text-[13px] leading-[1.6] text-ltxt-muted">
              Encumbered balances: funds visible but immovable — always accounted for in the
              ledger invariant.
            </p>
            <EncumberedChip />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
