import { motion } from "framer-motion";
import { Repeat2, Unlink, QrCode, Split, ArrowRight } from "lucide-react";

const WALLETS = [
  { name: "EVC Plus", op: "Hormuud Telecom" },
  { name: "ZAAD", op: "Telesom" },
  { name: "Sahal", op: "Golis Telecom" },
  { name: "e-Dahab", op: "Somtel" },
  { name: "E-BESA", op: "IBS Bank" },
  { name: "MY-CASH", op: "Amal Bank" },
  { name: "Premier Wallet", op: "Premier Bank" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

/** The Problem — bento grid (21st.dev bento pattern). Static, scannable, no scroll-jacking. */
export default function Problem() {
  return (
    <section className="relative overflow-hidden bg-dark-surface">
      <div className="mx-auto max-w-content px-6 py-28 lg:py-36">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="eyebrow text-teal">The Problem</p>
          <h2 className="mt-5 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            Somalia moves money at staggering scale — on rails that don't talk to each other.
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-txt-sub">
            Mobile money is the backbone of the Somali economy. But every operator runs its
            own closed loop. Funds locked in one wallet can't move to another. Merchants
            juggle seven QR codes. Banks sit apart from it all.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6"
        >
          {/* A — closed loops (hero card) */}
          <motion.div variants={card} className="ledger-card p-7 sm:col-span-2 lg:col-span-4 lg:row-span-2">
            <div className="flex items-center justify-between gap-4">
              <p className="font-display text-xl font-semibold text-txt">
                Every wallet is a closed loop
              </p>
              <span className="shrink-0 rounded-md border border-ink-4 px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-txt-sub">
                7 LOOPS · 0 BRIDGES
              </span>
            </div>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-txt-sub">
              Money can circulate inside each wallet — it just can never leave it for another.
            </p>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {WALLETS.map((w) => (
                <div
                  key={w.name}
                  className="group rounded-lg border border-ink-4/60 bg-ink-2 p-4 transition-colors duration-300 hover:border-teal/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-[15px] font-semibold text-txt">{w.name}</p>
                    <Repeat2 className="h-4 w-4 shrink-0 text-txt-ter transition-colors group-hover:text-teal" strokeWidth={1.5} />
                  </div>
                  <p className="mt-1 font-mono text-[11px] tracking-[0.06em] text-txt-ter">
                    {w.op}
                  </p>
                  <div className="mt-3 flex items-center gap-2" aria-hidden="true">
                    <span className="h-1.5 w-1.5 rounded-full bg-txt-ter" />
                    <span className="h-px flex-1 border-t border-dashed border-ink-4" />
                    <span className="font-mono text-[10px] tracking-[0.1em] text-txt-ter">
                      CLOSED LOOP
                    </span>
                    <span className="h-px flex-1 border-t border-dashed border-ink-4" />
                    <span className="h-1.5 w-1.5 rounded-full border border-txt-ter" />
                  </div>
                </div>
              ))}
              {/* The missing bridge tile */}
              <div className="flex flex-col justify-center rounded-lg border border-dashed border-teal/40 bg-teal/[0.04] p-4">
                <p className="font-display text-[15px] font-semibold text-teal">
                  The missing bridge
                </p>
                <p className="mt-1 text-[12px] leading-snug text-txt-sub">
                  No wallet-to-wallet path exists. That's what RUKPI builds.
                </p>
                <ArrowRight className="mt-3 h-4 w-4 text-teal" strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>

          {/* B — scale stat */}
          <motion.div variants={card} className="ledger-card flex flex-col justify-between p-7 lg:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.12em] text-txt-ter">
              MOBILE-MONEY VOLUME
            </p>
            <div className="mt-6">
              <p className="font-display text-5xl font-extrabold tracking-[-0.02em] text-txt">
                155M
              </p>
              <p className="mt-2 text-[13px] leading-snug text-txt-sub">
                transactions every month — proven demand, siloed supply
              </p>
            </div>
          </motion.div>

          {/* C — interoperability stat */}
          <motion.div variants={card} className="ledger-card flex flex-col justify-between p-7 lg:col-span-2">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] tracking-[0.12em] text-txt-ter">
                CROSS-WALLET PATHS
              </p>
              <Unlink className="h-4 w-4 text-txt-ter" strokeWidth={1.5} />
            </div>
            <div className="mt-6">
              <p className="font-display text-5xl font-extrabold tracking-[-0.02em] text-txt">0</p>
              <p className="mt-2 text-[13px] leading-snug text-txt-sub">
                direct ways to move value from any wallet to another
              </p>
            </div>
          </motion.div>

          {/* D — merchant QR pain */}
          <motion.div variants={card} className="ledger-card p-7 sm:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-txt">
                Merchants juggle seven QR codes
              </p>
              <QrCode className="h-5 w-5 shrink-0 text-txt-ter" strokeWidth={1.5} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2" aria-hidden="true">
              {WALLETS.map((w) => (
                <span
                  key={w.name}
                  className="rounded-md border border-ink-4/60 bg-ink-2 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.08em] text-txt-sub"
                >
                  {w.name.toUpperCase()}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-txt-sub">
              Seven standees on every counter, seven reconciliations every night — one per
              wallet accepted.
            </p>
          </motion.div>

          {/* E — fragmented histories */}
          <motion.div variants={card} className="ledger-card p-7 sm:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-txt">
                Separate balances, separate histories
              </p>
              <Split className="h-5 w-5 shrink-0 text-txt-ter" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-txt-sub">
              A salary landing in EVC Plus can't pay a supplier on ZAAD. A savings history in
              MY-CASH is invisible to a lender scoring you elsewhere. Every rail keeps its own
              ledger — and none of them meet.
            </p>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 font-mono text-[13px] tracking-[0.05em] text-txt-ter"
        >
          155M TRANSACTIONS / MONTH · SEVEN DISCONNECTED WALLETS
        </motion.p>
      </div>
    </section>
  );
}
