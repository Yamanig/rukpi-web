import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, PlusCircle, FileText } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Filter = "ALL" | "SENT" | "RECEIVED" | "TOP-UPS";
type Kind = "sent" | "received" | "topup";

interface Tx {
  id: string;
  day: "TODAY" | "YESTERDAY";
  label: string;
  time: string;
  amount: string;
  kind: Kind;
}

const TXS: Tx[] = [
  { id: "t1", day: "TODAY", label: "Top-up · EVC Plus", time: "14:32", amount: "+$120.00", kind: "topup" },
  { id: "t2", day: "TODAY", label: "Sent to ····4492", time: "11:05", amount: "−$25.00", kind: "sent" },
  { id: "t3", day: "TODAY", label: "Received from ····8810", time: "09:41", amount: "+$60.00", kind: "received" },
  { id: "y1", day: "YESTERDAY", label: "Top-up · E-BESA", time: "18:12", amount: "+$250.00", kind: "topup" },
  { id: "y2", day: "YESTERDAY", label: "Merchant · QR #A-2210", time: "13:27", amount: "−$8.40", kind: "sent" },
  { id: "y3", day: "YESTERDAY", label: "Top-up · MY-CASH", time: "10:03", amount: "+$45.00", kind: "topup" },
];

const FILTERS: Filter[] = ["ALL", "SENT", "RECEIVED", "TOP-UPS"];

const KIND_ICON = {
  sent: ArrowUpRight,
  received: ArrowDownLeft,
  topup: PlusCircle,
};

function matches(tx: Tx, f: Filter) {
  if (f === "ALL") return true;
  if (f === "SENT") return tx.kind === "sent";
  if (f === "RECEIVED") return tx.kind === "received";
  return tx.kind === "topup";
}

export default function Activity() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const days: ("TODAY" | "YESTERDAY")[] = ["TODAY", "YESTERDAY"];

  return (
    <section className="bg-ink-0 py-24 lg:py-28">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="eyebrow text-teal">Activity &amp; Receipts</p>
          <h3 className="mt-4 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-txt lg:text-4xl">
            Every transaction, provable.
          </h3>
          <p className="mt-5 max-w-[480px] text-lg leading-[1.6] text-txt-sub">
            Timeline grouped by day, powerful filters, PDF receipts on demand, and a dispute flow
            that reaches a human.
          </p>
          <div className="mt-8 flex items-center gap-3 font-mono text-[12px] tracking-[0.06em] text-txt-ter">
            <FileText className="h-4 w-4 text-teal" strokeWidth={1.5} />
            PDF RECEIPTS · HASHED &amp; TIMESTAMPED
          </div>
        </motion.div>

        {/* Timeline mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-xl border border-ink-4/60 bg-ink-1 p-5 shadow-teal-edge"
        >
          {/* filter chips */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`cursor-pointer rounded-md border px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] transition-colors duration-200 ${
                  filter === f
                    ? "border-teal bg-teal/10 text-teal"
                    : "border-ink-4/60 text-txt-ter hover:border-teal/50 hover:text-txt-sub"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-5">
            {days.map((day) => (
              <div key={day}>
                <p className="font-mono text-[11px] tracking-[0.12em] text-txt-ter">{day}</p>
                <div className="mt-2">
                  <AnimatePresence initial={false}>
                    {TXS.filter((t) => t.day === day && matches(t, filter)).map((t, i) => {
                      const Icon = KIND_ICON[t.kind];
                      const incoming = t.kind !== "sent";
                      return (
                        <motion.div
                          key={t.id}
                          layout="position"
                          initial={{ height: 0, opacity: 0, y: -16 }}
                          whileInView={{ height: "auto", opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.1 }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: { duration: 0.3, ease: EASE, delay: 0 },
                          }}
                          transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-3 border-b border-white/[0.05] py-3">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                incoming ? "bg-success/10" : "bg-ink-3"
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 ${incoming ? "text-success" : "text-txt-sub"}`}
                                strokeWidth={1.5}
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[14px] text-txt">{t.label}</p>
                              <p className="tabular font-mono text-[11px] text-txt-ter">{t.time}</p>
                            </div>
                            <p
                              className={`tabular font-mono text-[14px] ${
                                incoming ? "text-success" : "text-txt"
                              }`}
                            >
                              {t.amount}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
