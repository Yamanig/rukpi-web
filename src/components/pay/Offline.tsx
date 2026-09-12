import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, Wifi, ShieldCheck } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const QUEUE_ITEMS = [
  { id: "q1", label: "P2P ····4492", amount: "$25.00" },
  { id: "q2", label: "QR #A-2210", amount: "$8.40" },
  { id: "q3", label: "TOP-UP ZAAD", amount: "$50.00" },
];

const CARDS = [
  {
    icon: Database,
    title: "Offline queue",
    body: "Mutations queue locally (IndexedDB, FIFO, idempotency keys, up to 100 pending) and sync when connectivity returns.",
  },
  {
    icon: Wifi,
    title: "Adaptive transport",
    body: "WebSocket under 50ms, SSE, or long-polling — auto-negotiated with exponential backoff.",
  },
  {
    icon: ShieldCheck,
    title: "Exactly once",
    body: "Built and chaos-tested for 30-second drops every 5 minutes. No duplicates. No double-spends.",
  },
];

/** Simulated connectivity meter + offline queue flush demo. */
function ConnectivitySim() {
  const [online, setOnline] = useState(true);
  const [queue, setQueue] = useState(QUEUE_ITEMS.slice(0, 0));
  const [flushing, setFlushing] = useState(false);

  useEffect(() => {
    let alive = true;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(
        window.setTimeout(() => {
          if (alive) fn();
        }, ms),
      );
    };

    const runCycle = () => {
      // 5s online, then drop
      later(() => {
        setOnline(false);
        // queue builds while offline
        QUEUE_ITEMS.forEach((q, i) =>
          later(() => setQueue((prev) => [...prev, q]), 900 + i * 900),
        );
        // back online — flush upward in a staggered burst
        later(() => {
          setOnline(true);
          setFlushing(true);
          later(() => {
            setQueue([]);
            setFlushing(false);
          }, 900);
          later(runCycle, 5000);
        }, 4700);
      }, 5000);
    };

    runCycle();
    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div className="mx-auto mt-12 w-full max-w-md rounded-xl border border-ink-4/60 bg-ink-1 p-5 shadow-teal-edge">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-txt-ter">
          Connectivity
        </p>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[12px] tracking-[0.08em] transition-colors duration-300 ${
            online ? "border-success/40 text-success" : "border-amber/50 text-amber"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 animate-pulse-dot rounded-full ${
              online ? "bg-success" : "bg-amber"
            }`}
          />
          {online ? "3G · CONNECTED" : "OFFLINE · QUEUING"}
        </span>
      </div>

      {/* queue visual */}
      <div className="mt-4 min-h-[132px] space-y-2">
        {queue.length === 0 && (
          <p className="pt-10 text-center font-mono text-[12px] tracking-[0.06em] text-txt-ter">
            {online ? "LEDGER IN SYNC · 0 PENDING" : "LISTENING…"}
          </p>
        )}
        {queue.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={
              flushing
                ? { opacity: 0, y: -56, transition: { duration: 0.5, delay: i * 0.12, ease: EASE } }
                : { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }
            }
            className="flex items-center justify-between rounded-lg border border-amber/30 bg-ink-2 px-3 py-2.5"
          >
            <span className="flex items-center gap-2 font-mono text-[12px] tracking-[0.05em] text-txt-sub">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              {q.label}
            </span>
            <span className="tabular font-mono text-[12px] text-txt">{q.amount}</span>
          </motion.div>
        ))}
      </div>

      <p className="tabular mt-3 border-t border-white/[0.05] pt-3 text-center font-mono text-[11px] tracking-[0.08em] text-txt-ter">
        {online ? "IDEMPOTENCY KEYS VERIFIED · NO DUPLICATES" : `PENDING: ${queue.length} / 100`}
      </p>
    </div>
  );
}

export default function Offline() {
  return (
    <section className="bg-ink-0 py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-teal">Offline &amp; Resilience</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            Works where the network doesn't.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-txt-sub">
            Real infrastructure assumes the network fails. RUKPI PAY keeps accepting payments and
            settles them the moment connectivity returns.
          </p>
        </motion.div>

        <ConnectivitySim />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {CARDS.map((c) => (
            <motion.div
              key={c.title}
              variants={{
                hidden: { opacity: 0, y: 32 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="ledger-card p-6"
            >
              <c.icon className="h-6 w-6 text-teal" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-xl font-semibold text-txt">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-txt-sub">{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
