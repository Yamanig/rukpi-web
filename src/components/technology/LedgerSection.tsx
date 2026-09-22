import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scale } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Region = "rows" | "totals" | "journal";

const GUARANTEES: { label: string; body: string; region: Region }[] = [
  {
    label: "APPEND-ONLY JOURNAL",
    body: "Every state transition recorded with actor attribution; nothing is ever overwritten.",
    region: "journal",
  },
  {
    label: "CONSERVATION OF LIABILITIES",
    body: "Verified hourly, automatically.",
    region: "totals",
  },
  {
    label: "RUNNING-BALANCE CONSISTENCY",
    body: "Checked every 6 hours.",
    region: "totals",
  },
  {
    label: "SAGA ATOMICITY",
    body: "Multi-step transfers orchestrated with automatic compensation on failure.",
    region: "rows",
  },
  {
    label: "NO DOUBLE-SPEND",
    body: "Optimistic locking + serializable isolation on wallet mutations.",
    region: "rows",
  },
  {
    label: "24H IDEMPOTENCY WINDOW",
    body: "Safe retries, exactly-once execution.",
    region: "journal",
  },
];

const MOCK_ENTRIES = [
  { ref: "txn_9f2c…a41e", account: "WALLET:USER", amount: 25.0 },
  { ref: "txn_1b7d…e903", account: "RAIL:EVC_PLUS", amount: 412.75 },
  { ref: "txn_55aa…0c2f", account: "WALLET:MERCH", amount: 8.5 },
  { ref: "txn_c310…7d8b", account: "RAIL:ZAAD", amount: 120.0 },
  { ref: "txn_77e1…f4a0", account: "WALLET:USER", amount: 64.2 },
  { ref: "txn_2d9b…61c7", account: "RAIL:SIPS", amount: 1500.0 },
  { ref: "txn_84f0…b2d9", account: "WALLET:AGENT", amount: 40.0 },
  { ref: "txn_0a3e…c985", account: "RAIL:SAHAL", amount: 96.4 },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Running total that rolls toward its target (digit-roll feel, tabular-nums). */
function RollingTotal({ value, prefix }: { value: number; prefix: string }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fromRef.current = value;
      setDisplay(value);
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    const dur = 500;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(step);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className="tabular">
      {prefix}
      {fmt(display)}
    </span>
  );
}

type Row = { id: number; ref: string; account: string; amount: number };

export default function LedgerSection() {
  const [rows, setRows] = useState<Row[]>(() =>
    MOCK_ENTRIES.slice(0, 4).map((e, i) => ({ id: i, ...e })),
  );
  const [hovered, setHovered] = useState<Region | null>(null);
  const counter = useRef(4);

  // entries append live — one new row every 2s, cycling mock entries
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setRows((prev) => {
        const next = MOCK_ENTRIES[counter.current % MOCK_ENTRIES.length];
        counter.current += 1;
        return [...prev.slice(-4), { id: counter.current, ...next }];
      });
    }, 2000);
    return () => window.clearInterval(interval);
  }, []);

  const total = rows.reduce((s, r) => s + r.amount, 0);

  const glow = (region: Region) =>
    hovered === region
      ? "shadow-[0_0_0_1px_rgba(0,163,161,0.6),0_0_24px_rgba(0,163,161,0.15)]"
      : "";

  return (
    <section className="bg-ink-alt py-24 lg:py-32">
      <div className="mx-auto grid max-w-content items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="eyebrow text-teal">Ledger Architecture</p>
            <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
              Append-only. Double-entry. Provably balanced.
            </h2>
            <p className="mt-4 text-lg leading-[1.7] text-txt-sub">
              Money never disappears. It only moves.
            </p>
          </motion.div>

          <ul className="mt-10 space-y-1">
            {GUARANTEES.map((g, i) => (
              <motion.li
                key={g.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                onMouseEnter={() => setHovered(g.region)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(g.region)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                className={`cursor-default rounded-lg border border-transparent px-4 py-3 transition-colors duration-200 ${
                  hovered === g.region ? "border-teal/30 bg-teal/[0.06]" : ""
                }`}
              >
                <p
                  className={`font-mono text-[13px] tracking-[0.08em] transition-colors ${
                    hovered === g.region ? "text-teal" : "text-txt"
                  }`}
                >
                  {g.label}
                </p>
                <p className="mt-1 text-[14px] leading-[1.6] text-txt-sub">{g.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Double-entry ledger visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden rounded-xl border border-ink-4/60 bg-ink-1 shadow-teal-edge"
        >
          {/* header */}
          <div
            className={`flex items-center justify-between border-b border-white/[0.06] bg-ink-2 px-5 py-3 transition-shadow duration-300 ${glow("journal")}`}
          >
            <div className="flex items-center gap-2.5">
              <Scale className="h-4 w-4 text-teal" strokeWidth={1.5} />
              <span className="font-mono text-[12px] tracking-[0.1em] text-txt-sub">
                GENERAL JOURNAL · APPEND-ONLY
              </span>
            </div>
            <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-success">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
              LIVE
            </span>
          </div>

          {/* column heads */}
          <div className="grid grid-cols-[1fr_auto] border-b border-white/[0.06] px-5 py-2.5">
            <span className="font-mono text-[11px] tracking-[0.12em] text-amber">DEBIT</span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-teal">CREDIT</span>
          </div>

          {/* rows */}
          <div
            className={`min-h-[248px] px-5 py-2 transition-shadow duration-300 ${glow("rows")}`}
          >
            <AnimatePresence initial={false}>
              {rows.map((r) => (
                <motion.div
                  key={r.id}
                  layout="position"
                  initial={{ opacity: 0, y: -18, backgroundColor: "rgba(0,163,161,0.2)" }}
                  animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,163,161,0)" }}
                  exit={{ opacity: 0 }}
                  transition={{
                    y: { duration: 0.4, ease: EASE },
                    opacity: { duration: 0.4 },
                    backgroundColor: { duration: 1.2, ease: "easeOut" },
                  }}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-white/[0.04] py-2.5 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[12px] text-txt-ter">{r.ref}</p>
                    <p className="font-mono text-[12.5px] tracking-[0.04em] text-txt-sub">
                      DR {r.account}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular font-mono text-[13px] text-txt">${fmt(r.amount)}</p>
                    <p className="tabular font-mono text-[12.5px] text-teal/80">
                      CR ${fmt(r.amount)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* running totals */}
          <div
            className={`grid grid-cols-2 gap-4 border-t border-white/[0.06] bg-ink-2 px-5 py-4 transition-shadow duration-300 ${glow("totals")}`}
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.12em] text-txt-ter">
                TOTAL DEBITS
              </p>
              <p className="mt-1 font-mono text-[15px] text-txt">
                <RollingTotal value={total} prefix="$" />
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] tracking-[0.12em] text-txt-ter">
                TOTAL CREDITS
              </p>
              <p className="mt-1 font-mono text-[15px] text-teal">
                <RollingTotal value={total} prefix="$" />
              </p>
            </div>
            <div className="col-span-2 flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span className="font-mono text-[10px] tracking-[0.12em] text-txt-ter">
                Δ IMBALANCE
              </span>
              <span className="tabular font-mono text-[12px] text-success">$0.00 ✓</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
