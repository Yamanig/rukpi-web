import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Actor = "USER" | "SYSTEM" | "COMPLIANCE";

interface JournalEntry {
  ts: string;
  actor: Actor;
  action: string;
  hash: string;
  prev: string;
}

/** Deterministic mock SHA-256 fragments (audit-log mock — not real hashes). */
function fakeHash(seed: number): string {
  let x = seed * 2654435761;
  let out = "";
  for (let i = 0; i < 16; i++) {
    x = (x ^ (x << 13)) >>> 0;
    x = (x ^ (x >>> 17)) >>> 0;
    x = (x ^ (x << 5)) >>> 0;
    out += (x & 0xf).toString(16);
  }
  return out;
}

const ACTIONS: Array<[Actor, string]> = [
  ["USER", "auth.login.success"],
  ["USER", "wallet.debit $25.00"],
  ["SYSTEM", "settlement.batch.t+1"],
  ["USER", "p2p.transfer $8.50"],
  ["COMPLIANCE", "watchlist.screen.pass"],
  ["SYSTEM", "ledger.invariant.check"],
  ["USER", "topup.evc_plus $50.00"],
  ["COMPLIANCE", "sar.reference.filed"],
  ["USER", "wallet.credit $12.75"],
  ["SYSTEM", "token.refresh.rotated"],
  ["USER", "device.revoked 1/5"],
  ["COMPLIANCE", "balance.encumbered"],
  ["SYSTEM", "journal.checkpoint"],
  ["USER", "kyc.tier_2.approved"],
  ["SYSTEM", "compensation.reversed"],
  ["USER", "checkout.authorized"],
  ["SYSTEM", "rail.zaad.reconciled"],
  ["USER", "biometric.attested"],
];

const ENTRIES: JournalEntry[] = ACTIONS.map(([actor, action], i) => {
  const base = new Date("2025-11-04T09:12:00Z").getTime();
  const ts = new Date(base + i * 97_000);
  const hh = String(ts.getUTCHours()).padStart(2, "0");
  const mm = String(ts.getUTCMinutes()).padStart(2, "0");
  const ss = String(ts.getUTCSeconds()).padStart(2, "0");
  return {
    ts: `${hh}:${mm}:${ss}Z`,
    actor,
    action,
    hash: fakeHash(i + 7),
    prev: i === 0 ? "0000000000000000" : fakeHash(i + 6),
  };
});

const ACTOR_STYLE: Record<Actor, string> = {
  USER: "border-teal/40 text-teal",
  SYSTEM: "border-ink-4 text-txt-sub",
  COMPLIANCE: "border-amber/40 text-amber",
};

function JournalRow({
  entry,
  index,
  expanded,
  onHover,
  onLeave,
}: {
  entry: JournalEntry;
  index: number;
  expanded: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.06, ease: EASE }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`cursor-default border-b border-white/[0.04] px-4 transition-colors ${
        expanded ? "bg-ink-2" : "hover:bg-ink-2/60"
      }`}
    >
      <div className="flex items-center gap-3 py-2.5">
        <span className="tabular font-mono text-[11px] text-txt-ter">{entry.ts}</span>
        <span
          className={`rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.08em] ${ACTOR_STYLE[entry.actor]}`}
        >
          {entry.actor}
        </span>
        <span className="truncate font-mono text-[12px] text-txt-sub">{entry.action}</span>
        <span className="ml-auto hidden font-mono text-[10px] text-txt-ter sm:inline">
          …{entry.hash.slice(-6)}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 pb-3 pl-1 font-mono text-[10.5px] leading-relaxed">
              <span className="text-txt-ter">prev_hash</span>
              <span className="text-txt-sub">{entry.prev}</span>
              {/* connecting chain link draws in when expanded */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
                className="h-px w-6 origin-left bg-teal"
                aria-hidden="true"
              />
              <Link2 className="h-3 w-3 text-teal" strokeWidth={1.5} aria-hidden="true" />
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
                className="h-px w-6 origin-left bg-teal"
                aria-hidden="true"
              />
              <span className="text-txt-ter">hash</span>
              <span className="text-teal">{entry.hash}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LedgerIntegrity() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Slow auto-scroll conveying liveness; pauses on hover, wraps at the end.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      if (!pausedRef.current) {
        el.scrollTop += dt * 0.02; // ~20px/s
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) el.scrollTop = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="bg-ink-0 py-24 lg:py-32">
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
            className="eyebrow text-teal"
          >
            Ledger Integrity &amp; Auditability
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl"
          >
            If it happened, it's in the journal. Forever.
          </motion.h2>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-6 max-w-[480px] text-lg leading-[1.7] text-txt-sub"
          >
            Every state transition in RUKPI is appended to an immutable journal with full actor
            attribution. Failed transactions compensate and reverse automatically. Nothing is
            edited, deleted, or lost.
          </motion.p>
          <motion.p
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-8 font-mono text-[12px] tracking-[0.1em] text-txt-ter"
          >
            HOVER A ROW TO INSPECT ITS HASH CHAIN
          </motion.p>
        </motion.div>

        {/* Audit-log mock */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden rounded-xl border border-ink-4/60 bg-ink-1 shadow-teal-edge"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-ink-2 px-4 py-2.5">
            <p className="font-mono text-[11px] tracking-[0.12em] text-txt-ter">
              JOURNAL <span className="text-txt">IMMUTABLE</span>
            </p>
            <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] text-txt-ter">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              LIVE
            </p>
          </div>
          <div
            ref={scrollRef}
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => {
              pausedRef.current = false;
              setExpandedId(null);
            }}
            className="h-[480px] overflow-y-auto"
          >
            {ENTRIES.map((entry, i) => (
              <JournalRow
                key={i}
                entry={entry}
                index={i}
                expanded={expandedId === i}
                onHover={() => setExpandedId(i)}
                onLeave={() => setExpandedId((cur) => (cur === i ? null : cur))}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
