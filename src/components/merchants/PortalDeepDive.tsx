import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, BarChart3, Rows3, KeyRound, Code2 } from "lucide-react";

const TABS = [
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "transactions", label: "Transactions", icon: Rows3 },
  { id: "keys", label: "API Keys", icon: KeyRound },
  { id: "developer", label: "Developer", icon: Code2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

const FEATURES = [
  "Revenue analytics by hour, rail, and location",
  "Live transaction grid with instant search",
  "Scoped API keys with one-click rotation",
  "T+1 settlement ledger, exportable",
];

/* ---------- Mock panes ---------- */

function AnalyticsPane() {
  return (
    <img
      src="/merchant-dashboard.png"
      alt="Revenue analytics by hour, rail, and location"
      className="block w-full"
    />
  );
}

const TXNS = [
  { id: "txn_8f2c1a", rail: "EVC PLUS", amount: "$25.00", status: "SETTLED", tone: "text-success border-success/40 bg-success/10" },
  { id: "txn_7d91be", rail: "ZAAD", amount: "$112.40", status: "SETTLED", tone: "text-success border-success/40 bg-success/10" },
  { id: "txn_6e04cd", rail: "SAHAL", amount: "$8.75", status: "PENDING", tone: "text-amber border-amber/40 bg-amber/10" },
  { id: "txn_5b33f0", rail: "E-DAHAB", amount: "$64.20", status: "SETTLED", tone: "text-success border-success/40 bg-success/10" },
  { id: "txn_4a17d9", rail: "E-BESA", amount: "$230.00", status: "SETTLED", tone: "text-success border-success/40 bg-success/10" },
  { id: "txn_2f55b8", rail: "MY-CASH", amount: "$41.10", status: "SETTLED", tone: "text-success border-success/40 bg-success/10" },
  { id: "txn_1d93a4", rail: "PREMIER", amount: "$18.60", status: "SETTLED", tone: "text-success border-success/40 bg-success/10" },
  { id: "txn_3c88e2", rail: "EVC PLUS", amount: "$15.50", status: "FAILED", tone: "text-error border-error/40 bg-error/10" },
];

function TransactionsPane() {
  return (
    <div className="bg-ink-1 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-txt-ter">
          Live transaction grid
        </span>
        <span className="rounded-md border border-ink-4 bg-ink-2 px-3 py-1.5 font-mono text-[12px] text-txt-ter">
          Search: txn_ · rail: all
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-ink-4/60">
        {TXNS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-white/[0.05] bg-ink-2 px-4 py-3 font-mono text-[12px] last:border-b-0 sm:text-[13px]"
          >
            <span className="truncate text-txt-sub">{t.id}</span>
            <span className="hidden text-txt-ter sm:inline">{t.rail}</span>
            <span className="tabular text-txt">{t.amount}</span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] tracking-[0.08em] ${t.tone}`}>
              {t.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function KeysPane() {
  const keys = [
    { name: "rk_live_storefront", scope: "payments:write", use: 78 },
    { name: "rk_live_resto_pos", scope: "payments:write", use: 46 },
    { name: "rk_test_sandbox", scope: "read:all", use: 22 },
  ];
  return (
    <div className="bg-ink-1 p-4 sm:p-6">
      <div className="space-y-3">
        {keys.map((k, i) => (
          <motion.div
            key={k.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="rounded-lg border border-ink-4/60 bg-ink-2 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[13px] text-txt">{k.name}</span>
              <button
                type="button"
                className="rounded-md border border-ink-4 px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-txt-sub transition-colors hover:border-teal hover:text-teal"
              >
                ROTATE
              </button>
            </div>
            <p className="mt-1 font-mono text-[11px] text-txt-ter">scope: {k.scope}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-4/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${k.use}%` }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-teal"
              />
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-[0.06em] text-txt-ter">
        USAGE / KEY · LAST 24H
      </p>
    </div>
  );
}

const CODE_LINES: { text: React.ReactNode }[] = [
  { text: <span className="text-txt-ter"># create a payment</span> },
  { text: <span><span className="text-teal">POST</span> <span className="text-txt">/v1/payments</span></span> },
  { text: "" },
  { text: <span className="text-txt-sub">{"{"}</span> },
  { text: <span>  <span className="text-teal">"amount"</span><span className="text-txt-sub">:</span> <span className="text-amber-light">"25.00"</span><span className="text-txt-sub">,</span></span> },
  { text: <span>  <span className="text-teal">"currency"</span><span className="text-txt-sub">:</span> <span className="text-amber-light">"USD"</span><span className="text-txt-sub">,</span></span> },
  { text: <span>  <span className="text-teal">"rail"</span><span className="text-txt-sub">:</span> <span className="text-amber-light">"auto"</span></span> },
  { text: <span className="text-txt-sub">{"}"}</span> },
  { text: "" },
  { text: <span className="text-txt-ter"># → 201 · payment_intent.created · expires_in: 300s</span> },
];

function DeveloperPane() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setShown(CODE_LINES.length), 0);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setShown((n) => {
        if (n >= CODE_LINES.length) {
          clearInterval(iv);
          return n;
        }
        return n + 1;
      });
    }, 150);
    return () => clearInterval(iv);
  }, [inView]);

  return (
    <div ref={ref} className="bg-ink-0 p-5 sm:p-6">
      <div className="mb-3 flex gap-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-ink-4" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-4" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-4" />
      </div>
      <pre className="min-h-[240px] font-mono text-[12.5px] leading-[1.9] sm:text-[13.5px]">
        {CODE_LINES.slice(0, shown).map((l, i) => (
          <div key={i}>{l.text || " "}</div>
        ))}
        {shown < CODE_LINES.length && (
          <span className="inline-block h-4 w-2 animate-caret-blink bg-teal align-middle" />
        )}
      </pre>
    </div>
  );
}

/* ---------- Section ---------- */

export default function PortalDeepDive() {
  const [tab, setTab] = useState<TabId>("analytics");

  return (
    <section className="bg-ink-alt">
      <div className="mx-auto grid max-w-content items-start gap-12 px-6 py-24 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:py-32">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow text-teal">The Portal</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt sm:text-[48px]">
            Your entire business, one dashboard.
          </h2>
          <ul className="mt-10 space-y-5">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-teal/40 bg-teal/10">
                  <Check className="h-3.5 w-3.5 text-teal" strokeWidth={2} />
                </span>
                <span className="leading-[1.7] text-txt-sub">{f}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Tabbed viewer */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap gap-1 border-b border-white/[0.06]">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-3 font-mono text-[13px] tracking-[0.05em] transition-colors ${
                  tab === t.id ? "text-teal" : "text-txt-ter hover:text-txt-sub"
                }`}
              >
                <t.icon className="h-4 w-4" strokeWidth={1.5} />
                {t.label}
                {tab === t.id && (
                  <motion.span
                    layoutId="portal-tab-underline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-teal"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="relative mt-6 overflow-hidden rounded-xl border border-ink-4/60 shadow-teal-edge">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {tab === "analytics" && <AnalyticsPane />}
                {tab === "transactions" && <TransactionsPane />}
                {tab === "keys" && <KeysPane />}
                {tab === "developer" && <DeveloperPane />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
